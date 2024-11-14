<template>
    <aside :class="`${is_expanded && 'is-expanded'}`">
      <div class="logo">
          <img src="../assets/icon.png" alt="kkc">
      </div>
  
      <div class="menu-toggle-wrap">
          <button class="menu-toggle" @click="ToggleMenu">
              <span class="material-icons">
                  keyboard_double_arrow_right
              </span>
          </button>
      </div>
  
      <div class="menu">
          <h3>Main</h3>
          <router-link class="button" to="/Home">
              <span class="material-icons">analytics</span>
              <span class="text">Dashboard</span>
          </router-link>
          <router-link class="button" to="/InputTransac">
              <span class="material-icons">edit</span>
              <span class="text">Pencatatan Pengeluaran</span>
          </router-link>
          <!-- disable detail sementara karena belum ada api nya -->
          <!-- <router-link class="button" to="/DetailTransac">
              <span class="material-icons">payments</span>
              <span class="text">Detail Pengeluaran</span>
          </router-link> -->
          <router-link v-if="userRole === 'KASIR'" class="button" to="/ReportManager">
              <span class="material-icons">fact_check</span>
              <span class="text">Kelola Laporan</span>
          </router-link>
      </div>
  
      <div class="flex"></div>
  
      <div class="menu">
          <h3>Others</h3>
          <router-link class="button" to="/AddAccount">
              <span class="material-icons">manage_accounts</span>
              <span class="text">Kelola Akun</span>
          </router-link>
      </div>
      <div class="menu">
          <!-- Tambahkan event @click.prevent agar tidak langsung pindah halaman sebelum logout -->
          <router-link class="button" to="/Login" @click.prevent="handleLogout">
              <span class="material-icons">power_settings_new</span>
              <span class="text">Keluar</span>
          </router-link>
      </div>
    </aside>
  </template>
  

  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const is_expanded = ref(false)
  const router = useRouter()
  const userRole = ref(localStorage.getItem('role')); // Ambil role dari localStorage
  
  const ToggleMenu = () => {
      is_expanded.value = !is_expanded.value
  }
  
  const handleLogout = async () => {
    try {
        const response = await fetch('https://api-prmn.curaweda.com:5000/logout', {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            router.push('/Login');
        } else {
            const errorMessage = await response.text();
            throw new Error(`Logout gagal: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error detail:', error);
        alert(`Terjadi kesalahan saat logout: ${error.message}`);
    }
};


  </script>  

<style lang="scss" scoped>
aside {
    display: flex;
    flex-direction: column;
    border: 2px;
    width: calc(2rem + 32px);
    overflow: hidden;
    min-height: 100vh;
    border-right: 2px solid var(--outline);
    padding: 1rem;

    background-color: var(--white);
    color: var(--dark);

    transition: 0.2s ease-out;

    .flex{
        flex: 1 1 0;
    }
    
    .logo{
        margin-bottom: 1rem;
        transition: 0.2s ease-out;
        
        img{
            width: 2rem;
        }
    }

    .menu-toggle-wrap{
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;
        position: relative;
        top: 0;
        transition: 0.2s ease-out;

        .menu-toggle{
            transition: 0.2s ease-out;

            .material-icons{
                font-size: 2rem;
                color: var(--green-kkc);
                transition: 0.2s ease-out;
            }

            &:hover{
                .material-icons{
                    transform: translateX(0.3rem);
                }
            }
        }
    }

    h3, .button .text{
        opacity: 0;
        transition: 0.3s ease-out;
    }

    .menu {
        margin: 0 -1rem;
        
// add top text in sidebar menu nav
        h3{
            font-size: 1rem;
            padding: 1rem;
            color: var(--green-kkc);
        }

        .button{
            display: flex;
            align-items: center;
            text-decoration: none;
            padding: 1rem 1rem;
            transition: 0.2s ease-out;

            .material-icons{
                font-size: 1.8rem;
                color: var(--inactive);
                transition: 0.2s ease-out;
                margin-right: 1rem;
            }

            .text{
                color: var(--inactive);
                transition: 0.2s ease-out;
            }

            &:hover, &.router-link-exact-active {
                background-color: var(--golden-kkc);
                

                .material-icons, .text{
                    color: var(--light);
                }
            }

            &.router-link-exact-active {
                border-right: 5px solid var(--green-kkc);
            }
        }
    }

    &.is-expanded{
        width: var(--sidebar-width);

        .menu-toggle-wrap{
            top: -3rem;
            .menu-toggle{
                transform: rotate(-180deg);
            }
        }
        h3, .button .text{
        opacity: 1;
    }
    .logo {
        transform: translateX(0.3rem);
        transition: 0.2s ease-out;
        
    }

    .button{
        .material-icons{
            margin-right: 1rem;
        }
    }
        
    }

    

    @media (max-width: 768px) {
        position: fixed;
        z-index: 99;
    }
    
}
</style>