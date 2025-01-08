import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';
import Editor from '@monaco-editor/react';
import { useDispatch } from 'react-redux';
import { fetchChatbotClass, updateChatbotClass } from '../../../../store/assistantsSlice';

import ts from '../../../../services/ToastService';

export default function EditChatbotClassModal({ open, onClose, assistantId }) {
  const dispatch = useDispatch();
  const [contents, setConfigContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assistantId && open) {
      dispatch(fetchChatbotClass(assistantId))
        .then((response) => {
          setConfigContent(response.payload.contents);
          setLoading(false);
        })
        .catch(() => {
          ts.error('Failed to fetch LLM config');
          setLoading(false);
        });
    }
  }, [assistantId, dispatch, open]);

  const handleSave = () => {
    dispatch(updateChatbotClass({ assistantId, contents }))
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
      <Box sx={{ width: '90%', padding: 4, margin: 'auto', marginTop: 10, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 24, maxHeight: '80vh', overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>Edit LLM Config</Typography>
        {loading ? <CircularProgress /> : null}
        <Editor
          height={contents ? String(contents).split('\n').length * 20 : 0}
          defaultLanguage="python"
          value={contents}
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
