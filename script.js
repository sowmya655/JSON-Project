// 1. Global variables
let isEditing = false;
let editingId = null;

// 2. Form submit listener
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  isEditing ? updateProduct() : addProduct();
});

// 3. Function to get form data
function getProductFormData() {
  return {
    id: document.getElementById("productId").value,
    name: document.getElementById("productName").value,
    price: document.getElementById("price").value,
    quantity: document.getElementById("quantity").value
  };
}

// 4. Add product
function addProduct() {
  const product = getProductFormData();
  fetch("http://localhost:3000/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  }).then(() => {
    resetForm();
    fetchProducts();
  });
}

// 5. Update product
function updateProduct() {
  const updatedProduct = getProductFormData();
  fetch(`http://localhost:3000/products/${editingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProduct)
  }).then(() => {
    resetForm();
    fetchProducts();
  });
}

// 6. Edit product (load form for editing)
function editProduct(id) {
  fetch(`http://localhost:3000/products/${id}`)
    .then(res => res.json())
    .then(prod => {
      document.getElementById("productId").value = prod.id;
      document.getElementById("productName").value = prod.name;
      document.getElementById("price").value = prod.price;
      document.getElementById("quantity").value = prod.quantity;
      isEditing = true;
      editingId = id;
      document.getElementById("submitBtn").innerText = "Update Product";
      showSection("home"); // Go back to home to edit
    });
}

// 7. Delete product
function deleteProduct(id) {
  if (confirm("Are you sure you want to delete the product?")) {
    fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE"
    }).then(() => fetchProducts());
  }
}

// 8. Fetch and display products
function fetchProducts() {
  fetch("http://localhost:3000/products")
    .then(res => res.json())
    .then(data => {
      renderTable(data, "homeTable");     // For Home section
      renderTable(data, "productTable");  // For Products section
    });
}

// 9. Render any table
function renderTable(data, tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach(prod => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${prod.id}</td>
      <td>${prod.name}</td>
      <td>${prod.price}</td>
      <td>${prod.quantity}</td>
      <td>
        <button onclick="editProduct('${prod.id}')">Update</button>
        <button onclick="deleteProduct('${prod.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// 10. Reset form after submit/update
function resetForm() {
  document.getElementById("productForm").reset();
  document.getElementById("submitBtn").innerText = "Add Product";
  isEditing = false;
  editingId = null;
}

// 🔽 11. ✅ ⏹️ PLACE THIS FUNCTION HERE: show/hide sections
function showSection(section) {
  document.getElementById("home").style.display = "none";
  document.getElementById("products").style.display = "none";
  document.getElementById("about").style.display = "none";

  document.getElementById(section).style.display = "block";

  if (section === "home" || section === "products") {
    fetchProducts();
  }
}

// 12. Auto-show Home section on page load
window.onload = () => showSection("home");
