class ProductCardSwatches extends HTMLElement {
  constructor() {
    super();

    this.swatches = this.querySelectorAll('.variant_swatch');
    this.swatchClick = this.handleSwatchClick.bind(this);
  }

  connectedCallback() {
    const swatchWrapper = this;
    const list = swatchWrapper.swatches;
    for (const key in list) {
      if (Object.hasOwnProperty.call(list, key)) {
        const element = list[key];
        element.addEventListener('click', this.swatchClick);
      }
    }
  }

  disconnectedCallback() {
    const swatchWrapper = this;
    const list = swatchWrapper.swatches;
    for (const key in list) {
      if (Object.hasOwnProperty.call(list, key)) {
        const element = list[key];
        element.removeEventListener('click', this.swatchClick);
      }
    }
  }

  handleSwatchClick(e) {
    e.preventDefault();
    this.checkSelected(e);
  }

  checkSelected(e) {
    let currentlySelected = e.target.closest('product-card-swatches').querySelector('input[type="radio"]:checked');
    currentlySelected.checked = false;
    e.target.previousSibling.checked = true;
  }
}

customElements.define('product-card-swatches', ProductCardSwatches);
