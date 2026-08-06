import type { Metadata } from "next";
import { headers } from "next/headers";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "LGPR — Hospitality, Culinary & Lifestyle PR",
    description:
      "Senior-led public relations for hotels, restaurants, culinary talent and lifestyle brands.",
    openGraph: {
      title: "LGPR — Get the kind of attention your brand deserves.",
      description:
        "Senior-led public relations for hospitality, culinary and lifestyle brands.",
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1733,
          height: 907,
          alt: "LGPR — Get the kind of attention your brand deserves.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "LGPR — Get the kind of attention your brand deserves.",
      description:
        "Senior-led public relations for hospitality, culinary and lifestyle brands.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>{children}</body>
    </html>
  );
}
