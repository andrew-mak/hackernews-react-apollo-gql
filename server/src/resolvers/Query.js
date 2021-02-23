async function feed(_, args, context) {

  let cursor = undefined;
  if (args.cursor) cursor = { id: parseInt(args.cursor) };

  const links = await context.prisma.link.findMany({
    take: (0 - args.take),
    cursor: cursor,
    orderBy: { id: 'asc' }
  });

  console.log('SKIP: ', args.cursor, ' Links: ', links.length);

  return {
    cursor: links[0].id,
    links: links.reverse(),
  };

}

async function subfeed(_, args, context) {
  let links = null;
  if (args.filter) {
    const where = args.filter
      ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } }
        ]
      }
      : {};
    links = await context.prisma.link.findMany({
      where,
      orderBy: { id: 'asc' }
    });
  }
  else if (args.take) {
    links = await context.prisma.link.findMany({
      take: (0 - args.take),
      orderBy: { id: 'asc' }
    });
  };

  console.log('filter: ', args.filter, ' Links: ', links.length);

  return links
}

module.exports = {
  feed, subfeed
};
