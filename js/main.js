/* ==========================================================================
   RAMO Forward - Main JavaScript
   ========================================================================== */

// ==========================================================================
// Translations (i18n)
// ==========================================================================
const translations = {
    en: {
        // Navigation
        nav_approach: "Our Approach",
        nav_how: "How It Works",
        nav_services: "Services",
        nav_why: "Why Us",
        nav_cta: "Request a Quote",

        // Hero
        hero_badge: "Mexico-USA Cross-Border Logistics",
        hero_title_1: "Freight,",
        hero_title_2: "without friction",
        hero_subtitle: "We move cargo across borders with systems, not improvisation. Logistics designed for companies that value control, clarity, and margin.",
        hero_cta_primary: "Request a Quote",
        hero_cta_secondary: "Talk to an Expert",

        // Value Props (replacing stats)
        value_1_title: "On-Time Commitment",
        value_1_desc: "Reliability you can count on",
        value_2_title: "Real-Time Visibility",
        value_2_desc: "Know where your cargo is",
        value_3_title: "Curated Network",
        value_3_desc: "Verified carriers only",

        // Problem Section
        problem_label: "The Problem",
        problem_title_1: "Cross-border logistics",
        problem_title_2: "is broken",
        problem_subtitle: "Every day, operations leaders waste time on problems that shouldn't exist.",

        problem_1_title: "Too many calls",
        problem_1_desc: "Endless phone calls and messages to coordinate a single shipment across the border.",
        problem_2_title: "Zero visibility",
        problem_2_desc: "You don't know where your cargo is until someone decides to tell you. If they remember.",
        problem_3_title: "Customs delays",
        problem_3_desc: "Documentation issues, unexpected holds, and clearance problems that cost time and money.",
        problem_4_title: "Constant improvisation",
        problem_4_desc: "Every shipment feels like the first one. No systems, no processes, just chaos management.",
        problem_5_title: "Unreliable providers",
        problem_5_desc: "Carriers without systems. Brokers without accountability. Partners without standards.",

        // Approach Section
        approach_label: "Our Approach",
        approach_title_1: "Systems over",
        approach_title_2: "improvisation",
        approach_subtitle: "We eliminate friction by automating what can be automated, and adding human expertise only where it creates real value.",

        approach_1_title: "Automation first",
        approach_1_desc: "Every routine task is systematized. Tracking, updates, documentation—handled automatically.",
        approach_2_title: "Strategic intervention",
        approach_2_desc: "Human expertise where it matters: customs, complex decisions, problem resolution.",
        approach_3_title: "Curated network",
        approach_3_desc: "We don't work with everyone. Strategic selection of routes and carriers based on performance.",

        // How It Works
        how_label: "How It Works",
        how_title_1: "Three steps to",
        how_title_2: "controlled logistics",
        how_subtitle: "A structured process designed to give you clarity and control at every stage.",

        step_1_label: "Strategic Evaluation",
        step_1_title: "Route & Margin Analysis",
        step_1_desc: "We analyze your requirements, identify optimal routes, and evaluate providers based on performance data.",
        step_2_label: "Intelligent Execution",
        step_2_title: "Efficient Assignment",
        step_2_desc: "Automated carrier assignment and real-time tracking. You know where your cargo is, always.",
        step_3_label: "Continuous Control",
        step_3_title: "Real-Time Visibility",
        step_3_desc: "Live updates, proactive alerts, and data-driven decisions. No surprises, no excuses.",

        // Services
        services_label: "Our Services",
        services_title_1: "What we",
        services_title_2: "move",
        services_subtitle: "Specialized in Mexico-USA cross-border routes where consistency and reliability matter more than the lowest bid.",

        service_1_title: "Cross-Border FTL",
        service_1_desc: "Full truckload shipments across the Mexico-USA border with complete customs coordination.",
        service_2_title: "Cross-Border LTL",
        service_2_desc: "Consolidated shipments for smaller loads, optimizing cost without sacrificing visibility.",
        service_3_title: "Customs Brokerage",
        service_3_desc: "Expert handling of import/export documentation, compliance, and clearance processes.",
        service_4_title: "Dry Freight",
        service_4_desc: "Standard cargo operations with the same attention to detail and systematic approach.",
        service_5_title: "Refrigerated",
        service_5_desc: "Temperature-controlled shipments for perishables and sensitive products across borders.",
        service_6_title: "Strategic Sourcing",
        service_6_desc: "Carrier selection based on data, not relationships. Performance metrics that protect your margin.",

        // Clients
        clients_label: "Who We Work With",
        clients_title_1: "Built for",
        clients_title_2: "decision-makers",
        clients_subtitle: "We partner with companies that understand the difference between cost and value.",

        client_1: "CEOs and company founders",
        client_2: "Directors of operations",
        client_3: "Logistics managers",
        client_4: "Companies with recurring cross-border routes",

        filter_quote: "If you're looking for the cheapest price, we're not for you.",
        filter_highlight: "If you're looking for operational peace of mind, let's talk.",

        // Why Section
        why_label: "Why RAMO Forward",
        why_title_1: "What sets us",
        why_title_2: "apart",

        why_1: "Cross-Border Expertise",
        why_2: "Margin-Focused Operations",
        why_3: "Minimal Human Friction",
        why_4: "Clear Communication",
        why_5: "Systems Built to Scale",

        // Philosophy
        philosophy_label: "Our Philosophy",
        philosophy_quote_1: "Calm operations",
        philosophy_quote_2: "outperform chaotic speed.",
        philosophy_text: "Efficient logistics doesn't announce itself. It simply works. Every time, on time, with clarity and control.",

        // Contact
        contact_label: "Get Started",
        contact_title_1: "Move forward with",
        contact_title_2: "confidence",
        contact_subtitle: "Ready to experience logistics that works? Let's discuss how we can support your cross-border operations.",

        contact_phone_label: "Phone / WhatsApp",
        contact_email_label: "Email",

        form_name: "Full Name",
        form_name_placeholder: "John Smith",
        form_email: "Email",
        form_email_placeholder: "john@company.com",
        form_company: "Company",
        form_company_placeholder: "Your company name",
        form_phone: "Phone",
        form_phone_placeholder: "+1 (555) 000-0000",
        form_cargo: "Type of Cargo",
        form_cargo_select: "Select cargo type",
        form_cargo_dry: "Dry Freight",
        form_cargo_refrigerated: "Refrigerated",
        form_cargo_hazmat: "Hazardous Materials",
        form_cargo_other: "Other",
        form_message: "Message",
        form_message_placeholder: "Tell us about your shipping needs...",
        form_submit: "Send Message",
        form_success: "Thank you! We'll be in touch within 24 hours.",
        form_error: "Something went wrong. Please try again or contact us directly.",

        // Footer
        footer_tagline_1: "Logistics.",
        footer_tagline_2: "Simplified."
    },
    es: {
        // Navigation
        nav_approach: "Nuestro Enfoque",
        nav_how: "Cómo Funciona",
        nav_services: "Servicios",
        nav_why: "Por Qué Nosotros",
        nav_cta: "Solicitar Cotización",

        // Hero
        hero_badge: "Logística Transfronteriza México-USA",
        hero_title_1: "Carga,",
        hero_title_2: "sin fricción",
        hero_subtitle: "Movemos carga a través de fronteras con sistemas, no improvisación. Logística diseñada para empresas que valoran control, claridad y margen.",
        hero_cta_primary: "Solicitar Cotización",
        hero_cta_secondary: "Hablar con un Experto",

        // Value Props
        value_1_title: "Compromiso de Puntualidad",
        value_1_desc: "Confiabilidad garantizada",
        value_2_title: "Visibilidad en Tiempo Real",
        value_2_desc: "Sabe dónde está su carga",
        value_3_title: "Red Curada",
        value_3_desc: "Solo transportistas verificados",

        // Problem Section
        problem_label: "El Problema",
        problem_title_1: "La logística transfronteriza",
        problem_title_2: "está rota",
        problem_subtitle: "Cada día, los líderes de operaciones pierden tiempo en problemas que no deberían existir.",

        problem_1_title: "Demasiadas llamadas",
        problem_1_desc: "Llamadas y mensajes interminables para coordinar un solo envío a través de la frontera.",
        problem_2_title: "Cero visibilidad",
        problem_2_desc: "No sabe dónde está su carga hasta que alguien decide informarle. Si lo recuerdan.",
        problem_3_title: "Retrasos en aduana",
        problem_3_desc: "Problemas de documentación, retenciones inesperadas y problemas de despacho que cuestan tiempo y dinero.",
        problem_4_title: "Improvisación constante",
        problem_4_desc: "Cada envío se siente como el primero. Sin sistemas, sin procesos, solo gestión del caos.",
        problem_5_title: "Proveedores poco confiables",
        problem_5_desc: "Transportistas sin sistemas. Brokers sin responsabilidad. Socios sin estándares.",

        // Approach Section
        approach_label: "Nuestro Enfoque",
        approach_title_1: "Sistemas sobre",
        approach_title_2: "improvisación",
        approach_subtitle: "Eliminamos la fricción automatizando lo que se puede automatizar, y agregando experiencia humana solo donde crea valor real.",

        approach_1_title: "Automatización primero",
        approach_1_desc: "Cada tarea rutinaria está sistematizada. Rastreo, actualizaciones, documentación—manejado automáticamente.",
        approach_2_title: "Intervención estratégica",
        approach_2_desc: "Experiencia humana donde importa: aduanas, decisiones complejas, resolución de problemas.",
        approach_3_title: "Red curada",
        approach_3_desc: "No trabajamos con todos. Selección estratégica de rutas y transportistas basada en desempeño.",

        // How It Works
        how_label: "Cómo Funciona",
        how_title_1: "Tres pasos hacia",
        how_title_2: "logística controlada",
        how_subtitle: "Un proceso estructurado diseñado para darle claridad y control en cada etapa.",

        step_1_label: "Evaluación Estratégica",
        step_1_title: "Análisis de Ruta y Margen",
        step_1_desc: "Analizamos sus requisitos, identificamos rutas óptimas y evaluamos proveedores basados en datos de desempeño.",
        step_2_label: "Ejecución Inteligente",
        step_2_title: "Asignación Eficiente",
        step_2_desc: "Asignación automatizada de transportistas y rastreo en tiempo real. Sabe dónde está su carga, siempre.",
        step_3_label: "Control Continuo",
        step_3_title: "Visibilidad en Tiempo Real",
        step_3_desc: "Actualizaciones en vivo, alertas proactivas y decisiones basadas en datos. Sin sorpresas, sin excusas.",

        // Services
        services_label: "Nuestros Servicios",
        services_title_1: "Lo que",
        services_title_2: "movemos",
        services_subtitle: "Especializados en rutas transfronterizas México-USA donde la consistencia y confiabilidad importan más que el precio más bajo.",

        service_1_title: "FTL Transfronterizo",
        service_1_desc: "Envíos de carga completa a través de la frontera México-USA con coordinación aduanal completa.",
        service_2_title: "LTL Transfronterizo",
        service_2_desc: "Envíos consolidados para cargas menores, optimizando costo sin sacrificar visibilidad.",
        service_3_title: "Agencia Aduanal",
        service_3_desc: "Manejo experto de documentación de importación/exportación, cumplimiento y procesos de despacho.",
        service_4_title: "Carga Seca",
        service_4_desc: "Operaciones de carga estándar con la misma atención al detalle y enfoque sistemático.",
        service_5_title: "Refrigerado",
        service_5_desc: "Envíos con temperatura controlada para perecederos y productos sensibles a través de fronteras.",
        service_6_title: "Sourcing Estratégico",
        service_6_desc: "Selección de transportistas basada en datos, no relaciones. Métricas de desempeño que protegen su margen.",

        // Clients
        clients_label: "Con Quién Trabajamos",
        clients_title_1: "Diseñado para",
        clients_title_2: "tomadores de decisiones",
        clients_subtitle: "Nos asociamos con empresas que entienden la diferencia entre costo y valor.",

        client_1: "CEOs y fundadores de empresas",
        client_2: "Directores de operaciones",
        client_3: "Gerentes de logística",
        client_4: "Empresas con rutas transfronterizas recurrentes",

        filter_quote: "Si busca el precio más barato, no somos para usted.",
        filter_highlight: "Si busca tranquilidad operativa, hablemos.",

        // Why Section
        why_label: "Por Qué RAMO Forward",
        why_title_1: "Lo que nos",
        why_title_2: "distingue",

        why_1: "Experiencia Transfronteriza",
        why_2: "Operaciones Enfocadas en Margen",
        why_3: "Mínima Fricción Humana",
        why_4: "Comunicación Clara",
        why_5: "Sistemas Diseñados para Escalar",

        // Philosophy
        philosophy_label: "Nuestra Filosofía",
        philosophy_quote_1: "Las operaciones calmadas",
        philosophy_quote_2: "superan a la velocidad caótica.",
        philosophy_text: "La logística eficiente no se anuncia. Simplemente funciona. Cada vez, a tiempo, con claridad y control.",

        // Contact
        contact_label: "Comencemos",
        contact_title_1: "Avance con",
        contact_title_2: "confianza",
        contact_subtitle: "¿Listo para experimentar logística que funciona? Hablemos de cómo podemos apoyar sus operaciones transfronterizas.",

        contact_phone_label: "Teléfono / WhatsApp",
        contact_email_label: "Correo",

        form_name: "Nombre Completo",
        form_name_placeholder: "Juan Pérez",
        form_email: "Correo Electrónico",
        form_email_placeholder: "juan@empresa.com",
        form_company: "Empresa",
        form_company_placeholder: "Nombre de su empresa",
        form_phone: "Teléfono",
        form_phone_placeholder: "+52 (55) 0000-0000",
        form_cargo: "Tipo de Carga",
        form_cargo_select: "Seleccione tipo de carga",
        form_cargo_dry: "Carga Seca",
        form_cargo_refrigerated: "Refrigerado",
        form_cargo_hazmat: "Materiales Peligrosos",
        form_cargo_other: "Otro",
        form_message: "Mensaje",
        form_message_placeholder: "Cuéntenos sobre sus necesidades de envío...",
        form_submit: "Enviar Mensaje",
        form_success: "¡Gracias! Nos pondremos en contacto en las próximas 24 horas.",
        form_error: "Algo salió mal. Por favor intente de nuevo o contáctenos directamente.",

        // Footer
        footer_tagline_1: "Logística.",
        footer_tagline_2: "Simplificada."
    }
};

