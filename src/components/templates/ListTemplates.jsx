import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Chip,
    Card,
    CardContent,
    Stack,
    Tooltip,
    Alert,
    Skeleton,
    alpha,
    useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import ActionButton from "../dashboard/ActionButton";
import {
    Edit,
    Delete,
    ContentCopy,
    Visibility,
    Email,
    CalendarToday,
    Description,
} from "@mui/icons-material";
import { Add as CampaignIcon } from "@mui/icons-material";
import { getAllTemplates } from "../../services/template-api-service";
import { useSelector } from "react-redux";

export default function ListTemplates() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();

    const userData = useSelector((state) => state.erpMailer.user);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    // Fetch templates on component mount
    useEffect(() => {
        fetchTemplates();
    }, [paginationModel.page, paginationModel.pageSize]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await getAllTemplates(
                userData._id,
                paginationModel.page + 1, // API uses 1-based pagination
                paginationModel.pageSize,
            );

            // Handle different response structures
            const templateData =
                response.templates || response.data || response;
            setTemplates(Array.isArray(templateData) ? templateData : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching templates:", err);
            setError(err.message || "Failed to load templates");
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    };

    // const handleDelete = async (templateId) => {
    //     if (!window.confirm("Are you sure you want to delete this template?")) {
    //         return;
    //     }

    //     try {
    //         await deleteTemplate(templateId);
    //         fetchTemplates();
    //     } catch (err) {
    //         console.error("Error deleting template:", err);
    //         alert("Failed to delete template: " + err.message);
    //     }
    // };

    // const handleDuplicate = async (templateId, templateName) => {
    //     const newName = prompt(
    //         "Enter name for duplicated template:",
    //         `${templateName} - Copy`
    //     );
    //     if (!newName) return;

    //     try {
    //         await duplicateTemplate(templateId, newName);
    //         fetchTemplates();
    //     } catch (err) {
    //         console.error("Error duplicating template:", err);
    //         alert("Failed to duplicate template: " + err.message);
    //     }
    // };

    const handleView = (templateId) => {
        navigate(`/templates/${templateId}`);
    };

    const handleEdit = (templateId) => {
        navigate(`/templates/edit/${templateId}`);
    };

    const columns = [
        {
            field: "name",
            headerName: "Template Name",
            flex: 1,
            minWidth: 220,
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* <Box
                        sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }}
                    > */}
                    {/* </Box> */}
                    <Box>
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                                color: theme.palette.text.primary,
                                mb: 0.25,
                                gap: 2,
                            }}
                        >
                            <Email
                                sx={{ color: "black", fontSize: 20, mr: 2 }}
                            />
                            {params.value}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: theme.palette.text.secondary }}
                        >
                            {params.row.subject?.substring(0, 30)}
                            {params.row.subject?.length > 30 ? "..." : ""}
                        </Typography>
                    </Box>
                </Box>
            ),
        },
        {
            field: "subject",
            headerName: "Subject",
            flex: 1,
            minWidth: 250,
            renderCell: (params) => (
                <Tooltip title={params.value || "No subject"} arrow>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Description
                            sx={{
                                fontSize: 18,
                                color: theme.palette.text.secondary,
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {params.value || "No subject"}
                        </Typography>
                    </Box>
                </Tooltip>
            ),
        },
        {
            field: "createdAt",
            headerName: "Created",
            width: 160,
            renderCell: (params) => {
                if (!params.value)
                    return <Typography variant="body2">N/A</Typography>;
                const date = new Date(params.value);
                return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box>
                            <Typography variant="body2" fontWeight={500}>
                                <CalendarToday
                                    sx={{
                                        fontSize: 16,
                                        color: theme.palette.text.secondary,
                                        mr:1
                                    }}
                                />
                                {date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </Typography>
                            {/* <Typography
                                variant="caption"
                                sx={{ color: theme.palette.text.secondary }}
                            >
                                {date.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Typography> */}
                        </Box>
                    </Box>
                );
            },
        },
        {
            field: "status",
            headerName: "Status",
            width: 130,
            renderCell: (params) => {
                const status = params.value || "draft";
                const statusConfig = {
                    active: {
                        color: "success",
                        icon: "●",
                        bg: alpha(theme.palette.success.main, 0.1),
                    },
                    inactive: {
                        color: "error",
                        icon: "●",
                        bg: alpha(theme.palette.error.main, 0.1),
                    },
                    draft: {
                        color: "default",
                        icon: "●",
                        bg: alpha(theme.palette.grey[500], 0.1),
                    },
                };

                const config = statusConfig[status] || statusConfig.draft;

                return (
                    <Chip
                        label={status.toUpperCase()}
                        color={config.color}
                        size="small"
                        icon={
                            <span style={{ fontSize: 12, marginLeft: 8 }}>
                                {config.icon}
                            </span>
                        }
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            backgroundColor: config.bg,
                            borderRadius: 2,
                        }}
                    />
                );
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="View Template" arrow>
                        <IconButton
                            size="small"
                            onClick={() => handleView(params.row._id)}
                            sx={{
                                color: theme.palette.primary.main,
                                "&:hover": {
                                    backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.1,
                                    ),
                                },
                            }}
                        >
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Template" arrow>
                        <IconButton
                            size="small"
                            onClick={() => handleEdit(params.row._id)}
                            sx={{
                                color: theme.palette.info.main,
                                "&:hover": {
                                    backgroundColor: alpha(
                                        theme.palette.info.main,
                                        0.1,
                                    ),
                                },
                            }}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Duplicate Template" arrow>
                        <IconButton
                            size="small"
                            onClick={() =>
                                handleDuplicate(params.row._id, params.row.name)
                            }
                            sx={{
                                color: theme.palette.secondary.main,
                                "&:hover": {
                                    backgroundColor: alpha(
                                        theme.palette.secondary.main,
                                        0.1
                                    ),
                                },
                            }}
                        >
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Template" arrow>
                        <IconButton
                            size="small"
                            onClick={() => handleDelete(params.row._id)}
                            sx={{
                                color: theme.palette.error.main,
                                "&:hover": {
                                    backgroundColor: alpha(
                                        theme.palette.error.main,
                                        0.1
                                    ),
                                },
                            }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip> */}
                </Stack>
            ),
        },
    ];

    if (loading && templates.length === 0) {
        return (
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Skeleton variant="text" width={200} height={50} />
                    <Skeleton variant="rectangular" width={180} height={40} />
                </Box>
                <Paper sx={{ p: 3 }}>
                    <Stack spacing={2}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                height={60}
                            />
                        ))}
                    </Stack>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header Section */}
            <Card
                elevation={0}
                sx={{
                    mb: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 3,
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mb: 0.5,
                                }}
                            >
                                Email Templates
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: theme.palette.text.secondary }}
                            >
                                Manage and organize your email templates
                            </Typography>
                        </Box>
                        <ActionButton
                            icon={CampaignIcon}
                            label="Create Template"
                            onClick={() =>
                                navigate("/templates/create-template")
                            }
                            size="xs"
                        />
                    </Box>

                    {/* Stats Cards */}
                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                        <Card
                            sx={{
                                flex: 1,
                                background: alpha(
                                    theme.palette.success.main,
                                    0.1,
                                ),
                                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                            }}
                        >
                            <CardContent sx={{ py: 1.5 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Total Templates
                                </Typography>
                                <Typography variant="h5" fontWeight={700}>
                                    {templates.length}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            sx={{
                                flex: 1,
                                background: alpha(
                                    theme.palette.primary.main,
                                    0.1,
                                ),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            }}
                        >
                            <CardContent sx={{ py: 1.5 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Active
                                </Typography>
                                <Typography variant="h5" fontWeight={700}>
                                    {
                                        templates.filter(
                                            (t) => t.status === "active",
                                        ).length
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            sx={{
                                flex: 1,
                                background: alpha(
                                    theme.palette.warning.main,
                                    0.1,
                                ),
                                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                            }}
                        >
                            <CardContent sx={{ py: 1.5 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Drafts
                                </Typography>
                                <Typography variant="h5" fontWeight={700}>
                                    {
                                        templates.filter(
                                            (t) => t.status === "draft",
                                        ).length
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight={500}>
                        Error loading templates
                    </Typography>
                    <Typography variant="caption">{error}</Typography>
                </Alert>
            )}

            {/* Data Grid */}
            <Paper
                elevation={2}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                <DataGrid
                    rows={templates}
                    getRowId={(row) => row._id}
                    columns={columns}
                    loading={loading}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    autoHeight
                    sx={{
                        border: 0,
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.05,
                            ),
                            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            fontSize: "0.875rem",
                            fontWeight: 700,
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                            py: 2,
                        },
                        "& .MuiDataGrid-row": {
                            "&:hover": {
                                backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.03,
                                ),
                                cursor: "pointer",
                            },
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
                            backgroundColor: alpha(
                                theme.palette.background.default,
                                0.5,
                            ),
                        },
                    }}
                />
            </Paper>
        </Box>
    );
}
