import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Button} from "@/components/ui/button";
import {Check} from "lucide-react";
import {useEffect, useState} from "react";

export const Route = createFileRoute('/_pages/_main/bidder-form/after-payment')(
    {
        component: RouteComponent,
    },
)

function RouteComponent() {
    const navigate = useNavigate()

    const [cd, setCd] = useState(5)
    useEffect(() => {
        if (cd <= 0) {
            navigate({to: '/detail/$id', params: {id: '1'}, search: {bidder: true}}) // set query bidder=true deh
            return
        }
        const timer = setInterval(() => {
            setCd((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [cd, navigate])

    return (
        <div className="h-svh flex flex-col px-4 py-6 gap-2 justify-between">
            <div className="flex-1 flex flex-col gap-4 items-center justify-center">
                <Check className={"size-24 animate-bounce text-green-500"}/>
                <h3 className="text-xl font-medium">Pembayaran sudah terverifikasi!</h3>
                <p className="text-muted-foreground text-justify text-pretty">Kamu bisa lanjut bla bla Lorem ipsum dolor
                    sit amet, consectetur adipisicing elit. Atque, cumque!</p>
            </div>
            <p className={"text-center text-xs text-muted-foreground"}>
                Kamu akan dialihkan dalam
                <span className="text-sm font-medium mx-1">{cd}</span>
                detik
            </p>
            <Button onClick={() => navigate({to: '/detail/$id', params: {id: '1'}, search: {bidder: true}})}>
                Klik disini jika kamu belum dialihkan
            </Button>
        </div>
    )
}
