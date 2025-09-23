import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Skeleton} from "@/components/ui/skeleton";
import {Separator} from "@/components/ui/separator";
import {Info} from "lucide-react";
import {Button} from "@/components/ui/button";
import type {User} from "../../../../../types/user";
import Cookies from "js-cookie";
import axios from "axios";
import type {ApiResponse} from "../../../../../types/apiResponse";

const fetchProfileData = async (): Promise<User> => {
    const token = Cookies.get("auth_token")
    const response = await axios.get<ApiResponse<User>>(
        `${import.meta.env.VITE_SERVER_URL}/auth/me`,
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    )
    return response.data.content!
}

export const Route = createFileRoute('/_pages/_main/profile/')({
    component: RouteComponent,
    loader: () => fetchProfileData()
})

function RouteComponent() {
    const navigate = useNavigate()
    const profile = Route.useLoaderData()
    return (
        <div className="h-full flex flex-col justify-center gap-8 p-4">
            <div className="flex items-center justify-center">
                <Skeleton className={"size-24 rounded-full"}/>
            </div>
            <Separator/>
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Info className={"size-6"}/>
                    Info Profil
                </h3>
                <div className="flex items-center justify-between">
                    <h3 className="text-muted-foreground">Username</h3>
                    <h3>{profile.username}</h3>
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-muted-foreground">Email</h3>
                    <h3>{profile.email}</h3>
                </div>
            </div>
            <Separator/>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-muted-foreground">Terakhir Login Pada</h3>
                    <h3>{profile.last_login_at?.toString()}</h3>
                </div>
                <Button
                    variant="outline"
                    onClick={async () => {
                        Cookies.remove("auth_token")
                        await navigate({to: "/login", search: {fallback: "", reason: undefined}})
                    }}
                >
                    Keluar Akun
                </Button>

            </div>
        </div>
    )
}
