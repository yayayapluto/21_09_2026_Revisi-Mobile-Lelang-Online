import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Button} from "@/components/ui/button";
import React from "react";
import {z} from "zod";
import axios from "axios";
import type {ApiResponse} from "../../../../../types/api-response";
import Cookies from "js-cookie";

const SearchSchema = z.object({
    order_id: z.number(),
    redirect: z.string(),
})

export const Route = createFileRoute(
    '/_pages/_main/bidder-form/payment-confirmation'
)({
    component: RouteComponent,
    validateSearch: (search) => SearchSchema.parse(search),
})

function RouteComponent() {
    const navigate = useNavigate()
    const { order_id, redirect } = Route.useSearch()

    const [status, setStatus] = React.useState<"loading" | "success" | "failed">("loading")
    const [countdown, setCountdown] = React.useState(3)

    React.useEffect(() => {
        const auth_token = Cookies.get("auth_token")
        axios
            .post<ApiResponse>(
                `${import.meta.env.VITE_SERVER_URL}/midtrans/payment-callback/${order_id}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${auth_token}`,
                    },
                },
            )
            .then((res) => {
                if (res.data.success) {
                    setStatus("success")
                } else {
                    setStatus("failed")
                }
            })
            .catch(() => setStatus("failed"))
    }, [order_id])

    React.useEffect(() => {
        if (status === "success") {
            const interval = setInterval(() => {
                setCountdown((c) => {
                    if (c <= 1) {
                        clearInterval(interval)
                        navigate({ to: redirect})
                        return 0
                    }
                    return c - 1
                })
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [status, navigate])

    return (
        <div className="h-svh flex flex-col px-4 py-6 gap-2 justify-between">
            <div className="flex-1 flex flex-col gap-4 items-center justify-center">
                {status === "loading" && (
                    <>
                        <img
                            className="aspect-square animate-pulse object-contain"
                            src={"/public/illustrations/payment_loading.png"}
                            alt=""
                        />
                        <h3 className="text-xl font-medium">Sedang memverifikasi pembayaran...</h3>
                    </>
                )}

                {status === "success" && (
                    <>
                        <img
                            className="aspect-square animate-bounce object-contain"
                            src={"/public/illustrations/payment_success.png"}
                            alt=""
                        />
                        <h3 className="text-xl font-medium">Pembayaran sudah terverifikasi!</h3>
                        <p className="text-muted-foreground text-justify text-pretty">
                            Kamu bisa lanjut bla bla Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque, cumque!
                        </p>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <img
                            className="aspect-square object-contain"
                            src={"/public/illustrations/payment_failed.png"}
                            alt=""
                        />
                        <h3 className="text-xl font-medium">Verifikasi pembayaran gagal</h3>
                        <p className="text-muted-foreground text-justify text-pretty">
                            Silakan coba lagi atau hubungi admin.
                        </p>
                    </>
                )}
            </div>

            <p className="text-center text-xs text-muted-foreground">
                Kamu akan dialihkan dalam
                <span className="text-sm font-medium mx-1">{countdown}</span>
                detik
            </p>
            <Button
                disabled={countdown > 0}
                onClick={() => navigate({ to: "/detail/$id", params: { id: "1" }, search: { bidder: true } })}
            >
                Klik disini jika kamu belum dialihkan
            </Button>
        </div>
    )
}
