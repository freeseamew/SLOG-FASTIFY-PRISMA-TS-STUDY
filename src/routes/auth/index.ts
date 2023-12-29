import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { registerSchema, loginSchema, logoutSchema, refreshSchema } from '../../schema'
import { TAuthBody } from '../../schema/types'
import authService from '../../services/authService'
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../../lib/constants'
import { handleError } from '../../lib/errorHelper'

const authRoute = async (fastify: FastifyInstance) => {
	fastify.post('/register', {schema: registerSchema}, async (req: FastifyRequest<{Body: TAuthBody}>, rep: FastifyReply) => {
		const { email, pwd } = req.body

		try {
			await authService.register(email, pwd)
      rep.status(SUCCESS_MESSAGE.registerOk.status).send(SUCCESS_MESSAGE.registerOk)
    }
    catch(error) {
      handleError(rep, ERROR_MESSAGE.badRequest, error)
    }
	})

	fastify.post('/login', {schema: loginSchema}, async (req:FastifyRequest<{Body: TAuthBody}>, rep: FastifyReply) => {
		const { email, pwd } = req.body

		try {
      const values = await authService.loginWithPassword(email, pwd)

      rep.setCookie('refresh_token', values.refreshToken, {
        domain: 'localhost',
        sameSite:'none',
        secure: true,
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      })  

      const result = {
        id: values.id,
        email: values.email,
        Authorization: values.accessToken,        
      }

      rep.status(201).send(result)
    }
    catch(error) {
      handleError(rep, ERROR_MESSAGE.badRequest, error)
    }
	})

	fastify.delete('/logout', {schema: logoutSchema}, async (req: FastifyRequest, rep:FastifyReply) => {
		const refresh_token = req.cookies.refresh_token
    if(!refresh_token) {
      handleError(rep, ERROR_MESSAGE.unauthorized)
      return
    }
 
    try {
      await authService.logout(refresh_token)
      rep.clearCookie('refresh_token', {path: '/'})
      rep.status(SUCCESS_MESSAGE.logouOk.status).send(SUCCESS_MESSAGE.logouOk)
    }
    catch(error) {
      handleError(rep, ERROR_MESSAGE.badRequest, error)
    }    
  })

	fastify.post('/refresh', {schema: refreshSchema}, async (req:FastifyRequest, rep: FastifyReply) => {
		const refresh_token = req.cookies.refresh_token
    if(!refresh_token) {
      handleError(rep, ERROR_MESSAGE.unauthorized)
      return
    }    

    try {
      const result = await authService.refresh(refresh_token)
      rep.status(201).send(result)
    }
    catch(error) {
      handleError(rep, ERROR_MESSAGE.badRequest, error)
    }
  })  
}

export default authRoute