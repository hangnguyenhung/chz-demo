"use client";

import {ChevronRight} from "lucide-react";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import Link from "next/link";
import {usePathname} from "next/navigation";

export function NavMain({items}) {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => {
                    const hasSubItems = item.items && item.items.length > 0;

                    // Check if any sub-item is active
                    const isParentOfActive =
                        hasSubItems &&
                        item.items.some(
                            (subItem) =>
                                pathname === subItem.url || pathname.startsWith(`${subItem.url}/`)
                        );

                    // Direct item is active
                    const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

                    if (hasSubItems) {
                        return (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={item.isActive || isParentOfActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items.map((subItem) => {
                                                const isSubItemActive =
                                                    pathname === subItem.url ||
                                                    pathname.startsWith(`${subItem.url}/`);

                                                return (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            className={
                                                                isSubItemActive ? "bg-muted" : ""
                                                            }
                                                        >
                                                            <Link href={subItem.url}>
                                                                <span
                                                                    className={
                                                                        isSubItemActive
                                                                            ? "font-medium text-primary"
                                                                            : ""
                                                                    }
                                                                >
                                                                    {subItem.title}
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    } else {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild className={isActive ? "bg-muted" : ""}>
                                    <Link href={item.url}>
                                        {item.icon && (
                                            <item.icon className={isActive ? "text-primary" : ""} />
                                        )}
                                        <span
                                            className={isActive ? "font-medium text-primary" : ""}
                                        >
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
