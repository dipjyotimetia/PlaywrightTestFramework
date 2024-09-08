import * as fs from "fs";
import * as yaml from "js-yaml";

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
    if (!fs.existsSync(filePath)) {
      console.error("Config file does not exist:", filePath);
      return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf-8");
    const config = yaml.load(fileContents) as AppConfig;
    return config;
  } catch (error) {
    console.error("Error reading or parsing config file:", error);
    return null;
  }
}
