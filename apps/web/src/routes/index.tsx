import {createFileRoute, Link, useNavigate} from "@tanstack/react-router";
import {Button} from "@/components/ui/button";
import {Carousel, type CarouselApi, CarouselContent, CarouselItem,} from "@/components/ui/carousel"
import React from "react";
import {cn} from "@/lib/utils";

export const Route = createFileRoute("/")({
    component: HomeComponent,
});

function HomeComponent() {
    const GREETING_CONTENT = [
        {
            image_url: "https://placehold.co/400/white/gray?text=Met+Datang",
            title: "Selamat Datang di Leon",
            subtitle: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, aspernatur"
        },
        {
            image_url: "https://placehold.co/400/white/gray?text=Ikut+Lelang",
            title: "Bla bla womp womp",
            subtitle: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, aspernatur"
        },
        {
            image_url: "https://placehold.co/400/white/gray?text=Aman+Banget+Sih",
            title: "Womp bla womp womp",
            subtitle: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, aspernatur"
        },
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

    const navigate = useNavigate()
    return (
        <div className="h-full flex flex-col justify-between px-4 py-6">
            <Link to={"/authGateway"} className={"text-orange-600 font-medium text-end"}>
                Lewati
            </Link>
            <div className={"space-y-8"}>
                <Carousel setApi={setApi}>
                    <CarouselContent>
                        {GREETING_CONTENT.map((item) => (
                            <CarouselItem>
                                <img className={"border-1 aspect-square size-full object-cover"} src={item.image_url}
                                     alt=""/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className={"w-full flex flex-row gap-2 justify-center"}>
                    {GREETING_CONTENT.map((_, index) => (
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
                <div className={"text-center space-y-2"}>
                    <h3 className="text-xl font-semibold">
                        {GREETING_CONTENT[current].title}
                    </h3>
                    <p>
                        {GREETING_CONTENT[current].subtitle}
                    </p>
                </div>
            </div>
            <Button
                className="bg-orange-600 hover:bg-orange-700 rounded-full"
                onClick={() => {
                    const nextIndex = current + 1
                    if (api && nextIndex < GREETING_CONTENT.length) {
                        api.scrollTo(nextIndex)
                    } else {
                        navigate({to: "/authGateway"})
                    }
                }}
            >
                Selanjutnya
            </Button>
        </div>
    );
}
