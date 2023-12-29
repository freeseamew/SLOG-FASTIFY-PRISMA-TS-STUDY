import { Type } from '@sinclair/typebox'

const authBodySchema = Type.Object({
  email: Type.String(),
  pwd: Type.String(),
})

const body = authBodySchema

const registerSchema = {
  body,
  response: {
    201: Type.Object({
			status: Type.Number(),
      success: Type.Boolean(),
      message: Type.String(),
    }) 
  }
}

const loginSchema = {
  body,
  response: {
    201: Type.Object({
      id: Type.Number(),
      email: Type.String(),
      Authorization: Type.String(),      
    })
  }
}

const logoutSchema = {
  response: {
    205: Type.Object({
      success: Type.Boolean(),
      status: Type.Number(),
      message: Type.String(),
    })
  }
}

const refreshSchema = {
  response: {
    201: Type.Object({
      id: Type.Number(),
      email: Type.String(),
      Authorization: Type.String(),      
    })
  }
}

export {
  authBodySchema,
  registerSchema,
  loginSchema, 
  logoutSchema, 
  refreshSchema,
  }