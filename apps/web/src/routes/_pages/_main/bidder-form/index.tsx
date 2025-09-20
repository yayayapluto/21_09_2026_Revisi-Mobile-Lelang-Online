import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {ArrowLeft} from "lucide-react";

export const Route = createFileRoute('/_pages/_main/bidder-form/')({
    component: RouteComponent,
})

function RouteComponent() {
    const FORM_STEPS = [
        {
            title: "Verifikasi Nomor Telepon",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit Aperiam asperiores dolores laboriosam, optio pariatur veritatis!",
            inputs: [
                {
                    label: "Nomor Telepon",
                    htmlName: "phone_number",
                    placeholder: "cth: 0895xxxxxxxxx"
                }
            ]
        },
        {
            title: "Verifikasi Data Bank",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit Aperiam asperiores dolores laboriosam, optio pariatur veritatis!",
            inputs: [
                {
                    label: "Nama Bank",
                    htmlName: "bank_name",
                    placeholder: "cth: bank xxxx"
                },
                {
                    label: "Nomor Rekening",
                    htmlName: "account_number",
                    placeholder: "cth: xxxxxxxxxxxx"
                },
                {
                    label: "Atas Nama (rekening)",
                    htmlName: "account_name",
                    placeholder: "cth: A.N xxxx"
                }
            ]
        }
    ]
    const [current, setCurrent] = useState(0)

    const navigate = useNavigate()
    return (
        <div className="h-full flex flex-col">
            <div
                className="w-full px-2 py-4 sticky top-0 bg-white z-10 flex flex-col gap-4"
            >
                <div className="flex-1 flex gap-4 items-center justify-start">
                    <div className="flex items-center justify-center" onClick={() => history.back()}>
                        <ArrowLeft className="size-6 text-gray-700"/>
                    </div>
                    <h3 className="text-xl font-normal">Pembelian NPL</h3>
                </div>
            </div>
            <div className="flex-1 flex flex-col px-4 py-6 justify-between">
                <div className="flex-1 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between">
                            <h3 className="text-lg font-medium">{FORM_STEPS[current].title}</h3>
                            <h3 className="text-muted-foreground">
                                {current + 1}
                                /
                                {FORM_STEPS.length}
                            </h3>
                        </div>
                        <Progress value={((current + 1) / FORM_STEPS.length) * 100}/>
                    </div>
                    <p className="text-justify text-pretty">{FORM_STEPS[current].description}</p>
                    <div className="flex flex-col gap-4">
                        {FORM_STEPS[current].inputs.map((input) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor={input.htmlName}>{input.label}</Label>
                                <Input id={input.htmlName} type="tel" name={input.htmlName}
                                       placeholder={input.placeholder}/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Button onClick={() => {
                        if ((current + 1) < FORM_STEPS.length) {
                            setCurrent(current => current + 1)
                        } else {
                            // window.location.href = "https://app.sandbox.midtrans.com/snap/v4/redirection/6a451023-b6f9-4f88-a4f6-cf7ef957a826#/409"
                            navigate({to: "/bidder-form/dummy-payment"})
                        }
                    }}>
                        Selanjutnya
                    </Button>
                    {(current + 1) >= FORM_STEPS.length && (
                        <Button variant={"outline"} onClick={() => setCurrent(current => current - 1)}>
                            Kembali
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}