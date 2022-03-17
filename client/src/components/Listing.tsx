import React, { useEffect, useState } from 'react';
import { Box, Grid, Chip, Divider, Typography, Paper, CircularProgress, Link, Accordion, AccordionSummary, Theme, AccordionDetails, TextField, IconButton, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector, useDocumentTitle, useField, useIsLoggedIn, useLoader } from '../hooks';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Age, Gender, IUseField, ListingEntry, MessageEntry, PublicListing, Severity } from '../types';
import listingService from '../services/listingService';
import LoadingSpinner from './LoadingSpinner';
import ImageGallery from 'react-image-gallery';
import UserAvatar from './UserAvatar';
import { CalendarToday, Face, LocationOn, ExpandMore, Send, Chat, NoPhotography, AlternateEmail } from '@mui/icons-material';
import moment from 'moment';
import 'moment/locale/fi';
import { isEmptyString, toMessageEntry } from '../utils';
import conversationService from '../services/conversationService';
import { showToast } from '../reducers/toastReducer';

interface ListingProps {
  listing?: PublicListing | ListingEntry
}

const Listing = (props: ListingProps) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation<{ listing: PublicListing }>();
  const dispatch = useAppDispatch();
  const [listing, setListing] = useState<PublicListing | ListingEntry | null>(null);
  const user = useAppSelector(state => state.user.user);
  const loader = useLoader(true);
  const isLoggedIn = useIsLoggedIn();
  const theme: Theme = useTheme();
  const history = useHistory();

  const message: IUseField = useField('text');
  const [messageSent, setMessageSent] = useState<boolean>(false);

  useDocumentTitle(listing ? listing.title : loader.loading ? 'Ladataan...' : 'Ilmoitusta ei löytynyt');

  useEffect(() => {
    async function find() {
      try {
        const response = await listingService.getListing(id);
        const foundListing: PublicListing = response.data;
        setListing(foundListing);
        loader.stop();
      } catch (error) {
        loader.stop();
      }
    }
    if (!props.listing && !location.state) {
      void find();
    } else {
      setListing(props.listing ? props.listing : location.state.listing);
      loader.stop();
    }
  }, [id]);

  const isAllImagesDeleted = (): boolean => {
    if (listing) {
      for (const image of listing.images) {
        if (!image.deleted) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!isEmptyString(message.value)) {
      try {
        if (user && listing && listing.user) {
          setMessageSent(true);
          const data: MessageEntry = toMessageEntry(listing.user.id, message.value);
          message.clear();

          await conversationService.sendMessage(data);
          setMessageSent(false);

          dispatch(showToast({
            open: true,
            severity: Severity.Success,
            message: 'Viesti lähetettiin.',
            timeout: 8,
            action: () => history.push({
              pathname: '/oma-sivu',
              state: { tab: 3 }
            }),
            actionName: 'Näytä keskustelut'
          }));
        }

      } catch (error) {
        dispatch(showToast({
          open: true,
          severity: Severity.Error,
          message: 'Viestin lähetys epäonnistui.',
          timeout: 5,
        }));
        setMessageSent(false);
      }
    }
  };

  return (
    listing && listing.user
      ? <Box>
        <Paper>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            {listing.images && listing.images.length > 0 && !isAllImagesDeleted()
              ? <ImageGallery
                lazyLoad={true}
                showPlayButton={false}
                showThumbnails={false}
                showBullets={Boolean(listing.images.length > 1)}
                showFullscreenButton={false}
                items={listing.images.filter(image => !image.deleted).map((image) => {
                  return { original: image.url, thumbnail: image.url };
                })} />
              : <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  maxHeight: 350,
                  minHeight: 250,
                  background: theme.palette.divider,
                  borderTopRightRadius: `${theme.shape.borderRadius}px`,
                  borderTopLeftRadius: `${theme.shape.borderRadius}px`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <NoPhotography fontSize='large' color='secondary' sx={{ opacity: 0.75 }} />
              </Box>
            }
            <Grid sx={{ p: 2 }} container spacing={2}>
              <Grid item>
                <Chip
                  variant='outlined'
                  label={listing.category}
                />
              </Grid>
              <Grid item>
                <Chip
                  variant='outlined'
                  label={listing.race}
                />
              </Grid>
              {listing.gender !== Gender.Unknown && (
                <Grid item>
                  <Chip
                    variant='outlined'
                    label={listing.gender}
                  />
                </Grid>
              )}
              {listing.age !== Age.Unknown && (
                <Grid item>
                  <Chip
                    variant='outlined'
                    label={`Ikä: ${listing.age}`}
                  />
                </Grid>
              )}
              {listing.price > 0 && (
                <Grid item>
                  <Chip
                    variant='outlined'
                    label={`Hinta: ${listing.price} €`}
                  />
                </Grid>
              )}
            </Grid>
            <Divider />
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1,
              pt: 2,
              pl: 2,
              pr: 2
            }}>
              <UserAvatar
                statusVisible={true}
                id={listing.user.id}
                name={listing.user.nickname}
                color={listing.user.avatarColor}
                size={36}
              />
              <Typography
                variant='subtitle1'
                sx={{ fontWeight: 'bold' }}
              >
                {listing.title}
              </Typography>
            </Box>
            <Box sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <Typography
                variant='body2'
                sx={{ whiteSpace: 'pre-line', mb: 1, wordBreak: 'break-word' }}
              >
                {listing.shortDescription}
              </Typography>
              <Typography
                variant='body2'
                sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}
              >
                {listing.fullDescription}
              </Typography>
              {!isEmptyString(listing.registrationNumber) && listing.registrationNumber !== 'default' && (
                <Typography
                  variant='body2'
                >
                  {`Rekisteritunnus: ${listing.registrationNumber}`}
                </Typography>
              )}
            </Box>
            <Divider />
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            p: 2
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 1
            }}>
              <LocationOn />
              <Typography variant='body2'>
                {`${listing.province}, ${listing.city}`}
              </Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 1
            }}>
              <CalendarToday />
              <Typography variant='body2'>
                {moment(listing.date).format('DD.MM.YYYY HH:mm')}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            p: 2
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1
            }}>
              <Face />
              <Typography variant='body2'>
                {listing.user.nickname}
              </Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1
            }}>
              <AlternateEmail />
              <Typography
                variant='body2'
                sx={{ cursor: 'pointer' }}
              >
                <Link
                  href={`mailto:${listing.user.email}`}
                >
                  {listing.user.email.replace('@', '(at)')}
                </Link>
              </Typography>
            </Box>
          </Box>

          <Accordion disabled={!user || (user && listing.user.id === user.id)}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Chat />
                <Typography>
                  {isLoggedIn
                    ? `Aloita keskustelu käyttäjän ${listing.user.nickname} kanssa`
                    : `Kirjaudu sisään aloittaaksesi keskustelun käyttäjän ${listing.user.nickname} kanssa`
                  }
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <TextField
                  disabled={messageSent}
                  value={message.value}
                  onChange={message.onChange}
                  fullWidth
                  inputProps={{ maxLength: 200 }}
                  multiline
                  maxRows={10}
                  minRows={3}
                  placeholder='Kirjoita viesti...'
                />
                <IconButton
                  sx={{ alignSelf: 'center' }}
                  disabled={isEmptyString(message.value)}
                  onClick={handleSendMessage}
                  color='primary'
                  size='large'
                >
                  {messageSent ? <CircularProgress size={28} /> : <Send />}
                </IconButton>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Box>
      : loader.loading
        ? <LoadingSpinner />
        : <Typography variant='body2'>
          Hakemaasi ilmoitusta ei löytynyt.
        </Typography>
  );
};

export default Listing;