import React, { useEffect, useRef, useState } from 'react';
import { Box, Theme, useTheme, Typography, Grid, IconButton, Fade, Menu, MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Crop, Delete, LooksOne, MoreHoriz, Upload } from '@mui/icons-material';
import { useAppDispatch } from '../../../../hooks';
import { ListingEntry, Image } from '../../../../types';
import { setNewListing } from '../../../../reducers/newListingReducer';
import { fileToImage } from '../../../../utils';
import ImageCrop from './cropper/ImageCrop';

const maxImages = 6;

interface ImagesProps {
  newListing: ListingEntry
}

const Images = (props: ImagesProps) => {
  const { newListing } = props;
  
  const theme: Theme = useTheme();
  const [images, setImages] = useState<Image[]>(newListing.images);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setNewListing({
      ...newListing,
      images: images
    }));
  }, [images]);

  const handleSelect = async (files: FileList | null): Promise<void> => {
    if (files) {
      const file: File = files[0];
      if (file) {
        const image = await fileToImage(file);
        if (image) {
          handleOpenCropDialog(image);
        }
      }
    }
  };

  const handleCloseMenu = (): void => {
    setMenuAnchorEl(null);
    setSelectedImage(null);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, image: Image): void => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedImage(image);
  };

  const handleDeleteImage = (image: Image): void => {
    if (image.url.startsWith('https://')) {
      image.deleted = true;
      setImages(images.filter(img => img.id === image.id ? image : img));
    } else {
      setImages(images.filter((img) => img.id !== image.id));
    }
    handleCloseMenu();
  };

  const handleSetDefaultImage = (image: Image): void => {
    const temp = images.filter(img => img.id !== image.id);
    setImages([image, ...temp]);
    handleCloseMenu();
  };

  const handleOpenCropDialog = (image: Image): void => {
    setSelectedImage(image);
    setCropDialogOpen(true);
    setMenuAnchorEl(null);
  };

  const handleCloseCropDialog = (): void => {
    setSelectedImage(null);
    setCropDialogOpen(false);
  };

  const updateImage = (image: Image, url: string): void => {
    image.url = url;

    const imageFound: Image | undefined = images.find(img => img.id === image.id);
    if (imageFound) {
      setImages(images.map(img => img.id === image.id ? image : img));
    } else {
      setImages(images.concat(image));
    }
  };

  return (
    <Box>
      <Box
        sx={{
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: `${theme.shape.borderRadius}px`,
          p: 2,
          mb: 3
        }}
      >
        <input
          accept='image/jpeg,image/webp,image/png,image/jpg'
          hidden
          ref={inputRef}
          disabled={images.length >= maxImages}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSelect(event.target.files)}
          type='file'
        />
        <Box
          onClick={() => {
            if (inputRef && inputRef.current) {
              inputRef.current.click();
            }
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            cursor: 'pointer',
          }}>
          <Typography
            variant='h5'
            sx={{
              fontWeight: 'bold',
            }}
          >
            Kuvia lisätty {images.filter(img => !img.deleted).length}/{maxImages}
          </Typography>
          <Upload fontSize='large' />
        </Box>
      </Box>

      <Grid container spacing={2}>
        {images.map((image, i) => (
          !image.deleted && (
            <Grid key={i} item lg={4} md={4} sm={4} xs={6}>
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleOpenMenu(event, image)}
                  size='small'
                  sx={{
                    float: 'right',
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    background: theme.palette.background.default,
                    '&:hover': {
                      background: theme.palette.background.paper
                    }
                  }}>
                  <MoreHoriz />
                </IconButton>
                <img
                  src={image.url}
                  width='100%'
                  height='100%'
                  style={{
                    objectFit: 'cover',
                    borderRadius: `${theme.shape.borderRadius}px`,
                    border: images.length > 0 && images[0].id === image.id ? `1px solid ${theme.palette.success.main}` : 'none'
                  }}
                />
              </Box>
            </Grid>
          )
        ))}
      </Grid>
      {selectedImage && (
        <Menu
          open={Boolean(menuAnchorEl)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          anchorEl={menuAnchorEl}
          onClose={handleCloseMenu}
          TransitionComponent={Fade}
        >
          <MenuList dense>
            <MenuItem
              onClick={() => handleSetDefaultImage(selectedImage)}
              disabled={images.length > 0 && images[0].id === selectedImage.id}
            >
              <ListItemIcon>
                <LooksOne />
              </ListItemIcon>
              <ListItemText>Aseta oletuskuvaksi</ListItemText>
            </MenuItem>
            <MenuItem disabled={selectedImage && selectedImage.url.startsWith('https://')} onClick={() => handleOpenCropDialog(selectedImage)}>
              <ListItemIcon>
                <Crop />
              </ListItemIcon>
              <ListItemText>Rajaa</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleDeleteImage(selectedImage)}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText>Poista</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      {selectedImage && (
        <ImageCrop
          image={selectedImage}
          open={cropDialogOpen}
          handleClose={handleCloseCropDialog}
          updateImage={updateImage}
        />
      )}

    </Box >
  );
};

export default Images;