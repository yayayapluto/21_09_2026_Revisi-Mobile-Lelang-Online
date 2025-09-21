import type {Mandatory} from "./mandatory";
import type {Auction} from "./auction";

export type Pic = Mandatory & {
    name: string
    phone_number: string
    auctions: Auction[]
}