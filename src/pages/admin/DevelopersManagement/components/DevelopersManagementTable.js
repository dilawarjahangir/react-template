import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Paper, Modal, Box, Typography, TextField, Button, Grid, FormLabel, OutlinedInput, Menu, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { fetchDevelopers, updateDeveloper, deleteDeveloper, toggleDeveloperStatus } from '../../../../store/developersSlice';

export default function DevelopersManagementTable() {
  const dispatch = useDispatch();
  const [developers, error] = useSelector((state) => [state.developers.list, state.developers.error]);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [lastEdited, setLastEdited] = useState(null);

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);


  useEffect(() => {
    dispatch(fetchDevelopers());
  }, [dispatch]);

  if (error) {
    return <Typography color="error" variant="h6" align="center">Failed to load developers: {error}</Typography>;
  }

  const handleEdit = (developer) => {
    setSelectedDeveloper(developer);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    dispatch(updateDeveloper(selectedDeveloper))
      .unwrap()
      .then(() => setLastEdited(new Date().toLocaleString()))
      .finally(() => setEditModalOpen(false));
  };

  const handleDelete = (id) => {
    dispatch(deleteDeveloper(id));
  };

  const handleChangePassword = (id) => {
    dispatch(updateDeveloper({ id, password: newPassword }))
      .unwrap()
      .then(() => {
        console.info('Password updated successfully');
        setPasswordModalOpen(false);
        setNewPassword('');
      })
      .catch((error) => console.error('Failed to update password:', error));
  };

  const handleToggleStatus = (developer) => {
    dispatch(toggleDeveloperStatus(developer.id));
    setMenuAnchor(null);
  };

  const fields = [
    { name: 'first_name', label: 'First Name', placeholder: 'John', required: true, size: 4 },
    { name: 'middle_name', label: 'Middle Name', placeholder: 'Optional', size: 4 },
    { name: 'last_name', label: 'Last Name', placeholder: 'Doe', required: true, size: 4 },
    { name: 'email', label: 'Email', placeholder: 'example@domain.com', required: true, type: 'email', size: 4 },
    { name: 'phone', label: 'Phone', placeholder: '123-456-7890', size: 4 },
    { name: 'zip', label: 'Zip', placeholder: '12345', size: 2 },
    { name: 'country', label: 'Country', placeholder: 'Country Name', required: true, size: 2 },
    { name: 'address', label: 'Address', placeholder: 'Street name and number', required: true, size: 8 },
    { name: 'city', label: 'City', placeholder: 'City Name', size: 2 },
    { name: 'state', label: 'State', placeholder: 'State Name', size: 2 },
  ];

  const handleOpenConfirmation = (action) => {
    setConfirmationAction(action);
    setConfirmationOpen(true);
  };
  
  const handleConfirmAction = () => {
    if (confirmationAction === 'delete') {
      dispatch(deleteDeveloper(selectedDeveloper.id));
    } else if (confirmationAction === 'status') {
      dispatch(toggleDeveloperStatus(selectedDeveloper.id));
    }
    setConfirmationOpen(false);
  };
  
  const handleCancelConfirmation = () => {
    setConfirmationOpen(false);
  };

  return (
    <>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <DataGrid
          rows={developers}
          columns={[
            { field: 'first_name', headerName: 'First Name', width: 150 },
            { field: 'last_name', headerName: 'Last Name', width: 150 },
            { field: 'email', headerName: 'Email', width: 200 },
            { field: 'phone', headerName: 'Phone', width: 150 },
            { field: 'status', headerName: 'Status', width: 120 },
            { field: 'address', headerName: 'Address', width: 250 },
            {
              field: 'actions',
              type: 'actions',
              headerName: 'Actions',
              width: 180,
              getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.row)} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleOpenConfirmation('delete')} />,
                <GridActionsCellItem
                  icon={<MoreVertIcon />}
                  label="Actions"
                  onClick={(e) => {
                    setSelectedDeveloper(params.row);
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
          <MenuItem onClick={() => setPasswordModalOpen(true)}>Change Password</MenuItem>
          <MenuItem onClick={() => handleOpenConfirmation('status')}>
            Change Status to {selectedDeveloper?.status === 'active' ? 'Blocked' : 'Active'}
          </MenuItem>
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
          <Typography variant="h6" gutterBottom>Edit Developer</Typography>
          <Grid container spacing={3}>
            {fields.map(({ name, label, placeholder, required, type, size }) => (
              <Grid item xs={12} sm={size} key={name}>
                <FormLabel htmlFor={name} required={required}>
                  {label}
                </FormLabel>
                <OutlinedInput
                  id={name}
                  name={name}
                  type={type || 'text'}
                  placeholder={placeholder}
                  value={selectedDeveloper?.[name] || ''}
                  onChange={(e) => setSelectedDeveloper({ ...selectedDeveloper, [name]: e.target.value })}
                  fullWidth
                  required={required || false}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" color="primary" onClick={handleSaveEdit} sx={{ mt: 3 }} fullWidth>
            Save Changes
          </Button>
          {lastEdited && (
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
              Last edited: {lastEdited}
            </Typography>
          )}
        </Box>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)}>
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
          <Typography variant="h6" sx={{ marginBottom: 2 }}>Change Password</Typography>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChangePassword(selectedDeveloper.id)}
            fullWidth
          >
            Update Password
          </Button>
        </Box>
      </Modal>

      <Dialog
        open={confirmationOpen}
        onClose={handleCancelConfirmation}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            Are you sure you want to {confirmationAction === 'delete' ? 'delete this developer' : 'change the status'}?
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
