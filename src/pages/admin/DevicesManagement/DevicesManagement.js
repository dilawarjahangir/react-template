import * as React from 'react';

import Box from '@mui/material/Box';
import AdminLayout from '../../../layouts/AdminLayout';

import DevicesManagementTable from "./components/DevicesManagementTable";
import AddNewDeviceForm from "./components/AddNewDeviceForm";

export default function DevicesManagement(props) {
  return (
    <AdminLayout>
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        
        <DevicesManagementTable />
        <AddNewDeviceForm />

      </Box>
    </AdminLayout>
  );
}