// ==========================================================================
// Language Management
// ==========================================================================
let currentLang = localStorage.getItem('ramo-lang') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('ramo-lang', lang);

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Update language selector buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// ==========================================================================
// Navigation
// ==========================================================================
function initNavigation() {
    const nav = document.querySelector('.nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(11, 15, 26, 0.95)';
        } else {
            nav.style.background = 'rgba(11, 15, 26, 0.8)';
        }
    });

    // Mobile menu toggle
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mobileNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu on link click
        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// ==========================================================================
// Scroll Reveal
// ==========================================================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 100;

            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);

    // Initial check
    revealOnScroll();
}

// ==========================================================================
// Smooth Scroll
// ==========================================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================================================
// Contact Form
// ==========================================================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formMessage.textContent = translations[currentLang].form_success;
                formMessage.className = 'form-message success';
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            formMessage.textContent = translations[currentLang].form_error;
            formMessage.className = 'form-message error';
        }

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    });
}

// ==========================================================================
// Language Selector
// ==========================================================================
function initLanguageSelector() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
}

// ==========================================================================
// Initialize Everything
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language
    setLanguage(currentLang);

    // Initialize all components
    initNavigation();
    initScrollReveal();
    initSmoothScroll();
    initContactForm();
    initLanguageSelector();
});
