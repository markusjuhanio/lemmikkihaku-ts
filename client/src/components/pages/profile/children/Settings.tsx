import React, { useState } from 'react';
import { Box, Accordion, AccordionSummary, Typography, Button, AccordionDetails, Switch, FormControlLabel, FormGroup, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageSectionHeader from '../../../PageSectionHeader';
import { useAppDispatch, useLoader } from '../../../../hooks';
import { OwnUser, UserSaveableSettings, Severity, AxiosErrorMessage, EmailChangeRequest, PasswordChangeRequest } from '../../../../types';
import { isValidNickname } from '../../../../utils';
import userService from '../../../../services/userService';
import { logout, updateUser } from '../../../../reducers/userReducer';
import { showToast } from '../../../../reducers/toastReducer';
import { AxiosError } from 'axios';
import { CirclePicker } from 'react-color';
import emailVerifyRequestService from '../../../../services/emailVerifyRequestService';
import passwordRequestService from '../../../../services/passwordRequestService';
import { confirm } from '../../../../confirmer';
import { useHistory } from 'react-router-dom';

interface SettingsProps {
  user: OwnUser | null
}

const Settings = (props: SettingsProps) => {
  const { user } = props;
  const dispatch = useAppDispatch();

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(user ? user.settings.useNotifications : false);
  const [emailsEnabled, setEmailsEnabled] = useState<boolean>(user ? user.settings.useEmails : false);
  const [nickname, setNickname] = useState<string>(user ? user.nickname : '');
  const [email, setEmail] = useState<string>('');
  const [avatarColor, setAvatarColor] = useState<string>(user ? user.avatarColor : '');
  const history = useHistory();
  const loader = useLoader();

  const [expanded, setExpanded] = useState<string | null>();

  const handleSave = async (): Promise<void> => {
    const settings: UserSaveableSettings = {
      settings: {
        useEmails: emailsEnabled,
        useNotifications: notificationsEnabled
      },
      nickname: nickname,
      avatarColor: avatarColor
    };

    if (user) {
      try {
        loader.start();
        const response = await userService.saveSettings(user.id, settings);
        const updatedUser: OwnUser = response.data;
        dispatch(updateUser(updatedUser));
        dispatch(showToast({
          open: true,
          message: 'Asetukset tallennettiin.',
          severity: Severity.Success,
          timeout: 3
        }));
        loader.stop();
      } catch (error) {
        loader.stop();
        const err = error as AxiosError;
        let message = 'Asetusten tallentaminen epäonnistui.';
        if (err.response?.status && err.response?.data) {

          const errorMessage = err.response.data as AxiosErrorMessage;
          const errorCode: number = err.response.status;

          if (errorCode && errorMessage) {
            if (errorCode === 409) {
              const msg: string = errorMessage.error;
              switch (msg) {
              case 'nickname':
                message = 'Valitsemasi nimimerkki on jo käytössä.';
                break;
              case 'email':
                message = 'Valitsemasi sähköpostiosoite on jo käytössä.';
                break;
              case 'avatarColor':
                message = 'Valitsemasi avatarin taustaväri ei ole sallittu.';
                break;
              }
            }
          }
        }

        dispatch(showToast({
          open: true,
          message: message,
          severity: Severity.Error,
          timeout: 3
        }));
      }
    }
  };

  const handleNicknameChange = (value: string): void => {
    if (isValidNickname(value)) {
      setNickname(value);
    }
  };

  const saveDisabled = (): boolean => {
    if (user) {
      if (notificationsEnabled === user.settings.useNotifications &&
        emailsEnabled === user.settings.useEmails &&
        nickname === user.nickname &&
        avatarColor === user.avatarColor) {
        return true;
      }
    }
    return false;
  };

  const getSaveButton = (): JSX.Element => {
    return (
      <Box sx={{ display: 'block', pt: 2 }}>
        <Button disabled={loader.loading || saveDisabled()} onClick={handleSave} variant='outlined'>Tallenna</Button>
      </Box>
    );
  };

  const handleAccordionChange = (value: string) => {
    setExpanded(expanded === value ? null : value);
  };

  const handleCreateEmailChangeRequest = async (): Promise<void> => {
    if (user) {
      try {
        loader.start();
        const data: EmailChangeRequest = { email: email };
        await emailVerifyRequestService.createRequest(data);
        dispatch(showToast({
          open: true,
          severity: Severity.Success,
          message: 'Sähköpostin vaihtolinkki lähetettiin. Seuraa uuteen sähköpostiisi tulleita ohjeita vaihtaaksesi nykyisen sähköpostiosoitteesi.',
          timeout: 10
        }));
        loader.stop();
        setEmail('');
      } catch (error) {
        loader.stop();
        const err = error as AxiosError;
        let message = 'Sähköpostin vaihtolinkin pyyntö epäonnistui.';

        if (err.response?.status && err.response?.data) {
          const errorCode: number = err.response.status;
          if (errorCode === 409) {
            message = 'Valitsemasi sähköpostiosoite on jo käytössä.';
          }
        }
        dispatch(showToast({
          open: true,
          severity: Severity.Error,
          message: message,
          timeout: 5
        }));
      }
    }
  };

  const handleCreatePasswordChangeRequest = async (): Promise<void> => {
    if (user) {
      try {
        loader.start();
        const data: PasswordChangeRequest = { email: user.email };
        await passwordRequestService.createRequest(data);
        dispatch(showToast({
          open: true,
          severity: Severity.Success,
          message: 'Salasanan vaihtolinkki lähetettiin. Seuraa sähköpostiisi tulleita ohjeita vaihtaaksesi nykyisen salasanasi.',
          timeout: 10
        }));
        loader.stop();
        setEmail('');
      } catch (error) {
        loader.stop();
        dispatch(showToast({
          open: true,
          severity: Severity.Error,
          message: 'Salasanan vaihtolinkin pyyntö epäonnistui.',
          timeout: 5
        }));
      }
    }
  };

  const handleDeleteUser = async (): Promise<void> => {
    const confirmed = await confirm('Haluatko varmasti poistaa käyttäjätunnuksesi?');
    if (confirmed) {
      if (user) {
        try {
          loader.start();
          await userService.deleteUser(user.id);
          dispatch(logout());
          history.push('/');
          dispatch(showToast({
            open: true,
            severity: Severity.Success,
            message: 'Käyttäjätunnuksesi poistettiin.',
            timeout: 5
          }));
          loader.stop();
        } catch (error) {
          loader.stop();
          dispatch(showToast({
            open: true,
            severity: Severity.Error,
            message: 'Käyttäjätunnuksen poistaminen epäonnistui.',
            timeout: 5
          }));
        }
      }
    }
  };

  return (
    <Box>
      <PageSectionHeader title='Omat asetukset' />
      <Accordion expanded={expanded === 'panel1'} onChange={() => handleAccordionChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>
            Notifikaatiot
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='body2'>
            Valitse, lähetetäänkö sinulle palvelunsisäisiä notifikaatioita esimerkiksi uusista viesteistä, tai sähköposteja, kun ilmoituksesi on joko hyväksytty tai hylätty.
          </Typography>
          <FormGroup sx={{ pt: 2 }}>
            <FormControlLabel
              control={<Switch checked={notificationsEnabled} />}
              onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setNotificationsEnabled(checked)}
              label="Palvelunsisäiset notifikaatiot"
            />
            <FormControlLabel
              control={<Switch />}
              checked={emailsEnabled}
              onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => setEmailsEnabled(checked)}
              label="Sähköpostiviestit"
            />
          </FormGroup>

          {getSaveButton()}

        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={() => handleAccordionChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography>Nimimerkki</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            value={nickname}
            inputProps={{
              maxLength: 15
            }}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleNicknameChange(event.target.value)}
            label='Nimimerkki'
            helperText='Nimimerkin pituus 4-15 merkkiä. Erikoismerkit ei sallittu.'
          />
          {getSaveButton()}
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={() => handleAccordionChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>
            Avatarin taustaväri
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CirclePicker
            color={avatarColor}
            onChange={(color: { hex: string; }) => setAvatarColor(color.hex)}
          />
          {getSaveButton()}
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={() => handleAccordionChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>
            Vaihda salasana
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <Box>
              <Typography variant='body2'>
                Pyydä linkki, niin lähetämme sinulle sähköpostia vaihtaaksesi salasanasi.
              </Typography>
              <Typography sx={{ pt: '5px' }} variant='body2'>
                Linkki lähetetään osoitteeseen: <b>{user?.email}</b>
              </Typography>
            </Box>
            <Box>
              <Button disabled={loader.loading} onClick={handleCreatePasswordChangeRequest} variant='outlined'>Pyydä vaihtolinkki</Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel5'} onChange={() => handleAccordionChange('panel5')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>
            Vaihda sähköpostiosoite
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <Box>
              <Typography variant='body2'>
                Pyydä linkki, niin lähetämme sinulle sähköpostia vaihtaaksesi sähköpostiosoitteesi. Linkki lähetetään uuteen sähköpostiosoitteeseen.
              </Typography>
              <Typography sx={{ pt: '5px' }} variant='body2'>
                Nykyinen sähköpostiosoite: <b>{user?.email}</b>
              </Typography>
            </Box>
            <Box>
              <TextField
                fullWidth
                error={email.length > 0 && !email.includes('@')}
                value={email}
                inputProps={{
                  maxLength: 100
                }}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setEmail(event.target.value)}
                label='Uusi sähköpostiosoite'
              />
            </Box>
            <Box>
              <Button disabled={loader.loading || email.length === 0 || email.length > 0 && !email.includes('@')} onClick={handleCreateEmailChangeRequest} variant='outlined'>Pyydä vaihtolinkki</Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel6'} onChange={() => handleAccordionChange('panel6')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>
            Poista käyttäjätunnus
          </Typography>
        </AccordionSummary>
        <AccordionDetails>

          <Typography variant='body2'>
            Poista käyttäjätunnus ja kaikki siihen liittyvät tiedot. Tätä toimintoa ei ole mahdollista perua.
          </Typography>
          <Box sx={{ pt: 2 }}>
            <Button disabled={loader.loading} variant='outlined' onClick={handleDeleteUser}>
              Poista käyttäjätunnus
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box >
  );
};

export default Settings;