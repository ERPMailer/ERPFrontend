import CreateTemplate from "../components/templates/createTemplate";
import ListTemplates from "../components/templates/ListTemplates";

export const tepmplateRouets = [
  {
    path: "/create-template",
    element: <CreateTemplate />,
  },
  {
    path: "/list-template",
    element: <ListTemplates />,
  },
];
