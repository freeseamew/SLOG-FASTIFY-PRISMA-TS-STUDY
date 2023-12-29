import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

const swaggerConfig = {
  swagger: {
    info: {
      title: 'Slog Api',
      description: 'Slog에 사용되는 REST API 명세서 입니다. ',
      version: '1.0.0',
    },
    host: 'localhost:8083',
    basePth:'/',
  },  
}

const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
  }
}

export {
  swaggerConfig,
  swaggerUiConfig
}