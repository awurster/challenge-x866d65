// Returns the first flag, obfuscated with ROT13 then base64
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

export function getFlag1() {
    const b64 = 'PGS{sbhg-yvgref-vf-whfg-evtug}';
    const rot = base64Decode(b64);
    return rot13(rot);
} 