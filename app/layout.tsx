import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agency Kosmara",
  description: "Brutal Production",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#000', color: '#fff', fontFamily: 'sans-serif' }}>{children}</body>
    </html>
  );
}
