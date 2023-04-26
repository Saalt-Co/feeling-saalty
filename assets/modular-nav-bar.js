class ModularNavBar extends HTMLElement {
  constructor() {
    super();

    this.navClick = this.handleNavLinkClick.bind(this);
    this.previousScrollPosition = 0;
    this.navId = this.dataset.customVal;
    this.throttleDelay = 50;

    window.addEventListener(
      'scroll',
      throttle(() => {
        this.handleScroll();
      }, this.throttleDelay)
    );
    window.addEventListener(
      'resize',
      throttle(() => {
        this.handleScroll();
      }, this.throttleDelay)
    );
  }

  connectedCallback() {
    console.log(`HELLO WORLD! ${this.navId}`);
    this.addEventListeners();
  }

  disconnectedCallback() {
    console.log(`GOODBYE WORLD!`);
  }

  addEventListeners() {
    const thisNavsLinks = this.querySelectorAll('a');
    for (const link of thisNavsLinks) {
      link.addEventListener('click', this.navClick, false);
    }
  }

  handleNavLinkClick(e) {
    e.preventDefault();
    this.querySelector('a.active').classList.remove('active');
    e.target.classList.add('active');
    this.scrollTo(document.getElementById(e.target.getAttribute('href').replace('#', '')));
  }

  scrollTo(element) {
    const headerInfo = this.getHeaderInfo();
    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: element.getBoundingClientRect().top + window.scrollY + headerInfo.totalHeaderHeight,
    });
  }

  getHeaderInfo() {
    let mainNav = document.querySelector('.header');
    let announcementBar = document.querySelector('.announcement-bar');
    let headerInfo = {
      mainNavHeight: mainNav.getBoundingClientRect().height,
      announcementBarHeight: announcementBar.getBoundingClientRect().height,
      totalHeaderHeight: mainNav.getBoundingClientRect().height + announcementBar.getBoundingClientRect().height,
    };
    return headerInfo;
  }

  nextSiblingYOffset(targetEl) {
    const nextSiblingOffset = {
      neighbor: targetEl.closest('.shopify-section').nextElementSibling,
      offset: Math.ceil(
        targetEl.closest('.shopify-section').nextElementSibling.offsetTop - targetEl.getBoundingClientRect().height
      ),
    };
    return nextSiblingOffset;
  }

  isScrollingDown() {
    let goingDown = false;
    let scrollPosition = window.pageYOffset;
    if (scrollPosition > this.previousScrollPosition) {
      goingDown = true;
    }
    this.previousScrollPosition = scrollPosition;
    return goingDown;
  }

  handleScroll() {
    const navBar = document.getElementById(this.navId);
    const navBarHeight = navBar.getBoundingClientRect().height;
    const headerInfo = this.getHeaderInfo();
    const headerHeight = headerInfo.totalHeaderHeight;
    const navBarUl = navBar.querySelector('ul');
    const navBarUlStyle = navBarUl.currentStyle || window.getComputedStyle(navBarUl);
    const topNavBarUlPadding = parseInt(navBarUlStyle.paddingTop);
    const nextSiblingOffset = this.nextSiblingYOffset(navBar);
    const scrollLocation = Math.ceil(window.scrollY + headerHeight - navBarHeight);
    const threshold = Math.ceil(navBar.offsetTop - navBarHeight + topNavBarUlPadding * 2);
    // const scrollDownCondition = scrollLocation > threshold && !navBar.classList.contains('sticky');
    const scrollUpCondition =
      scrollLocation < nextSiblingOffset.offset - navBarHeight / 2.25 && navBar.classList.contains('sticky');

    if (this.isScrollingDown()) {
      if (scrollLocation > threshold) {
        navBar.classList.add('sticky');
        navBar.style.top = `${headerInfo.mainNavHeight}px`;
        nextSiblingOffset.neighbor.style.marginTop = `${navBarHeight}px`;
      }
    } else {
      if (scrollUpCondition) {
        navBar.classList.remove('sticky');
        navBar.removeAttribute('style');
        nextSiblingOffset.neighbor.removeAttribute('style');
      }
    }
  }
}

customElements.define('modular-nav-bar', ModularNavBar);
