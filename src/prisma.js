import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
})

export { prisma as default }

// prisma.query
//   .users(null, '{ id name email posts { id title } }')
//   .then(data => console.log(JSON.stringify(data, undefined, 2)))
//   .catch(err => console.log(err))

// prisma.query
//   .comments(null, '{ id comment post { id title body }  author { id name email } }')
//   .then(data => console.log(JSON.stringify(data, undefined, 2)))
//   .catch(err => console.log(err))

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: 'Fuck Yeah',
//         body: 'You can fuck me bae !',
//         published: true,
//         author: {
//           connect: {
//             id: 'cjqam2zop001t0723spjxqyyv',
//           },
//         },
//       },
//     },
//     '{ id title body published }',
//   )
//   .then(data => {
//     console.log(data)
//     return prisma.query.posts(null, '{ id title body published }')
//   })
//   .then(data => console.log(JSON.stringify(data, undefined, 2)))
//   .catch(err => console.log(err))

// prisma.mutation
//   .updatePost(
//     {
//       where: {
//         id: 'cjqann2x4001z0723afzfxest',
//       },
//       data: {
//         body: 'Cai dit me may !',
//       },
//     },
//     '{ id title body }',
//   )
//   .then(data => {
//     console.log(data)
//     return prisma.query.posts(null, ' { id title body published } ')
//   })
//   .then(data => console.log(JSON.stringify(data, undefined, 2)))
//   .catch(err => console.log(err))

// const createPostForUser = async (authorID, data) => {
//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorID,
//           },
//         },
//       },
//     },
//     '{ id }',
//   )
//   const user = await prisma.query.user(
//     {
//       where: {
//         id: authorID,
//       },
//     },
//     '{ id name email posts { id title body published } }',
//   )
//   return user
// }

// createPostForUser('cjqam2zop001t0723spjxqyyv', {
//   title: 'Hello bae',
//   body: 'Quẩy lên ae ơi !',
//   published: true,
// }).then(user => {
//   console.log(JSON.stringify(user, undefined, 2))
// })

// const updatePostForUser = async (postID, data) => {
//   const existedPost = await prisma.exists.Post({
//     id: postID,
//   })
//   if (!existedPost) {
//     throw new Error('Post not found !')
//   }

//   const postUpdate = await prisma.mutation.updatePost(
//     {
//       where: {
//         id: postID,
//       },
//       data,
//     },
//     '{ author { id name } }',
//   )
//   return postUpdate.author
// }

// updatePostForUser('2', {
//   title: 'Update post lần 3 nè',
//   body: 'Đậu má Việt Nam',
//   published: false,
// })
//   .then(users => {
//     console.log(JSON.stringify(users, undefined, 2))
//   })
//   .catch(err => console.log(err.message))
