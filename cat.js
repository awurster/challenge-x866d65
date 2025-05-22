export function cat(args) {
    if (args.trim() === 'challenge.txt') {
        return `Welcome to the CTF Terminal Challenge!\n\nTo get started, try exploring your environment with commands like 'ls' and 'cat'.\n\n---\n\nYou find yourself in a room with a bomb and two water jugs. One holds exactly 5 liters, the other 3 liters. The bomb will only be defused if you place exactly 4 liters of water on the scale. You have unlimited water, but no measuring marks except the jugs themselves.\n\nCan you figure out how to measure exactly 4 liters?\n\n(Type 'ls' to see what files are here, and 'cat challenge.txt' to read this message again!)`;
    }
    return `cat: ${args}: No such file`;
} 