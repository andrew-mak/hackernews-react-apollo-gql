async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
      OR: [
        { description: { contains: args.filter } },
        { url: { contains: args.filter } }
      ]
    }
    : {};

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy
  });

  // const count = await context.prisma.link.count({ where });
  console.log('SKIP: ', args.skip, ' Links: ', links.length);

  // let queryId = `main-feed-Take:${args.take}-Skip:${args.skip}->${links.length}`;
  // let queryId = `main-feed`;
  // if (args.take > 50) queryId = `top-feed-Take:${args.take}->${links.length}`;

  // return {
  //   id: queryId,
  //   links,
  //   count
  // };
  return [...links]
}

module.exports = {
  feed
};
