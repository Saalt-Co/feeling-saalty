class WindowDisplay extends HTMLElement {
  constructor() {
    super();

    this.windowFeatureClick = this.handleWindowFeatureClick.bind(this);
  }

  connectedCallback() {
    this.addEventListeners();
  }

  disconnectedCallback() {
    // do something
  }

  handleWindowFeatureClick(e) {
    if (window.innerWidth > 749) return;
    const clickedParent = e.target.closest('.window-feature');
    clickedParent.querySelector('.text-wrapper').classList.toggle('visible');
  }

  addEventListeners() {
    const windowFeatures = this.querySelectorAll('.window-feature');
    for (const feature of windowFeatures) {
      for (const childEl of feature.children) childEl.addEventListener('click', this.windowFeatureClick, false);
    }
  }

  removeEventListeners() {
    const windowFeatures = this.querySelectorAll('.window-feature');
    for (const feature of windowFeatures) {
      feature.addEventListener('click', this.windowFeatureClick, false);
    }
  }
}

customElements.define('window-display', WindowDisplay);
