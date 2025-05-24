import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Navbar from "./navbar/navbar";

const Layout = () => {
  return (
    <Box minHeight="100vh">
      <Navbar />
      <Container sx={{ mt: 3, maxWidth: "1600px !important" }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
