import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Grid, FormLabel, OutlinedInput, Button, Box } from '@mui/material';
import { addCustomer, fetchCustomers } from '../../../../store/customersSlice';
import ts from '../../../../services/ToastService';

export default function AddNewCustomerForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    zip: '',
    city: '',
    state: '',
    country: '',
  });

  const fields = [
    { name: 'first_name', label: 'First Name', placeholder: 'John', required: true, size: 4 },
    { name: 'middle_name', label: 'Middle Name', placeholder: 'Optional', size: 4 },
    { name: 'last_name', label: 'Last Name', placeholder: 'Doe', required: true, size: 4 },
    { name: 'email', label: 'Email', placeholder: 'example@domain.com', required: true, type: 'email', size: 4 },
    { name: 'password', label: 'Password', placeholder: '*******', required: true, type: 'password', size: 4 },
    { name: 'phone', label: 'Phone', placeholder: '123-456-7890', size: 4 },
    { name: 'address', label: 'Address', placeholder: 'Street name and number', required: true, size: 4 },
    { name: 'zip', label: 'Zip', placeholder: '12345', size: 2 },
    { name: 'city', label: 'City', placeholder: 'City Name', size: 2 },
    { name: 'state', label: 'State', placeholder: 'State Name', size: 2 },
    { name: 'country', label: 'Country', placeholder: 'Country Name', required: true, size: 2 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addCustomer(formData))
      .unwrap()
      .then(() => {
        console.info('Customer added successfully');
        dispatch(fetchCustomers());
        setFormData({
          first_name: '',
          middle_name: '',
          last_name: '',
          email: '',
          password: '',
          phone: '',
          address: '',
          zip: '',
          city: '',
          state: '',
          country: '',
        });
      })
      .catch((error) => {
        ts.error('Error adding customer:', error.message);
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Customer
      </Typography>
      <Grid container spacing={3}>
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
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Add Customer
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
