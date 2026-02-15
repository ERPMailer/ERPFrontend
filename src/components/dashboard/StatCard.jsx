import React from "react";
import { Box, Typography } from "@mui/material";

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  return (
      <Box
          sx={{
              p: { xs: 2.5, md: 3 },
              bgcolor: "white",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              height: "100%",
              width: "100%",
              "&:hover": {
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  transform: "translateY(-2px)",
              },
          }}
      >
          <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={2}
          >
              <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
              >
                  {title}
              </Typography>
              {Icon && (
                  <Box
                      sx={{
                          p: { xs: 0.75, md: 1 },
                          borderRadius: "12px",
                          bgcolor: "primary.50",
                          color: "primary.main",
                          display: "flex",
                      }}
                  >
                      <Icon sx={{ fontSize: { xs: 18, md: 20 } }} />
                  </Box>
              )}
          </Box>
          <Typography
              variant="h4"
              fontWeight={700}
              mb={1}
              sx={{ fontSize: { xs: "1.75rem", md: "2.125rem" } }}
          >
              {value}
          </Typography>
          {trend && (
              <Typography
                  variant="caption"
                  sx={{
                      color: trend === "up" ? "success.main" : "error.main",
                      fontWeight: 600,
                      fontSize: { xs: "0.7rem", md: "0.75rem" },
                  }}
              >
                  {trend === "up" ? "↑" : "↓"} {trendValue}
              </Typography>
          )}
      </Box>
  );
};

export default StatCard;
