import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { useNavigate, useLocation } from 'react-router-dom';

const mainListItems = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, path: '/admin/dashboard' },
  { text: 'Customers', icon: <PeopleRoundedIcon />, path: '/admin/customers' },
  { text: 'Devices', icon: <SettingsRoundedIcon />, path: '/admin/devices' },
  { text: 'Assistants', icon: <AnalyticsRoundedIcon />, path: '/admin/assistants' },
  { text: 'Developers', icon: <PeopleRoundedIcon />, path: '/admin/developers' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/admin/settings'},
  { text: 'About', icon: <InfoRoundedIcon />, path: '/about-us'},
  { text: 'Feedback', icon: <HelpRoundedIcon />, path: '/feedback'},
];


export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>

      {/* Main List */}
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{ display: 'block' }}
            onClick={() => navigate(item.path)}
          >
            <ListItemButton selected={location.pathname === item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Secondary List */}
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{ display: 'block' }}
            onClick={() => navigate(item.path)}
          >
            <ListItemButton selected={location.pathname === item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
