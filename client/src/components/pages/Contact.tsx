import React, { useEffect } from 'react';
import { Box, Link, Typography, Paper, TextField, Grid, Button } from '@mui/material';
import PageSectionHeader from '../PageSectionHeader';
import { useAppDispatch, useAppSelector, useDocumentTitle, useField, useScrollTop } from '../../hooks';
import { isEmail, isEmptyString, isNotEmail } from '../../utils';
import { Email, IUseField, Severity } from '../../types';
import contactService from '../../services/contactService';
import { showToast } from '../../reducers/toastReducer';

const title = 'Ota yhteyttä';

const Contact = () => {
  const email: IUseField = useField('email');
  const message: IUseField = useField('text');
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);

  useDocumentTitle(title);
  useScrollTop();

  useEffect(() => {
    if (user) {
      email.setValue(user.email);
    }
  }, [user]);

  const handleClear = (): void => {
    email.clear();
    message.clear();
  };

  const handleSend = async (): Promise<void> => {
    if (!isEmptyString(email.value) && !isEmptyString(message.value)) {
      try {
        const data: Email = {
          subject: 'Yhteydenotto Lemmikkihaku -palvelusta',
          message: `${message.value}\n\nYhteydenottajan sähköpostiosoite: ${email.value}`
        };
        await contactService.sendEmail(data);
        dispatch(showToast({
          open: true,
          severity: Severity.Success,
          message: 'Kiitos viestistä. Otamme tarvittaessa yhteyttä mahdollisimman pian.',
          timeout: 5
        }));
        message.clear();
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

  const canSendEmail = (): boolean => {
    if (!isEmptyString(email.value) && !isEmptyString(message.value)) {
      if (isEmail(email.value)) {
        return true;
      }
    }
    return false;
  };

  return (
    <Box>
      <PageSectionHeader title={title} />
      <Paper sx={{ p: 2 }}>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant='body2'>
            Voit ottaa yhteyttä ylläpitoon lähettämällä sähköpostia osoitteeseen
            <Link href='mailto:info@lemmikkihaku.fi'> info@lemmikkihaku.fi</Link> tai käyttämällä alla olevaa lomaketta.
          </Typography>

          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                error={email.value.length > 0 && (!isNotEmail(email.value))}
                value={email.value}
                onChange={email.onChange}
                fullWidth
                label='Sähköpostiosoitteesi'
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                value={message.value}
                onChange={message.onChange}
                fullWidth
                multiline
                minRows={5}
                label='Viesti'
              />
            </Grid>
          </Grid>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'flex-end'
          }}>
            <Button
              disabled={isEmptyString(email.value) && isEmptyString(message.value)}
              onClick={handleClear}
              color='secondary'
            >
              Tyhjennä
            </Button>
            <Button
              disabled={!canSendEmail()}
              onClick={handleSend}
              variant='contained'
              color='primary'
            >
              Lähetä
            </Button>
          </Box>
        </Box>

      </Paper>
    </Box>
  );
};

export default Contact;