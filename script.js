/* Terminal Logic */

const fileSystem = {
    "about.txt": "I am a student at CentraleSupélec, passionate about software engineering and building innovative solutions. I love turning complex problems into simple, beautiful, and intuitive designs.",
    "contact.txt": "Email: theophile.raybaud@student-cs.fr\nGitHub: https://github.com/123YAP\nLinkedIn: https://www.linkedin.com/in/théophile-raybaud",
    "projects": {
        type: "directory",
        files: {
            "ecocart": {
                type: "executable",
                desc: "A collaborative shopping list app with carbon footprint tracking.",
                links: [
                    { text: "View Code (GitLab)", url: "https://gitlab-student.centralesupelec.fr/theophile.raybaud/projet_courses" },
                    { text: "Download APK", url: "Greencart.apk", download: true }
                ]
            },
            "autonomous_robot": {
                type: "executable",
                desc: "Maze navigation robot using Raspberry Pi, Arduino, and OpenCV.",
                links: [
                    { text: "View Code (GitLab)", url: "https://gitlab-student.centralesupelec.fr/noam.fauverte/ei-st5-vehicules-autonomes" }
                ]
            },
            "portfolio": {
                type: "executable",
                desc: "This interactive terminal website.",
                links: [
                    { text: "View Code (GitHub)", url: "https://github.com/123YAP/123YAP.github.io" }
                ]
            }
        }
    },
    "skills.txt": "Languages: Python, JavaScript, C++, HTML/CSS\nTools: Git, Docker, Linux, VS Code\nInterests: AI, Web Development, Robotics",
    "secret.txt": "You found the secret file! nothing here though :)"
};

const asciiArt = `
  _______ _       __           _     _ _      
 |__   __| |      \\ \\         | |   (_) |     
    | |  | |__  ___\\ \\  _ __  | |__  _| | ___ 
    | |  | '_ \\/ _ \\\\ \\| '_ \\ | '_ \\| | |/ _ \\
    | |  | | | |  __// / |_) || | | | | |  __/
    |_|  |_| |_|\\___/_/| .__/ |_| |_|_|_|\\___|
                       | |                    
                       |_|                    
`;

const commands = {
    help: "Available commands:\n  help      - Show this help message\n  ls        - List files and directories\n  cat [file]- Read a file\n  cd [dir]  - Change directory\n  open [prj]- Open a project link\n  clear     - Clear the terminal\n  whoami    - Display user info\n  gui       - Toggle GUI mode (Coming Soon)\n  date      - Show current date/time",
    whoami: "User: Guest\nRole: Visitor\nSystem: TheoOS v1.0",
    gui: "GUI mode is currently under maintenance. Real engineers use the terminal anyway ;)",
    date: () => new Date().toString()
};

let currentPath = []; // [] = root, ['projects'] = inside projects

