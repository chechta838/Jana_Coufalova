document.addEventListener('DOMContentLoaded', () => {
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
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Přepnout aktuální
            if (!isOpen) {
                item.classList.add('active');
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

    // Poptávkový formulář – simulace odeslání
    const consultationForm = document.getElementById('consultationForm');
    const formResponse = document.getElementById('formResponse');

    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
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

            formResponse.textContent = 'Odesílám nezávaznou poptávku...';
            formResponse.className = 'form-response';

            setTimeout(() => {
                formResponse.textContent = 'Děkujeme! Vaše poptávka byla úspěšně odeslána. Ing. Jana Coufalová se vám ozve nazpět.';
                formResponse.className = 'form-response success';
                consultationForm.reset();
            }, 1000);
        });
    }
});