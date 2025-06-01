import CampaignList from "../components/campaign/campaignList";
import CreateCampaign from "../components/campaign/createCampign";

export const campaignRouets = [
  {
    path: "/create-campaign",
    element: <CreateCampaign />,
  },
  {
    path: "/create-list",
    element: <CampaignList/>,
  },

];
