import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";

export const Route = createFileRoute('/_pages/_main/bidder-form/dummy-payment')(
    {
        component: RouteComponent,
    },
)

function RouteComponent() {
    const navigate = useNavigate()
    return (
        <div className="h-svh flex flex-col px-4 py-6 gap-10 justify-between">
            <Skeleton className={"bg-gray-300 aspect-[3/4]"}/>
            <Button onClick={() => navigate({to: "/bidder-form/after-payment"})}>
                Return to merchant's page
            </Button>
        </div>
    )
}
