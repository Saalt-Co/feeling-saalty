class WindowDisplay extends HTMLElement {
  constructor() {
    super();

    this.windowFeatureClick = this.handleWindowFeatureClick.bind(this);
  }

  connectedCallback() {
    const windowFeatures = document.querySelectorAll('.window-feature');
    for (const feature of [...windowFeatures]) {
      addEventListeners(feature, ['click', 'keydown'], [this.windowFeatureClick], false);
    }
  }

  disconnectedCallback() {
    // do something
  }

  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  filterByClicked(e) {
    if (!a11yClick(e)) return;
    console.log(e.target.closest('.window-feature-wrapper'));
  }

  handleWindowFeatureClick(e) {
    this.filterByClicked(e);

    if (this.isTouchDevice() == false) return;
    const clickedParent = e.target.closest('.window-feature');
    clickedParent.querySelector('.text-wrapper').classList.toggle('visible');
  }
}

customElements.define('window-display', WindowDisplay);
