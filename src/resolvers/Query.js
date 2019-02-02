const Query = {
  users(parent, args, { prisma }) {
    const opArgs = {}
    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
          {
            email_contains: args.query,
          },
        ],
      }
    }
    return prisma.query.users(opArgs)
  },
  posts(parent, args, { prisma }) {
    const opArgs = {}
    if (args.query) {
      opArgs.where = {
        AND: [
          {
            title_contains: args.query,
          },
          {
            body_contains: args.query,
          },
        ],
      }
    }
    return prisma.query.posts(opArgs)
  },
  comments(parent, args, { prisma }) {
    return prisma.query.comments(null)
  },
}

export { Query as default }
