import { Secret } from 'jsonwebtoken'

const FIRST_PWD = process.env.FIRST_PWD
const ROUND = Number(process.env.HASH_ROUND) 
const SECRET_KEY = process.env.SECRET_KEY as Secret
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES 
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES

const ERROR_MESSAGE = {
  badRequest: {
    success: false,
    status: 400,
    message: 'Bad Request',
  },
  likeAddError: {
    success: false,
    status: 400,
    message: 'Already Add Like'
  },
  likeCancelError: {
    success: false,
    status: 400,
    message: 'No Like'
  },
  unauthorized: {
    success: false,
    status: 401,
    message: 'Unauthorized',
  },
  invalidToken: {
    success: false,
    status: 401,
    message: 'Invalid token'
  },
  notExpired: {
    success: false,
    status: 401,
    message: 'Token Not Expired'
  },
  forbidden: {
    success: false,
    status: 403,
    message: 'Forbidden',
  },
  alreadySignup: {
    success: false,
    status: 403, 
    message: 'Already Sign Up'
  },
  notFound: {
    success: false,
    status: 404,
    message: 'Not Found',
  },
  preconditionFailed: {
    success: false,
    status: 412,
    message: 'Precondition Failed',
  },
  serverError: {
    success: false,
    status: 500,
    message: 'Internal Server Error',
  },
} as const

const SUCCESS_MESSAGE = {
  loginOk: {
    success: true,
    status: 201,
    message: 'Login Ok!'
  },
  logouOk: {
    success: true,
    status: 205,
    message: 'Logout success!'
  },
  refreshToken: {
    success: true,
    status: 201,
    message: 'refresh success'
  },
  accessTokenOk: {
    success: true,
    status: 200,
    message: 'access token ok'
  },
  registerOk : {
    status:201,
    success: true,
    message: 'register success!'
  }
} as const

const CATEGORY_TYPE = {
  ALL: 'all',
  MY : 'my'
} as const

export {
  FIRST_PWD,
  ROUND,
  SECRET_KEY,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,  
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  CATEGORY_TYPE,  
}