/**
 * Google AdSense Component
 * Displays Google AdSense ads in the post feed
 * Configure publisher ID via environment variable REACT_APP_ADSENSE_PUBLISHER_ID
 */

import React, { useEffect } from 'react';
import { ADSENSE_PUBLISHER_ID } from '../config/constants';

const AdSense = ({ 
  slot = '1234567890', // Your AdSense ad slot ID
  style = { display: 'block', textAlign: 'center' },
  format = 'auto',
  responsive = true 
}) => {
  useEffect(() => {
    // Only load AdSense if publisher ID is configured
    if (!ADSENSE_PUBLISHER_ID) {
      console.warn('AdSense Publisher ID not configured. Set REACT_APP_ADSENSE_PUBLISHER_ID in .env');
      return;
    }

    try {
      // Load Google AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Push ad to adsbygoogle array
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // Don't render if publisher ID is not configured
  if (!ADSENSE_PUBLISHER_ID) {
    return null;
  }

  return (
    <div className="adsense-container" style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdSense;

