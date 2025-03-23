"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {ChevronRight, Home} from "lucide-react";

export default function Breadcrumb() {
    const pathname = usePathname();

    // Bỏ qua phần "/customer" từ đường dẫn
    const paths = pathname.split("/").filter((path) => path && path !== "customer");

    // Kiểm tra nếu đang ở trang home
    if (paths.length === 1 && paths[0] === "home") {
        return (
            <nav className="mt-4 flex items-center rounded-lg bg-gray-100 p-3 text-sm">
                <span className="flex items-center font-medium text-primary">
                    <Home className="mr-1 h-4 w-4" />
                    <span>Home</span>
                </span>
            </nav>
        );
    }

    // Tạo các segments cho breadcrumb
    const breadcrumbItems = paths.map((path, index) => {
        // Tạo đường dẫn tích lũy
        const href = `/customer/${paths.slice(0, index + 1).join("/")}`;

        // Format tên hiển thị (capitalize first letter)
        const label = path.charAt(0).toUpperCase() + path.slice(1);

        return {href, label};
    });

    // Nếu không có path nào, không hiển thị breadcrumb
    if (breadcrumbItems.length === 0) {
        return null;
    }

    return (
        <nav className="mt-4 flex items-center rounded-lg bg-gray-100 p-3 text-sm">
            <Link href="/customer" className="flex items-center text-gray-500 hover:text-primary">
                <Home className="mr-1 h-4 w-4" />
                <span>Home</span>
            </Link>

            {breadcrumbItems.map((item, index) => (
                <div key={item.href} className="flex items-center">
                    <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                    {index === breadcrumbItems.length - 1 ? (
                        <span className="font-medium text-primary">{item.label}</span>
                    ) : (
                        <Link href={item.href} className="text-gray-500 hover:text-primary">
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
