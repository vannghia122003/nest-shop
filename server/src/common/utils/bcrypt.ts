import { genSaltSync, hashSync, compareSync } from 'bcrypt'

export const hashString = (data: string) => {
  const salt = genSaltSync(10)
  return hashSync(data, salt)
}

export const compareHash = (data: string, hash: string) => {
  return compareSync(data, hash)
}
