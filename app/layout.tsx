import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Toaster } from "@/components/ui/toaster";

const fontNotoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default:siteConfig.name,
    template: `%s |  ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Next.js", "TypeScript", "Tailwind CSS"],
  authors: [
    {
      name:"KOKI-programming",
      url:siteConfig.url,
    }
  ],
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpeg`],
    creator: "@KOKI-programming",
  },
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
      className={cn(
        "bg-background antialiased min-h-screen ",
         fontNotoSansJP.className
        )}
        >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
