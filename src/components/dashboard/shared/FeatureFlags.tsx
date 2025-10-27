// Feature flag utility for dashboard components
export const SOCIAL_ENABLED = import.meta.env.VITE_SOCIAL_ENABLED === 'true';

// Text constants with corrected copy
export const COPY_CONSTANTS = {
  IDENTITY_VERIFICATION_REQUIRED: {
    en: "Identity Verification Required",
    ar: "التحقق من الهوية مطلوب"
  },
  SOCIAL_COMING_SOON: {
    en: "Coming Soon",
    ar: "قريبًا"
  }
};

// Helper function to get text based on current language
export const getText = (key: keyof typeof COPY_CONSTANTS, language: 'en' | 'ar' = 'en') => {
  return COPY_CONSTANTS[key][language];
};

// Helper function to check if social features should be shown
export const shouldShowSocialFeatures = () => {
  return SOCIAL_ENABLED;
};
