import { Type } from '@sinclair/typebox'
import { commonHeadersSchema, commonBodySchema, commonParamSchema } from './commonSchema'

const headers = commonHeadersSchema
const body = commonBodySchema
const params = commonParamSchema

const commentSchema = Type.Object({
  id: Type.Number(),
  articleId: Type.Number(),
  content: Type.String(),
  createdAt: Type.String(),
  userId: Type.Number(),
  userEmail: Type.String(),
}) 

const commentDeleteBodySchema = Type.Object({
  articleId : Type.Number(),
  commentId: Type.Number(),
})

const createCommentSchema = {
  headers,
  body,
  response: {
    200: commentSchema
  }
}

const readCommentSchema = {
  params,
  response: {
    200: Type.Object({ 
      comments: Type.Array(commentSchema)
    }) 
  }
}

const deleteCommentSchema = {
  headers,
	body: commentDeleteBodySchema,
  response: {
    200: Type.Object({
      commentId: Type.Number(),
    })
  }
}

export {
	commentSchema,
  commentDeleteBodySchema,
  createCommentSchema,
  readCommentSchema,
  deleteCommentSchema,
}