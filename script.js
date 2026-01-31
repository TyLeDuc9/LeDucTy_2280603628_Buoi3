const API_URL = "https://api.escuelajs.co/api/v1/products";

let products = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 5;
let priceAsc = true;
let titleAsc = true;

/* ================= GET ALL ================= */
async function getAllProducts() {
  const res = await fetch(API_URL);
  products = await res.json();
  filteredProducts = [...products];
  renderTable();
  renderPagination();
}

getAllProducts();

/* ================= RENDER TABLE ================= */
function renderTable() {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const data = filteredProducts.slice(start, end);

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach(item => {
    const imagesHtml = item.images
      .map(img => `<img src="${img}" />`)
      .join("");

    tbody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td><div class="images">${imagesHtml}</div></td>
        <td>${item.title}</td>
        <td>${item.category?.name || "N/A"}</td>
        <td>${item.price}</td>
      </tr>
    `;
  });
}

/* ================= SEARCH (onChange) ================= */
document.getElementById("searchInput").addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();

  filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(keyword)
  );

  currentPage = 1;
  clearActiveButtons();
  renderTable();
  renderPagination();
});

/* ================= PAGE SIZE ================= */
document.getElementById("pageSize").addEventListener("change", e => {
  pageSize = Number(e.target.value);
  currentPage = 1;
  renderTable();
  renderPagination();
});

/* ================= PAGINATION ================= */
function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button onclick="goPage(${i})">${i}</button>
    `;
  }
}

function goPage(page) {
  currentPage = page;
  renderTable();
}

/* ================= ACTIVE BUTTON ================= */
function clearActiveButtons() {
  document
    .querySelectorAll(".controls button")
    .forEach(btn => btn.classList.remove("active"));
}

/* ================= SORT ================= */
function sortByPrice(btn) {
  clearActiveButtons();
  btn.classList.add("active");

  filteredProducts.sort((a, b) =>
    priceAsc ? a.price - b.price : b.price - a.price
  );
  priceAsc = !priceAsc;
  renderTable();
}

function sortByTitle(btn) {
  clearActiveButtons();
  btn.classList.add("active");

  filteredProducts.sort((a, b) =>
    titleAsc
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );
  titleAsc = !titleAsc;
  renderTable();
}
