<template>
  <div>
    <!-- Loading Overlay -->
    <div class="loading-overlay" :class="{ active: isLoading }">
      <div class="loader"></div>
    </div>
    
    <!-- Toast Notification -->
    <div class="toast" :class="{ show: showToast }">
      {{ toastMessage }}
    </div>
    
    <!-- Header -->
    <header>
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <h1>Invoice Generator</h1>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <div class="container">
      <h1>Select Items for Invoice</h1>
      <p class="subtitle">Choose products and services to include in your invoice</p>
      
      <form id="items-form" @submit.prevent>
        <!-- Customer Information Form -->
        <div class="form-container">
          <h2 class="form-title">Customer Information</h2>
          <div class="form-row">
            <div class="form-group" :class="{ active: customerData.name }">
              <input 
                type="text" 
                id="customer_name" 
                v-model="customerData.name" 
                required 
                @focus="setFieldActive('name', true)"
                @blur="setFieldActive('name', false)"
              />
              <label for="customer_name">Customer Name</label>
            </div>
            <div class="form-group" :class="{ active: customerData.email }">
              <input 
                type="email" 
                id="customer_email" 
                v-model="customerData.email" 
                required 
                @focus="setFieldActive('email', true)"
                @blur="setFieldActive('email', false)"
              />
              <label for="customer_email">Customer Email</label>
            </div>
            <div class="form-group" :class="{ active: customerData.number }">
              <input 
                type="text" 
                id="customer_number" 
                v-model="customerData.number" 
                required 
                @focus="setFieldActive('number', true)"
                @blur="setFieldActive('number', false)"
              />
              <label for="customer_number">Mobile Number</label>
            </div>
          </div>
        </div>
        
        <!-- Selection Summary -->
        <div class="selection-summary" :class="{ active: selectedItems.length > 0 }">
          <div class="summary-title">
            <h2>Selected Items</h2>
            <span class="summary-count">{{ selectedItems.length }}</span>
          </div>
          <div class="summary-items">
            <div 
              v-for="item in selectedItems" 
              :key="item.item_id"
              style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"
            >
              <span>{{ item.name }}</span>
              <span>{{ item.price }}</span>
            </div>
          </div>
          <div class="summary-total">
            <span>Total:</span>
            <span class="total-price">₹{{ totalPrice.toFixed(2) }}</span>
          </div>
        </div>
        
        <!-- Category Sections -->
        <div v-for="(items, category) in itemData" :key="category" class="category-section">
          <div class="category-title">
            <h2>{{ formatCategoryName(category) }}</h2>
          </div>
          <div class="category-items">
            <div 
              v-for="item in items" 
              :key="item.item_id"
              class="item"
              :class="{ selected: isItemSelected(item.item_id) }"
              @click="toggleItemSelection(item)"
            >
              <div class="item-checkbox"></div>
              <img :src="item.img" :alt="item.name" />
              <p class="item-name">{{ item.name }}</p>
              <p class="item-price">{{ item.price }}</p>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons">
          <button type="button" @click="generateDocument('invoice')" class="btn btn-primary">
            Generate Invoice
          </button>
          <button type="button" @click="generateDocument('bill')" class="btn btn-outline">
            Generate Bill
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoiceGenerator',
  data() {
    return {
      itemData: {},
      selectedItems: [],
      customerData: {
        name: '',
        email: '',
        number: ''
      },
      activeFields: {
        name: false,
        email: false,
        number: false
      },
      isLoading: false,
      showToast: false,
      toastMessage: ''
    };
  },
  computed: {
    totalPrice() {
      return this.selectedItems.reduce((total, item) => {
        const priceValue = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
        return total + priceValue;
      }, 0);
    }
  },
  mounted() {
    this.fetchItemData();
  },
  methods: {
    async fetchItemData() {
      try {
        this.isLoading = true;
        
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
          this.showToastMessage('Authentication token not found');
          return;
        }

        const response = await fetch('/vsa/create-invoice', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          this.itemData = result.data;
        } else {
          this.showToastMessage(result.message || 'Failed to fetch items');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        this.showToastMessage('Error fetching product data');
      } finally {
        this.isLoading = false;
      }
    },
    
    formatCategoryName(category) {
      return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    },
    
    setFieldActive(field, isActive) {
      if (isActive || this.customerData[field]) {
        this.activeFields[field] = true;
      } else {
        this.activeFields[field] = false;
      }
    },
    
    isItemSelected(itemId) {
      return this.selectedItems.some(item => item.item_id === itemId);
    },
    
    toggleItemSelection(item) {
      const existingIndex = this.selectedItems.findIndex(selected => selected.item_id === item.item_id);
      
      if (existingIndex > -1) {
        // Remove item
        this.selectedItems.splice(existingIndex, 1);
      } else {
        // Add item
        this.selectedItems.push({
          item_id: item.item_id,
          item_type: item.item_type,
          name: item.name,
          price: item.price
        });
      }
    },
    
    validateForm() {
      if (!this.customerData.name || !this.customerData.email || !this.customerData.number) {
        this.showToastMessage('Please fill in all customer information fields');
        return false;
      }
      
      if (this.selectedItems.length === 0) {
        this.showToastMessage('Please select at least one item');
        return false;
      }
      
      return true;
    },
    
    async generateDocument(type) {
      if (!this.validateForm()) {
        return;
      }
      
      try {
        this.isLoading = true;
        
        const data = {
          items: this.selectedItems.map(item => ({
            item_name: item.name,
            item_id: item.item_id,
            item_type: item.item_type,
            price: item.price
          })),
          customer_name: this.customerData.name,
          customer_email: this.customerData.email,
          customer_number: this.customerData.number
        };
        
        const endpoint = type === 'invoice' ? '/generateInvoice' : '/generateBill';
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = type === 'invoice' ? 'Invoice_VSA.pdf' : 'Bill_VSA.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showToastMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully!`);
        
      } catch (error) {
        console.error('Error:', error);
        this.showToastMessage(`Error generating ${type}. Please try again.`);
      } finally {
        this.isLoading = false;
      }
    },
    
    showToastMessage(message) {
      this.toastMessage = message;
      this.showToast = true;
      
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
:root {
  --primary: #4361ee;
  --primary-hover: #3a56d4;
  --light-bg: #f8f9fa;
  --border-color: #e0e0e0;
  --text-color: #333;
  --text-secondary: #666;
  --success: #4CAF50;
  --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  color: var(--text-color);
  line-height: 1.6;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  padding: 1rem 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h1 {
  font-size: 1.5rem;
  color: var(--primary);
  margin: 0;
}

h1, h2, h3 {
  color: #2b2d42;
  margin-bottom: 1rem;
}

.subtitle {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  text-align: center;
}

/* Form Styles */
.form-container {
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-title {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.5rem;
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;
  width: 100%;
  padding: 0 0.5rem;
}

@media (min-width: 768px) {
  .form-group {
    width: 33.33%;
  }
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 1rem;
  transition: var(--transition);
}

.form-group input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  outline: none;
}

.form-group label {
  position: absolute;
  top: 0;
  left: 0.5rem;
  transform: translateY(-50%);
  background-color: white;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: var(--transition);
  pointer-events: none;
}

.form-group.active label {
  top: 0;
  transform: translateY(-50%);
  color: var(--primary);
}

/* Category Section */
.category-section {
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.category-title {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.category-title h2 {
  margin-bottom: 0;
  font-size: 1.25rem;
}

.category-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

@media (min-width: 576px) {
  .category-items {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (min-width: 992px) {
  .category-items {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

.item {
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  background-color: white;
  transition: var(--transition);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.item.selected {
  border-color: var(--primary);
  background-color: rgba(67, 97, 238, 0.05);
}

.item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.item-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-weight: 700;
  color: var(--primary);
  font-size: 1rem;
}

.item-checkbox {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  transition: var(--transition);
}

.item.selected .item-checkbox {
  background-color: var(--primary);
  border-color: var(--primary);
}

.item.selected .item-checkbox::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

@media (min-width: 576px) {
  .action-buttons {
    flex-direction: row;
    justify-content: center;
  }
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-outline {
  background-color: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

.btn-outline:hover {
  background-color: var(--primary);
  color: white;
}

/* Mobile Optimizations */
@media (max-width: 575.98px) {
  .form-title, .category-title h2 {
    font-size: 1.25rem;
  }
  
  .subtitle {
    font-size: 0.875rem;
  }
  
  .form-container, .category-section {
    padding: 1rem;
  }
  
  .btn {
    width: 100%;
  }
}

/* Selection Summary */
.selection-summary {
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: none;
}

.selection-summary.active {
  display: block;
}

.summary-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-title h2 {
  margin-bottom: 0;
}

.summary-count {
  background-color: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
}

.summary-items {
  margin-bottom: 1rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

/* Loading Indicator */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: var(--transition);
}

.loading-overlay.active {
  visibility: visible;
  opacity: 1;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Toast Notification */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: var(--success);
  color: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(150%);
  transition: transform 0.3s ease;
  z-index: 1001;
}

.toast.show {
  transform: translateY(0);
}
</style>