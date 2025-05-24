import Home from "../components/home";
import { campaignRouets } from "./campaignRoutes";
import { dashboardRouets } from "./dashboardRoutes";
import { tepmplateRouets } from "./templateRoute";

export const routes = [
  ...campaignRouets,
  ...dashboardRouets,
  ...tepmplateRouets,
  {
    path: "/",
    element: <Home />,
  },
];
