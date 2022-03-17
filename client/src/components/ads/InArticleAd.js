/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect } from 'react';
import { useAppSelector } from '../../hooks';
import { Paper } from '@mui/material';

const InArticleAd = () => {
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
          style={{ display: 'block', textAlign: 'center', width: '100%', margin: 'auto' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-1282421045992782"
          data-full-width-responsive="false"
          data-ad-slot="8126891167">
        </ins>
      </center>
    </Paper>
  );
};

export default InArticleAd;