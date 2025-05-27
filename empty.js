import { asciiJars } from './pour.js';
import { USAGE } from './usage.js';

export function empty(args, virtualFiles) {
    if (!args) {
        return USAGE.empty;
    }
    const jug = args.trim();
    if (jug === 'three' || jug === 'five') {
        virtualFiles[jug] = '';
        return asciiJars(virtualFiles, { three: 3000, five: 5000 }, { three: 6, five: 10 });
    }
    return USAGE.empty;
} 