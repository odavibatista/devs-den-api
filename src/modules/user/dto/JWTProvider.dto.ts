export type JWTProviderDTO = {
    payload: {
      [key: string]: any
    }
    secret?: string
    expiresIn?: number | string
  }
  
  export interface JWTValidateDTO {
    token: string
    secret: string
}