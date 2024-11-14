<template>
  <div class="split-screen">
    <div class="left">
      <section class="copy">
        <!-- <p>Selamat Datang Di Aplikasi Expense KKC </p> -->
      </section>
    </div>
    <div class="right">
      <form @submit.prevent="handleLogin">
        <section class="copy">
          <h2>Login</h2>
        </section>
        <div class="input-container name">
          <input id="fname" v-model="username" name="fname" type="text" placeholder="Username" />
        </div>
        <div class="input-container password">
          <input id="password" v-model="password" name="password" type="password" placeholder="Password" />
          <i class="fa fa-eye-slash"></i>
        </div>
        <button class="signup-btn" type="submit">Login</button>
        <!-- <div class="login-container">
          <p>Belum punya akun? <router-link to="/Register"><strong> Daftar</strong></router-link></p>
        </div> -->
        <!-- Gambar di pojok kiri bawah -->
        <img src="/src/assets/fitxcoe.jpg" class="imgbottom" alt="Logo Bawah" />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Kirim request ke server menggunakan fetch API
        const response = await fetch('https://api-prmn.curaweda.com:5000/login', {  // Ganti dengan endpoint yang benar
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        // Cek jika login berhasil
        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.msg || 'Login gagal');
        }

        const data = await response.json();
        alert('Login berhasil!');

        // Simpan token dan informasi user ke localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('username', data.username);  // Simpan username
        localStorage.setItem('role', data.role);  // Simpan role

        // Redirect ke halaman Home setelah login berhasil
        this.$router.push('/Home');
      } catch (error) {
        console.error(error);
        alert('Username atau Password salah.');
      }
    }
  }
};
</script>


  
  <style lang="scss" scoped>
//   :root {
//     font-size: 100%;
//     font-size: 16px;
//     line-height: 1.5;
//     --primary-blue: #233975;
//   }
  
  body {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
  
  h1 {
    font-size: 2.25rem;
    font-weight: 700;
  }
  
  h2 {
    text-align: left;
    padding-bottom: 1.4rem;
    font-size: 1.8rem;
    font-weight: 700;
  }
  
  a {
    text-decoration: none;
    color: var(--primary-blue);
  }
  
  a:hover {
    text-decoration: none;
  }
  
  .small {
    font-size: 80%;
    text-align: center;
  }
  
  .split-screen {
    display: flex;
    flex-direction: column;
  }
  
  .left {
    height: 200px;
  }
  
  .left,
  .right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* BG IMAGE */
  .left {
    background: linear-gradient(rgba(247, 228, 85, 0.5), rgba(223, 186, 21, 0.9)),
      url('/src/assets/bg.jpg');
    background-size: cover;
  }
  
  /* LEFT TEXT */
  .left .copy {
    color: var(--white);
    text-align: center;
    // -webkit-font-smoothing: antialiased;
    // -moz-osx-font-smoothing: grayscale;
  }
  
  .left p {
    font-weight: 400;
    font-size: 2rem;
  }
  
  .right .copy {
    color: black;
    text-align: center;
  }
  
  .right .copy p {
    margin: 1.5em 0;
    font-size: 0.875rem;
  }
  .right form {
    width: 328px;
  }
  
  /* BOX INPUT FORM */
  form input[type='text'],
  form input[type='email'],
  form input[type='password'] {
    display: block;
    width: 100%;
    box-sizing: border-box;
    border-radius: 8px;
    border: 2px solid var(--outline);
    padding: 1em;
    margin-bottom: 1.25rem;
    font-size: 0.875rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
  }
  
  .input-container.password {
    position: relative;
  }
  
  .input-container.password i {
    position: absolute;
    top: 42px;
    right: 16px;
  }
  
  /* CHECKBOX SETUJU */
  .checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  .checkbox-container {
    display: block;
    position: relative;
    padding-left: 2rem;
    cursor: pointer;
    user-select: none;
    margin: 0 0 1.25rem 0;
  }
  
  .checkbox-container input:checked ~ .checkmark {
    background-color: var(--primary-blue);
    border: 1px solid var(--primary-blue);
  }
  
  .checkmark {
    position: absolute;
    width: 24px;
    height: 24px;
    background: white;
    border: 1px solid #c4c4c4;
    border-radius: 2px;
    top: -4px;
    left: 0;
    transition: 0.3s;
  }
  
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }
  
  .checkbox-container input:checked ~ .checkmark:after {
    display: block;
  }
  
  .checkbox-container .checkmark:after {
    border: solid white;
    border-width: 0 3px 3px 0;
    width: 5px;
    height: 10px;
    left: 8px;
    top: 4px;
    transform: rotate(45deg);
  }
  
  /* TOMBOL DAFTAR */
  .signup-btn {
    display: block;
    width: 100%;
    background: var(--black);
    color: var(--white);
    font-weight: 700;
    border: none;
    padding: 1rem;
    border-radius: 14px;
    font-size: 0.9rem;
    // text-transform: uppercase;
    letter-spacing: 0.1rem;
    transition: 0.3s;
  }
  
  .signup-btn:hover {
    background: var(--green-kkc);
    cursor: pointer;
  }

  .login-container{
    padding-top: 1.4rem;
    text-align: center;

    strong{
        color: var(--blue-coe);
    }
  }

  .right {
  .imgtop, .imgbottom {
  width: 250px;
  max-width: 100%;
  height: auto;
  margin-top: 3rem;
  margin-left: 2.4rem;
}
}
  
  /* RESPONSIVE PAGE SETT */
  @media screen and (min-width: 900px) {
    .split-screen {
      flex-direction: row;
      height: 100vh;
    }
    .left,
    .right {
      display: flex;
      width: 50%;
      height: auto;
    }
  }
  </style>
  