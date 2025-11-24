/* --- TERMINAL LOGIC --- */

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
    help: "Available commands:\n  help      - Show this help message\n  ls        - List files and directories\n  cat [file]- Read a file\n  cd [dir]  - Change directory\n  open [prj]- Open a project link\n  clear     - Clear the terminal\n  whoami    - Display user info\n  gui       - Switch to Graphic User Interface\n  date      - Show current date/time",
    whoami: "User: Guest\nRole: Visitor\nSystem: TheoOS v1.0",
    gui: () => {
        toggleGUI(true);
        return "Starting GUI environment...";
    },
    date: () => new Date().toString()
};

let currentPath = []; 

/* --- GUI LOGIC --- */

const translations = {
    en: {
        nav: { home: "Home", about: "About", projects: "Projects", contact: "Contact" },
        hero: { title_prefix: "Hi, I'm", subtitle: "Engineering Student & Developer", cta_primary: "View My Work", cta_secondary: "Contact Me" },
        about: { title: "About Me", content: "I am a student at CentraleSupélec, passionate about software engineering and building innovative solutions." },
        projects: {
            title: "Projects",
            ecocart: { desc: "A collaborative shopping list application designed to streamline household organization and encourage an active reflexion about the carbon impact of our groceries. Features real-time updates and user-friendly interface.", tags: ["Web Dev", "Full Stack"] },
            robot: { title: "Autonomous Navigation Robot", desc: "A system for autonomous maze navigation using a Raspberry Pi and Arduino. Features computer vision (line tracking, intersection detection), BFS pathfinding, and obstacle avoidance with IR sensors.", tags: ["Python/OpenCV", "Robotics", "C++/Arduino"] },
            portfolio: { title: "Portfolio Website", desc: "This website! A modern, responsive portfolio built with HTML, CSS, and JavaScript.", tags: ["HTML/CSS", "Design"] },
            view_code: "View Code", download_apk: "Download APK"
        },
        contact: { title: "Get In Touch", desc: "Interested in working together or just want to say hi?", built_with: "Built with creativity." }
    },
    fr: {
        nav: { home: "Accueil", about: "À propos", projects: "Projets", contact: "Contact" },
        hero: { title_prefix: "Salut, je suis", subtitle: "Étudiant Ingénieur & Développeur", cta_primary: "Voir mon travail", cta_secondary: "Me contacter" },
        about: { title: "À propos de moi", content: "Je suis étudiant à CentraleSupélec, passionné par le génie logiciel et la création de solutions innovantes." },
        projects: {
            title: "Projets",
            ecocart: { desc: "Une application de liste de courses collaborative conçue pour simplifier l'organisation du foyer et encourager une réflexion active sur l'impact carbone de nos achats. Fonctionnalités de mise à jour en temps réel et interface conviviale.", tags: ["Dév Web", "Full Stack"] },
            robot: { title: "Robot de Navigation Autonome", desc: "Un système de navigation autonome dans un labyrinthe utilisant Raspberry Pi et Arduino. Fonctionnalités de vision par ordinateur (suivi de ligne, détection d'intersections), pathfinding BFS et évitement d'obstacles avec capteurs IR.", tags: ["Python/OpenCV", "Robotique", "C++/Arduino"] },
            portfolio: { title: "Site Portfolio", desc: "Ce site web ! Un portfolio moderne et responsive construit avec HTML, CSS et JavaScript.", tags: ["HTML/CSS", "Design"] },
            view_code: "Voir le code", download_apk: "Télécharger l'APK"
        },
        contact: { title: "Me contacter", desc: "Intéressé par une collaboration ou juste pour dire bonjour ?", built_with: "Fait avec créativité." }
    }
};

// Shared/Global Init
document.addEventListener('DOMContentLoaded', () => {
    initTerminal();
    initGUI();
});

function toggleGUI(show) {
    const termDiv = document.getElementById('terminal');
    const guiDiv = document.getElementById('gui-view');
    const body = document.body;

    if (show) {
        termDiv.classList.add('hidden');
        guiDiv.classList.remove('hidden');
        body.classList.add('gui-mode');
        // Re-trigger scroll reveal for GUI elements
        scrollReveal();
    } else {
        guiDiv.classList.add('hidden');
        termDiv.classList.remove('hidden');
        body.classList.remove('gui-mode');
        // Refocus terminal input
        document.getElementById('cmd-input').focus();
    }
}

