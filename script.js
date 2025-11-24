const translations = {
    en: {
        nav: {
            home: "Home",
            about: "About",
            projects: "Projects",
            contact: "Contact"
        },
        hero: {
            title_prefix: "Hi, I'm",
            subtitle: "Engineering Student & Developer",
            cta_primary: "View My Work",
            cta_secondary: "Contact Me"
        },
        about: {
            title: "About Me",
            content: "I am a student at CentraleSupélec, passionate about software engineering and building innovative solutions."
        },
        projects: {
            title: "Projects",
            ecocart: {
                desc: "A collaborative shopping list application designed to streamline household organization and encourage an active reflexion about the carbon impact of our groceries. Features real-time updates and user-friendly interface.",
                tags: ["Web Dev", "Full Stack"]
            },
            robot: {
                title: "Autonomous Navigation Robot",
                desc: "A system for autonomous maze navigation using a Raspberry Pi and Arduino. Features computer vision (line tracking, intersection detection), BFS pathfinding, and obstacle avoidance with IR sensors.",
                tags: ["Python/OpenCV", "Robotics", "C++/Arduino"]
            },
            portfolio: {
                title: "Portfolio Website",
                desc: "This website! A modern, responsive portfolio built with HTML, CSS, and JavaScript.",
                tags: ["HTML/CSS", "Design"]
            },
            view_code: "View Code",
            download_apk: "Download APK"
        },
        contact: {
            title: "Get In Touch",
            desc: "Interested in working together or just want to say hi?",
            built_with: "Built with creativity."
        }
    },
    fr: {
        nav: {
            home: "Accueil",
            about: "À propos",
            projects: "Projets",
            contact: "Contact"
        },
        hero: {
            title_prefix: "Salut, je suis",
            subtitle: "Étudiant Ingénieur & Développeur",
            cta_primary: "Voir mon travail",
            cta_secondary: "Me contacter"
        },
        about: {
            title: "À propos de moi",
            content: "Je suis étudiant à CentraleSupélec, passionné par le génie logiciel et la création de solutions innovantes."
        },
        projects: {
            title: "Projets",
            ecocart: {
                desc: "Une application de liste de courses collaborative conçue pour simplifier l'organisation du foyer et encourager une réflexion active sur l'impact carbone de nos achats. Fonctionnalités de mise à jour en temps réel et interface conviviale.",
                tags: ["Dév Web", "Full Stack"]
            },
            robot: {
                title: "Robot de Navigation Autonome",
                desc: "Un système de navigation autonome dans un labyrinthe utilisant Raspberry Pi et Arduino. Fonctionnalités de vision par ordinateur (suivi de ligne, détection d'intersections), pathfinding BFS et évitement d'obstacles avec capteurs IR.",
                tags: ["Python/OpenCV", "Robotique", "C++/Arduino"]
            },
            portfolio: {
                title: "Site Portfolio",
                desc: "Ce site web ! Un portfolio moderne et responsive construit avec HTML, CSS et JavaScript.",
                tags: ["HTML/CSS", "Design"]
            },
            view_code: "Voir le code",
            download_apk: "Télécharger l'APK"
        },
        contact: {
            title: "Me contacter",
            desc: "Intéressé par une collaboration ou juste pour dire bonjour ?",
            built_with: "Fait avec créativité."
        }
    }
};

const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

const customCursor = () => {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows immediately
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with delay/easing
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

const scrollReveal = () => {
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

const languageHandler = () => {
    const langToggle = document.getElementById('lang-toggle');
    let currentLang = 'en';

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        langToggle.textContent = currentLang === 'en' ? 'FR' : 'EN';
        updateContent(currentLang);
    });

    function updateContent(lang) {
        // Nav
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.');
            let value = translations[lang];
            keys.forEach(k => {
                if (value) value = value[k];
            });
            if (value) element.textContent = value;
        });

        // Specific elements that might be hard to reach with data-i18n
        // Hero
        document.querySelector('.hero-title').innerHTML = `${translations[lang].hero.title_prefix} <span class="highlight">Théophile Raybaud</span>.`;
        document.querySelector('.hero-subtitle').textContent = translations[lang].hero.subtitle;
        const heroBtns = document.querySelectorAll('.hero-cta .btn');
        heroBtns[0].textContent = translations[lang].hero.cta_primary;
        heroBtns[1].textContent = translations[lang].hero.cta_secondary;

        // Projects - Ecocart
        document.querySelector('.project-card.featured .project-desc').textContent = translations[lang].projects.ecocart.desc;
        const ecocartTags = document.querySelectorAll('.project-card.featured .project-tags span');
        ecocartTags[0].textContent = translations[lang].projects.ecocart.tags[0];
        ecocartTags[1].textContent = translations[lang].projects.ecocart.tags[1];

        // Projects - Robot
        const robotCard = document.querySelectorAll('.project-card')[1];
        robotCard.querySelector('h3').textContent = translations[lang].projects.robot.title;
        robotCard.querySelector('.project-desc').textContent = translations[lang].projects.robot.desc;
        const robotTags = robotCard.querySelectorAll('.project-tags span');
        robotTags[0].textContent = translations[lang].projects.robot.tags[0];
        robotTags[1].textContent = translations[lang].projects.robot.tags[1];
        robotTags[2].textContent = translations[lang].projects.robot.tags[2];

        // Projects - Portfolio
        const portfolioCard = document.querySelectorAll('.project-card')[2];
        portfolioCard.querySelector('h3').textContent = translations[lang].projects.portfolio.title;
        portfolioCard.querySelector('.project-desc').textContent = translations[lang].projects.portfolio.desc;
        const portfolioTags = portfolioCard.querySelectorAll('.project-tags span');
        portfolioTags[0].textContent = translations[lang].projects.portfolio.tags[0];
        portfolioTags[1].textContent = translations[lang].projects.portfolio.tags[1];
        
        // View Code Buttons
        document.querySelectorAll('.project-links .btn-small').forEach(btn => {
            // Check if it's a download button
            if (btn.hasAttribute('download')) {
                const icon = btn.querySelector('i').outerHTML;
                btn.innerHTML = `${icon} ${translations[lang].projects.download_apk}`;
            } else {
                const icon = btn.querySelector('i').outerHTML;
                btn.innerHTML = `${icon} ${translations[lang].projects.view_code}`;
            }
        });

        // Contact
        document.querySelector('#contact p').textContent = translations[lang].contact.desc;
        
        // Footer
        document.querySelector('footer p').innerHTML = `&copy; 2025 Théophile Raybaud. ${translations[lang].contact.built_with}`;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    // Only enable custom cursor on non-touch devices for better UX
    if (window.matchMedia("(pointer: fine)").matches) {
        customCursor();
    } else {
        document.getElementById('cursor-dot').style.display = 'none';
        document.getElementById('cursor-outline').style.display = 'none';
    }
    scrollReveal();
    languageHandler();
});
