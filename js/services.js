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


    /* ----------------------------------------
       HEADER SCROLL EFFECT
       ---------------------------------------- */

    function updateHeader() {

        if (!header) {
            return;
        }


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

        menuToggle.addEventListener(
            'click',
            () => {

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

            }
        );


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

    if (whatsappButton) {

        /*
         Replace this number with the
         official Byramold WhatsApp number.
        */

        const whatsappNumber =
            '254704317265';


        const whatsappMessage =
            'Hello Byramold Investments, I would like to discuss a business, investment, or partnership opportunity.';


        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;


        whatsappButton.href =
            whatsappURL;

    }


    /* ----------------------------------------
       COPYRIGHT YEAR
       ---------------------------------------- */

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


});