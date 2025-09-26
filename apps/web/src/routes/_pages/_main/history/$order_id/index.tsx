import {createFileRoute} from '@tanstack/react-router'
import {ArrowLeft} from "lucide-react";
import React from "react";
import {Separator} from "@/components/ui/separator";
import Cookies from "js-cookie";
import axios from "axios";
import type {ApiResponse} from "../../../../../../types/apiResponse";
import type {BidderPayment} from "../../../../../../types/bidderPayment";
import {Skeleton} from "@/components/ui/skeleton";

const fetchPaymentDetail = async (order_id: string): Promise<BidderPayment> => {
    const token = Cookies.get("auth_token")
    const response = await axios.get<ApiResponse<BidderPayment>>(
        `${import.meta.env.VITE_SERVER_URL}/payment/history/${order_id}`,
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    )
    return response.data.content!
}

export const Route = createFileRoute('/_pages/_main/history/$order_id/')({
    component: RouteComponent,
    loader: async ({params}) => (
        await fetchPaymentDetail(params.order_id)
    )
})

function RouteComponent() {
    const paymentDetail = Route.useLoaderData()
    return (
        <div className="h-full flex flex-col">
            <div className="w-full pt-4 sticky top-0 bg-white z-10 flex flex-col gap-4">
                <div className="flex-1 flex gap-4 items-center justify-start px-2">
                    <div className="flex items-center justify-center"
                         onClick={() => history.back()}>
                        <ArrowLeft className="size-6 text-gray-700"/>
                    </div>
                    <h3 className="text-xl font-normal">Detail Pembayaran</h3>
                </div>
                <Separator/>
            </div>
            <div className="flex-1 bg-gray-100 flex flex-col gap-2">
                <div className="py-3 px-4 bg-white flex flex-col gap-2">
                    <h3 className="font-medium text-lg">Info Pembayaran</h3>
                    <Separator className="my-1"/>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-muted-foreground">No. Pesanan</h3>
                            <h3>{paymentDetail.order_id}</h3>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-muted-foreground">Tanggal Pembelian</h3>
                            <h3>
                                {new Date(paymentDetail.created_at).toLocaleString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: "Asia/Jakarta",
                                })} WIB
                            </h3>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-muted-foreground">Status</h3>
                            <h3 className="capitalize">{paymentDetail.status}</h3>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-muted-foreground">Tipe</h3>
                            <h3 className="capitalize">{paymentDetail.type}</h3>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-muted-foreground">Total</h3>
                            <h3>Rp {paymentDetail.amount.toLocaleString("id-ID")}</h3>
                        </div>
                    </div>
                </div>

                <div className="py-3 px-4 bg-white flex flex-col gap-2">
                    <h3 className="font-medium text-lg">Detail Barang</h3>
                    <div className="flex flex-col items-center justify-between gap-2">
                        <div className="w-full flex items-start gap-2">
                            <img src={"https://placehold.co/100?text=Item"}
                                 className="size-16 aspect-square object-cover" alt="thumbnail"/>
                            <div className="flex flex-col text-xs gap-1">
                                <h3 className="font-medium line-clamp-2 text-sm">{paymentDetail.bidder.auction.item.name}</h3>
                                <h3 className="font-normal">Rp {paymentDetail.bidder.auction.item.deposit_price.toLocaleString("id-ID")}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-3 px-4 bg-white flex flex-col gap-2">
                    <h3 className="font-medium text-lg">Penyelenggara & PIC</h3>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-muted-foreground">Penyelenggara</h3>
                            <h3 className="capitalize">{paymentDetail.bidder.auction.organizer.name}</h3>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-muted-foreground">PIC</h3>
                            <h3 className="capitalize">{paymentDetail.bidder.auction.pic.name}</h3>
                        </div>
                    </div>
                </div>

                <div className="py-3 px-4  flex flex-col">
                    <Skeleton className={"size-full"}/>
                </div>
            </div>
        </div>
    )
}

