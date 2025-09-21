import {Card, CardContent} from "@/components/ui/card";
import React from "react";
import {Radio, Users} from "lucide-react";
import {useNavigate} from "@tanstack/react-router";
import type {Auction} from "../../types/auction";
import {CurrencyFormatter} from "@/utils/currency-formatter";

const getAuctionStatus = (start: string, end: string) => {
    const now = new Date()
    const startDate = new Date(start)
    const endDate = new Date(end)

    if (now < startDate) return "Akan Dimulai"
    if (now >= startDate && now <= endDate) return "Sedang Berlangsung"
    return "Selesai"
}


export const AuctionCard = ({auction}: { auction: Auction }) => {
    const navigate = useNavigate()
    return (
        <Card className={"p-0 gap-0 rounded-sm"} onClick={() =>
            navigate({
                to: "/detail/$id",
                params: {id: String(auction.id ?? "")},
                search: {bidder: false}
            })
        }
        >
            <div className={"gap-1"}>
                <img className={"size-full object-cover aspect-square"}
                     src={auction.item.file.path || "https://placehold.co/600x400"} alt=""/>
            </div>
            <CardContent className={"flex flex-col p-2 gap-3"}>
                <div className="space-y-1">
                    <h3 className={"text-sm font-normal uppercase"}>{auction.item.name}</h3>
                    <h4 className={"text-xs font-normal line-clamp-1"}>{auction.item.object_type.name}</h4>
                    <h3 className={"text-sm font-medium text-orange-600"}>
                        {CurrencyFormatter(auction.item.price)}
                    </h3>
                </div>
                <div>
                    <h3 className={"text-sm flex gap-1 items-center justify-start"}>
                        <Users size={14}/>
                        <span className={"line-clamp-1"}>
                            {auction.organizer.name}
                        </span>
                    </h3>
                    <h3 className={"text-sm flex gap-1 items-center justify-start"}>
                        <Radio size={14}/>
                        <span>
                            {getAuctionStatus(auction.start_date, auction.end_date)}
                        </span>
                    </h3>
                </div>
            </CardContent>
        </Card>
    )
}