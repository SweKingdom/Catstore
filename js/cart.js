function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
        <div class="cart-empty">
            <div class="empty-icon"></div>
            <p>Din kundvagn är tom.</p>
            <a href="cats.html">Bläddra bland katter →</a>
        </div>`;
        return;
    }

    container.innerHTML='';
    cart.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.dataset.id = cat.id

        const imgHtml = cat.imageUrl
            ? `<img class="cart-item-img" src="${cat.imageUrl}" alt="${cat.name}" onerror="this.src='images/placeholder.gif'">`
            : `<img class="cart-item-img" src="images/placeholder.gif" alt="No image">`;

        item.innerHTML = `
            ${imgHtml}
            <div class="cart-item-info">
                <div class="cart-item-name">${cat.name}</div>
                <div class="cart-item-origin"> ${cat.origin}</div>
            </div>
            <button class="btn-remove" aria-label="Ta bort ${cat.name}">Ta bort</button>
            `;

        item.querySelector('.btn-remove').addEventListener('click', () => {
            removeFromCart(cat.id);
            renderCartItems();
        });
        container.appendChild(item);
    });
}

function validateForm() {
  let valid = true;

  const name = document.getElementById('customer-name');
  const email = document.getElementById('customer-email');
  const address = document.getElementById('customer-address');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const addressError = document.getElementById('address-error');


  [name, email, address].forEach(el => el.classList.remove('invalid'));
  [nameError, emailError, addressError].forEach(el => el.textContent = '');

  if (!name.value.trim()) {
    name.classList.add('invalid');
    nameError.textContent = 'Vänligen ange ditt namn.';
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    email.classList.add('invalid');
    emailError.textContent = 'Vänligen ange en giltig e-postadress.';
    valid = false;
  }

  if (!address.value.trim()) {
    address.classList.add('invalid');
    addressError.textContent = 'Vänligen ange din leveransadress.';
    valid = false;
  }

  return valid;
}

function handleOrderSubmit(e) {
    e.preventDefault();
    
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty! Add some cats before ordering.');
        return;
    }

    if (!validateForm())
        return;

    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    const catList = cart.map(c => `• ${c.name} (${c.origin})`).join('\n');

    alert(
        `Thank you for your order, ${name}!\n\n` +
        `Confirmation will be sent to: ${email}\n` +
        `Delivery address: ${address}\n\n` +
        `Ordered cats:\n${catList}\n\n` +
        `We will contact you soon.`
    );

    localStorage.removeItem('catstore_cart');
    updateCartCount();
    document.getElementById('order-form').reset();
    renderCartItems();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    document.getElementById('order-form').addEventListener('submit', handleOrderSubmit);
});