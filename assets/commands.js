// Combined command logic for the CTF challenge
// All functions are attached to the global scope

// Usage/help strings
window.USAGE = {
    pour: 'usage:\tpour water > three\n\tpour three > five',
    measure: 'usage:\tmeasure [object]',
    empty: 'usage:\tempty [three|five]',
    cat: 'usage:\tcat [file]',
    keypad: 'usage:\tkeypad <code>'
};

// ls command
window.ls = function (virtualFiles) {
    return Object.keys(virtualFiles).join('  ');
};

// cat command
window.cat = function (args, virtualFiles) {
    if (!args) {
        return window.USAGE.cat;
    }
    const file = args.trim();
    if (file in virtualFiles) {
        return virtualFiles[file];
    }
    return `cat: ${file}: No such file`;
};

// pour command
window.pour = function (args, virtualFiles, jugLimits) {
    const WATER_CHAR = '~';
    const jugLimitsML = { three: 3000, five: 5000 };
    const jugRows = { three: 3, five: 5 };
    if (!args) {
        return window.USAGE.pour;
    }
    const waterMatch = args.match(/^water\s*>\s*(three|five)$/);
    if (waterMatch) {
        const target = waterMatch[1];
        const max = jugLimitsML[target];
        virtualFiles[target] = WATER_CHAR.repeat(max);
        return window.asciiJars(virtualFiles, jugLimitsML, jugRows, [target]);
    }
    const jugMatch = args.match(/^(three|five)\s*>\s*(three|five)$/);
    if (jugMatch) {
        const source = jugMatch[1];
        const target = jugMatch[2];
        if (source === target) {
            return `Cannot pour from ${source} to itself.`;
        }
        const sourceAmount = (virtualFiles[source].match(/~/g) || []).length;
        const targetAmount = (virtualFiles[target].match(/~/g) || []).length;
        const targetMax = jugLimitsML[target];
        const space = targetMax - targetAmount;
        const toPour = Math.min(space, sourceAmount);
        if (toPour > 0) {
            virtualFiles[target] += WATER_CHAR.repeat(toPour);
            virtualFiles[target] = virtualFiles[target].slice(0, targetMax);
            virtualFiles[source] = virtualFiles[source].slice(0, sourceAmount - toPour);
            return window.asciiJars(virtualFiles, jugLimitsML, jugRows, [source, target]);
        } else {
            return `Nothing to pour from ${source} to ${target}.`;
        }
    }
    if (args === 'water') {
        return Array.from({ length: 30 }, () => WATER_CHAR.repeat(50)).join('\n');
    }
    return window.USAGE.pour;
};

window.asciiJars = function (virtualFiles, jugLimitsML, jugRows, jugsToShow) {
    return jugsToShow.map(jug =>
        window.asciiJar(jug, virtualFiles[jug], jugLimitsML[jug], jugRows[jug])
    ).join('\n\n');
};

window.asciiJar = function (name, content, maxML, rows) {
    const amount = (content.match(/~/g) || []).length;
    let jar = `  ${name} (${amount} mL / ${maxML} mL)\n`;
    for (let i = rows; i > 0; i--) {
        const threshold = (i - 1) * 1000;
        if (amount > threshold) {
            jar += '|~~~~~|\n';
        } else {
            jar += '|     |\n';
        }
    }
    jar += '+-----+';
    return jar;
};

// measure command (flag1/flag2 logic should be added here as needed)
window.measure = function (args, virtualFiles) {
    // Placeholder: you should copy your actual measure logic here
    return 'measure command not yet implemented in combined file.';
};

// empty command
window.empty = function (args, virtualFiles) {
    if (!args) {
        return window.USAGE.empty;
    }
    const jug = args.trim();
    if (jug === 'three' || jug === 'five') {
        virtualFiles[jug] = '';
        return window.asciiJars(virtualFiles, { three: 3000, five: 5000 }, { three: 6, five: 10 });
    }
    return window.USAGE.empty;
};

// keypad command (placeholder)
window.keypad = function (args, virtualFiles) {
    if (!args) {
        return (
            `┌───────────────┐\n│  ┌───┬───┬───┐ │\n│  │ 1 │ 2 │ 3 │ │\n│  ├───┼───┼───┤ │\n│  │ 4 │ 5 │ 6 │ │\n│  ├───┼───┼───┤ │\n│  │ 7 │ 8 │ 9 │ │\n│  ├───┴───┴───┤ │\n│  │   0   ⏎   │ │\n│  └───────────┘ │\n└───────────────┘`
        );
    } else {
        const code = args.trim();
        if (window._ctf_keypad_code && code === window._ctf_keypad_code) {
            const flag = ['C', 'T', 'F', '{', 't', 'h', 'e', '-', 'o', 'n', 'l', 'y', '-', 'w', 'a', 'y', '-', 'o', 'u', 't', '-', 'i', 's', '-', 't', 'h', 'r', 'o', 'u', 'g', 'h', '}'].join('');
            return (
                "You've unlocked the room. Great job and thanks for playing.\n" +
                `FLAG: ${flag}\n` +
                `   _________\n  |         |\n  |  OPEN   |\n  |  DOOR   |\n  |         |\n  |    __   |\n  |   |  |  |\n  |   |  |  |\n  |   |  |  |\n  |___|__|__|`
            );
        } else {
            return (
                `┌───────────────┐\n│   🔔 INCORRECT CODE! │\n└───────────────┘`
            );
        }
    }
}; 