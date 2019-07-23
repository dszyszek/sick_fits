const Query = {
    async items(paremt, args, ctx, info) {
        const items = await ctx.db.query.item();
        return items;
    }
};

module.exports = Query;
