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

    getCart(ui, http) {
        const cartPromise = http.get('https://gopuff-public.s3.amazonaws.com/dev-assignments/product/order.json').then(cartRes => {
            return cartRes.cart.products.map(product => {


                return {
                    id: product.product_id,
                    quantity: product.quantity,
                    price: product.price,
                    coupon: product.credit_coupon_price
                }
            });


        });

        Promise.all([cartPromise]).then(values => {
            const prodDescPromises = [];
            values[0].forEach(cartItem => {
                prodDescPromises.push(http.get(`https://prodcat.gopuff.com/api/products?location_id=-1&product_id=${cartItem.id}`));

            })

            Promise.all(prodDescPromises).then(descriptions => {
                let cartItems = values[0].map(v => {
                    const product = descriptions.find(d => d.products[0].product_id === v.id);
                    return { ...v, name: product.products[0].name, url: product.products[0].images[0].thumb };
                })
                ui.populateCart(cartItems, this.calculateCart(cartItems));
                Store.save('cart', cartItems);
            })


        })

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
            
              <h1>${item.name}</h1>
              <h2>Quanity: ${item.quantity}</h2>
              <h3>Price $${item.price}</h3>
              <h4>Sale Price: $${item.coupon}</h4>
              <button class="cart-remove-btn">Remove</button>
            `;
            cartContainer.appendChild(div);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const cartService = new CartService();
    const http = new Http();
    ui.bootstrap();
    cartService.getCart(ui, http);
});
