function getCart() {
    try {
        return JSON.parse(localStorage.getItem('catstore_cart')) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('catstore_cart'. JSON.stringify(cart));
}

function updateCartCount() {
    const count = document.getElementById('cartCount');
    if (count) {
        count.textContent = getCart().length;
    }
}


function addToCart(cat) {
    const cart = getCart();
    const already = cart.find(c => c.id === cat.id);
    if (!already) {
        cart.push(cat);
        saveCart(cart);
    }
    updateCartCount();
    return !already;
}

function removeFromCart(catId) {
    const cart = getCart().filter(c => c.id !== catId);
    saveCart(cart);
    updateCartCount();
}

function isInCart(catId) {
  return getCart().some(c => c.id === catId);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});