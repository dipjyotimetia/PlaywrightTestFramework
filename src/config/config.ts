import { existsSync, readFileSync }  from 'fs';
import { load } from 'js-yaml';

export interface AppConfig {
  BASE_URL: string;
  BASE_API: string;
}

/**
 * Reads and parses a YAML configuration file.
 * @param filePath - The path to the configuration file.
 * @returns The parsed configuration object if the file exists and can be read and parsed successfully, otherwise null.
 */
export function readConfigFile(filePath: string): AppConfig | null {
  try {
    if (!existsSync(filePath)) {
      console.error('Config file does not exist:', filePath);
      return null;
    }

    const fileContents = readFileSync(filePath, 'utf-8');
    const config = load(fileContents) as AppConfig;
    return config;
  } catch (error) {
    console.error('Error reading or parsing config file:', error);
    return null;
  }
}
