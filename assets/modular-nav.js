class ModularNavBar extends HTMLElement {
  constructor() {
    super();

    this.navClick = this.handleNavLinkClick.bind(this);
    this.throttleDelay = 50;

    window.addEventListener(
      'resize',
      throttle(() => {
        console.log(window.innerWidth);
      }, this.throttleDelay)
    );
  }

  connectedCallback() {
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  addEventListeners() {
    const thisNavLinks = this.querySelectorAll('a');
    const thisNavBtns = this.querySelectorAll('button');
    for (const link of thisNavLinks) {
      link.addEventListener('click', this.navClick, true);
    }
    for (const button of thisNavBtns) {
      button.addEventListener('click', this.navClick, true);
    }
  }

  removeEventListeners() {
    const thisNavLinks = this.querySelectorAll('a');
    const thisNavBtns = this.querySelectorAll('button');
    for (const link of thisNavLinks) {
      link.removeEventListener('click', this.navClick, true);
    }
    for (const button of thisNavBtns) {
      button.removeEventListener('click', this.navClick, true);
    }
  }

  handleNavLinkClick(e) {
    e.stopPropagation();
    this.querySelector('.active').classList.remove('active');
    e.target.classList.add('active');
    if (e.target.getAttribute('data-target-element')) {
      this.scrollTo(document.querySelector(e.target.getAttribute('data-target-element')));
    }
  }

  scrollTo(element) {
    const elementTop = element.getBoundingClientRect().top;
    const headerInfo = this.getHeaderInfo();
    let scrollDistance = 0;

    if (
      document.querySelector('sticky-header') &&
      document.querySelector('sticky-header').dataset.stickyType !== 'on-scroll-up'
    ) {
      scrollDistance = element.getBoundingClientRect().top + window.scrollY - headerInfo.mainNavHeight;
    } else if (
      document.querySelector('sticky-header') &&
      document.querySelector('sticky-header').dataset.stickyType === 'on-scroll-up'
    ) {
      if (element.getBoundingClientRect().top < this.getBoundingClientRect().top) {
        scrollDistance = element.getBoundingClientRect().top + window.scrollY - headerInfo.mainNavHeight;
      } else {
        scrollDistance = element.getBoundingClientRect().top + window.scrollY;
      }
    } else {
      scrollDistance = elementTop + window.scrollY;
    }
    window.scrollTo({
      left: 0,
      top: scrollDistance,
      behavior: 'smooth',
    });
  }

  getHeaderInfo() {
    let headerInfo = {};

    let selector = JSON.parse(this.querySelector('[id*="headerSelector_"]').innerHTML);

    headerInfo.mainNav = document.querySelector(selector);

    if (headerInfo.mainNav) {
      headerInfo.mainNavHeight = headerInfo.mainNav.getBoundingClientRect().height;
    } else {
      headerInfo.mainNavHeight = 0;
    }

    return headerInfo;
  }
}

customElements.define('modular-nav-bar', ModularNavBar);