// Init
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('cmd-input');
    const output = document.getElementById('output');
    const terminal = document.getElementById('terminal');
    const pathDisplay = document.getElementById('path-display');

    let commandHistory = [];
    let historyIndex = -1;

    // Focus input on click anywhere
    document.addEventListener('click', () => input.focus());
    input.focus();

    // Boot Sequence
    setTimeout(() => typeWriter(output, "Initializing TheoOS kernel...\n"), 100);
    setTimeout(() => typeWriter(output, "Loading assets...\n"), 800);
    setTimeout(() => typeWriter(output, "Mounting file system...\n"), 1500);
    setTimeout(() => {
        output.innerHTML = ""; // Clear boot logs
        const banner = document.createElement('div');
        banner.className = 'ascii-art';
        banner.textContent = asciiArt;
        output.appendChild(banner);
        printLine("Welcome to Théophile Raybaud's Portfolio v2.0", "accent");
        printLine("Type 'help' to see available commands.", "highlight");
        printLine("");
    }, 2500);

    // Input Handling
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmdRaw = input.value.trim();
            if (cmdRaw) {
                commandHistory.push(cmdRaw);
                historyIndex = commandHistory.length;
                printLine(`user@123yap:${getPathString()}$ ${cmdRaw}`, "cmd-color");
                processCommand(cmdRaw);
            } else {
                printLine(`user@123yap:${getPathString()}$`, "cmd-color");
            }
            input.value = '';
            scrollToBottom();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            handleTabCompletion(input.value);
        }
    });

    function getPathString() {
        return currentPath.length === 0 ? '~' : '~/' + currentPath.join('/');
    }

    function updatePrompt() {
        pathDisplay.textContent = getPathString();
    }

    function getDirContent(pathArr) {
        let current = fileSystem;
        for (const p of pathArr) {
            if (current[p] && current[p].type === 'directory') {
                current = current[p].files;
            } else if (current.files) { // Safety for weird structure
                 current = current.files;
            } else {
                return null;
            }
        }
        return current;
    }

    function processCommand(raw) {
        const parts = raw.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (commands[cmd]) {
            const response = typeof commands[cmd] === 'function' ? commands[cmd]() : commands[cmd];
            printLine(response);
            return;
        }

        switch (cmd) {
            case 'clear':
                output.innerHTML = '';
                break;
            case 'ls':
                const dir = getDirContent(currentPath);
                if (dir) {
                    const grid = document.createElement('div');
                    grid.className = 'ls-grid';
                    Object.keys(dir).forEach(key => {
                        const item = dir[key];
                        const span = document.createElement('span');
                        span.textContent = key;
                        if (typeof item === 'string') span.className = 'file';
                        else if (item.type === 'directory') span.className = 'directory';
                        else if (item.type === 'executable') span.className = 'executable';
                        grid.appendChild(span);
                    });
                    output.appendChild(grid);
                } else {
                    printLine("Error: Cannot read directory.", "error");
                }
                break;
            case 'cd':
                if (!args[0] || args[0] === '~') {
                    currentPath = [];
                } else if (args[0] === '..') {
                    currentPath.pop();
                } else {
                    const target = args[0];
                    const currentDir = getDirContent(currentPath);
                    if (currentDir[target] && currentDir[target].type === 'directory') {
                        currentPath.push(target);
                    } else {
                        printLine(`cd: ${target}: No such directory`, "error");
                    }
                }
                updatePrompt();
                break;
            case 'cat':
                if (!args[0]) {
                    printLine("Usage: cat [filename]", "highlight");
                    return;
                }
                const currentDirCat = getDirContent(currentPath);
                const file = currentDirCat[args[0]];
                if (file) {
                    if (typeof file === 'string') {
                        printLine(file);
                    } else if (file.type === 'executable') {
                        printLine(`Binary file ${args[0]} matches. Description:`, "highlight");
                        printLine(file.desc);
                        printLine("Use 'open " + args[0] + "' to view/download.", "accent");
                    } else {
                        printLine(`cat: ${args[0]}: Is a directory`, "error");
                    }
                } else {
                    printLine(`cat: ${args[0]}: No such file`, "error");
                }
                break;
            case 'open':
                if (!args[0]) {
                    printLine("Usage: open [project_name]", "highlight");
                    return;
                }
                const currentDirOpen = getDirContent(currentPath);
                const targetPrj = currentDirOpen[args[0]];
                
                // Support opening if we are at root but project is deep? No, stick to current path logic or simplify.
                // Let's search in projects if not found in current.
                let foundPrj = targetPrj;
                if (!foundPrj && currentPath.length === 0 && fileSystem.projects.files[args[0]]) {
                     foundPrj = fileSystem.projects.files[args[0]];
                }

                if (foundPrj && foundPrj.type === 'executable') {
                    printLine(`Opening ${args[0]}...`, "accent");
                    foundPrj.links.forEach(link => {
                        const a = document.createElement('a');
                        a.href = link.url;
                        a.textContent = `[${link.text}]`;
                        a.className = 'link';
                        a.target = '_blank';
                        if (link.download) a.setAttribute('download', '');
                        output.appendChild(a);
                        output.appendChild(document.createElement('br'));
                        // Auto click first link? No, let user click.
                    });
                } else {
                     printLine(`open: ${args[0]}: Project not found (Try 'cd projects' first?)`, "error");
                }
                break;
            default:
                printLine(`Command not found: ${cmd}`, "error");
                break;
        }
    }

    function printLine(text, className = "") {
        const div = document.createElement('div');
        div.className = 'output-line ' + className;
        div.textContent = text;
        output.appendChild(div);
    }

    function typeWriter(container, text, i = 0) {
        if (i < text.length) {
            container.innerHTML += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(container, text, i), 20);
        } else {
            scrollToBottom();
        }
    }

    function scrollToBottom() {
        terminal.scrollTop = terminal.scrollHeight;
    }

    function handleTabCompletion(currentVal) {
        const parts = currentVal.split(' ');
        const lastPart = parts[parts.length - 1];
        const currentDir = getDirContent(currentPath);
        
        const matches = Object.keys(currentDir).filter(k => k.startsWith(lastPart));
        
        if (matches.length === 1) {
            parts[parts.length - 1] = matches[0];
            input.value = parts.join(' ');
        } else if (matches.length > 1) {
            printLine(matches.join('  '), "highlight");
        }
    }
});
