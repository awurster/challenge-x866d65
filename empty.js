import { asciiJars } from './pour.js';

export function empty(args, virtualFiles) {
    if (!args) {
        return 'usage: empty [three|five]';
    }
    const jug = args.trim();
    if (jug === 'three' || jug === 'five') {
        virtualFiles[jug] = '';
        return asciiJars(virtualFiles, { three: 3000, five: 5000 }, { three: 6, five: 10 });
    }
    return 'usage: empty [three|five]';
} 