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

// Helper functions for flag1 obfuscation
function rot13(str) {
    return str.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode(
            (c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
        );
    });
}
function base64Decode(str) {
    if (typeof atob !== 'undefined') {
        return atob(str);
    } else {
        return Buffer.from(str, 'base64').toString('binary');
    }
}
function getFlag1() {
    // ROT13 then base64 of the flag
    const b64 = 'PGS{sbhg-yvgref-vf-whfg-evtug}';
    const rot = base64Decode(b64);
    return rot13(rot);
}

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
    const filesToCheck = Object.keys(virtualFiles);
    let output = '';
    const jugLimitsML = { three: 3000, five: 5000 };
    const jugRows = { three: 3, five: 5 };
    function padTo16(str) {
        if (str.length < 16) return str.padEnd(16, '0');
        if (str.length > 16) return str.slice(0, 16);
        return str;
    }
    function getSessionIP() {
        return window._ctf_session_ip || '127.0.0.1';
    }
    if (!args || !args.trim()) {
        // List all files and their water content
        output = filesToCheck.map(f => `${f}: ${(virtualFiles[f].match(/~/g) || []).length} mL`).join('\n');
        // Show all jugs
        return output + '\n' + window.asciiJars(virtualFiles, jugLimitsML, jugRows, ['three', 'five']);
    } else {
        const file = args.trim();
        if (filesToCheck.includes(file)) {
            const count = (virtualFiles[file].match(/~/g) || []).length;
            if (file === 'five' && count === 4000) {
                // Create the 'four' file if not present
                if (!('four' in virtualFiles)) {
                    // Generate random 8-digit code
                    const code = String(Math.floor(10000000 + Math.random() * 90000000));
                    window._ctf_keypad_code = code;
                    // Encrypt code with AES-128-CBC
                    const key = padTo16(window._ctf_session_username);
                    const iv = CryptoJS.MD5(getSessionIP());
                    const encrypted = CryptoJS.AES.encrypt(code, CryptoJS.enc.Utf8.parse(key), {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    }).ciphertext.toString(CryptoJS.enc.Base64);
                    virtualFiles['four'] = `# At the bottom of this container is a note.\n# Decrypt the value of the note to find the keypad code and unlock the door.\n-----BEGIN AES CIPHERTEXT-----\n${encrypted}\n-----END AES CIPHERTEXT-----`;
                }
                output = `five: 4000 mL\nFLAG: ${getFlag1()}`;
            } else {
                output = `${file}: ${count} mL`;
            }
            if (file === 'three' || file === 'five') {
                return output + '\n' + window.asciiJars(virtualFiles, jugLimitsML, jugRows, [file]);
            }
            return output;
        } else {
            output = `measure: ${file}: No such file`;
            return output;
        }
    }
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
                `\n┌──────────────────────┐\n|| 🔔 INCORRECT CODE! |│\n└──────────────────────┘\n
                 `
            );
        }
    }
}; 