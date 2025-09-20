import {createFileRoute} from '@tanstack/react-router'
import {Skeleton} from "@/components/ui/skeleton";
import {Separator} from "@/components/ui/separator";
import {Info} from "lucide-react";
import {Button} from "@/components/ui/button";

export const Route = createFileRoute('/_pages/_main/profile/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="grid grid-rows-[1fr] gap-6 p-4">
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
                    <h3>Lorem ipsum dolor sit.</h3>
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-muted-foreground">Email</h3>
                    <h3>Lorem ipsum dolor sit.</h3>
                </div>
            </div>
            <Separator/>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-muted-foreground">Terakhir Login Pada</h3>
                    <h3>17 Agustus 2025 07:40</h3>
                </div>
                <Button variant={"outline"}>
                    Keluar Akun
                </Button>
            </div>
        </div>
    )
}
