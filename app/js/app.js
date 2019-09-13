const cartBtn = document.querySelector('.cart-btn');
const cartCloseBtn = document.querySelector('.close-cart-btn');
const cartDom = document.querySelector('.cart');
const cartOverlayDom = document.querySelector('.cart-overlay');
class CartService {
    async getCart() {
        try {
            let result = await fetch('https://gopuff-public.s3.amazonaws.com/dev-assignments/product/order.json');
            return await result.json();
        } catch (error) {
            console.log(error);
        }
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
    const cartService = new CartService();
    const ui = new UI();

    ui.bootstrap();
    cartService.getCart().then(cart => {
        console.log(cart);
    });
})