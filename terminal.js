import { ls } from './ls.js';
import { cat } from './cat.js';
import { pour } from './pour.js';
import { measure } from './measure.js';
import { empty } from './empty.js';

const jugLimits = { three: 3000, five: 5000 };
const virtualFiles = {
    'challenge.txt': `Welcome to the CTF Terminal Challenge!

To get started, try exploring your environment with commands like 'ls' and 'cat'.

---

You find yourself in a room with a bomb and two water jugs. One holds exactly 5 liters, the other 3 liters. The bomb will only be defused if you place exactly 4 liters of water on the scale. You have unlimited water, but no measuring marks except the jugs themselves.

Can you figure out how to measure exactly 4 liters?

(Type 'ls' to see what files are here, and 'cat challenge.txt' to read this message again!)`,
    three: '',
    five: ''
};

const terminalContainer = document.getElementById('terminal-container');

let commandHistory = [];
let historyIndex = -1;

const COMMANDS = ['pour', 'measure', 'cat', 'ls', 'empty', 'help', 'about', 'clear'];
const FILES = ['challenge.txt', 'three', 'five', 'four'];

function createLine(prompt = '$', inputValue = '', isInput = true) {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    const promptSpan = document.createElement('span');
    promptSpan.className = 'terminal-prompt';
    promptSpan.textContent = isInput ? prompt : '';
    line.appendChild(promptSpan);

    if (isInput) {
        const input = document.createElement('input');
        input.className = 'terminal-input';
        input.value = inputValue;
        input.autofocus = true;
        input.spellcheck = false;
        input.addEventListener('keydown', handleInput);
        input.addEventListener('keydown', handleHistory);
        line.appendChild(input);
        setTimeout(() => input.focus(), 10);
    } else {
        const output = document.createElement('span');
        output.className = 'terminal-output';
        output.textContent = inputValue;
        line.appendChild(output);
    }
    terminalContainer.appendChild(line);
    terminalContainer.scrollTop = terminalContainer.scrollHeight;
}

function handleHistory(e) {
    const input = e.target;
    if (e.key === 'ArrowUp') {
        if (commandHistory.length === 0) return;
        if (historyIndex === -1) historyIndex = commandHistory.length;
        if (historyIndex > 0) historyIndex--;
        input.value = commandHistory[historyIndex];
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        if (commandHistory.length === 0) return;
        if (historyIndex === -1) return;
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = -1;
            input.value = '';
        }
        e.preventDefault();
    } else if (e.key === 'Tab') {
        e.preventDefault();
        handleTabCompletion(input);
    }
}

function handleTabCompletion(input) {
    const value = input.value;
    const parts = value.split(/\s+/);
    // Complete command
    if (parts.length === 1) {
        const matches = COMMANDS.filter(cmd => cmd.startsWith(parts[0]));
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            createLine('$', matches.join('    '), false);
        }
    } else if (parts.length > 1) {
        // Complete file name for commands that take files
        const last = parts[parts.length - 1];
        const matches = FILES.filter(f => f.startsWith(last));
        if (matches.length === 1) {
            input.value = parts.slice(0, -1).join(' ') + ' ' + matches[0];
        } else if (matches.length > 1) {
            createLine('$', matches.join('    '), false);
        }
    }
}

function handleInput(e) {
    if (e.key === 'Enter') {
        const input = e.target;
        const command = input.value.trim();
        if (!command) {
            input.disabled = true;
            input.removeEventListener('keydown', handleInput);
            input.removeEventListener('keydown', handleHistory);
            createLine();
            return;
        }
        if (command) {
            commandHistory.push(command);
        }
        historyIndex = -1;
        input.disabled = true;
        input.removeEventListener('keydown', handleInput);
        input.removeEventListener('keydown', handleHistory);
        processCommand(command);
    }
}

async function showBannerAndWelcome() {
    // Small ASCII Art Banner (Aquarius/waves)
    const banner =
        `   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~
    ~  ~  ~  ~  ~  ~  ~  ~  ~  ~

   The Water Jug Problem
`;
    createLine('', banner, false);
    // Fetch IP
    let ip = '127.0.0.1';
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
    } catch (e) {
        // fallback to localhost
    }
    // Realistic login message
    const now = new Date();
    const dateStr = now.toDateString().split(' ').slice(1).join(' ');
    const timeStr = now.toTimeString().split(' ')[0];
    const username = getSessionUsername();
    const loginMsg = `Last login: ${dateStr} ${timeStr} from ${ip}\nWelcome, ${username}. You are logging in from: ${ip}`;
    createLine('', loginMsg, false);
    createLine('$', 'Type "help" to get started.', false);
    createLine();
}

