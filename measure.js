import { asciiJars } from './pour.js';

export function measure(args, virtualFiles) {
    const filesToCheck = Object.keys(virtualFiles);
    let output = '';
    const jugLimitsML = { three: 3000, five: 5000 };
    const jugRows = { three: 3, five: 5 };
    if (!args || !args.trim()) {
        // List all files and their water content
        output = filesToCheck.map(f => `${f}: ${(virtualFiles[f].match(/~/g) || []).length} mL`).join('\n');
        // Show all jugs
        return output + '\n' + asciiJars(virtualFiles, jugLimitsML, jugRows, ['three', 'five']);
    } else {
        const file = args.trim();
        if (filesToCheck.includes(file)) {
            const count = (virtualFiles[file].match(/~/g) || []).length;
            if (file === 'five' && count === 4000) {
                output = `five: 4000 mL\nFLAG: CTF{bullseye-<token>}`;
            } else {
                output = `${file}: ${count} mL`;
            }
            if (file === 'three' || file === 'five') {
                return output + '\n' + asciiJars(virtualFiles, jugLimitsML, jugRows, [file]);
            }
            return output;
        } else {
            output = `measure: ${file}: No such file`;
            return output;
        }
    }
} 