import React from 'react';
import { Image } from '../../../../../types';
import { IconButton, Box, Dialog, Theme, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';

interface ImageViewProps {
  selectedImage: Image,
  setSelectedImage: React.Dispatch<React.SetStateAction<Image | null>>,
}

const ImagePreview = (props: ImageViewProps) => {
  const { selectedImage, setSelectedImage } = props;
  const theme: Theme = useTheme();
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={Boolean(selectedImage)}
      onClose={() => setSelectedImage(null)}
      scroll={'paper'}
    >
      <Box sx={{ position: 'relative' }}>
        <img src={selectedImage.url} style={{ width: '100%', height: '100%', marginBottom: -10 }} />
        <IconButton onClick={() => setSelectedImage(null)} sx={{
          position: 'absolute',
          right: 10,
          top: 10,
          background: theme.palette.background.default,
          '&:hover': {
            background: theme.palette.background.default,
          },
        }}>
          <Close />
        </IconButton>
      </Box>
    </Dialog>
  );
};

export default ImagePreview;