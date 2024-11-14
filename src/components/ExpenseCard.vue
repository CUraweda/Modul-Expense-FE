<template>
  <div class="card saldo-card">
    <div class="card-header">
      <span class="material-icons">shopping_cart_checkout</span>
      <span class="text">Pengeluaran</span>
      <select v-model="selectedFilter" @change="updateData">
        <option value="all">Semua</option> <!-- Tambahkan opsi Semua -->
        <option value="today">Hari ini</option>
        <option value="lastWeek">Minggu lalu</option>
        <option value="lastMonth">Bulan lalu</option>
      </select>
    </div>
    <div class="card-body">
      <p>{{ formatRupiah(saldo) }}</p> <!-- Format saldo sebagai Rupiah -->
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      saldo: 0, // Inisialisasi saldo dengan 0
      selectedFilter: "all", // Default filter: Semua
    };
  },
  methods: {
    async updateData() {
      try {
        const response = await axios.get("https://api-prmn.curaweda.com:5000/expenses/total", {
          params: { filter: this.selectedFilter }, // Kirim filter ke API
        });
        this.saldo = response.data.total; // Update saldo dengan total dari API
      } catch (error) {
        console.error("Error fetching total expenses:", error);
        alert("Gagal mengambil data total pengeluaran.");
      }
    },
    formatRupiah(value) {
      // Fungsi untuk memformat angka ke dalam Rupiah
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(value);
    },
  },
  mounted() {
    this.updateData(); // Panggil updateData ketika komponen di-mount
  },
};
</script>
  
  <style scoped lang="scss">
    .saldo-card {
    border: 2px solid var(--outline);
    border-radius: 8px;
    padding: 10px;
    margin: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: inline-block; /* Pastikan card menyesuaikan ukuran konten */
    width: max-content; /* Ukuran card akan mengikuti panjang konten */
    height: 10rem;
    
    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        .material-icons {
        color: var(--inactive);
        }

        .text {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--inactive);
        margin-left: 8px;
        padding-right: 2rem;
        }

        select {
        border: 2px solid var(--outline);
        background-color: var(--white);
        padding: 8px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: bold;
        }
    }

    .card-body {
        p {
        font-size: 2rem;
        font-weight: bold;
        margin-top: 1.8rem;
        }
    }
    }
</style>

  