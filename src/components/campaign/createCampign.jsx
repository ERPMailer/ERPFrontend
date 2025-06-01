import React, { useState } from 'react';
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
} from '@mui/material';

const CreateCampaign = () => {
  const [campaignName, setCampaignName] = useState('');
  const [template, setTemplate] = useState('');
  const [schedule, setSchedule] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');

  const isFormValid =
    campaignName.trim() !== '' &&
    template.trim() !== '' &&
    (!schedule || scheduleTime.trim() !== '');

  const handleSubmit = async () => {
    const formData = {
      campaignName,
      template,
      schedule,
      scheduleTime: schedule ? scheduleTime : null,
    };
    const response = await axiosInstance.post(`/campaign/create`, formData);
        console.log("Saving campaign:", formData);
        setSnackbarMessage("campaign saved successfully!");
        setShowSnackbar(true);
    // TODO: handle actual form submission (e.g., API call)
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" mb={2}>
        Create Campaign
      </Typography>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="template-label">Template List</InputLabel>
        <Select
          labelId="template-label"
          value={template}
          label="Template List"
          onChange={(e) => setTemplate(e.target.value)}
        >
          <MenuItem value="Template1">Template 1</MenuItem>
          <MenuItem value="Template2">Template 2</MenuItem>
          <MenuItem value="Template3">Template 3</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={schedule}
            onChange={(e) => setSchedule(e.target.checked)}
          />
        }
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

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={!isFormValid}
      >
        Submit
      </Button>
    </Box>
  );
};

export default CreateCampaign;
