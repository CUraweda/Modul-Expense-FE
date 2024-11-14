<template>
  <main class="manage-accounts">
    <h1>Kelola Akun</h1>
    <p>Tambah/Hapus/Edit Akun</p>

    <!-- Tombol Tambah User -->
    <button @click="showAddUserForm" class="add-user-button">Tambah User</button>

    <!-- Tabel Daftar User -->
    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Nama</th>
          <th>Role</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.nama }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="showEditUserForm(user)">Edit</button>
            <button @click="deleteUser(user.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Overlay dan Form Tambah/Edit User -->
    <div v-if="isAddingUser || isEditingUser" class="overlay" @click.self="cancelUserForm">
      <div class="add-user-modal">
        <h2>{{ isEditingUser ? 'Edit User' : 'Tambah User' }}</h2>
        <label>
          Username:
          <input v-model="formUser.username" type="text" required />
        </label>
        <label>
          Nama:
          <input v-model="formUser.nama" type="text" required />
        </label>
        <label>
          Role:
          <select v-model="formUser.role" required>
            <option value="KASIR">KASIR</option>
            <option value="BENDAHARA">BENDAHARA</option>
          </select>
        </label>
        <label v-if="!isEditingUser">
          Password:
          <input v-model="formUser.password" type="password" required />
        </label>
        <label v-if="!isEditingUser">
          Konfirmasi Password:
          <input v-model="formUser.confPassword" type="password" required />
        </label>
        <button @click="isEditingUser ? updateUser() : registerUser()">
          {{ isEditingUser ? 'Simpan Perubahan' : 'Tambah User' }}
        </button>
        <button @click="cancelUserForm">Batal</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const formUser = ref({
  username: '',
  nama: '',
  role: 'KASIR',
  password: '',
  confPassword: ''
});
const isAddingUser = ref(false);
const isEditingUser = ref(false);
let editUserId = null;

// Fungsi untuk menampilkan daftar pengguna dari API
async function fetchUsers() {
  try {
    const response = await axios.get('https://api-prmn.curaweda.com:5000/users');
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Fungsi untuk menambah user baru melalui API
async function registerUser() {
  try {
    if (formUser.value.password !== formUser.value.confPassword) {
      alert('Password tidak cocok');
      return;
    }

    const response = await axios.post('https://api-prmn.curaweda.com:5000/users', {
      username: formUser.value.username,
      nama: formUser.value.nama,
      role: formUser.value.role,
      password: formUser.value.password,
      confPassword: formUser.value.confPassword,
    });

    alert(response.data.msg);
    isAddingUser.value = false;
    fetchUsers();
    resetFormUser();
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
    alert('Error: ' + (error.response ? error.response.data.msg : 'Gagal menambahkan pengguna'));
  }
}

// Fungsi untuk menampilkan form edit user
function showEditUserForm(user) {
  formUser.value = { ...user, password: '', confPassword: '' };
  isEditingUser.value = true;
  editUserId = user.id;
}

// Fungsi untuk memperbarui data user
async function updateUser() {
  try {
    await axios.put(`https://api-prmn.curaweda.com:5000/users/${editUserId}`, {
      username: formUser.value.username,
      nama: formUser.value.nama,
      role: formUser.value.role,
    });

    alert('User berhasil diperbarui');
    isEditingUser.value = false;
    fetchUsers();
    resetFormUser();
  } catch (error) {
    console.error('Error updating user:', error.response ? error.response.data : error.message);
    alert('Error: ' + (error.response ? error.response.data.msg : 'Gagal memperbarui pengguna'));
  }
}

// Fungsi untuk menghapus user
async function deleteUser(userId) {
  try {
    await axios.delete(`https://api-prmn.curaweda.com:5000/users/${userId}`);
    alert('User berhasil dihapus');
    fetchUsers();
  } catch (error) {
    console.error('Error deleting user:', error.response ? error.response.data : error.message);
    alert('Error: ' + (error.response ? error.response.data.msg : 'Gagal menghapus pengguna'));
  }
}

// Fungsi untuk mereset form pengguna
function resetFormUser() {
  formUser.value = { username: '', nama: '', role: 'KASIR', password: '', confPassword: '' };
}

// Fungsi untuk membuka form tambah user
function showAddUserForm() {
  isAddingUser.value = true;
}

// Fungsi untuk membatalkan form tambah/edit user
function cancelUserForm() {
  isAddingUser.value = false;
  isEditingUser.value = false;
  resetFormUser();
}

// Panggil fetchUsers ketika komponen di-mount
onMounted(fetchUsers);
</script>
  
  <style lang="scss" scoped>
  .manage-accounts {
    padding: 1.4rem;
  
    h1 {
      color: var(--green-kkc);
      font-size: 1.5rem;
      font-weight: 700;
    }
  
    .add-user-button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    .user-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
  
      th, td {
        padding: 0.8rem;
        border: 1px solid #ddd;
        text-align: left;
      }
  
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
  
      button {
        margin-right: 0.5rem;
        padding: 0.3rem 0.7rem;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      }
  
      button:last-of-type {
        background-color: #f44336;
      }
    }
  
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
  
    .add-user-modal {
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      width: 400px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
      label {
        display: block;
        margin-top: 0.5rem;
      }
  
      input, select {
        margin-top: 0.3rem;
        padding: 0.4rem;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
  
      button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
  
      button:last-of-type {
        margin-left: 0.6rem;
        background-color: #f44336;
      }
    }
  }
  </style>
  