import {Card, CardContent} from "@/components/ui/card";
import React from "react";
import {Radio, Users} from "lucide-react";
import {useNavigate} from "@tanstack/react-router";

export const DummyAuctionCard = ({endWithin}: { endWithin?: number }) => {
    const navigate = useNavigate()
    return (
        <Card className={"p-0 gap-0 rounded-sm"} onClick={() => navigate({to: "/detail/$id", params: {id: "1"}, search: {bidder: false}})}>
            {endWithin ? (<div className="relative">
                    <img
                        className="size-full object-cover aspect-square"
                        src="https://placehold.co/600x400"
                        alt=""
                    />
                    <span
                        className="absolute top-0 left-0 bg-orange-600 text-white px-2 py-1 flex gap-1 text-xs font-bold rounded-br-lg"
                    >
                        <span>Berakhir dalam</span>
                        <span>{endWithin}</span>
                        <span>Hari</span>
                    </span>
                </div>)
                : (<div className={"gap-1"}>
                    <img className={"size-full object-cover aspect-square"}
                         src="https://placehold.co/600x400" alt=""/>
                </div>)}
            <CardContent className={"flex flex-col p-2 gap-3"}>
                <div className="space-y-1">
                    <h3 className={"text-sm font-normal"}>Nama Barang Lelang</h3>
                    <h4 className={"text-xs font-normal"}>Tipe Objek</h4>
                    <h3 className={"text-sm font-medium text-orange-600"}>
                        Rp 65.000.000
                    </h3>
                </div>
                <div>
                    <h3 className={"text-sm flex gap-1 items-center justify-start"}>
                        <Users size={14}/>
                        <span>
                        Nama Penyelenggara
                    </span>
                    </h3>
                    <h3 className={"text-sm flex gap-1 items-center justify-start"}>
                        <Radio size={14}/>
                        <span>
                        Status Lelang
                    </span>
                    </h3>
                </div>
            </CardContent>
        </Card>
    )
}