document.addEventListener('DOMContentLoaded', () => {
    // Hlavička – stín po odscrollování
    const header = document.getElementById('header');

    const updateHeader = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    // Mobilní menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    const setMenu = (open) => {
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
        mobileMenu.classList.toggle('is-open', open);
        document.body.classList.toggle('menu-open', open);
    };

    hamburger.addEventListener('click', () => {
        setMenu(hamburger.getAttribute('aria-expanded') !== 'true');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });

    window.matchMedia('(min-width: 1181px)').addEventListener('change', (e) => {
        if (e.matches) setMenu(false);
    });

    // Zvýraznění aktuální sekce v menu
    const navLinks = [...document.querySelectorAll('.main-nav a[href^="/#"]')];
    const sections = navLinks
        .map(link => document.getElementById(link.getAttribute('href').slice(2)))
        .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    link.classList.toggle('is-active', link.getAttribute('href') === '/#' + entry.target.id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(section => observer.observe(section));
    }

    // FAQ Accordion interaktivita
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Zavřít všechny ostatní
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Přepnout aktuální
            if (!isOpen) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Balíčky – předvyplnění zvoleného balíčku ve formuláři
    const serviceType = document.getElementById('serviceType');

    document.querySelectorAll('[data-plan]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (serviceType) {
                serviceType.value = btn.dataset.plan;
            }
        });
    });

    // Souhlas s cookies a Google Analytics (načte se až po souhlasu)
    const cookieBanner = document.getElementById('cookieBanner');

    if (cookieBanner) {
        const gaId = cookieBanner.dataset.gaId;
        const CONSENT_KEY = 'cookie-consent';

        const readConsent = () => {
            try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
        };
        const saveConsent = (value) => {
            try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* prohlížeč úložiště nepovoluje */ }
        };

        const loadAnalytics = () => {
            if (window.gaLoaded) return;
            window.gaLoaded = true;
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
            document.head.appendChild(script);
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () { window.dataLayer.push(arguments); };
            window.gtag('js', new Date());
            window.gtag('config', gaId);
        };

        const removeAnalyticsCookies = () => {
            const host = location.hostname;
            const domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
            document.cookie.split(';').map(c => c.split('=')[0].trim()).filter(name => name.startsWith('_ga')).forEach(name => {
                domains.forEach(domain => {
                    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (domain ? '; domain=' + domain : '');
                });
            });
        };

        const showBanner = () => {
            cookieBanner.hidden = false;
            requestAnimationFrame(() => cookieBanner.classList.add('is-visible'));
        };
        const hideBanner = () => {
            cookieBanner.classList.remove('is-visible');
            cookieBanner.hidden = true;
        };

        const consent = readConsent();
        if (consent === 'granted') {
            loadAnalytics();
        } else if (!consent) {
            showBanner();
        }

        cookieBanner.querySelector('[data-consent="accept"]').addEventListener('click', () => {
            saveConsent('granted');
            hideBanner();
            loadAnalytics();
        });

        cookieBanner.querySelector('[data-consent="reject"]').addEventListener('click', () => {
            const wasGranted = readConsent() === 'granted';
            saveConsent('denied');
            hideBanner();
            removeAnalyticsCookies();
            // Už načtené měření nejde zastavit jinak než novým načtením stránky
            if (wasGranted && window.gaLoaded) location.reload();
        });

        document.querySelectorAll('[data-cookie-settings]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showBanner();
            });
        });
    }

    // Poptávkový formulář – odeslání e-mailem přes Formspree
    const consultationForm = document.getElementById('consultationForm');
    const formResponse = document.getElementById('formResponse');

    if (consultationForm) {
        const submitBtn = consultationForm.querySelector('button[type="submit"]');

        consultationForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !phone || !email || !message) {
                formResponse.textContent = 'Prosím vyplňte všechna povinná pole.';
                formResponse.className = 'form-response error';
                return;
            }

            if (consultationForm.action.includes('DOPLNIT')) {
                formResponse.textContent = 'Formulář zatím není napojený. Zavolejte nám prosím na +420 602 553 925.';
                formResponse.className = 'form-response error';
                return;
            }

            formResponse.textContent = 'Odesílám nezávaznou poptávku...';
            formResponse.className = 'form-response';
            submitBtn.disabled = true;

            try {
                const response = await fetch(consultationForm.action, {
                    method: 'POST',
                    body: new FormData(consultationForm),
                    headers: { Accept: 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Odeslání se nezdařilo: ' + response.status);
                }

                // Konverze pro Google Analytics (odešle se jen se souhlasem s cookies)
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'generate_lead', {
                        form_name: 'poptavka',
                        sluzba: document.getElementById('serviceType')?.value || ''
                    });
                }

                formResponse.textContent = 'Děkujeme! Vaše poptávka byla úspěšně odeslána. Ing. Jana Coufalová se vám brzy ozve.';
                formResponse.className = 'form-response success';
                consultationForm.reset();
            } catch (error) {
                formResponse.textContent = 'Poptávku se nepodařilo odeslat. Zkuste to prosím znovu, nebo nám zavolejte na +420 602 553 925.';
                formResponse.className = 'form-response error';
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
});