import Home from "../components/home";
import Layout from "../components/layout";
import AuthGuard from "../guards/authguard";
import { campaignRoutes } from "./campaignRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { superAdminRoutes } from "./superAdminRoutes/superAdminRoutes";
import { templateRoutes } from "./templateRoute";

export const routes = [
  { path: "/", element: <Home /> },
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      ...campaignRoutes,
      ...dashboardRoutes,
      ...templateRoutes,
      ...superAdminRoutes,
    ],
  },
];
