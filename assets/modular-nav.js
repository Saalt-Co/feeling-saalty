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
    const headerInfo = this.getHeaderInfo();
    const elementTop = element.getBoundingClientRect().top;

    window.scrollTo({
      left: 0,
      top: elementTop - headerInfo.totalHeaderHeight,
      behavior: 'smooth',
    });
  }

  getHeaderInfo() {
    let headerInfo = {};

    let selectors = JSON.parse(this.querySelector('[id*="headerSelectors_"]').innerHTML);

    headerInfo.mainNav = document.querySelector(selectors[0]);
    headerInfo.announcementBar = document.querySelector(selectors[1]);

    if (headerInfo.mainNav) {
      headerInfo.mainNavHeight = headerInfo.mainNav.getBoundingClientRect().height;
    } else {
      headerInfo.mainNavHeight = 0;
    }

    if (headerInfo.announcementBar) {
      headerInfo.announcementBarHeight = headerInfo.announcementBar.getBoundingClientRect().height;
    } else {
      headerInfo.announcementBarHeight = 0;
    }

    headerInfo.totalHeaderHeight = headerInfo.mainNavHeight + headerInfo.announcementBarHeight;

    return headerInfo;
  }
}

customElements.define('modular-nav-bar', ModularNavBar);
