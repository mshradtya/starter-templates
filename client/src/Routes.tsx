import PersistLogin from "@/components/auth/PersistentLogin";
import RequireAuth from "@/components/auth/RequireAuth";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// routes
import Root from "@/routes/root";
import Login from "@/routes/user/login";
import ErrorPage from "@/routes/root/ErrorPage";
import Dashboard from "@/routes/dashboard";
import Users from "@/routes/user";

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
              { path: "users", element: <Users /> },
              { path: "", element: <Navigate to="/dashboard" replace /> },
              { path: "dashboard", element: <Dashboard /> },
              // { path: "devices", element: <Devices /> },
              // { path: "history", element: <SOSHistory /> },
              // { path: "trial", element: <Trial /> },
            ],
          },
          {
            element: <RequireAuth allowedRoles={["ADMIN"]} />,
            children: [
              { path: "", element: <Navigate to="/dashboard" replace /> },
              { path: "dashboard", element: <Dashboard /> },
              { path: "users", element: <Users /> },
              // { path: "devices", element: <Devices /> },
              // { path: "test", element: <Test /> },
            ],
          },
        ],
      },
      // catch all
      // { path: "*", element: <Missing /> },
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
