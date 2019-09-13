const cartBtn = document.querySelector('.cart-btn');
const cartCloseBtn = document.querySelector('.close-cart-btn');
const cartDom = document.querySelector('.cart');
const cartOverlayDom = document.querySelector('.cart-overlay');
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
    static save(item) {
        localStorage.setItem(`${item}`, JSON.stringify(item));
    }
    static get(item) {
        return JSON.parse(localStorage.getItem(`${item}`));
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
}

document.addEventListener("DOMContentLoaded", () => {
    const http = new Http();
    const ui = new UI();

    ui.bootstrap();
    http.get('https://gopuff-public.s3.amazonaws.com/dev-assignments/product/order.json').then(cart => {
        Store.save(cart);
    }).then(() => {

    })

});
