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
    name: "Rose of 1 - Blue",
    price: 4.99,
    imageSet: [
      "Images/product-imgs/product-2/IMG_7295.JPG",
      "Images/product-imgs/product-2/IMG_7296.JPG",
      "Images/product-imgs/product-2/IMG_7298.JPG",
      "Images/product-imgs/product-2/IMG_7335.JPG",
    ],
    image: "Images/product-imgs/product-2/IMG_7295.JPG",
    type: "blue",
    roseSet: 2,
    id: 2,
    no:2
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
    name: "Rose of 1 - Pink",
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

const productContainer = document.querySelector(".products");

const searchBar = document.querySelector(".search");
const searchBtn = document.querySelector(".search-btn");




function renderProducts(productList){
  productContainer.innerHTML = ""; 

  productList.forEach( product => {
    const container = document.createElement("div");
    container.className = "product-container";

    container.innerHTML = `
      <div class="product-image">
      <div class="slider-track">
        ${product.imageSet.map(img => `<img src="${img}" alt="${product.name}">`).join("")}
      </div>
        <div class="arrow left"><</div>
        <div class="arrow right">></div>
        <div class="dots">
          ${product.imageSet.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}"></span>`).join("")}
        </div>
      </div>
      <a href="product${product.no}.html" class="product-link">
       <div class="name-price">
          <div class="name">${product.name}</div>
          <div class="price">£${product.price}</div>
        </div>
      </a>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;

    productContainer.appendChild(container);
  });

  const addToButton = document.querySelectorAll(".add-to-cart");


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

function searchEngine(){
  let result = [...products];

  const searchText = searchBar.value.trim();
  const lowerSearch = searchText.toLowerCase();

  if(lowerSearch){
    result = result.filter(p => p.name.toLowerCase().includes(lowerSearch));
  } ;

  renderProducts(result);
};

searchBtn.addEventListener("click", () => {
  searchEngine();
});

searchBar.addEventListener("keydown", e => {
  if(e.key === "Enter"){
  searchEngine();}

});


  const toastNoti = document.querySelector(".toast-noti");

  addToButton.forEach(button => {
    button.addEventListener("click",() => {
      const productId = button.dataset.id;
       if(button.innerHTML === "Add to Cart") {
        button.innerHTML = `<span class="tick"> ✔ </span> Added!`;
        showToastNotification(toastNoti);
        setTimeout(() => {
          button.innerHTML = "Add to Cart";
        }, 1000); 
        
      };
      addToCart(productId);
    });
  });

  initImageSliders();
};

function addToCart(productId) {
  let cart;
try {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!Array.isArray(cart)) {
    cart = [];
  }
} catch (e) {
  cart = [];
}
  const product = products.find(p => p.id === parseInt(productId));

  if(!product) return;

  const existingProduct = cart.find(p => p.id === parseInt(productId));

  if(existingProduct){
    existingProduct.quantity += 1; 
  } else{
    cart.push({...product, quantity: 1});
  };

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCount();
};
 

let currentFilter = null;
let currentSort = null;

function applyFilterAndSort() {
  let result = [...products];


  if (currentFilter) {
    result = result.filter(p => p.type === currentFilter);
  }


  if (currentSort === "price-low-high") {
    result.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high-low") {
    result.sort((a, b) => b.price - a.price);
  }

  renderProducts(result);
};

document.getElementById("filter-select").addEventListener("change", (e) => {
  currentFilter = e.target.value || null;
  applyFilterAndSort();
});

document.getElementById("sort-select").addEventListener("change", (e) => {
  currentSort = e.target.value || null;
  applyFilterAndSort();
});
renderProducts(products);

function initImageSliders() {
  document.querySelectorAll(".product-container").forEach(container => {
    let currentIndex = 0;

    const sliderTrack = container.querySelector(".slider-track");
    const images = container.querySelectorAll(".slider-track img");
    const dots = container.querySelectorAll(".dot");
    const nextButton = container.querySelector(".arrow.right");
    const prevButton = container.querySelector(".arrow.left");

    const totalImages = images.length;

    function updateSlide() {
      const offset = -currentIndex * 100;
      sliderTrack.style.transform = `translateX(${offset}%)`;
      updateDots();
    }

    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalImages;
      updateSlide();
    });

    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      updateSlide();
    });

    updateSlide();
  });
};

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




renderProducts(products);
updateCount();
initImageSliders();