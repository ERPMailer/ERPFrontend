import React from "react";
import { Box, Typography, alpha, useTheme } from "@mui/material";

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "primary" }) => {
    const theme = useTheme();
    const mainColor = theme.palette[color]?.main || theme.palette.primary.main;

    return (
        <Box
            sx={{
                p: 3,
                bgcolor: "white",
                borderRadius: "24px",
                position: "relative",
                overflow: "hidden",
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.03)}`,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                height: "100%",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.06)}`,
                    borderColor: alpha(mainColor, 0.2),
                },
            }}
        >
            {/* Decorative Background Element */}
            <Box
                sx={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${alpha(mainColor, 0.05)} 0%, transparent 70%)`,
                    zIndex: 0,
                }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "14px",
                            bgcolor: alpha(mainColor, 0.08),
                            color: mainColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                        }}
                    >
                        {Icon && <Icon sx={{ fontSize: 24 }} />}
                    </Box>
                    {trend && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                py: 0.5,
                                px: 1.25,
                                borderRadius: "20px",
                                bgcolor: alpha(trend === "up" ? theme.palette.success.main : theme.palette.error.main, 0.08),
                                border: `1px solid ${alpha(trend === "up" ? theme.palette.success.main : theme.palette.error.main, 0.1)}`,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: trend === "up" ? "success.main" : "error.main",
                                    fontWeight: 700,
                                    fontSize: "0.75rem",
                                }}
                            >
                                {trend === "up" ? "+" : "-"}{trendValue}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                    sx={{ mb: 0.5, opacity: 0.7, letterSpacing: "0.5px", textTransform: "uppercase", fontSize: "0.7rem" }}
                >
                    {title}
                </Typography>
                
                <Typography
                    variant="h3"
                    fontWeight={900}
                    sx={{ 
                        fontSize: "1.85rem", 
                        letterSpacing: "-0.5px",
                        background: `linear-gradient(45deg, ${theme.palette.text.primary} 30%, ${alpha(theme.palette.text.primary, 0.7)} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Box>
    );
};

export default StatCard;
