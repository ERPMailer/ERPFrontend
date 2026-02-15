import CampaignList from "../components/campaign/campaignList";
import CreateCampaign from "../components/campaign/createCampign";

export const campaignRouets = [
    {
        path: "/campaigns/create-campaign",
        element: <CreateCampaign />,
    },
    {
        path: "/campaigns",
        element: <CampaignList />,
    },
];
