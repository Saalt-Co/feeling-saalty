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
    this.toggleSaleBadge(checkedRadio);
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
    const closestCardEl = checkedRadio.closest('.card__content');
    const priceEl = closestCardEl
      .querySelector('.card__information')
      .querySelector('.card-information')
      .querySelector('.price');
    const closestPriceContainer = closestCardEl.querySelector('.price__container');
    const salePriceContainer = closestPriceContainer.querySelector('.price__sale');
    const regPriceContainer = closestPriceContainer.querySelector('.price__regular');
    const compareAtPrice = checkedRadio.dataset.variantCompareAtPrice;
    const regPrice = checkedRadio.dataset.variantPrice;

    if (compareAtPrice && regPrice !== compareAtPrice) {
      priceEl.classList.add('price--on-sale');
      salePriceContainer.querySelector('.price-item.price-item--sale').textContent = regPrice;
      salePriceContainer.querySelector('.price-item.price-item--regular').textContent = compareAtPrice;
      regPriceContainer.querySelector('.price-item.price-item--regular').textContent = regPrice;
    } else {
      priceEl.classList.remove('price--on-sale');
      regPriceContainer.querySelector('.price-item.price-item--regular').textContent = regPrice;
      salePriceContainer.querySelector('.price-item.price-item--regular').textContent = regPrice;
    }
  }

  toggleSaleBadge(checkedRadio) {
    const price = checkedRadio.dataset.variantPrice;
    const compareAtPrice = checkedRadio.dataset.variantCompareAtPrice;
    const badgeEls = checkedRadio.closest('.card').querySelectorAll('.badge');
    if (compareAtPrice && price < compareAtPrice) {
      for (const badgeEl of badgeEls) {
        badgeEl.classList.add('visible');
      }
    } else {
      for (const badgeEl of badgeEls) {
        badgeEl.classList.remove('visible');
      }
    }
  }
}

customElements.define('product-card-swatches', ProductCardSwatches);
