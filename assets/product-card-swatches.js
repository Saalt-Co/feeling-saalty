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

  handleSwatchClick(e) {
    e.preventDefault();
    const target = e.target;
    console.log(`${target.querySelector('.swatch-name-tooltip').textContent}`);
  }
}

customElements.define('product-card-swatches', ProductCardSwatches);
