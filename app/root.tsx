// app/root.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>MiniDreams</title>
      </head>
      <body>
        <h1>Hello MiniDreams!</h1>
        {children}
      </body>
    </html>
  );
}