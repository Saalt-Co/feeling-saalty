class WindowDisplay extends HTMLElement {
  constructor() {
    super();

    this.windowFeatureClick = this.handleWindowFeatureClick.bind(this);
    this.windowResize = this.handleWindowResize.bind(this);
  }

  connectedCallback() {
    const windowFeatures = document.querySelectorAll('.window-feature');
    const windowFeatureBtns = document.querySelectorAll('.window-feature-button');
    for (const feature of [...windowFeatures, ...windowFeatureBtns]) {
      addEventListeners(feature, ['click', 'keydown'], [this.windowFeatureClick], false);
    }
    window.addEventListener('resize', this.windowResize, false);
    waitForElementToExist('window-display')
      .then(() => {
        this.windowResize();
      })
      .then(() => {
        setTimeout(() => {
          this.fadeInWindowFeatures(windowFeatures);
        }, 500);
      });
  }

  disconnectedCallback() {
    const windowFeatures = document.querySelectorAll('.window-feature');
    const windowFeatureBtns = document.querySelectorAll('.window-feature-button');
    for (const feature of [...windowFeatures, ...windowFeatureBtns]) {
      removeEventListeners(feature, ['click', 'keydown'], [this.windowFeatureClick], false);
    }
    removeEventListeners(window, ['resize'], [this.windowResize], false);
  }

  /**
   *
   * @returns Boolean value if current device is touch-enabled or not
   */
  isTouchDevice() {
    return (
      matchMedia('(hover: none), (pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  fadeInWindowFeatures(windowFeatures) {
    const windowFeatureEls = [...windowFeatures];
    for (let i = 0; i < windowFeatureEls.length; i++) {
      setTimeout(() => {
        windowFeatureEls[i].closest('.window-feature-wrapper').classList.add('window-feature-fade-in');
      }, i * 125);
    }
  }

  /**
   *
   * @param {event} e Click event
   * @returns null
   */
  handleWindowFeatureClick(e) {
    this.toggleVisibility(e);
    this.filterByClicked(e);
    this.filterByClickedMobile(e);
  }

  /**
   *
   * @param {event} e Click event
   * @returns null
   */
  toggleVisibility(e) {
    if (this.isTouchDevice() == false || e.target.classList.contains('window-feature-button')) return;
    const clickedParent = e.target.closest('.window-feature-wrapper');
    clickedParent.querySelector('.text-wrapper').classList.toggle('visible');
  }

  /**
   *
   * @param {event} e Click event
   * @returns null
   */
  filterByClicked(e) {
    if (!a11yClick(e)) return;
    if (
      this.isTouchDevice() == true &&
      !e.target.classList.contains('window-feature-button') &&
      !e.target.parentElement.classList.contains('window-feature-button')
    ) {
       if (!e.target.classList.contains('ClickWorkingHere')){
      //e.preventDefault();
       }else{
         e.preventDefault();
       }
      return;
    }
    this.applyFilter(e);
  }

    filterByClickedMobile(e) {
    if (!a11yClick(e)) return;
    if (
      this.isTouchDevice() == true &&
      !e.target.classList.contains('window-feature-button') &&
      !e.target.parentElement.classList.contains('window-feature-button')
    ) {
       if (!e.target.classList.contains('ClickWorkingHere')){
      //e.preventDefault();
       }else{
         e.preventDefault();
       }
      return;
    }
    this.applyFilter(e);
  }

  /**
   *
   * @param {event} e Click event
   * @returns null
   */
  applyFilter(e) {
    const filterNames = Array.from(document.querySelectorAll('.filter-label'));
    const clickedName = e.target.closest('.window-feature-wrapper').dataset.filterName;
    const clickedVal = e.target.closest('.window-feature-wrapper').dataset.filterVal;
    let foundMatch = filterNames.filter((el) => {
      return el.childNodes[0].data === clickedName;
    })[0];
    const target = foundMatch.closest('details').querySelector(`input[value='${clickedVal}']`);
    target.disabled ? target.removeAttribute('disabled') : null;

    window.WindowDisplay = window.WindowDisplay || {};
    window.WindowDisplay.clicked = true;
    if (window.location.href.indexOf(clickedVal) > -1) return;
    target.click();
    if (window.innerWidth < 750) {
      this.scrollTo('.facets-vertical', -16);
    } else {
      this.scrollTo('facet-filters-form', -16);
    }
  }

  /**
   *
   * @param {event} e Resize event
   */
  handleWindowResize(e) {
    debounce(this.handleResizeText(e), 500);
  }

  /**
   *
   * @param {event} e Resize event
   */
  handleResizeText(e) {
    const windowFeatureWrappers = document.querySelectorAll('.window-feature-wrapper');
    const resizeableEls = [];
    for (const featureWrapper of [...windowFeatureWrappers]) {
      resizeableEls.push(featureWrapper.querySelector('.window-feature-title p'));
      resizeableEls.push(featureWrapper.querySelector('.window-feature-button span'));
    }
    for (const el of [...resizeableEls]) {
      this.resizeText(el);
    }
  }

  /**
   *
   * @param {*} resizeableTextEl Target element to resize
   * @returns null
   */
  resizeText(resizeableTextEl) {
    const el = resizeableTextEl;
    const parentEl = el.parentElement;
    if (!el || !parentEl) return;
    parentEl.style.fontSize = 'inherit';
    parentEl.style.fontWeight = 'inherit';
    if (parentEl.getBoundingClientRect().width < el.getBoundingClientRect().width) {
      const fontSizeVal = this.calcFontSize(el);
      this.setFontSize(parentEl, fontSizeVal);
      if (fontSizeVal <= 0.7) {
        this.setFontWeight(el, fontSizeVal);
      }
    }
  }

  /**
   *
   * @param {*} el Target element to resize
   * @returns Returns the font-size integer
   */
  calcFontSize(el) {
    const { width: max_width, height: max_height } = el.parentElement.getBoundingClientRect();
    const { width, height } = el.getBoundingClientRect();
    const fontSizeVal = Math.min(max_width / width, max_height / height);
    return fontSizeVal;
  }

  /**
   *
   * @param {*} parentEl Parent element that will have its font-size set
   * @param {*} fontSizeVal The integer returned from the calcFontSize function
   */
  setFontSize(parentEl, fontSizeVal) {
    const fontSize = `${fontSizeVal}em`;
    parentEl.style.fontSize = fontSize;
  }

  /**
   * This calculation aims to create a font-weight that improves legibility as
   * the font-size gets smaller.
   *
   * @param {*} fontSizeVal The integer returned from the calcFontSize function
   * @returns Returns the calculated font-weight as an integer
   */
  calcFontWeight(fontSizeVal) {
    return 1000 - fontSizeVal * 1000;
  }

  /**
   *
   * @param {*} el Target element to resize
   * @param {*} fontSizeVal The integer returned from the calcFontSize function
   */
  setFontWeight(el, fontSizeVal) {
    el.parentElement.style.fontWeight = this.calcFontWeight(fontSizeVal);
  }

  // START -- SCROLL TO -- START //
  /**
   *
   * @param {array} targetElement Target to add event listeners to
   * @param {array} bufferSpace A positive or negative number representing pixels at the top of the target element
   * @returns null
   */
  scrollTo(targetElement, bufferSpace) {
    const element = document.querySelector(targetElement);
    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: window.scrollY + element.getBoundingClientRect().top + bufferSpace,
    });
  }
}
// END -- SCROLL TO -- END //

customElements.define('window-display', WindowDisplay);
