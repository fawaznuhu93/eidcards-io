import ReactGA from 'react-ga4';

// Initialize GA4
export const initGA = (measurementId) => {
  ReactGA.initialize(measurementId);
};

// Track page views
export const pageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// Track events
export const trackEvent = (category, action, label = null, value = null) => {
  ReactGA.event({
    category,
    action,
    label,
    value
  });
};

// Track purchases
export const trackPurchase = (transactionId, value, currency = 'USD') => {
  ReactGA.event({
    category: 'Ecommerce',
    action: 'Purchase',
    label: transactionId,
    value: value
  });
};

// Track card customization
export const trackCustomization = (cardType, cardName) => {
  ReactGA.event({
    category: 'Card',
    action: 'Customize',
    label: `${cardType} - ${cardName}`
  });
};