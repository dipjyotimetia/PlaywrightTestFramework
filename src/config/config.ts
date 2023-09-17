import * as fs from 'fs';
import * as yaml from 'js-yaml';

export interface AppConfig {
  BASE_URL: string;
  BASE_API: string;
}

export function readConfigFile(filePath: string): AppConfig | null {
  if (!fs.existsSync(filePath)) {
    console.error('Config file does not exist:', filePath);
    return null;
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const config = yaml.load(fileContents) as AppConfig;
    return config;
  } catch (error) {
    console.error('Error reading or parsing config file:', error);
    return null;
  }
}