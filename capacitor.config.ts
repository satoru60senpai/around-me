import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'me.aroundme.lome',
  appName: 'Around Me',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
