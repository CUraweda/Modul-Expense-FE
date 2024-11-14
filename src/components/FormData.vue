<template>
  <div class="pencatatan-pengeluaran">
    <div class="form-container">
      <!-- Form input -->
      <div class="form-inputs">
        <input type="text" placeholder="Judul" v-model="formData.title" />
        <input type="text" placeholder="Nama Pelapor" v-model="formData.reporter" />
        <input type="date" placeholder="Tanggal" v-model="formData.date" />
        <select v-model="formData.type">
          <option value="" disabled selected>Jenis</option>
          <option value="OPERASIONAL">Operasional</option>
          <option value="NON-OPERASIONAL">Non-Operasional</option>
          <option value="PRIVE">Prive</option>
        </select>
        <select v-model="formData.category">
          <option value="" disabled selected>Kategori</option>
          <option value="PRIBADI">Pribadi</option>
          <option value="LISTRIK">Listrik</option>
          <option value="AIR">Air</option>
        </select>
        <!-- Input biaya dengan format Rupiah hanya untuk tampilan -->
        <input
          type="text"
          placeholder="Biaya"
          v-model="formattedCost"
          @input="updateCost"
        />
      </div>
    </div>

    <!-- Deskripsi -->
    <div class="description-container">
      <textarea
        v-model="formData.description"
        @input="updateCharCount"
        placeholder="Deskripsi"
        maxlength="500"
      ></textarea>
      <div class="char-count">{{ charCount }} karakter tersisa</div>
    </div>

    <!-- Tombol Aksi -->
    <div class="form-actions">
      <button class="btn-cancel" @click="cancel">Cancel</button>
      <button class="btn-save" @click="save">Simpan</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Form data untuk input pengeluaran
const formData = ref({
  title: '',
  date: '',
  cost: '', // Menyimpan nilai asli (angka tanpa format Rupiah)
  type: '',
  category: '',
  description: '',
  reporter: '',
});

// Char count untuk deskripsi
const charCount = ref(500);

// Gunakan useRouter untuk akses router
const router = useRouter();

// Fungsi untuk update jumlah karakter tersisa
const updateCharCount = () => {
  charCount.value = 500 - formData.value.description.length;
};

// Computed property untuk menampilkan format Rupiah di front-end
const formattedCost = computed({
  get() {
    // Format nilai asli (formData.cost) ke dalam format Rupiah
    return formData.value.cost
      ? new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(formData.value.cost).replace("Rp", "Rp ")
      : '';
  },
  set(value) {
    // Update formData.cost dengan nilai asli (tanpa format Rupiah)
    formData.value.cost = value.replace(/\D/g, '');
  }
});

// Fungsi untuk menyimpan data pengeluaran
const save = async () => {
  try {
    const response = await axios.post('https://api-prmn.curaweda.com:5000/expenses', {
      title: formData.value.title,
      reporter: formData.value.reporter,
      date: formData.value.date,
      cost: parseInt(formData.value.cost), // Kirim nilai asli ke backend
      type: formData.value.type,
      category: formData.value.category,
      description: formData.value.description,
    });

    alert(response.data.msg); // Tampilkan pesan jika pencatatan berhasil
    router.push('/Home');
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat pencatatan'); // Tampilkan pesan jika terjadi error
  }
};

// Fungsi untuk membatalkan input
const cancel = () => {
  formData.value = {
    title: '',
    date: '',
    cost: '',
    type: '',
    category: '',
    description: '',
    reporter: '',
  };
};
</script>


  
  <style scoped lang="scss">
  .pencatatan-pengeluaran {
    padding: 1.4rem;
  
    h1 {
      color: var(--green-kkc);
      font-weight: 700;
    }

    .imgformat{
      font-size: 0.8rem;
      color: #6b7280;
      font-style: italic;
    }
  
    .form-container {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
  
      .photo-box {
        width: 24rem;
        height: 15rem;
        border: 2px solid var(--outline);
        border-radius: 8px;
        position: relative;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
  
        .photo-placeholder {
          text-align: center;
          color: var(--inactive);
        
        .photo-preview {
        width: 100px;
        height: 100px;
        object-fit: cover;
        }
        
          
          .material-icons {
            font-size: 2rem;
            padding-top: 4.8rem;
          }
        }
  
        .delete-icon {
          position: absolute;
          top: 8px;
          right: 8px;
          color: var(--inactive);
          cursor: pointer;
          transition: 0.2s ease-out;
  
          &:hover {
            color: red;
          }
        }
      }
  
      .form-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        width: 100%;
        height: 1rem;
  
        input, select {
          width: 100%;
          padding: 0.8rem;
          border: 2px solid var(--outline);
          border-radius: 8px;
          font-weight: 600;
        }
      }
    }
  
    .form-actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
      
      .btn-cancel {
        background-color: red;
        color: white;
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
  
      .btn-save {
        background-color: var(--green-kkc);
        color: white;
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    }
    .description-container {
    position: relative;
    margin-top: 150px;
    
    textarea {
      width: 19rem;
      padding: 0.8rem;
      margin-top: 1rem;
      border: 2px solid var(--outline);
      border-radius: 8px;
      resize: none;
      height: 100px;
    }

    .char-count {
      text-align: left;
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 5px;
    }
    }
}
  </style>
  