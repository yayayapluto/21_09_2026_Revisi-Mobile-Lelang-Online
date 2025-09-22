import type {Mandatory} from "./mandatory";
import type {User} from "./user";

export type AuctionBidder = Mandatory & {
    user_id: number
    auction_id: number
    phone_number: string
    bank_name: string
    account_number: string
    account_name: string
    user: User
}