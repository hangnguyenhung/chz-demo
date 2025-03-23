"use client";

import * as React from "react";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {GalleryVerticalEnd} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {ErrTokenNotMatch} from "@/lib/constance";
import {signOut} from "next-auth/react";

export function NavHeader() {
    const {data: profile, error} = useQuery({
        queryKey: ["get-info"],
        queryFn: async () => {
            const response = await axios.post("/api/profile/get-info");
            return response.data.profile || {};
        },
        retry: 0,
    });

    React.useEffect(() => {
        if (error?.response?.data?.error === ErrTokenNotMatch) {
            signOut({callbackUrl: "/login"});
        }
    }, [error]);

    return (
        <SidebarMenu className="cursor-none">
            <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <GalleryVerticalEnd size={24} />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{profile?.username}</span>
                        <span className="text-xs">{profile?.account_type}</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
