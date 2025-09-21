import type {Mandatory} from "./mandatory";
import type {ObjectType} from "./objectType";
import type {File} from "./file";
import type {ItemDetail} from "./itemDetail";
import type {ItemDocument} from "./itemDocument";
import type {ItemGrade} from "./itemGrade";
import type {ItemThumbnail} from "./itemThumbnail";
import type {Auction} from "./auction";

export type Item = Mandatory & {
    object_type_id: number
    name: string
    price: number
    deposit_price: number
    description: string
    file_id: number
    object_type: ObjectType
    file: File
    item_detail?: ItemDetail
    item_document?: ItemDocument
    item_grade?: ItemGrade
    item_thumbnails?: ItemThumbnail[]
    auction?: Auction
}