import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Grid, FormLabel, OutlinedInput, Button, Box, MenuItem, Select, TextField } from '@mui/material';
import { addDevice, fetchAssistants, fetchDevices } from '../../../../store/devicesSlice';
import { fetchCustomers } from '../../../../store/customersSlice';
import ts from '../../../../services/ToastService';


export default function AddNewDeviceForm() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.list); // Assuming customers are already fetched
  const assistants = useSelector((state) => state.devices.assistants || []);

  const [formData, setFormData] = useState({
    name: '',
    manager_name: '',
    manager_email: '',
    subscription_status: 'active',
    assistant: '',
    start_date: new Date().toISOString().split('T')[0], // Default to current date
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Default to 1 month later
    customer_id: '',
  });
  
  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchAssistants());
  }, [dispatch]);

  const subscriptionStatuses = ['Active', 'Inactive']; // Example options for Subscription Status

  const fields = [
    { name: 'name', label: 'Device Name', placeholder: 'Device X', required: true, size: 6 },
    { name: 'manager_name', label: 'Manager Name', placeholder: 'John Doe', required: true, size: 6 },
    { name: 'manager_email', label: 'Manager Email', placeholder: 'example@domain.com', required: true, type: 'email', size: 6 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addDevice(formData))
      .unwrap()
      .then(() => {
        console.info('Device added successfully');
        dispatch(fetchDevices());
        setFormData({
          name: '',
          manager_name: '',
          manager_email: '',
          subscription_status: 'active',
          assistant: '',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
          customer_id: '',
        });
      })
      .catch((error) => {
        ts.error('Error adding device:', error.message);
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Device
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormLabel htmlFor="customer_id" required>
            Customer
          </FormLabel>
          <TextField
            id="customer_id"
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            fullWidth
            required
            select
            size="small"
            sx={{ mt: 1 }}
          >
            <MenuItem value="" disabled>
              Search and select a customer
            </MenuItem>
            {Array.isArray(customers) && customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.first_name} {customer.last_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {fields.map(({ name, label, placeholder, required, type, size }) => (
          <Grid item xs={12} sm={size} key={name}>
            <FormLabel htmlFor={name} required={required}>
              {label}
            </FormLabel>
            <OutlinedInput
              id={name}
              name={name}
              type={type || 'text'}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              fullWidth
              required={required || false}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>
        ))}
        <Grid item xs={12} sm={6}>
          <FormLabel htmlFor="assistant" required>
            Assistant
          </FormLabel>
          <Select
            id="assistant"
            name="assistant_id"
            value={formData.assistant_id}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            sx={{ mt: 1 }}
          >
            <MenuItem value="" disabled>
              Select Assistant
            </MenuItem>
            {Array.isArray(assistants) && assistants.map((assistant, index) => (
              <MenuItem key={index} value={assistant.id}>
                {assistant.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabel htmlFor="subscription_status" required>
            Subscription Status
          </FormLabel>
          <Select
            id="subscription_status"
            name="subscription_status"
            value={formData.subscription_status}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            sx={{ mt: 1 }}
          >
            {subscriptionStatuses.map((status, index) => (
              <MenuItem key={index} value={status.toLowerCase()}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabel htmlFor="start_date" required>
            Subscription Start
          </FormLabel>
          <OutlinedInput
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            sx={{ mt: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormLabel htmlFor="end_date" required>
            Subscription End
          </FormLabel>
          <OutlinedInput
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            sx={{ mt: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Add Device
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
