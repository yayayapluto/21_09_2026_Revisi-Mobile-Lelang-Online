export type Pagination<T = any> = {
    current_page: number
    current_page_url: string
    data: T[]
    first_page_url: string
    next_page_url: string | null
    per_page: number
    prev_page_url: string | null
    total_pages: number
    total_items: number
}