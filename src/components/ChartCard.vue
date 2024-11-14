<template>
  <div class="card saldo-card">
    <div class="card-header">
      <span class="material-icons">analytics</span><span class="text">Ringkasan Pengeluaran</span>
      <select v-model="selectedFilter" @change="updateData">
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
      </select>
    </div>
    <div class="card-body">
      <canvas ref="expensesChart"></canvas> <!-- Tempatkan canvas untuk chart -->
    </div>
  </div>
</template>

<script>
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip } from 'chart.js';
import axios from 'axios';

// Registrasi semua komponen yang dibutuhkan Chart.js, termasuk Tooltip
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip);

export default {
  data() {
    return {
      chart: null, // Variabel untuk menyimpan chart
      selectedFilter: "2024", // Default tahun
      valueData: [],
      months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'] // Nama bulan
    };
  },
  methods: {
    async updateData() {
      // Fetch data dari API
      try {
        const response = await axios.get("https://api-prmn.curaweda.com:5000/expenses/summary", {
          params: { year: this.selectedFilter }
        });

        
        const { costs } = response.data;
        console.log({costs});

        // Perbarui chart dengan data baru
        this.chart.data.labels = this.months; // Gunakan nama bulan sebagai label
        this.chart.data.datasets[0].data = costs;
        this.chart.update(); // Render ulang chart
        this.valueData = costs
      } catch (error) {
        console.error("Error fetching expenses summary:", error);
      }
    }
  },
  mounted() {
    // Inisialisasi chart setelah komponen ter-mount
    const ctx = this.$refs.expensesChart.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.months, // Inisialisasi dengan nama-nama bulan
        datasets: [{
          label: 'Total Pengeluaran',
          data: [], // Data diisi dari API
          borderColor: 'rgba(218, 165, 32, 1)',
          fill: false,
          tension: 0.1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Untuk membuat ukuran chart mengikuti card
        aspectRatio: 2,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Bulan' // Label untuk sumbu X
            },
            ticks: {
              // Atur rotasi label bulan menjadi 0 derajat (agar tetap lurus)
              maxRotation: 0, // Tidak ada rotasi
              minRotation: 0, // Pastikan tidak ada rotasi
            }
          },
          y: {
            title: {
              display: true,
              text: 'Total Pengeluaran (Rp)' // Label untuk sumbu Y
            },
            ticks: {
              // Mengatur kelipatan sumbu Y
              callback: function(value) {
                // Format angka dalam satuan Rp
                return `Rp ${value.toLocaleString()}`;
              },
              stepSize: 100000, // Kelipatan Rp 100.000
            },
            suggestedMin: 0, // Nilai minimum pada sumbu Y
            suggestedMax: 1000000, // Nilai maksimum pada sumbu Y (1 juta)
          }
        },
        // Tambahkan tooltip
        plugins: {
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                // Menampilkan total pengeluaran di bulan tersebut
                return `Total Pengeluaran: Rp ${tooltipItem.raw.toLocaleString()}`;
              }
            }
          }
        }
      }
    });

    // Panggil data pertama kali
    this.updateData();
  }
};
</script>


<style scoped lang="scss">
.saldo-card {
  border: 2px solid var(--outline);
  border-radius: 8px;
  padding: 10px;
  margin: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: inline-block;
  width: 100%; /* Mengubah width agar card menyesuaikan dengan container */
  max-width: 850px;
  height: auto; /* Sesuaikan height secara otomatis */

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
    padding: 0;
    canvas {
      width: 300%;  /* Membuat chart sesuai dengan lebar card */
      height: 300px; /* Atur tinggi chart */
    }
  }
}
</style>
