export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        <h1>Hello</h1>
        {children}
      </body>
    </html>
  );
}