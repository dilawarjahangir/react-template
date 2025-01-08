import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Grid, TextField, FormLabel, Select, MenuItem, Button } from '@mui/material';
import Editor from '@monaco-editor/react';
import { addBrain, fetchBrains } from '../../../../../store/brainsSlice';
import ts from '../../../../../services/ToastService';

const DEAFAULT_API_DETAILS = `{
  "base_url": "http:/example.com",
  "auth": {
    "type": "HTTPBasicAuth",
    "creds": {
      "username": "user",
      "password": "pass"
    }
  },
  "endpoints": {
    "example_endpoint": {
      "method": "GET",
      "path": "/api/example/info",
      "data": ["resource_id"],
      "expected": ["info"],
      "auth": true
    }
  }
}`;

const DEFAULT_CONTEXT = `You are an assistant. Your name is <assistant-name>.
You always introduce yourself.
You always welcome customer.
You are useful and polite.
You will only answer related questions to the services you will provide.
You will not give false information about the services you proivde.
You will always say numbers and dates in words not numerical characters.

You will never end the conversation unless the admin or customer says to end it explicitly.

You will always get overlapping transcribed data from the stt with overlapping audio chunks for user message.
You will always understand intelligently that message yourself from chunks and reply accordingly.
You will never tell that you are receiving lists of strings from user.
YOu will just behave generally like user is talking to you.

And you will reply accordingly.
`;

export default function BrainForm({ assistantId, onSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    context: DEFAULT_CONTEXT,
    has_knowledge_base: true,
    api: DEAFAULT_API_DETAILS,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, api: value });
  };

  const handleAddBrain = (e) => {
    e.preventDefault();
    dispatch(addBrain({ ...formData, assistant_id: assistantId }))
      .unwrap()
      .then(() => {
        ts.success("Brain Added", "New Brain Added Successfully")
        dispatch(fetchBrains(assistantId));
        setFormData({
          name: '',
          context: DEFAULT_CONTEXT,
          has_knowledge_base: true,
          api: DEAFAULT_API_DETAILS,
        });
        onSuccess();
        // document.getElementById('HTask-BrainsTable').focus();
      })
      .catch((error) => {
        ts.error('Error adding brain:', error.message);
      });
  };

  return (
    <Box component="form" onSubmit={handleAddBrain}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormLabel htmlFor="name">Brain Name</FormLabel>
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
            id="context"
            height={formData.context.split('\n').length * 20}
            defaultLanguage="plaintext"
            value={formData.context}
            onChange={(value) =>
              setFormData({ ...formData, context: value || '' })
            }
            theme="vs-dark"
            options={{
              fontSize: 14,
              lineHeight: 20,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel htmlFor="has_knowledge_base">Has Knowledge Base</FormLabel>
          <Select
            id="has_knowledge_base"
            name="has_knowledge_base"
            value={formData.has_knowledge_base ? 'true' : 'false'}
            onChange={(e) =>
              setFormData({ ...formData, has_knowledge_base: e.target.value === 'true' })
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
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              lineHeight: 20,
              scrollBeyondLastLine: false,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Add Brain
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
