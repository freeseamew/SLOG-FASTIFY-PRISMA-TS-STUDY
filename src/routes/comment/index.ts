import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { verifySignIn } from '../../lib/authHelper'
import { verifyCommentUser } from '../../lib/commentHelper'
import { createCommentSchema, readCommentSchema, deleteCommentSchema } from '../../schema'
// import { TCommonHeaders, TCommonBody, TCommonParam, TCommentDeleteBody } from '../../schema/types'
// import { handleError } from '../../lib/errorHelper' 
// import { ERROR_MESSAGE } from '../../lib/constants'
// import commentService from '../../services/commentService'

import commentController from '../../controller/commentController'

const commentRoute = async ( fastify: FastifyInstance) => {

	fastify.route({
    method: 'POST',
    schema: createCommentSchema,
    url: '/',
    preHandler: [verifySignIn],
    handler: commentController.createComment
    // handler: async (req: FastifyRequest<{Headers: TCommonHeaders, Body: TCommonBody}>, rep: FastifyReply) => {
		// 	const { articleId, content } = req.body
    //   const userId = req.user!.id
    //   const userEmail = req.user!.email
      
    //   try {
    //     const result = await commentService.createComment(articleId, content, userId, userEmail)
    //     rep.status(200).send(result)
    //   }
    //   catch(error) {
    //     handleError(rep, ERROR_MESSAGE.badRequest, error)
    //   }
    // }
  })

	fastify.route({
    method: 'GET',
    schema: readCommentSchema,
    url: '/:articleId',
    handler: commentController.readComment
    // handler: async (req: FastifyRequest<{Headers: TCommonHeaders, Params: TCommonParam}>, rep: FastifyReply) => {
		// 	const { articleId } = req.params

    //   try {
    //     const result = await commentService.readComment(articleId)
    //     rep.status(200).send(result)
    //   }
    //   catch(error) {
    //     handleError(rep, ERROR_MESSAGE.badRequest, error)
    //   }
    // }
  })

	fastify.route({
    method: 'DELETE',
    schema: deleteCommentSchema,
    url: '/',
    preHandler: [verifySignIn, verifyCommentUser],
    handler: commentController.deleteComment
    // handler: async (req: FastifyRequest<{Headers: TCommonHeaders, Body: TCommentDeleteBody}>, rep: FastifyReply) => {
		// 	const { articleId, commentId } = req.body
    //   const userId = req.user!.id

    //   try {
    //     const result = await commentService.deleteComment(articleId, commentId, userId)
    //     rep.status(200).send(result)
    //   }
    //   catch(error) {
    //     handleError(rep, ERROR_MESSAGE.badRequest, error)
    //   }
    // }
  })
}

export default commentRoute