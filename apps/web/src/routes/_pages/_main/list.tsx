import {createFileRoute} from '@tanstack/react-router'
import React from "react";
import {Input} from "@/components/ui/input";
import {ChevronDown, LoaderCircle, SearchIcon, Trash} from "lucide-react";
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
import {useInfiniteQuery} from "@tanstack/react-query";
import axios from "axios";
import type {ApiResponse} from "../../../../types/apiResponse";
import type {Pagination} from "../../../../types/pagination";
import type {Auction} from "../../../../types/auction";
import type {ObjectType} from "../../../../types/objectType";
import type {Organizer} from "../../../../types/organizer";
import Cookies from "js-cookie";
import {AuctionCard} from "@/components/auction-card";

export const Route = createFileRoute('/_pages/_main/list')({
    component: RouteComponent,
})

const fetchAuctions = async ({
                                 pageParam = 1,
                                 search,
                                 sortBy,
                                 sortDir,
                                 objectType,
                                 organizer
                             }: {
    pageParam?: number;
    search?: string;
    sortBy?: string;
    sortDir?: string;
    objectType?: string;
    organizer?: string;
}): Promise<ApiResponse<Pagination<Auction>>> => {
    const token = Cookies.get("auth_token")
    const params = new URLSearchParams({
        page: pageParam.toString(),
        ...(search && {search}),
        ...(sortBy && {sortBy}),
        ...(sortDir && {sortDir}),
        ...(objectType && {objectTypeID: objectType}),
        ...(organizer && {organizerID: organizer}),
    })

    const response = await axios.get<ApiResponse<Pagination<Auction>>>(
        `${import.meta.env.VITE_SERVER_URL}/auctions?${params}`,
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    )
    return response.data
}

const fetchObjectTypes = async ({pageParam = 1}): Promise<ApiResponse<Pagination<ObjectType>>> => {
    const token = Cookies.get("auth_token")
    const response = await axios.get<ApiResponse<Pagination<ObjectType>>>(
        `${import.meta.env.VITE_SERVER_URL}/objectTypes?page=${pageParam}&size=10`,
        {headers: {Authorization: `Bearer ${token}`}}
    )
    return response.data
}

const fetchOrganizers = async ({pageParam = 1}): Promise<ApiResponse<Pagination<Organizer>>> => {
    const token = Cookies.get("auth_token")
    const response = await axios.get<ApiResponse<Pagination<Organizer>>>(
        `${import.meta.env.VITE_SERVER_URL}/organizers?page=${pageParam}&size=10`,
        {headers: {Authorization: `Bearer ${token}`}}
    )
    return response.data
}

