"use client";

import dynamic from "next/dynamic";
import React from "react";

const ClientOnlyComponent = dynamic(() => import("../../_feature/inventory/index.jsx"), {
    ssr: false,
});

export default function Inventory() {
    return <ClientOnlyComponent />;
}
