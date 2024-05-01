import 'dotenv/config'

import z, { ZodError } from 'zod'
import { EnvironmentException } from '../domain/errors/Environment.exception'
import { join } from 'path'

const appConfigurationsSchema = z.object({
    /* Frontend URL for CORS issues */
    FRONTEND_URL: z.string().min(1),

    /* Database configurations */
    DB_ENGINE: z.string().min(1).max(12),
    DB_HOST: z.string().min(1),
    DB_PORT: z.number(),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_DATABASE: z.string().min(1),
    DB_ENTITIES: z.string().min(1),
    DB_SYNCHRONIZE: z.boolean(),
    DB_LOGGING: z.boolean(),

    /* Application's configurations, whatsoever... */
    API_URL: z.string().min(1),
    JWT_KEY: z.string().min(1),
    API_PORT: z.number(),
    NODE_ENV: z
    .enum(['development', 'production', 'test', 'local'])
    .default('development'),
    }
)

let appConfigurations: z.infer<typeof appConfigurationsSchema> = {}

try {
    /* Same divisions as above */
    appConfigurations = appConfigurationsSchema.parse({
      FRONTEND_URL: process.env.FRONTEND_URL,

      DB_ENGINE: process.env.DB_ENGINE,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: parseInt(process.env.DB_PORT),
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_DATABASE: process.env.DB_DATABASE,
      DB_ENTITIES: process.env.DB_ENTITIES,
      DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE === 'true',
      DB_LOGGING: process.env.DB_LOGGING === 'true',

      API_URL: process.env.API_URL,
      JWT_KEY: process.env.JWT_KEY,
      API_PORT: parseInt(process.env.API_PORT),
      NODE_ENV: process.env.NODE_ENV,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      throw new EnvironmentException(error)
    }
  }
  
  export { appConfigurations }