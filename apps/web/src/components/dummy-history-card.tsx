import {Card, CardContent} from "@/components/ui/card";
import {Flag} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import React from "react";

export const DummyHistoryCard = () => (
    <Card className={"py-4 shadow-sm"}>
        <CardContent className="px-4 py-0 w-full flex flex-col gap-4 justify-between">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Flag/>
                    <div className="flex flex-col">
                        <h3 className="font-medium text-xs">Bayar NPL</h3>
                        <h3 className={"text-xs"}>23 Agustus 2025</h3>
                    </div>
                </div>
                <Badge variant={"secondary"}>
                    Belum Dibayar
                </Badge>
            </div>
            <Separator/>
            <div className="flex flex-col items-center justify-between gap-2">
                <div className="w-full flex items-start gap-2">
                    <Skeleton className={"size-16 aspect-square"}/>
                    <div className="flex flex-col text-xs">
                        <h3 className="font-medium line-clamp-1">Nama barang Lorem ipsum dolor sit amet, consectetur
                            adipisicing elit. Beatae, fugiat!</h3>
                        <h3>Lorem ipsum dolor.</h3>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between">
                    <div className="flex flex-col text-xs">
                        <h3>Total Bayar</h3>
                        <h3 className="font-medium">Rp 90.000.000</h3>
                    </div>
                    <Button>Lihat Detail</Button>
                </div>
            </div>
        </CardContent>
    </Card>
)
