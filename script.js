/* --- TERMINAL LOGIC --- */

const fileSystem = {
    "about.txt": {
        en: "I am a student at CentraleSupélec, passionate about software engineering and building innovative solutions. I love turning complex problems into simple, beautiful, and intuitive designs.",
        fr: "Je suis étudiant à CentraleSupélec, passionné par le génie logiciel et la création de solutions innovantes. J'aime transformer des problématiques complexes en expériences simples et élégantes."
    },
    "contact.txt": {
        en: "Email: theophile.raybaud@student-cs.fr\nGitHub: https://github.com/123YAP\nLinkedIn: https://www.linkedin.com/in/théophile-raybaud",
        fr: "Courriel : theophile.raybaud@student-cs.fr\nGitHub : https://github.com/123YAP\nLinkedIn : https://www.linkedin.com/in/théophile-raybaud"
    },
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
    "skills.txt": {
        en: "Languages: Python, JavaScript, C++, HTML/CSS\nTools: Git, Docker, Linux, VS Code\nInterests: AI, Web Development, Robotics",
        fr: "Langages : Python, JavaScript, C++, HTML/CSS\nOutils : Git, Docker, Linux, VS Code\nIntérêts : IA, Développement Web, Robotique"
    },
    "secret.txt": {
        en: "You found the secret file! Nothing here though :)",
        fr: "Bravo, vous avez trouvé le fichier secret ! Mais il est vide pour l'instant :)"
    }
};

const asciiArt = `
  _______ _   _ ______ ____  _____  _    _ _____ _      ______ 
 |__   __| | | |  ____/ __ \\|  __ \\| |  | |_   _| |    |  ____|
    | |  | |_| | |__ | |  | | |__) | |__| | | | | |    | |__   
    | |  |  _  |  __|| |  | |  ___/|  __  | | | | |    |  __|  
    | |  | | | | |___| |__| | |    | |  | |_| |_| |____| |____ 
    |_|  |_| |_|______\\____/|_|    |_|  |_|_____|______|______|
`;

let currentTerminalLang = 'en';
let currentGuiLang = 'en';

const terminalText = {
    en: {
        languageSet: "Language set to English.",
        languageDefault: "Invalid selection. Defaulting to English.",
        welcomeLine: "Welcome to <span class='animated-text'>Théophile</span> Raybaud's Portfolio v2.0",
        helpHint: "Type 'help' to see available commands.",
        guiHint: "Type 'gui' to switch to the graphical interface.",
        help: "Available commands:\n  help      - Show this help message\n  ls        - List files and directories\n  cat [file]- Read a file\n  cd [dir]  - Change directory\n  open [prj]- Open a project link\n  clear     - Clear the terminal\n  whoami    - Display user info\n  gui       - Switch to Graphic User Interface\n  date      - Show current date/time",
        whoami: "User: Guest\nRole: Visitor\nSystem: TheoOS v1.0",
        guiMsg: "Starting GUI environment...",
        dirError: "Error: Cannot read directory.",
        catUsage: "Usage: cat [filename]",
        cdError: dir => `cd: ${dir}: No such directory`,
        catDirectory: name => `cat: ${name}: Is a directory`,
        catMissing: name => `cat: ${name}: No such file`,
        binaryDesc: name => `Binary file ${name} matches. Description:`,
        useOpenHint: name => `Use 'open ${name}' to view/download.`,
        openUsage: "Usage: open [project_name]",
        opening: name => `Opening ${name}...`,
        openMissing: name => `open: ${name}: Project not found`,
        invalidCommand: cmd => `Command not found: ${cmd}`
    },
    fr: {
        languageSet: "Langue définie sur le français.",
        languageDefault: "Sélection invalide. Retour à l'anglais par défaut.",
        welcomeLine: "Bienvenue dans le portfolio v2.0 de <span class='animated-text'>Théophile</span> Raybaud",
        helpHint: "Tapez 'help' pour afficher les commandes.",
        guiHint: "Tapez 'gui' pour passer à l'interface graphique.",
        help: "Commandes disponibles :\n  help      - Affiche cette aide\n  ls        - Liste les fichiers et dossiers\n  cat [fichier] - Affiche le contenu d'un fichier\n  cd [dossier]  - Change de dossier\n  open [projet] - Ouvre un lien de projet\n  clear     - Nettoie le terminal\n  whoami    - Affiche les informations utilisateur\n  gui       - Lance l'interface graphique\n  date      - Affiche la date et l'heure",
        whoami: "Utilisateur : Invité\nRôle : Visiteur\nSystème : TheoOS v1.0",
        guiMsg: "Lancement de l'interface graphique...",
        dirError: "Erreur : impossible de lire le répertoire.",
        catUsage: "Utilisation : cat [fichier]",
        cdError: dir => `cd : ${dir} : Répertoire introuvable`,
        catDirectory: name => `cat : ${name} : Est un dossier`,
        catMissing: name => `cat : ${name} : Fichier introuvable`,
        binaryDesc: name => `Le binaire ${name} contient :`,
        useOpenHint: name => `Utilisez 'open ${name}' pour afficher/télécharger.`,
        openUsage: "Utilisation : open [projet]",
        opening: name => `Ouverture de ${name}...`,
        openMissing: name => `open : ${name} : Projet introuvable`,
        invalidCommand: cmd => `Commande inconnue : ${cmd}`
    }
};

