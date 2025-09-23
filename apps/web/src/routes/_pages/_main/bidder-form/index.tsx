import {createFileRoute, useSearch} from '@tanstack/react-router'
import {useForm} from '@tanstack/react-form'
import {z} from 'zod'
import {FieldInfo} from "@/components/field-info";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import React from "react";
import {toast} from "sonner";
import axios from "axios";
import type {ApiResponse} from "../../../../../types/apiResponse";
import Cookies from "js-cookie";
import type {Auction} from "../../../../../types/auction";
import type {AuctionBidder} from "../../../../../types/auctionBidder";

const BidderSchema = z.object({
    phone_number: z.string().min(10, "Nomor telepon tidak valid"),
    bank_name: z.string().min(1, "Nama bank wajib diisi"),
    account_number: z.string().min(1, "Nomor rekening wajib diisi"),
    account_name: z.string().min(1, "Nama pemilik rekening wajib diisi"),
})

export const Route = createFileRoute('/_pages/_main/bidder-form/')({
    component: RouteComponent,
    validateSearch: (search: Record<string, number>) => {
        return {auction_id: search?.auction_id}
    }
})

function RouteComponent() {
    const search = useSearch({from: '/_pages/_main/bidder-form/'})
    const auction_id = search.auction_id


    const form = useForm({
        defaultValues: {
            phone_number: '',
            bank_name: '',
            account_number: '',
            account_name: '',
        },
        validators: {
            onChange: BidderSchema
        },
        onSubmit: async ({value}) => {
            const auth_token = Cookies.get("auth_token");
            try {
                const res = await axios.post<ApiResponse<AuctionBidder>>(
                    `${import.meta.env.VITE_SERVER_URL}/auctions/${auction_id}/bidders`,
                    value,
                    {
                        headers: {
                            Authorization: `Bearer ${auth_token}`,
                        }
                    }
                )

                const auctionData = await axios.get<ApiResponse<Auction>>(`${import.meta.env.VITE_SERVER_URL}/auctions/${auction_id}`)
                    .then(res => res)
                    .then(data => data.data)
                    .then(content => content.content)

                const paymentRes = await axios.post<ApiResponse>(`${import.meta.env.VITE_SERVER_URL}/payment/initialize`, {
                    amount: auctionData?.item.deposit_price,
                    bidder_id: res.data.content?.id,
                    redirect_url: `${window.location.origin}/bidder-form/payment-confirmation?redirect=/detail/${auctionData?.id}`,
                    type: "deposit"
                }, {
                    headers: {
                        Authorization: `Bearer ${auth_token}`,
                    }
                })

                toast.success(res.data.message)
                window.location.href = paymentRes.data.content
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "Terjadi kesalahan")
            }
        }
    })

    return (
        <div className="h-full flex flex-col">
            <div className="w-full px-2 py-4 sticky top-0 bg-white z-10 flex gap-4 items-center">
                <div className="flex items-center justify-center" onClick={() => history.back()}>
                    <ArrowLeft className="size-6 text-gray-700"/>
                </div>
                <h3 className="text-xl font-normal">Form Bidder</h3>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit()
                }}
                className="flex-1 flex flex-col gap-6 justify-center px-4"
            >
                {["phone_number", "bank_name", "account_number", "account_name"].map((name) => (
                    <form.Field
                        key={name}
                        name={name as any}
                        children={(field) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor={field.name}>
                                    {{
                                        phone_number: "Nomor Telepon",
                                        bank_name: "Nama Bank",
                                        account_number: "Nomor Rekening",
                                        account_name: "Nama Pemilik Rekening",
                                    }[name]}
                                </Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={{
                                        phone_number: "cth: 0895xxxxxxxxx",
                                        bank_name: "cth: Bank BCA",
                                        account_number: "cth: 1234567890",
                                        account_name: "cth: A.N Farras",
                                    }[name]}
                                    type={name === "phone_number" || name === "account_number" ? "text" : "text"}
                                    inputMode={name === "phone_number" || name === "account_number" ? "numeric" : undefined}
                                    pattern={name === "phone_number" || name === "account_number" ? "[0-9]*" : undefined}
                                />
                                <FieldInfo field={field}/>
                            </div>
                        )}
                    />
                ))}


                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button type="submit" disabled={!canSubmit}>
                            {isSubmitting ? "..." : "Submit"}
                        </Button>
                    )}
                />
            </form>
        </div>
    )
}
