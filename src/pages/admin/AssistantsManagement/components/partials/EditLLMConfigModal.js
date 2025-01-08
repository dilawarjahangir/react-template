import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';
import Editor from '@monaco-editor/react';
import { useDispatch } from 'react-redux';
import { fetchLLMConfig, updateLLMConfig } from '../../../../../store/brainsSlice';

import ts from '../../../../../services/ToastService';

export default function EditLLMConfigModal({ open, onClose, brainId }) {
  const dispatch = useDispatch();
  const [configContent, setConfigContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brainId && open) {
      dispatch(fetchLLMConfig(brainId))
        .then((response) => {
          setConfigContent(response.payload.contents);
          setLoading(false);
        })
        .catch(() => {
          ts.error('Failed to fetch LLM config');
          setLoading(false);
        });
    }
  }, [brainId, dispatch, open]);

  const handleSave = () => {
    dispatch(updateLLMConfig({ brainId, configContent }))
      .unwrap()
      .then(() => {
        ts.success("Config Updated successfully");
        onClose();
      })
      .catch((err) => {
        ts.error('Failed to save LLM config:', err);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: '50%', padding: 4, margin: 'auto', marginTop: 10, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 24, maxHeight: '80vh', overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>Edit LLM Config</Typography>
        {loading ? <CircularProgress /> : null}
        <Editor
          height={configContent ? String(configContent).split('\n').length * 20 : 0}
          defaultLanguage="json"
          value={configContent}
          theme="vs-dark"
          onChange={(value) => setConfigContent(value)}
          options={{
            fontSize: 14,
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 3 }} fullWidth>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
}
