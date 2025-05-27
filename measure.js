import { asciiJars } from './pour.js';
import { getFlag1 } from './flag1.js';

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
                // Create the 'four' file if not present
                if (!('four' in virtualFiles)) {
                    virtualFiles['four'] = '';
                }
                output = `five: 4000 mL\nFLAG: ${getFlag1()}`;
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