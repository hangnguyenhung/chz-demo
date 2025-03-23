"use client";

import dynamic from "next/dynamic";
import React from "react";

const ClientOnlyComponent = dynamic(() => import("../../_feature/orders/index.jsx"), {
    ssr: false,
});

export default function Orders() {
    return <ClientOnlyComponent />;
}
