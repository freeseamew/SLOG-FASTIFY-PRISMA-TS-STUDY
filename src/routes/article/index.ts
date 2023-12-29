import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { createArticleSchema, updateArticleSchema, deleteArticleSchema, readArticlesSchema, readArticleOneSchema } from '../../schema'
import { TCommonHeaders, TCommonBody, TCommonParam, TCommonQuery } from '../../schema/types'
import { handleError } from '../../lib/errorHelper'
import { ERROR_MESSAGE, CATEGORY_TYPE } from '../../lib/constants'
import articleService from '../../services/articleService'
import { verifySignIn } from '../../lib/authHelper'

const articleRoute = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    schema: createArticleSchema,
    url: '/',
    preHandler: [verifySignIn],
    handler: async (req:FastifyRequest<{Headers: TCommonHeaders, Body: TCommonBody}>, rep: FastifyReply) => {
      const { content } = req.body
      const userId = req.user!.id
      const email = req.user!.email

      try {
        const result = await articleService.createArticle(userId, email, content)
        rep.status(200).send(result)
      }
      catch(error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)         
      }
    }
  })

  fastify.route({
    method: 'PUT', 
    url: '/',
    schema: updateArticleSchema,
    preHandler: [verifySignIn],
    handler: async (req: FastifyRequest<{Headers: TCommonHeaders,Body: TCommonBody }>, rep: FastifyReply) => {
      const { articleId, content } = req.body
      const userId = req.user!.id
      const email = req.user!.email

      try {
        const result = await articleService.updateArticle(articleId, content, userId, email)
        rep.status(200).send(result)
      }
      catch(error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)      
      }
    }
  })

  fastify.route({
    method: 'DELETE',
    url: '/:articleId',
    schema: deleteArticleSchema,
    preHandler: [verifySignIn],
    handler: async (req: FastifyRequest<{Headers: TCommonHeaders, Params: TCommonParam}>, rep: FastifyReply) => {
      const { articleId } = req.params
      const userId = req.user!.id

      try {
        const result = await articleService.deleteArticle(Number(articleId), userId)
        rep.status(200).send(result)
      }
      catch(error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)
      }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/:articleId',
    schema: readArticleOneSchema,
    handler: async (req: FastifyRequest<{Params: TCommonParam}>, rep: FastifyReply) => {
      const { articleId } = req.params

      try {
        const result = await articleService.readArticleOne(Number(articleId))
        rep.status(200).send(result)
      }
      catch(error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)      
      }
    }
  })

  fastify.route({
    method: 'GET',
    url:'/',
    schema: readArticlesSchema,
    handler: async (req:FastifyRequest<{Headers: TCommonHeaders, Querystring: TCommonQuery}>, rep: FastifyReply) => {
      const { pageNumber = 0, mode = CATEGORY_TYPE.ALL } = req.query
      const userId = req.user?.id

      try {
        const result = await articleService.readArticlesList(pageNumber, mode, userId)
        rep.status(200).send(result)
      }
      catch(error) {
        handleError(rep, ERROR_MESSAGE.badRequest, error)
      }
    }
  })   
}

export default articleRoute