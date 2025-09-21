import {createFileRoute, Outlet} from '@tanstack/react-router'

export const Route = createFileRoute('/_pages/_auth')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="h-full">
            <Outlet/>
        </div>
    )
}
