"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
    Grid,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Card,
    CardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Stack,
    Chip,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slider,
    Container,
    Snackbar,
    FormHelperText,
    useMediaQuery,
    useTheme,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Tooltip,
    alpha,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Upload as UploadIcon,
    Save as SaveIcon,
    Download as DownloadIcon,
    Crop as CropIcon,
    Email as EmailIcon,
    Preview as PreviewIcon,
    AttachFile as AttachFileIcon,
    Draw as SignatureIcon,
    InsertDriveFile as FileIcon,
    Code as VariableIcon,
    TableChart as CsvIcon,
    Info as InfoIcon,
} from "@mui/icons-material";
import Cropper from "react-easy-crop";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

function EmailTemplateBuilder() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // Form state
    const [templateName, setTemplateName] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [messageBody, setMessageBody] = useState("");
    const [footerText, setFooterText] = useState("");
    const [ctaButtons, setCtaButtons] = useState([]);

    // Variables state
    const [variables, setVariables] = useState([]);
    const [showVariableDialog, setShowVariableDialog] = useState(false);
    const [newVariableName, setNewVariableName] = useState("");
    const [newVariableDescription, setNewVariableDescription] = useState("");

    // Image state
    const [uploadedImage, setUploadedImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [showCropDialog, setShowCropDialog] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Attachments state
    const [attachments, setAttachments] = useState([]);

    // Signature state
    const [signature, setSignature] = useState(null);
    const [showSignatureCropDialog, setShowSignatureCropDialog] =
        useState(false);
    const [signatureCrop, setSignatureCrop] = useState({ x: 0, y: 0 });
    const [signatureZoom, setSignatureZoom] = useState(1);
    const [signatureCroppedAreaPixels, setSignatureCroppedAreaPixels] =
        useState(null);
    const [uploadedSignature, setUploadedSignature] = useState(null);
    const [croppedSignature, setCroppedSignature] = useState(null);

    // UI state
    const [errors, setErrors] = useState({});
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [isEditorFocused, setIsEditorFocused] = useState(false);

    const navigate = useNavigate();
    const editorRef = useRef(null);

    const handleEditorInput = (e) => {
        setMessageBody(e.currentTarget.innerHTML);
    };

    // Sync initial editor content
    useEffect(() => {
        if (
            editorRef.current &&
            messageBody &&
            editorRef.current.innerHTML === ""
        ) {
            editorRef.current.innerHTML = messageBody;
        }
    }, []);

    // Extract variables from template content
    const extractVariables = (text) => {
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            const variableName = match[1].trim();
            if (!matches.includes(variableName)) {
                matches.push(variableName);
            }
        }
        return matches;
    };

    // Get all variables used in template
    const getAllUsedVariables = () => {
        const allText = `${templateName} ${emailSubject} ${messageBody} ${footerText} ${ctaButtons
            .map((btn) => `${btn.label} ${btn.url}`)
            .join(" ")}`;
        return extractVariables(allText);
    };

    // Add variable
    const addVariable = () => {
        if (!newVariableName.trim()) return;

        const newVariable = {
            id: Date.now().toString(),
            name: newVariableName.trim(),
            description: newVariableDescription.trim() || "No description",
            example: "Sample Value",
        };

        setVariables([...variables, newVariable]);
        setNewVariableName("");
        setNewVariableDescription("");
        setShowVariableDialog(false);
        setSnackbarMessage("Variable added successfully!");
        setShowSnackbar(true);
    };

    // Remove variable
    const removeVariable = (id) => {
        setVariables(variables.filter((v) => v.id !== id));
        setSnackbarMessage("Variable removed");
        setShowSnackbar(true);
    };

    // Insert variable into editor
    const insertVariable = (variableName) => {
        const variableTag = `{{${variableName}}}`;

        if (editorRef.current) {
            editorRef.current.focus();
            document.execCommand("insertText", false, variableTag);
            // Ensure state is updated after execCommand
            setMessageBody(editorRef.current.innerHTML);
        } else {
            setMessageBody((prev) => prev + variableTag);
        }

        setSnackbarMessage(`Variable {{${variableName}}} inserted`);
        setShowSnackbar(true);
    };

    // Download CSV template
    const downloadCSVTemplate = () => {
        const usedVariables = getAllUsedVariables();
        const allVariables = [
            ...new Set([...usedVariables, ...variables.map((v) => v.name)]),
        ];

        if (allVariables.length === 0) {
            setSnackbarMessage(
                "No variables found in template. Add some variables first!",
            );
            setShowSnackbar(true);
            return;
        }

        // Create CSV header
        const csvHeader = allVariables.join(",");

        // Create sample data rows
        const sampleRows = [
            allVariables.map((variable) => {
                switch (variable.toLowerCase()) {
                    case "name":
                    case "firstname":
                    case "first_name":
                        return "John Doe";
                    case "email":
                        return "john.doe@example.com";
                    case "company":
                        return "Acme Corp";
                    case "phone":
                        return "+1-555-0123";
                    case "city":
                        return "New York";
                    case "country":
                        return "USA";
                    case "amount":
                    case "price":
                        return "$99.99";
                    case "date":
                        return new Date().toLocaleDateString();
                    default:
                        return `Sample ${variable}`;
                }
            }),
            allVariables.map((variable) => {
                switch (variable.toLowerCase()) {
                    case "name":
                    case "firstname":
                    case "first_name":
                        return "Jane Smith";
                    case "email":
                        return "jane.smith@example.com";
                    case "company":
                        return "Tech Solutions";
                    case "phone":
                        return "+1-555-0456";
                    case "city":
                        return "Los Angeles";
                    case "country":
                        return "USA";
                    case "amount":
                    case "price":
                        return "$149.99";
                    case "date":
                        return new Date().toLocaleDateString();
                    default:
                        return `Example ${variable}`;
                }
            }),
        ];

        // Combine header and sample rows
        const csvContent = [
            csvHeader,
            ...sampleRows.map((row) => row.join(",")),
        ].join("\n");

        // Create and download file
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${templateName || "email-template"}-variables.csv`;
        a.click();
        URL.revokeObjectURL(url);

        setSnackbarMessage("CSV template downloaded successfully!");
        setShowSnackbar(true);
    };

    // Replace variables in text for preview
    const replaceVariablesInText = (text) => {
        const usedVariables = getAllUsedVariables();
        let replacedText = text;

        usedVariables.forEach((variable) => {
            const regex = new RegExp(`\\{\\{${variable}\\}\\}`, "g");
            const sampleValue = getSampleValue(variable);
            replacedText = replacedText.replace(
                regex,
                `<span style="background-color: #e3f2fd; padding: 2px 4px; border-radius: 3px; font-weight: 500;">${sampleValue}</span>`,
            );
        });

        return replacedText;
    };

    // Get sample value for variable
    const getSampleValue = (variable) => {
        const variableObj = variables.find((v) => v.name === variable);
        if (variableObj) return variableObj.example;

        switch (variable.toLowerCase()) {
            case "name":
            case "firstname":
            case "first_name":
                return "John Doe";
            case "email":
                return "john@example.com";
            case "company":
                return "Acme Corp";
            case "phone":
                return "+1-555-0123";
            case "city":
                return "New York";
            case "country":
                return "USA";
            case "amount":
            case "price":
                return "$99.99";
            case "date":
                return new Date().toLocaleDateString();
            default:
                return `[${variable}]`;
        }
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!templateName || templateName.length < 3) {
            newErrors.templateName =
                "Template name must be at least 3 characters";
        }

        if (!emailSubject || emailSubject.length < 5) {
            newErrors.emailSubject = "Subject must be at least 5 characters";
        }

        if (!messageBody || messageBody.trim().length < 10) {
            newErrors.messageBody =
                "Message body must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Image upload handler
    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result);
                setShowCropDialog(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // Signature upload handler
    const handleSignatureUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedSignature(reader.result);
                setShowSignatureCropDialog(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // Attachment upload handler
    const handleAttachmentUpload = (event) => {
        const files = Array.from(event.target.files || []);

        files.forEach((file) => {
            // Check file size (limit to 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setSnackbarMessage(
                    `File ${file.name} is too large. Maximum size is 10MB.`,
                );
                setShowSnackbar(true);
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const newAttachment = {
                    id: Date.now().toString() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: reader.result,
                };
                setAttachments((prev) => [...prev, newAttachment]);
                setSnackbarMessage(`${file.name} attached successfully!`);
                setShowSnackbar(true);
            };
            reader.readAsDataURL(file);
        });
    };

    // Remove attachment
    const removeAttachment = (id) => {
        setAttachments(attachments.filter((att) => att.id !== id));
        setSnackbarMessage("Attachment removed");
        setShowSnackbar(true);
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
            " " +
            sizes[i]
        );
    };

    // Crop complete handler
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Signature crop complete handler
    const onSignatureCropComplete = useCallback(
        (croppedArea, croppedAreaPixels) => {
            setSignatureCroppedAreaPixels(croppedAreaPixels);
        },
        [],
    );

    // Create cropped image
    const createCroppedImage = useCallback(async () => {
        if (!uploadedImage || !croppedAreaPixels) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const image = new Image();

        image.crossOrigin = "anonymous";
        image.onload = () => {
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx?.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
            );

            setCroppedImage(canvas.toDataURL());
            setShowCropDialog(false);
            setSnackbarMessage("Image cropped successfully!");
            setShowSnackbar(true);
        };

        image.src = uploadedImage;
    }, [uploadedImage, croppedAreaPixels]);

    // Create cropped signature
    const createCroppedSignature = useCallback(async () => {
        if (!uploadedSignature || !signatureCroppedAreaPixels) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const image = new Image();

        image.crossOrigin = "anonymous";
        image.onload = () => {
            canvas.width = signatureCroppedAreaPixels.width;
            canvas.height = signatureCroppedAreaPixels.height;

            ctx?.drawImage(
                image,
                signatureCroppedAreaPixels.x,
                signatureCroppedAreaPixels.y,
                signatureCroppedAreaPixels.width,
                signatureCroppedAreaPixels.height,
                0,
                0,
                signatureCroppedAreaPixels.width,
                signatureCroppedAreaPixels.height,
            );

            setCroppedSignature(canvas.toDataURL());
            setShowSignatureCropDialog(false);
            setSnackbarMessage("Signature cropped successfully!");
            setShowSnackbar(true);
        };

        image.src = uploadedSignature;
    }, [uploadedSignature, signatureCroppedAreaPixels]);

    // Add CTA button
    const addCTAButton = () => {
        const newButton = {
            id: Date.now().toString(),
            label: "",
            url: "",
            style: "primary",
        };
        setCtaButtons([...ctaButtons, newButton]);
    };

    // Update CTA button
    const updateCTAButton = (id, field, value) => {
        setCtaButtons(
            ctaButtons.map((button) =>
                button.id === id ? { ...button, [field]: value } : button,
            ),
        );
    };

    // Remove CTA button
    const removeCTAButton = (id) => {
        setCtaButtons(ctaButtons.filter((button) => button.id !== id));
    };

    // Rich text formatting functions
    const formatText = (command, value = null) => {
        document.execCommand(command, false, value);
    };

    const insertLink = () => {
        const url = prompt("Enter URL:");
        if (url) {
            formatText("createLink", url);
        }
    };

    // Save template
    const saveTemplate = async () => {
        if (!validateForm()) {
            setSnackbarMessage("Please fix the errors before saving");
            setSnackbarSeverity("error");
            setShowSnackbar(true);
            return;
        }

        try {
            const template = {
                name: templateName,
                subject: emailSubject,
                message: messageBody,
                footer: footerText,
                image: croppedImage,
                signature: croppedSignature,
                buttons: ctaButtons,
                variables: getAllUsedVariables(),
                attachments: attachments.map((att) => ({
                    id: att.id,
                    name: att.name,
                    size: att.size,
                    type: att.type,
                })),
                // createdAt: new Date().toISOString(),
            };

            const response = await axiosInstance.post(`/template/create`, {
                template: JSON.stringify(template),
            });

            console.log("Template saved successfully:", response.data);
            setSnackbarMessage("✓ Template created successfully!");
            setSnackbarSeverity("success");
            setShowSnackbar(true);
            navigate("/templates");

            // Optional: Reset form after successful creation
            // setTimeout(() => {
            //   setTemplateName("");
            //   setEmailSubject("");
            //   setMessageBody("");
            //   setFooterText("");
            //   setCtaButtons([]);
            //   setCroppedImage(null);
            //   setCroppedSignature(null);
            //   setAttachments([]);
            // }, 1500);
        } catch (error) {
            console.error("Error saving template:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to create template. Please try again.";
            setSnackbarMessage(`✗ ${errorMessage}`);
            setSnackbarSeverity("error");
            setShowSnackbar(true);
        }
    };

    // Export to HTML
    const exportToHTML = () => {
        if (!validateForm()) {
            setSnackbarMessage("Please fix the errors before exporting");
            setShowSnackbar(true);
            return;
        }

        const html = generateEmailHTML();
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${templateName || "email-template"}.html`;
        a.click();
        URL.revokeObjectURL(url);

        setSnackbarMessage("HTML exported successfully!");
        setShowSnackbar(true);
    };

    // Export to JSON
    const exportToJSON = () => {
        if (!validateForm()) return;

        const template = {
            name: templateName,
            subject: emailSubject,
            message: messageBody,
            footer: footerText,
            image: croppedImage,
            signature: croppedSignature,
            buttons: ctaButtons,
            variables: variables,
            attachments: attachments.map((att) => ({
                id: att.id,
                name: att.name,
                size: att.size,
                type: att.type,
            })),
        };

        const blob = new Blob([JSON.stringify(template, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${templateName || "email-template"}.json`;
        a.click();
        URL.revokeObjectURL(url);

        setSnackbarMessage("JSON exported successfully!");
        setShowSnackbar(true);
    };

    // Generate email HTML
    const generateEmailHTML = () => {
        const buttonHTML = ctaButtons
            .map(
                (button) => `
      <a href="${button.url}" style="
        display: inline-block;
        padding: 12px 24px;
        margin: 8px 4px;
        background-color: ${
            button.style === "primary"
                ? "#1976d2"
                : button.style === "secondary"
                  ? "#757575"
                  : "#4caf50"
        };
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 500;
        font-family: Arial, sans-serif;
      ">${button.label}</a>
    `,
            )
            .join("");

        const attachmentHTML =
            attachments.length > 0
                ? `
      <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
        <h4 style="margin: 0 0 10px 0; color: #333;">Attachments (${
            attachments.length
        })</h4>
        ${attachments
            .map(
                (att) => `
          <div style="display: flex; align-items: center; margin: 5px 0; padding: 5px; background-color: white; border-radius: 3px;">
            <span style="margin-right: 8px;">📎</span>
            <span style="flex: 1; font-size: 14px;">${att.name}</span>
            <span style="font-size: 12px; color: #666;">${formatFileSize(
                att.size,
            )}</span>
          </div>
        `,
            )
            .join("")}
      </div>
    `
                : "";

        const signatureHTML = croppedSignature
            ? `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <img src="${croppedSignature}" alt="Email signature" style="max-width: 300px; height: auto;">
      </div>
    `
            : "";

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailSubject}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f5f5f5;
          }
          .email-container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .email-header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px solid #1976d2;
            padding-bottom: 20px;
          }
          .email-content { 
            line-height: 1.6; 
            margin-bottom: 30px;
          }
          .image-container { 
            text-align: center; 
            margin: 20px 0; 
          }
          .buttons-container { 
            text-align: center; 
            margin: 30px 0; 
          }
          .email-footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1 style="color: #1976d2; margin: 0;">${templateName}</h1>
            <h2 style="color: #666; margin: 10px 0 0 0; font-weight: normal;">${emailSubject}</h2>
          </div>
          ${
              croppedImage
                  ? `<div class="image-container"><img src="${croppedImage}" alt="Email image" style="max-width: 100%; height: auto; border-radius: 8px;"></div>`
                  : ""
          }
          <div class="email-content">${messageBody}</div>
          ${
              buttonHTML
                  ? `<div class="buttons-container">${buttonHTML}</div>`
                  : ""
          }
          ${attachmentHTML}
          ${footerText ? `<div class="email-footer">${footerText}</div>` : ""}
          ${signatureHTML}
        </div>
      </body>
      </html>
    `;
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Modern Header Section */}
            <Card
                elevation={0}
                sx={{
                    mb: 4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 3,
                }}
            >
                <CardContent sx={{ py: 3 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}
                        >
                            <EmailIcon sx={{ color: "white", fontSize: 32 }} />
                        </Box>
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
                                Email Template Builder
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: theme.palette.text.secondary }}
                            >
                                Create personalized email templates with
                                variables, attachments, and signatures
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {/* Left Panel - Form Input */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            height: "fit-content",
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ mb: 3 }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                sx={{
                                    color: theme.palette.primary.main,
                                }}
                            >
                                Template Configuration
                            </Typography>
                        </Stack>

                        {/* Template Name */}
                        <TextField
                            fullWidth
                            label="Template Name"
                            variant="outlined"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            error={!!errors.templateName}
                            helperText={errors.templateName}
                            sx={{
                                mb: 3,
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                            required
                        />

                        {/* Email Subject */}
                        <TextField
                            fullWidth
                            label="Subject"
                            variant="outlined"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            error={!!errors.emailSubject}
                            helperText={errors.emailSubject}
                            sx={{
                                mb: 3,
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                            required
                        />

                        {/* Variables Section */}
                        <Box sx={{ mb: 4 }}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <VariableIcon
                                        color="primary"
                                        fontSize="small"
                                    />
                                    Template Variables
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<CsvIcon />}
                                        onClick={downloadCSVTemplate}
                                        disabled={
                                            getAllUsedVariables().length === 0
                                        }
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: "none",
                                        }}
                                    >
                                        CSV Template
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={() =>
                                            setShowVariableDialog(true)
                                        }
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: "none",
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                                        }}
                                    >
                                        Add
                                    </Button>
                                </Stack>
                            </Stack>

                            <Alert
                                severity="info"
                                variant="outlined"
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                    borderColor: alpha(
                                        theme.palette.info.main,
                                        0.3,
                                    ),
                                    bgcolor: alpha(
                                        theme.palette.info.main,
                                        0.02,
                                    ),
                                }}
                            >
                                <Typography variant="body2">
                                    Use variables like <code>{"{{name}}"}</code>{" "}
                                    or <code>{"{{email}}"}</code> to personalize
                                    your template.
                                </Typography>
                            </Alert>

                            {/* Used Variables */}
                            {getAllUsedVariables().length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: "block",
                                            mb: 1,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Variables found in template:
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={0.8}
                                        flexWrap="wrap"
                                    >
                                        {getAllUsedVariables().map(
                                            (variable) => (
                                                <Chip
                                                    key={variable}
                                                    label={`{{${variable}}}`}
                                                    size="small"
                                                    color="primary"
                                                    variant="soft"
                                                    sx={{
                                                        borderRadius: 1.5,
                                                        fontWeight: 600,
                                                        fontSize: "0.75rem",
                                                    }}
                                                    onClick={() =>
                                                        insertVariable(variable)
                                                    }
                                                />
                                            ),
                                        )}
                                    </Stack>
                                </Box>
                            )}

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: "block",
                                    mb: 1,
                                    fontWeight: 500,
                                }}
                            >
                                Custom variables:
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: alpha(
                                        theme.palette.background.default,
                                        0.4,
                                    ),
                                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                                    minHeight: "50px",
                                }}
                            >
                                {variables.length > 0 ? (
                                    variables.map((v) => (
                                        <Chip
                                            key={v.id}
                                            label={v.name}
                                            onDelete={() =>
                                                removeVariable(v.id)
                                            }
                                            onClick={() =>
                                                insertVariable(v.name)
                                            }
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                borderRadius: 1.5,
                                                fontWeight: 600,
                                                bgcolor: "white",
                                                "&:hover": {
                                                    bgcolor: alpha(
                                                        theme.palette.primary
                                                            .main,
                                                        0.04,
                                                    ),
                                                },
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontStyle: "italic", m: "auto" }}
                                    >
                                        No custom variables added.
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {/* Rich Text Editor */}
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                gutterBottom
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <EmailIcon color="primary" fontSize="small" />
                                Message Body *
                            </Typography>

                            {/* Formatting Toolbar */}
                            <Paper
                                elevation={0}
                                variant="outlined"
                                sx={{
                                    p: 0.5,
                                    mb: 1,
                                    display: "flex",
                                    gap: 0.5,
                                    flexWrap: "wrap",
                                    borderRadius: 2,
                                    bgcolor: alpha(
                                        theme.palette.background.default,
                                        0.5,
                                    ),
                                    borderColor: alpha(
                                        theme.palette.divider,
                                        0.1,
                                    ),
                                }}
                            >
                                {[
                                    {
                                        icon: "B",
                                        action: "bold",
                                        style: { fontWeight: "bold" },
                                    },
                                    {
                                        icon: "I",
                                        action: "italic",
                                        style: { fontStyle: "italic" },
                                    },
                                    {
                                        icon: "U",
                                        action: "underline",
                                        style: { textDecoration: "underline" },
                                    },
                                ].map((btn) => (
                                    <Button
                                        key={btn.action}
                                        size="small"
                                        onClick={() => formatText(btn.action)}
                                        sx={{
                                            minWidth: 36,
                                            height: 36,
                                            borderRadius: 1.5,
                                            color: theme.palette.text.primary,
                                            "&:hover": {
                                                bgcolor: alpha(
                                                    theme.palette.primary.main,
                                                    0.08,
                                                ),
                                            },
                                        }}
                                    >
                                        {btn.icon}
                                    </Button>
                                ))}
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{ mx: 0.5, my: 1 }}
                                />
                                <Button
                                    size="small"
                                    onClick={() =>
                                        formatText("insertUnorderedList")
                                    }
                                    sx={{
                                        borderRadius: 1.5,
                                        textTransform: "none",
                                    }}
                                >
                                    • Bullet List
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() =>
                                        formatText("insertOrderedList")
                                    }
                                    sx={{
                                        borderRadius: 1.5,
                                        textTransform: "none",
                                    }}
                                >
                                    1. Number List
                                </Button>
                                <Button
                                    size="small"
                                    onClick={insertLink}
                                    sx={{
                                        borderRadius: 1.5,
                                        textTransform: "none",
                                    }}
                                >
                                    Link
                                </Button>
                            </Paper>

                            <Box sx={{ position: "relative" }}>
                                <Box
                                    ref={editorRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onFocus={() => setIsEditorFocused(true)}
                                    onBlur={() => {
                                        setIsEditorFocused(false);
                                        handleEditorInput({
                                            currentTarget: editorRef.current,
                                        });
                                    }}
                                    onInput={handleEditorInput}
                                    sx={{
                                        minHeight: "250px",
                                        p: 2,
                                        border: `1px solid ${errors.messageBody ? theme.palette.error.main : alpha(theme.palette.divider, 0.2)}`,
                                        borderRadius: 2,
                                        bgcolor: "white",
                                        outline: "none",
                                        transition: "all 0.2s",
                                        "&:focus": {
                                            borderColor:
                                                theme.palette.primary.main,
                                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                                        },
                                        "& p": { margin: "0 0 1em 0" },
                                        "& ul, & ol": { paddingLeft: "20px" },
                                        "& a": { color: "primary.main" },
                                    }}
                                />

                                {errors.messageBody && (
                                    <FormHelperText
                                        error
                                        sx={{ ml: 1, mt: 0.5 }}
                                    >
                                        {errors.messageBody}
                                    </FormHelperText>
                                )}
                            </Box>
                        </Box>
                        {/* Footer */}
                        <TextField
                            fullWidth
                            label="Footer Text"
                            multiline
                            rows={2}
                            value={footerText}
                            onChange={(e) => setFooterText(e.target.value)}
                            sx={{
                                mb: 3,
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                            placeholder="Add footer text, contact information, or unsubscribe links..."
                        />

                        <Divider sx={{ my: 3 }} />

                        {/* Image Upload */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={4}>
                                <Box sx={{ mb: 4 }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                        gutterBottom
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <UploadIcon
                                            color="primary"
                                            fontSize="small"
                                        />
                                        Header Image
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        flexWrap="wrap"
                                        sx={{ mt: 1 }}
                                    >
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<UploadIcon />}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: "none",
                                            }}
                                        >
                                            Upload Image
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </Button>
                                        {croppedImage && (
                                            <Chip
                                                label="Image uploaded"
                                                color="success"
                                                variant="soft"
                                                onDelete={() =>
                                                    setCroppedImage(null)
                                                }
                                                sx={{
                                                    borderRadius: 2,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            </Grid>
                            {/* Signature Upload */}
                            <Grid item xs={12} md={6} lg={4}>
                                <Box sx={{ mb: 4 }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                        gutterBottom
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <SignatureIcon
                                            color="primary"
                                            fontSize="small"
                                        />
                                        Email Signature
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        flexWrap="wrap"
                                        sx={{ mt: 1 }}
                                    >
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<SignatureIcon />}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: "none",
                                            }}
                                        >
                                            Upload Signature
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleSignatureUpload}
                                            />
                                        </Button>
                                        {croppedSignature && (
                                            <Chip
                                                label="Signature uploaded"
                                                color="success"
                                                variant="soft"
                                                onDelete={() =>
                                                    setCroppedSignature(null)
                                                }
                                                sx={{
                                                    borderRadius: 2,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            </Grid>

                            {/* Attachments */}
                            <Grid item xs={12} md={6} lg={4}>
                                <Box sx={{ mb: 4 }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                        gutterBottom
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <AttachFileIcon
                                            color="primary"
                                            fontSize="small"
                                        />
                                        Attachments
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        flexWrap="wrap"
                                        sx={{ mt: 1, mb: 2 }}
                                    >
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<AttachFileIcon />}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: "none",
                                            }}
                                        >
                                            Add Attachments
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                onChange={
                                                    handleAttachmentUpload
                                                }
                                            />
                                        </Button>
                                        {attachments.length > 0 && (
                                            <Chip
                                                label={`${attachments.length} file(s) attached`}
                                                color="info"
                                                variant="soft"
                                                sx={{
                                                    borderRadius: 2,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        )}
                                    </Stack>

                                    {attachments.length > 0 && (
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                maxHeight: 200,
                                                overflow: "auto",
                                                borderRadius: 2,
                                                bgcolor: alpha(
                                                    theme.palette.background
                                                        .default,
                                                    0.5,
                                                ),
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                            }}
                                        >
                                            <List dense>
                                                {attachments.map(
                                                    (attachment) => (
                                                        <ListItem
                                                            key={attachment.id}
                                                        >
                                                            <FileIcon
                                                                sx={{
                                                                    mr: 1,
                                                                    color: "primary.main",
                                                                    fontSize: 20,
                                                                }}
                                                            />
                                                            <ListItemText
                                                                primary={
                                                                    attachment.name
                                                                }
                                                                primaryTypographyProps={{
                                                                    variant:
                                                                        "body2",
                                                                    fontWeight: 500,
                                                                }}
                                                                secondary={formatFileSize(
                                                                    attachment.size,
                                                                )}
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <IconButton
                                                                    edge="end"
                                                                    aria-label="delete"
                                                                    onClick={() =>
                                                                        removeAttachment(
                                                                            attachment.id,
                                                                        )
                                                                    }
                                                                    size="small"
                                                                    sx={{
                                                                        color: theme
                                                                            .palette
                                                                            .error
                                                                            .main,
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    ),
                                                )}
                                            </List>
                                        </Paper>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                        <Divider sx={{ my: 3 }} />

                        {/* CTA Buttons */}
                        <Box sx={{ mb: 4 }}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <AddIcon color="primary" fontSize="small" />
                                    Call-to-Action Buttons
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={addCTAButton}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                    }}
                                >
                                    Add Button
                                </Button>
                            </Stack>

                            {ctaButtons.map((button) => (
                                <Card
                                    key={button.id}
                                    variant="outlined"
                                    sx={{
                                        mb: 2,
                                        borderRadius: 2,
                                        bgcolor: alpha(
                                            theme.palette.background.default,
                                            0.4,
                                        ),
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            bgcolor: alpha(
                                                theme.palette.background
                                                    .default,
                                                0.8,
                                            ),
                                            borderColor: alpha(
                                                theme.palette.primary.main,
                                                0.2,
                                            ),
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 2 }}>
                                        <Stack spacing={2}>
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                alignItems="center"
                                            >
                                                <TextField
                                                    label="Button Label"
                                                    value={button.label}
                                                    onChange={(e) =>
                                                        updateCTAButton(
                                                            button.id,
                                                            "label",
                                                            e.target.value,
                                                        )
                                                    }
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiOutlinedInput-root":
                                                            {
                                                                borderRadius: 2,
                                                            },
                                                    }}
                                                />
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        removeCTAButton(
                                                            button.id,
                                                        )
                                                    }
                                                    size="small"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                            <TextField
                                                label="URL"
                                                value={button.url}
                                                onChange={(e) =>
                                                    updateCTAButton(
                                                        button.id,
                                                        "url",
                                                        e.target.value,
                                                    )
                                                }
                                                size="small"
                                                fullWidth
                                                placeholder="https://example.com"
                                                sx={{
                                                    "& .MuiOutlinedInput-root":
                                                        {
                                                            borderRadius: 2,
                                                        },
                                                }}
                                            />
                                            <FormControl size="small" fullWidth>
                                                <InputLabel>
                                                    Button Style
                                                </InputLabel>
                                                <Select
                                                    value={button.style}
                                                    label="Button Style"
                                                    onChange={(e) =>
                                                        updateCTAButton(
                                                            button.id,
                                                            "style",
                                                            e.target.value,
                                                        )
                                                    }
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    <MenuItem value="primary">
                                                        Primary
                                                    </MenuItem>
                                                    <MenuItem value="secondary">
                                                        Secondary
                                                    </MenuItem>
                                                    <MenuItem value="success">
                                                        Success
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}

                            {ctaButtons.length === 0 && (
                                <Alert
                                    severity="info"
                                    variant="outlined"
                                    sx={{
                                        mt: 1,
                                        borderRadius: 2,
                                        borderStyle: "dashed",
                                        borderColor: alpha(
                                            theme.palette.info.main,
                                            0.3,
                                        ),
                                    }}
                                >
                                    Add call-to-action buttons to make your
                                    email more engaging
                                </Alert>
                            )}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Save/Export Buttons */}
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={saveTemplate}
                                fullWidth
                                size="large"
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                    "&:hover": {
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                        transform: "translateY(-1px)",
                                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                                    },
                                    transition: "all 0.2s ease-in-out",
                                }}
                            >
                                Save Template
                            </Button>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={exportToHTML}
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 500,
                                        borderWidth: 1.5,
                                        "&:hover": {
                                            borderWidth: 1.5,
                                            bgcolor: alpha(
                                                theme.palette.primary.main,
                                                0.05,
                                            ),
                                        },
                                    }}
                                >
                                    Export HTML
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={exportToJSON}
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 500,
                                        borderWidth: 1.5,
                                        "&:hover": {
                                            borderWidth: 1.5,
                                            bgcolor: alpha(
                                                theme.palette.primary.main,
                                                0.05,
                                            ),
                                        },
                                    }}
                                >
                                    Export JSON
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Right Panel - Preview */}
                <Grid size={{ xs: 12, md: 7 }} width={"900px"}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            position: isMobile ? "static" : "sticky",
                            top: 20,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ mb: 3 }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                            >
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                                    }}
                                >
                                    <PreviewIcon
                                        sx={{ color: "white", fontSize: 20 }}
                                    />
                                </Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{ color: theme.palette.primary.main }}
                                >
                                    Live Preview
                                </Typography>
                                {getAllUsedVariables().length > 0 && (
                                    <Tooltip
                                        title="Variables are highlighted with sample data"
                                        arrow
                                    >
                                        <InfoIcon
                                            color="info"
                                            fontSize="small"
                                        />
                                    </Tooltip>
                                )}
                            </Stack>
                        </Stack>

                        {/* Gmail/Outlook Style Email Preview */}
                        <Card
                            variant="outlined"
                            sx={{
                                maxHeight: "80vh",
                                overflow: "auto",
                                bgcolor: alpha(
                                    theme.palette.background.default,
                                    0.4,
                                ),
                                borderColor: alpha(theme.palette.divider, 0.1),
                                borderRadius: 2,
                                boxShadow: "inset 0 2px 4px 0 rgba(0,0,0,0.02)",
                            }}
                        >
                            {/* Email Header Bar (like Gmail) */}
                            <Box
                                sx={{
                                    bgcolor: "white",
                                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    p: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        bgcolor: "primary.main",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {templateName
                                        ? templateName.charAt(0).toUpperCase()
                                        : "T"}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="500"
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: replaceVariablesInText(
                                                    templateName ||
                                                        "Your Template",
                                                ),
                                            }}
                                        />
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        to me
                                    </Typography>
                                </Box>
                                {attachments.length > 0 && (
                                    <Chip
                                        icon={<AttachFileIcon />}
                                        label={attachments.length}
                                        size="small"
                                        color="primary"
                                    />
                                )}
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {new Date().toLocaleDateString()}
                                </Typography>
                            </Box>

                            {/* Email Subject Line */}
                            {emailSubject && (
                                <Box
                                    sx={{
                                        bgcolor: "white",
                                        borderBottom: "1px solid #f0f0f0",
                                        p: 2,
                                        pl: 3,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight="400"
                                        color="text.primary"
                                    >
                                        Subject:{" "}
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: replaceVariablesInText(
                                                    emailSubject,
                                                ),
                                            }}
                                        />
                                    </Typography>
                                </Box>
                            )}

                            {/* Email Body Container */}
                            <Box
                                sx={{
                                    bgcolor: "white",
                                    p: 3,
                                    minHeight: "400px",
                                }}
                            >
                                {/* Header Image */}
                                {croppedImage && (
                                    <Box sx={{ textAlign: "center", mb: 3 }}>
                                        <img
                                            src={
                                                croppedImage ||
                                                "/placeholder.svg"
                                            }
                                            alt="Email header"
                                            style={{
                                                maxWidth: "100%",
                                                height: "auto",
                                                borderRadius: "8px",
                                                boxShadow:
                                                    "0 2px 8px rgba(0,0,0,0.1)",
                                            }}
                                        />
                                    </Box>
                                )}

                                {/* Message Body */}
                                {messageBody && (
                                    <Box
                                        sx={{
                                            mb: 3,
                                            lineHeight: 1.6,
                                            wordWrap: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "normal",
                                            fontSize: "14px",
                                            color: "#202124",
                                            fontFamily: "Arial, sans-serif",
                                            "& p": { margin: "0 0 16px 0" },
                                            "& ul, & ol": {
                                                paddingLeft: "20px",
                                                margin: "0 0 16px 0",
                                            },
                                            "& a": {
                                                color: "#1a73e8",
                                                textDecoration: "none",
                                            },
                                            "& strong": { fontWeight: "600" },
                                            "& em": { fontStyle: "italic" },
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: replaceVariablesInText(
                                                messageBody,
                                            ),
                                        }}
                                    />
                                )}

                                {/* CTA Buttons */}
                                {ctaButtons.length > 0 && (
                                    <Box sx={{ textAlign: "center", my: 3 }}>
                                        {ctaButtons.map((button) => (
                                            <Button
                                                key={button.id}
                                                variant={
                                                    button.style === "primary"
                                                        ? "contained"
                                                        : button.style ===
                                                            "secondary"
                                                          ? "outlined"
                                                          : "contained"
                                                }
                                                color={
                                                    button.style === "success"
                                                        ? "success"
                                                        : button.style ===
                                                            "secondary"
                                                          ? "inherit"
                                                          : "primary"
                                                }
                                                sx={{
                                                    m: 0.5,
                                                    borderRadius: "4px",
                                                    textTransform: "none",
                                                    fontWeight: "500",
                                                    px: 3,
                                                    py: 1,
                                                }}
                                                href={button.url}
                                                target="_blank"
                                                disabled={!button.url}
                                            >
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: replaceVariablesInText(
                                                            button.label ||
                                                                "Button Text",
                                                        ),
                                                    }}
                                                />
                                            </Button>
                                        ))}
                                    </Box>
                                )}

                                {/* Attachments Preview */}
                                {attachments.length > 0 && (
                                    <Box
                                        sx={{
                                            my: 3,
                                            p: 2,
                                            bgcolor: "#f8f9fa",
                                            borderRadius: 1,
                                            border: "1px solid #e9ecef",
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                mb: 1,
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <AttachFileIcon
                                                sx={{ mr: 1, fontSize: 16 }}
                                            />
                                            Attachments ({attachments.length})
                                        </Typography>
                                        {attachments.map((attachment) => (
                                            <Box
                                                key={attachment.id}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    p: 1,
                                                    mb: 1,
                                                    bgcolor: "white",
                                                    borderRadius: 0.5,
                                                    fontSize: "13px",
                                                }}
                                            >
                                                <FileIcon
                                                    sx={{
                                                        mr: 1,
                                                        fontSize: 16,
                                                        color: "text.secondary",
                                                    }}
                                                />
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2">
                                                        {attachment.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {formatFileSize(
                                                            attachment.size,
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                {/* Footer */}
                                {footerText && (
                                    <Box
                                        sx={{
                                            mt: 4,
                                            pt: 3,
                                            borderTop: "1px solid #e8eaed",
                                            textAlign: "center",
                                            fontSize: "12px",
                                            color: "#5f6368",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: replaceVariablesInText(
                                                    footerText,
                                                ),
                                            }}
                                        />
                                    </Box>
                                )}

                                {/* Signature */}
                                {croppedSignature && (
                                    <Box
                                        sx={{
                                            mt: 3,
                                            pt: 2,
                                            borderTop: "1px solid #e8eaed",
                                            textAlign: "left",
                                        }}
                                    >
                                        <img
                                            src={
                                                croppedSignature ||
                                                "/placeholder.svg"
                                            }
                                            alt="Email signature"
                                            style={{
                                                maxWidth: "300px",
                                                height: "auto",
                                            }}
                                        />
                                    </Box>
                                )}

                                {/* Empty State */}
                                {!templateName &&
                                    !emailSubject &&
                                    !messageBody &&
                                    !croppedImage &&
                                    ctaButtons.length === 0 &&
                                    !footerText &&
                                    !croppedSignature &&
                                    attachments.length === 0 && (
                                        <Alert
                                            severity="info"
                                            sx={{
                                                textAlign: "center",
                                                border: "1px solid #e3f2fd",
                                                bgcolor: "#f3f9ff",
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                            >
                                                Start Building Your Email
                                            </Typography>
                                            <Typography>
                                                Fill out the form on the left to
                                                see your email template come to
                                                life here in real-time!
                                            </Typography>
                                        </Alert>
                                    )}
                            </Box>

                            {/* Gmail-style bottom border */}
                            <Box sx={{ height: "1px", bgcolor: "#dadce0" }} />
                        </Card>
                    </Paper>
                </Grid>
            </Grid>

            {/* Variable Dialog */}
            <Dialog
                open={showVariableDialog}
                onClose={() => setShowVariableDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add New Variable</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Variable Name"
                            value={newVariableName}
                            onChange={(e) => setNewVariableName(e.target.value)}
                            placeholder="e.g., name, email, company"
                            helperText="Use lowercase letters, numbers, and underscores only"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={newVariableDescription}
                            onChange={(e) =>
                                setNewVariableDescription(e.target.value)
                            }
                            placeholder="Brief description of this variable"
                            multiline
                            rows={2}
                        />
                        <Alert severity="info">
                            Variables will be formatted as{" "}
                            <code>{"{{variable_name}}"}</code> in your template.
                        </Alert>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowVariableDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={addVariable}
                        variant="contained"
                        disabled={!newVariableName.trim()}
                    >
                        Add Variable
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Crop Dialog */}
            <Dialog
                open={showCropDialog}
                onClose={() => setShowCropDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CropIcon />
                        <Typography>Crop Your Image</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: 400,
                            mb: 2,
                        }}
                    >
                        {uploadedImage && (
                            <Cropper
                                image={uploadedImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        )}
                    </Box>
                    <Box sx={{ px: 2 }}>
                        <Typography gutterBottom>Zoom Level</Typography>
                        <Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(_, value) => setZoom(value)}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCropDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={createCroppedImage} variant="contained">
                        Apply Crop
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Signature Crop Dialog */}
            <Dialog
                open={showSignatureCropDialog}
                onClose={() => setShowSignatureCropDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <SignatureIcon />
                        <Typography>Crop Your Signature</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: 400,
                            mb: 2,
                        }}
                    >
                        {uploadedSignature && (
                            <Cropper
                                image={uploadedSignature}
                                crop={signatureCrop}
                                zoom={signatureZoom}
                                aspect={3 / 1}
                                onCropChange={setSignatureCrop}
                                onCropComplete={onSignatureCropComplete}
                                onZoomChange={setSignatureZoom}
                            />
                        )}
                    </Box>
                    <Box sx={{ px: 2 }}>
                        <Typography gutterBottom>Zoom Level</Typography>
                        <Slider
                            value={signatureZoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(_, value) => setSignatureZoom(value)}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSignatureCropDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={createCroppedSignature}
                        variant="contained"
                    >
                        Apply Crop
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={5000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setShowSnackbar(false)}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default EmailTemplateBuilder;
