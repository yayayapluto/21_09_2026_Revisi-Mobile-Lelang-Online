import type {Mandatory} from "./mandatory";
import type {AuctionBidder} from "./auctionBidder";

export type Bid = Mandatory & {
    bidder_id: number
    value: number
    bidder: AuctionBidder
}