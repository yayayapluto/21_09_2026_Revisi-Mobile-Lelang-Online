import {Link, useLocation} from "@tanstack/react-router";
import {Gavel, House, ScrollText, UserCircle} from "lucide-react";
import React from "react";
import {cn} from "@/lib/utils";

export const Footer = () => {
    const location = useLocation()
    const pathName = location.pathname
    return (
        <div className="flex flex-row items-center justify-around py-4 sticky bottom-0 z-50 bg-background border-t text-sm font-normal">
            <Link to="/home" className={cn("flex flex-col items-center gap-1", pathName.includes("home") ? "text-orange-600" : "")}>
                <House className="size-6"/>
                <span>Beranda</span>
            </Link>
            <Link to="/list" className={cn("flex flex-col items-center gap-1", pathName.includes("list") ? "text-orange-600" : "")}>
                <Gavel className="size-6" />
                <span>Lelang</span>
            </Link>
            <Link to="/history" className={cn("flex flex-col items-center gap-1", pathName.includes("history") ? "text-orange-600" : "")}>
                <ScrollText className="size-6" />
                <span>Riwayat</span>
            </Link>
            <Link to="/profile" className={cn("flex flex-col items-center gap-1", pathName.includes("profile") ? "text-orange-600" : "")}>
                <UserCircle className="size-6" />
                <span>Akun</span>
            </Link>
        </div>
    )
}