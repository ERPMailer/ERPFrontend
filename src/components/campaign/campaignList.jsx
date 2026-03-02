import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    alpha,
    useTheme,
    Select,
    FormControl,
    InputLabel,
    Tooltip,
    LinearProgress,
    Zoom,
    Fade,
    Grid,
} from "@mui/material";
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from "@mui/x-data-grid";
import {
    Add as AddIcon,
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Assessment as ReportIcon,
    FilterList as FilterIcon,
    Email as EmailIcon,
    Sms as SmsIcon,
    WhatsApp as WhatsAppIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Schedule as ScheduleIcon,
    Send as SendIcon,
    Sync as SyncIcon,
    HourglassEmpty as DraftIcon,
    CloudQueue as CloudIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllCampaigns } from "../../services/campaign-api-service";

const StatusBadge = ({ status }) => {
    const theme = useTheme();

    const configs = {
        Draft: { color: "default", icon: DraftIcon, label: "Draft" },
        Processing: { color: "info", icon: SyncIcon, label: "Processing" },
        Scheduled: { color: "warning", icon: ScheduleIcon, label: "Scheduled" },
        Sending: { color: "secondary", icon: SendIcon, label: "Sending" },
        Completed: {
            color: "success",
            icon: CheckCircleIcon,
            label: "Completed",
        },
        Failed: { color: "error", icon: ErrorIcon, label: "Failed" },
    };

    const config = configs[status] || configs.Draft;
    const Icon = config.icon;

    return (
        <Chip
            icon={<Icon sx={{ fontSize: "14px !important" }} />}
            label={config.label}
            size="small"
            sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                borderRadius: "8px",
                height: 28,
                px: 0.5,
                backgroundColor: alpha(
                    theme.palette[
                        config.color === "default" ? "grey" : config.color
                    ].main,
                    0.1,
                ),
                color: theme.palette[
                    config.color === "default" ? "grey" : config.color
                ].main,
                border: `1px solid ${alpha(theme.palette[config.color === "default" ? "grey" : config.color].main, 0.2)}`,
                "& .MuiChip-icon": { color: "inherit" },
            }}
        />
    );
};

const ChannelIcon = ({ channel }) => {
    switch (channel?.toLowerCase()) {
        case "email":
            return <EmailIcon sx={{ color: "primary.main", fontSize: 20 }} />;
        case "sms":
            return <SmsIcon sx={{ color: "info.main", fontSize: 20 }} />;
        case "whatsapp":
            return (
                <WhatsAppIcon sx={{ color: "success.main", fontSize: 20 }} />
            );
        default:
            return <EmailIcon sx={{ color: "grey.500", fontSize: 20 }} />;
    }
};