const commands = {
    help: () => terminalText[currentTerminalLang].help,
    whoami: () => terminalText[currentTerminalLang].whoami,
    gui: () => {
        toggleGUI(true);
        return terminalText[currentTerminalLang].guiMsg;
    },
    date: () => new Date().toLocaleString(currentTerminalLang === 'fr' ? 'fr-FR' : 'en-US')
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

function updateGuiContent(lang) {
    const locale = translations[lang] || translations.en;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = locale;
        keys.forEach(k => { if (value) value = value[k]; });
        if (value && typeof value === 'string') element.textContent = value;
    });

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.innerHTML = `${locale.hero.title_prefix} <span class="highlight">Théophile Raybaud</span>.`;

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = locale.hero.subtitle;

    const heroBtns = document.querySelectorAll('.hero-cta .btn');
    if (heroBtns[0]) heroBtns[0].textContent = locale.hero.cta_primary;
    if (heroBtns[1]) heroBtns[1].textContent = locale.hero.cta_secondary;

    const ecocartDesc = document.querySelector('.project-card.featured .project-desc');
    if (ecocartDesc) ecocartDesc.textContent = locale.projects.ecocart.desc;
    const ecocartTags = document.querySelectorAll('.project-card.featured .project-tags span');
    if (ecocartTags[0]) ecocartTags[0].textContent = locale.projects.ecocart.tags[0];
    if (ecocartTags[1]) ecocartTags[1].textContent = locale.projects.ecocart.tags[1];

    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards[1]) {
        projectCards[1].querySelector('h3').textContent = locale.projects.robot.title;
        projectCards[1].querySelector('.project-desc').textContent = locale.projects.robot.desc;
        const robotTags = projectCards[1].querySelectorAll('.project-tags span');
        if (robotTags[0]) robotTags[0].textContent = locale.projects.robot.tags[0];
        if (robotTags[1]) robotTags[1].textContent = locale.projects.robot.tags[1];
        if (robotTags[2]) robotTags[2].textContent = locale.projects.robot.tags[2];
    }

    if (projectCards[2]) {
        projectCards[2].querySelector('h3').textContent = locale.projects.portfolio.title;
        projectCards[2].querySelector('.project-desc').textContent = locale.projects.portfolio.desc;
        const portfolioTags = projectCards[2].querySelectorAll('.project-tags span');
        if (portfolioTags[0]) portfolioTags[0].textContent = locale.projects.portfolio.tags[0];
        if (portfolioTags[1]) portfolioTags[1].textContent = locale.projects.portfolio.tags[1];
    }

    document.querySelectorAll('.project-links .btn-small').forEach(btn => {
        const icon = btn.querySelector('i') ? btn.querySelector('i').outerHTML : '';
        if (btn.hasAttribute('download')) {
            btn.innerHTML = `${icon} ${locale.projects.download_apk}`;
        } else {
            btn.innerHTML = `${icon} ${locale.projects.view_code}`;
        }
    });

    const contactDesc = document.querySelector('#contact p');
    if (contactDesc) contactDesc.textContent = locale.contact.desc;

    const footer = document.querySelector('footer p');
    if (footer) footer.innerHTML = `&copy; 2025 Théophile Raybaud. ${locale.contact.built_with}`;
}

function setAppLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    currentGuiLang = lang;
    currentTerminalLang = lang;
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) langToggle.textContent = lang === 'en' ? 'FR' : 'EN';
    updateGuiContent(lang);
}

function languageHandler() {
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) return;
    langToggle.addEventListener('click', () => {
        const nextLang = currentGuiLang === 'en' ? 'fr' : 'en';
        setAppLanguage(nextLang);
    });
}

