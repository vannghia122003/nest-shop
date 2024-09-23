import { z } from 'zod'

const configSchema = z.object({
  PORT: z.coerce.number().positive().default(3000),
  CLIENT_URL: z.string().url(),
  INIT_DATA: z
    .string()
    .toLowerCase()
    .transform((v) => JSON.parse(v))
    .pipe(z.boolean()),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(6),

  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  EMAIL_VERIFICATION_TOKEN_SECRET: z.string(),
  RESET_PASSWORD_TOKEN_SECRET: z.string(),

  ACCESS_TOKEN_EXPIRES: z.string(),
  REFRESH_TOKEN_EXPIRES: z.string(),
  EMAIL_VERIFICATION_TOKEN_EXPIRES: z.string(),
  RESET_PASSWORD_TOKEN_EXPIRES: z.string(),

  CLOUDINARY_NAME: z.string(),
  CLOUDINARY_API_KEY: z.coerce.number(),
  CLOUDINARY_API_SECRET: z.string(),
  UPLOAD_IMAGE_FOLDER: z.string(),

  EMAIL_HOST: z.string(),
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  GOOGLE_REDIRECT_CLIENT_URL: z.string()
})

export type Config = z.infer<typeof configSchema>

export const validate = (config: Record<string, any>) => {
  return configSchema.parse(config)
}
