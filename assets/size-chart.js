class SizeChart extends HTMLElement {
  constructor() {
    super();

    this.tabClick = this.handleTabClick.bind(this);
  }
  connectedCallback() {
    const tabs = document.querySelectorAll('.size-chart-title-button');

    console.log(tabs);

    for (const tab of [...tabs]) {
      addEventListeners(tab, ['click', 'keydown'], [this.tabClick], false);
    }
  }
  disconnectedCallback() {}

  handleTabClick(e) {
    this.hideAllContent();
    this.showClickedContent(e);
  }

  getClickedIndex(e) {
    const splitName = e.target.name.split('-');
    return splitName[splitName.length - 1];
  }

  hideAllContent() {
    const contentContainers = document.querySelectorAll('.size-chart-content-container');
    for (const container of [...contentContainers]) {
      container.style.display = 'none';
      container.style.visibility = 'hidden';
    }
  }

  showClickedContent(e) {
    const tabIndex = this.getClickedIndex(e);
    const contentContainers = document.querySelectorAll('.size-chart-content-container');
    contentContainers[tabIndex - 1].style.display = 'block';
    contentContainers[tabIndex - 1].style.visibility = 'visible';
  }
}

customElements.define('size-chart', SizeChart);
