export function keypad(args, virtualFiles) {
    if (!args) {
        return (
            `┌───────────────┐
│  ┌───┬───┬───┐ │
│  │ 1 │ 2 │ 3 │ │
│  ├───┼───┼───┤ │
│  │ 4 │ 5 │ 6 │ │
│  ├───┼───┼───┤ │
│  │ 7 │ 8 │ 9 │ │
│  ├───┴───┴───┤ │
│  │   0   ⏎   │ │
│  └───────────┘ │
└───────────────┘`
        );
    } else {
        const code = args.trim();
        if (window._ctf_keypad_code && code === window._ctf_keypad_code) {
            // Construct the flag in memory
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
} 