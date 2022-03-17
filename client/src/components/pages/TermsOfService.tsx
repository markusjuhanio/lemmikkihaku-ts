import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import PageSectionHeader from '../PageSectionHeader';
import { useDocumentTitle, useScrollTop } from '../../hooks';

const title = 'Käyttöehdot';

const TermsOfService = () => {
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
              Sisältö
            </Typography>
            <Typography variant='body2'>
              · Pentutehtailu tai laittomasti maahantuotujen pentujen myynti on kielletty. <br />
              · Lemmikkihaku ei vastaa ilmoitusten luotettavuudesta. Varmista aina myyjän henkilöllisyys ennen varausmaksun suorittamista! <br />
              · Ylläpito varaa oikeuden muuttaa tai poistaa asiattomat ilmoitukset.
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Tekijänoikeudet
            </Typography>
            <Typography variant='body2'>
              Sisällön julkaisijalla pitää olla tekijänoikeuksien haltijan lupa julkaisemalleen sisällölle. Olet itse vastuussa sisällöstä, jonka julkaiset palvelussa.            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              Mainostaminen
            </Typography>
            <Typography variant='body2'>
              Palvelussa ei saa mainostaa ilman lupaa.
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

export default TermsOfService;