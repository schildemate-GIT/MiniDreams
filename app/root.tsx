import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <h1>Hello</h1>
        <Outlet />
      </body>
    </html>
  );
}