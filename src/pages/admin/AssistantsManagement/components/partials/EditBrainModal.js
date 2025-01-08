import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Editor from '@monaco-editor/react';
import { useDispatch } from 'react-redux';
import { editBrain } from '../../../../../store/brainsSlice';
import ts from '../../../../../services/ToastService';

export default function EditBrainModal({ open, onClose, brain }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: brain?.name || '',
    context: brain?.context || '',
    has_knowledge_base: brain?.has_knowledge_base || true,
    api: brain?.api || '',
  });

  useEffect(() => {
    if (brain) {
      setFormData({
        name: brain.name,
        context: brain.context,
        has_knowledge_base: brain.has_knowledge_base,
        api: brain.api,
      });
    }
  }, [brain]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (field, value) => {
    setFormData({ ...formData, [field]: value || '' });
  };

  const handleSave = () => {
    dispatch(editBrain({ brainId: brain.id, brainData: formData }))
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((err) => {
        ts.error('Failed to save brain:', err);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '50%',
          padding: 4,
          margin: 'auto',
          marginTop: 10,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: '80vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Brain
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <TextField
              id="name"
              name="name"
              placeholder="Enter Brain Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              sx={{ mt: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormLabel htmlFor="context">Context</FormLabel>
            <Editor
              height={formData.context.split('\n').length * 20}
              defaultLanguage="plaintext"
              value={formData.context}
              theme="vs-dark"
              onChange={(value) => handleEditorChange('context', value)}
              options={{
                fontSize: 14,
                lineHeight: 20,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormLabel htmlFor="has_knowledge_base">Knowledge Base</FormLabel>
            <Select
              id="has_knowledge_base"
              name="has_knowledge_base"
              value={formData.has_knowledge_base ? 'true' : 'false'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  has_knowledge_base: e.target.value === 'true',
                })
              }
              fullWidth
              sx={{ mt: 1 }}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <FormLabel htmlFor="api">API (JSON)</FormLabel>
            <Editor
              height={formData.api.split('\n').length * 20}
              defaultLanguage="json"
              value={formData.api}
              theme="vs-dark"
              onChange={(value) => handleEditorChange('api', value)}
              options={{
                fontSize: 14,
                lineHeight: 20,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 3 }}
          fullWidth
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
}
