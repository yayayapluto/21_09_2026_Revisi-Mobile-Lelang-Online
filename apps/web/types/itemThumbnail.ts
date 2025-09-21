import type {Mandatory} from "./mandatory"
import type {File} from "./file"

export type ItemThumbnail = Mandatory & {
    name: string
    item_id: number
    file_id: number
    file: File
}
