import type { Metadata } from "next";
import type { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "A simple and efficient application for managing personal notes.",
  openGraph: {
    title: "NoteHub",
    description:
      "A simple and efficient application for managing personal notes.",
    url: "https://notehub.com/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub application preview",
      },
    ],
  },
};

type RootLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
