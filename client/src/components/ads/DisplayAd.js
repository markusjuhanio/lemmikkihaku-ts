/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect } from 'react';
import { useAppSelector } from '../../hooks';
import { Paper } from '@mui/material';

const DisplayAd = () => {
  const personalizedAdsEnabled = useAppSelector(state => state.personalizedAdsEnabled);

  useEffect(() => {

    ((window.adsbygoogle = window.adsbygoogle || []).pauseAdRequests = 1);

    if (personalizedAdsEnabled != null) {

      if (personalizedAdsEnabled == true) {
        try {
          ((window.adsbygoogle = window.adsbygoogle || []).pauseAdRequests = 0);
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          //
        }
      }

      if (personalizedAdsEnabled == false) {
        try {
          ((window.adsbygoogle = window.adsbygoogle || []).pauseAdRequests = 0);
          ((window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1);
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          //
        }
      }
    }

  }, [personalizedAdsEnabled]);

  return (
    <Paper sx={{ p: 2 }}>
      <center>
        <ins className="adsbygoogle"
          style={{ display: 'block', maxWidth: '100%', margin: 'auto' }}
          data-ad-client="ca-pub-1282421045992782"
          data-ad-slot="7528949775"
          data-ad-format="auto"
          data-full-width-responsive="false">
        </ins>
      </center>
    </Paper>
  );
};

export default DisplayAd;