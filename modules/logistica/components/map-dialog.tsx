"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import('../../root/components/coverage/map'), { ssr: false });

const MapDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size={"lg"}>
                    <Expand className="w-12 h-12" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        a
                    </DialogTitle>
                </DialogHeader>
                <Map />
            </DialogContent>
        </Dialog>
    )
}

export default MapDialog