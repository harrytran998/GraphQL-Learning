import { GraphQLServer } from 'graphql-yoga'
import { v4 } from 'uuid'

const users = [
  {
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
  },
]

const posts = [
  {
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '1',
  },
  {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1',
  },
  {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: false,
    author: '2',
  },
]

const comments = [
  {
    id: '102',
    text: 'This worked well for me. Thanks!',
    author: '3',
    post: '10',
  },
  {
    id: '103',
    text: 'Glad you enjoyed it.',
    author: '1',
    post: '10',
  },
  {
    id: '104',
    text: 'This did no work.',
    author: '2',
    post: '11',
  },
  {
    id: '105',
    text: 'Nevermind. I got it to work.',
    author: '1',
    post: '11',
  },
]

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
        post: Post!
    }
  
    type Mutation {
      createUser( input: createUserInput ): User!
      createPost( input: createPostInput ): Post!
      createComment( input: createCommentInput ): Comment!
    }

    input createUserInput {
      name: String!
      email: String!
      age: Int
    }

    input createPostInput {
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    }

    input createCommentInput {
      text: String!
      author: ID!
      post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
const resolvers = {
  Query: {
    users(_, args) {
      if (!args.query) {
        return users
      }

      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(_, args) {
      if (!args.query) {
        return posts
      }

      return posts.filter(post => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch && isBodyMatch
      })
    },
    comments(_, args) {
      if (!args.query) {
        return comments
      }

      return comments.filter(comment => {
        return comment.text.toLocaleLowerCase().includes(args.query.toLowerCase())
      })
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com',
      }
    },
    post() {
      return {
        id: '092',
        title: 'GraphQL 101',
        body: '',
        published: false,
      }
    },
  },
  Mutation: {
    createUser(_, args) {
      const emailTaken = users.some(user => user.email === args.input.email)
      if (emailTaken) {
        throw new Error('Email taken')
      }

      const user = {
        id: v4(),
        ...args.input,
      }
      users.push(user)
      return user
    },
    createPost(_, args) {
      const userExited = users.some(user => user.id === args.input.id)
      if (!userExited) {
        throw new Error('User not existed !')
      }

      const post = {
        id: v4(),
        ...args.input,
      }
      posts.push(post)
      return post
    },
    createComment(_, args) {
      const userExited = users.some(user => user.id === args.input.id)
      const postExited = posts.some(post => post.id === args.input.id)

      if (!userExited && !postExited) {
        throw new Error('User not existed !')
      }

      const comment = {
        ...args.input,
      }

      comments.push(comment)
      return comment
    },
  },
  Post: {
    author(parent) {
      return users.find(user => {
        return user.id === parent.author
      })
    },
    comments(parent) {
      return comments.filter(comment => {
        return comment.post === parent.id
      })
    },
  },
  Comment: {
    author(parent) {
      return users.find(user => {
        return user.id === parent.author
      })
    },
    post(parent) {
      return posts.find(post => {
        return post.id === parent.post
      })
    },
  },
  User: {
    posts(parent) {
      return posts.filter(post => {
        return post.author === parent.id
      })
    },
    comments(parent) {
      return comments.filter(comment => {
        return comment.author === parent.id
      })
    },
  },
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => {
  console.log('The server is up!')
})
