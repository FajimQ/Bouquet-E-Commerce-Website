const productContainer = document.querySelector(".products");

let cart;
try {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!Array.isArray(cart)) {
    cart = [];
  }
} catch (e) {
  cart = [];
}

function renderProducts() {
  productContainer.innerHTML = "";
 
  cart.forEach(product => {
    const container = document.createElement("div");
    container.className = "product-container";

    container.innerHTML=`
    <div class="cart-product">
      <div class="cart-item">
        <div class="product-img-name">
          <div class="img">
          <img src="${product.imageSet[0]}" alt="${product.name}">          
          </div>
          <h3 class="name">${product.name}</h3>
        </div>
      <div class="quantity-controls" data-id="${product.id}">
      <p class="quantity-display">${product.quantity || 1} </p>
      <p class="change">Change</p>
      </div>
      <div class="price">
        $${product.price}
      </div>
      <div  class="remove" data-id="${product.id}">
        X
      </div>
    </div>
  </div>
    `;

    productContainer.appendChild(container);
  }); 

  if(cart.length === 0){
    productContainer.innerHTML = `
    <div class="empty-cart">
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything to your cart yet.</p>
    </div>
    `;
    updateTotals();
    updateCount();
    return;
  };

  const renmoveButtons = document.querySelectorAll(".remove");

  renmoveButtons.forEach(b => {
    b.addEventListener("click", () => {
      const productId = b.dataset.id;
      removeFromCart(productId);
      updateCount();
      updateTotals();
    });
  });

  function removeFromCart(productId) {
    cart = cart.filter(p => p.id !== parseInt(productId));
    localStorage.setItem("cart", JSON.stringify(cart));
    renderProducts();
    updateTotals();
    updateCount();
  };

  const changeButtons = document.querySelectorAll(".change");
  changeButtons.forEach(b => {
    b.addEventListener("click", () => {
      const parent = b.closest(".quantity-controls");
      const productId = parseInt(parent.dataset.id);
      const quantityDisplay = parent.querySelector(".quantity-display")

      const product = cart.find(p => p.id === productId);

      if(b.textContent === "Change"){
        b.textContent = "Done";
        quantityDisplay.innerHTML = `
        <button class="minus">-</button>
        <span class="editable-qty">${product.quantity || 1}</span>
        <button class="plus">+</button>
        `;

        const editableQty = quantityDisplay.querySelector(".editable-qty");

        quantityDisplay.querySelector(".plus").addEventListener("click",() => {
          product.quantity = (product.quantity || 1) + 1;
          editableQty.textContent = product.quantity;
          localStorage.setItem("cart", JSON.stringify(cart));
          updateTotals();
          updateCount();
        });

        quantityDisplay.querySelector(".minus").addEventListener("click", () => {
          if (product.quantity > 1) {
            product.quantity = (product.quantity || 1) - 1;
            editableQty.textContent = product.quantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateTotals();
            updateCount();
          } else {
            removeFromCart(productId);
            updateCount();
          };
        });
      } else {
        b.textContent = "Change";
        const editableQty = quantityDisplay.querySelector(".editable-qty");
        if(editableQty){
          product.quantity = parseInt(editableQty.textContent);
        };
        
        quantityDisplay.innerHTML = `${product.quantity || 1}`;
        localStorage.setItem("cart", JSON.stringify(cart));
      };
    });
  });


  function updateTotals(){
    let subtotal = 0;

    cart.forEach(product => {
      subtotal += (product.price * (product.quantity || 1));
    });

    const formattedSubtotal = `£${subtotal.toFixed(2)}`;
    const total = subtotal;

    document.querySelector(".sub-total").textContent = formattedSubtotal;
    document.querySelector(".total").textContent = `£${total.toFixed(2)}`;
  };

  updateTotals();

 
}

function updateCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.querySelector(".cart-count");

  cartCountEl.innerHTML = totalQuantity > 99 ? "99+" : totalQuantity;

  if (totalQuantity >= 10) {
    cartCountEl.style.right = "14px";
    cartCountEl.style.padding = "2px 6px";
  };
};


document.addEventListener("DOMContentLoaded", () => {
  const creditCard = document.querySelector(".Credit");
  const paypal = document.querySelector(".paypal");
  const cardHolder = document.querySelector(".card-holder-input");
  const cardNo = document.querySelector(".card-no");
  const expiry = document.querySelector(".expiry-date");
  const address = document.querySelector(".zip");
  const submit = document.querySelector(".pay");

  function showError(input, message) {
    let error = input.nextElementSibling;
    if (error && error.classList.contains("error-message")) {
      error.textContent = message;
    } else {
      error = document.createElement("div");
      error.className = "error-message";
      error.style.color = "red";
      error.style.fontSize = "0.85em";
      error.style.marginTop = "4px";
      error.textContent = message;
      input.parentNode.insertBefore(error, input.nextSibling);
    }
    input.classList.add("input-error");
  }


  function clearError(input) {
    let error = input.nextElementSibling;
    if (error && error.classList.contains("error-message")) {
      error.remove();
    }
    input.classList.remove("input-error");
  }


  cardNo?.addEventListener("input", () => {
    let digitsOnly = cardNo.value.replace(/\D/g, "");
    let groups = [];
    for (let i = 0; i < digitsOnly.length; i += 4) {
      groups.push(digitsOnly.substring(i, i + 4));
    }
    cardNo.value = groups.join(" ");
  });

  submit?.addEventListener("click", (e) => {
    e.preventDefault();

    if (!cardHolder || !cardNo || !expiry || !address) {
      console.error("Missing elements:", { cardHolder, cardNo, expiry, address });
      return;
    }

    const name = cardHolder.value.trim();
    const number = cardNo.value.replace(/\s/g, "");
    const exp = expiry.value.trim();
    const zip = address.value.trim();

    const isNameValid = /^[A-Za-z\s]+$/.test(name);
    const isCardValid = /^\d{13,19}$/.test(number);
    const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp); // MM/YY
    const isZipValid = /^\d{4,6}$/.test(zip);
    const isPaymentSelected = creditCard?.checked || paypal?.checked;

   
    [cardHolder, cardNo, expiry, address].forEach(clearError);
    if (creditCard) creditCard.classList.remove("input-error");
    if (paypal) paypal.classList.remove("input-error");

    let formValid = true;

    if (!isPaymentSelected) {
      if (creditCard) creditCard.classList.add("input-error");
      if (paypal) paypal.classList.add("input-error");
      alert("Please select a payment method");
      formValid = false;
    }

    if (!name) {
      showError(cardHolder, "Name is required");
      formValid = false;
    } else if (!isNameValid) {
      showError(cardHolder, "Name must contain only letters and spaces");
      formValid = false;
    }

    if (!number) {
      showError(cardNo, "Card number is required");
      formValid = false;
    } else if (!isCardValid) {
      showError(cardNo, "Card number must be 13 to 19 digits");
      formValid = false;
    }

    if (!exp) {
      showError(expiry, "Expiry date is required");
      formValid = false;
    } else if (!isExpiryValid) {
      showError(expiry, "Expiry must be in MM/YY format");
      formValid = false;
    }

    if (!zip) {
      showError(address, "Zip code is required");
      formValid = false;
    } else if (!isZipValid) {
      showError(address, "Zip code must be 4 to 6 digits");
      formValid = false;
    }

    if (formValid) {
      const nameInput = document.querySelector('.card-holder input');
      localStorage.setItem('customerName', nameInput.value);
      window.location.href = "confirmation.html";

    }
  });
});





renderProducts();
updateCount();