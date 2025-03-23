"use client";

import * as React from "react";
import {
    Frame,
    GalleryVerticalEnd,
    Grid2X2Plus,
    Map,
    MonitorCog,
    PieChart,
    Settings2,
    SettingsIcon,
    User,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import {NavMain} from "./nav-main";
import {NavHeader} from "./nav-header";
import {NavUser} from "./nav-user";

const data = {
    user: {
        name: "Hunghn",
        email: "Hunghn@example.com",
    },
    teams: [
        {
            name: "Admin",
            logo: GalleryVerticalEnd,
            plan: "Admin",
        },
    ],
    navMain: [
        {
            title: "Catalog",
            url: "#",
            icon: Grid2X2Plus,
            isActive: true,
            items: [
                {
                    title: "Orders",
                    url: "/admin/orders",
                },
                {
                    title: "Inventory",
                    url: "/admin/inventory",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};

export function AppSidebar({...props}) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavHeader />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
