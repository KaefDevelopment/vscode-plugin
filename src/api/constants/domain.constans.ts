const UTM_STRING = 'utm_source=plugin-vscode&utm_content=status_bar';

export const APP_ROOT_URL = 'https://nautime.io';
export const APP_DASHBOARD_URL = `${APP_ROOT_URL}/dashboard?${UTM_STRING}`;
export const SIGN_IN_LINK = (pluginId: string) => `${APP_ROOT_URL}/link/${pluginId}?${UTM_STRING}`;

export const API_ROOT_URL = `${APP_ROOT_URL}/api/web/v1`;

export const CLI_URL = 'https://github.com/KaefDevelopment/cli-service/releases/download';
