class CartCountBubble extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.updateBubble();
  }
  disconnectedCallback() {}

  getBubbleClasses() {
    this.jsonVals = this.jsonVals || JSON.parse(document.querySelector('[id*="CartCountBubbleClasses"]').innerHTML);
    return this.jsonVals;
  }

  updateBubble() {
    waitForElementToExist('.cart-count-bubble').then((element) => {
      const classVals = this.getBubbleClasses();
      element.style.background = `rgb(var(--palette-color-${classVals['bg-color']}))`;
      element.querySelector('.cart-count-number').style.color = `rgb(var(--palette-color-${classVals['text-color']}))`;
    });
  }
}

customElements.define('cart-count-bubble', CartCountBubble);
