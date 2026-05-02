const products = [
  {
    name: "Rose of 1 - Pink",
    price: 4.99,
    imageSet: [
      "Images/product-imgs/product-1/IMG_7285.JPG",
      "Images/product-imgs/product-1/IMG_7281.JPG",
      "Images/product-imgs/product-1/IMG_7286.JPG",
      "Images/product-imgs/product-1/IMG_7330.JPG",
    ],
    image: "Images/product-imgs/product-1/IMG_7285.JPG",
    type: "pink",
    roseSet: 1,
    id: 1,
    no:1
  },
  {
    name: "Rose of 1 -Red",
    price: 4.99,
    imageSet: [
      "Images/product-imgs/product-3/IMG_7301.JPG",
      "Images/product-imgs/product-3/IMG_7302.JPG",
      "Images/product-imgs/product-3/IMG_7303.JPG",
      "Images/product-imgs/product-3/IMG_7333.JPG",
    ],
    image: "Images/product-imgs/product-3/IMG_7301.JPG",
    type: "red",
    roseSet: 3,
    id: 3,
    no:3
  },
  {
    name: "Rose of 1 - Red",
    price: 4.99,
    imageSet: [
      "Images/product-imgs/product-4/IMG_7305.JPG",
      "Images/product-imgs/product-4/IMG_7308.JPG",
      "Images/product-imgs/product-4/IMG_7310.JPG",
      "Images/product-imgs/product-4/IMG_7329.JPG",
    ],
    image: "Images/product-imgs/product-4/IMG_7305.JPG",
    type: "red",
    roseSet: 3,
    id: 4,
    no:4
  },
  {
  name: "Bouquet of 3 - Red",
  price: 8.99,
  imageSet: [
    "Images/product-imgs/product-5/IMG_7311.JPG",
    "Images/product-imgs/product-5/IMG_7312.JPG",
    "Images/product-imgs/product-5/IMG_7313.JPG",
    "Images/product-imgs/product-5/IMG_7331.JPG",
  ],
  image: "Images/product-imgs/product-5/IMG_7311.JPG",
  type: "red",
  roseSet: 3,
  id: 5,
  no:5
}
];

const qty = document.querySelector(".qty-no");
let qtyValue = parseInt(qty.innerText);
const qtyPlus = document.querySelector(".add");
const qtyMinues = document.querySelector(".minus");

const addToCartBtn = document.querySelector(".add-to-cart");

qtyPlus.addEventListener("click", () => {
  if (qtyValue < 10) {
  qtyValue++;
  qty.innerText = qtyValue;};
});

qtyMinues.addEventListener("click", () => {
  if (qtyValue > 1) {
    qtyValue--;
    qty.innerText = qtyValue;
  }
});

function showToastNotification(message) {
  const toastNoti = document.querySelector(".toast-noti");
  const toastProgress = document.querySelector(".toast-progress");
  const button = toastNoti.querySelector("button");


  if (!button.dataset.listenerAdded) {
    button.addEventListener("click", () => {
      toastNoti.style.opacity = 0;
      toastProgress.style.transition = "none";
      toastProgress.style.width = "0%";
    });
    button.dataset.listenerAdded = "true";
  }


  toastNoti.style.opacity = 1;


  toastProgress.style.transition = "none";
  toastProgress.style.width = "0%";


  void toastProgress.offsetWidth;

  toastProgress.style.transition = "width 2s linear";
  toastProgress.style.width = "100%";

  setTimeout(() => {
    toastNoti.style.opacity = 0;
  }, 2000);
};



addToCartBtn.addEventListener("click", () => {
  const productId = parseInt(addToCartBtn.getAttribute("data-id"));
  const name = addToCartBtn.dataset.name;
  const price = parseFloat(addToCartBtn.dataset.price);
  const image = addToCartBtn.dataset.image;
  const quantity = qtyValue;


  if (addToCartBtn.textContent.trim() === "Add to Cart") {

    addToCartBtn.innerHTML = `<span class="tick">✔</span> Added!`;
    

    showToastNotification(`${name} added to cart!`);


    setTimeout(() => {
      if (addToCartBtn.textContent.includes("Added")) {
        addToCartBtn.innerHTML = "Add to Cart";
      }
    }, 1000);
  };
  
  let cart;
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!Array.isArray(cart)) {
      cart = [];
    }
  } catch (e) {
    cart = [];
  };

  const existingProduct = cart.find(p => p.id === productId);

  if (existingProduct) {
    existingProduct.quantity += quantity; 
  } else {
    cart.push({ id: productId, name, price, imageSet: [image], quantity }); 
  };

  localStorage.setItem("cart", JSON.stringify(cart)); 

  updateCount();
});



const mainImg = document.querySelector(".product-img img");
const thumbnails = document.querySelectorAll(".product-imgs .img img");

thumbnails.forEach(thumb => {
  thumb.addEventListener("click", () => {

    mainImg.src = thumb.src;


    thumbnails.forEach(t => t.parentElement.classList.remove("active"));
    thumb.parentElement.classList.add("active");
  });
});

const relatedProductsContainer = document.querySelector(".related-imgs");

function renderRelatedProducts() {
  relatedProductsContainer.innerHTML = "";

  products.forEach(product => {
    const container = document.createElement("div");
    container.className = "related-img";

    container.innerHTML = `
      <div class="related-img-container">
          <div class="img">
          <img src="${product.imageSet[0]}" alt="${product.name}">
          </div>
          <a href="product${product.no}.html" class="related-img-link">
            <div class="text-container">
              <p>${product.name}</p>
              <p>£${product.price}</p>
            </div>
          </a>
    `;

    relatedProductsContainer.appendChild(container);
  });
};

const zoomContainer = document.querySelector(".product-img");
const zoomImg = zoomContainer.querySelector(".product-img img");

zoomContainer.addEventListener("mousemove", (e) => {
  const rect = zoomContainer.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  zoomImg.style.transform = "scale(2)";
  zoomImg.style.transformOrigin = `${x}% ${y}%`;
});

zoomContainer.addEventListener("mouseleave", () => {
  zoomImg.style.transform = "scale(1)";
  zoomImg.style.transformOrigin = "center center";
});

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

updateCount();


renderRelatedProducts();