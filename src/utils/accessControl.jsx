import { SUPER_ADMIN_NAVBAR } from "./allUnitNavbarOptions";

export const isAccessible = async (userRole) => {
  const currentRoute = window.location.href;
  let checkRoute;
  switch (userRole) {
    case "superadmin":
      checkRoute = SUPER_ADMIN_NAVBAR.filter((item) => {
        return item.route === currentRoute;
      });
      return checkRoute.length > 0 ? true : false;
    case "user":
      checkRoute = SUPER_ADMIN_NAVBAR.filter((item) => {
        return item.route === currentRoute;
      });
      return checkRoute.length > 0 ? true : false;
    default:
      return false;
  }
};
