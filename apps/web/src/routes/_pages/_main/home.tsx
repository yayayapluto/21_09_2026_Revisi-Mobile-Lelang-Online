import {createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import {Carousel, type CarouselApi, CarouselContent, CarouselItem,} from "@/components/ui/carousel"
import React, {Profiler} from "react";
import {cn} from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay"
import {Button} from "@/components/ui/button";
import {DummyAuctionCard} from "@/components/dummy-auction-card";
import {Input} from "@/components/ui/input";
import {Clipboard, Gavel, Home, House, ScrollText, SearchIcon, UserCircle} from "lucide-react";
import {Separator} from "@/components/ui/separator";


export const Route = createFileRoute('/_pages/_main/home')({
    component: RouteComponent,
})

function RouteComponent() {
    const CAROUSEL_BANNERS = [
        "https://placehold.co/600x400?text=Banner+Satu",
        "https://placehold.co/600x400?text=Banner+Dua",
        "https://placehold.co/600x400?text=Banner+Tiga",
        "https://placehold.co/600x400?text=Banner+Empat",
        "https://placehold.co/600x400?text=Banner+Lima",
        "https://placehold.co/600x400?text=Banner+Enam",
    ]

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

    const [totalDummy, setTotalDummy] = React.useState<number>(10)

    const navigate = useNavigate()
    return (
        <div className={"grid grid-rows-[1fr] gap-4"}>
            <div
                className="w-full p-2 sticky top-0 bg-white z-10 flex flex-col gap-4"
            >
                <div className={"relative w-full"}>
                    <Input
                        disabled
                        type="text"
                        placeholder="Cari barang lelang"
                        className="pl-10"
                        onTouchStart={() => navigate({to: "/list"})}
                    />
                    <SearchIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"/>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <Carousel setApi={setApi} plugins={[
                    Autoplay({
                        delay: 3000,
                    }),
                ]}>
                    <CarouselContent>
                        {CAROUSEL_BANNERS.map((banner) => (
                            <CarouselItem>
                                <img className={"aspect-video size-full object-cover"} src={banner} alt=""/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className={"w-full flex flex-row gap-2 justify-center"}>
                    {CAROUSEL_BANNERS.map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "rounded-full h-2 transition-all duration-300 ease-in-out",
                                {
                                    "w-6 bg-indigo-800": current === index,
                                    "w-2 bg-gray-300": current !== index,
                                }
                            )}
                        ></div>
                    ))}
                </div>
            </div>
            <div className={"px-2 py-4 max-w-full min-w-0 space-y-6"}>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Lelang Akan Berakhir</h3>
                    <Carousel>
                        <CarouselContent className="flex">
                            {Array.from({length: 5}).map((_, index) => (
                                <CarouselItem key={index} className="flex-none basis-1/2">
                                    <DummyAuctionCard endWithin={Math.floor(Math.random() * 5) + 1}/>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Lelang Terbaru</h3>
                    <div className={"grid grid-cols-2 gap-2"}>
                        {Array.from({length: totalDummy}).map((_, index) => (
                            <DummyAuctionCard/>
                        ))}
                    </div>
                    <Button className={"bg-orange-600 hover:bg-orange-700 w-full mt-4"}
                            onClick={() => setTotalDummy(prev => prev + 10)}>
                        Tampilkan Lebih Banyak
                    </Button>
                </div>
            </div>
        </div>
    )
}
