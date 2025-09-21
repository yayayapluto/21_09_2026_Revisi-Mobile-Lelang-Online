export type ApiResponse<T = any> = {
    success: boolean
    message: string
    content: T | null
    error: object | null
}