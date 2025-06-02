import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Grid,
  Tooltip,
  Card,
  Alert,
  Chip
} from "@mui/material";
import CsvIcon from "@mui/icons-material/TableChart";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const CreateCampaign = () => {
  const [campaignName, setCampaignName] = useState("");
  const [template, setTemplate] = useState("");
  const [templateList, setTemplateList] = useState([]);
  const [templateVariables, setTemplateVariables] = useState([]);
  const [templateData, setTemplateData] = useState(null);
  const [schedule, setSchedule] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await axiosInstance.get("/template/get-template-user-id");
      if (res.data.success) {
        setTemplateList(res.data.data);
      }
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    const selected = templateList.find((t) => t._id === template);
    setTemplateVariables(selected?.variables || []);
    setTemplateData(selected || null);
  }, [template]);

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const [headerLine, ...rows] = text.split("\n").filter(Boolean);
      const headers = headerLine.split(",").map((h) => h.trim());

      const missingHeaders = templateVariables.filter(
        (required) => !headers.includes(required)
      );

      if (missingHeaders.length > 0) {
        setSnackbarMessage(
          `CSV columns missing required template variables: ${missingHeaders.join(", ")}`
        );
        setShowSnackbar(true);
        return;
      }

      const data = rows.map((row) => {
        const values = row.split(",");
        return headers.reduce((obj, header, i) => {
          obj[header] = values[i];
          return obj;
        }, {});
      });

      setCsvHeaders(headers);
      setCsvData(data);
      setCsvDialogOpen(true);
    };
    reader.readAsText(file);
  };

  const downloadCSVTemplate = () => {
    const allVars = [...new Set(templateVariables)];
    if (allVars.length === 0) {
      setSnackbarMessage("No variables found in template.");
      setShowSnackbar(true);
      return;
    }
    const header = allVars.join(",");
    const sample1 = allVars.map((v) => `Sample ${v}`);
    const sample2 = allVars.map((v) => `Example ${v}`);
    const csv = [header, sample1.join(","), sample2.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-variables.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    const formData = {
      campaignName,
      template,
      schedule,
      scheduleTime: schedule ? scheduleTime : null,
    };
    await axiosInstance.post(`/campaign/create`, formData);
    setSnackbarMessage("Campaign saved successfully!");
    setShowSnackbar(true);
  };

  const isFormValid =
    campaignName.trim() !== "" &&
    template.trim() !== "" &&
    (!schedule || scheduleTime.trim() !== "");

  const replaceVariables = (text) => {
    if (!text || !templateVariables) return text;
    let replaced = text;
    templateVariables.forEach((v) => {
      const regex = new RegExp(`{{\\s*${v}\\s*}}`, "g");
      replaced = replaced.replace(regex, `Sample ${v}`);
    });
    return replaced;
  };

  return (
    <Grid container spacing={4} sx={{ p: 4 }}>
      <Grid item xs={12} md={5}>
        <Box>
          <Typography variant="h5" mb={2}>Create Campaign</Typography>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Campaign Name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="template-label">Select Template</InputLabel>
            <Select
              labelId="template-label"
              value={template}
              label="Select Template"
              onChange={(e) => setTemplate(e.target.value)}
            >
              {templateList.map((tpl) => (
                <MenuItem key={tpl._id} value={tpl._id}>
                  {tpl.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={<Checkbox checked={schedule} onChange={(e) => setSchedule(e.target.checked)} />}
            label="Schedule?"
          />

          {schedule && (
            <FormControl fullWidth margin="normal">
              <TextField
                label="Schedule Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </FormControl>
          )}

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="outlined"
              startIcon={<CsvIcon />}
              disabled={!template || templateVariables.length === 0}
              onClick={downloadCSVTemplate}
            >
              Download CSV
            </Button>

            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              disabled={!template || templateVariables.length === 0}
            >
              Upload CSV
              <input type="file" accept=".csv" hidden onChange={handleCsvUpload} />
            </Button>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Submit
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} md={7}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Live Preview
          </Typography>
          {templateData ? (
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {replaceVariables(templateData.name)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Subject: {replaceVariables(templateData.subject)}
              </Typography>
              <Box
                sx={{ mt: 2 }}
                dangerouslySetInnerHTML={{
                  __html: replaceVariables(templateData.body || ""),
                }}
              />
            </Card>
          ) : (
            <Alert severity="info">Select a template to preview.</Alert>
          )}
        </Paper>
      </Grid>

      <Dialog open={csvDialogOpen} onClose={() => setCsvDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>
          CSV Preview
          <IconButton
            aria-label="close"
            onClick={() => setCsvDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {csvHeaders.map((header, idx) => (
                    <TableCell key={idx}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {csvData.map((row, idx) => (
                  <TableRow key={idx}>
                    {csvHeaders.map((header) => (
                      <TableCell key={header}>{row[header]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
      />
    </Grid>
  );
};

export default CreateCampaign;
