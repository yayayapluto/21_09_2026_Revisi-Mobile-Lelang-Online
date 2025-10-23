import {createFileRoute} from '@tanstack/react-router'
import {Button} from "@/components/ui/button";
import {Drawer, DrawerContent} from "@/components/ui/drawer";
import React, {useContext, useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ArrowLeft, Send, User} from "lucide-react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import type {Auction} from "../../../../../types/auction";
import Cookies from "js-cookie";
import axios from "axios";
import type {ApiResponse} from "../../../../../types/apiResponse";
import {AuthDataContext} from "@/contexts/authDataContext";
import {useForm} from "@tanstack/react-form";
import {z} from "zod";
import {toast} from "sonner";
import {Label} from "@/components/ui/label";
import {FieldInfo} from "@/components/field-info";
import type {Bid} from "../../../../../types/bid";
import type {Pagination} from "../../../../../types/pagination";

const fetchAuctionDetail = async (id: string): Promise<Auction> => {
    const token = Cookies.get("auth_token")
    const response = await axios.get<ApiResponse<Auction>>(
        `${import.meta.env.VITE_SERVER_URL}/auctions/${id}`,
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    )
    return response.data.content!
}

const fetchBids = async (id: string): Promise<Bid[]> => {
    const token = Cookies.get("auth_token")
    const response = await axios.get<ApiResponse<Pagination<Bid>>>(
        `${import.meta.env.VITE_SERVER_URL}/bids?auction_id=${id}&sortDir=desc&sortBy=value`,
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    )
    return response.data.content?.data!
}

const BidSchema = z.object({
    value: z.string(),
})

export const Route = createFileRoute('/_pages/_main/auction-room/$id')({
    loader: async ({ params }) => {
        return { auction: await fetchAuctionDetail(params.id), bids: await fetchBids(params.id)}
    },
    component: RouteComponent,
})

function RouteComponent() {
    const userData = useContext(AuthDataContext)

    const {auction, bids} = Route.useLoaderData()
    const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" })

    useEffect(() => {
        const endTime = new Date(auction.end_date).getTime()

        const timer = setInterval(() => {
            const now = new Date().getTime()
            const distance = endTime - now

            if (distance <= 0) {
                clearInterval(timer)
                setTimeLeft({ hours: "00", minutes: "00", seconds: "00" })
                return
            }

            const hours = Math.floor((distance / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((distance / (1000 * 60)) % 60)
            const seconds = Math.floor((distance / 1000) % 60)

            setTimeLeft({
                hours: String(hours).padStart(2, "0"),
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0"),
            })
        }, 1000)

        console.log(`user_id: ${userData?.id}, auction_id: ${auction.id}`)

        return () => clearInterval(timer)
    }, [auction.end_date])

    const topBid = bids?.length ? bids.reduce((max, bid) => (bid.value > max.value ? bid : max), bids[0]) : null
    const minBidValue = topBid ? topBid.value + 1000 : 0

    const form = useForm(({
        defaultValues: {
            value: `${minBidValue.toString()}`
        },
        validators: {
            onChange: BidSchema,
        },
        onSubmit: async ({value}) => {
            const authToken = Cookies.get("auth_token");
            try {
                const res = await axios.post<ApiResponse>(`${import.meta.env.VITE_SERVER_URL}/bids?auction_id=${auction.id}`, {
                    value: parseInt(value.value)
                }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                })

                toast.success(res.data.message)
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "Terjadi Kesalahan")
            }
        }
    }))

    return (
        <div className="h-full flex flex-col">
            <div
                className="w-full px-2 py-4 sticky top-0 bg-white z-10 flex flex-col gap-4"
            >
                <div className="flex-1 flex gap-4 items-center justify-start">
                    <div className="flex items-center justify-center" onClick={() => history.back()}>
                        <ArrowLeft className="size-6 text-gray-700"/>
                    </div>
                    <h3 className="text-xl font-normal">Laman Lelang</h3>
                </div>
            </div>
            <div className="flex-1 flex flex-col px-4 pb-64 gap-4">
                <Card className={"flex flex-row gap-2 w-full justify-between"}>
                    <CardHeader className={"w-full text-muted-foreground"}>
                        Berakhir Dalam
                    </CardHeader>
                    <CardContent className={"flex gap-2 items-center text-xl font-medium"}>
                        <span>{timeLeft.hours}</span>
                        :
                        <span>{timeLeft.minutes}</span>
                        :
                        <span>{timeLeft.seconds}</span>
                    </CardContent>
                </Card>
                <Card className="flex-1 gap-1">
                    <CardHeader>
                        <h2 className="font-medium text-sm ">Riwayat Penawaran</h2>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-60 overscroll-y-auto">
                            <div className="space-y-2 p-2">
                                {bids && bids.map((bid) => (
                                    <div
                                        className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Avatar className="size-8">
                                            <AvatarFallback className="bg-gray-100">
                                                <User className="text-muted-foreground size-4"/>
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{new Date(bid.created_at).toLocaleTimeString("id-ID")}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                            <span className="font-normal text-sm truncate">
                                              {bid.bidder.user.username}
                                            </span>
                                                <span className="font-medium text-sm ml-2">
                                              Rp {bid.value.toLocaleString("id-ID")}
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Drawer open modal={false}>
                    <DrawerContent>
                        <div className="flex flex-col gap-6 px-4 py-4">
                            <div className="flex flex-col gap-2 border border-border p-4 rounded-lg">
                                <h3 className="text-xs text-muted-foreground">Penawaran tertinggi saat ini</h3>
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-8">
                                        <AvatarFallback>
                                            <User className="text-muted-foreground size-4"/>
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{new Date(topBid?.created_at!).toLocaleTimeString("id-ID")}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                    <span className="font-normal text-sm truncate">
                                        {topBid?.bidder.user.username}
                                    </span>
                                            <span className="font-medium text-sm ml-2">
                                        Rp {minBidValue.toLocaleString("id-ID")}
                                    </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-left">
                                    <h3 className="text-xs text-muted-foreground">
                                        Minimum penawaran:
                                        <span className="ml-2 font-semibold ">
                                    Rp xxx.xxx.xxx
                                </span>
                                    </h3>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            form.handleSubmit()
                                        }}
                                        className="flex-1 flex flex-col gap-6 justify-center px-4"
                                    >
                                        <form.Field
                                            name={"value"}
                                            children={(field) => (
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor={field.name}>
                                                        Tawaran
                                                    </Label>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={e => field.handleChange(e.target.value)}
                                                        placeholder={"tuliskan penawaran kamu"}
                                                        inputMode={"numeric"}
                                                    />
                                                    <FieldInfo field={field}/>
                                                </div>
                                            )}/>
                                        <form.Subscribe
                                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                                            children={([canSubmit, isSubmitting]) => (
                                                <Button type="submit" disabled={!canSubmit}>
                                                    {isSubmitting ? "..." : "Submit"}
                                                </Button>
                                            )}
                                        />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    )
}