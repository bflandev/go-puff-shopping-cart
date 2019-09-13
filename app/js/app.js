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

document.addEventListener("DOMContentLoaded", () => {

    const cartService = new CartService();
    cartService.getCart().then(cart => {
        console.log(cart);
    });
})