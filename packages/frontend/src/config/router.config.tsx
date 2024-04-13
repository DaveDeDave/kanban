import { PublicStructure } from "@/templates/public-structure";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicStructure />,
    children: [
      {
        index: true,
        lazy: () => import("@/pages/home")
      },
      {
        path: "/about",
        lazy: () => import("@/pages/about")
      }
    ]
  }
]);
