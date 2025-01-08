import * as React from 'react';

import Box from '@mui/material/Box';
import AdminLayout from '../../../layouts/AdminLayout';

import DevelopersManagementTable from "./components/DevelopersManagementTable";
import AddNewDeveloperForm from "./components/AddNewDeveloperForm";

export default function DevelopersManagement(props) {
  return (
    <AdminLayout>
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        
        <DevelopersManagementTable />
        <AddNewDeveloperForm />

      </Box>
    </AdminLayout>
  );
}