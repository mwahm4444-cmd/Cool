let cart = [];

// عرض المنتجات في الصفحة
function displayProducts() {
    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = products.map(product => {
        return `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="price">${product.price} ر.س</div>
                    <button class="add" onclick="addToCart(${product.id})">
                        إضافة للحقيبة 🛒
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// إضافة منتج للسلة
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showNotification(`تمت إضافة "${product.name}" إلى حقيبتك ✨`);
}

// تحديث محتوى السلة والإجمالي
function updateCart() {
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    // حساب إجمالي عدد القطع
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalCount;

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #888;">
                <p style="font-size: 18px; margin-bottom: 5px;">حقيبة التسوق فارغة 🛍️</p>
                <small>استمتع بتصفح مجموعتنا واختر ما يناسبك</small>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map((item, index) => {
            return `
                <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <div>
                        <strong style="font-size: 15px; color: #111;">${item.name}</strong>
                        <div style="font-size: 13px; color: #666; margin-top: 4px;">
                            ${item.price} ر.س × ${item.quantity}
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: bold; font-size: 15px;">${item.price * item.quantity} ر.س</span>
                        <button class="remove" onclick="removeFromCart(${index})" title="حذف المنتج">
                            ✕
                        </button>
                    </div>
                </div>
            `;
        }).join("");
    }

    // حساب المبلغ الإجمالي
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = total;
}

// حذف منتج من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// فتح السلة
function openCart() {
    const modal = document.getElementById("cartModal");
    if (modal) modal.style.display = "block";
}

// إغلاق السلة
function closeCart() {
    const modal = document.getElementById("cartModal");
    if (modal) modal.style.display = "none";
}

// إتمام الطلب وتحويله للواتساب
function checkout() {
    if (cart.length === 0) {
        showNotification("حقيبة التسوق فارغة حالياً 🛒");
        return;
    }

    let phone = "966570554138"; // استبدله برقم واتساب متجرك الحقيقي
    let message = "مرحباً، أود إتمام طلب الشراء التالي:\n\n";

    cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name} (العدد: ${item.quantity}) - ${item.price * item.quantity} ر.س\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nالإجمالي النهائي: ${total} ر.س\n\nأرجو تزويدي ببيانات الدفع والتوصيل.`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
}

// إشعار أنيق يظهر أسفل الشاشة
function showNotification(text) {
    let toast = document.getElementById("toast-notification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-notification";
        toast.style.cssText = `
            position: fixed;
            bottom: 25px;
            right: 25px;
            background: #111;
            color: #fff;
            padding: 12px 24px;
            border-radius: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            font-size: 14px;
            z-index: 1000;
            transition: opacity 0.3s, transform 0.3s;
            opacity: 0;
            transform: translateY(20px);
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = text;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
    }, 3000);
}

// إغلاق السلة عند الضغط خارجها
window.onclick = function(event) {
    const modal = document.getElementById("cartModal");
    if (event.target === modal) {
        closeCart();
    }
};

// تشغيل الموقع
displayProducts();
updateCart();
