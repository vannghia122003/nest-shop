export interface SuccessResponse<Data> {
  message: string
  result: Data
}

export interface ErrorResponse<Data> {
  message: string
  errors: Data
}
