import db from '../lib/db'
import { generateHash, duplicateVerifyUser, verifyPassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/authHelper'
import { ERROR_MESSAGE } from '../lib/constants'

function authService() {
	const register = async (email: string, pwd: string) => {

    try {
      await duplicateVerifyUser(email)
  
      const hashPwd = generateHash(pwd)
  
      const values = {
        email: email,
        password: hashPwd,
      }
  
      const returnValue = await db.user.create({
        data: values
      })
  
      return returnValue
    }
    catch(error) {
      throw error
    }
  }

	const loginWithPassword = async (email: string, pwd: string) => {
  
    try {
  
      const authenticationUser = await db.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
        },
      }) 
    
      if(!authenticationUser) throw ERROR_MESSAGE.badRequest
      
      const passwordVerification = await verifyPassword(email, pwd)
      if(!passwordVerification) throw ERROR_MESSAGE.unauthorized
    
      const accessToken =  generateAccessToken(authenticationUser)
      const refreshToken = generateRefreshToken(authenticationUser)
      
      const values ={
        userId: authenticationUser.id,
        refreshToken: refreshToken,
      }
    
      await db.token.create({
        data: values,
      })
    
      const returnValue = {
        id: authenticationUser.id,
        email: authenticationUser.email,
        accessToken: accessToken,
        refreshToken: refreshToken
      }

      return returnValue
    }
    catch(error) {
      throw error
    }
  }

	const logout = async (refresh_token: string) => {
  
    try {
      const returnValue = await db.token.deleteMany({
        where: {
          refreshToken: refresh_token,
        }
      })
      
      return returnValue
    }
    catch(error) {
      throw error
    }
  }

	const refresh = async ( refresh_token: string ) => {
  
    try {
      if(!refresh_token) throw ERROR_MESSAGE.unauthorized
      
      const authenticationUser = await verifyRefreshToken(refresh_token)
  
      const userInfo = {
        id: authenticationUser.id,
        email: authenticationUser.email
      }
  
      const access_token = generateAccessToken(userInfo)
  
      const returnValues ={
        id: authenticationUser.id,
        email:authenticationUser.email,
        Authorization: access_token,
      }
  
      return returnValues
    }
    catch(error) {
      throw error
    }
  }  

	return {
    register,
    loginWithPassword,
    logout,
    refresh,
  }
}

export default authService()