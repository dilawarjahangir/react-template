import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, Select, MenuItem, FormLabel } from '@mui/material';
import { fetchBrains } from '../../../../store/brainsSlice';

import BrainsTable from './partials/BrainsTable';
import BrainForm from './partials/BrainForm';

export default function BrainsManagement({ assistantId }) {
  const dispatch = useDispatch();
  const focusRef = useRef();
  const assistants = useSelector((state) => state.assistants.list || []);
  const brains = useSelector((state) => state.brains.list || []);
  const defaultBrainID = useSelector((state) => state.brains.defaultBrainId);
  const [selectedAssistant, setSelectedAssistant] = useState(assistantId || null);

  useEffect(() => {
    if (assistantId) {
      dispatch(fetchBrains(assistantId));
    }
  }, [dispatch, assistantId]);

  const handleAssistantChange = ({ target: { value } }) => {
    setSelectedAssistant(value);
    if (value) {
      dispatch(fetchBrains(value));
    }
  };

  const focusOnBrainsTable = () => {
    if (focusRef.current){
      focusRef.current.focus();
    }
  }

  return (
    <Box>
      {!selectedAssistant ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Select an Assistant
          </Typography>
          <FormLabel htmlFor="assistant-select">Assistant</FormLabel>
          <Select
            id="assistant-select"
            value={selectedAssistant || ''}
            onChange={handleAssistantChange}
            fullWidth
            sx={{ mt: 1, mb: 3 }}
          >
            <MenuItem value="" disabled>
              Choose an Assistant
            </MenuItem>
            {assistants.filter(a => a.is_editable).map((assistant) => (
              <MenuItem key={assistant.id} value={assistant.id}>
                {assistant.name} (Version {assistant.assistant_version})
              </MenuItem>
            ))}
          </Select>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom ref={focusRef}>
            Manage Brains for Assistant ID: {selectedAssistant}
          </Typography>
          <BrainsTable brains={brains} assistantId={selectedAssistant} defaultBrainID={defaultBrainID} />
          <BrainForm assistantId={selectedAssistant} onSuccess={focusOnBrainsTable} />
        </Box>
      )}
    </Box>
  );
}
