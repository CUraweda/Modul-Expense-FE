<template>
    <div class="kategori-card">
      <div class="kategori-header" @click="toggleDropdown">
        <p>Prive</p>
        <span :class="{'rotate': isOpen}">▼</span>
      </div>
  
      <div v-if="isOpen" class="kategori-content">
        <div class="add-category-container">
          <input v-model="newCategory" placeholder="Nama kategori baru" />
          <button class="add-category" @click="confirmAddCategory">Tambah</button>
        </div>
  
        <div v-for="(category, index) in categories" :key="index" class="category-item">
          <span class="material-icons" @click="confirmRemoveCategory(index)">remove</span>
          <p>{{ category }}</p>
        </div>
      </div>
  
      <div v-if="showRemoveAlert" class="alert-card">
        <p>Apakah yakin ingin hapus?</p>
        <div class="alert-buttons">
          <button @click="removeCategory(confirmIndex)">Ya</button>
          <button @click="cancelRemoveCategory">Tidak</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Kategori',
    data() {
      return {
        isOpen: false,
        categories: ['Pulsa', 'Kuota'],
        newCategory: '',
        showRemoveAlert: false,
        confirmIndex: null,
      };
    },
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen;
      },
      confirmAddCategory() {
        if (this.newCategory) {
          this.categories.push(this.newCategory);
          this.newCategory = '';
        }
      },
      confirmRemoveCategory(index) {
        this.confirmIndex = index;
        this.showRemoveAlert = true;
      },
      removeCategory(index) {
        this.categories.splice(index, 1);
        this.showRemoveAlert = false;
      },
      cancelRemoveCategory() {
        this.showRemoveAlert = false;
      }
    }
  };
  //tet
  </script>
  
  <style scoped lang="scss">
  .kategori-card {
    max-width: max-content;
    border: 2px solid var(--outline);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  
  .kategori-header {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  
  .kategori-header p {
    font-weight: 700;
    margin: 0;
  }
  
  .kategori-header span {
    padding-left: 1rem;
    // transition: transform 0.3s ease-out;
  }
  
  .kategori-header .rotate {
    transform: rotate(180deg);
  }
  
  .kategori-content {
    border-top: 2px solid var(--outline);
    padding: 10px;
  }
  
  .add-category-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  
  .add-category-container input {
    flex: 1;
    padding: 6px;
    border: 1px solid var(--outline);
    border-radius: 4px;
  }
  
  .add-category {
    background-color: var(--green-kkc);
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-top: 1px solid #e5e5e5;
  }
  
  .category-item p {
    margin: 0;
    font-size: 14px;
  }
  
  .category-item span {
    cursor: pointer;
    color: #e74c3c;
  }
  
  .alert-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: 2px solid var(--outline);
    z-index: 10;
    text-align: center;
  }
  
  .alert-buttons {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  
  .alert-buttons button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .alert-buttons button:first-child {
    background-color: var(--green-kkc);
    color: white;
  }
  
  .alert-buttons button:last-child {
    background-color: #ccc;
  }
  </style>
  