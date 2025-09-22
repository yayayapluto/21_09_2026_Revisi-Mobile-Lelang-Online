import {createFileRoute} from '@tanstack/react-router'
import {Button} from "@/components/ui/button";
import {Drawer, DrawerContent} from "@/components/ui/drawer";
import React from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ArrowLeft, Send, User} from "lucide-react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

export const Route = createFileRoute('/_pages/_main/auction-room/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="h-full flex flex-col">
            <div
                className="w-full px-2 py-4 sticky top-0 bg-white z-10 flex flex-col gap-4"
            >
                <div className="flex-1 flex gap-4 items-center justify-start">
                    <div className="flex items-center justify-center" onClick={() => history.back()}>
                        <ArrowLeft className="size-6 text-gray-700"/>
                    </div>
                    <h3 className="text-xl font-normal">Detail Barang</h3>
                </div>
            </div>
            <div className="flex-1 flex flex-col px-4 pb-64 gap-4">
                <Card className={"gap-2"}>
                    <CardHeader className={"text-muted-foreground"}>
                        Berakhir Dalam
                    </CardHeader>
                    <CardContent className={"flex gap-2 items-center text-xl font-medium py-0"}>
                        <span>01</span>
                        :
                        <span>01</span>
                        :
                        <span>01</span>
                    </CardContent>
                </Card>
                <Card className="flex-1 gap-1 bg-orange-600/40">
                    <CardHeader>
                        <h2 className="font-medium text-sm ">Riwayat Penawaran</h2>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-96 overscroll-y-auto">
                            <div className="space-y-2 p-2">
                                {Array.from({length: Math.floor(Math.random() * 200)}).map(() => (
                                    <div
                                        className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Avatar className="size-8">
                                            <AvatarFallback className="bg-gray-100">
                                                <User className="text-muted-foreground size-4"/>
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>00.00.00</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                            <span className="font-normal text-sm truncate">
                                              Nama Peserta
                                            </span>
                                                <span className="font-medium text-sm ml-2">
                                              Rp xxx.xxx.xxx
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
                                            <span>00.00.00</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                    <span className="font-normal text-sm truncate">
                                        Udin Bakso
                                    </span>
                                            <span className="font-medium text-sm ml-2">
                                        Rp 900.000.000
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
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="Masukkan penawaran Anda"
                                        className="flex-1 "
                                    />
                                    <Button>
                                        <Send className="size-4"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    )
}