function RouteComponent() {
    const [search, setSearch] = React.useState("")
    const [filters, setFilters] = React.useState<{
        search: string
        sortBy?: string
        sortDir?: string
        objectType?: string
        organizer?: string
    }>({search: ""})

    const {
        data: objectTypesData,
        fetchNextPage: fetchNextObjectTypes,
        hasNextPage: hasNextObjectTypes,
        isFetchingNextPage: fetchingNextObjectTypes
    } = useInfiniteQuery({
        queryKey: ['objectTypes'],
        queryFn: fetchObjectTypes,
        getNextPageParam: (lastPage) => {
            const curr = lastPage.content?.current_page ?? 1
            const total = lastPage.content?.total_pages ?? 1
            return curr < total ? curr + 1 : undefined
        },
        initialPageParam: 1,
    })

    const objectTypes = objectTypesData?.pages.flatMap(p => p.content?.data ?? []) ?? []

    const {
        data: organizersData,
        fetchNextPage: fetchNextOrganizers,
        hasNextPage: hasNextOrganizers,
        isFetchingNextPage: fetchingNextOrganizers
    } = useInfiniteQuery({
        queryKey: ['organizers'],
        queryFn: fetchOrganizers,
        getNextPageParam: (lastPage) => {
            const curr = lastPage.content?.current_page ?? 1
            const total = lastPage.content?.total_pages ?? 1
            return curr < total ? curr + 1 : undefined
        },
        initialPageParam: 1,
    })

    const organizers = organizersData?.pages.flatMap(p => p.content?.data ?? []) ?? []

    const [selectedSort, setSelectedSort] = React.useState("")

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['auctions', 'list', filters],
        queryFn: ({pageParam}) => fetchAuctions({pageParam, ...filters}),
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.content?.current_page ?? 1
            const totalPages = lastPage.content?.total_pages ?? 1
            return currentPage < totalPages ? currentPage + 1 : undefined
        },
        initialPageParam: 1,
    })

    const auctions = data?.pages.flatMap(page => page.content?.data ?? []) ?? []
    const totalAuctions = data?.pages[0].content?.total_items


    const sortOptions = [
        {value: 'newest', label: 'Terbaru', sortBy: 'created_at', sortDir: 'asc'},
        {value: 'oldest', label: 'Terlama', sortBy: 'created_at', sortDir: 'desc'},
        {value: 'price_asc', label: 'Harga Terendah', sortBy: 'price', sortDir: 'asc'},
        {value: 'price_desc', label: 'Harga Tertinggi', sortBy: 'price', sortDir: 'desc'},
    ]

    const resetFilters = () => {
        setFilters({search: ""})
        setSearch("")
    }

    const hasActiveFilters =
        filters.sortBy || filters.sortDir || filters.objectType || filters.organizer || filters.search !== ""

    const observerRef = React.useRef<HTMLDivElement | null>(null)
    React.useEffect(() => {
        if (!observerRef.current) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            {threshold: 1.0}
        )
        observer.observe(observerRef.current)
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current)
        }
    }, [observerRef.current, hasNextPage, isFetchingNextPage])

    return (
        <div>
            <div className="w-full p-2 sticky top-0 bg-white z-10 flex flex-col gap-4">
                <div className="relative w-full">
                    <Input
                        type="text"
                        placeholder="Cari barang lelang"
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyUp={() => setFilters((prev) => ({...prev, search}))}
                    />
                    <SearchIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"/>
                </div>
                <div className="flex gap-2 items-center">
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            className="border-2 border-red-500/80 hover:border-red-600/80 text-red-500 bg-red-500/20"
                            onClick={resetFilters}
                        >
                            <Trash/>
                            Reset
                        </Button>
                    )}
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className="flex-1 flex justify-between">
                                <span>Urutkan</span>
                                <ChevronDown/>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className="text-lg">Urutkan</DrawerTitle>
                                <DrawerDescription>Pilih opsi pengurutan</DrawerDescription>
                            </DrawerHeader>
                            <div className="py-2 px-4">
                                <RadioGroup
                                    value={selectedSort}
                                    onValueChange={(val) => {
                                        setSelectedSort(val)
                                        const selected = sortOptions.find(opt => opt.value === val)
                                        if (selected) {
                                            setFilters(prev => ({
                                                ...prev,
                                                sortBy: selected.sortBy,
                                                sortDir: selected.sortDir,
                                            }))
                                        }
                                    }}
                                >
                                    {sortOptions.map((option, i) => (
                                        <div key={option.value} className="flex justify-between items-center py-2">
                                            <Label htmlFor={`sort-${i}`}>{option.label}</Label>
                                            <RadioGroupItem id={`sort-${i}`} value={option.value}/>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button className="w-full">Terapkan</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className="flex-1 flex justify-between">
                                <span>Filter</span>
                                <ChevronDown/>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="flex flex-col h-full">
                            <DrawerHeader>
                                <DrawerTitle className="text-lg">Filter</DrawerTitle>
                            </DrawerHeader>
                            <Separator/>
                            <ScrollArea className="flex-1 overflow-y-auto">
                                <div className="p-4 space-y-6">
                                    <div>
                                        <h3 className="font-medium">Tipe Objek Lelang</h3>
                                        <RadioGroup
                                            value={filters.objectType}
                                            onValueChange={(val) => setFilters(prev => ({...prev, objectType: val}))}
                                        >
                                            {objectTypes.map(objectType => (
                                                <div key={objectType.id} className="flex justify-between py-2">
                                                    <Label htmlFor={`obj-${objectType.id}`}>
                                                        {objectType.name}
                                                    </Label>
                                                    <RadioGroupItem id={`obj-${objectType.id}`}
                                                                    value={objectType.id.toString()}/>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        {hasNextObjectTypes && (
                                            <Button
                                                onClick={() => fetchNextObjectTypes()}
                                                disabled={fetchingNextObjectTypes}
                                                variant="outline"
                                                className="w-full mt-2"
                                            >
                                                {fetchingNextObjectTypes ? "Memuat..." : "Muat lagi"}
                                            </Button>
                                        )}
                                    </div>
                                    <Separator/>
                                    <div>
                                        <h3 className="font-medium">Penyelenggara</h3>
                                        <RadioGroup
                                            value={filters.organizer}
                                            onValueChange={(val) => setFilters(prev => ({...prev, organizer: val}))}
                                        >
                                            {organizers.map(organizer => (
                                                <div key={organizer.id} className="flex justify-between py-2">
                                                    <Label htmlFor={`org-${organizer.id}`}>
                                                        {organizer.name}
                                                    </Label>
                                                    <RadioGroupItem id={`org-${organizer.id}`}
                                                                    value={organizer.id.toString()}/>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        {hasNextOrganizers && (
                                            <Button
                                                onClick={() => fetchNextOrganizers()}
                                                disabled={fetchingNextOrganizers}
                                                variant="outline"
                                                className="w-full mt-2"
                                            >
                                                {fetchingNextOrganizers ? "Memuat..." : "Muat lagi"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </ScrollArea>
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button className="w-full">Terapkan</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
            <div className="px-2 py-4">
                <h3 className="text-sm flex gap-1 items-baseline">
                    Total <span className="text-lg font-medium">{isLoading ? '...' : totalAuctions}</span> lelang ditemukan
                </h3>
                {isLoading ? (
                    <div className="h-40 flex items-center justify-center">
                        <LoaderCircle className="animate-spin"/>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {auctions.map((auction, index) => (
                            <AuctionCard auction={auction} key={`${auction.id}-${index}`}/>
                        ))}
                    </div>
                )}
                <div ref={observerRef} className="h-10"/>
                {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                        <LoaderCircle className="animate-spin"/>
                    </div>
                )}
            </div>
        </div>
    )
}