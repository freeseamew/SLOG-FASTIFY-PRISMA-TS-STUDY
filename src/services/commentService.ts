import db from '../lib/db'
import { getCurrentDate } from '../lib/timeHelper'
import { ERROR_MESSAGE } from '../lib/constants'
import { TComment } from '../schema/types'

function commentService() {
  const createComment = async (articleId: number, content: string, userId: number, userEmail: string) => {
    const values = {
      content: content,
      userId: userId,
      articleId: articleId,
      createdAt: getCurrentDate(),
    }

    try {
      const result = await db.comment.create({
        data: values
      })

      const newComment = {
        ...result,
        'userId' : userId,
        'userEmail' : userEmail,
      }

      await db.article.update({
        where: {
          id: articleId,
        },
        data:{
          commentCount: {increment: 1}
        }
      })

      return newComment
    }
    catch(error) {
      throw error
    }
  }

  const readComment = async (articleId: number) => {
    try {
      const comments = await db.comment.findMany({
        where: {
          articleId: articleId,
        },
        include: {
          user: {
            select: {
              id: true, 
              email: true,
            }
          }
        }
      })
      
      let flattenComments:TComment[] = comments.map(comment => {
        return {
          ...comment,
          userEmail: comment.user.email,
          createdAt: comment.createdAt.toString(),
        }
      })

      return {
        comments: flattenComments
      }
    }
    catch(error) {
      throw error
    }
  }

  const deleteComment = async (articleId: number, commentId: number, userId: number) => {
    try {

      const result = await db.comment.delete({
        where: {
          id: commentId
        }
      })

      await db.article.update({
        where: {
          id: articleId
        },
        data: {
          commentCount: {decrement: 1}
        }
      })

      return {
        commentId: result.id
      }
      
    }
    catch(error) {
      throw error
    }
  }

  return {
    createComment,
    readComment,
    deleteComment,
  }
}

export default commentService()