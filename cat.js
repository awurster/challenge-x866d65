import { asciiJars } from './pour.js';
import { USAGE } from './usage.js';

export function cat(args, virtualFiles) {
    if (!args) {
        return USAGE.cat;
    }
    const file = args.trim();
    if (file in virtualFiles) {
        return virtualFiles[file];
    }
    return `cat: ${file}: No such file`;
} 