const {forwardTo} = require('prisma-binding');
const {hasPermission} = require('../utils');


const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    
    me(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            return null;
        }

        return ctx.db.query.user({
            where: {id: ctx.request.userId}
        }, info);
    },

    users(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to proceed!');
        }

        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

        return ctx.db.query.users({}, info);
    },
    async order(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in!');
        }

        const order = await ctx.db.query.order({
            where: {id: args.id}
        }, info);

        const ownsOrder = order.user.id === ctx.request.userId;
        const canSeeOrder = ctx.request.user.permissions.includes('ADMIN');

        if (!canSeeOrder || !ownsOrder) {
            throw new Error('You do not have sufficient permissions to do that!');            
        }

        return order;
    }
};

module.exports = Query;
