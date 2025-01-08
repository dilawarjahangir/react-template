import * as React from 'react';

import Box from '@mui/material/Box';
import AdminLayout from '../../../layouts/AdminLayout';

import CustomersManagementTable from "./components/CustomersManagementTable";
import AddNewCustomerForm from "./components/AddNewCustomerForm";

export default function CustomersManagement(props) {
  return (
    <AdminLayout>
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        
        <CustomersManagementTable />
        <AddNewCustomerForm />

      </Box>
    </AdminLayout>
  );
}