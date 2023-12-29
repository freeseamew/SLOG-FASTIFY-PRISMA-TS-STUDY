import { Type } from '@sinclair/typebox'

const articleSchema = Type.Object({
  id: Type.Number(),
  content: Type.String(),
  likeCount: Type.Number(),
  commentCount: Type.Number(),
  userId: Type.Number(),
  userEmail: Type.Optional(Type.String()),
  likeMe: Type.Optional(Type.Boolean()),
	createdAt: Type.String(),
})

const commonHeadersSchema = Type.Object({
  authorization: Type.Optional(Type.String())
})

const commonBodySchema = Type.Object({
  articleId : Type.Number(),
  content: Type.String(),
})

const commonParamSchema = Type.Object({
  articleId: Type.Number()
})

const commonQuerySchema = Type.Object({
  pageNumber: Type.Optional(Type.Number()),
  mode:  Type.Optional(Type.String()),
})

const commonPagenationSchema = Type.Object({
  totalPageCount: Type.Number(),
  articleList: Type.Array(articleSchema)        
})

export {
  commonHeadersSchema,
  articleSchema,	
  commonBodySchema,  
  commonParamSchema,  
  commonQuerySchema,
  commonPagenationSchema,  
}