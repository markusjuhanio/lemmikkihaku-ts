import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PageSectionHeader from '../PageSectionHeader';
import { useDocumentTitle, useScrollTop } from '../../hooks';

const title = 'Rekisteri- ja tietosuojaseloste';

const RegistryDescription = () => {
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
              Rekisterinpitäjä
            </Typography>
            <Typography variant='body2'>
              Lemmikkihaku<br />
              info@lemmikkihaku.fi
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Yhteyshenkilö rekisteriä koskevissa asioissa
            </Typography>
            <Typography variant='body2'>
              Markus Ollonqvist <br />
              markusjuhanio@gmail.com
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Rekisterin nimi
            </Typography>
            <Typography variant='body2'>
              Lemmikkihaun käyttäjärekisteri
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Käyttäjärekisterin tarkoitus ja käyttö
            </Typography>
            <Typography variant='body2'>
              Rekisterin tarkoituksena on toimia Lemmikkihaun käyttäjärekisterinä.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Käyttäjärekisterin sisältö
            </Typography>
            <Typography variant='body2'>
              Käyttäjärekisteri sisältää seuraavat tiedot <br />
              · Nimimerkki <br />
              · Sähköpostiosoite <br />
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Sääntöjen mukaiset tietolähteet
            </Typography>
            <Typography variant='body2'>
              Rekisterissä olevat tiedot saadaan käyttäjän rekisteröityessä sivulle.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Tietojen säännönmukaiset luovutukset
            </Typography>
            <Typography variant='body2'>
              Rekisterinpitäjä ei luovuta tietoja ulkopuolisille, paitsi Suomen viranomaistoimien niin edellyttäessä.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Tietojen siirto EU:n tai ETA:n ulkopuolelle
            </Typography>
            <Typography variant='body2'>
              Henkilötietoja ei pääsääntöisesti siirretä Euroopan unionin tai Euroopan talousalueen ulkopuolelle.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Käyttäjärekisterin suojaus
            </Typography>
            <Typography variant='body2'>
              Henkilötiedot säilytetään luottamuksellisina. Rekisterinpitäjän ja sen mahdollisten tietotekniikkakumppaneiden tietoverkko ja laitteisto, jolla rekisteri sijaitsee, on suojattu palomuurilla ja muilla tarvittavilla teknisillä toimenpiteillä.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Rekisteritietojen tarkastaminen
            </Typography>
            <Typography variant='body2'>
              Rekisteröidyllä on oikeus tarkastaa, muuttaa tai poistaa itseään koskevat rekisteritiedot. Jos haluat tarkastaa, muuttaa tai poistaa sinuun liittyvät rekisteritiedot, ota yhteys rekisterinpitäjään.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Evästeet ja seuranta
            </Typography>
            <Typography variant='body2'>
              Rekisterinpitäjän sivuilla saatetaan käyttää evästeitä. Eväste on tekstitiedosto, joka verkkosivulla käydessä tallentuu käyttäjän tietokoneelle. Evästeiden avulla kerätään tietoa sivujen käytöstä. Käyttäjän henkilöllisyys ei käy ilmi evästeiden avulla. Käyttäjä voi halutessaan poistaa evästeet käytöstä selaimen asetuksista. Rekisterinpitäjä ei takaa, että sivusto toimii oikein evästeiden käytöstä poistamisen jälkeen.
            </Typography>
          </Box>

          <Typography sx={{ opacity: 0.75 }} variant='caption'>
            Päivitetty 18.11.2021
          </Typography>

        </Box>

      </Paper>
    </Box>
  );
};

export default RegistryDescription;