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
    waitForElementToExist('window-display').then(() => this.windowResize());
    waitForElementToExist('window-display').then((element) => {
      console.log('The element exists', element);
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

  isTouchDevice() {
    return (
      matchMedia('(hover: none), (pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  handleWindowFeatureClick(e) {
    this.toggleVisibility(e);
    this.filterByClicked(e);
  }

  toggleVisibility(e) {
    if (this.isTouchDevice() == false || e.target.classList.contains('window-feature-button')) return;
    const clickedParent = e.target.closest('.window-feature-wrapper');
    clickedParent.querySelector('.text-wrapper').classList.toggle('visible');
  }

  filterByClicked(e) {
    if (!a11yClick(e)) return;
    if (this.isTouchDevice() == true && !e.target.classList.contains('window-feature-button')) {
      e.preventDefault();
      return;
    }
    this.applyFilter(e);
  }

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

  handleWindowResize(e) {
    debounce(this.handleResizeText(e), 500);
  }

  handleResizeText(e) {
    const windowFeatures = document.querySelectorAll('.window-feature');
    for (const feature of [...windowFeatures]) {
      this.resizeText(feature);
    }
  }

  resizeText(windowFeatureEl) {
    const feature = windowFeatureEl;
    const titleWrapper = feature.querySelector('.window-feature-title');
    const featureWindowTitlePara = titleWrapper.querySelector('p');
    if (!titleWrapper) return;
    titleWrapper.style.fontSize = 'inherit';
    if (feature.getBoundingClientRect().width < featureWindowTitlePara.getBoundingClientRect().width) {
      const { width: max_width, height: max_height } = titleWrapper.getBoundingClientRect();
      const { width, height } = titleWrapper.children[0].getBoundingClientRect();
      titleWrapper.style.fontSize = `${Math.min(max_width / width, max_height / height)}em`;
    }
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
