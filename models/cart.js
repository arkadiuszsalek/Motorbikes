module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;
   
    // add to cart
    this.add = function (name,price, id) {
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = { item: name, id:id, quantity: 0, price: 0 };
        }
        cartItem.quantity++;
        cartItem.price = price * cartItem.quantity;
        this.totalItems++;
        this.totalPrice += price;
    };
    
    // remove from cart
    this.remove = function (id) {
        this.totalItems -= this.items[id].quantity;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
    // get from cart
    this.getItems = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};