import React from 'react';
import { SnackbarProvider, enqueueSnackbar, closeSnackbar } from 'notistack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

class ToastService {
  // Predefined colors for each notification type
  colors = {
    success: '#07640a', // Green
    error: '#991a11',   // Red
    warning: '#f5b350', // Orange
    info: '#78baf1',    // Blue
  };

  textColors = {
    success: '#ffffff', // White
    error: '#ffffff',   // White
    warning: '#000000', // Black
    info: '#000000',    // Black
  }

  // Generic method to display a notification
  show(message, description, variant) {
    const color = this.colors[variant];
    const textColor = this.textColors[variant];

    enqueueSnackbar(
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {this.getIcon(variant, color)}
        <div style={{ marginLeft: 8 }}>
          <b>{message}</b>
          {description && <div>{description}</div>}
        </div>
      </div>,
      {
        variant,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        style: {
          backgroundColor: color,
          color: textColor,
        },
        action: (key) => (
          <IconButton onClick={() => closeSnackbar(key)} style={{ color: textColor }}>
            <CloseIcon />
          </IconButton>
        ),
      }
    );
  }

  // Return the appropriate icon for the variant
  getIcon(variant, color) {
    const iconStyle = { color, marginRight: 8 };
    switch (variant) {
      case 'success':
        return <CheckCircleIcon style={iconStyle} />;
      case 'error':
        return <ErrorIcon style={iconStyle} />;
      case 'warning':
        return <WarningIcon style={iconStyle} />;
      case 'info':
      default:
        return <InfoIcon style={iconStyle} />;
    }
  }

  // Specific methods for each notification type
  success(message, description = '') {
    this.show(message, description, 'success');
  }

  error(message, description = '') {
    this.show(message, description, 'error');
  }

  warning(message, description = '') {
    this.show(message, description, 'warning');
  }

  info(message, description = '') {
    this.show(message, description, 'info');
  }
}

// Export a singleton instance
const toastService = new ToastService();
export default toastService;
