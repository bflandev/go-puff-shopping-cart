const cartBtn = document.querySelector('.cart-btn');
const cartCloseBtn = document.querySelector('.close-cart-btn');
const cartDom = document.querySelector('.cart');
const cartOverlayDom = document.querySelector('.cart-overlay');
const items = document.querySelector('.items');
const total = document.querySelector('.total');
const savings = document.querySelector('.savings');

class CartService {
    static calculateCart(cartItems) {
        let totalCost = 10;
        let totalItems = 0;
        let totalSavings = 0;

        return { totalCost, totalItems, totalSavings };

    }

    static createCart(cart, http) {
        let cartItems = [];
        cart.products.map(product => {

            http.get(`https://prodcat.gopuff.com/api/products?location_id=-1&product_id=${product.product_id}`).then(productsRes => {

                let prodDetails = productsRes.products[0];
                let cartItem = {
                    id: product.product_id,
                    quantity: product.quantity,
                    price: product.price,
                    coupon: product.credit_coupon_price,
                    name: prodDetails.name,
                    thumbnail: prodDetails.images[0].thumb

                };

                cartItems.push(cartItem)
            });




        });
        console.log(cartItems);
        return cartItems
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
    populateCart(cartItems) {

        const totals = CartService.calculateCart(cartItems);
        items.appendChild(document.createTextNode(`${totals.totalItems} item(s)`));
        total.appendChild(document.createTextNode(`$${totals.totalCost}`));
        savings.appendChild(document.createTextNode(`$${totals.totalSavings}`));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const http = new Http();
    const ui = new UI();

    ui.bootstrap();
    http.get('https://gopuff-public.s3.amazonaws.com/dev-assignments/product/order.json').then(cartRes => {
        const cart = CartService.createCart(cartRes.cart, http);
        ui.populateCart(cart);

    });

});
