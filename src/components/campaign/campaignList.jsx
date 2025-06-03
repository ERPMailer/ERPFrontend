import React, { Component } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import axiosInstance from "../../utils/axiosInstance";

const columns = [
  { field: '__v', headerName: 'ID', width: 70 },
  { field: 'campaignName', headerName: 'campaignName', width: 130 },
  { field: 'isSheduled', headerName: 'isSheduled', width: 130 }
 
];


const paginationModel = { page: 0, pageSize: 5 };

export default class campaignList extends Component {

  state = {
    rows: [],
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const formData = {}; // You can customize or pass this as props
      const response = await axiosInstance.get(`/campaign/all`, formData);
      console.log("Saving campaign:", formData);
      console.log("Received response:", response.data);

      // Assuming response.data is an array of campaign objects
      this.setState({ rows: response.data });
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      this.setState({ loading: false });
    }
  }

 
  render() {
     const { rows, loading } = this.state;

    return (
       <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
         getRowId={(row) => row._id}
        columns={columns}
          loading={loading}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        
        sx={{ border: 0 }}
      />
    </Paper>
    )
  }
}
