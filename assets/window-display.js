class WindowDisplay extends HTMLElement {
  constructor() {
    super();

    this.windowFeatureClick = this.handleWindowFeatureClick.bind(this);
  }

  connectedCallback() {
    const windowFeatures = document.querySelectorAll('.window-feature');
    const windowFeatureBtns = document.querySelectorAll('.window-feature-button');
    for (const feature of [...windowFeatures, ...windowFeatureBtns]) {
      addEventListeners(feature, ['click', 'keydown'], [this.windowFeatureClick], false);
    }
  }

  disconnectedCallback() {
    const windowFeatures = document.querySelectorAll('.window-feature');
    const windowFeatureBtns = document.querySelectorAll('.window-feature-button');
    for (const feature of [...windowFeatures, ...windowFeatureBtns]) {
      removeEventListeners(feature, ['click', 'keydown'], [this.windowFeatureClick], false);
    }
  }

  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
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
      return el.innerText.trim() === clickedName;
    })[0];
    try {
      foundMatch.closest('details').querySelector(`input[value='${clickedVal}']`).click();
    } catch (error) {
      console.error(error);
      console.warn(
        `Could not find a match for ${e.target.closest('.window-feature-wrapper').dataset.filterName}: ${
          e.target.closest('.window-feature-wrapper').dataset.filterVal
        }`
      );
    }
  }
}

customElements.define('window-display', WindowDisplay);
