import type {Mandatory} from "./mandatory";
import type {Item} from "./item";
import type {Organizer} from "./organizer";
import type {Pic} from "./pic";

export type Auction = Mandatory & {
    start_date: string
    end_date: string
    item_id: number
    organizer_id: number
    pic_id: number
    item: Item
    organizer: Organizer
    pic: Pic
}