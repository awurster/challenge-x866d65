export function pour(args, virtualFiles, jugLimits) {
    const WATER_CHAR = '~';
    if (!args) {
        return 'usage: pour water > three\n   or: pour five > three';
    }
    // pour water > three or pour water > five
    const waterMatch = args.match(/^water\s*>\s*(three|five)$/);
    if (waterMatch) {
        const target = waterMatch[1];
        const max = jugLimits[target];
        virtualFiles[target] = WATER_CHAR.repeat(max);
        return null; // silent
    }
    // pour five > three or pour three > five
    const jugMatch = args.match(/^(three|five)\s*>\s*(three|five)$/);
    if (jugMatch) {
        const source = jugMatch[1];
        const target = jugMatch[2];
        if (source === target) {
            return `Cannot pour from ${source} to itself.`;
        }
        const sourceAmount = (virtualFiles[source].match(/\~/g) || []).length;
        const targetAmount = (virtualFiles[target].match(/\~/g) || []).length;
        const targetMax = jugLimits[target];
        const space = targetMax - targetAmount;
        const toPour = Math.min(space, sourceAmount);
        if (toPour > 0) {
            virtualFiles[target] += WATER_CHAR.repeat(toPour);
            virtualFiles[target] = virtualFiles[target].slice(0, targetMax);
            virtualFiles[source] = virtualFiles[source].slice(0, sourceAmount - toPour);
            return null; // silent
        } else {
            return `Nothing to pour from ${source} to ${target}.`;
        }
    }
    // pour water (finite stream)
    if (args === 'water') {
        return WATER_CHAR.repeat(10000);
    }
    return 'usage: pour water > three\n   or: pour five > three';
} 