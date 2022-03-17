import React, { useState } from 'react';
import { Grid, Dialog, DialogActions, DialogTitle, TextField, Button, DialogContent, Typography, Box, Chip, IconButton, Paper, CardActionArea, useTheme, Theme, Menu, Fade, MenuList, MenuItem, ListItemIcon, ListItemText, SxProps } from '@mui/material';
import { OwnUser, PublicListing, OwnListing, Severity, ListingEntry, Email, IUseField, Category } from '../types';
import moment from 'moment';
import 'moment/locale/fi';
import { Block, Check, Delete, Edit, Favorite, Flag, HourglassTop, Loyalty, MoreHoriz, NoPhotography, Restore } from '@mui/icons-material';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useField } from '../hooks';
import { setNewListing } from '../reducers/newListingReducer';
import { getPrettyDate, isEmptyString, toListingEntry } from '../utils';
import listingService from '../services/listingService';
import contactService from '../services/contactService';
import { showToast } from '../reducers/toastReducer';
import { deleteListing, updateListing } from '../reducers/listingsReducer';
import { setLoginModal } from '../reducers/loginModalReducer';
import userService from '../services/userService';
import { updateUser } from '../reducers/userReducer';
import { confirm } from '../confirmer';
import { LISTING_LIFETIME } from '../constants';

interface ListingCardProps {
  listing: PublicListing | OwnListing
}

