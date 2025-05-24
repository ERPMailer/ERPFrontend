import React from "react";
import { MainCard } from "../style/styleComponent";
import { Grid, TextField, Typography } from "@mui/material";

export default function CreateTemplate() {
  return (
    <MainCard>
      <Grid container>
        <Grid size={{ md: 6 }} p={2}>
          <Grid>
            <Typography>Add Template</Typography>
          </Grid>
          <Grid mt={1}>
            <TextField
              sx={{ width: "80%" }}
              id="outlined-basic"
              label="Template Name"
              variant="outlined"
            />
          </Grid>
          <Grid mt={1}>
            <TextField
              sx={{ width: "80%" }}
              id="outlined-basic"
              label="Subject"
              variant="outlined"
            />
          </Grid>
          <Grid mt={1}>
            <TextField
              sx={{ width: "80%" }}
              id="outlined-basic"
              label="Message"
              variant="outlined"
            />
          </Grid>
          <Grid mt={1}>
            <TextField
              sx={{ width: "80%" }}
              id="outlined-basic"
              label="Footer"
              variant="outlined"
            />
          </Grid>
          <Grid mt={1}>
            <TextField
              sx={{ width: "80%" }}
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
            />
          </Grid>
          <Grid mt={1}>
            <TextField
              sx={{ width: "80%" }}
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Grid>View Form Comp</Grid>
      </Grid>
    </MainCard>
  );
}
