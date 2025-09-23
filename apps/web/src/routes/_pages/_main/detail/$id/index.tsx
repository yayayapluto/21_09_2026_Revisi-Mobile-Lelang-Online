import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Carousel, type CarouselApi, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import React, {useEffect} from "react";
import {Badge} from "@/components/ui/badge";
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer";
import {ArrowLeft, ChevronDown} from "lucide-react";
import {DummyAuctionCard} from "@/components/dummy-auction-card";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {Card} from "@/components/ui/card";
import axios from "axios";
import Cookies from "js-cookie";
import type {Auction} from "../../../../../../types/auction";
import type {ApiResponse} from "../../../../../../types/apiResponse";
import Loader from "@/components/loader";
import type {User} from "../../../../../../types/user";
import type {BidderPayment} from "../../../../../../types/bidderPayment";

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

const fetchPaymentStatus = async (id: string): Promise<BidderPayment | null> => {
    try {
        const token = Cookies.get("auth_token")

        const userResponse = await axios.get<ApiResponse<User>>(
            `${import.meta.env.VITE_SERVER_URL}/auth/me`,
            {
                headers: {Authorization: `Bearer ${token}`},
            },
        )

        const response = await axios.get<ApiResponse<BidderPayment>>(
            `${import.meta.env.VITE_SERVER_URL}/payment/check?auction_id=${id}&user_id=${userResponse.data.content?.id}`,
            {
                headers: {Authorization: `Bearer ${token}`},
            },
        )

        return response.data.content!
    } catch {
        return null
    }
}


export const Route = createFileRoute('/_pages/_main/detail/$id/')({
    component: RouteComponent,
    loader: async ({params}) => {
        return {auction: await fetchAuctionDetail(params.id), payment: await fetchPaymentStatus(params.id)}
    }
})

const DetailRow = ({label, value}: { label: string; value: any }) => {
    if (!value) return null
    return (
        <>
            <h3 className={"text-muted-foreground"}>{label}</h3>
            <h3>
                <span className="mr-2">:</span>
                {value}
            </h3>
        </>
    )
}

