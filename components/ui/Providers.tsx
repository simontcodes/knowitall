"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    //query client provider wraps the whole app so it can do caching
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        {...props}
      >
        <SessionProvider>{children}</SessionProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
};

export default Providers;
