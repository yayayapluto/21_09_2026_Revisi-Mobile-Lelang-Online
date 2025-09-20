import {useLocation, useNavigate} from "@tanstack/react-router";
import type {ReactNode} from "react";

export const PageHeader = ({children}: { children: ReactNode }) => {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <div
            className="w-full p-2 sticky top-0 bg-white z-10 flex flex-col gap-4"
        >
            {children}
        </div>
    )
}