import ListAllCampaign from "../../superAdminComponent/allCampaigns/ListAllCampaign";
import ListAllTemplates from "../../superAdminComponent/allTemplates/ListAllTemplates";
import SuperAdminDashboard from "../../superAdminComponent/superAdminDashboard";

export const superAdminRoutes = [
  {
    path: "/superadmin-dashboard",
    element: <SuperAdminDashboard />,
  },
  {
    path: "/list-all-campaigns",
    element: <ListAllCampaign />,
  },
  {
    path: "list-all-templates",
    element: <ListAllTemplates />,
  },
];
