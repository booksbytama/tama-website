// lib/gtag.js
export const GA_TRACKING_ID = 'G-KX1JZYLVMY'; // replace with your GA ID

// Log the pageview with GA
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