const ListingCard = (props: ListingCardProps) => {
  const { listing } = props;
  const theme: Theme = useTheme();
  const history = useHistory();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();
  const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);
  const reportText: IUseField = useField('text');

  const location = useLocation();

  const handleCloseMenu = (): void => {
    setMenuAnchorEl(null);
  };

  const handleCloseReportDialog = (): void => {
    setReportDialogOpen(false);
  };

  const handleOpenReportDialog = (): void => {
    setReportDialogOpen(true);
    handleCloseMenu();
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.stopPropagation();
    event.preventDefault();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleEditClick = (): void => {
    const listingToEdit: ListingEntry = toListingEntry(listing);
    dispatch(setNewListing(listingToEdit));
    history.push('/ilmoita');
  };

  const handleSendReport = async (): Promise<void> => {
    if (!isEmptyString(reportText.value)) {
      try {
        const data: Email = {
          subject: `Ilmianto ilmoituksesta (${listing.id})`,
          message: reportText.value
        };
        await contactService.sendEmail(data);
        reportText.clear();
        handleCloseReportDialog();
        dispatch(showToast({
          open: true,
          severity: Severity.Success,
          message: 'Kiitos ilmiannosta. Tutkimme asiaa.',
          timeout: 5
        }));
      } catch (error) {
        dispatch(showToast({
          open: true,
          severity: Severity.Error,
          message: 'Viestin lähetys epäonnistui.',
          timeout: 5
        }));
      }
    }
  };

  const handleDeleteClick = async (): Promise<void> => {
    handleCloseMenu();
    const confirmed = await confirm(`Haluatko varmasti poistaa ilmoituksen ${listing.title}?`);
    if (confirmed) {
      try {
        await listingService.softDeleteListing(listing.id);
        dispatch(deleteListing(listing.id));
        dispatch(showToast({
          open: true,
          severity: Severity.Success,
          message: 'Ilmoitus poistettiin.',
          timeout: 3
        }));
      } catch (error) {
        dispatch(showToast({
          open: true,
          severity: Severity.Error,
          message: 'Ilmoituksen poistaminen epäonnistui.',
          timeout: 3
        }));
      }
    }
  };

  const handleFavoriteClick = async (add: boolean | undefined): Promise<void> => {
    handleCloseMenu();
    if (!user) {
      dispatch(setLoginModal({
        opened: true,
        tab: 0
      }));
      return;
    } else {
      try {
        const response = await userService.addFavoriteListing(user.id, listing.id);
        const updatedUser: OwnUser = response.data;
        dispatch(updateUser(updatedUser));
        dispatch(showToast({
          open: true,
          severity: Severity.Success,
          timeout: 3,
          message: !add ? 'Ilmoitus lisättiin suosikkeihin.' : 'Ilmoitus poistettiin suosikeista.'
        }));
      } catch (error) {
        dispatch(showToast({
          open: true,
          severity: Severity.Error,
          message: 'Ilmoituksen lisääminen suosikkeihin epäonnistui.',
          timeout: 3,
        }));
      }
    }
  };

  const handleRenewClick = async (): Promise<void> => {
    const now: moment.Moment = moment(new Date());
    const createdAt: moment.Moment = moment(listing.date);

    const daysRequired: number = LISTING_LIFETIME / 2;
    const daysBetween: number = now.diff(createdAt, 'days');

    if (daysBetween < daysRequired) {
      dispatch(dispatch(showToast({
        open: true,
        severity: Severity.Warning,
        message: `Voit uusia ilmoituksen ${daysRequired - daysBetween} päivän päästä.`,
        timeout: 5
      })));
    } else {
      try {
        const response = await listingService.renewListing(listing.id);
        const updatedListing: PublicListing = response.data;
        dispatch(updateListing(updatedListing));
        dispatch(dispatch(showToast({
          open: true,
          severity: Severity.Success,
          message: 'Ilmoituksen päivämäärä uusittiin.',
          timeout: 5
        })));
      } catch (error) {
        dispatch(dispatch(showToast({
          open: true,
          severity: Severity.Error,
          message: 'Ilmoituksen uusiminen epäonnistui.',
          timeout: 5
        })));
      }
    }
    handleCloseMenu();
  };

  const isOwnListingInProfile = (): boolean => {
    if ((user && user.id === listing.user.id) && (location && location.pathname === '/oma-sivu')) {
      return true;
    }
    return false;
  };

  const asOwnListing = (): OwnListing => {
    return listing as OwnListing;
  };

  const statusChipStyle: SxProps<Theme> = {
    position: 'absolute', bottom: 0, width: '100%', left: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0
  };

  return (
    <Paper>
      <CardActionArea
        onClick={() => history.push({
          state: { listing: listing },
          pathname: `/ilmoitus/${listing.id}`
        })}
        style={{ borderRadius: theme.shape.borderRadius }}
      >
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={4} xs={12}>
              <Box sx={{
                height: '100%',
                width: '100%',
                position: 'relative'
              }}>
                {listing.images && listing.images[0]
                  ? <img
                    loading='lazy'
                    src={listing.images[0].url}
                    alt={listing.title}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                      maxHeight: 400,
                      overflow: 'hidden',
                      borderRadius: theme.shape.borderRadius
                    }}
                  />
                  : <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      maxHeight: { xs: 350, sm: 250 },
                      minHeight: { xs: 250, sm: 150 },
                      borderRadius: `${theme.shape.borderRadius}px`,
                      background: theme.palette.divider,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <NoPhotography fontSize='large' color='secondary' sx={{ opacity: 0.75 }} />
                  </Box>
                }

                {!isEmptyString(listing.registrationNumber) && (
                  <Box sx={{
                    position: 'absolute',
                    top: 7,
                    left: 7
                  }}>
                    <Chip sx={{ position: 'relative', width: 32 }} color='secondary' icon={<Loyalty sx={{ position: 'absolute', left: 0 }} />} />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item lg={7} md={7} sm={7} xs={10}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                p: { xs: '2px', md: '0px' },
                mb: 1,
                height: '100%',
              }}>
                <Typography
                  variant='subtitle1'
                  sx={{
                    fontWeight: 'bold',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }}>
                  {listing.title}
                </Typography>
                <Typography
                  sx={{ opacity: 0.65, mt: '-3px', mb: '5px' }}
                  variant='caption'>
                  {getPrettyDate(listing.date)}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}
                >
                  {listing.shortDescription}
                </Typography>
                <Box sx={{ mt: 'auto', pt: '5px', width: '100%' }}>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Chip
                        variant='outlined'
                        label={listing.city}
                      />
                    </Grid>
                    <Grid item>
                      <Chip
                        variant='outlined'
                        label={listing.race}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={2}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <IconButton
                  onTouchStart={(event: React.TouchEvent<HTMLButtonElement>) => event.stopPropagation()}
                  onMouseDown={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => event.stopPropagation()}
                  onClick={handleOpenMenu}
                  sx={{ alignSelf: 'flex-end', p: { xs: '5px', md: '3px' } }}>
                  <MoreHoriz />
                </IconButton>
                {listing.price > 0 && (
                  <Chip
                    color='primary'
                    variant={listing.category === Category.Sell ? 'filled' : 'outlined'}
                    sx={{ maxWidth: 70, alignSelf: 'flex-end' }}
                    label={`${listing.price} €`}
                  />
                )}
              </Box>
            </Grid>
          </Grid>

          {isOwnListingInProfile() && (
            <Box sx={{
              pt: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {asOwnListing().rejected === 1
                ? <Chip sx={statusChipStyle} icon={<Block />} color='error' label={'Hylätty'} />
                : asOwnListing().activated === 1
                  ? <Chip sx={statusChipStyle} icon={<Check />} color='success' label={'Julkaistu'} />
                  : <Chip sx={statusChipStyle} icon={<HourglassTop />} color='warning' label={'Odottaa tarkistusta'} />
              }
            </Box>

          )}
        </Box>
      </CardActionArea>

      <Menu
        open={Boolean(menuAnchorEl)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorEl={menuAnchorEl}
        onClose={handleCloseMenu}
        TransitionComponent={Fade}
      >
        {user && user.id === listing.user.id
          ? <MenuList dense>
            <MenuItem onClick={handleEditClick}>
              <ListItemIcon>
                <Edit color='secondary' />
              </ListItemIcon>
              <ListItemText>Muokkaa</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleRenewClick}>
              <ListItemIcon>
                <Restore color='secondary' />
              </ListItemIcon>
              <ListItemText>Uusi</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDeleteClick}>
              <ListItemIcon>
                <Delete color='secondary' />
              </ListItemIcon>
              <ListItemText>Poista</ListItemText>
            </MenuItem>
          </MenuList>
          : <MenuList dense>
            <MenuItem onClick={() => handleFavoriteClick(user?.favorites.includes(listing.id))}>
              <ListItemIcon>
                <Favorite color={user?.favorites.includes(listing.id) ? 'primary' : 'secondary'} />
              </ListItemIcon>
              <ListItemText>{user?.favorites.includes(listing.id) ? 'Poista suosikeista' : 'Lisää suosikkeihin'}</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleOpenReportDialog}>
              <ListItemIcon>
                <Flag color='secondary' />
              </ListItemIcon>
              <ListItemText>Ilmianna</ListItemText>
            </MenuItem>
          </MenuList>
        }
      </Menu>

      <Dialog
        fullWidth
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        maxWidth="xs"
        scroll={'paper'}
      >
        <DialogTitle>Ilmianna ilmoitus {listing.title}</DialogTitle>
        <DialogContent dividers={true}>
          <TextField
            label='Ilmiannon syy'
            fullWidth
            value={reportText.value}
            onChange={reportText.onChange}
            multiline
            inputProps={{
              maxLength: 2500
            }}
            minRows={4}
            maxRows={15}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseReportDialog} color='secondary'>Peruuta</Button>
          <Button disabled={isEmptyString(reportText.value)} onClick={handleSendReport} variant='contained' color='primary'>Lähetä</Button>
        </DialogActions>
      </Dialog>

    </Paper >
  );
};

export default ListingCard;