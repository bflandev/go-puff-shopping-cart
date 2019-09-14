const cartBtn = document.querySelector('.cart-btn');
const cartCloseBtn = document.querySelector('.close-cart-btn');
const cartDom = document.querySelector('.cart');
const cartContainer = document.querySelector('.cart-container');
const cartOverlayDom = document.querySelector('.cart-overlay');
const items = document.querySelector('.items');
const total = document.querySelector('.total');
const savings = document.querySelector('.savings');

class CartService {
    calculateCart(cartItems) {
        let totalCost = 0;
        let totalItems = 0;
        let totalSavings = 0;

        Array.from(cartItems).forEach(item => {
            totalItems += item.quantity;
            totalCost += parseFloat((item.coupon * item.quantity).toFixed());
            totalSavings += parseFloat((item.price - item.coupon).toFixed());
        });

        return { totalCost, totalItems, totalSavings };

    }

}

class Http {
    async get(url) {
        try {
            let result = await fetch(url);
            return await result.json();
        } catch (error) {
            console.log(error);
        }
    }
}

class Store {
    static save(name, item) {
        localStorage.setItem(name, JSON.stringify(item));
    }
    static get(item) {
        return JSON.parse(localStorage.getItem(item));
    }

}

class UI {
    bootstrap() {
        cartBtn.addEventListener('click', () => {
            this.openCart();
        })
        cartCloseBtn.addEventListener('click', () => {
            this.closeCart();
        })
    }

    openCart() {
        cartDom.classList.add('cart-open');
        cartOverlayDom.classList.add('show-overlay');
    }
    closeCart() {
        cartDom.classList.remove('cart-open');
        cartOverlayDom.classList.remove('show-overlay');
    }
    populateCart(cartItems, totals) {

        items.appendChild(document.createTextNode(`${totals.totalItems} item(s)`));
        total.appendChild(document.createTextNode(`Subtotal: $${totals.totalCost}`));
        savings.appendChild(document.createTextNode(`Discount: $${totals.totalSavings}`));
        cartItems.forEach(item => {
            const div = document.createElement("div");
            div.classList.add('cart-item');
            div.setAttribute('data-id', item.id);
            div.innerHTML =
                `<img src="${item.url}" />
            <div>
              <h4>${item.name}</h4>
              <h5>quanity: ${item.quantity}</h5>
              <h6>$${item.price}</h6>
              <button class="cart-remove-btn">Remove</button>
            </div>`;
            cartContainer.appendChild(div);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const http = new Http();
    const ui = new UI();
    const cartService = new CartService();

    ui.bootstrap();
    http.get('https://gopuff-public.s3.amazonaws.com/dev-assignments/product/order.json').then(cartRes => {
        let items = cartRes.cart.products.map(product => {
            return {

                id: product.product_id,
                quantity: product.quantity,
                price: product.price,
                coupon: product.credit_coupon_price
            }
        });

        ui.populateCart(items, cartService.calculateCart(items));
        Store.save('cart', items);
    });


});
