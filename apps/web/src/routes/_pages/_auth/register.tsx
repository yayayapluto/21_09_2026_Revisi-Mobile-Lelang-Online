import {createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import {useForm} from '@tanstack/react-form'
import {z} from 'zod'
import {FieldInfo} from "@/components/field-info";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import axios from "axios";
import Cookies from "js-cookie"
import {toast} from "sonner";
import type {ApiResponse} from "../../../../types/api-response";
import {ArrowLeft} from "lucide-react";
import React from "react";

const RegisterSchema = z.object({
    username: z.string().trim().min(5, 'Username minimal 5 karakter'),
    email: z.email('Email tidak valid'),
    password: z.string().trim().min(6, 'Password minimal 6 karakter'),
    confirm_password: z.string().trim().min(6, 'Konfirmasi password minimal 6 karakter')
}).refine((data) => data.password === data.confirm_password, {
    message: "Password dan konfirmasi password tidak sama",
    path: ["confirm_password"],
})

export const Route = createFileRoute('/_pages/_auth/register')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirm_password: '',
        },
        validators: {
            onChange: RegisterSchema
        },
        onSubmit: async ({value}) => {
            try {
                const res = await axios.post<ApiResponse>(
                    `${import.meta.env.VITE_SERVER_URL}/auth/register`,
                    value
                )
                Cookies.set("auth_token", res.data.content, {expires: 7})
                toast.success(res.data.message)
                navigate({to: "/login", search: {fallback: "", reason: undefined}})
            } catch (err: any) {
                if (err.response?.data?.message) {
                    toast.error(err.response.data.message)
                } else {
                    toast("Terjadi kesalahan")
                }
            }
        }
    })

    return (
        <div className="h-full flex flex-col">
            <div
                className="w-full px-2 py-4 sticky top-0 bg-white z-10 flex flex-col gap-4"
            >
                <div className="flex-1 flex gap-4 items-center justify-start">
                    <div className="flex items-center justify-center" onClick={() => history.back()}>
                        <ArrowLeft className="size-6 text-gray-700"/>
                    </div>
                    <h3 className="text-xl font-normal">Daftar</h3>
                </div>
            </div>
            <div className="h-full flex flex-col">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="flex-1 flex flex-col gap-6 justify-center px-4"
                >
                    <div className="flex flex-col items-center justify-center">
                        <img src={"/public/illustrations/register.png"} alt=""
                             className="aspect-square size-64 object-contain"/>
                    </div>
                    <form.Field name="username" children={(field) => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor={field.name}>Username</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Masukkan Username"
                                autoComplete="username"
                            />
                            <FieldInfo field={field}/>
                        </div>
                    )}/>
                    <form.Field name="email" children={(field) => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor={field.name}>Email</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Masukkan Email"
                                autoComplete="email"
                            />
                            <FieldInfo field={field}/>
                        </div>
                    )}/>
                    <form.Field name="password" children={(field) => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor={field.name}>Password</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Masukkan Password"
                                autoComplete="new-password"
                            />
                            <FieldInfo field={field}/>
                        </div>
                    )}/>
                    <form.Field name="confirm_password" children={(field) => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor={field.name}>Konfirmasi Password</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Masukkan Konfirmasi Password"
                                autoComplete="new-password"
                            />
                            <FieldInfo field={field}/>
                        </div>
                    )}/>
                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}
                                    children={([canSubmit, isSubmitting]) => (
                                        <div className="flex flex-col gap-2">
                                            <Button type="submit" disabled={!canSubmit}>
                                                {isSubmitting ? '...' : 'Buat Akun'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-full"
                                                onClick={() => navigate({to: "/authGateway"})}
                                            >
                                                Kembali
                                            </Button>
                                        </div>
                                    )}/>
                    <p className="text-center">
                        Sudah punya akun?
                        <span className="text-orange-600 ml-1">
            <Link to="/login" search={{fallback: "", reason: undefined}}>Masuk</Link>
          </span>
                    </p>
                </form>
            </div>
        </div>
    )
}
