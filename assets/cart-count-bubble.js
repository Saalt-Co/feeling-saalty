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
      if (!element.classList.contains('bg') && classVals.bg !== '') {
        element.classList.add(classVals.bg);
      }
      if (!element.classList.contains('text') && classVals.text !== '') {
        element.classList.add(classVals.text);
      }
    });
  }
}

customElements.define('cart-count-bubble', CartCountBubble);
