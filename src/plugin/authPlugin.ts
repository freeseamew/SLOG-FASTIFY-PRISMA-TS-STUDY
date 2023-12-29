import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { verifyAccessToken, shortVerifyRefreshToken } from '../lib/authHelper'
import fp from 'fastify-plugin'
import { TCommonHeaders } from '../schema/types'

const currentlyAuth: FastifyPluginAsync = async (fastify) => {

  fastify.decorateRequest('user', null) 
  fastify.addHook('preHandler', async (req:FastifyRequest<{Headers: TCommonHeaders}>) => {
    const { authorization } = req.headers  // access_token
    const refresh_token = req.cookies.refresh_token

    if(!authorization || !refresh_token ) return
   
    try {
      shortVerifyRefreshToken(refresh_token)
      const decode = verifyAccessToken(authorization)
    
      req.user = {
        id: decode.id,
        email: decode.email
      }
    }
    catch(error) {
      return
    }

  })
}

export const currentlyAuthPlugin = fp(currentlyAuth, {
  name: 'currentlyAuthPlugin'
})

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number,
      email: string 
    } | null
  }
}