class ProductCardSwatch extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', this.onButtonClick.bind(this));
  }

  onButtonClick(event) {
    event.preventDefault();
    // const previousValue = this.input.value;

    // event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
    // if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
    console.log(`${event}`);
  }

  connectedCallback = () => {
    console.log('HI');
    this.addEventListener('click', (e) => {
      console.log(`${e}`);
    });
  };
}

customElements.define('product-card-swatch', ProductCardSwatch);
