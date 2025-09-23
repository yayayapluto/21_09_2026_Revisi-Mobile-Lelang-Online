import {createFileRoute, Outlet, redirect, useLocation, useRouterState} from '@tanstack/react-router'
import React from "react";
import {Footer} from "@/components/footer";
import {AnimatePresence, motion} from "framer-motion";
import axios from "axios";
import type {ApiResponse} from "../../../../types/api-response";
import Cookies from "js-cookie";
import Loader from "@/components/loader";

export const Route = createFileRoute('/_pages/_main')({
    beforeLoad: async ({location}) => {
        const token = Cookies.get("auth_token")
        if (!token) {
            throw redirect({to: "/login", search: {fallback: location.pathname, reason: "no-token"}})
        }

        try {
            const res = await axios.get<ApiResponse>(`${import.meta.env.VITE_SERVER_URL}/auth/me`, {
                headers: {Authorization: `Bearer ${token}`}
            })

            if (!res.data.success) {
                throw redirect({to: "/login", search: {fallback: location.pathname, reason: "expired"}})
            }
        } catch {
            throw redirect({to: "/login", search: {fallback: location.pathname, reason: "expired"}})
        }
    },
    component: RouteComponent,
})


function RouteComponent() {
    const location = useLocation();
    const isFetching = useRouterState({
        select: (s) => s.isLoading,
    });
    return (
        <div className="h-full flex flex-col">
            {isFetching ? (<Loader/>) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.05, ease: "easeInOut"}}
                        className="flex-1"
                    >
                        <Outlet/>
                    </motion.div>
                </AnimatePresence>
            )}
            {["/home", "/list", "/history", "/profile"].includes(location.pathname) && <Footer/>}
        </div>
    )
}
