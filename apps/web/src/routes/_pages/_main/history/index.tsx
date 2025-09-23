import {createFileRoute} from '@tanstack/react-router'
import axios from "axios";
import Cookies from "js-cookie";
import type {ApiResponse} from "../../../../../types/apiResponse";
import type {Pagination} from "../../../../../types/pagination";
import type {User} from "../../../../../types/user";
import React from "react";
import type {BidderPayment} from "../../../../../types/bidderPayment";
import {useInfiniteQuery} from "@tanstack/react-query";
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
import {HistoryCard} from "@/components/history-card";

export const Route = createFileRoute('/_pages/_main/history/')({
    component: HistoryPage
})

const fetchHistories = async ({
                                  pageParam = 1,
                                  search,
                                  sortBy,
                                  sortDir,
                                  status,
                                  payment_type,
                              }: {
    pageParam?: number;
    search?: string;
    sortBy?: string;
    sortDir?: string;
    status?: string;
    payment_type?: string;
}): Promise<ApiResponse<Pagination<BidderPayment>>> => {
    const token = Cookies.get("auth_token")

    // Get user ID first
    const userResponse = await axios.get<ApiResponse<User>>(
        `${import.meta.env.VITE_SERVER_URL}/auth/me`,
        {headers: {Authorization: `Bearer ${token}`}}
    )
    const userID = userResponse.data.content?.id

    const params = new URLSearchParams({
        page: pageParam.toString(),
        ...(search && {search}),
        ...(sortBy && {sortBy}),
        ...(sortDir && {sortDir}),
        ...(status && {status}),
        ...(payment_type && {payment_type}),
    })

    const response = await axios.get<ApiResponse<Pagination<BidderPayment>>>(
        `${import.meta.env.VITE_SERVER_URL}/payment/history?user_id=${userID}&${params}`,
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    )
    return response.data
}

function HistoryPage() {
    const [search, setSearch] = React.useState("")
    const [selectedSort, setSelectedSort] = React.useState("")
    const [filters, setFilters] = React.useState<{
        search: string
        sortBy?: string
        sortDir?: string
        status?: string
        payment_type?: string
    }>({search: ""})

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['payment-histories', filters],
        queryFn: ({pageParam}) => fetchHistories({pageParam, ...filters}),
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.content?.current_page ?? 1
            const totalPages = lastPage.content?.total_pages ?? 1
            return currentPage < totalPages ? currentPage + 1 : undefined
        },
        initialPageParam: 1,
    })

    const paymentHistories = data?.pages.flatMap(page => page.content?.data ?? []) ?? []
    const totalHistories =
        (data?.pages?.[0]?.content?.total_pages ?? 0) *
        (data?.pages?.[0]?.content?.per_page ?? 0) ||
        paymentHistories.length

    const sortOptions = [
        {value: 'newest', label: 'Terbaru', sortBy: 'created_at', sortDir: 'desc'},
        {value: 'oldest', label: 'Terlama', sortBy: 'created_at', sortDir: 'asc'},
        {value: 'amount_asc', label: 'Nominal Terendah', sortBy: 'amount', sortDir: 'asc'},
        {value: 'amount_desc', label: 'Nominal Tertinggi', sortBy: 'amount', sortDir: 'desc'},
    ]

    const statusOptions = [
        {value: 'pending', label: 'Pending'},
        {value: 'success', label: 'Berhasil'},
        {value: 'failed', label: 'Gagal'},
    ]

    const paymentTypeOptions = [
        {value: 'deposit', label: 'Deposit'},
        {value: 'final', label: 'Final'},
    ]

    const resetFilters = () => {
        setFilters({search: ""})
        setSearch("")
        setSelectedSort("")
    }

    const hasActiveFilters =
        filters.sortBy || filters.sortDir || filters.status || filters.payment_type || filters.search !== ""

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
                        placeholder="Cari riwayat pembayaran"
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
                                        <h3 className="font-medium">Status</h3>
                                        <RadioGroup
                                            value={filters.status}
                                            onValueChange={(val) => setFilters(prev => ({...prev, status: val}))}
                                        >
                                            {statusOptions.map(status => (
                                                <div key={status.value} className="flex justify-between py-2">
                                                    <Label htmlFor={`status-${status.value}`}>
                                                        {status.label}
                                                    </Label>
                                                    <RadioGroupItem id={`status-${status.value}`}
                                                                    value={status.value}/>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    <Separator/>
                                    <div>
                                        <h3 className="font-medium">Tipe Pembayaran</h3>
                                        <RadioGroup
                                            value={filters.payment_type}
                                            onValueChange={(val) => setFilters(prev => ({...prev, payment_type: val}))}
                                        >
                                            {paymentTypeOptions.map(type => (
                                                <div key={type.value} className="flex justify-between py-2">
                                                    <Label htmlFor={`type-${type.value}`}>
                                                        {type.label}
                                                    </Label>
                                                    <RadioGroupItem id={`type-${type.value}`}
                                                                    value={type.value}/>
                                                </div>
                                            ))}
                                        </RadioGroup>
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
                    Total <span className="text-lg font-medium">{isLoading ? '...' : totalHistories}</span> riwayat
                    pembayaran
                </h3>
                {isLoading ? (
                    <div className="h-40 flex items-center justify-center">
                        <LoaderCircle className="animate-spin"/>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 mt-4">
                        {paymentHistories.map((payment, index) => (
                            <HistoryCard key={`${payment.id}-${index}`} {...payment}/>
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