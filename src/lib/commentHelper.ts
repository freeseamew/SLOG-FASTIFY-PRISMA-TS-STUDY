import db from '../lib/db'
import { FastifyReply, FastifyRequest } from 'fastify'
import { TCommentDeleteBody } from '../schema/types'
import { handleError } from '../lib/errorHelper'
import { ERROR_MESSAGE } from './constants'

const compareCommentUser = async (commentId: number, userId: number) => {
  let result = false

  try {
    const comment = await db.comment.findUnique({
      where: {
        id: commentId
      },
      select: {
        userId: true
      }
    })

    if(comment) {
      result = comment.userId === userId ? true : false 
    }
      
    return result
  }
  catch(error) {
    return false
  }
}

const verifyCommentUser = async (req: FastifyRequest<{Body: TCommentDeleteBody}>, rep: FastifyReply) => {
  const { commentId } = req.body
  const userId = req.user!.id

  const result = await compareCommentUser(commentId, userId)
  if(!result) handleError(rep, ERROR_MESSAGE.forbidden)
  return
}

export {
  verifyCommentUser,
}