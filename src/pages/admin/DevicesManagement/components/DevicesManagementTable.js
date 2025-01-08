import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Paper, Modal, Box, Typography, Grid, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, OutlinedInput } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { fetchDevices, updateDevice, deleteDevice } from '../../../../store/devicesSlice';

export default function DevicesManagementTable() {
  const dispatch = useDispatch();
  const [devices, error] = useSelector((state) => [state.devices.list, state.devices.error]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [viewTokenModalOpen, setViewTokenModalOpen] = useState(false);
  const [tokenToView, setTokenToView] = useState('');

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  if (error) {
    return <Typography color="error" variant="h6" align="center">Failed to load devices: {error}</Typography>;
  }

  const handleEdit = (device) => {
    setSelectedDevice(device);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    dispatch(updateDevice(selectedDevice));
    setEditModalOpen(false);
  };

  const handleOpenConfirmation = (action) => {
    setConfirmationAction(action);
    setConfirmationOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmationAction === 'delete') {
      dispatch(deleteDevice(selectedDevice.id));
    }
    setConfirmationOpen(false);
  };

  const handleCancelConfirmation = () => {
    setConfirmationOpen(false);
  };

  const handleViewToken = (token) => {
    setTokenToView(token);
    setViewTokenModalOpen(true);
  };
  
  return (
    <>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <DataGrid
          rows={devices}
          columns={[
            { field: 'name', headerName: 'Device Name', width: 200 },
            { field: 'manager_name', headerName: 'Manager Name', width: 150 },
            { field: 'manager_email', headerName: 'Manager Email', width: 200 },
            { field: 'assistant', headerName: 'Assistant', width: 150 },
            { field: 'subscription_status', headerName: 'Subscription', width: 150 },
            {
              field: 'auth_token',
              headerName: 'Auth Token',
              width: 200,
              renderCell: (params) => (
                <Button
                  variant="text"
                  onClick={() => navigator.clipboard.writeText(params.value)}
                  title={params.value}
                >
                  Copy Token
                </Button>
              ),
            },
            {
              field: 'actions',
              type: 'actions',
              headerName: 'Actions',
              width: 180,
              getActions: (params) => [
                <GridActionsCellItem
                  icon={<VisibilityIcon />}
                  label="View Token"
                  onClick={() => handleViewToken(params.row.auth_token)}
                />,
                <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.row)} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleOpenConfirmation('delete')} />,
                <GridActionsCellItem
                  icon={<MoreVertIcon />}
                  label="Actions"
                  onClick={(e) => {
                    setSelectedDevice(params.row);
                    setMenuAnchor(e.currentTarget);
                  }}
                />,
              ],
            },
          ]}
          autoHeight
          sx={{ width: '100%' }}
        />
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleEdit(selectedDevice)}>Edit Device</MenuItem>
        </Menu>
      </Paper>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            width: '70%',
            padding: 4,
            margin: 'auto',
            marginTop: 10,
            backgroundColor: 'background.paper',
            color: 'text.primary',
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
          <Typography variant="h6" gutterBottom>Edit Device</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Name *"
                value={selectedDevice?.name || ''}
                onChange={(e) => setSelectedDevice({ ...selectedDevice, name: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Manager Name *"
                value={selectedDevice?.manager_name || ''}
                onChange={(e) => setSelectedDevice({ ...selectedDevice, manager_name: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Manager Email *"
                type="email"
                value={selectedDevice?.manager_email || ''}
                onChange={(e) => setSelectedDevice({ ...selectedDevice, manager_email: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Subscription Status *"
                value={selectedDevice?.subscription_status || ''}
                onChange={(e) => setSelectedDevice({ ...selectedDevice, subscription_status: e.target.value })}
                required
                fullWidth
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Assistant *"
                value={selectedDevice?.assistant || ''}
                onChange={(e) => setSelectedDevice({ ...selectedDevice, assistant: e.target.value })}
                required
                fullWidth
              >
                <MenuItem value="Hotel">Hotel</MenuItem>
                <MenuItem value="Bus Ticket">Bus Ticket</MenuItem>
                <MenuItem value="Hotel Staff">Hotel Staff</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subscription Start Date *"
                type="date"
                value={selectedDevice?.start_date || ''}
                onChange={(e) => setSelectedDevice({ ...selectedDevice, start_date: e.target.value })}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subscription End Date *"
                type="date"
                value={selectedDevice?.end_date || ''}
                onChange={(e) => setSelectedDevice({ ...selectedDevice, end_date: e.target.value })}
                InputProps={{ inputProps: { min: selectedDevice?.start_date || '' } }}
                required
                fullWidth
              />
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

      {/* View / Copy Token Modal */}
      <Modal open={viewTokenModalOpen} onClose={() => setViewTokenModalOpen(false)}>
        <Box
          sx={{
            width: 400,
            padding: 4,
            margin: 'auto',
            marginTop: 10,
            backgroundColor: 'background.paper',
            color: 'text.primary',
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
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            View Token
          </Typography>
          <OutlinedInput
            value={tokenToView}
            disabled
            fullWidth
            endAdornment={
              <Button
                onClick={() => navigator.clipboard.writeText(tokenToView)}
                variant="text"
              >
                Copy
              </Button>
            }
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setViewTokenModalOpen(false)}
            fullWidth
          >
            Close
          </Button>
        </Box>
      </Modal>


      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationOpen}
        onClose={handleCancelConfirmation}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            Are you sure you want to {confirmationAction === 'delete' ? 'delete this device' : 'perform this action'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirmation} color="secondary">Cancel</Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
