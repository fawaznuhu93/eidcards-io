import ReactGA from 'react-ga4';

// Initialize GA4 with error handling
export const initGA = (measurementId) => {
  if (!measurementId) {
    console.error('❌ No Measurement ID provided for GA');
    return;
  }
  
  try {
    ReactGA.initialize(measurementId);
    console.log('✅ Google Analytics initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Google Analytics:', error);
  }
};

// Track page views with error handling
export const pageView = (path) => {
  try {
    ReactGA.send({ hitType: 'pageview', page: path });
    console.log('📊 Page view tracked:', path);
  } catch (error) {
    console.error('❌ Failed to track page view:', error);
  }
};

// Track events with error handling
export const trackEvent = (category, action, label = null, value = null) => {
  try {
    ReactGA.event({
      category,
      action,
      label,
      value
    });
    console.log(`📊 Event tracked: ${category} - ${action}`, { label, value });
  } catch (error) {
    console.error('❌ Failed to track event:', error);
  }
};

// Track purchases
export const trackPurchase = (transactionId, value, currency = 'USD') => {
  try {
    ReactGA.event({
      category: 'Ecommerce',
      action: 'Purchase',
      label: transactionId,
      value: value
    });
    console.log(`💰 Purchase tracked: ${transactionId} - $${value}`);
  } catch (error) {
    console.error('❌ Failed to track purchase:', error);
  }
};

// Track card customization
export const trackCustomization = (cardType, cardName) => {
  try {
    ReactGA.event({
      category: 'Card',
      action: 'Customize',
      label: `${cardType} - ${cardName}`
    });
    console.log(`🎨 Card customization tracked: ${cardType} - ${cardName}`);
  } catch (error) {
    console.error('❌ Failed to track customization:', error);
  }
};