import {createFileRoute, redirect, useNavigate} from '@tanstack/react-router'
import React from "react";
import {Button} from "@/components/ui/button";
import Cookies from "js-cookie";
import axios from "axios";
import type {ApiResponse} from "../../../types/api-response";

export const Route = createFileRoute('/_pages/authGateway')({
    component: RouteComponent,
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
})

function RouteComponent() {
    const navigate = useNavigate();
    return (
        <div className="h-full flex flex-col justify-end gap-12 px-4 py-6">
            <img className="border-1 aspect-square object-cover"
                 src="https://placehold.co/400/white/gray?text=Aman+Banget+Sih" alt=""/>
            <div className="flex flex-col justify-center text-center space-y-4">
                <h3 className="text-xl font-semibold">
                    Yuk, Siapkan Akun Kamu
                </h3>
                <p className={"antialiased"}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aperiam dolores laborum reprehenderit.
                </p>
            </div>

            <div className="space-y-2">
                <Button className="bg-orange-600 hover:bg-orange-700 w-full rounded-full"
                        onClick={() => navigate({to: "/login", search: {fallback: "", reason: undefined}})}>
                    Masuk Ke Aplikasi
                </Button>
                <Button variant="outline"
                        className="border-orange-600 hover:border-orange-700 text-orange-600 hover:text-orange-700 w-full rounded-full"
                        onClick={() => navigate({to: "/register"})}>
                    Belum punya akun? Daftar
                </Button>
            </div>
        </div>
    )
}

