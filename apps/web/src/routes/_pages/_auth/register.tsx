import {createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export const Route = createFileRoute('/_pages/_auth/register')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    return (
        <div className={"h-full flex flex-col gap-6 justify-center"}>
            <div className={"space-y-2"}>
                <Label htmlFor={"username"}>
                    Username
                </Label>
                <Input name="username" type={"text"} placeholder={"Masukkan Username"}/>
            </div>
            <div className={"space-y-2"}>
                <Label htmlFor={"email"}>
                    Email
                </Label>
                <Input name="email" type={"text"} placeholder={"Masukkan Email"}/>
            </div>
            <div className={"space-y-2"}>
                <Label htmlFor={"password"}>
                    Password
                </Label>
                <Input name="password" type={"password"} placeholder={"Masukkan Password"}/>
            </div>
            <div className={"space-y-2"}>
                <Label htmlFor={"password_confirmation"}>
                    Konfirmasi Password
                </Label>
                <Input name="password_confirmation" type={"password"} placeholder={"Masukkan Konfirmasi Password"}/>
            </div>
            <div className="space-y-2">
                <Button className={"w-full bg-orange-600 hover:bg-orange-700 rounded-full"}
                        onClick={() => navigate({to: "/login"})}>
                    Buat Akun
                </Button>
                <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => navigate({to: "/authGateway"})}
                >
                    Kembali
                </Button>
            </div>
            <p className={"text-center"}>
                Sudah punya akun?
                <span className={"text-orange-600 ml-1"}>
                  <Link to={"/login"}>
                      Masuk
                  </Link>
              </span>
            </p>
        </div>
    )
}
