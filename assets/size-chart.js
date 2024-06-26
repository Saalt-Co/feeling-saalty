class SizeChart extends SaaltModal {
  constructor() {
    super();
    this.tabs = null;
    this.contentContainers = null;
    this.tabClick = this.handleTabClick.bind(this);
  }

  connectedCallback() {
    this.tabs = this.querySelectorAll('.size-chart-tab-title-button');
    this.contentContainers = this.querySelectorAll('.size-chart-content-container');

    for (const tab of [...this.tabs]) {
      addEventListeners(tab, ['click', 'keydown'], [this.tabClick], false);
    }

    this.sanitizeSizeChartTable();
  }

  disconnectedCallback() {
    for (const tab of [...this.tabs]) {
      removeEventListeners(tab, ['click', 'keydown'], [this.tabClick], false);
    }
  }

  handleTabClick(e) {
    this.disableAllActiveTabs();
    this.setActiveTab(e);
    this.hideAllContent();
    this.showClickedContent(e);
  }

  getClickedIndex(e) {
    const splitName = e.target.name.split('-');
    return splitName[splitName.length - 1];
  }

  setActiveTab(e) {
    e.target.classList.add('active');
  }

  disableAllActiveTabs() {
    this.bulkRemoveClass([...this.tabs], 'active');
  }

  hideAllContent() {
    this.bulkRemoveClass([...this.contentContainers], 'visible');
  }

  removeClass(element, className) {
    element.classList.remove(className);
  }

  bulkRemoveClass(elements, className) {
    for (const element of [...elements]) {
      this.removeClass(element, className);
    }
  }

  showClickedContent(e) {
    const tabIndex = this.getClickedIndex(e);
    [...this.contentContainers][tabIndex - 1].classList.add('visible');
  }

  sanitizeSizeChartTable() {
    const tableEl = this.querySelector('size-chart table');
    const attrs = ['width', 'height', 'style'];
    this.recursivelyRemoveAttributes(tableEl, attrs);
  }

  removeAttributes(element, attributesArray) {
    for (const attr of attributesArray) {
      element.removeAttribute(attr);
    }
  }

  recursivelyRemoveAttributes(element, attrs) {
    this.removeAttributes(element, attrs);
    for (const child of [...element.children]) {
      this.removeAttributes(child, attrs);
      this.recursivelyRemoveAttributes(child, attrs);
    }
  }
}

customElements.define('size-chart', SizeChart);
