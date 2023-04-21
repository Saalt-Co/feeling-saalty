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
    const checkedRadio = this.checkSelected(e);
    this.updateCardImage(checkedRadio);
    this.updateLinkUrl(checkedRadio);
    this.updatePrice(checkedRadio);
  }

  checkSelected(e) {
    let currentlySelected = e.target.closest('product-card-swatches').querySelector('input[type="radio"]:checked');
    currentlySelected.checked = false;
    e.target.previousSibling.checked = true;
    return e.target.closest('product-card-swatches').querySelector('input[type="radio"]:checked');
  }

  updateCardImage(checkedRadio) {
    const imgUrl = checkedRadio.dataset.imageUrl;
    const cardImg = checkedRadio
      .closest('.card-wrapper.product-card-wrapper')
      .querySelector('.media')
      .querySelector('img');
    cardImg.src = imgUrl;
    cardImg.srcset = this.createNewSrcsetVals(cardImg.srcset, imgUrl);
  }

  createNewSrcsetVals(srcset, replacement) {
    const splitSrcset = srcset.split(',');
    const cleanedUrl = replacement.replace(new RegExp(/(?:_)?\d+x/, 'g'), '');
    let srcsetString = '';
    for (const url of splitSrcset) {
      const size = url.split('&width=')[1];
      size ? (srcsetString += `${cleanedUrl}&width=${size}, `) : null;
    }
    srcsetString = srcsetString.slice(0, -2);
    return srcsetString;
  }

  updateLinkUrl(checkedRadio) {
    const cardLinks = checkedRadio.closest('.card-wrapper.product-card-wrapper').querySelectorAll('a');
    for (const linkEl of cardLinks) {
      linkEl.href = checkedRadio.dataset.variantUrl;
    }
  }

  updatePrice(checkedRadio) {
    const currentPrices = checkedRadio
      .closest('.card__content')
      .querySelector('.price__container')
      .querySelectorAll('.price-item');
    const regPrice = checkedRadio.dataset.variantPrice;
    // const compareAtPrice = checkedRadio.dataset.compareAtPrice;
    for (const priceEl of currentPrices) {
      priceEl.textContent = regPrice;
    }
  }
}

customElements.define('product-card-swatches', ProductCardSwatches);
