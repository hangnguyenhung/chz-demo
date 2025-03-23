"use client";

import Header from "./header";
import Footer from "./footer";
import Breadcrumb from "./Breadcrumb";

export default function CustomerLayout({children}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                <Breadcrumb />
                <main className="flex-1">{children}</main>
            </div>
            <Footer />
        </div>
    );
}
