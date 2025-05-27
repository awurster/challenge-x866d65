import { USAGE } from './usage.js';

export function pour(args, virtualFiles, jugLimits) {
    const WATER_CHAR = '~';
    // 1 '~' = 1 mL in jug content
    const jugLimitsML = { three: 3000, five: 5000 };
    const jugRows = { three: 3, five: 5 };
    if (!args) {
        return USAGE.pour;
    }
    // pour water > three or pour water > five
    const waterMatch = args.match(/^water\s*>\s*(three|five)$/);
    if (waterMatch) {
        const target = waterMatch[1];
        const max = jugLimitsML[target]; // 3000 for three, 5000 for five
        virtualFiles[target] = WATER_CHAR.repeat(max); // Fill to max
        return asciiJars(virtualFiles, jugLimitsML, jugRows, [target]);
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
        const targetMax = jugLimitsML[target];
        const space = targetMax - targetAmount;
        const toPour = Math.min(space, sourceAmount);
        if (toPour > 0) {
            virtualFiles[target] += WATER_CHAR.repeat(toPour);
            virtualFiles[target] = virtualFiles[target].slice(0, targetMax);
            virtualFiles[source] = virtualFiles[source].slice(0, sourceAmount - toPour);
            return asciiJars(virtualFiles, jugLimitsML, jugRows, [source, target]);
        } else {
            return `Nothing to pour from ${source} to ${target}.`;
        }
    }
    // pour water (finite stream)
    if (args === 'water') {
        // Print 30 full lines of 50 '~' for dramatic effect
        return Array.from({ length: 30 }, () => WATER_CHAR.repeat(50)).join('\n');
    }
    return USAGE.pour;
}

export function asciiJars(virtualFiles, jugLimitsML, jugRows, jugsToShow) {
    // Returns a string with ASCII art for the specified jugs
    return jugsToShow.map(jug =>
        asciiJar(jug, virtualFiles[jug], jugLimitsML[jug], jugRows[jug])
    ).join('\n\n');
}

export function asciiJar(name, content, maxML, rows) {
    // 1 row = 1L = 1000mL
    const amount = (content.match(/~/g) || []).length; // in mL
    const liters = maxML / 1000;
    let jar = `  ${name} (${amount} mL / ${maxML} mL)\n`;
    for (let i = rows; i > 0; i--) {
        // Each row is filled if that liter is present
        const threshold = (i - 1) * 1000;
        if (amount > threshold) {
            jar += '|~~~~~|\n';
        } else {
            jar += '|     |\n';
        }
    }
    jar += '+-----+';
    return jar;
} 