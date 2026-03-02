import CampaignList from "../components/campaign/campaignList";
import CreateCampaign from "../components/campaign/CreateCampaign";

export const campaignRoutes = [
    {
        path: "/campaigns/create-campaign",
        element: <CreateCampaign />,
    },
    {
        path: "/campaigns",
        element: <CampaignList />,
    },
];
