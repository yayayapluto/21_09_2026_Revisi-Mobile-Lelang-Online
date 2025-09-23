import {Card, CardContent} from "@/components/ui/card";
import {Flag} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import React from "react";
import type {BidderPayment} from "../../types/bidderPayment";

export const HistoryCard = (p: BidderPayment) => (
    <Card className="py-4 shadow-sm">
        <CardContent className="px-4 py-0 w-full flex flex-col gap-4 justify-between">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Flag/>
                    <div className="flex flex-col">
                        <h3 className="font-medium text-xs">{p.type}</h3>
                        <h3 className="text-xs">{new Date(p.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                        })}</h3>
                    </div>
                </div>
                <Badge variant="secondary">{p.status}</Badge>
            </div>
            <Separator/>
            <div className="flex flex-col items-center justify-between gap-2">
                <div className="w-full flex items-start gap-2">
                    <div className="size-16 aspect-square bg-gray-200"/>
                    <div className="flex flex-col text-xs">
                        <h3 className="font-medium line-clamp-1">Item #{p.bidder_id}</h3>
                        <h3>ID {p.id}</h3>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between">
                    <div className="flex flex-col text-xs">
                        <h3>Total Bayar</h3>
                        <h3 className="font-medium">Rp {p.amount.toLocaleString("id-ID")}</h3>
                    </div>
                    <Button asChild>
                        <a href={p.redirect_url} target="_blank">Lihat Detail</a>
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
)
