import bcrypt from 'bcrypt'
import db from './db'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ERROR_MESSAGE, ROUND, SECRET_KEY, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } from './constants'
import { handleError } from '../lib/errorHelper'
import { FastifyReply, FastifyRequest } from 'fastify'

const generateHash = ( pwd:string ) => {
  const hashPwd = bcrypt.hashSync(pwd, ROUND)
  return hashPwd
}

const duplicateVerifyUser = async (email:string) => {
  try {
    const userCount = await db.user.count({
      where: {
        email: email
      }
    })
    
    if(userCount > 0) throw ERROR_MESSAGE.alreadySignup
    
    return true
  }
  catch(error) {
    throw error
  }
}

const verifyPassword = async (email:string, pwd: string) => {
  try {
    const encrptedPwd = await db.user.findUnique({
      where: {
        email: email,
      },
      select: {
        password: true
      }
    })
    
    if(!encrptedPwd) return false
    
    const result = bcrypt.compareSync(pwd, encrptedPwd.password)
    return result 
  }
  catch(error) {
    return false
  }
}

const generateAccessToken = (user: { id: number, email: string }) => {
  const accessToken = jwt.sign({id: user.id, email: user.email}, SECRET_KEY, {expiresIn: ACCESS_TOKEN_EXPIRES} )
  return accessToken
}

const generateRefreshToken = (user: { id: number, email: string }) => {
  const refreshToken = jwt.sign({id: user.id, email: user.email}, SECRET_KEY, {expiresIn: REFRESH_TOKEN_EXPIRES})
  return refreshToken
}

const verifyRefreshToken = async ( refresh_token:string )=> {
  try {
    const decoded = jwt.verify(refresh_token, SECRET_KEY) as JwtPayload
    const tokenFromServer = await db.token.count({
      where: {
        userId: decoded.id,
        refreshToken: refresh_token,
      }
    })

    if(tokenFromServer > 0) {
      return decoded
    }
    else {
      throw ERROR_MESSAGE.unauthorized
    }
  }
  catch(error) {
    throw ERROR_MESSAGE.unauthorized
  }
}

const shortVerifyRefreshToken = (refresh_token:string) => {
  const decode = jwt.verify(refresh_token, SECRET_KEY)
  if(decode) {
    return true
  }
  else {
    return false
  }
}

const verifyAccessToken = ( access_token: string ) => {

  try {
    const decode = jwt.verify(access_token, SECRET_KEY) as JwtPayload
    return decode
  }
  catch(error) {
    throw ERROR_MESSAGE.invalidToken
  }
}

const verifySignIn = async (req: FastifyRequest, rep: FastifyReply) => {
  const userId = req.user?.id
  const email = req.user?.email

  if(userId && email) {
    return // 토큰에도 이상이 없으면 true 리턴
  }
  else {
    handleError(rep, ERROR_MESSAGE.unauthorized)
  }
}

export {
	generateHash,
  duplicateVerifyUser,
	verifyPassword,
  generateAccessToken,
  generateRefreshToken,  
  verifyRefreshToken,
	shortVerifyRefreshToken,
  verifyAccessToken,  
	verifySignIn,
}