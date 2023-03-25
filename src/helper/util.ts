import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';

export const records = parse(readFileSync(join(__dirname, 'input.csv')), {
    columns: true,
    skip_empty_lines: true
});