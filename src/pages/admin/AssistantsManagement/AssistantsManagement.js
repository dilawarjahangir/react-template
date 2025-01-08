import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AdminLayout from '../../../layouts/AdminLayout';

import AssistantsManagementTable from "./components/AssistantsManagementTable";
import CreateNewAssistantForm from "./components/CreateNewAssistantForm";
import BrainsManagement from "./components/BrainsManagement";

export default function AssistantsManagement() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedAssistantId, setSelectedAssistantId] = React.useState(null);

  const handleTabChange = (event, newValue) => {
    if (newValue == 2){
      setSelectedAssistantId(null);
    }
    setActiveTab(newValue);
  };

  const openBrainTab = (assistantId) => {
    setSelectedAssistantId(assistantId); // Set the selected assistant ID
    setActiveTab(2); // Move to the "Manage Brains" tab
  };

  return (
    <AdminLayout>
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        {/* Tabs Header */}
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Assistant Management Tabs">
          <Tab label="Assistants" />
          <Tab label="Add New Assistant" />
          <Tab label="Manage Brains" />
          <Tab label="Manage Knowledge Bases" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && <AssistantsManagementTable openCreateTab={() => setActiveTab(1)} openBrainTab={openBrainTab} />}
          {activeTab === 1 && <CreateNewAssistantForm openBrainTab={openBrainTab} />}
          {activeTab === 2 && <BrainsManagement assistantId={selectedAssistantId} />}
          {activeTab === 3 && <div>Coming soon...</div>}
        </Box>
      </Box>
    </AdminLayout>
  );
}