function RouteComponent() {
    const {auction, payment} = Route.useLoaderData()
    const navigate = useNavigate()

    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    React.useEffect(() => {
        if (!api) return
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    const [isBidder, setIsBidder] = React.useState(false)
    useEffect(() => {
        setIsBidder(payment?.status === "confirmed")
    }, [payment])


    const thumbnails = auction.item.item_thumbnails || []
    const totalThumbnail = thumbnails.length || 1

    const getAuctionStatus = () => {
        const now = new Date()
        const start = new Date(auction.start_date)
        const end = new Date(auction.end_date)

        if (now < start) return 'Belum Dimulai'
        if (now > end) return 'Sudah Berakhir'
        return 'Sedang Berlangsung'
    }

    const basicDetailFields = auction.item.item_detail ? {
        'No. Polisi': auction.item.item_detail.plate_number,
        'Merk': auction.item.item_detail.brand,
        'Seri': auction.item.item_detail.series,
        'Tahun': auction.item.item_detail.year,
        'Warna': auction.item.item_detail.color,
    } : {}

    const fullDetailFields = auction.item.item_detail ? {
        'No. Polisi': auction.item.item_detail.plate_number,
        'Merk': auction.item.item_detail.brand,
        'Seri': auction.item.item_detail.series,
        'CC': auction.item.item_detail.cc,
        'Tipe': auction.item.item_detail.type,
        'Transmisi': auction.item.item_detail.transmission,
        'Model': auction.item.item_detail.model,
        'Tahun': auction.item.item_detail.year,
        'No. Rangka': auction.item.item_detail.frame_number,
        'No. Mesin': auction.item.item_detail.machine_number,
        'Kilometer': auction.item.item_detail.kilometer ? `${auction.item.item_detail.kilometer.toLocaleString('id-ID')} km` : null,
        'Bahan Bakar': auction.item.item_detail.fuel,
        'Warna': auction.item.item_detail.color,
        'Tipe Penggerak': auction.item.item_detail.drive_type,
        'Tanggal STNK': auction.item.item_detail.stnk_date ? new Date(auction.item.item_detail.stnk_date).toLocaleDateString('id-ID') : null,
    } : {}

    const documentFields = auction.item.item_document ? {
        'BPKB': auction.item.item_document.bpkb ? 'Ada' : 'Tidak Ada',
        'STNK': auction.item.item_document.stnk ? 'Ada' : 'Tidak Ada',
        'Faktur': auction.item.item_document.facture ? 'Ada' : 'Tidak Ada',
        'Kwitansi': auction.item.item_document.receipt ? 'Ada' : 'Tidak Ada',
        'Surat Pelepasan': auction.item.item_document.ownership_release ? 'Ada' : 'Tidak Ada',
        'Garansi': auction.item.item_document.warranty ? 'Ada' : 'Tidak Ada',
        'Kotak': auction.item.item_document.box ? 'Ada' : 'Tidak Ada',
    } : {}

    const gradeFields = auction.item.item_grade ? {
        'Interior': auction.item.item_grade.interior,
        'Eksterior': auction.item.item_grade.exterior,
        'Rangka': auction.item.item_grade.frame,
        'Mesin': auction.item.item_grade.machine,
    } : {}

    if (!auction) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader/>
            </div>
        )
    }

    return (
        <div className={"h-full flex flex-col"}>
            <div className="w-full px-2 py-4 sticky top-0 bg-white z-10 flex flex-col gap-4">
                <div className="flex-1 flex gap-4 items-center justify-start">
                    <div className="flex items-center justify-center"
                         onClick={() => isBidder ? navigate({to: "/home"}) : history.back()}>
                        <ArrowLeft className="size-6 text-gray-700"/>
                    </div>
                    <h3 className="text-xl font-normal">Detail Barang</h3>
                </div>
            </div>

            <Carousel setApi={setApi} className={"relative"}>
                <CarouselContent className="flex">
                    {thumbnails.length > 0 ? (
                        thumbnails.map((thumbnail, index) => (
                            <CarouselItem key={index}>
                                <img
                                    src={thumbnail.file.path || "https://placehold.co/600x400"}
                                    className={"aspect-[4/3] size-full object-cover"}
                                    loading={"eager"}
                                    alt={thumbnail.name}
                                />
                            </CarouselItem>
                        ))
                    ) : (
                        <CarouselItem>
                            <img
                                src={`${import.meta.env.VITE_SERVER_URL}/storage/${auction.item.file.path}`}
                                className={"aspect-[4/3] size-full object-cover"}
                                loading={"eager"}
                                alt={auction.item.name}
                            />
                        </CarouselItem>
                    )}
                </CarouselContent>
                <Badge className={"absolute bottom-1 right-1 bg-black/50 text-white"}>
                    <span>{current + 1}</span>/<span>{totalThumbnail}</span>
                </Badge>
            </Carousel>

            <div className="flex-1 bg-gray-100 space-y-4 pb-66">
                <div className="py-3 px-4 bg-white space-y-2">
                    <h3 className="text-lg font-normal">{auction.item.name}</h3>
                    <div>
                        <h3 className="font-normal">Harga Dasar</h3>
                        <h3 className="text-lg font-medium">Rp {auction.item.price.toLocaleString('id-ID')}</h3>
                    </div>
                </div>

                <div className="py-3 px-4 bg-white space-y-2">
                    <h3 className="text-lg font-medium">Info Lelang</h3>
                    <div className="grid grid-cols-2 gap-1 items-start">
                        <DetailRow label="Jadwal Lelang"
                                   value={new Date(auction.start_date).toLocaleDateString('id-ID')}/>
                        <DetailRow label="Penyelenggara Lelang" value={auction.organizer.name}/>
                        <h3 className={"text-muted-foreground"}>Kontak PIC</h3>
                        <h3 className="flex items-start">
                            <span className="mr-2">:</span>
                            <span className="flex flex-col">
                                <span>{auction.pic.name}</span>
                                <span>{auction.pic.phone_number}</span>
                            </span>
                        </h3>
                    </div>
                </div>

                <div className="py-3 px-4 bg-white space-y-2">
                    <h3 className="text-lg font-medium">Detail Barang</h3>
                    <div className="grid grid-cols-2 gap-1 items-start">
                        {Object.entries(basicDetailFields).map(([key, value]) => (
                            <DetailRow key={key} label={key} value={value}/>
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
                                                    <AccordionTrigger className={"text-sm"}>Info
                                                        Barang</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="grid grid-cols-2 gap-1 items-start text-sm">
                                                            {Object.entries(fullDetailFields).map(([key, value]) => (
                                                                <DetailRow key={key} label={key} value={value}/>
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
                                                            {Object.entries(documentFields).map(([key, value]) => (
                                                                <DetailRow key={key} label={key} value={value}/>
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
                                                            {Object.entries(gradeFields).map(([key, value]) => (
                                                                <DetailRow key={key} label={key}
                                                                           value={value.toUpperCase()}/>
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
                    <p className={"text-justify text-pretty line-clamp-6"}>{auction.item.description}</p>
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
                            <h3 className={"text-lg font-medium"}>{getAuctionStatus()}</h3>
                        </div>
                        <Separator/>

                        {!isBidder && getAuctionStatus() !== "Sudah Berakhir" && (
                            <>
                                <div className="flex flex-row items-center gap-2">
                                    <img src="https://placehold.co/600" className={"aspect-square size-20"} alt=""/>
                                    <div className={"flex flex-col items-stretch justify-center space-y-1"}>
                                        <h3 className={"font-medium"}>Tertarik Dengan Barang Ini?</h3>
                                        <h4 className={"text-xs"}>
                                            Silahkan beli Nomor Peserta Lelang (NPL) untuk memberikan penawaran barang
                                            ini.
                                        </h4>
                                    </div>
                                </div>
                                <Button
                                    className={"w-full"}
                                    onClick={() =>
                                        navigate({
                                            to: "/bidder-form",
                                            search: {auction_id: auction.id},
                                        })
                                    }
                                >
                                    Beli NPL
                                </Button>
                            </>
                        )}

                        {isBidder && getAuctionStatus() === "Sedang Berlangsung" && (
                            <Button
                                className={"w-full"}
                                onClick={() =>
                                    navigate({
                                        to: "/auction-room/$id",
                                        params: {id: auction.id.toString()},
                                    })
                                }
                            >
                                Masuk room lelang
                            </Button>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>

        </div>
    )
}