import type { Metadata } from "next";
import { ChatProvider } from "./(contexts)/chat-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bot dos Sonhos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
