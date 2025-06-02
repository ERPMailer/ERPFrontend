import Home from "../components/home";
import Layout from "../components/layout";
import { campaignRouets } from "./campaignRoutes";
import { dashboardRouets } from "./dashboardRoutes";
import { superAdminRoutes } from "./superAdminRoutes/superAdminRoutes";
import { tepmplateRouets } from "./templateRoute";

export const routes = [
  { path: "/", element: <Home /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      ...campaignRouets,
      ...dashboardRouets,
      ...tepmplateRouets,
      ...superAdminRoutes,
    ],
  },
];
