const body = document.querySelector('body');
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const bookMenu= document.querySelector('.book-menu');
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const foodsDOM = document.querySelector(".grid");
const form = document.querySelector(".form");
const formOverlay = document.querySelector(".form-overlay");
const submitBtn = document.querySelector(".submit-btn");
const submitMsg =document.querySelector(".submit-msg");
const okBtn = document.querySelector(".ok-btn");
const fname = document.querySelector(".fname");
const lname = document.querySelector(".lname");
const date = document.querySelector(".date");
const time = document.querySelector(".time");
const guests = document.querySelector(".guests");


form.addEventListener('submit', (e)=> { 
  checkInputs();
  e.preventDefault();

  });

function checkInputs(){
  const fnameValue = fname.value.trim();
  const lnameValue = lname.value.trim();
  const dateValue = date.value.trim();
  const timeValue = time.value.trim();
  const guestsValue = guests.value.trim();

  if(fnameValue === ''  || fnameValue == null){
    setErrorFor(fname, 'First name cannot be blank');
  }else{
    setSuccessFor(fname);
  }

  if(lnameValue === ''  || lnameValue == null){
    setErrorFor(lname, ' Last name cannot be blank');
  }else{
    setSuccessFor(lname);
  }

   if(dateValue === ''){
    setErrorFor(date, ' Date cannot be blank');
  }else{
    setSuccessFor(date);
  }

   if(timeValue === ''){
    setErrorFor(time, ' Time cannot be blank');
  }else{
    setSuccessFor(time);
  }

   if(guestsValue === '') {
    setErrorFor(guests, ' Guests cannot be blank');
  }else if (guestsValue < 0){
    setErrorFor(guests, 'Invalid Number');
  }else if(guestsValue >20){
    setErrorFor(guests, 'Guests should not exceed 20');
  }else{
    setSuccessFor(guests);
  }

   if(isFormValid() == true){
    showModal();
    fname.value = '';
    lname.value = '';
    date.value = '';
    time.value = '';
    guests.value = ''; 
  }
    

}
function setErrorFor(input, message){
  const formControl = input.parentElement; // form-control
  const small = formControl.querySelector('small'); //small element is inside formControl
  
  small.innerText = message;
  formControl.className = ('form-control error')
}

function setSuccessFor(input){
  const formControl = input.parentElement;
    formControl.className = ('form-control success')
}

function isFormValid(){
  const formContainers = form.querySelectorAll('.form-control');
  let result = true;
    formContainers.forEach((container)=>{
     if(container.className ===('form-control error')){
      result = false;
     }
  }); 
  return result;
  }   


function showModal(){
    submitMsg.classList.remove('hidden');
    formOverlay.classList.remove('hidden');

  }

function hideModal(){
    submitMsg.classList.add('hidden');
    formOverlay.classList.add('hidden');
  }

okBtn.addEventListener('click', ()=> {
  hideModal();
});



//cart
let cart = [];
//buttons
let buttonsDom = [];
//get products
class Foods {
  async getFoods() {
    try {
      let result = await fetch("menu.json");
      let data = await result.json();
      let foods = data.items;
      // console.log(foods);
      foods = foods.map((item) => {
        const { title, price } = item.field;
        const { id } = item.sys;
        const image = item.field.image.fields.file.url;
        return { title, price, id, image };
      });
        return foods;
            } catch (error) {
      console.log(error);
    }
  }
}
//display products
class UI {
  displayFoods(foods) {
    let result = "";
    foods.forEach((food) => {
      result += `
            <article class="menu-section">
                <div class="img-container">
                    <img src= ${food.image} 
                    alt="products" 
                    class="menu-img">
                    
                    <div class="button-title">
                        <div class="title-price">
                          <p>${food.title}</p>
                          <h4>$${food.price}</h4>
                        </div>
                        <button class="bag-btn" data-id=${food.id}>add to cart                  
                        <img src="./img/tiny-cart.png" alt="cart" height="20px">
                        </button>
                        
                    </div>
                </div>
            </article>
            `;
    });
    foodsDOM.innerHTML = result;
  }
  getBagButtons(){
    const buttons = [...document.querySelectorAll(".bag-btn")];
    // console.log(buttons)
    buttonsDom = buttons;
    buttons.forEach(button => {
        let id = button.dataset.id;
        let inCart = cart.find(item =>item.id ===id);
        if(inCart){
            button.innerText = 'In Cart';
            button.disabled = true;
        }
        button.addEventListener('click', (event)=> {
        // console.log(event.target);
        event.target.innerText = 'In Cart';
        event.target.disabled = true;

        //get food from Foods
        let cartItem = {...Storage.getFoods(id), count: 1 };

        //add food to the cart
        cart = [...cart, cartItem];

        //save cart in local storage
        Storage.saveCart(cart);
        
        //set cart values
        this.setCartValues(cart);
      
        //display Cart Item
        this.addCartItem(cartItem);

        //show cart
        this.showCart();
        });
    });
  }

