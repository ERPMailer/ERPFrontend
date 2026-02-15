import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import {
    Email as EmailIcon,
    CheckCircle as DeliveredIcon,
    Visibility as OpenIcon,
    TouchApp as ClickIcon,
    ErrorOutline as BounceIcon,
    Campaign as CampaignIcon,
    Upload as UploadIcon,
    Description as TemplateIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import ActionButton from "./ActionButton";
import axiosInstance from "../../utils/axiosInstance";

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalSent: 0,
        delivered: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get("/dashboard/stats");
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                bgcolor: "#f8f9fa",
                minHeight: "100vh",
            }}
        >
            <Box mb={{ xs: 3, md: 4 }}>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    mb={1}
                    sx={{ fontSize: { xs: "1.75rem", md: "2.125rem" } }}
                >
                    Dashboard
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                >
                    Monitor your email campaign performance
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }} mb={{ xs: 3, md: 4 }}>
                <Grid item xs={12} sm={6} lg={4}>
                    <StatCard
                        title="Total Emails Sent"
                        value={stats.totalSent.toLocaleString()}
                        icon={EmailIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <StatCard
                        title="Emails Delivered"
                        value={stats.delivered.toLocaleString()}
                        icon={DeliveredIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <StatCard
                        title="Open Rate"
                        value={`${stats.openRate}%`}
                        icon={OpenIcon}
                        trend="up"
                        trendValue="2.5%"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <StatCard
                        title="Click Rate"
                        value={`${stats.clickRate}%`}
                        icon={ClickIcon}
                        trend="up"
                        trendValue="1.2%"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <StatCard
                        title="Bounce Rate"
                        value={`${stats.bounceRate}%`}
                        icon={BounceIcon}
                        trend="down"
                        trendValue="0.8%"
                    />
                </Grid>
            </Grid>

            <Box
                sx={{
                    p: { xs: 2.5, md: 3 },
                    bgcolor: "white",
                    borderRadius: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={3}
                    sx={{ fontSize: { xs: "1.125rem", md: "1.25rem" } }}
                >
                    Quick Actions
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                    <ActionButton
                        icon={CampaignIcon}
                        label="Create Campaign"
                        onClick={() => navigate("/campaigns/create-campaign")}
                    />
                    {/* <ActionButton
                        icon={UploadIcon}
                        label="Upload Contacts"
                        onClick={() => navigate("/contacts/upload")}
                        variant="outlined"
                    /> */}
                    <ActionButton
                        icon={TemplateIcon}
                        label="Create Template"
                        onClick={() => navigate("/create-template")}
                        variant="outlined"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
