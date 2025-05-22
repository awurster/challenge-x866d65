export function ls(virtualFiles) {
    return Object.keys(virtualFiles).join('  ');
} 