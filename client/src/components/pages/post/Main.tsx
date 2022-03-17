import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector, useDocumentTitle, useScrollTop } from '../../../hooks';
import PageSectionHeader from '../../PageSectionHeader';
import Details from './children/Details';
import Images from './children/Images';
import Preview from './children/Preview';
import { ListingEntry, PublicUser, Severity } from '../../../types';
import { isEmptyString } from '../../../utils';
import { setDefaultNewListing, setNewListing } from '../../../reducers/newListingReducer';
import listingService from '../../../services/listingService';
import { showToast } from '../../../reducers/toastReducer';
import { useHistory } from 'react-router-dom';
import { setLoginModal } from '../../../reducers/loginModalReducer';

const title = 'Luo ilmoitus';
const steps = ['Syötä ilmoituksen tiedot', 'Valitse kuvat', 'Esikatsele ja lähetä'];

const Main = () => {
  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState<number>(0);
  const newListing: ListingEntry = useAppSelector(state => state.newListing);
  const [canContinue, setCanContinue] = useState<boolean>(false);
  const user: PublicUser | null = useAppSelector(state => state.user.user);
  const history = useHistory();
  const [sent, setSent] = useState<boolean>(false);

  useDocumentTitle('Ilmoita ilmaiseksi');
  useScrollTop();

  useEffect(() => {
    if (user) {
      dispatch(setNewListing({ ...newListing, user: user }));
    }
  }, [user]);

  useEffect(() => {
    switch (activeStep) {
    case 0:
      canContinueFromDetails();
      break;
    case 1:
      setCanContinue(true);
      break;
    case 2:
      setCanContinue(true);
      break;
    default:
      setCanContinue(false);
      break;
    }
  }, [newListing]);

  const canContinueFromDetails = (): void => {
    let can = true;
    Object.entries(newListing).forEach((obj: [string, string]) => {
      const key: string = obj[0];
      const value: string = obj[1];
      if (key !== 'images' && key !== 'registrationNumber' && key !== 'id') {
        if (isEmptyString(value)) {
          //console.log(key, 'is empty, can not continue...');
          can = false;
        }
      }
    });
    setCanContinue(can);
  };

  const handleNext = async (): Promise<void> => {

    if (activeStep + 1 === steps.length) {
      try {
        setSent(true);
        const id: string | undefined = newListing.id;

        if (!id || isEmptyString(id)) {
          await handleCreate(newListing);
        } else {
          await handleUpdate(id, newListing);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } catch (error) {
        setSent(false);
        dispatch(showToast({
          open: true,
          message: 'Ilmoituksen tallentaminen epäonnistui.',
          severity: Severity.Error,
          timeout: 5
        }));
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (): void => {
    handleClear();
    setActiveStep(0);
  };

  const getComponent = (): JSX.Element => {
    switch (activeStep) {
    case 0:
      return <Details newListing={newListing} />;
    case 1:
      return <Images newListing={newListing} />;
    case 2:
      return <Preview listing={newListing} />;
    default:
      return <Details newListing={newListing} />;
    }
  };

  const handleCreate = async (listing: ListingEntry): Promise<void> => {
    await listingService.createListing(listing);
  };

  const handleUpdate = async (id: string, listing: ListingEntry): Promise<void> => {
    await listingService.updateListing(id, listing);
  };

  const goToHome = (): void => {
    handleClear();
    history.push('/');
  };

  const handleClear = (): void => {
    if (user) {
      dispatch(setDefaultNewListing(user));
    }
    setSent(false);
  };


  if (!user) {
    return (
      <Box>
        <Paper sx={{
          mt: 2,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontWeight: 'bold' }} variant='h6'>
            Kirjaudu sisään ilmoittaaksesi
          </Typography>
          <Grid justifyContent={'center'} container spacing={2}>

            <Grid item>
              <Button onClick={() => dispatch(setLoginModal({
                opened: true,
                tab: 0
              }))} color='primary' variant='contained'>
                Kirjaudu sisään
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => dispatch(setLoginModal({
                opened: true,
                tab: 1
              }))} color='primary' variant='outlined'>
                Rekisteröidy
              </Button>
            </Grid>
          </Grid>
        </Paper >
      </Box >
    );
  }

  return (
    <Box>
      <PageSectionHeader title={title} />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ pl: 2, pr: 2, pb: 4, pt: 4 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label: string) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Paper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Paper sx={{ mt: 2, p: 2 }}>
              <Alert
                severity='success'
              >
                <Typography variant='body2'>
                  Ilmoituksesi on nyt tallennettu. Ilmoitus tarkistetaan ennen sen julkaisua ja aikaa tähän kuluu arkisin yleensä muutamasta minuutista muutamaan tuntiin. Voit halutessasi poistaa tai muokkaa ilmoitusta omalla sivullasi Omat ilmoitukset -välilehdellä.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, gap: 2 }}>
                  <Button size='small' variant='outlined' color='secondary' onClick={goToHome}>Etusivulle</Button>
                  <Button size='small' variant='outlined' color='secondary' onClick={handleReset}>Luo uusi ilmoitus</Button>
                </Box>
              </Alert>
            </Paper>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Paper elevation={activeStep === 2 ? 0 : 1} sx={{ mt: 2, p: activeStep === 2 ? 0 : 2 }}>
              {getComponent()}
            </Paper>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Edellinen
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button disabled={!canContinue || sent} variant='contained' onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Lähetä' : 'Seuraava'}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};

export default Main;