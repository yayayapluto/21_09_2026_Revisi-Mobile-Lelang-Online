import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Progress} from "@/components/ui/progress";

export const Route = createFileRoute('/_pages/_auth/login')({
    component: RouteComponent,
})

function RouteComponent() {
    const LOGIN_STEPS = [
        {
            name: "identity",
            type: "text",
            placeholder: "Masukkan username atau email",
        },
        {
            name: "password",
            type: "password",
            placeholder: "Masukkan password",
        }
    ]
    const [loginStep, setLoginStep] = useState(0);

    const navigate = useNavigate()
    return (
        <div className={"h-full flex flex-col gap-6 justify-center"}>
            <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs text-right">{loginStep + 1}/{LOGIN_STEPS.length}</p>
                <Progress value={((loginStep + 1) / LOGIN_STEPS.length) * 100}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor={LOGIN_STEPS[loginStep].name}>
                    {LOGIN_STEPS[loginStep].name === "identity" ? "Username / Email" : "Password"}
                </Label>
                <Input
                    name={LOGIN_STEPS[loginStep].name}
                    type={LOGIN_STEPS[loginStep].type}
                    placeholder={LOGIN_STEPS[loginStep].placeholder}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Button
                    size={"lg"}
                    className="w-full bg-orange-600 hover:bg-orange-700 rounded-full"
                    onClick={() => {
                        if (loginStep < LOGIN_STEPS.length - 1) {
                            setLoginStep(loginStep + 1);
                        } else {
                            navigate({to: "/home"})
                        }
                    }}
                >
                    {loginStep < LOGIN_STEPS.length - 1 ? "Selanjutnya" : "Masuk"}
                </Button>
                <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => {
                        if (loginStep === 0) {
                            navigate({to: "/authGateway"});
                        } else {
                            setLoginStep(loginStep - 1);
                        }
                    }}
                >
                    Kembali
                </Button>

            </div>
        </div>

    )
}
