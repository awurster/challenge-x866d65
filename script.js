const terminalContainer = document.getElementById('terminal-container');

function createLine(prompt = '$', inputValue = '', isInput = true) {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    const promptSpan = document.createElement('span');
    promptSpan.className = 'terminal-prompt';
    promptSpan.textContent = prompt;
    line.appendChild(promptSpan);

    if (isInput) {
        const input = document.createElement('input');
        input.className = 'terminal-input';
        input.value = inputValue;
        input.autofocus = true;
        input.spellcheck = false;
        input.addEventListener('keydown', handleInput);
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

function handleInput(e) {
    if (e.key === 'Enter') {
        const input = e.target;
        const command = input.value.trim();
        input.disabled = true;
        input.removeEventListener('keydown', handleInput);
        processCommand(command);
    }
}

function processCommand(cmd) {
    let output = '';
    switch (cmd) {
        case 'help':
            output = 'Available commands: help, clear, about, ls, cat';
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
            output = 'challenge.txt';
            break;
        case 'cat challenge.txt':
            output = `Welcome to the CTF Terminal Challenge!\n\nTo get started, try exploring your environment with commands like 'ls' and 'cat'.\n\n---\n\nHomage to Die Hard 3:\n\nYou find yourself in a room with a bomb and two water jugs. One holds exactly 5 liters, the other 3 liters. The bomb will only be defused if you place exactly 4 liters of water on the scale. You have unlimited water, but no measuring marks except the jugs themselves.\n\nCan you figure out how to measure exactly 4 liters?\n\n(Type 'ls' to see what files are here, and 'cat challenge.txt' to read this message again!)`;
            break;
        default:
            output = `Command not found: ${cmd}`;
    }
    createLine('$', output, false);
    createLine();
}

// Initial greeting
createLine('$', 'Type "help" to get started.', false);
createLine();
