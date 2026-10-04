document.addEventListener('DOMContentLoaded', () => {


    /* ----------------------------------------
       ELEMENTS
       ---------------------------------------- */

    const header =
        document.querySelector('.site-header');

    const menuToggle =
        document.querySelector('.menu-toggle');

    const mainNav =
        document.querySelector('.main-nav');

    const currentYear =
        document.querySelector('#current-year');

    const whatsappButton =
        document.querySelector('#whatsapp-button');

    const contactWhatsapp =
        document.querySelector('#contact-whatsapp');

    const contactForm =
        document.querySelector('#byramold-contact-form');

    const formStatus =
        document.querySelector('#form-status');

    const submitButton =
        contactForm
            ? contactForm.querySelector('.submit-button')
            : null;


    /* ----------------------------------------
       HEADER
       ---------------------------------------- */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

    }


    updateHeader();


    window.addEventListener(
        'scroll',
        updateHeader,
        { passive: true }
    );


    /* ----------------------------------------
       MOBILE NAVIGATION
       ---------------------------------------- */

    if (menuToggle && mainNav && header) {

        menuToggle.addEventListener('click', () => {

            const menuIsOpen =
                mainNav.classList.toggle(
                    'mobile-active'
                );

            menuToggle.classList.toggle(
                'active',
                menuIsOpen
            );

            header.classList.toggle(
                'menu-open',
                menuIsOpen
            );

            menuToggle.setAttribute(
                'aria-expanded',
                menuIsOpen.toString()
            );

            menuToggle.setAttribute(
                'aria-label',
                menuIsOpen
                    ? 'Close navigation menu'
                    : 'Open navigation menu'
            );

        });


        mainNav
            .querySelectorAll('a')
            .forEach((link) => {

                link.addEventListener(
                    'click',
                    closeMobileMenu
                );

            });


        document.addEventListener(
            'keydown',
            (event) => {

                if (
                    event.key === 'Escape' &&
                    mainNav.classList.contains(
                        'mobile-active'
                    )
                ) {

                    closeMobileMenu();

                    menuToggle.focus();

                }

            }
        );


        window.addEventListener(
            'resize',
            () => {

                if (window.innerWidth >= 900) {
                    closeMobileMenu();
                }

            }
        );

    }


    function closeMobileMenu() {

        if (
            !menuToggle ||
            !mainNav ||
            !header
        ) {
            return;
        }

        mainNav.classList.remove(
            'mobile-active'
        );

        menuToggle.classList.remove(
            'active'
        );

        header.classList.remove(
            'menu-open'
        );

        menuToggle.setAttribute(
            'aria-expanded',
            'false'
        );

        menuToggle.setAttribute(
            'aria-label',
            'Open navigation menu'
        );

    }


    /* ----------------------------------------
       WHATSAPP
       ---------------------------------------- */

    /*
       IMPORTANT:
       Keep your actual Byramold WhatsApp
       number here.

       Format:
       0712 345 678
       becomes
       254704317265
    */

    const whatsappNumber =
        '254704317265';


    const whatsappMessage =
        'Hello Byramold Investments, I would like to discuss a business, investment, or partnership opportunity.';


    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;


    if (whatsappButton) {

        whatsappButton.href =
            whatsappURL;

    }


    if (contactWhatsapp) {

        contactWhatsapp.href =
            whatsappURL;

    }


    /* ----------------------------------------
       CONTACT FORM
       ---------------------------------------- */

    if (contactForm) {

        contactForm.addEventListener(
            'submit',
            async (event) => {

                event.preventDefault();


                /* --------------------------------
                   VALIDATION
                   -------------------------------- */

                if (!contactForm.checkValidity()) {

                    contactForm.reportValidity();

                    return;

                }


                /* --------------------------------
                   BUTTON STATE
                   -------------------------------- */

                const originalButtonHTML =
                    submitButton
                        ? submitButton.innerHTML
                        : '';


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        'Sending...';

                }


                if (formStatus) {

                    formStatus.textContent =
                        'Sending your enquiry...';

                    formStatus.className =
                        'form-status show info';

                }


                /* --------------------------------
                   PREPARE FORM DATA
                   -------------------------------- */

                const formData =
                    new FormData(contactForm);


                /*
                   FormSubmit uses the visitor's
                   "email" field as Reply-To.
                */

                const visitorEmail =
                    formData.get('email');


                if (visitorEmail) {

                    formData.set(
                        '_replyto',
                        visitorEmail
                    );

                }


                try {


                    /* --------------------------------
                       SEND TO FORMSUBMIT
                       -------------------------------- */

                    const response =
                        await fetch(
                            'https://formsubmit.co/ajax/admin@byramoldinvestments.com',
                            {
                                method: 'POST',

                                headers: {
                                    'Accept':
                                        'application/json'
                                },

                                body: formData
                            }
                        );


                    const data =
                        await response.json();


                    /* --------------------------------
                       SUCCESS
                       -------------------------------- */

                    if (response.ok) {

                        if (formStatus) {

                            formStatus.textContent =
                                'Thank you. Your enquiry has been sent successfully. The Byramold Investments team will review it and get back to you.';

                            formStatus.className =
                                'form-status show success';

                        }


                        contactForm.reset();


                    } else {


                        throw new Error(
                            data.message ||
                            'Unable to send enquiry.'
                        );

                    }


                } catch (error) {


                    /* --------------------------------
                       ERROR
                       -------------------------------- */

                    console.error(
                        'Contact form error:',
                        error
                    );


                    if (formStatus) {

                        formStatus.textContent =
                            'We could not send your enquiry at this time. Please try again or contact us directly at admin@byramoldinvestments.com.';

                        formStatus.className =
                            'form-status show error';

                    }


                } finally {


                    /* --------------------------------
                       RESTORE BUTTON
                       -------------------------------- */

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.innerHTML =
                            originalButtonHTML;

                    }

                }

            }
        );

    }


    /* ----------------------------------------
       COPYRIGHT YEAR
       ---------------------------------------- */

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


});