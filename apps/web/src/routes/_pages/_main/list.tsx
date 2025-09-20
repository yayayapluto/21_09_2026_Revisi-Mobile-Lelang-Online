import {createFileRoute} from '@tanstack/react-router'
import React from "react";
import {DummyAuctionCard} from "@/components/dummy-auction-card";
import {Input} from "@/components/ui/input";
import {ChevronDown, SearchIcon, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";

export const Route = createFileRoute('/_pages/_main/list')({
    component: RouteComponent,
})

function RouteComponent() {
    const totalDummy = Math.floor(Math.random() * 10) + 1;
    const [sortBy, setSortBy] = React.useState<string | undefined>()
    const [filter, setFilter] = React.useState<{ objectType?: string, organizer?: string } | undefined>()
    return (
        <div>
            <div
                className="w-full p-2 sticky top-0 bg-white z-10 flex flex-col gap-4"
            >
                <div className="flex-1 flex gap-4 items-center justify-between">
                    <div className={"relative w-full"}>
                        <Input
                            type="text"
                            placeholder="Cari barang lelang"
                            className="pl-10"
                        />
                        <SearchIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"/>
                    </div>
                </div>
                <div className={"flex-1 flex gap-2 items-center justify-between"}>
                    {(sortBy !== undefined || filter !== undefined) && (
                        <Button
                            variant={"outline"}
                            className={"border-2 border-red-500/80 hover:border-red-600/80 text-red-500 bg-red-500/20"}
                            onClick={() => {
                                setFilter(undefined)
                                setSortBy(undefined)
                            }}
                        >
                            <Trash/>
                            Reset
                        </Button>
                    )}
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex-1 text-muted-foreground flex items-center justify-between"
                            >
                                <span>Urutkan</span>
                                <ChevronDown/>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className={"text-lg"}>Urutkan</DrawerTitle>
                                <DrawerDescription>Pilih opsi pengurutan yang kamu mau</DrawerDescription>
                            </DrawerHeader>
                            <div className="py-2 px-4 flex flex-col gap-6">
                                <RadioGroup
                                    value={sortBy}
                                    onValueChange={(val) => setSortBy(val)}
                                    className="flex flex-col gap-4"
                                >
                                    {Array.from({length: 4}, (_, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="flex flex-row items-center justify-between">
                                                <Label
                                                    htmlFor={`sort-${i}`}
                                                    className="text-lg font-normal"
                                                >
                                                    Opsi {i + 1}
                                                </Label>
                                                <RadioGroupItem id={`sort-${i}`} value={`sort-${i}`}/>
                                            </div>
                                            <Separator orientation="horizontal"/>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                            <DrawerFooter>
                                <DrawerClose>
                                    <Button className={"w-full"}>
                                        Terapkan
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex-1 text-muted-foreground flex items-center justify-between"
                            >
                                <span>Filter</span>
                                <ChevronDown/>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="flex flex-col h-full">
                            <DrawerHeader>
                                <DrawerTitle className={"text-lg"}>Filter</DrawerTitle>
                            </DrawerHeader>
                            <Separator/>
                            <ScrollArea className={"flex-1 overflow-y-auto"}>
                                <div className="flex flex-col gap-2">
                                    <div className="py-2 px-4 space-y-4">
                                        <h3 className="font-medium">Tipe Objek Lelang</h3>
                                        <RadioGroup
                                            value={filter?.objectType}
                                            onValueChange={(val) =>
                                                setFilter((prev) => ({...prev, objectType: val}))
                                            }
                                            className="flex flex-col gap-4"
                                        >
                                            {Array.from({length: 5}, (_, i) => (
                                                <div key={i}
                                                     className="flex flex-row items-center justify-between pr-4">
                                                    <Label
                                                        htmlFor={`obj-${i}`}
                                                        className="font-normal"
                                                    >
                                                        Opsi Ke-{i + 1}
                                                        <span className="text-sm text-muted-foreground">
                                                                ({Math.floor(Math.random() * 300)})
                                                            </span>
                                                    </Label>
                                                    <RadioGroupItem id={`obj-${i}`} value={`obj-${i}`}/>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    <Separator/>
                                    <div className="py-2 px-4 flex flex-col gap-6">
                                        <h3 className="font-medium">Penyelenggara</h3>
                                        <RadioGroup
                                            value={filter?.organizer}
                                            onValueChange={(val) =>
                                                setFilter((prev) => ({...prev, organizer: val}))
                                            }
                                            className="flex flex-col gap-4"
                                        >
                                            {Array.from({length: 10}, (_, i) => (
                                                <div key={i}
                                                     className="flex flex-row items-center justify-between pr-4">
                                                    <Label
                                                        htmlFor={`org-${i}`}
                                                        className="font-normal"
                                                    >
                                                        Opsi Ke-{i + 1}
                                                        <span className="text-sm text-muted-foreground">
                                                                ({Math.floor(Math.random() * 300)})
                                                            </span>
                                                    </Label>
                                                    <RadioGroupItem id={`org-${i}`} value={`org-${i}`}/>
                                                </div>
                                            ))}
                                        </RadioGroup>

                                    </div>
                                </div>
                            </ScrollArea>
                            <DrawerFooter>
                                <DrawerClose>
                                    <Button className={"w-full"}>
                                        Terapkan
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
            <div className="px-2 py-4 flex flex-col gap-6">
                <div className="space-y-2">
                    <h3 className="text-sm flex gap-1 items-baseline">
                        Total
                        <span className="text-lg font-medium">{totalDummy}</span>
                        lelang ditemukan
                    </h3>
                    <div className={"grid grid-cols-2 gap-2"}>
                        {Array.from({length: totalDummy}).map((_, index) => (
                            <DummyAuctionCard/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
