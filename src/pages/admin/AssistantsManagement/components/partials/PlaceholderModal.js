import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  Modal,
  Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPlaceholders,
  addPlaceholder,
  updatePlaceholder,
  deletePlaceholder,
} from '../../../../../store/placeholdersSlice';
import ts from '../../../../../services/ToastService';

export default function PlaceholderModal({ open, onClose, brain }) {
  const dispatch = useDispatch();
  const placeholders = useSelector((state) => state.placeholders.list || []);
  const [newPlaceholder, setNewPlaceholder] = useState({
    key: '',
    source: 'value',
    value: '',
  });

  const [contextPlaceholders, setContextPlaceholders] = useState([]);
  const [missingPlaceholders, setMissingPlaceholders] = useState([]);
  const [updatedPlaceholders, setUpdatedPlaceholders] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (brain?.id && open) {
      dispatch(fetchPlaceholders(brain.id));
      detectPlaceholdersInContext(brain.context);
    }
  }, [dispatch, brain, open]);

  useEffect(() => {
    comparePlaceholders();
  }, [placeholders, contextPlaceholders]);

  const detectPlaceholdersInContext = (context) => {
    const placeholdersInContext = [];
    const regex = /<([a-zA-Z0-9_-]+)>/g;
    let match;

    while ((match = regex.exec(context)) !== null) {
      placeholdersInContext.push(match[1]);
    }
    setContextPlaceholders(placeholdersInContext);
  };

  const comparePlaceholders = () => {
    const placeholderKeys = placeholders.map((p) => p.key);
    const missing = contextPlaceholders.filter((key) => !placeholderKeys.includes(key));
    const extra = placeholderKeys.filter((key) => !contextPlaceholders.includes(key));

    const updatedPlaceholders = placeholders.map((placeholder) => ({
      ...placeholder,
      isExtra: extra.includes(placeholder.key),
    }));

    setMissingPlaceholders(missing);
    setUpdatedPlaceholders(updatedPlaceholders);
  };

  const handleAddPlaceholder = (e) => {
    e.preventDefault();
    if (!newPlaceholder.key || !newPlaceholder.value) {
      ts.error('Both Key and Value are required.');
      return;
    }
    dispatch(
      addPlaceholder({
        brainId: brain.id,
        placeholderData: newPlaceholder,
      })
    )
      .unwrap()
      .then(() => {
        setNewPlaceholder({ key: '', source: 'value', value: '' });
      })
      .catch((err) => ts.error('Failed to add placeholder:', err));
  };

  const handleSavePlaceholders = () => {
    dispatch(
      updatePlaceholder({
        placeholderId: null, // Indicates bulk update
        placeholderData: updatedPlaceholders,
      })
    )
      .unwrap()
      .then(() => setEditMode(false))
      .catch((err) => ts.error('Failed to update placeholders:', err));
  };

  const handleDeletePlaceholder = (placeholderId) => {
    dispatch(deletePlaceholder(placeholderId))
      .unwrap()
      .catch((err) => ts.error('Failed to delete placeholder:', err));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

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
          Manage Placeholders for {brain?.name || 'Brain'}
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updatedPlaceholders.length > 0 ? (
                updatedPlaceholders.map((placeholder, index) => (
                  <TableRow
                    key={placeholder.id}
                    sx={{
                      backgroundColor: placeholder.isExtra ? 'yellow' : 'inherit',
                    }}
                  >
                    <TableCell>
                      <Tooltip
                        title={
                          placeholder.isExtra
                            ? 'This placeholder is not present in the context.'
                            : ''
                        }
                      >
                        <TextField
                          value={placeholder.key}
                          onChange={(e) => {
                            const updated = [...updatedPlaceholders];
                            updated[index].key = e.target.value;
                            setUpdatedPlaceholders(updated);
                          }}
                          fullWidth
                          disabled={!editMode}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={placeholder.source}
                        onChange={(e) => {
                          const updated = [...updatedPlaceholders];
                          updated[index].source = e.target.value;
                          setUpdatedPlaceholders(updated);
                        }}
                        fullWidth
                        disabled={!editMode}
                      >
                        <MenuItem value="value">Value</MenuItem>
                        <MenuItem value="api">API</MenuItem>
                        <MenuItem value="method">Method</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={placeholder.value}
                        onChange={(e) => {
                          const updated = [...updatedPlaceholders];
                          updated[index].value = e.target.value;
                          setUpdatedPlaceholders(updated);
                        }}
                        fullWidth
                        disabled={!editMode}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleDeletePlaceholder(placeholder.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No placeholders available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {missingPlaceholders.length > 0 && (
          <Typography variant="subtitle2" color="warning.main" sx={{ mb: 2 }}>
            Warning: The following placeholders are missing in the list: {missingPlaceholders.join(', ')}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          {editMode ? (
            <Button variant="contained" color="success" onClick={handleSavePlaceholders}>
              Save Changes
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={toggleEditMode}>
              Edit Placeholders
            </Button>
          )}
        </Box>
        <Box component="form" onSubmit={handleAddPlaceholder} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add New Placeholder
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Key"
                name="key"
                placeholder="Enter Placeholder Key"
                value={newPlaceholder.key}
                onChange={(e) =>
                  setNewPlaceholder({ ...newPlaceholder, key: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <Select
                name="source"
                value={newPlaceholder.source}
                onChange={(e) =>
                  setNewPlaceholder({ ...newPlaceholder, source: e.target.value })
                }
                fullWidth
              >
                <MenuItem value="value">Value</MenuItem>
                <MenuItem value="api">API</MenuItem>
                <MenuItem value="method">Method</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Value"
                name="value"
                placeholder="Enter Value"
                value={newPlaceholder.value}
                onChange={(e) =>
                  setNewPlaceholder({ ...newPlaceholder, value: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Add Placeholder
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}