/* --- TERMINAL FUNCTIONS --- */
function initTerminal() {
    const input = document.getElementById('cmd-input');
    const output = document.getElementById('output');
    const terminal = document.getElementById('terminal');
    const pathDisplay = document.getElementById('path-display');

    let commandHistory = [];
    let historyIndex = -1;

    document.addEventListener('click', (e) => {
        if (!document.body.classList.contains('gui-mode')) {
            input.focus();
        }
    });

    // Boot Sequence
    setTimeout(() => typeWriter(output, "Initializing TheoOS kernel...\n"), 100);
    setTimeout(() => typeWriter(output, "Loading assets...\n"), 800);
    setTimeout(() => typeWriter(output, "Mounting file system...\n"), 1500);
    setTimeout(() => {
        showBanner();
    }, 2500);

    function showBanner() {
        output.innerHTML = ""; 
        const banner = document.createElement('div');
        banner.className = 'ascii-art';
        banner.textContent = asciiArt;
        output.appendChild(banner);
        
        // Animated Welcome Line
        const welcomeLine = document.createElement('div');
        welcomeLine.className = 'output-line';
        welcomeLine.innerHTML = "Welcome to <span class='animated-text'>Théophile</span> Raybaud's Portfolio v2.0";
        output.appendChild(welcomeLine);

        printLine("Type 'help' to see available commands.", "highlight");
        printLine("Type 'gui' to switch to the graphical interface.", "accent");
        printLine("");
    }

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
            } else if (current.files) { 
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
            if (typeof response === 'string') printLine(response);
            return;
        }

        switch (cmd) {
            case 'clear':
                showBanner();
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
                    });
                } else {
                     printLine(`open: ${args[0]}: Project not found`, "error");
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
}

/* --- GUI FUNCTIONS --- */
function initGUI() {
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');

        if(burger) {
            burger.addEventListener('click', () => {
                nav.classList.toggle('nav-active');
                navLinks.forEach((link, index) => {
                    if (link.style.animation) link.style.animation = '';
                    else link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                });
                burger.classList.toggle('toggle');
            });
        }
    };

    const customCursor = () => {
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-outline');

        window.addEventListener('mousemove', (e) => {
            if (document.body.classList.contains('gui-mode')) {
                const posX = e.clientX;
                const posY = e.clientY;
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;
                cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
            }
        });
    };

    const languageHandler = () => {
        const langToggle = document.getElementById('lang-toggle');
        let currentLang = 'en';
        
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                currentLang = currentLang === 'en' ? 'fr' : 'en';
                langToggle.textContent = currentLang === 'en' ? 'FR' : 'EN';
                updateContent(currentLang);
            });
        }

        function updateContent(lang) {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const keys = key.split('.');
                let value = translations[lang];
                keys.forEach(k => { if (value) value = value[k]; });
                if (value) element.textContent = value;
            });

            // Specifics
            document.querySelector('.hero-title').innerHTML = `${translations[lang].hero.title_prefix} <span class="highlight">Théophile Raybaud</span>.`;
            document.querySelector('.hero-subtitle').textContent = translations[lang].hero.subtitle;
            const heroBtns = document.querySelectorAll('.hero-cta .btn');
            heroBtns[0].textContent = translations[lang].hero.cta_primary;
            heroBtns[1].textContent = translations[lang].hero.cta_secondary;

            // Ecocart
            document.querySelector('.project-card.featured .project-desc').textContent = translations[lang].projects.ecocart.desc;
            const ecocartTags = document.querySelectorAll('.project-card.featured .project-tags span');
            ecocartTags[0].textContent = translations[lang].projects.ecocart.tags[0];
            ecocartTags[1].textContent = translations[lang].projects.ecocart.tags[1];

            // Robot
            const robotCard = document.querySelectorAll('.project-card')[1];
            robotCard.querySelector('h3').textContent = translations[lang].projects.robot.title;
            robotCard.querySelector('.project-desc').textContent = translations[lang].projects.robot.desc;
            const robotTags = robotCard.querySelectorAll('.project-tags span');
            robotTags[0].textContent = translations[lang].projects.robot.tags[0];
            robotTags[1].textContent = translations[lang].projects.robot.tags[1];
            robotTags[2].textContent = translations[lang].projects.robot.tags[2];

            // Portfolio
            const portfolioCard = document.querySelectorAll('.project-card')[2];
            portfolioCard.querySelector('h3').textContent = translations[lang].projects.portfolio.title;
            portfolioCard.querySelector('.project-desc').textContent = translations[lang].projects.portfolio.desc;
            const portfolioTags = portfolioCard.querySelectorAll('.project-tags span');
            portfolioTags[0].textContent = translations[lang].projects.portfolio.tags[0];
            portfolioTags[1].textContent = translations[lang].projects.portfolio.tags[1];
            
            // Buttons
            document.querySelectorAll('.project-links .btn-small').forEach(btn => {
                if (btn.hasAttribute('download')) {
                    const icon = btn.querySelector('i').outerHTML;
                    btn.innerHTML = `${icon} ${translations[lang].projects.download_apk}`;
                } else {
                    const icon = btn.querySelector('i').outerHTML;
                    btn.innerHTML = `${icon} ${translations[lang].projects.view_code}`;
                }
            });

            document.querySelector('#contact p').textContent = translations[lang].contact.desc;
            document.querySelector('footer p').innerHTML = `&copy; 2025 Théophile Raybaud. ${translations[lang].contact.built_with}`;
        }
    };
    
    const termToggle = document.getElementById('term-toggle');
    if (termToggle) {
        termToggle.addEventListener('click', () => {
            toggleGUI(false);
        });
    }

    navSlide();
    if (window.matchMedia("(pointer: fine)").matches) customCursor();
    languageHandler();
}

function scrollReveal() {
    const sections = document.querySelectorAll('.project-card, .about-content, .section-title');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
}
