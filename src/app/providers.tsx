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

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst.ts@0.6.1-rc1/dist/esm/contrib/all-in-one-lite.bundle.js";

    script.onload = () => {
      // Type guard to ensure $typst exists
      if (window.$typst) {
        window.$typst.setCompilerInitOptions({
          getModule: () =>
            "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler@0.6.1-rc1/pkg/typst_ts_web_compiler_bg.wasm",
        });
        window.$typst.setRendererInitOptions({
          getModule: () =>
            "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer@0.6.1-rc1/pkg/typst_ts_renderer_bg.wasm",
        });
      }
      window.__typstInited = true;
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
