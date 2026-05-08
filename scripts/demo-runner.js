import { runProjectTests } from '../lib/index.js';

const run = await runProjectTests('example-project');

console.log(JSON.stringify(run, null, 2));
