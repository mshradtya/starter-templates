import ReactDOM from "react-dom/client";
import Root from "@/routes/root";
import ErrorPage from "@/routes/root/ErrorPage";
import PersistLogin from "@/components/auth/PersistentLogin";
import RequireAuth from "@/components/auth/RequireAuth";
import Login from "@/routes/auth/login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      // public routes
      { path: "login", element: <Login /> },
      // { path: "unauthorized", element: <Unauthorized /> },

      // protected routes
      {
        element: <PersistLogin />,
        children: [
          {
            element: <RequireAuth allowedRoles={["USER", "ADMIN"]} />,
            children: [
              // { path: "users", element: <Users /> },
              // { path: "", element: <Navigate to="/maps" replace /> },
              // { path: "maps", element: <Maps /> },
              // { path: "devices", element: <Devices /> },
              // { path: "history", element: <SOSHistory /> },
              // { path: "trial", element: <Trial /> },
            ],
          },
          //   {
          //     element: <RequireAuth allowedRoles={["SuperAdmin"]} />,
          //     children: [
          //       { path: "", element: <Navigate to="/maps" replace /> },
          //       { path: "maps", element: <Maps /> },
          //       { path: "devices", element: <Devices /> },
          //       { path: "users", element: <Users /> },
          //       { path: "test", element: <Test /> },
          //     ],
          //   },
        ],
      },
      // catch all
      // { path: "*", element: <Missing /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
