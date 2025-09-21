import type {Mandatory} from "./mandatory";
import type {Auction} from "./auction";

export type Organizer = Mandatory & {
    name: string
    address: string
    bank_name: string
    account_number: string
    account_name: string
    auctions: Auction[]
}