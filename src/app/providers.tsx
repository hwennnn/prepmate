"use client";

import { useEffect } from "react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "~/components/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  useEffect(() => {
    // only inject once
    if (window.__typstInited) return;

    // Script injection to load typst compiler on client
    // @see: https://github.com/Myriad-Dreamin/typst.ts/blob/main/packages/typst.ts/index.html
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst.ts@0.6.1-rc1/dist/esm/contrib/all-in-one-lite.bundle.js";

    // On mounting of root page - to eliminate cold-start
    // Load typst compiler WASM from local public directory
    script.onload = () => {
      // Type guard to ensure $typst exists
      if (window.$typst) {
        window.$typst.setCompilerInitOptions({
          getModule: () => "/typst_ts_web_compiler_bg.wasm",
        });
        window.$typst.setRendererInitOptions({
          getModule: () => "/typst_ts_renderer_bg.wasm",
        });
      }
      window.__typstInited = true; // Update global window for clients to trace
    };
    document.head.appendChild(script);
  }, []);

  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
