import {Card, CardContent} from "@/components/ui/card";
import {Flag, ShoppingBag, ShoppingBagIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import React from "react";
import type {BidderPayment} from "../../types/bidderPayment";
import {Skeleton} from "@/components/ui/skeleton";
import {Link} from "@tanstack/react-router";

export const HistoryCard = (p: BidderPayment) => (
    <Card className="py-4 shadow-sm">
        <CardContent className="px-4 py-0 w-full flex flex-col gap-4 justify-between">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShoppingBagIcon/>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-medium text-xs capitalize">{p.type}</h3>
                        <h3 className="text-xs">{new Date(p.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                        })}</h3>
                    </div>
                </div>
                <Badge variant="secondary" className={"uppercase"}>{p.status}</Badge>
            </div>
            <Separator/>
            <div className="flex flex-col items-center justify-between gap-2">
                <div className="w-full flex items-start gap-2">
                    <img src={p.bidder.auction.item.file.path || "https://placehold.co/100?text=Placeholder!"} className="size-16 aspect-square object-cover" alt={`thumbnail for ${p.bidder.auction.item.name}`}/>
                    <div className="flex flex-col text-xs gap-1">
                        <h3 className="font-medium line-clamp-1 text-sm">{p.bidder.auction.item.name}</h3>
                        <h3 className={"text-muted-foreground line-clamp-1"}>{p.bidder.auction.organizer.name}</h3>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between">
                    <div className="flex flex-col text-xs">
                        <h3>Total Bayar</h3>
                        <h3 className="font-semibold text-sm">Rp {p.amount.toLocaleString("id-ID")}</h3>
                    </div>
                    <Button asChild>
                        <Link to={"/history/$order_id"} params={{order_id: p.order_id}}>Lihat Detail</Link>
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
)
