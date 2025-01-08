import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Grid, FormLabel, OutlinedInput, Button, Box } from '@mui/material';
import { addAssistant, fetchAssistants } from '../../../../store/assistantsSlice';
import ts from '../../../../services/ToastService';

export default function CreateNewAssistantForm({ openBrainTab }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    dispatch(addAssistant(formData))
      .unwrap()
      .then((assistant) => {
        ts.success("Assistant Created", "New Assistant Created Successfully")
        dispatch(fetchAssistants());
        setFormData({ name: '' }); // Clear form
        openBrainTab(assistant.id); // Navigate to the "Add Brain" tab with the assistant ID
      })
      .catch((err) => setError(err.message || 'Failed to create assistant.'));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Assistant
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormLabel htmlFor="name" required>
            Assistant Name
          </FormLabel>
          <OutlinedInput
            id="name"
            name="name"
            placeholder="Assistant Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            sx={{ mt: 1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Next: Add Brain
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
