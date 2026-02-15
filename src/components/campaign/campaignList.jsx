
 
 


  
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'

export default function CampaignList() {
  const [loading, setLoading] = React.useState(true);
  const columns = [
        { field: "campaignName", headerName: "Campaign Name", width: 150 },
        { field: "emailSubject", headerName: "Email Subject", width: 150 },
        { field: "createdAt", headerName: "Created At", width: 150 },
        { field: "status", headerName: "Status", width: 150 },
    ];
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 5,
    });

     return (
         <Paper sx={{ height: 400, width: "100%" }}>
             <DataGrid
                 getRowId={(row) => row._id}
                 columns={columns}
                 loading={loading}
                 initialState={{ pagination: { paginationModel } }}
                 pageSizeOptions={[5, 10]}
                 sx={{ border: 0 }}
             />
         </Paper>
     );
}

