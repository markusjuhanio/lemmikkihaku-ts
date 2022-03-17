import React from 'react';
import { Box, Paper, Typography, Grid, Button } from '@mui/material';
import PageSectionHeader from '../PageSectionHeader';
import { useDocumentTitle, useScrollTop } from '../../hooks';
import { LISTING_LIFETIME } from '../../constants';
import { useHistory } from 'react-router-dom';

const title = 'Tietoa palvelusta';

const Info = () => {
  const history = useHistory();
  useDocumentTitle(title);
  useScrollTop();

  return (
    <Box>
      <PageSectionHeader title={title} />
      <Paper sx={{ p: 2 }}>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Box>
            <Typography variant='subtitle2'>
              Mikä on Lemmikkihaku?
            </Typography>
            <Typography variant='body2'>
              Lemmikkihaku on uusi palvelu, joka auttaa kodit ja lemmikit löytämään yhteen.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Miten ilmoitan?
            </Typography>
            <Typography variant='body2'>
              Uuden ilmoituksen jättäminen on helppoa, nopeaa ja täysin maksutonta. Rekisteröidy tai kirjaudu ensin sisään ja valitse sitten ylävalikosta Ilmoita.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Kuinka kauan ilmoitukseni on voimassa?
            </Typography>
            <Typography variant='body2'>
              Ilmoitus on voimassa {LISTING_LIFETIME} päivää ilmoittamishetkestä alkaen. Kun ilmoituksesi on vanhenemassa, voit tarvittaessa uusia sen omalla sivulla nappia painamalla. Vanhentuneet ilmoitukset poistetaan automaattisesti.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Kuinka kauan ilmoitukseni julkaisu kestää?
            </Typography>
            <Typography variant='body2'>
              Ilmoitukset tarkistetaan ennen niiden julkaisua. Tarkistuksen aikana ilmoitus ei näy palvelussa. Aikaa tarkistukseen kuluu arkisin yleensä muutamasta minuutista muutamaan tuntiin. Saat palvelunsisäisen notifikaation ja sähköpostiviestin, kun ilmoituksesi on tarkistettu. Voit halutessasi muuttaa tätä asetusta omalla sivullasi.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Kuka saa ilmoittaa Lemmikkihaussa?
            </Typography>
            <Typography variant='body2'>
              Kuka tahansa. Palvelua valvotaan aktiivisesti ja ylläpito varaa oikeuden muuttaa tai poistaa asiattomat ilmoitukset. Pentutehtailu ja laittomasti maahantuotujen eläinten myyminen on ehdottomasti kielletty.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Miten voin ottaa yhteyttä ylläpitoon?
            </Typography>
            <Typography variant='body2'>
              Voit ottaa yhteyttä ylläpitoon lähettämällä sähköpostia osoitteeseen info@lemmikkihaku.fi tai käyttämällä yhteydenottolomaketta.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Millä selaimella sivusto on testattu ja toimiva?
            </Typography>
            <Typography variant='body2'>
              Sivusto toimii parhaiten Chromen, Firefoxin ja Safarin uusimmilla versioilla.
            </Typography>
          </Box>

          <Grid sx={{ pt: 1 }} container spacing={1}>
            <Grid item>
              <Button variant='outlined' onClick={() => history.push('/kayttoehdot')} color='secondary'>Käyttöehdot</Button>
            </Grid>
            <Grid item>
              <Button variant='outlined' onClick={() => history.push('/rekisteriseloste')} color='secondary'>Rekisteriseloste</Button>
            </Grid>
            <Grid item>
              <Button variant='outlined' onClick={() => history.push('/ota-yhteytta')} color='secondary'>Ota yhteyttä</Button>
            </Grid>
          </Grid>
        </Box>

      </Paper>
    </Box>
  );
};

export default Info;