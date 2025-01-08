import React, { useState, useEffect } from 'react';
import {
  Paper,
  Menu,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import BuildIcon from '@mui/icons-material/Build';
import CheckIcon from '@mui/icons-material/Check';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import PlaceholderModal from './PlaceholderModal';

import { useDispatch } from 'react-redux';
import { fetchBrains, setDefaultBrain, editBrain, deleteBrain } from '../../../../../store/brainsSlice';
import EditBrainModal from './EditBrainModal';
import ViewBrainModal from './ViewBrainModal';

import EditLLMToolsModal from './EditLLMToolsModal';
import EditLLMConfigModal from './EditLLMConfigModal';

export default function BrainsTable({ brains, assistantId, defaultBrainID }) {
  const dispatch = useDispatch();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBrain, setSelectedBrain] = useState(null);
  const [placeholderModalOpen, setPlaceholderModalOpen] = useState(false);
  const [selectedBrainForPlaceholder, setSelectedBrainForPlaceholder] = useState(null);
  const [selectedBrainForMenu, setSelectedBrainForMenu] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [editLLMToolsModalOpen, setEditLLMToolsModalOpen] = useState(false);
  const [editLLMConfigModalOpen, setEditLLMConfigModalOpen] = useState(false);

  const handleEditLLMTools = (brain) => {
    setSelectedBrainForMenu(brain);
    setEditLLMToolsModalOpen(true);
  };

  const handleEditLLMConfig = (brain) => {
    setSelectedBrainForMenu(brain);
    setEditLLMConfigModalOpen(true);
  };

  const handleCloseEditLLMToolsModal = () => setEditLLMToolsModalOpen(false);
  const handleCloseEditLLMConfigModal = () => setEditLLMConfigModalOpen(false);
  
  useEffect(() => {
    dispatch(fetchBrains(assistantId));
  }, [dispatch, assistantId]);

  const handleEdit = (brain) => {
    setSelectedBrain(brain);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    dispatch(editBrain({ brainId: selectedBrain.id, brainData: selectedBrain }))
      .unwrap()
      .then(() => {
        setEditModalOpen(false);
        setSelectedBrain(null);
      });
  };

  const handleDelete = (brain) => {
    dispatch(deleteBrain(brain.id)).unwrap();
  };

  const handleViewDetails = (brain) => {
    setSelectedBrain(brain);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setSelectedBrain(null);
    setViewModalOpen(false);
  };

  const handleOpenPlaceholderModal = (brain) => {
    setSelectedBrainForPlaceholder(brain);
    setPlaceholderModalOpen(true);
  };
  
  const handleClosePlaceholderModal = () => {
    setSelectedBrainForPlaceholder(null);
    setPlaceholderModalOpen(false);
  };

  const handleSetDefaultBrain = (brain) => {
    dispatch(setDefaultBrain(brain.id))
      .unwrap()
      // .then(() => {
      //   alert(`Brain ${brain.name} set as default!`);
      // });
  };

  const columns = [
    { field: 'id', headerName: 'Brain ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'context', headerName: 'Context', width: 300 },
    { field: 'has_knowledge_base', headerName: 'Knowledge Base', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 250,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View"
          onClick={() => handleViewDetails(params.row)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.row)}
        />,
        <GridActionsCellItem
          icon={<BuildIcon />}
          label="Manage Placeholders"
          onClick={() => handleOpenPlaceholderModal(params.row)}
        />,
        <GridActionsCellItem
          icon={defaultBrainID != params.row.id ? <StarIcon /> : <CheckIcon />}
          label="Set Default"
          onClick={defaultBrainID != params.row.id ? () => handleSetDefaultBrain(params.row) : null}
        />,
        <GridActionsCellItem
          icon={<MoreVertIcon />}
          label="Actions"
          onClick={(e) => {
            setSelectedBrainForMenu(params.row);
            setMenuAnchor(e.currentTarget);
          }}
        />,
      ],
    },
  ];

  return (
    <>
      <Paper sx={{ padding: 3, marginBottom: 3 }} id="HTask-BrainsTable">
        <DataGrid rows={brains} columns={columns} autoHeight sx={{ width: '100%' }} />
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleEditLLMTools(selectedBrainForMenu)}>Edit LLM tools</MenuItem>
          <MenuItem onClick={() => handleEditLLMConfig(selectedBrainForMenu)}>Edit LLM config</MenuItem>
        </Menu>
      </Paper>

      {/* View Brain Modal */}
      <ViewBrainModal
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        brain={selectedBrain}
      />

      {/* Edit Brain Modal */}
      <EditBrainModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        brain={selectedBrain}
        onSave={handleSaveEdit}
      />

      {/* Placeholders Management Modal */}
      <PlaceholderModal
        open={placeholderModalOpen}
        onClose={handleClosePlaceholderModal}
        brain={selectedBrainForPlaceholder}
      />

      {/* Edit LLM Tools Modal */}
      <EditLLMToolsModal
        open={editLLMToolsModalOpen}
        onClose={handleCloseEditLLMToolsModal}
        brainId={selectedBrainForMenu?.id}
      />
      
      {/* Edit LLM Config Modal */}
      <EditLLMConfigModal
        open={editLLMConfigModalOpen}
        onClose={handleCloseEditLLMConfigModal}
        brainId={selectedBrainForMenu?.id}
      />

    </>
  );
}
