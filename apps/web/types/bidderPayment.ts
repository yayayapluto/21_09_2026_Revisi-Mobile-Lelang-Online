import type {Mandatory} from "./mandatory";
import type {AuctionBidder} from "./auctionBidder";

export type BidderPayment = Mandatory & {
    order_id: string;
    bidder_id: number
    status: string
    amount: number
    snap_url: string
    redirect_url: string
    type: string
    bidder: AuctionBidder
}