import Fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import type { FastifyCookieOptions } from '@fastify/cookie'
import fasstifyCookie from '@fastify/cookie'
import routes from './routes'
import { SECRET_KEY } from './lib/constants'
import { currentlyAuthPlugin } from './plugin/authPlugin'
import { checkStartupUser, checkStartupArticle } from './startup'
import fs from 'fs'
import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { swaggerConfig, swaggerUiConfig } from './config/swagger'

const fastify = Fastify({
  logger: true,
	// https: {
  //   key: fs.readFileSync('./server.key'),
  //   cert: fs.readFileSync('./server.crt'),
  // }  
}).withTypeProvider<TypeBoxTypeProvider>()

// fastify.get('/ping', async (request, reply) => {
//   return 'pong\n'
// })

fastify.register(cors, {
  origin: true, // Access-Control-Allow-Origin
  credentials: true, //Access-Control-Allow-Credentials
})

fastify.register(fastifySwagger, swaggerConfig)
fastify.register(fastifySwaggerUi, swaggerUiConfig)

fastify.register(fasstifyCookie, {
  secret: SECRET_KEY,
} as FastifyCookieOptions )

fastify.register(currentlyAuthPlugin)
fastify.register(routes)

const start = async () => {
  try {
    await checkStartupUser()
    await checkStartupArticle()    
    await fastify.listen({port: 8083}, () => {if(process.send) process.send("ready")})
    console.log(`Server Start!!`)
  }
  catch(error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()