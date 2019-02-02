import uuidv4 from 'uuid/v4'

const Mutation = {
  async createUser(parent, args, { prisma }) {
    const emailTaken = await prisma.exists.User({ email: args.data.email })
    if (emailTaken) {
      throw new Error('Email taken')
    }
    return await prisma.mutation.createUser({
      data: args.data,
    })
  },
  async deleteUser(parent, args, { prisma }) {
    const userID = args.id
    const userExisted = await prisma.exists.User({
      id: userID,
    })
    if (!userExisted) {
      throw new Error('User not found !')
    }
    return prisma.mutation.deleteUser({
      where: {
        id: userID,
      },
    })
  },
  async updateUser(parent, args, { prisma }) {
    const { id, data } = args
    const userExisted = await prisma.exists.User({ id })
    if (!userExisted) {
      throw new Error('User not found !')
    }
    return prisma.mutation.updateUser({
      where: {
        id,
      },
      data,
    })
  },
  /*
  Post
   */
  async createPost(parent, args, { prisma }, info) {
    const post = {
      title: args.title,
      body: args.body,
      published: args.published,
      author: {
        connect: {
          id: args.author,
        },
      },
    }
    return prisma.mutation.createPost({ data: post }, info)
  },
  async deletePost(parent, args, { prisma }) {
    const postExists = await prisma.mutation.Posts({ id: args.id })
    if (postExists) {
      throw new Error('Same ID post')
    }
    return prisma.mutation.deletePost({
      where: {
        id: args.id,
      },
    })
  },
  async updatePost(parent, args, { prisma }) {
    const { id, data } = args
    const postExists = await prisma.mutation.Posts({ id })
    if (postExists) {
      throw new Error('Same ID post')
    }
    return prisma.mutation.updatePost({
      where: {
        id,
      },
      data,
    })
  },
  createComment(parent, args, { db, pubsub }) {
    const userExists = db.users.some(user => user.id === args.data.author)
    const postExists = db.posts.some(post => post.id === args.data.post && post.published)

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post')
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    }

    db.comments.push(comment)
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      },
    })

    return comment
  },
  deleteComment(parent, args, { db, pubsub }) {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.id)

    if (commentIndex === -1) {
      throw new Error('Comment not found')
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1)

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment,
      },
    })

    return deletedComment
  },
  updateComment(parent, args, { db, pubsub }) {
    const { id, data } = args
    const comment = db.comments.find(comment => comment.id === id)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      comment.text = data.text
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      },
    })
    return comment
  },
}

export { Mutation as default }
