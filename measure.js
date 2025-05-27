import { asciiJars } from './pour.js';
import { getFlag1 } from './flag1.js';

function padTo16(str) {
    if (str.length < 16) return str.padEnd(16, '0');
    if (str.length > 16) return str.slice(0, 16);
    return str;
}

function getSessionIP() {
    return window._ctf_session_ip || '127.0.0.1';
}

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
                    virtualFiles['four'] = `# Decrypt the value below to find the keypad code\n${encrypted}`;
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