import db from '../lib/db'
import { TArticle, TCommonPagenation } from '../schema/types'
import { getCurrentDate } from '../lib/timeHelper'
import { ERROR_MESSAGE, CATEGORY_TYPE } from '../lib/constants'
import { verifyArticleUser, likeCompareArticles } from '../lib/articleHelper'

function articleService() {
	const createArticle = async (id:number, email:string, content:string) => {
    
    try {
  
      const values = {
        content: content,
        userId: id,
				createdAt: getCurrentDate()
      }

			const result = await db.article.create({
        data: values
      })
  
			const returnValue:TArticle = {
        ...result, 
        userEmail: email,
        likeMe: false,
        createdAt: result.createdAt.toString()
      }
      
      return returnValue
    }
    catch(error) {
      throw error
    }
  }

	const updateArticle = async (articleId: number, content: string, userId: number, email: string) => {
  
    try {
      const checkVerifyUser = await verifyArticleUser(articleId, userId)
  
      if(checkVerifyUser) {
        const result = await db.article.update({
          where: {
            id: articleId,
          },
          data: {
            content: content,
          }
        })
    
				const returnValue:TArticle = {
	        ...result, 
	        userEmail: email,
	        likeMe: false,
	        createdAt: result.createdAt.toString()
	      }
        
        return returnValue
      }
      else {
        throw ERROR_MESSAGE.badRequest
      }
    }
    catch(error) {
      throw error
    }
  }

	const deleteArticle = async (articleId: number, userId: number ) => {
  
    try {
      const checkVerifyUser = await verifyArticleUser(articleId, userId)
  
      if(checkVerifyUser) {
    
        const result = await db.article.delete({
          where: {
            id: articleId
          }
        })
        
        return result
      }
      else {
        throw ERROR_MESSAGE.badRequest
      }
    }
    catch(error) {
      throw error
    }
  }  

	const readArticleOne = async ( articleId: number ) => {
    
    try {
      const articleOne = await db.article.findUnique({
        where : {
          id: articleId
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            }
          }
        },        
      })
  
			let returnValue:TArticle | {}
  
      if(articleOne) {
        returnValue = {
          ...articleOne, 
          userEmail: articleOne.user.email,
          likeMe: false,
          createdAt: articleOne.createdAt.toString()
        }
      }
      else {
        returnValue = {}
      }
  
      return returnValue
    }
    catch(error) {
      throw error
    }
  }

	const readArticlesList = async (pageNumber: number, mode: string, userId?: number) => {
  
    const pageSize = 10
    let skip = 0
  
    if(pageNumber > 1) skip = ((pageNumber - 1) * pageSize)
  
    let _where = {}

    if(mode === CATEGORY_TYPE.MY ) {
      _where = {userId: userId}
    }    
  
    try {
      const articles = await db.article.findMany({
        where : _where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
            }
          }
        },        
        orderBy: {
          id: 'desc',
        },
        skip: skip,
        take: pageSize,      
      })
  
      const totalArticleCount = await db.article.count({
        where: _where
      })  
  
      let totalPageCount = Math.ceil(totalArticleCount / pageSize)
      
			let flattenArticles:TArticle[] = articles.map(article => {
        return {
          ...article,
          userEmail: article.user.email,
					likeMe: false,
          createdAt: article.createdAt.toString()
        }
      })

			let returnArticles:TArticle[]
      
      if(userId) {
        returnArticles = await likeCompareArticles([...flattenArticles], userId)
      }
      else {
        returnArticles = [...flattenArticles]
      }

      const returnValue:TCommonPagenation = {
        totalPageCount: totalPageCount,
        articleList: returnArticles,
      }
  
      return returnValue
    }
    catch(error) {
      throw error
    }
  }  

	return {
		createArticle,
		updateArticle,
    deleteArticle,
		readArticleOne,
    readArticlesList,    
	}
}

export default articleService()