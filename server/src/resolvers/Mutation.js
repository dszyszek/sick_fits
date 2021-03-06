const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {randomBytes} = require('crypto');
const {promisify} = require('util');
const {transport, makeEmail} = require('../mail');
const {hasPermission} = require('../utils');
const stripe = require('../stripe');

const mutations = {

    async createItem(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to add an item.');
        }

        const item = await ctx.db.mutation.createItem({
            data: {
                user: {
                    connect: {
                        id: ctx.request.userId
                    }
                },
                ...args
            }
        }, info);

        return item;
    },

    updateItem(parent, args, ctx, info) {
        const updates = {...args};
        delete updates.id;
        
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }, info
        });
    },

    async deleteItem(parent, args, ctx, info) {
        const where = {id: args.id};
        const item = await ctx.db.query.item({where}, `{id title user {id}}`);

        const ownsItem = item.user.id === ctx.request.userId;
        const hasPermissions = ctx.request.user.permissions.some(
            permission => ['ADMIN', 'ITEMDELETE'].includes(permission)
        );

        if (ownsItem || hasPermissions) {
            
            return ctx.db.mutation.deleteItem({where}, info);
        }
        throw new Error('You do not have proper permissions to delete taht item!');
    },

    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        const password = await bcrypt.hash(args.password, 10);

        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: {set: ['USER']}
            }
        }, info);

        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000*60*60*24*365
        });
        return user;
    },

    async signin(parent, {email, password}, ctx, info) {
        const user = await ctx.db.query.user({where: {email}});

        if (!user) {
            throw new Error('Wrong email or password');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new Error('Wrong email or password');
        }

        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);

        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        });

        return user;
    },
    
    signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return {message: 'Successfully logged out.'}
    },

    async requestReset(parent, {email}, ctx, info) {
        const user = await ctx.db.query.user({where: {email}});

        if (!user) {
            throw new Error('No such user');
        }
        const randomBytesWithPromisify = promisify(randomBytes);
        const resetToken = (await randomBytesWithPromisify(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 1000 * 3600; // 1h
        const res = await ctx.db.mutation.updateUser({
            where: {email},
            data: {resetToken, resetTokenExpiry}
        });


        const mailRes = await transport.sendMail({
            from: 'd@email.com',
            to: email,
            subject: 'Your password reset',
            html: makeEmail(`Your password reset token is: 
                <a href='${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}'>HERE!</a>`)
        });

        return {message: 'Token has been reset'};
    },

    async resetPassword(parent, {resetToken, password, confirmPassword}, ctx, info) {
       if (password !== confirmPassword) {
            throw new Error('Passwords don\'t match');
       } 

       const [user] = await ctx.db.query.users({
           where: {
               resetToken,
               resetTokenExpiry_gte: Date.now() - 3600 * 1000
            }
        });

       if (!user) {
           throw new Error('Token is not valid or expired');
       }
       const hashedPassword = await bcrypt.hash(password, 10);
       const updatedUser = await ctx.db.mutation.updateUser({
           where: {email: user.email},
           data: {
               password: hashedPassword,
               resetToken: null,
               resetTokenExpiry: null

           }
        });

        const token = jwt.sign({userId: updatedUser.id}, process.env.APP_SECRET);
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 100 * 60 * 60 * 24 * 365
        });

        return updatedUser;
    },

    async updatePermissions(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in!');
        }

        const currentUser = await ctx.db.query.user({
            where: {
                id: ctx.request.userId
            }
        }, info);

        hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

        return ctx.db.mutation.updateUser({
            data: {
                permissions: {
                    set: args.permissions
                }
            },
            where: {
                id: args.userId
            },
        }, info);
    },

    async addToCart(parent, args, ctx, info) {
        const {userId} = ctx.request;

        if (!userId) {
            throw new Error('You must be logged in!');
        }

        const [existingCartItem] = await ctx.db.query.cartItems({
            where: {
                user: {id: userId},
                item: {id: args.id}
            }
        });
        
        if (existingCartItem) {
            console.log('This item is already in the cart');

            return ctx.db.mutation.updateCartItem({
                where: {
                    id: existingCartItem.id
                },
                data: {quantity: existingCartItem.quantity + 1}
            }, info);
        }

        return ctx.db.mutation.createCartItem({
            data: {
                user: {
                    connect: {id: userId}
                },
                item: {
                    connect: {id: args.id}
                }
            }
        }, info);
    },

    async removeFromCart(parent, args, ctx, info) {
        const cartItem = await ctx.db.query.cartItem({
            where: {
                id: args.id
            }
        }, `{id, user {id}}`);

        if (!cartItem) throw new Error('No cart item found!');

        if (cartItem.user.id !== ctx.request.userId) {
            throw new Error('Do not cheat!');
        }

        return ctx.db.mutation.deleteCartItem({
            where: {id: args.id}
        }, info);
    },

    async createOrder(parent, args, ctx, info) {
        const {userId} = ctx.request;
        if (!userId) throw new Error('You must be signed in!');

        const user = await ctx.db.query.user(
            {where: {id: userId}}, 
                `{
                    id 
                    name 
                    email 
                    cart {
                        id 
                        quantity 
                        item {
                            title 
                            price 
                            id 
                            description 
                            image
                            largeImage
                            }
                        }
                }`
            );
        const amount = user.cart.reduce((current, next) => current + next.item.price * next.quantity, 0);

        const charge = await stripe.charges.create({
            amount,
            currency: 'USD',
            source: args.token
        });

        const orderItems = user.cart.map(item => {
            const orderItem = {
                ...item.item,
                quantity: item.quantity,
                user: {connect: {id: userId}}
            };

            delete orderItem.id;
            return orderItem;
        });

        const order = await ctx.db.mutation.createOrder({
            data: {
                total: charge.amount,
                charge: charge.id,
                items: {create: orderItems},
                user: {connect: {id: userId}}
            }
        });

        const cartItemIDs = user.cart.map(item => item.id);

        await ctx.db.mutation.deleteManyCartItems({where: {id_in: cartItemIDs}});

        return order;
    }

};

module.exports = mutations;
