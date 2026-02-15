import CreateTemplate from "../components/templates/createTemplate";
import ListTemplates from "../components/templates/ListTemplates";

export const tepmplateRouets = [
    {
        path: "/templates/create-template",
        element: <CreateTemplate />,
    },
    {
        path: "/templates",
        element: <ListTemplates />,
    },
];
