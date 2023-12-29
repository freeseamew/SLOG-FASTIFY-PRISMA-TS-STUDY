import db from './db'
import { TArticle } from '../schema/types'

const verifyArticleUser = async ( articleId:number, userId: number) => {
  
  let result = false

  try {
    const article = await db.article.findUnique({
      where: {
        id: articleId
      },
      select: {
        userId: true
      }
    })

    if(article) {
      result = article.userId === userId ? true : false
    }
    
    return result
  }
  catch(error) {
    return false
  } 
}

const likeCompareArticles = async (articles:TArticle[], userId: number) => {
  
  type TArticlesIds = {
    articleId: number
  }

  const articlesIds = articles.map(article => article.id)

  let likes: TArticlesIds[] = await db.like.findMany({
    where: {
      userId: userId,
      articleId: {
        in: articlesIds
      }
    },
    select: {
      articleId: true
    }
  })

  const verifyLikeMe = (article: TArticle, likes: TArticlesIds[] ) => {
    article.likeMe = false
    const likeArticle = likes.some(like => like.articleId === article.id)
    if(likeArticle) article.likeMe = true

    return article
  }

  const articlesWithLike:TArticle[] = articles.map(article => verifyLikeMe(article, likes))
  return articlesWithLike
}

export {
	verifyArticleUser,
  likeCompareArticles,
}