window.setAppLanguage = setAppLanguage;

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
    let awaitingLanguage = false;

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
        awaitingLanguage = true;
        printLine("Select Language / Choisir la langue:", "highlight");
        printLine("[1] English / Anglais");
        printLine("[2] Français / French");
        printLine("");
    }, 2500);

    function showBanner() {
        output.innerHTML = ""; 
        const banner = document.createElement('div');
        banner.className = 'ascii-art';
        banner.textContent = asciiArt;
        output.appendChild(banner);
        
        const welcomeLine = document.createElement('div');
        welcomeLine.className = 'output-line';
        welcomeLine.innerHTML = terminalText[currentTerminalLang].welcomeLine;
        output.appendChild(welcomeLine);

        printLine(terminalText[currentTerminalLang].helpHint, "highlight");
        printLine(terminalText[currentTerminalLang].guiHint, "accent");
        printLine("");
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmdRaw = input.value.trim();
            
            if (awaitingLanguage) {
                if (cmdRaw === '1' || cmdRaw.toLowerCase() === 'english' || cmdRaw.toLowerCase() === 'en') {
                    setAppLanguage('en');
                    printLine(terminalText.en.languageSet, "accent");
                } else if (cmdRaw === '2' || cmdRaw.toLowerCase() === 'francais' || cmdRaw.toLowerCase() === 'fr' || cmdRaw.toLowerCase() === 'français') {
                    setAppLanguage('fr');
                    printLine(terminalText.fr.languageSet, "accent");
                } else {
                    setAppLanguage('en');
                    printLine(`${terminalText.en.languageDefault} / ${terminalText.fr.languageDefault}`, "error");
                }

                awaitingLanguage = false;
                setTimeout(showBanner, 600);
                input.value = '';
                return;
            }

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
                        if (typeof item === 'string' || (typeof item === 'object' && !item.type)) span.className = 'file';
                        else if (item.type === 'directory') span.className = 'directory';
                        else if (item.type === 'executable') span.className = 'executable';
                        grid.appendChild(span);
                    });
                    output.appendChild(grid);
                } else {
                    printLine(terminalText[currentTerminalLang].dirError, "error");
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
                        printLine(terminalText[currentTerminalLang].cdError(target), "error");
                    }
                }
                updatePrompt();
                break;
            case 'cat':
                if (!args[0]) {
                    printLine(terminalText[currentTerminalLang].catUsage, "highlight");
                    return;
                }
                const currentDirCat = getDirContent(currentPath);
                const file = currentDirCat[args[0]];
                if (file) {
                    if (typeof file === 'object' && !file.type) {
                        const content = file[currentTerminalLang] || file.en || '';
                        content.split('\n').forEach(line => printLine(line));
                    } else if (typeof file === 'string') {
                        printLine(file);
                    } else if (file.type === 'executable') {
                        printLine(terminalText[currentTerminalLang].binaryDesc(args[0]), "highlight");
                        printLine(file.desc);
                        printLine(terminalText[currentTerminalLang].useOpenHint(args[0]), "accent");
                    } else {
                        printLine(terminalText[currentTerminalLang].catDirectory(args[0]), "error");
                    }
                } else {
                    printLine(terminalText[currentTerminalLang].catMissing(args[0]), "error");
                }
                break;
            case 'open':
                if (!args[0]) {
                    printLine(terminalText[currentTerminalLang].openUsage, "highlight");
                    return;
                }
                const currentDirOpen = getDirContent(currentPath);
                const targetPrj = currentDirOpen[args[0]];
                
                let foundPrj = targetPrj;
                if (!foundPrj && currentPath.length === 0 && fileSystem.projects.files[args[0]]) {
                     foundPrj = fileSystem.projects.files[args[0]];
                }

                if (foundPrj && foundPrj.type === 'executable') {
                    printLine(terminalText[currentTerminalLang].opening(args[0]), "accent");
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
                     printLine(terminalText[currentTerminalLang].openMissing(args[0]), "error");
                }
                break;
            default:
                printLine(terminalText[currentTerminalLang].invalidCommand(cmd), "error");
                break;
        }
    }

    function printLine(text, className = "") {
        const div = document.createElement('div');
        div.className = 'output-line ' + className;
        
        // Linkify URLs and Emails
        if (typeof text === 'string') {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;
            
            let html = text
                .replace(urlRegex, '<a href="$1" target="_blank" class="link">$1</a>')
                .replace(emailRegex, '<a href="mailto:$1" class="link">$1</a>')
                .replace(/\\n/g, '<br>');
            
            div.innerHTML = html;
        } else {
            div.textContent = text;
        }
        
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
    // Keep compatibility with previous setter
    window.setLanguage = (lang) => {
        setAppLanguage(lang);
    };

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
    
    const termToggle = document.getElementById('term-toggle');
    if (termToggle) {
        termToggle.addEventListener('click', () => {
            toggleGUI(false);
        });
    }

    navSlide();
    if (window.matchMedia("(pointer: fine)").matches) customCursor();
    languageHandler();
    setAppLanguage(currentGuiLang);
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
