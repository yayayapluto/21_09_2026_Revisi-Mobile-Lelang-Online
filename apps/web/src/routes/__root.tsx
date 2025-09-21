import Loader from "@/components/loader";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/sonner";
import {createRootRouteWithContext, HeadContent, Outlet, redirect, useRouterState,} from "@tanstack/react-router";
import "../index.css";
import Cookies from "js-cookie";
import axios from "axios";
import type {ApiResponse} from "../../types/api-response";

export interface RouterAppContext {
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
    component: RootComponent,
    head: () => ({
        meta: [
            { title: "revisi-mobile-lelang-online" },
            {
                name: "description",
                content: "revisi-mobile-lelang-online is a web application",
            },
        ],
        links: [{ rel: "icon", href: "/favicon.ico" }],
    }),
})


function RootComponent() {
    const isFetching = useRouterState({
        select: (s) => s.isLoading,
    });

    return (
        <>
            <HeadContent/>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                disableTransitionOnChange
                storageKey="vite-ui-theme"
            >
                <div className="mx-auto max-w-md h-svh flex flex-col scroll-smooth">
                    <Toaster richColors position="top-center"/>
                    <div className="flex-1 container mx-auto antialiased">
                        <Outlet/>
                    </div>
                </div>

            </ThemeProvider>
            {/*<TanStackRouterDevtools position="bottom-left" />*/}
        </>
    );
}
