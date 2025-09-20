import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Carousel, type CarouselApi, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer";
import {ArrowLeft, ChevronDown} from "lucide-react";
import {DummyAuctionCard} from "@/components/dummy-auction-card";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {Card} from "@/components/ui/card";

export const Route = createFileRoute('/_pages/_main/detail/$id/')({
    component: RouteComponent,
    validateSearch: (search: Record<string, string | boolean>) => {
        return {
            bidder: search?.bidder === true || search?.bidder === 'true',
        }
    }
})

function RouteComponent() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    React.useEffect(() => {
        if (!api) {
            return
        }
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])
    const [totalThumbnail, setThumbnail] = useState(0)
    useEffect(() => {
        setThumbnail(Math.floor(Math.random() * 10))
    }, [])
    const navigate = useNavigate()

    const search = Route.useSearch()
    const [isBidder, setIsBidder] = React.useState(false)

    React.useEffect(() => {
        setIsBidder(search.bidder)
    }, [search.bidder])

    return (
        <div className={"h-full flex flex-col"}>
            <div
                className="w-full px-2 py-4 sticky top-0 bg-white z-10 flex flex-col gap-4"
            >
                <div className="flex-1 flex gap-4 items-center justify-start">
                    <div className="flex items-center justify-center" onClick={() => isBidder ? navigate({to:"/home"}) : history.back()}>
                        <ArrowLeft className="size-6 text-gray-700"/>
                    </div>
                    <h3 className="text-xl font-normal">Detail Barang</h3>
                </div>
            </div>
            <Carousel setApi={setApi} className={"relative"}>
                <CarouselContent className="flex">
                    {Array.from({length: totalThumbnail}).map((_, index) => (
                        <CarouselItem key={index}>
                            <img src={"https://placehold.co/600x400"} className={"aspect-[4/3] size-full object-cover"}
                                 loading={"eager"}/>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <Badge className={"absolute bottom-1 right-1 bg-black/50 text-white"}>
                    <span>{current + 1}</span>
                    /
                    <span>{totalThumbnail}</span>
                </Badge>
            </Carousel>
            <div
                className="flex-1 bg-gray-100 space-y-4 pb-66"> {/* <- disini gue hardcoded biar ga ketutupan drawer content, tapi ga dinamis jadinya?*/}
                <div className="py-3 px-4 bg-white space-y-2">
                    <h3 className="text-lg font-normal">Nama Barang Lelang</h3>
                    <div>
                        <h3 className="font-normal">Harga Dasar</h3>
                        <h3 className="text-lg font-medium">Rp 163.000.000</h3>
                    </div>
                </div>
                <div className="py-3 px-4 bg-white space-y-2">
                    <h3 className="text-lg font-medium">Info Lelang</h3>
                    <div className="grid grid-cols-2 gap-1 items-start">
                        <h3 className={"text-muted-foreground"}>Jadwal Lelang</h3>
                        <h3>
                            <span className="mr-2">:</span>
                            13 September 2025
                        </h3>
                        <h3 className={"text-muted-foreground"}>Penyelenggara Lelang</h3>
                        <h3>
                            <span className="mr-2">:</span>
                            PT Bank Reza
                        </h3>
                        <h3 className={"text-muted-foreground"}>Kontak PIC</h3>
                        <h3 className="flex items-start">
                            <span className="mr-2">:</span>
                            <span className="flex flex-col">
                                <span>Reza Andhika</span>
                                <span>00998887</span>
                            </span>
                        </h3>
                    </div>
                </div>
                <div className="py-3 px-4 bg-white space-y-2">
                    <h3 className="text-lg font-medium">Detail Barang</h3>
                    <div className="grid grid-cols-2 gap-1 items-start">
                        {Array.from({length: 5}).map((_, index) => (
                            <>
                                <h3 className={"text-muted-foreground"}>Key {index}</h3>
                                <h3>
                                    <span className="mr-2">:</span>
                                    value {index}
                                </h3>
                            </>
                        ))}
                    </div>
                    <div className={"flex items-center justify-center"}>
                        <Drawer>
                            <DrawerTrigger asChild>
                                <span
                                    className="text-orange-600 hover:text-orange-700 font-medium my-2 flex gap-2 items-center">
                                    Lihat Selengkapnya <ChevronDown/>
                                </span>
                            </DrawerTrigger>
                            <DrawerContent className="flex flex-col h-full">
                                <DrawerHeader>
                                    <DrawerTitle className={"text-lg"}>Detail Barang</DrawerTitle>
                                </DrawerHeader>
                                <ScrollArea className={"flex-1 overflow-y-auto"}>
                                    <div className="space-y-2 px-4 pb-6 pt-2">
                                        <Card className={"py-0 px-4"}>
                                            <Accordion type="single" defaultValue={"item-1"} collapsible>
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger className={"text-sm"}>Info Barang</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="grid grid-cols-2 gap-1 items-start text-sm">
                                                            {Array.from({length: 10}).map((_, index) => (
                                                                <>
                                                                    <h3 className={"text-muted-foreground"}>Key {index}</h3>
                                                                    <h3>
                                                                        <span className="mr-2">:</span>
                                                                        value {index}
                                                                    </h3>
                                                                </>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </Card>
                                        <Card className={"py-0 px-4"}>
                                            <Accordion type="single" defaultValue={"item-1"} collapsible>
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger>Dokumen</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="grid grid-cols-2 gap-1 items-start text-sm">
                                                            {Array.from({length: 10}).map((_, index) => (
                                                                <>
                                                                    <h3 className={"text-muted-foreground"}>Key {index}</h3>
                                                                    <h3>
                                                                        <span className="mr-2">:</span>
                                                                        value {index}
                                                                    </h3>
                                                                </>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </Card>
                                        <Card className={"py-0 px-4"}>
                                            <Accordion type="single" defaultValue={"item-1"} collapsible>
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger>Grade</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="grid grid-cols-2 gap-1 items-start text-sm">
                                                            {Array.from({length: 4}).map((_, index) => (
                                                                <>
                                                                    <h3 className={"text-muted-foreground"}>Key {index}</h3>
                                                                    <h3>
                                                                        <span className="mr-2">:</span>
                                                                        value {index}
                                                                    </h3>
                                                                </>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </Card>
                                    </div>
                                </ScrollArea>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>
                <div className="py-3 px-4 bg-white space-y-2">
                    <h3 className="text-lg font-medium">Deskripsi Barang</h3>
                    <p className={"text-justify text-pretty line-clamp-6"}>Lorem ipsum dolor sit amet, consectetur
                        adipisicing elit. Autem laudantium officiis quis. Ad dolor error illum magnam natus, nostrum
                        porro repellendus sed tempora temporibus! Alias amet at autem delectus deleniti deserunt ea enim
                        magni molestias nemo perspiciatis, placeat quidem quos sequi sit sunt voluptates. Dicta, dolorum
                        velit? Corporis exercitationem expedita praesentium quo soluta? Accusamus ad, amet aspernatur
                        aut autem consequatur cupiditate dolores et eum facere fuga impedit ipsum nesciunt nisi odit
                        officiis, omnis perferendis quisquam recusandae tempora? Beatae consectetur facilis fugit modi
                        suscipit! Aliquam animi architecto at atque blanditiis deserunt et ex harum, ipsa perspiciatis,
                        quasi saepe vel vitae voluptatem.</p>
                </div>
                <div className="flex-1 pt-3 pb-8 px-4 bg-white space-y-2">
                    <h3 className="text-lg font-medium">Produk Terkait</h3>
                    <Carousel>
                        <CarouselContent className="flex">
                            {Array.from({length: Math.floor(Math.random() * 10)}).map((_, index) => (
                                <CarouselItem key={index} className="flex-none basis-1/2">
                                    <DummyAuctionCard/>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
            <Drawer open modal={false}>
                <DrawerContent>
                    <div className="space-y-4 px-4 pb-6 pt-2">
                        <div className={"flex flex-col space-y-1"}>
                            <h4 className={"text-sm"}>Waktu Lelang:</h4>
                            <h3 className={"text-lg font-medium"}>Belum Dimulai</h3>
                        </div>
                        <Separator/>
                        {!isBidder && (
                            <>
                                <div className="flex flex-row items-center gap-2">
                                    <img src="https://placehold.co/600" className={"aspect-square size-20"} alt=""/>
                                    <div className={"flex flex-col items-stretch justify-center space-y-1"}>
                                        <h3 className={"font-medium"}>Tertarik Dengan Barang Ini?</h3>
                                        <h4 className={"text-xs"}>Silahkan beli Nomor Peserta Lelang (NPL) untuk
                                            memberikan
                                            penawaran barang ini.</h4>
                                    </div>
                                </div>
                                <Button className={"w-full"} onClick={() => navigate({to: "/bidder-form"})}>
                                    Beli NPL
                                </Button>
                            </>
                        )}
                        {isBidder && (
                            <Button className={"w-full"}
                                    onClick={() => navigate({to: "/auction-room/$id", params: {id: '1'}})}>
                                Masuk room lelang
                            </Button>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
