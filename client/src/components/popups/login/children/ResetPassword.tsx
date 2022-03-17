import React from 'react';
import { Grid, TextField, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useAppDispatch, useField, useLoader } from '../../../../hooks';
import { LoginModalStage, PasswordChangeRequest, Severity } from '../../../../types';
import { isEmail, isEmptyString } from '../../../../utils';
import passwordRequestService from '../../../../services/passwordRequestService';
import { showToast } from '../../../../reducers/toastReducer';

const ResetPasswordStage = () => {
  const email = useField('email');
  const loader = useLoader();
  const dispatch = useAppDispatch();

  const handleCreatePasswordChangeRequest = async (): Promise<void> => {
    event?.preventDefault();
    if (!isEmptyString(email.value)) {
      try {
        loader.start();
        const data: PasswordChangeRequest = { email: email.value };
        await passwordRequestService.createRequest(data);
        dispatch(showToast({
          open: true,
          severity: Severity.Success,
          message: 'Salasanan vaihtolinkki lähetettiin. Seuraa sähköpostiisi tulleita ohjeita vaihtaaksesi nykyisen salasanasi.',
          timeout: 10
        }));
        email.setValue('');
        loader.stop();
      } catch (error) {
        dispatch(showToast({
          open: true,
          severity: Severity.Error,
          message: 'Salasanan vaihtolinkin pyyntö epäonnistui.',
          timeout: 5
        }));
        loader.stop();
      }
    }
  };

  return (
    <form onSubmit={handleCreatePasswordChangeRequest}>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            type={email.type}
            value={email.value}
            onChange={email.onChange}
            autoComplete={email.type}
            variant='outlined'
            fullWidth
            label='Sähköpostiosoitteesi'
            InputProps={{
              startAdornment:
                <EmailIcon sx={{ mr: 1 }} />
            }}
          />
        </Grid>
        <Grid sx={{ mt: 1 }} item lg={12} md={12} sm={12} xs={12}>
          <Button
            type='submit'
            disabled={isEmptyString(email.value) || (!isEmptyString(email.value) && !isEmail(email.value)) || loader.loading}
            sx={{ height: 60 }}
            size='large'
            variant='contained'
            fullWidth
          >
            {LoginModalStage.ResetPassword}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ResetPasswordStage;