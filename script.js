function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function productList($QUERY) { 
  const itemSection = document.querySelector('.items');
  const itemList = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`)
    .then((response) => response.json())
    .then((object) => object);  

  itemList.results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    itemSection.appendChild(createProductItemElement({ sku, name, image }));
  });
}

window.onload = async () => {
  await productList('computador');
  const cartItems = document.querySelector('.cart__items');
  document.querySelectorAll('.item__add').forEach((item) => {
    item.addEventListener('click', async (e) => {
      const itemID = e.target.parentElement.querySelector('.item__sku').innerText;
      const itemDetails = await fetch(`https://api.mercadolibre.com/items/${itemID}`)
        .then((response) => response.json())
        .then((object) => object);
      const { id: sku, title: name, price: salePrice } = itemDetails;
      cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
    });
  });
};
