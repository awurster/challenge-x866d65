export function keypad(args, virtualFiles) {
    if (!args) {
        return (
            `
┌────────────────┐
│  ┌───┬───┬───┐ │
│  │ 1 │ 2 │ 3 │ │
│  ├───┼───┼───┤ │
│  │ 4 │ 5 │ 6 │ │
│  ├───┼───┼───┤ │
│  │ 7 │ 8 │ 9 │ │
│  ├───┴───┴───┤ │
│  │   0   ⏎   │ │
│  └───────────┘ │
└────────────────┘`
        );
    } else {
        const code = args.trim();
        if (code === '77777777') {
            return (
                "You've unlocked the room. Great job and thanks for playing.\n" +
                `
  ___________
  |         |
  |  TTFN!  |
  |         |
  |         |
  |    __   |
  |   |  |  |
  |   |  |  |
  |   |  |  |
  |___|__|__|`
            );
        } else {
            return (
                `
   .-"""-.
  / .===. \
  \/ o o \/
  ( \___/ )
___ooo__ooo___
| INCORRECT  |
|____CODE!___|`
            );
        }
    }
} 