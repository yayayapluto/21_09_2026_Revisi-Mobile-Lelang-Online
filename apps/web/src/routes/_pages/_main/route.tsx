import {createFileRoute, Outlet, useLocation, useNavigate} from '@tanstack/react-router'
import {Input} from "@/components/ui/input";
import {ArrowLeft, ChevronDown, SearchIcon, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area"
import React from "react";
import {Footer} from "@/components/footer";
import {AnimatePresence, motion} from "framer-motion";

export const Route = createFileRoute('/_pages/_main')({
    component: RouteComponent,
})

function RouteComponent() {
    const location = useLocation();
    return (
        <div className={"h-full flex flex-col"}>
            <AnimatePresence mode={"wait"}>
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.05, ease:"easeInOut"}}
                    className={"flex-1"}
                >
                    <Outlet/>
                </motion.div>
            </AnimatePresence>
            {["/home","/list","/history","/profile"].includes(location.pathname) && <Footer/>}
        </div>
    )
}
