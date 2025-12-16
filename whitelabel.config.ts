
export interface WhitelabelConfig {
  // Barnehage/organisasjon info
  organization?: {
    name?: string;
    logo?: any; // require('./assets/logo.png') eller URL
    supportEmail?: string;
    supportPhone?: string;
  };

  // Splash/Start screen
  splash?: {
    enabled: boolean;
    image?: any; // require('./assets/splash.png')
    backgroundColor?: string | undefined;
    duration?: number | undefined; // millisekunder
  };

  // Farger - overstyrer standard tema
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    accent?: string;
    // Legg til flere etter behov
  };

  // Typografi
  typography?: {
    fontFamily?: string;
    headingFontFamily?: string;
  };

  // Features som kan toggles
  features?: {
    languageSwitcher?: boolean;
    darkMode?: boolean;
    notifications?: boolean;
  };

  // Branding
  branding?: {
    appName?: string;
    tagline?: string;
    welcomeMessage?: string;
  };
}

// Default config - brukes hvis ingenting er overstyrt
const defaultConfig: WhitelabelConfig = {
  organization: {
    name: undefined,
    logo: undefined,
  },
  splash: {
    enabled: false,
    image: undefined,
    backgroundColor: undefined,
    duration: 2000,
  },
  colors: {
    primary: "#57507F",
    secondary: "#6B63A8",
    background: "#FFFFFF",
    text: "#000000",
  },
  features: {
    languageSwitcher: true,
    darkMode: false,
    notifications: true,
  },
};

// Her kan hver kunde/barnehage ha sin egen config
const whitelabelConfig: WhitelabelConfig = {
  // Eksempel for en spesifikk barnehage:
  organization: {
    name: "Solstrålen Barnehage",
    logo: require("../assets/barnehage-logo.png"),
    supportEmail: "kontakt@solstralen.no",
    supportPhone: "+47 123 45 678",
  },

  splash: {
    enabled: true,
    image: require("../assets/splash-solstralen.png"),
    backgroundColor: "#FFE5B4",
    duration: 2500,
  },

  colors: {
    primary: "#FFA500", // Oransje tema for denne barnehagen
    secondary: "#FFD700",
    accent: "#FF8C00",
  },

  branding: {
    appName: "Solstrålen",
    tagline: "Der barn blomstrer",
    welcomeMessage: "Velkommen til Solstrålen Barnehage!",
  },

  features: {
    languageSwitcher: true,
    darkMode: false,
  },
};

// Merge default med whitelabel config
export const config: WhitelabelConfig = {
  ...defaultConfig,
  organization: { ...defaultConfig.organization, ...whitelabelConfig.organization },
  splash: { ...defaultConfig.splash, ...whitelabelConfig.splash },
  colors: { ...defaultConfig.colors, ...whitelabelConfig.colors },
  features: { ...defaultConfig.features, ...whitelabelConfig.features },
  branding: whitelabelConfig.branding,
};