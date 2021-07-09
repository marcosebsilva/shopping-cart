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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
async function updateTotal(itemID, operator) {
  const itemPrice = await fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((object) => object.price);
  const totalDiv = document.querySelector('.total-price');
  const currentTotal = parseFloat(totalDiv.innerText);
  if (operator === 'remove') {
    let newTotal = ((currentTotal - itemPrice) * 100) / 100;
    if (newTotal < 0) {
      newTotal = 0;
    }
    totalDiv.innerText = `${newTotal}`;
  } else if (operator === 'add') {
    const newTotal = currentTotal + itemPrice;
    totalDiv.innerText = `${newTotal}`;
  }
}
function cartItemClickListener(event) {
  updateTotal(event.target.dataset.id, 'remove');
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.dataset.id = sku;
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

function addToCartHandler() {
  const cartItems = document.querySelector('.cart__items');
  const addButtonsList = document.querySelectorAll('.item__add');
  addButtonsList.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const itemID = event.target.parentElement.querySelector('.item__sku');
      const itemDetails = await fetch(`https://api.mercadolibre.com/items/${itemID.innerText}`)
        .then((response) => response.json())
        .then((object) => object);
      cartItems.appendChild(createCartItemElement(itemDetails));
      console.log(event.target.parentElement);
      updateTotal(itemID.innerText, 'add');
    });
  });
}

function clearCart() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => item.remove());
  const totalDiv = document.querySelector('.total-price');
  totalDiv.innerText = '0';
}

window.onload = async () => {
  await productList('computador');
  addToCartHandler();
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
};
