const {forwardTo} = require('prisma-binding');
const {hasPermissions} = require('../utils');


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

        hasPermissions(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

        return ctx.db.users({}, info);
    }
};

module.exports = Query;
