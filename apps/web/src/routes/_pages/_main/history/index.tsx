import { createFileRoute } from '@tanstack/react-router'
import {Input} from "@/components/ui/input";
import {ChevronDown, Flag, SearchIcon, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import React, {useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {DummyHistoryCard} from "@/components/dummy-history-card";

export const Route = createFileRoute('/_pages/_main/history/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [status, setStatus] = useState<string | undefined>("whatever")
  const [date, setDate] = useState<string | undefined>("last_30_days")

  return (
      <div className="grid grid-rows-[1fr] gap-4">
        <div
            className="w-full p-2 sticky top-0 bg-white z-10 flex flex-col gap-4"
        >
          <div className="flex-1 flex gap-4 items-center justify-between">
            <div className={"relative w-full"}>
              <Input
                  type="text"
                  placeholder="Cari Transaksi"
                  className="pl-10"
              />
              <SearchIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"/>
            </div>
          </div>
          <div className={"flex-1 flex gap-2 items-center justify-between"}>
            {(status !== undefined || date !== undefined) && (
                <Button
                    variant={"outline"}
                    className={"border-2 border-red-500/80 hover:border-red-600/80 text-red-500 bg-red-500/20"}
                    onClick={() => {
                      setStatus(undefined)
                      setDate(undefined)
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
                  <span>Semua Status</span>
                  <ChevronDown/>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className={"text-lg"}>Status</DrawerTitle>
                  <DrawerDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, velit!</DrawerDescription>
                </DrawerHeader>
                <div className="py-2 px-4">
                  <RadioGroup
                      value={status}
                      onValueChange={(val) => setStatus(val)}
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
              </DrawerContent>
            </Drawer>
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    className="flex-1 text-muted-foreground flex items-center justify-between"
                >
                  <span>Semua Tanggal</span>
                  <ChevronDown/>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className={"text-lg"}>Tanggal</DrawerTitle>
                  <DrawerDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, velit!</DrawerDescription>
                </DrawerHeader>
                <div className="py-2 px-4">
                  <RadioGroup
                      value={date}
                      onValueChange={(val) => setDate(val)}
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
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-2 pb-4">
          {Array.from({length: Math.floor(Math.random() * 100)}).map(() => (
            <DummyHistoryCard/>
          ))}
        </div>
      </div>
  )
}
