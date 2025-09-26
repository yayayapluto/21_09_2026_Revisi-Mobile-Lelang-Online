import {createFileRoute, Outlet, redirect, useLoaderData, useLocation, useRouterState} from '@tanstack/react-router'
import React, {createContext} from "react";
import {Footer} from "@/components/footer";
import {AnimatePresence, motion} from "framer-motion";
import axios from "axios";
import type {ApiResponse} from "../../../../types/apiResponse";
import Cookies from "js-cookie";
import Loader from "@/components/loader";
import type {User} from "../../../../types/user";
import {AuthDataContext} from "@/contexts/authDataContext";

let cachedUser: ApiResponse<User> | null = null
const fetchUserData = async (): Promise<ApiResponse<User>> => {
    if (cachedUser) return cachedUser
    const token = Cookies.get("auth_token")
    const res = await axios.get<ApiResponse<User>>(
        `${import.meta.env.VITE_SERVER_URL}/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
    cachedUser = res.data!
    return cachedUser
}

export const Route = createFileRoute('/_pages/_main')({
    loader: async ({ location }) => {
        const token = Cookies.get("auth_token")
        if (!token) {
            throw redirect({
                to: "/login",
                search: { fallback: location.pathname, reason: "no-token" },
            })
        }

        try {
            const res = await fetchUserData()
            if (!res.success || !res.content) {
                throw redirect({
                    to: "/login",
                    search: { fallback: location.pathname, reason: "expired" },
                })
            }
            return res.content
        } catch {
            throw redirect({
                to: "/login",
                search: { fallback: location.pathname, reason: "expired" },
            })
        }
    },
    loaderDeps: () => ["auth_data"],
    gcTime: Infinity,
    staleTime: Infinity,
    component: RouteComponent,
})

function RouteComponent() {
    const location = useLocation();
    const isFetching = useRouterState({
        select: (s) => s.isLoading,
    });
    const authData = useLoaderData({from: "/_pages/_main"}) as User | undefined

    return (
        <AuthDataContext value={authData}>
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
        </AuthDataContext>
    )
}
