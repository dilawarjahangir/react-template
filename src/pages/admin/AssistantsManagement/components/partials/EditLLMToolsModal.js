import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import Editor from '@monaco-editor/react';
import { useDispatch } from 'react-redux';
import { fetchLLMTools, updateLLMTools } from '../../../../../store/brainsSlice';
import ts from '../../../../../services/ToastService';

const exampleTools = `[
    {
        "type": "function",
        "function": {
            "name": "pilgrim_admin",
            "description": "Gets pilgrim informatino for the user",
            "parameters": {
                "type": "object",
                "properties": {
                    "pilgrim_information": {
                        "type": "boolean",
                        "description": "True if user asks for pilgrim infromation."
                    }
                },
                "required": ["pilgrim_information"]
            }
        }
    }
]`;

export default function EditLLMToolsModal({ open, onClose, brainId }) {
  const dispatch = useDispatch();
  const [toolsContent, setToolsContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brainId && open) {
      dispatch(fetchLLMTools(brainId))
        .then((response) => {
          setToolsContent(response.payload.contents);
          setLoading(false);
        })
        .catch(() => {
          ts.error('Failed to fetch LLM tools');
          setLoading(false);
        });
    }
  }, [brainId, dispatch, open]);

  const handleSave = () => {
    dispatch(updateLLMTools({ brainId, toolsContent }))
      .unwrap()
      .then(() => {
        ts.success("Tools Updated successfully");
        onClose();
      })
      .catch((err) => {
        ts.error('Failed to save LLM tools:', err);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: '50%', padding: 4, margin: 'auto', marginTop: 10, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 24, maxHeight: '80vh', overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>Edit LLM Tools</Typography>
        {loading ? <CircularProgress /> : null}
        <Editor
          height={toolsContent ? String(toolsContent).split('\n').length * 20 : 0}
          defaultLanguage="json"
          value={toolsContent}
          theme="vs-dark"
          onChange={(value) => setToolsContent(value)}
          options={{
            fontSize: 14,
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />

        <br/>
        <Typography variant="subtitle1">
          <strong>Example Tools:</strong>
        </Typography>

        <Editor
          height={exampleTools.split('\n').length * 20}
          defaultLanguage="json"
          value={exampleTools}
          theme="vs-dark"
          options={{
            readOnly: true,
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
