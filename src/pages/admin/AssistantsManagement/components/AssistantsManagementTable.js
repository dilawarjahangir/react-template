import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Paper,
  Modal,
  Menu,
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { fetchAssistants, updateAssistant, deleteAssistant } from '../../../../store/assistantsSlice';
import { fetchBrains } from '../../../../store/brainsSlice';
import ts from '../../../../services/ToastService';

import EditChatbotClassModal from './EditChatbotClassModal';
import EditAPIClassModal from './EditAPIClassModal';

export default function AssistantsManagementTable({ openCreateTab, openBrainTab }) {
  const dispatch = useDispatch();
  const { list: assistants, error } = useSelector((state) => state.assistants);
  const { list: brains, b_error } = useSelector((state) => state.brains);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [selectedAssistantForMenu, setSelectedAssistantForMenu] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [editChatbotClassModalOpen, setEditChatbotClassModalOpen] = useState(false);
  const [editAPIClassModalOpen, setEditAPIClassModalOpen] = useState(false);


  const handleCloseEditChatbotClassModal = () => setEditChatbotClassModalOpen(false);
  const handleCloseEditAPIClassModal = () => setEditAPIClassModalOpen(false);

  useEffect(() => {
    dispatch(fetchAssistants());
  }, [dispatch]);

  const handleEdit = async (assistant) => {
    setSelectedAssistant(assistant);
    setEditModalOpen(true);
    dispatch(fetchBrains(assistant.id));
  };

  const handleSaveEdit = () => {
    dispatch(updateAssistant(selectedAssistant))
      .unwrap()
      .then(() => {
        ts.info('Assistant updated successfully');
        dispatch(fetchAssistants())
      })
      .catch((error) => {
        ts.error('Error saving assistant:', error.message);
      });

    setEditModalOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteAssistant(id));
  };

  const handleOpenConfirmation = (action, assistant) => {
    setSelectedAssistant(assistant);
    setConfirmationAction(action);
    setConfirmationOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmationAction === 'delete') {
      handleDelete(selectedAssistant.id);
    }
    setConfirmationOpen(false);
  };

  const handleCancelConfirmation = () => {
    setConfirmationOpen(false);
  };

  const handleEditChatbotClass = (brain) => {
    setSelectedAssistantForMenu(brain);
    setEditChatbotClassModalOpen(true);
  };

  const handleEditAPIClass = (brain) => {
    setSelectedAssistantForMenu(brain);
    setEditAPIClassModalOpen(true);
  };


  if (error) {
    return <Typography color="error" variant="h6" align="center">Failed to load assistants: {error}</Typography>;
  }
  if (b_error) {
    return <Typography color="error" variant="h6" align="center">Failed to load brains: {b_error}</Typography>;
  }

  return (
    <>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <Typography variant="h6">Assistants Management</Typography>
          <Button variant="contained" color="primary" onClick={openCreateTab}>
            Create New Assistant
          </Button>
        </Box>

        <DataGrid
          rows={assistants.map(({assistant_brain_name, ...rest}) => ({
            assistant_brain_name: rest.is_editable ? assistant_brain_name || null : 'Developer Managed',
            ...rest,
          }))}
          columns={[
            {
              field: 'name',
              headerName: 'Assistant Name',
              width: 200,
              renderCell: (params) => (
                <Typography
                  style={{
                    fontWeight: params.row.invalid ? 'bold' : 'normal',
                    color: params.row.invalid ? 'red' : 'inherit',
                  }}
                  title={params.row.invalid ? params.row.invalid_message : ''}
                >
                  {params.value}
                </Typography>
              ),
            },
            { field: 'full_name', headerName: 'Full Name', width: 250 },
            { field: 'complete_version', headerName: 'Complete Version', width: 150 },
            {
              field: 'assistant_brain_name',
              headerName: 'Current Brain',
              width: 150,
              cellClassName: (params) => (params.value === null ? 'red-cell' : ''),
            },
            { field: 'number_of_brains', headerName: 'Brains', width: 100 },
            {
              field: 'actions',
              type: 'actions',
              headerName: 'Actions',
              width: 200,
              getActions: (params) => [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  onClick={() => handleEdit(params.row)}
                  disabled={!params.row.is_editable || params.row.invalid}
                />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={() => handleOpenConfirmation('delete', params.row)}
                  disabled={!params.row.is_editable}
                />,
                <GridActionsCellItem
                  icon={<PsychologyIcon />}
                  label="Manage Brains"
                  onClick={() => openBrainTab(params.row.id)}
                  disabled={!params.row.is_editable || params.row.invalid}
                />,
                <GridActionsCellItem
                  icon={<MoreVertIcon />}
                  label="Actions"
                  onClick={(e) => {
                    setSelectedAssistantForMenu(params.row);
                    setMenuAnchor(e.currentTarget);
                  }}
                />,
              ],
            },
          ]}
          autoHeight
          sx={{
            width: '100%',
            '& .red-cell': { color: 'red' },
          }}
        />
        
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleEditChatbotClass(selectedAssistantForMenu)}>Edit Chatbot Class</MenuItem>
          <MenuItem onClick={() => handleEditAPIClass(selectedAssistantForMenu)}>Edit API Class</MenuItem>
        </Menu>
      </Paper>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
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
          <Typography variant="h6" gutterBottom>Edit Assistant</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                value={selectedAssistant?.name || ''}
                onChange={(e) => setSelectedAssistant({ ...selectedAssistant, name: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel htmlFor="currentBrain">Change Brain</FormLabel>
              <Select
                id="currentBrain"
                value={[console.log(selectedAssistant, selectedAssistant?.current_brain), selectedAssistant?.current_brain || null][1]}
                onChange={(e) => setSelectedAssistant({ ...selectedAssistant, current_brain: e.target.value })}
                fullWidth
                required
              >
                <MenuItem value={null}>None</MenuItem>
                {brains.map((brain) => (
                  <MenuItem key={brain.id} value={brain.id}>
                    {brain.name} (v{brain.version})
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
                fullWidth
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>


      {/* Edit LLM Tools Modal */}
      <EditChatbotClassModal
        open={editChatbotClassModalOpen}
        onClose={handleCloseEditChatbotClassModal}
        assistantId={selectedAssistantForMenu?.id}
      />
      
      {/* Edit LLM Config Modal */}
      <EditAPIClassModal
        open={editAPIClassModalOpen}
        onClose={handleCloseEditAPIClassModal}
        assistantId={selectedAssistantForMenu?.id}
      />

      <Dialog
        open={confirmationOpen}
        onClose={handleCancelConfirmation}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this assistant?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirmation} color="secondary">Cancel</Button>
          <Button onClick={handleConfirmAction} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
