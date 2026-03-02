import CreateTemplate from "../components/templates/createTemplate";
import ListTemplates from "../components/templates/ListTemplates";
import TemplateDetails from "../components/templates/templateDetails";

export const templateRoutes = [
    {
        path: "/templates/create-template",
        element: <CreateTemplate />,
    },
    {
        path: "/templates",
        element: <ListTemplates />,
    },
    {
        path: "/templates/:templateId",
        element: <TemplateDetails />,
    },
];