  setCartValues(){
    let tempTotal = 0;
    let itemsCount = 0;
    cart.map(item => {
        tempTotal+=item.price * item.count;
        itemsCount+=item.count;
    })
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsCount;

  }

  addCartItem(item){
    const div =document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
    <img src=${item.image}
    alt="food">
                        <div>
                            <h4>${item.title}</h4>
                            <h5>$${item.price}</h5>
                            <span class="remove-item" data-id = ${item.id}>Remove</span>
                        </div> 
                        <div>
                            <img src="img/chevron-up-15.png" alt="" class="chevron-up-15" data-id = ${item.id}>
                            <p class="item-amount">${item.count}</p>
                            <img src="img/chevron-down-15.png" alt="" class="chevron-down-15" data-id = ${item.id} >
                        </div>`;
                        cartContent.appendChild(div);
  }
 showCart(){
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart')
  }
  setupApp(){
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);

}
populateCart(cart){
    cart.forEach(item => this.addCartItem(item));
    
}
hideCart(){
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
}

cartLogic(){
  clearCartBtn.addEventListener('click', () => {
    this.clearCart();
  })

  //cart functionality
  cartContent.addEventListener('click', (event)=>{
    // console.log(event.target);
    if(event.target.classList.contains('remove-item')){
      let removeItem = event.target;
      // console.log(removeItem);
      let id = removeItem.dataset.id;
      cartContent.removeChild(removeItem.parentElement.parentElement);
      this.removeItem(id);
    }
     else if (event.target.classList.contains('chevron-up-15')){
      let addAmount = event.target;
      // console.log(addAmount);

      let id = addAmount.dataset.id;
      let tempItem = cart.find(item => item.id === id);
      tempItem.count = tempItem.count + 1;
      Storage.saveCart(cart);
      this.setCartValues(cart);
      addAmount.nextElementSibling.innerText = tempItem.count;
    } 
    else if (event.target.classList.contains('chevron-down-15')){
      let lowerAmount = event.target;
      let id = lowerAmount.dataset.id;
      let tempItem = cart.find(item => item.id === id);
      tempItem.count = tempItem.count - 1;
      if(tempItem.count > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.count; 
      }
      else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement); 
          this.removeItem(id);
        }       
    }
  });
}

clearCart(){
  // console.log(this);
  let cartItems = cart.map(item => item.id)
  // console.log(cartItems);
  cartItems.forEach(id => this.removeItem(id));
  // console.log(cartContent.children);
  while(cartContent.children.length>0){
    cartContent.removeChild(cartContent.children[0])
  }
  this.hideCart();
}

removeItem(id){
  cart = cart.filter(item => item.id !== id);
  this.setCartValues(cart);
  Storage.saveCart(cart);
  let button = this.getSingleButton(id);
  button.disabled = false;
  button.innerHTML = `add to cart <img src="./img/tiny-cart.png" alt="cart">
                      `;
}

getSingleButton(id){
return buttonsDom.find(button => button.dataset.id === id)
  }

  
}



class Storage {
  static saveFoods(foods) {
    localStorage.setItem("foods", JSON.stringify(foods));
  }
  static getFoods(id) {
    let foods = JSON.parse(localStorage.getItem("foods"));
    return foods.find((food) => food.id === id);
  }
  static saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
    
  }
  static getCart(){
   return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
}
}  



document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const foods = new Foods();
  //setup app
    ui.setupApp()
  //get all products
    foods.getFoods().then((foods) => {
    ui.displayFoods(foods);
    Storage.saveFoods(foods);
  }).then(() => {
    ui.getBagButtons();
    ui.cartLogic();
  })
});
