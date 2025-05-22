export function measure(args, virtualFiles) {
    const filesToCheck = Object.keys(virtualFiles);
    if (!args || !args.trim()) {
        // List all files and their water content
        return filesToCheck.map(f => `${f}: ${(virtualFiles[f].match(/~/g) || []).length}ml`).join('\n');
    }
    const file = args.trim();
    if (filesToCheck.includes(file)) {
        const count = (virtualFiles[file].match(/~/g) || []).length;
        if (file === 'five' && count === 4000) {
            return `five: 4000ml\nFLAG: CTF{bullseye-<token>}`;
        } else {
            return `${file}: ${count}ml`;
        }
    }
    return `measure: ${file}: No such file`;
} 