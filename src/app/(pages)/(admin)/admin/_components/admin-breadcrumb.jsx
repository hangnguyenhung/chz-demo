"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {usePathname} from "next/navigation";
import Link from "next/link";
import React from "react";

const Breadcrumbs = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter((segment) => segment);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathSegments.map((segment, index) => {
                    const href = "/" + pathSegments.slice(0, index + 1).join("/");
                    const isLast = index === pathSegments.length - 1;
                    return (
                        <React.Fragment key={href}>
                            {index > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="capitalize">
                                        {segment}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink as={Link} href={href} className="capitalize">
                                        {segment}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default Breadcrumbs;
