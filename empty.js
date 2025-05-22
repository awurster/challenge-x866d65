export function empty(args, virtualFiles) {
    if (!args) {
        return 'usage: empty [three|five]';
    }
    const jug = args.trim();
    if (jug === 'three' || jug === 'five') {
        virtualFiles[jug] = '';
        return null; // silent
    }
    return 'usage: empty [three|five]';
} 