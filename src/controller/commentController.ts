import { FastifyRequest, FastifyReply } from 'fastify'
import { TCommonHeaders, TCommonBody, TCommonParam, TCommentDeleteBody  } from '../schema/types'
import commentService from '../services/commentService'
import { handleError } from '../lib/errorHelper'
import { ERROR_MESSAGE } from '../lib/constants'

function commentController() {
  const createComment = async (req: FastifyRequest<{Headers: TCommonHeaders, Body: TCommonBody}>, rep: FastifyReply) => {
    const { articleId, content } = req.body
    const userId = req.user!.id
    const userEmail = req.user!.email
    
    try {
      const result = await commentService.createComment(articleId, content, userId, userEmail)
      rep.status(200).send(result)
    }
    catch(error) {
      handleError(rep, ERROR_MESSAGE.badRequest, error)
    }
  }

  const readComment = async (req: FastifyRequest<{Headers: TCommonHeaders, Params: TCommonParam}>, rep: FastifyReply) => {
    const { articleId } = req.params

    try {
      const result = await commentService.readComment(articleId)
      rep.status(200).send(result)
    }
    catch(error) {
      handleError(rep, ERROR_MESSAGE.badRequest, error)
    }
  }

  const deleteComment = async (req: FastifyRequest<{Headers: TCommonHeaders, Body: TCommentDeleteBody}>, rep: FastifyReply) => {
    const { articleId, commentId } = req.body
    const userId = req.user!.id

    try {
      const result = await commentService.deleteComment(articleId, commentId, userId)
      rep.status(200).send(result)
    }
    catch(error) {
      handleError(rep, ERROR_MESSAGE.badRequest, error)
    }
  }

  return {
    createComment,
    readComment,
    deleteComment,
  }
}

export default commentController()