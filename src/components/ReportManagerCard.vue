<template>
  <div class="kelola-laporan">
    <div class="laporan-container">
      <table class="laporan-table">
        <thead>
          <tr>
            <!-- <th>No.</th> -->
            <th>Id.</th>
            <th>Judul</th>
            <th>Tanggal</th>
            <th>Jenis</th>
            <th>Pelapor</th>
            <th>Biaya</th>
            <th>Status</th>
            <th>Aksi</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in laporanData" :key="index">
            <!-- <td>{{ index + 1 }}</td> -->
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.reporter }}</td>
            <td>{{ formatCurrency(item.cost) }}</td>
            <td>
              <span :class="statusClass(item.status)">
                {{ item.status }}
              </span>
            </td>
            <td>
              <select v-if="item.status === 'Pending'" v-model="item.selectedAction">
                <option value="" disabled>Status</option>
                <option value="Setuju">Setuju</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </td>
            <td>
              <input
                v-if="item.status === 'Pending'"
                v-model="item.komentar"
                type="text"
                placeholder="Beri komentar.."
              />
              <p v-else>{{ item.komentar }}</p>
            </td>
            <td>
              <button
                v-if="item.status === 'Pending'"
                class="save-btn"
                @click="saveLaporan(index)"
              >
                Save
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      laporanData: [], // Awalnya kosong, akan diisi dari API
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("https://api-prmn.curaweda.com:5000/expenses/verif");
        this.laporanData = response.data.map(item => ({
          ...item,
          selectedAction: '' // Tambahkan properti untuk pilihan aksi
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(value);
    },
    async saveLaporan(index) {
      const laporan = this.laporanData[index];
      
      if (!laporan.selectedAction || !laporan.komentar) {
        alert('Silakan pilih status dan beri komentar.');
        return;
      }
      
      try {
        // Kirim id sebagai bagian dari body request
        const response = await axios.put("https://api-prmn.curaweda.com:5000/expenses/update-status", {
          id: laporan.id, // Asumsi id ada pada laporan
          status: laporan.selectedAction,
          komentar: laporan.komentar,
        });

        if (response.status === 200) {
          laporan.status = laporan.selectedAction;
          alert(response.data.message || "Status berhasil diperbarui.");
        } else {
          alert("Gagal memperbarui status. Coba lagi nanti.");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        // Tampilkan pesan error dari server jika ada
        const errorMessage = error.response?.data?.message || "Gagal memperbarui status.";
        alert(errorMessage);
      }
    },
    statusClass(status) {
      if (status === 'Setuju') return 'approved';
      if (status === 'Ditolak') return 'rejected';
      return '';
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>


<style scoped>
.kelola-laporan {
  padding: 0.2rem;
  border-radius: 10px;
}

h1 {
  color: var(--green-kkc);
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.laporan-container {
  border: 2px solid var(--outline);
  border-radius: 8px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.03);
  overflow-x: auto; /* Tambahkan overflow horizontal jika diperlukan */
}

.laporan-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  table-layout: fixed; /* Memastikan lebar kolom tetap */
}

.laporan-table th,
.laporan-table td {
  padding: 10px;
  text-align: left;
  font-size: 0.9em;
  border-bottom: 2px solid #eee;
  vertical-align: middle;
  width: calc(100% / 9); /* Membagi lebar sama rata untuk 9 kolom */
}

.laporan-table th {
  background-color: var(--outline);
  color: #444;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9em;
}


.laporan-table thead {
  display: table;
  width: 89%; /* lebar jarak judul */
  table-layout: fixed; /* Menjaga lebar kolom tetap konsisten */
}

.laporan-table tbody {
  display: block;
  max-height: 440px; /* Sesuaikan tinggi tabel sesuai kebutuhan */
  overflow-y: auto;
  width: 100%;
}

.laporan-table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed; /* Menjaga lebar kolom tetap konsisten */
}

.laporan-table tbody tr:hover {
  background-color: #f2f2f2;
  transition: background-color 0.3s ease;
}

.laporan-table th:first-child,
.laporan-table td:first-child {
  border-radius: 8px 0 0 8px;
}

.laporan-table th:last-child,
.laporan-table td:last-child {
  border-radius: 0 8px 8px 0;
}

select,
input {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 14px;
}

.save-btn {
  margin-top: -0.4rem;
  padding: 8px 15px;
  background-color: var(--blue-coe);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background-color: #0056b3;
}

.pending {
  color: #ff9800;
}

.approved {
  color: #4caf50;
}

.rejected {
  color: #f44336;
}

.status-btn {
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 13px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.status-btn.approved {
  background-color: #4caf50;
}

.status-btn.rejected {
  background-color: #f44336;
}

.status-btn.approved:hover {
  background-color: #388e3c;
}

.status-btn.rejected:hover {
  background-color: #d32f2f;
}

</style>


