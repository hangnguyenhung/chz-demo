"use client";

import * as React from "react";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {LogOut} from "lucide-react";
import {signOut} from "next-auth/react";
import {BaseDialog} from "@/components/base-dialog";

export function NavUser() {
    const [open, setOpen] = React.useState(false);

    const handleLogout = () => {
        signOut({callbackUrl: "/login"});
    };

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" onClick={() => setOpen(true)}>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <LogOut size={24} />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">Logout</div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <BaseDialog
                title="Logout"
                open={open}
                onOpenChange={setOpen}
                onSave={handleLogout}
                saveText="Logout"
            >
                <div className="grid gap-2 py-4">
                    <p>Do you want to logout?</p>
                </div>
            </BaseDialog>
        </>
    );
}
