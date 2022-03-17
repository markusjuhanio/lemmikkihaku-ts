import React from 'react';
import { Box, Grid, Chip, Divider, Typography, Paper, Link, Theme, useTheme } from '@mui/material';
import ImageGallery from 'react-image-gallery';
import { CalendarToday, Email, Face, LocationOn, NoPhotography } from '@mui/icons-material';
import moment from 'moment';
import 'moment/locale/fi';
import { isEmptyString } from '../utils';
import { AdminViewListing, Gender, Age } from '../types';

interface ListingProps {
  listing?: AdminViewListing
}

const Listing = (props: ListingProps) => {
  const { listing } = props;
  const theme: Theme = useTheme();
  return (
    listing && listing.user
      ? <Box>
        <Paper>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            {listing.images && listing.images.length > 0
              ? <ImageGallery
                showPlayButton={false}
                showThumbnails={false}
                showBullets={Boolean(listing.images.length > 1)}
                showFullscreenButton={false}
                items={listing.images.map((image) => {
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
              <Email />
              <Typography
                variant='body2'
                sx={{ cursor: 'pointer' }}
              >
                <Link
                  href={`mailto:${listing.user.email}`}
                >
                  {listing.user.email}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      : <Typography variant='body2'>
        Ilmoitusta ei löytynyt.
      </Typography>
  );
};

export default Listing;