import React, { useEffect, useState } from 'react';
import { Dialog, Typography, Grid, Button, Box, Switch, DialogActions, DialogTitle, DialogContent, Link } from '@mui/material';
import { setPersonalizedAdsEnabled } from '../../reducers/personalizedAdsEnabledReducer';
import { useAppSelector, useAppDispatch } from '../../hooks';
import CookieIcon from '@mui/icons-material/Cookie';
import { setCookieDialog } from '../../reducers/cookieDialogReducer';
import { isCrawler } from '../../utils';

const CookieDialog = () => {
  const dispatch = useAppDispatch();
  const cookieDialog: boolean = useAppSelector(state => state.cookieDialog);
  const personalizedAdsEnabled: boolean | null = useAppSelector(state => state.personalizedAdsEnabled);
  const [personalizedAdsChecked, setPersonalizedAdsChecked] = useState<boolean>(personalizedAdsEnabled || true);

  useEffect(() => {
    const cookiesShowed = localStorage.getItem('cookieDialogShowed');
    if (!cookiesShowed && !isCrawler()) {
      setTimeout(() => {
        dispatch(setCookieDialog(true));
      }, 1500);
    }

    const storedAdsState = localStorage.getItem('personalizedAdsEnabled');
    if (storedAdsState) {
      setPersonalizedAdsChecked(storedAdsState === 'true' ? true : false);
    }
  }, []);

  const handleClose = (reason: string): void => {
    if (reason === 'escapeKeyDown' || reason === 'backdropClick') {
      return;
    }
    dispatch(setCookieDialog(false));
    dispatch(setPersonalizedAdsEnabled(personalizedAdsChecked));
    localStorage.setItem('personalizedAdsEnabled', personalizedAdsChecked.toString());
  };

  const closeDialog = (): void => {
    dispatch(setPersonalizedAdsEnabled(personalizedAdsChecked));
    handleClose('saved');
    localStorage.setItem('cookieDialogShowed', 'true');
  };

  const handlePersonalizedAdsEnabledChange = (checked: boolean) => {
    setPersonalizedAdsChecked(checked);
  };

  const disableAll = () => {
    setPersonalizedAdsChecked(false);
    dispatch(setPersonalizedAdsEnabled(false));
    dispatch(setCookieDialog(false));
    localStorage.setItem('cookieDialogShowed', 'true');
    localStorage.setItem('personalizedAdsEnabled', 'false');
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown
      open={cookieDialog}
      onClose={(event, reason) => handleClose(reason)}
      scroll={'paper'}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CookieIcon /> Tietoa evästeistä</DialogTitle>
      <DialogContent dividers={true}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant='body2'>
            Lemmikkihaku käyttää evästeitä mainostamiseen Google AdSense -palvelun avulla.
          </Typography>
          <Typography variant='body2'>
            Eväste on pieni tekstitiedosto, joka verkkosivulla käydessä tallentuu käyttäjän laitteelle.
            Voit halutessasi ottaa evästeet kokonaan pois käytöstä selaimen asetuksista tai valita tästä näkymästä, mitä evästeitä laitteellesi tallennetaan. {localStorage.getItem('cookieDialogShowed') == null ? 'Voit myöhemmin muuttaa näitä valintoja avaamalla Käyttäjävalikon ja valitsemalla Evästeasetukset.' : null}
          </Typography>

          {/* ADSENSE */}
          <Box sx={{ display: 'flex', alignItems: 'center', pt: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant='subtitle2'>
                Google AdSense
              </Typography>
              <Typography variant='body2'>
                Valitse, näytetäänkö sinulle personoituja mainoksia. <Link target="_blank" rel="noopener noreferrer" href='https://support.google.com/adsense/answer/9007336?hl=fi'>Lue lisää.</Link>
              </Typography>
            </Box>
            <Box sx={{ ml: 1 }}>
              <Switch size='small' checked={personalizedAdsChecked} onChange={(event, checked) => handlePersonalizedAdsEnabledChange(checked)} color='primary' />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Grid container spacing={1} justifyContent='space-between'>
          <Grid item>
            <Button color='secondary' fullWidth onClick={disableAll} size='large'>Hylkää kaikki</Button>
          </Grid>
          <Grid item>
            <Button color='primary' onClick={closeDialog} size='large' variant='contained'>Sulje</Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default CookieDialog;