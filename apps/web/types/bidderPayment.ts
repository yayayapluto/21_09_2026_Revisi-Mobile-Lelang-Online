import type {Mandatory} from "./mandatory";

export type BidderPayment = Mandatory & {
    bidder_id: number
    status: string
    amount: number
    snap_url: string
    redirect_url: string
    type: string
}