import React, { useCallback, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, DialogActions, Button } from '@mui/material';
import getCroppedImg from './cropImage';
import { Area, Point } from 'react-easy-crop/types';
import Cropper from 'react-easy-crop';
import { Image } from '../../../../../types';

interface ImageCropDialogProps {
  open: boolean,
  handleClose: () => void,
  image: Image,
  updateImage: (image: Image, url: string) => void
}

const ImageCropDialog = (props: ImageCropDialogProps) => {
  const { open, handleClose, image, updateImage } = props;
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((croppedArea, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const saveCroppedImage = useCallback(async () => {
    if (croppedAreaPixels) {
      try {
        const cropped = await getCroppedImg(
          image.url,
          croppedAreaPixels,
          0
        );
        if (cropped) {
          updateImage(image, cropped);
          handleClose();
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [croppedAreaPixels]);

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
      onClose={handleClose}
      scroll={'paper'}
    >
      <DialogTitle>Rajaa kuva</DialogTitle>
      <DialogContent dividers={true}>
        <Box sx={{
          position: 'relative',
          width: '100%',
          height: 200
        }}>
          <Cropper
            image={image.url}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color='secondary'>Peruuta</Button>
        <Button onClick={saveCroppedImage} variant='contained' color='primary'>Käytä</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropDialog;