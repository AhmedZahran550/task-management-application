import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
  Button,
  Chip,
  Typography,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import type { IAttachment } from '../../types/task';

interface AttachmentViewerProps {
  attachments: IAttachment[];
  onDeleteAttachment?: (publicId: string) => void;
  canDelete?: boolean;
}

export const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
  attachments,
  onDeleteAttachment,
  canDelete = true,
}) => {
  const [open, setOpen] = useState(false);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <ImageIcon color="primary" />;
    }
    if (ext === 'pdf') {
      return <PictureAsPdfIcon color="error" />;
    }
    return <InsertDriveFileIcon color="action" />;
  };

  return (
    <>
      <Chip
        icon={<InsertDriveFileIcon fontSize="small" />}
        label={`${attachments.length} file${attachments.length > 1 ? 's' : ''}`}
        size="small"
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }}
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Task Attachments ({attachments.length})</DialogTitle>
        <DialogContent dividers>
          <List disablePadding>
            {attachments.map((att) => {
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(att.originalName || att.url);
              return (
                <ListItem
                  key={att.publicId || att._id}
                  sx={{
                    borderRadius: 2,
                    mb: 1.5,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}
                >
                  {isImage && (
                    <Box
                      component="img"
                      src={att.url}
                      alt={att.originalName}
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 1.5,
                        objectFit: 'cover',
                        mr: { sm: 2 },
                        mb: { xs: 1, sm: 0 },
                      }}
                    />
                  )}
                  <ListItemIcon sx={{ display: isImage ? 'none' : 'flex' }}>
                    {getFileIcon(att.originalName)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {att.originalName}
                      </Typography>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: { xs: 1, sm: 0 } }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<OpenInNewIcon fontSize="small" />}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </Button>
                    {canDelete && onDeleteAttachment && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteAttachment(att.publicId)}
                        title="Delete attachment"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};
