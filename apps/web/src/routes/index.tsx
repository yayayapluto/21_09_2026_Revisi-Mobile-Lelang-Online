import {createFileRoute, Link, redirect, useNavigate} from "@tanstack/react-router";
import {Button} from "@/components/ui/button";
import {Carousel, type CarouselApi, CarouselContent, CarouselItem,} from "@/components/ui/carousel"
import React from "react";
import {cn} from "@/lib/utils";
import Cookies from "js-cookie";
import axios from "axios";
import type {ApiResponse} from "../../types/api-response";

export const Route = createFileRoute("/")({
    component: HomeComponent,
    beforeLoad: async (): Promise<void> => {
        const token = Cookies.get("auth_token")
        if (token) {
            const res = await axios.get<ApiResponse>(
                `${import.meta.env.VITE_SERVER_URL}/auth/me`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (res.data.success) {
                throw redirect({ to: "/home" })
            }
        }
    },
});

function HomeComponent() {
    const GREETING_CONTENT = [
        {
            image_url: "/public/illustrations/index_1.png",
            title: "Selamat Datang di Leon",
            subtitle: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, aspernatur"
        },
        {
            image_url: "/public/illustrations/index_2.png",
            title: "Bla bla womp womp",
            subtitle: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, aspernatur"
        },
        {
            image_url: "/public/illustrations/index_3.png",
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
                                <img className={"aspect-square size-full object-contain"} src={item.image_url}
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