const CampaignList = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.erpMailer.user);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const fetchCampaigns = useCallback(async () => {
        if (!userData?._id) return;
        setLoading(true);
        try {
            const res = await getAllCampaigns(userData._id);
            if (res.success) {
                setCampaigns(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
        } finally {
            setLoading(false);
        }
    }, [userData?._id]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const filteredCampaigns = campaigns.filter((camp) => {
        const matchesSearch = camp.campaignName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "All" || camp.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            field: "campaignName",
            headerName: "Campaign",
            width: 250,
            renderCell: (params) => (
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ height: "100%" }}
                >
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: "10px",
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ChannelIcon channel={params.row.channel} />
                    </Box>
                    <Box>
                        <Typography variant="body2" fontWeight={800} noWrap>
                            {params.value}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            noWrap
                        >
                            {params.row.templateName || "Standard Template"}
                        </Typography>
                    </Box>
                </Stack>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <StatusBadge status={params.value} />
                    {params.value === "Sending" && (
                        <Box sx={{ width: 40, ml: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={Math.round(
                                    (params.row.sentCount /
                                        params.row.totalRecipients) *
                                        100,
                                )}
                                sx={{ height: 4, borderRadius: 2 }}
                            />
                        </Box>
                    )}
                </Box>
            ),
        },
        {
            field: "stats",
            headerName: "Reach",
            width: 200,
            renderCell: (params) => (
                <Stack spacing={0.5} sx={{ width: "100%", py: 1 }}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="caption" color="textSecondary">
                            Sent
                        </Typography>
                        <Typography variant="caption" fontWeight={700}>
                            {params.row.sentCount}/{params.row.totalRecipients}
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={
                            Math.round(
                                (params.row.sentCount /
                                    params.row.totalRecipients) *
                                    100,
                            ) || 0
                        }
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.divider, 0.1),
                        }}
                    />
                    {params.row.failedCount > 0 && (
                        <Tooltip title="View error summary" arrow>
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{
                                    cursor: "help",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    fontWeight: 700,
                                }}
                            >
                                <ErrorIcon sx={{ fontSize: 12 }} />{" "}
                                {params.row.failedCount} Failed
                            </Typography>
                        </Tooltip>
                    )}
                </Stack>
            ),
        },
        {
            field: "sendType",
            headerName: "Mode",
            width: 150,
            renderCell: (params) => (
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="body2" fontWeight={700}>
                        {params.value === "Instant" ? "Now" : "Scheduled"}
                    </Typography>
                    {params.row.scheduledDate && (
                        <Typography variant="caption" color="textSecondary">
                            {new Date(
                                params.row.scheduledDate,
                            ).toLocaleDateString()}
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            field: "createdAt",
            headerName: "Creation",
            width: 150,
            renderCell: (params) => (
                <Typography variant="body2" color="textSecondary">
                    {new Date(params.value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Typography>
            ),
        },
        {
            field: "actions",
            headerName: "",
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <IconButton onClick={(e) => handleMenuOpen(e, params.row)}>
                    <MoreVertIcon />
                </IconButton>
            ),
        },
    ];

    const EmptyState = () => (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 10,
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                }}
            >
                <CloudIcon
                    sx={{
                        fontSize: 60,
                        color: theme.palette.primary.main,
                        opacity: 0.5,
                    }}
                />
            </Box>
            <Typography variant="h5" fontWeight={900} gutterBottom>
                No campaigns created yet
            </Typography>
            <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mb: 4, maxWidth: 300 }}
            >
                Start a conversation with your customers by creating your first
                broadcast campaign.
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/campaigns/create-campaign")}
                sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 800 }}
            >
                Create Your First Campaign
            </Button>
        </Box>
    );

    return (
        <Box
            sx={{ p: { xs: 2, md: 5 }, bgcolor: "#fcfdfe", minHeight: "100vh" }}
        >
            {/* Header Area */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h4"
                            fontWeight={950}
                            letterSpacing="-1px"
                            sx={{ color: theme.palette.text.primary }}
                        >
                            Campaigns
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Organize and monitor all your outgoing communication
                            channels
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: "flex",
                            justifyContent: { md: "flex-end" },
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<FilterIcon />}
                            sx={{
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: 700,
                                borderColor: alpha(theme.palette.divider, 0.1),
                            }}
                        >
                            Export
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() =>
                                navigate("/campaigns/create-campaign")
                            }
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                fontWeight: 800,
                                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                            }}
                        >
                            Create Campaign
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Filters and Search */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 3,
                    bgcolor: "white",
                }}
            >
                <TextField
                    placeholder="Search by campaign name..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        flex: 1,
                        minWidth: 250,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: alpha(theme.palette.divider, 0.03),
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{ borderRadius: "12px" }}
                    >
                        <MenuItem value="All">All Statuses</MenuItem>
                        <MenuItem value="Draft">Draft</MenuItem>
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Scheduled">Scheduled</MenuItem>
                        <MenuItem value="Sending">Sending</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            {/* Table Area */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 6,
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    overflow: "hidden",
                    bgcolor: "white",
                    boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.03)}`,
                    minHeight: 500,
                }}
            >
                <DataGrid
                    rows={filteredCampaigns}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row._id}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableSelectionOnClick
                    autoHeight
                    sx={{
                        border: "none",
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: alpha(theme.palette.divider, 0.02),
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                        },
                        "& .MuiDataGrid-row": {
                            "&:hover": {
                                backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.01,
                                ),
                            },
                        },
                        "& .MuiDataGrid-cell": {
                            borderColor: alpha(theme.palette.divider, 0.05),
                        },
                    }}
                    components={{
                        NoRowsOverlay: EmptyState,
                    }}
                />
            </Paper>

            {/* Row Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                        minWidth: 180,
                        p: 1,
                    },
                }}
            >
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <ViewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="View Details" />
                </MenuItem>

                {selectedRow?.status === "Draft" && (
                    <MenuItem onClick={handleMenuClose}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Edit Campaign" />
                    </MenuItem>
                )}

                {(selectedRow?.status === "Completed" ||
                    selectedRow?.status === "Sending") && (
                    <MenuItem onClick={handleMenuClose}>
                        <ListItemIcon>
                            <ReportIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="View Report" />
                    </MenuItem>
                )}

                {(selectedRow?.status === "Draft" ||
                    selectedRow?.status === "Failed") && (
                    <MenuItem
                        onClick={handleMenuClose}
                        sx={{ color: "error.main" }}
                    >
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Delete" />
                    </MenuItem>
                )}
            </Menu>
        </Box>
    );
};

export default CampaignList;
