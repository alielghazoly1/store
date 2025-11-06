let drawer = document.getElementById('sideDrawer');
let overlay = document.getElementById('overlay');
let closeDrawerBtn = document.getElementById('closeDrawer');
let cartBtn = document.getElementById('cartBtn');
let favBtn = document.getElementById('favBtn');
let drawerTitle = document.getElementById('drawerTitle');
let drawerContent = document.getElementById('drawerContent');
let products = document.getElementById('products');
let numberOfCart = document.getElementById('numberOfCart');
let numberOflove = document.getElementById('numberOflove');

let myCart = [];
let myFav = [];

// open & close sidebar
function openDrawer(title, content) {
  drawerTitle.textContent = title;
  drawerContent.innerHTML = content;
  drawer.classList.remove('translate-x-full');
  overlay.classList.remove('hidden');
}
function closeDrawer() {
  drawer.classList.add('translate-x-full');
  overlay.classList.add('hidden');
}

closeDrawerBtn.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

// fetch data
fetch('https://dummyjson.com/products')
  .then((response) => response.json())
  .then((data) => {
    data.products.forEach((myData) => {
      let myproduct = document.createElement('div');
      myproduct.className =
        'bg-white w-64 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 relative group';

      myproduct.innerHTML = `
        <button id="fav-${myData.id}" onclick="toggleFav(${myData.id}, this)"
          class="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-600 hover:text-red-500 transition z-20">
          <i class="fa-solid fa-heart"></i>
        </button>
        <img src="${myData.images[0]}" alt="${myData.title}"
          class="w-full h-60 object-cover group-hover:scale-105 transition duration-300">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-1">${myData.title}</h3>
          <p class="text-gray-500 text-sm mb-3 line-clamp-2">${myData.description}</p>
          <div class="flex justify-between items-center">
            <span class="text-blue-600 font-bold text-lg">${myData.price} ج.م</span>
            <button onclick="addToCart(${myData.id}, '${myData.title}', ${myData.price}, '${myData.images[0]}')"
              class="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1">
              <i class="fa-solid fa-cart-plus"></i> أضف للسلة
            </button>
          </div>
        </div>
      `;
      products.appendChild(myproduct);
    });
  });

// add to cart
function addToCart(id, title, price, image) {
  const exists = myCart.some((item) => item.id === id);
  if (exists) return showPopup('المنتج موجود بالفعل في السلة', 'error');

  myCart.push({ id, title, price, image });
  numberOfCart.innerHTML = myCart.length;
  updateCartView();
  showPopup('تم اضافه المنتج بنجاح');
}
//  show cart
function updateCartView() {
  let cartHTML = myCart
    .map(
      (item) => `
      <div class="flex items-center justify-between border-b py-3">
        <img src="${item.image}" class="w-14 h-14 rounded-lg object-cover" alt="${item.title}">
        <div class="flex-1 mx-3">
          <h3 class="font-semibold text-gray-800">${item.title}</h3>
          <p class="text-sm text-gray-500">${item.price} ج.م</p>
        </div>
        <button class="text-red-500 hover:text-red-600" onclick="removeFromCart(${item.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `
    )
    .join('');

  drawerContent.innerHTML =
    cartHTML || '<p class="text-gray-500 text-center mt-5">السلة فارغة 🛒</p>';
}

// delate on my cart
function removeFromCart(id) {
  myCart = myCart.filter((item) => item.id !== id);
  numberOfCart.innerHTML = myCart.length;
  updateCartView();
}
function toggleFav(id, btn) {
  const exists = myFav.some((item) => item.id === id);
  if (exists) {
    myFav = myFav.filter((item) => item.id !== id);
    btn.classList.remove('text-red-500');
    btn.classList.add('text-gray-600');
  } else {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((product) => {
        myFav.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0],
        });
        btn.classList.remove('text-gray-600');
        btn.classList.add('text-red-500');
        numberOflove.innerHTML = myFav.length;
      });
  }
  updateFavView();
}

// handel my data in dom
function updateFavView() {
  let favHTML = myFav
    .map(
      (item) => `
    <div class="flex items-center justify-between border-b py-3">
    <img src="${item.image}" class="w-14 h-14 rounded-lg object-cover" alt="${item.title}">
    <div class="flex-1 mx-3">
    <h3 class="font-semibold text-gray-800">${item.title}</h3>
    <p class="text-sm text-gray-500">${item.price} ج.م</p>
        </div>
        <button class="text-red-500 hover:text-red-600" onclick="removeFromFav(${item.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
        </div>
    `
    )
    .join('');
  numberOflove.innerHTML = myFav.length;
  drawerContent.innerHTML =
    favHTML || "<p class='text-gray-500 text-center mt-5'>المفضلة فارغة ❤️</p>";
}

// delate from fav
function removeFromFav(id) {
  myFav = myFav.filter((item) => item.id !== id);
  updateFavView();
  const btn = document.getElementById(`fav-${id}`);
  if (btn) {
    btn.classList.remove('text-red-500');
    btn.classList.add('text-gray-600');
  }
  numberOflove.innerHTML = myFav.length;
}

cartBtn.addEventListener('click', () => {
  updateCartView();
  openDrawer('🛒 السلة', drawerContent.innerHTML);
});

favBtn.addEventListener('click', () => {
  updateFavView();
  openDrawer('❤️ المفضلة', drawerContent.innerHTML);
});

// maseage whene onclick addToCart & addToLove
function showPopup(message, type = 'success') {
  const oldPopup = document.getElementById('popupMessage');
  if (oldPopup) oldPopup.remove();
  const popup = document.createElement('div');
  popup.id = 'popupMessage';
  popup.className = `
    fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
    px-6 py-3 rounded-2xl text-white text-lg font-semibold shadow-lg
    transition-all duration-300 z-[9999]
    ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
  `;
  popup.textContent = message;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.classList.add('opacity-0', 'scale-90');
    setTimeout(() => popup.remove(), 300);
  }, 2000);
}
