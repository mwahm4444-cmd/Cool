let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 1;
const productsPerPage = 4; // عدد المنتجات في كل صفحة (يمكنك تعديل الرقم)
let currentCategory = 'all';

// التصفية والتنقل المباشر مع التمرير السلس
function filterProducts(category) {
    currentCategory = category;
    currentPage = 1;

    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    displayProducts();

    // الانقضاض/التمرير التلقائي السلس لقسم المنتجات عند الضغط على الصنف
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// عرض المنتجات وتطبيق تعدد الصفحات
function displayProducts() {
    const container = document.getElementById("products");
    const paginationContainer = document.getElementById("pagination");
    if (!container) return;

    // 1. تصفية المنتجات حسب الصنف
    const filteredProducts = currentCategory === 'all' 
        ? products 
        : products.filter(p => p.category === currentCategory);

    if (filteredProducts.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px;">لا توجد منتجات حالياً في هذا القسم.</p>`;
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    // 2. تقسيم المنتجات حسب رقم الصفحة
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // 3. عرض بطاقات المنتجات
    container.innerHTML = paginatedProducts.map(product => {
        return `
            <div class="product" onclick="openProductModal(${product.id})">
                <div class="product-img-wrapper">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="price">${product.price} ر.س</div>
                    <button class="add" onclick="event.stopPropagation(); addToCart(${product.id})">
                        إضافة للحقيبة 🛒
                    </button>
                </div>
            </div>
        `;
    }).join("");

    // 4. إنشاء أزرار التنقل بين الصفحات
    renderPagination(filteredProducts.length);
}

// رسم أزرار الترقيم (1, 2, 3...)
function renderPagination(totalItems) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalItems / productsPerPage);
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `
            <button class="page-btn ${activeClass}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    paginationContainer.innerHTML = paginationHTML;
}

// التبديل إلى صفحة محددة
function goToPage(page) {
    currentPage = page;
    displayProducts();

    const productsSection = document.getElementById("products-section");
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// نافذة عرض تفاصيل المنتج بشكل واضحة ومكشوفة بالكامل
function openProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const modal = document.getElementById("productModal");
    const content = document.getElementById("productModalDetails");

    content.innerHTML = `
        <div class="product-detail-layout">
            <div class="product-detail-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="detail-price">${product.price} ر.س</div>
                <p class="detail-desc">قطع مختارة بعناية بتصميم عصري وجودة عالية.</p>
                <button class="add-large-btn" onclick="addToCart(${product.id}); closeProductModal();">
                    إضافة للحقيبة 🛒
                </button>
            </div>
        </div>
    `;

    modal.style.display = "flex";
}

function closeProductModal() {
    document.getElementById("productModal").style.display = "none";
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(item => item.id === id);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    openCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    if (cartCount) cartCount.innerText = cart.reduce((sum, i) => sum + i.quantity, 0);

    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = "<p style='text-align:center; padding: 20px; color:#888;'>الحقيبة فارغة حالياً</p>";
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div>
                        <h4 style="margin:0">${item.name}</h4>
                        <p style="margin:0; font-size:12px; color:#666">${item.price} ر.س × ${item.quantity}</p>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="background:#ff4d4d; color:white; border:none; padding:4px 8px; border-radius:6px; cursor:pointer">إزالة</button>
                </div>
            `).join("");
        }
    }

    if (cartTotal) {
        cartTotal.innerText = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function openCart() {
    document.getElementById("cartModal").style.display = "flex";
}

function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}

function checkout() {
    if (cart.length === 0) return alert("السلة فارغة!");
    let message = "طلب جديد من المتجر:\n\n";
    cart.forEach(item => { message += `• ${item.name} (العدد: ${item.quantity}) - ${item.price * item.quantity} ر.س\n`; });
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nالإجمالي: ${total} ر.س`;
    window.open(`https://wa.me/966578132021?text=${encodeURIComponent(message)}`, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
    displayProducts();
    updateCart();
});
