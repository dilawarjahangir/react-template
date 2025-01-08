import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import Editor from '@monaco-editor/react';

export default function ViewBrainModal({ open, onClose, brain }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '70%',
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
          Brain Details
        </Typography>
        {brain && (
          <>
            <Typography variant="subtitle1">
              <strong>Name:</strong> {brain.name}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Knowledge Base:</strong> {brain.has_knowledge_base ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Context:</strong>
            </Typography>
            <Editor
              height={brain.context.split('\n').length * 20}
              defaultLanguage="plaintext"
              value={brain.context}
              theme="vs-dark"
              options={{
                readOnly: true,
                fontSize: 14,
                lineHeight: 20,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              <strong>API (JSON):</strong>
            </Typography>
            <Editor
              height={brain.api.split('\n').length * 20}
              defaultLanguage="json"
              value={brain.api}
              theme="vs-dark"
              options={{
                readOnly: true,
                fontSize: 14,
                lineHeight: 20,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              <strong>Placeholders:</strong>
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Key</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {brain.placeholders.map((placeholder) => (
                    <TableRow
                      key={placeholder.id}
                      sx={{ backgroundColor: placeholder.isExtra ? 'yellow' : 'inherit' }}
                    >
                      <TableCell>{placeholder.key}</TableCell>
                      <TableCell>{placeholder.source}</TableCell>
                      <TableCell>{placeholder.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {brain.placeholders.some((p) => p.isExtra) && (
              <Typography
                variant="subtitle2"
                color="error"
                sx={{ mt: 1, fontWeight: 'bold' }}
              >
                Warning: Some placeholders are not included in the context.
              </Typography>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
}
