import {createFileRoute, Link, useNavigate, useSearch} from '@tanstack/react-router'
import {useForm} from '@tanstack/react-form'
import {z} from 'zod'
import {FieldInfo} from "@/components/field-info";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import React, {useEffect} from "react";
import axios from "axios";
import Cookies from "js-cookie"
import type {ApiResponse} from "../../../../types/api-response";
import {toast} from "sonner";

const LoginSchema = z.object({
    identity: z.string().trim().min(1, 'Username atau email tidak boleh kosong'),
    password: z.string().trim().min(6, 'Password minimal 6 karakter'),
})

export const Route = createFileRoute('/_pages/_auth/login')({
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown> = {}) => {
        return {
            fallback: (search?.fallback as string) || "/home",
            reason: (search?.reason as "no-token" | "expired" | undefined),
        }
    },
})

function RouteComponent() {
    const navigate = useNavigate();
    const search = useSearch({ from: "/_pages/_auth/login" })

    useEffect(() => {
        if (search.reason === "no-token") {
            toast.error("kamu harus login dulu")
        }
        if (search.reason === "expired") {
            toast.error("sesi kamu sudah habis, login ulang diperlukan")
        }
    }, [search.reason])

    const form = useForm({
        defaultValues: {
            identity: '',
            password: '',
        },
        validators: {
            onChange: LoginSchema
        },
        onSubmit: async ({ value }) => {
            try {
                const res = await axios.post<ApiResponse>(
                    `${import.meta.env.VITE_SERVER_URL}/auth/login`,
                    value
                )
                Cookies.set("auth_token", res.data.content, { expires: 7 })
                toast.success(res.data.message)
                navigate({ to: search.fallback || "/home", viewTransition: true })
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
                    <div className="flex items-center justify-center" onClick={() => navigate({to: "/authGateway"})}>
                        <ArrowLeft className="size-6 text-gray-700"/>
                    </div>
                    <h3 className="text-xl font-normal">Login</h3>
                </div>
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className={"flex-1 flex flex-col gap-6 justify-center px-4"}
            >
                <form.Field
                    name={"identity"}
                    children={(field) => {
                        return (
                            <div className={"flex flex-col gap-2"}>
                                <Label htmlFor={field.name}>Username / Email</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={"Masukkan username / password"}
                                    autoComplete={"username"}
                                />
                                <FieldInfo field={field}/>
                            </div>
                        )
                    }}/>
                <form.Field
                    name={"password"}
                    children={(field) => {
                        return (
                            <div className={"flex flex-col gap-2"}>
                                <Label htmlFor={field.name}>Password</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    type={"password"}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder={"Masukkan password"}
                                    autoComplete={"current-password"}
                                />
                                <FieldInfo field={field}/>
                            </div>
                        )
                    }}/>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <div className={"flex flex-col gap-2"}>
                            <Button type="submit" disabled={!canSubmit}>
                                {isSubmitting ? '...' : 'Submit'}
                            </Button>
                        </div>
                    )}
                />
                <p className={"text-center"}>
                    Belum punya akun?
                    <span className={"text-orange-600 ml-1"}>
                          <Link to={"/register"}>
                              Daftar
                          </Link>
                    </span>
                </p>
            </form>
        </div>
    )
}