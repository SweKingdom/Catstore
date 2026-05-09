const API_URL = 'https://api.thecatapi.com/v1/breeds?limit=30';
const PAGE_SIZE = 10;

let allCats = []
let filteredCats
let CurrentPage = 1

async function fetchCats() {
    try {
        const response = await fetch(API_URL)
        if (!response.ok)
            throw new Error(`HTTP ${response.status}`);
        allCats = await response.json();
        filteredCats = allCats;
        renderPage(1);
    }
    catch (err) {
        document.getElementById('cat-list').innerHTML =
        `<p class = "no-result">Could not load cats. (${err.message})</p>`

    }
}


function renderPage(page) {
    currentPage = page;
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageCats = filteredCats.slice(start, end);

    renderCatList(pageCats);
    renderPagination();
}

function renderCatList(cats) {
    const container = document.getElementById('cat-list');
    container.innerHTML = '';

    if (cats.length === 0) {
        container.innerHTML = '<p class="no-results">No cats were found</p>';
        return;
    }

    cats.forEach(cat => {
    const card = catCard(cat);
    container.appendChild(card);
    });
}

function catCard(cat) {
    const card = document.createElement('article');
    card.className = 'cat-card';

    const imageUrl = cat.reference_image_id
        ? `https://cdn2.thecatapi.com/images/${cat.reference_image_id}.jpg`
        : 'images/placeholder.gif';
    const inCart = isInCart(cat.id);

    const imgHtml = `<img class="cat-card-img" src="${imageUrl}" alt="${cat.name}" loading="lazy" onerror="this.src='images/placeholder.gif'">`;
    card.innerHTML = `
    ${imgHtml}
    <div class="cat-card-body">
        <div class = "cat-card-name">${cat.name}</div>
        <div class = "cat-card-origin"> ${cat.origin || 'Unknown'}</div>
        <div class = "cat-card-desc">${cat.description || ''}</div>
    </div>
    <div class="cat-card-footer">
        <button class= "btn-add-cart ${inCart ? ' in-cart' : ''}" data-id = "${cat.id}">
        ${inCart ? 'Added to cart' : 'Add to cart'}
        </button>
    </div>
    `;

    const btn = card.querySelector('.btn-add-cart');
    btn.addEventListener('click', () => handleAddToCart(cat, btn));

    return card;
}

function handleAddToCart(cat, btn) {
    if (isInCart(cat.id))
        return;

    const added = addToCart({
        id: cat.id,
        name: cat.name,
        origin: cat.origin || 'Okänt',
        imageUrl: cat.reference_image_id
            ? `https://cdn2.thecatapi.com/images/${cat.reference_image_id}.jpg`
            : null,
    })

    if (added) {
        btn.textContent = 'Added to cart';
        btn.classList.add('in-cart');
    }
}

function renderPagination() {
    const container = document.getElementById('pagination');
    container.innerHTML = '';
    
    const totalPages = Math.ceil(filteredCats.length / PAGE_SIZE);
    if (totalPages <= 1)
        return;

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previusly';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => renderPage(currentPage - 1));
    container.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage)
            btn.classList.add('active');
        btn.addEventListener('click', () => renderPage(i));
        container.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next'
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => renderPage(currentPage + 1));
    container.appendChild(nextBtn);
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        filteredCats = query
        ? allCats.filter(cat => cat.name.toLowerCase().includes(query))
        : allCats;
    renderPage(1);
    });
    fetchCats();
});