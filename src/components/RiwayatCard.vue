<template>
  <div class="table-card">
    <div class="card-header">
      <span class="title">Laporan</span>
      <div class="controls">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="search-bar"
        />
        <div class="filter-dropdown">
          <button @click="toggleFilter" class="filter-btn">
            <span class="material-icons">tune</span><p>Filter</p>
          </button>
          <div v-if="showFilter" class="filter-menu">
            <div>
              <strong>Jenis</strong>
              <div>
                <input
                  type="checkbox"
                  id="operational"
                  value="Operational"
                  v-model="selectedTypes"
                />
                <label for="operational">Operational</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="non-operational"
                  value="Non-Operational"
                  v-model="selectedTypes"
                />
                <label for="non-operational">Non-Operational</label>
              </div>
            </div>
            <div>
              <strong>Kategori</strong>
              <div>
                <input
                  type="checkbox"
                  id="honor"
                  value="Honor"
                  v-model="selectedCategories"
                />
                <label for="honor">Honor</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="PRIBADI"
                  value="PRIBADI"
                  v-model="selectedCategories"
                />
                <label for="pribadi">Pribadi</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="listrik"
                  value="Listrik"
                  v-model="selectedCategories"
                />
                <label for="listrik">Listrik</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="air"
                  value="Air"
                  v-model="selectedCategories"
                />
                <label for="air">Air</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Judul</th>
              <th @click="sortBy('date')">Tanggal
                <span class="material-icons sort-icon">
                  {{ sortKey === 'date' ? (sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down') : 'swap_vert' }}
                </span>
              </th>
              <th>Jenis</th>
              <th>Kategori</th>
              <th @click="sortBy('cost')">Biaya
                <span class="material-icons sort-icon">
                  {{ sortKey === 'cost' ? (sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down') : 'swap_vert' }}
                </span>
              </th>
              <!-- <th>Aksi</th> -->
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredTransactions" :key="index">
              <td>{{ item.title }}</td>
              <td>{{ item.date }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.category }}</td>
              <td>{{ formatRupiah(item.cost) }}</td> <!-- Format Rupiah -->
              <!-- <td><span class="material-icons more-icon">more_horiz</span></td> -->
              <td :class="{
                  'status-pending': item.status === 'Pending',
                  'status-setuju': item.status === 'Setuju',
                  'status-ditolak': item.status === 'Ditolak'
                }">
                {{ item.status }}
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Fungsi untuk memformat angka menjadi Rupiah
function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
}

// Data laporan transaksi
const transactions = ref([]); // Inisialisasi dengan array kosong

// State untuk pencarian dan filter
const searchQuery = ref('');
const selectedTypes = ref([]);
const selectedCategories = ref([]);
const showFilter = ref(false);

// Fungsi untuk menampilkan atau menyembunyikan menu filter
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

// Fungsi untuk mengambil data laporan dari API
const getExpenses = async () => {
  try {
    const response = await axios.get('https://api-prmn.curaweda.com:5000/expenses'); // Mengambil data dari API
    console.log('Data dari API:', response.data); // Log data dari API
    transactions.value = response.data; // Mengisi `transactions` dengan data dari API
  } catch (error) {
    console.error('Error fetching expenses:', error);
    alert('Terjadi kesalahan saat mengambil data laporan');
  }
};


// Panggil API saat komponen di-mount
onMounted(() => {
  getExpenses(); // Ambil data ketika komponen selesai di-mount
});

// Filter data berdasarkan input pencarian dan kategori
const filteredTransactions = computed(() => {
  return transactions.value.filter((transaction) => {
    const matchesSearchQuery = transaction.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesType =
      selectedTypes.value.length === 0 ||
      selectedTypes.value.includes(transaction.type);
    const matchesCategory =
      selectedCategories.value.length === 0 ||
      selectedCategories.value.includes(transaction.category);
    return matchesSearchQuery && matchesType && matchesCategory;
  });
});

// State untuk sorting
const sortKey = ref(null); // Menyimpan kolom yang sedang di-sort
const sortOrder = ref('asc'); // Menyimpan urutan, bisa 'asc' atau 'desc'

// Fungsi untuk sorting
const sortBy = (key) => {
  if (sortKey.value === key) {
    // Jika sudah disortir dengan kunci ini, toggle order-nya
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Jika kunci sorting berubah, set sortKey baru dan reset order ke 'asc'
    sortKey.value = key;
    sortOrder.value = 'asc';
  }

  // Lakukan sorting berdasarkan kunci dan urutan yang dipilih
  transactions.value.sort((a, b) => {
    let result = 0;

    // Sorting untuk angka (biaya)
    if (key === 'cost') {
      result = a.cost - b.cost;
    } else if (key === 'date') {
      // Sorting untuk tanggal
      result = new Date(a.date) - new Date(b.date);
    }

    return sortOrder.value === 'asc' ? result : -result;
  });
}
</script>


<style scoped lang="scss">
.table-card {
  width: 100%;
  max-width: 90rem;
  border: 2px solid var(--outline);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);



  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .controls {
      display: flex;
      align-items: center;

      .search-bar {
        padding: 8px;
        border-radius: 8px;
        border: 2px solid var(--outline);
        margin-right: 16px;
        font-size: 1rem;
        outline: none;
      }

      .filter-dropdown {
        position: relative;

        .filter-btn {
          font-weight: 700;
          display: flex;
          align-items: center;
          padding: 0.4rem;
          border: 2px solid var(--outline);
          border-radius: 8px;
          background-color: var(--white);
          cursor: pointer;
          

          p {
            padding-left: 0.7rem;
          }
        }

        .filter-menu {
          position: absolute;
          right: 0;
          top: 2.8rem;
          background-color: var(--white);
          border: 2px solid var(--outline);
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 8px;
          width: 200px;
          z-index: 10;
          transition: 0.3s ease-out;

          div {
            margin-bottom: 8px;
          }

          strong {
            display: block;
            margin-bottom: 4px;
          }

          label {
            margin-left: 4px;
          }
        }
      }
    }
  }

  .card-body {
    overflow-x: auto;

    .table-wrapper {
      max-height: 15.6rem;
      overflow-y: auto;
    }

    .sort-icon{
    color: var(--white);
    
    }

    table {
      width: 100%;
      border-collapse: collapse;

      th {
        text-align: left;
        background-color: var(--inactive);
        padding: 0.5rem;
        font-weight: 500;
        padding-left: 0.7rem;
        color: var(--white);
        position: sticky;
        top: 0;
        z-index: 1;
      }

      td {
        padding: 0.8rem;
        border-top: 1px solid var(--outline);
        font-weight: 500;
      }

      .detail-btn {
        color: var(--inactive);
        cursor: pointer;
        font-weight: 600;
        padding-right: 1.4rem;
      }

      .more-icon {
        color: var(--inactive);
        cursor: pointer;
        transition: 0.2s ease-out;
        padding-left: 0;

        &:hover {
          color: var(--grey);
        }
      }
    }
  }
}

.status-pending {
  color: orange; /* Green color */
}
.status-setuju {
  color: green; /* Green color */
}
.status-ditolak {
  color: red; /* Red color */
}
</style>
