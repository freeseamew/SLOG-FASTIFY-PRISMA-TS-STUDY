import db from '../lib/db'
import { ERROR_MESSAGE } from '../lib/constants'
import { TArticle } from '../schema/types'

function likeService() {

	const addLike = async (articleId: number, userId: number) => {

    const values = {
      userId: userId,
      articleId: articleId,
    }
  
    try {
      const likeCheck = await db.like.count({
        where: {
          userId: userId,
          articleId: articleId,
        }
      })
  
      if(likeCheck === 0) {
        await db.like.create({
          data:values,
        })
  
        await db.article.update({
          where: {
            id: articleId,
          },
          data: {
            likeCount: {increment: 1}
          }
        })
  
        return true
      }
      else {
        throw ERROR_MESSAGE.likeAddError
      }
    }
    catch(error) {
      throw error
    }
  }

	const cancelLike = async (articleId: number, userId: number) => {
  
    try {
      const likeCheck = await db.like.count({
        where: {
          userId: userId,
          articleId: articleId,
        }
      })
  
      if(likeCheck > 0) {
        await db.like.deleteMany({
          where: {
            userId: userId,
            articleId: articleId,
          }
        })
  
        await db.article.update({
          where: {
            id: articleId,
          },
          data: {
            likeCount: {decrement: 1}
          },
        })
        
        return true
      }
      else {
        throw ERROR_MESSAGE.likeCancelError
      }
    }
    catch(error) {
      throw error
    }
  }

	const readLikes = async (pageNumber: number, userId: number) => {
  
    const pageSize = 10
    let skip = 0
  
    if(pageNumber > 1) skip = ((pageNumber -1) * pageSize)
  
    try {
      const likeArticles = await db.like.findMany({
        where: {
          userId: userId,
        },
        include: {
          article: {
            select: {
              id: true,
              content: true,
              commentCount: true,
              likeCount: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  email: true,
                }
              }
            }
          }
        },
        orderBy: {
          id: 'desc'
        },
        skip: skip,
        take: pageSize,
      })
  
      const totalLikeCount = await db.like.count({
        where: {
          userId: userId,
        },
      })
  
      const totalPageCount = Math.ceil(totalLikeCount / pageSize)
      
			let flattenArticles:TArticle[] = likeArticles.map(like => {
        return {
          ...like.article,
          createdAt: like.article.createdAt.toString(),
          userId: like.article.user.id,
          userEmail: like.article.user.email,        
          likeMe: true,
        }
      })     
  
      return {
        totalPageCount: totalPageCount, 
        articleList: flattenArticles
      }
    }
    catch(error) {   
      throw error
    }
  }

	return {
    addLike,
    cancelLike,
    readLikes,
  }
}

export default likeService()