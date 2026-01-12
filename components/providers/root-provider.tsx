"use client";

import { StoreProvider } from "@/lib/store";

export function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <StoreProvider>
            {children}
        </StoreProvider>
    );
}
