import React, { useEffect, useState } from "react";
import { 
    Box, 
    Typography, 
    Grid, 
    Paper, 
    Stack, 
    alpha, 
    useTheme,
    Button,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton
} from "@mui/material";
import {
    Email as EmailIcon,
    CheckCircle as DeliveredIcon,
    Visibility as OpenIcon,
    TouchApp as ClickIcon,
    ErrorOutline as BounceIcon,
    Campaign as CampaignIcon,
    Description as TemplateIcon,
    MoreVert as MoreVertIcon,
    ArrowForward as ArrowForwardIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import ActionButton from "./ActionButton";
import axiosInstance from "../../utils/axiosInstance";

const Dashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [stats, setStats] = useState({
        totalSent: 0,
        delivered: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
    });

    const [recentCampaigns, setRecentCampaigns] = useState([
        { id: 1, name: "Summer Launch 2024", type: "Email", status: "Active", reach: "12.4k", performance: "+12%" },
        { id: 2, name: "Flash Sale SMS", type: "SMS", status: "Completed", reach: "5.1k", performance: "+8.5%" },
        { id: 3, name: "Welcome Sequence", type: "WhatsApp", status: "Draft", reach: "--", performance: "--" },
    ]);

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
                p: { xs: 2, sm: 3, md: 5 },
                bgcolor: "#fcfdfe",
                minHeight: "100vh",
            }}
        >
            {/* Premium Header */}
            <Box mb={6} sx={{ position: "relative" }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Stack spacing={1}>
                            <Typography
                                variant="h3"
                                fontWeight={950}
                                letterSpacing="-1.5px"
                                sx={{ 
                                    background: `linear-gradient(45deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 100%)`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Operations Command
                            </Typography>
                            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ opacity: 0.8 }}>
                                Welcome back. Your marketing ecosystem is currently optimized.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
                        <Button
                            variant="contained"
                            startIcon={<CampaignIcon />}
                            onClick={() => navigate("/campaigns/create-campaign")}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: "16px",
                                fontWeight: 800,
                                boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                                textTransform: "none",
                            }}
                        >
                            Launch New Campaign
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} mb={6}>
                <Grid item xs={12} sm={6} lg={2.4}>
                    <StatCard
                        title="Aggregated Reach"
                        value={stats.totalSent.toLocaleString()}
                        icon={PeopleIcon}
                        color="primary"
                        trend="up"
                        trendValue="14%"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={2.4}>
                    <StatCard
                        title="Success Rate"
                        value={`${stats.delivered}%`}
                        icon={DeliveredIcon}
                        color="success"
                        trend="up"
                        trendValue="2.1%"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={2.4}>
                    <StatCard
                        title="Engagement"
                        value={`${stats.openRate}%`}
                        icon={OpenIcon}
                        color="info"
                        trend="up"
                        trendValue="5.4%"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={2.4}>
                    <StatCard
                        title="Conversions"
                        value={`${stats.clickRate}%`}
                        icon={ClickIcon}
                        color="secondary"
                        trend="up"
                        trendValue="1.2%"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={2.4}>
                    <StatCard
                        title="Attrition"
                        value={`${stats.bounceRate}%`}
                        icon={BounceIcon}
                        color="error"
                        trend="down"
                        trendValue="0.8%"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {/* Recent Activity Section */}
                <Grid item xs={12} lg={8}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3.5,
                            borderRadius: "28px",
                            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                            bgcolor: "white",
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h5" fontWeight={900} letterSpacing="-0.5px">
                                Performance Ledger
                            </Typography>
                            <Button 
                                variant="text" 
                                endIcon={<ArrowForwardIcon />} 
                                sx={{ fontWeight: 700, textTransform: "none" }}
                            >
                                Explorer
                            </Button>
                        </Stack>

                        <TableContainer>
                            <Table sx={{ minWidth: 600 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Campaign Identity</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Channel</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>Reach</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }} align="right">Efficiency</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentCampaigns.map((camp) => (
                                        <TableRow key={camp.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700}>{camp.name}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={camp.type} 
                                                    size="small" 
                                                    sx={{ 
                                                        fontWeight: 700, 
                                                        fontSize: "0.7rem",
                                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                        color: theme.palette.primary.main
                                                    }} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: camp.status === "Active" ? "success.main" : camp.status === "Completed" ? "primary.main" : "text.disabled" }} />
                                                    <Typography variant="caption" fontWeight={600}>{camp.status}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600} color="text.secondary">{camp.reach}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography 
                                                    variant="body2" 
                                                    fontWeight={800} 
                                                    color={camp.performance.startsWith("+") ? "success.main" : "text.primary"}
                                                >
                                                    {camp.performance}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Quick Shortcuts */}
                <Grid item xs={12} lg={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3.5,
                            borderRadius: "28px",
                            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                            bgcolor: "white",
                            height: "100%"
                        }}
                    >
                        <Typography variant="h5" fontWeight={900} letterSpacing="-0.5px" mb={4}>
                            Quick Nexus
                        </Typography>
                        
                        <Stack spacing={2}>
                            <ActionButton
                                icon={CampaignIcon}
                                label="Initiate Broadcast"
                                onClick={() => navigate("/campaigns/create-campaign")}
                            />
                            <ActionButton
                                icon={TemplateIcon}
                                label="Draft Blueprint"
                                onClick={() => navigate("/create-template")}
                                variant="outlined"
                            />
                            
                            <Box sx={{ mt: 4, pt: 4, borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
                                <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "1px", mb: 2, display: "block" }}>
                                    System Insights
                                </Typography>
                                <Paper elevation={0} sx={{ p: 2, borderRadius: "18px", bgcolor: alpha(theme.palette.info.main, 0.04), border: `1px solid ${alpha(theme.palette.info.main, 0.1)}` }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                                            <TrendingUpIcon fontSize="small" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={800}>Peak Activity</Typography>
                                            <Typography variant="caption" color="text.secondary">Your campaigns perform best on Tuesdays at 10 AM.</Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