function processCommand(cmd) {
    let output = '';
    // Usage for 'pour', 'measure', and 'empty' with no args
    if (cmd === 'pour') {
        output = 'usage: pour water\n   pour water > three';
        createLine('', output, false);
        createLine();
        return;
    }
    if (cmd === 'measure') {
        output = 'usage: measure [file]';
        createLine('', output, false);
        createLine();
        return;
    }
    if (cmd === 'empty') {
        output = 'usage: empty [three|five]';
        createLine('', output, false);
        createLine();
        return;
    }
    // Handle pour water > three or pour water > five
    if (/^pour\s+water\s*>\s*(three|five)$/.test(cmd)) {
        const target = cmd.match(/^pour\s+water\s*>\s*(three|five)$/)[1];
        const max = jugLimits[target];
        virtualFiles[target] = '~'.repeat(max);
        createLine();
        return;
    }
    // Handle pouring between jugs
    if (/^pour\s+(three|five)\s*>\s*(three|five)$/.test(cmd)) {
        const [, source, target] = cmd.match(/^pour\s+(three|five)\s*>\s*(three|five)$/);
        if (source === target) {
            output = `Cannot pour from ${source} to itself.`;
            createLine('$', output, false);
            createLine();
            return;
        } else {
            const sourceAmount = (virtualFiles[source].match(/~/g) || []).length;
            const targetAmount = (virtualFiles[target].match(/~/g) || []).length;
            const targetMax = jugLimits[target];
            const space = targetMax - targetAmount;
            const toPour = Math.min(space, sourceAmount);
            if (toPour > 0) {
                virtualFiles[target] += '~'.repeat(toPour);
                virtualFiles[target] = virtualFiles[target].slice(0, targetMax);
                virtualFiles[source] = virtualFiles[source].slice(0, sourceAmount - toPour);
                createLine();
                return;
            } else {
                output = `Nothing to pour from ${source} to ${target}.`;
                createLine('$', output, false);
                createLine();
                return;
            }
        }
    }
    // Simulate finite water stream
    if (/^pour\s+water$/.test(cmd)) {
        output = '~'.repeat(10000);
        createLine('$', output, false);
        createLine();
        return;
    }
    // Handle empty command
    if (/^empty\s+(three|five)$/.test(cmd)) {
        const jug = cmd.split(' ')[1];
        virtualFiles[jug] = '';
        createLine();
        return;
    }
    const [command, ...argsArr] = cmd.split(' ');
    const args = argsArr.join(' ');
    switch (command) {
        case 'help':
            output = 'Available commands: help, clear, about, ls, cat, pour, measure, empty';
            break;
        case 'about':
            output = 'Welcome to the CTF Terminal Challenge!';
            break;
        case 'clear':
            terminalContainer.innerHTML = '';
            createLine();
            return;
        case 'flag':
            output = 'No flag for you... yet!';
            break;
        case 'ls':
            output = ls(virtualFiles);
            if (output) {
                createLine('', output, false);
            }
            createLine();
            return;
        case 'cat':
            output = cat(args, virtualFiles);
            if (output) {
                createLine('', output, false);
            }
            createLine();
            return;
        case 'pour':
            output = pour(args, virtualFiles, jugLimits);
            if (output) {
                createLine('', output, false);
            }
            createLine();
            return;
        case 'measure':
            output = measure(args, virtualFiles);
            if (output) {
                createLine('', output, false);
            }
            createLine();
            return;
        case 'empty':
            output = empty(args, virtualFiles);
            if (output) {
                createLine('', output, false);
            }
            createLine();
            return;
        default:
            output = `Command not found: ${cmd} `;
    }
    createLine('$', output, false);
    createLine();
}

// Initial greeting
showBannerAndWelcome();

// Generate a session token (simple example: random hex)
function getSessionToken() {
    if (!window._ctf_session_token) {
        window._ctf_session_token = [...crypto.getRandomValues(new Uint8Array(8))].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return window._ctf_session_token;
}

// Generate a session username like ColorfulLion25
function getSessionUsername() {
    if (!window._ctf_session_username) {
        const colors = [
            'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Silver', 'Golden', 'Aqua', 'Teal', 'Crimson', 'Indigo', 'Violet', 'Amber', 'Emerald', 'Cyan', 'Magenta', 'Lime', 'Coral', 'Azure', 'Ivory', 'Lavender', 'Bronze', 'Scarlet', 'Turquoise', 'Mint', 'Peach', 'Olive', 'Maroon', 'Navy', 'Charcoal', 'Platinum', 'Ruby', 'Sapphire', 'Jade', 'Copper', 'Pearl', 'Onyx', 'Topaz', 'Quartz', 'Opal', 'Slate', 'Rose', 'Sand', 'Moss', 'Sky', 'Snow', 'Shadow', 'Sun', 'Frost'
        ];
        const animals = [
            'Lion', 'Tiger', 'Bear', 'Wolf', 'Fox', 'Eagle', 'Hawk', 'Falcon', 'Panther', 'Leopard', 'Jaguar', 'Cheetah', 'Cougar', 'Lynx', 'Otter', 'Badger', 'Moose', 'Bison', 'Buffalo', 'Horse', 'Stag', 'Ram', 'Goat', 'Sheep', 'Dog', 'Cat', 'Rabbit', 'Hare', 'Swan', 'Crane', 'Heron', 'Dove', 'Raven', 'Crow', 'Owl', 'Shark', 'Whale', 'Dolphin', 'Seal', 'Penguin', 'Lizard', 'Gecko', 'Frog', 'Toad', 'Turtle', 'Hedgehog', 'Bat', 'Mole', 'Squirrel', 'Mouse', 'Rat'
        ];
        function pick(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
        const number = Math.floor(Math.random() * 90) + 10; // 10-99
        window._ctf_session_username = `${pick(colors)}${pick(animals)}${number}`;
    }
    return window._ctf_session_username;
}
