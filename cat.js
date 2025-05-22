export function cat(args, virtualFiles) {
    if (!args) {
        return 'usage: cat [file]';
    }
    const file = args.trim();
    if (file in virtualFiles) {
        return virtualFiles[file];
    }
    return `cat: ${file}: No such file`;
} 