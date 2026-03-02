import {
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Campaign as CampaignIcon,
    CheckCircle as CheckCircleIcon,
    CloudUpload as CloudUploadIcon,
    Description as DescriptionIcon,
    Download as DownloadIcon,
    Email as EmailIcon,
    Error as ErrorIcon,
    Search as SearchIcon,
    Send as SendIcon,
    Sms as SmsIcon,
    Timer as TimerIcon,
    WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Fade,
    Grid,
    Grow,
    InputAdornment,
    Paper,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    alpha,
    useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCampaign } from "../../services/campaign-api-service";
import { getAllTemplates } from "../../services/template-api-service";

const steps = ["Select Template", "Campaign Details", "CSV Upload"];

const CreateCampaign = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const user = useSelector((state) => state.erpMailer.user);

    // Stepper State
    const [activeStep, setActiveStep] = useState(0);

    // Step 1: Template Selection
    const [templates, setTemplates] = useState([]);
    const [loadingTemplates, setLoadingTemplates] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [channel, setChannel] = useState("Email");
    const [searchQuery, setSearchQuery] = useState("");

    // Step 2: Campaign Details
    const [campaignName, setCampaignName] = useState("");
    const [description, setDescription] = useState("");
    const [sendType, setSendType] = useState("Instant");
    const [scheduledTime, setScheduledTime] = useState("");

    // Step 3: CSV Upload
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, processing, completed, failed
    const [processSummary, setProcessSummary] = useState({
        valid: 0,
        invalid: 0,
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [csvData, setCsvData] = useState([]);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoadingTemplates(true);
            const response = await getAllTemplates(user._id);
            const data = response.templates || response.data || response;
            setTemplates(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            setLoadingTemplates(false);
        }
    };

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            handleFinalSubmit();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleFinalSubmit = async () => {
        try {
            setUploadStatus("uploading");
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    setUploadStatus("processing");
                    simulateProcessing();
                }
            }, 200);
        } catch (error) {
            setUploadStatus("failed");
        }
    };

    const simulateProcessing = () => {
        setTimeout(async () => {
            setProcessSummary({
                valid: csvData.length,
                invalid: 0,
            });

            try {
                const campaignData = {
                    name: campaignName,
                    description,
                    templateId: selectedTemplate._id,
                    channel,
                    sendType,
                    scheduledTime:
                        sendType === "Scheduled" ? scheduledTime : null,
                    status: "draft",
                    userId: user._id,
                    recipients: csvData,
                };

                await createCampaign(campaignData);
                setUploadStatus("completed");
                setTimeout(() => navigate("/campaigns"), 2000);
            } catch (error) {
                setUploadStatus("failed");
            }
        }, 1500);
    };

    const handleCsvUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith(".csv")) {
            alert("Please upload a .csv file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB limit");
            return;
        }

        setFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split("\n").filter((line) => line.trim());
            if (lines.length < 1) return;

            const headers = lines[0].split(",").map((h) => h.trim());
            const rows = lines.slice(1).map((line) => {
                const values = line.split(",");
                return headers.reduce((obj, header, i) => {
                    obj[header] = values[i]?.trim();
                    return obj;
                }, {});
            });

            setCsvData(rows);
            setProcessSummary({ valid: rows.length, invalid: 0 });
        };
        reader.readAsText(file);
    };

    const downloadSampleCSV = () => {
        if (!selectedTemplate) return;

        const variables = selectedTemplate.variables || [];
        const firstCol = channel === "Email" ? "email" : "phone";
        const headers = [firstCol, ...variables];

        const sampleRow1 = [
            channel === "Email" ? "example1@gmail.com" : "9876543210",
            ...variables.map((v) => `Sample_${v}1`),
        ];

        const csvContent = [headers.join(","), sampleRow1.join(",")].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sample_${campaignName || "campaign"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredTemplates = templates.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.subject?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const ChannelCard = ({ name, icon: Icon, color }) => (
        <Card
            onClick={() => setChannel(name)}
            sx={{
                flex: 1,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                border: `2px solid ${channel === name ? color : alpha(theme.palette.divider, 0.1)}`,
                backgroundColor:
                    channel === name
                        ? alpha(color, 0.05)
                        : theme.palette.background.paper,
                transform: channel === name ? "translateY(-4px)" : "none",
                boxShadow:
                    channel === name
                        ? `0 10px 20px ${alpha(color, 0.15)}`
                        : "none",
                "&:hover": {
                    borderColor: channel === name ? color : alpha(color, 0.5),
                    backgroundColor: alpha(color, 0.02),
                },
            }}
        >
            <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Icon
                    sx={{
                        fontSize: 40,
                        color:
                            channel === name
                                ? color
                                : theme.palette.text.secondary,
                        mb: 1,
                    }}
                />
                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color={channel === name ? "textPrimary" : "textSecondary"}
                >
                    {name}
                </Typography>
            </CardContent>
        </Card>
    );

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Fade in={true}>
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={1}
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                <div
                                    style={{
                                        width: 8,
                                        height: 20,
                                        borderRadius: 4,
                                        background: theme.palette.primary.main,
                                    }}
                                />
                                Choose Communication Channel
                            </Typography>

                            <Stack direction="row" spacing={2} mb={5}>
                                <ChannelCard
                                    name="Email"
                                    icon={EmailIcon}
                                    color="#1F7BFC"
                                />
                                <ChannelCard
                                    name="SMS"
                                    icon={SmsIcon}
                                    color="#FF9800"
                                />
                                <ChannelCard
                                    name="WhatsApp"
                                    icon={WhatsAppIcon}
                                    color="#4CAF50"
                                />
                            </Stack>

                            <Box
                                mb={3}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Typography variant="h6" fontWeight={700}>
                                    Select Template
                                </Typography>
                                <TextField
                                    size="small"
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ width: 300 }}
                                />
                            </Box>

                            {loadingTemplates ? (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    py={10}
                                >
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {filteredTemplates.map((tpl) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            key={tpl._id}
                                        >
                                            <Card
                                                onClick={() =>
                                                    setSelectedTemplate(tpl)
                                                }
                                                sx={{
                                                    height: "100%",
                                                    cursor: "pointer",
                                                    border: `1px solid ${selectedTemplate?._id === tpl._id ? theme.palette.primary.main : alpha(theme.palette.divider, 0.1)}`,
                                                    transition: "all 0.2s",
                                                    position: "relative",
                                                    "&:hover": {
                                                        borderColor:
                                                            theme.palette
                                                                .primary.main,
                                                        boxShadow:
                                                            theme.shadows[4],
                                                    },
                                                }}
                                            >
                                                {selectedTemplate?._id ===
                                                    tpl._id && (
                                                    <Box
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            top: 12,
                                                            right: 12,
                                                            color: theme.palette
                                                                .primary.main,
                                                        }}
                                                    >
                                                        <CheckCircleIcon />
                                                    </Box>
                                                )}
                                                <CardContent>
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight={700}
                                                        noWrap
                                                        gutterBottom
                                                    >
                                                        {tpl.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        noWrap
                                                    >
                                                        Subject:{" "}
                                                        {tpl.subject ||
                                                            "No subject"}
                                                    </Typography>
                                                    <Divider sx={{ my: 1.5 }} />
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <Chip
                                                            label={`${tpl.variables?.length || 0} Variables`}
                                                            size="small"
                                                            sx={{
                                                                borderRadius: 1.5,
                                                                fontSize:
                                                                    "0.7rem",
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="caption"
                                                            color="textSecondary"
                                                        >
                                                            {new Date(
                                                                tpl.createdAt,
                                                            ).toLocaleDateString()}
                                                        </Typography>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                    {filteredTemplates.length === 0 && (
                                        <Grid item xs={12}>
                                            <Paper
                                                sx={{
                                                    p: 6,
                                                    textAlign: "center",
                                                    backgroundColor: alpha(
                                                        theme.palette.background
                                                            .default,
                                                        0.5,
                                                    ),
                                                }}
                                            >
                                                <DescriptionIcon
                                                    sx={{
                                                        fontSize: 48,
                                                        color: theme.palette
                                                            .text.disabled,
                                                        mb: 1,
                                                    }}
                                                />
                                                <Typography color="textSecondary">
                                                    No templates found matching
                                                    your search.
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    )}
                                </Grid>
                            )}
                        </Box>
                    </Fade>
                );
            case 1:
                return (
                    <Fade in={true}>
                        <Box maxWidth={700} mx="auto">
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={2}
                                textAlign="center"
                            >
                                Campaign Configuration
                            </Typography>
                            <Stack spacing={4}>
                                <TextField
                                    fullWidth
                                    label="Campaign Name"
                                    placeholder="E.g. Summer Sale 2024"
                                    required
                                    value={campaignName}
                                    onChange={(e) =>
                                        setCampaignName(e.target.value)
                                    }
                                    InputProps={{
                                        sx: { borderRadius: 2 },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Internal Description"
                                    placeholder="What is this campaign about?"
                                    multiline
                                    rows={3}
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    InputProps={{
                                        sx: { borderRadius: 2 },
                                    }}
                                />

                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={700}
                                        mb={1.5}
                                    >
                                        Delivery Schedule
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Paper
                                                onClick={() =>
                                                    setSendType("Instant")
                                                }
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    cursor: "pointer",
                                                    textAlign: "center",
                                                    border: `2px solid ${sendType === "Instant" ? theme.palette.primary.main : alpha(theme.palette.divider, 0.1)}`,
                                                    backgroundColor:
                                                        sendType === "Instant"
                                                            ? alpha(
                                                                  theme.palette
                                                                      .primary
                                                                      .main,
                                                                  0.05,
                                                              )
                                                            : "transparent",
                                                }}
                                            >
                                                <SendIcon
                                                    sx={{
                                                        color:
                                                            sendType ===
                                                            "Instant"
                                                                ? theme.palette
                                                                      .primary
                                                                      .main
                                                                : theme.palette
                                                                      .text
                                                                      .secondary,
                                                        mb: 0.5,
                                                    }}
                                                />
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={700}
                                                >
                                                    Send Immediately
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Paper
                                                onClick={() =>
                                                    setSendType("Scheduled")
                                                }
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    cursor: "pointer",
                                                    textAlign: "center",
                                                    border: `2px solid ${sendType === "Scheduled" ? theme.palette.primary.main : alpha(theme.palette.divider, 0.1)}`,
                                                    backgroundColor:
                                                        sendType === "Scheduled"
                                                            ? alpha(
                                                                  theme.palette
                                                                      .primary
                                                                      .main,
                                                                  0.05,
                                                              )
                                                            : "transparent",
                                                }}
                                            >
                                                <TimerIcon
                                                    sx={{
                                                        color:
                                                            sendType ===
                                                            "Scheduled"
                                                                ? theme.palette
                                                                      .primary
                                                                      .main
                                                                : theme.palette
                                                                      .text
                                                                      .secondary,
                                                        mb: 0.5,
                                                    }}
                                                />
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={700}
                                                >
                                                    Schedule Later
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {sendType === "Scheduled" && (
                                    <Grow in={true}>
                                        <TextField
                                            label="Select Date & Time"
                                            type="datetime-local"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            value={scheduledTime}
                                            onChange={(e) =>
                                                setScheduledTime(e.target.value)
                                            }
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                    </Grow>
                                )}
                            </Stack>
                        </Box>
                    </Fade>
                );
            case 2:
                return (
                    <Fade in={true}>
                        <Box sx={{ py: 2 }}>
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                mb={1}
                                textAlign="center"
                            >
                                Population Census
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                textAlign="center"
                                mb={4}
                            >
                                Upload your database to hydrate the campaign
                                variables
                            </Typography>

                            {uploadStatus === "idle" && (
                                <Box maxWidth={600} mx="auto">
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 0,
                                            border: `2px dashed ${file ? theme.palette.success.main : alpha(theme.palette.primary.main, 0.3)}`,
                                            borderRadius: 6,
                                            overflow: "hidden",
                                            transition:
                                                "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                            "&:hover": {
                                                borderColor:
                                                    theme.palette.primary.main,
                                                transform: "translateY(-4px)",
                                                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                                            },
                                            mb: 4,
                                        }}
                                    >
                                        <Box
                                            component="label"
                                            sx={{
                                                display: "block",
                                                p: 6,
                                                cursor: "pointer",
                                                textAlign: "center",
                                            }}
                                        >
                                            <input
                                                type="file"
                                                accept=".csv"
                                                hidden
                                                onChange={handleCsvUpload}
                                            />
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: "50%",
                                                    backgroundColor: alpha(
                                                        file
                                                            ? theme.palette
                                                                  .success.main
                                                            : theme.palette
                                                                  .primary.main,
                                                        0.1,
                                                    ),
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mx: "auto",
                                                    mb: 3,
                                                    transition: "all 0.3s",
                                                }}
                                            >
                                                {file ? (
                                                    <CheckCircleIcon
                                                        sx={{
                                                            fontSize: 40,
                                                            color: theme.palette
                                                                .success.main,
                                                        }}
                                                    />
                                                ) : (
                                                    <CloudUploadIcon
                                                        sx={{
                                                            fontSize: 40,
                                                            color: theme.palette
                                                                .primary.main,
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                fontWeight={800}
                                                gutterBottom
                                            >
                                                {file
                                                    ? "File Synchronized"
                                                    : "Drop CSV to Import"}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{ mb: 3 }}
                                            >
                                                {file
                                                    ? file.name
                                                    : "Your files will be encrypted and processed locally"}
                                            </Typography>

                                            {file && (
                                                <Chip
                                                    icon={<DescriptionIcon />}
                                                    label={`${(file.size / 1024).toFixed(1)} KB`}
                                                    variant="outlined"
                                                    color="success"
                                                    sx={{
                                                        borderRadius: 2,
                                                        fontWeight: 700,
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        {!file && (
                                            <Box
                                                sx={{
                                                    py: 2,
                                                    backgroundColor: alpha(
                                                        theme.palette.primary
                                                            .main,
                                                        0.03,
                                                    ),
                                                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                    fontWeight={600}
                                                >
                                                    RESTRICTIONS: .CSV ONLY •
                                                    MAX 5MB • MIN 1 ROW
                                                </Typography>
                                            </Box>
                                        )}
                                    </Paper>

                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        justifyContent="center"
                                    >
                                        <Button
                                            variant="text"
                                            startIcon={<DownloadIcon />}
                                            onClick={downloadSampleCSV}
                                            sx={{
                                                borderRadius: 3,
                                                fontWeight: 700,
                                                color: theme.palette.text
                                                    .secondary,
                                            }}
                                        >
                                            Get Mapping Template
                                        </Button>
                                        {file && (
                                            <Button
                                                variant="text"
                                                color="error"
                                                onClick={() => {
                                                    setFile(null);
                                                    setCsvData([]);
                                                }}
                                                sx={{
                                                    borderRadius: 3,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Reset File
                                            </Button>
                                        )}
                                    </Stack>
                                </Box>
                            )}

                            {(uploadStatus === "uploading" ||
                                uploadStatus === "processing") && (
                                <Box sx={{ py: 10, textAlign: "center" }}>
                                    <Box
                                        position="relative"
                                        display="inline-flex"
                                        mb={4}
                                    >
                                        <CircularProgress
                                            size={140}
                                            thickness={2}
                                            variant="determinate"
                                            value={uploadProgress}
                                            sx={{
                                                color: theme.palette.divider,
                                            }}
                                        />
                                        <CircularProgress
                                            size={140}
                                            thickness={4}
                                            variant="determinate"
                                            value={uploadProgress}
                                            sx={{
                                                position: "absolute",
                                                left: 0,
                                                color: theme.palette.primary
                                                    .main,
                                                circle: {
                                                    strokeLinecap: "round",
                                                },
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                position: "absolute",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Typography
                                                variant="h4"
                                                fontWeight={900}
                                            >
                                                {uploadProgress}%
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                fontWeight={700}
                                                sx={{ opacity: 0.6 }}
                                            >
                                                COMPLETE
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        fontWeight={900}
                                        letterSpacing="-0.5px"
                                        gutterBottom
                                    >
                                        {uploadStatus === "uploading"
                                            ? "Broadcasting Logic..."
                                            : "Finalizing Database..."}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        We are validating headers and cleaning
                                        metadata
                                    </Typography>
                                </Box>
                            )}

                            {uploadStatus === "completed" && (
                                <Box sx={{ py: 6, textAlign: "center" }}>
                                    <Box
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: "50%",
                                            backgroundColor: alpha(
                                                theme.palette.success.main,
                                                0.1,
                                            ),
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mx: "auto",
                                            mb: 4,
                                            animation: "pulse 2s infinite",
                                        }}
                                    >
                                        <CheckCircleIcon
                                            sx={{
                                                fontSize: 60,
                                                color: theme.palette.success
                                                    .main,
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h3"
                                        fontWeight={950}
                                        letterSpacing="-2px"
                                        gutterBottom
                                    >
                                        SYSTEMS PRIMED
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                        mb={5}
                                        fontWeight={400}
                                    >
                                        Launch sequence initiated. All systems
                                        are go.
                                    </Typography>

                                    <Grid
                                        container
                                        spacing={2}
                                        maxWidth={600}
                                        mx="auto"
                                    >
                                        <Grid item xs={6}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 3,
                                                    borderRadius: 4,
                                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                    backgroundColor: alpha(
                                                        theme.palette.success
                                                            .main,
                                                        0.05,
                                                    ),
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                    fontWeight={700}
                                                    uppercase
                                                >
                                                    RECIPIENTS
                                                </Typography>
                                                <Typography
                                                    variant="h4"
                                                    fontWeight={900}
                                                >
                                                    {processSummary.valid}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 3,
                                                    borderRadius: 4,
                                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                    fontWeight={700}
                                                    uppercase
                                                >
                                                    ANOMALIES
                                                </Typography>
                                                <Typography
                                                    variant="h4"
                                                    fontWeight={900}
                                                    color={
                                                        processSummary.invalid >
                                                        0
                                                            ? "error.main"
                                                            : "text.primary"
                                                    }
                                                >
                                                    {processSummary.invalid}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {uploadStatus === "failed" && (
                                <Box sx={{ py: 10, textAlign: "center" }}>
                                    <ErrorIcon
                                        sx={{
                                            fontSize: 100,
                                            color: theme.palette.error.main,
                                            mb: 3,
                                        }}
                                    />
                                    <Typography
                                        variant="h4"
                                        fontWeight={900}
                                        gutterBottom
                                    >
                                        Synchronization Error
                                    </Typography>
                                    <Typography color="textSecondary" mb={4}>
                                        The database format is incompatible with
                                        the selected template.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => setUploadStatus("idle")}
                                        sx={{
                                            borderRadius: 3,
                                            px: 4,
                                            py: 1.5,
                                            backgroundColor:
                                                theme.palette.error.main,
                                            "&:hover": {
                                                backgroundColor:
                                                    theme.palette.error.dark,
                                            },
                                        }}
                                    >
                                        Reinstate Link
                                    </Button>
                                </Box>
                            )}

                            {file && uploadStatus === "idle" && (
                                <Grow in={true}>
                                    <Box maxWidth={600} mx="auto" mt={2}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                borderRadius: 4,
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    backgroundColor: alpha(
                                                        theme.palette.success
                                                            .main,
                                                        0.05,
                                                    ),
                                                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        fontWeight={800}
                                                    >
                                                        PREVIEW DATASET
                                                    </Typography>
                                                    <Chip
                                                        label="Ready to Upload"
                                                        size="small"
                                                        color="success"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: "0.65rem",
                                                            fontWeight: 900,
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>
                                            <CardContent sx={{ py: 3 }}>
                                                <Stack spacing={2}>
                                                    <Box
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                        >
                                                            Mapped Variables
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={700}
                                                        >
                                                            {csvData[0]
                                                                ? Object.keys(
                                                                      csvData[0],
                                                                  ).length
                                                                : 0}{" "}
                                                            Columns
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                        >
                                                            Total Audience Size
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={700}
                                                        >
                                                            {csvData.length}{" "}
                                                            Members
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Grow>
                            )}
                        </Box>
                    </Fade>
                );
            default:
                return "Unknown step";
        }
    };

    const isNextDisabled = () => {
        if (activeStep === 0) return !selectedTemplate;
        if (activeStep === 1)
            return (
                !campaignName || (sendType === "Scheduled" && !scheduledTime)
            );
        if (activeStep === 2) return !file || uploadStatus !== "idle";
        return false;
    };

    return (
        <Box sx={{ maxWidth: 1300, mx: "auto", py: 3, px: 1 }}>
            {/* Glossy Header Area */}
            <Paper
                elevation={0}
                sx={{
                    mb: 2,
                    p: 3,
                    borderRadius: 5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.25)}`,
                }}
            >
                <Box sx={{ position: "relative", zIndex: 2 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        mb={1}
                    >
                        <CampaignIcon sx={{ fontSize: 36 }} />
                        <Typography
                            variant="h4"
                            fontWeight={900}
                            letterSpacing="-1px"
                        >
                            New Campaign
                        </Typography>
                    </Stack>
                    <Typography
                        variant="h6"
                        sx={{ opacity: 0.8, fontWeight: 400 }}
                    >
                        Design, configure, and blast your messages in minutes.
                    </Typography>
                </Box>
                {/* Decorative Elements */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -50,
                        right: -50,
                        width: 250,
                        height: 250,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        zIndex: 1,
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: -20,
                        right: 100,
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.05)",
                        zIndex: 1,
                    }}
                />
            </Paper>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel
                            StepIconProps={{
                                sx: {
                                    "&.Mui-active": {
                                        color: theme.palette.primary.main,
                                    },
                                    "&.Mui-completed": {
                                        color: theme.palette.success.main,
                                    },
                                },
                            }}
                        >
                            <Typography fontWeight={700}>{label}</Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ minHeight: 500 }}>{renderStepContent(activeStep)}</Box>

            {/* Sticky Navigation Footer */}
            <Paper
                elevation={10}
                sx={{
                    position: "sticky",
                    bottom: 24,
                    mt: 8,
                    p: 2,
                    borderRadius: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    zIndex: 1000,
                }}
            >
                <Button
                    disabled={activeStep === 0 || uploadStatus === "completed"}
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ borderRadius: 3, px: 4, fontWeight: 700, height: 48 }}
                >
                    Previous
                </Button>

                <Box display="flex" alignItems="center" gap={3}>
                    {activeStep === 0 && selectedTemplate && (
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            display={{ xs: "none", md: "block" }}
                        >
                            Working with:{" "}
                            <strong>{selectedTemplate.name}</strong>
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={isNextDisabled()}
                        endIcon={
                            activeStep === steps.length - 1 ? (
                                <SendIcon />
                            ) : (
                                <ArrowForwardIcon />
                            )
                        }
                        sx={{
                            borderRadius: 3,
                            px: 6,
                            height: 52,
                            fontWeight: 800,
                            letterSpacing: "0.5px",
                            background:
                                activeStep === steps.length - 1
                                    ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                                    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            boxShadow: `0 8px 16px ${alpha(activeStep === steps.length - 1 ? theme.palette.success.main : theme.palette.primary.main, 0.25)}`,
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: `0 12px 20px ${alpha(activeStep === steps.length - 1 ? theme.palette.success.main : theme.palette.primary.main, 0.35)}`,
                            },
                        }}
                    >
                        {activeStep === steps.length - 1
                            ? "Launch Campaign"
                            : "Continue"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateCampaign;
