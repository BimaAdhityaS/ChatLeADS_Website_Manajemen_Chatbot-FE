# Client ChatLeADS Website Manajemen Chatbot – Backend (MERN Stack)

Ini adalah bagian frontend dari Website Manajemen Chatbot - ChatLeADS yang dibangun menggunakan **MERN Stack** (MongoDB, Express.js, React, Node.js).

# Memulai Project dengan Create React App

Project ini dibuat dengan [Create React App](https://github.com/facebook/create-react-app).

## Variabel Lingkungan (`.env`)

Sebelum menjalankan project, pastikan kamu membuat file `.env` di root direktori project dan tambahkan variabel berikut:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_RASA_URL=http://localhost:5005
```

Variabel ini digunakan untuk menghubungkan frontend React dengan server backend dan chatbot Rasa.

## Perintah yang Tersedia

Di dalam direktori project, kamu bisa menjalankan:

### `npm start`

Menjalankan aplikasi dalam mode development.
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihatnya.

Halaman akan otomatis memuat ulang saat kamu melakukan perubahan.
Error lint juga akan muncul di konsol jika ada.

### `npm test`

Menjalankan test runner dalam mode interaktif.
Lihat dokumentasi tentang [menjalankan tes](https://facebook.github.io/create-react-app/docs/running-tests) untuk informasi lebih lanjut.

### `npm run build`

Membangun aplikasi untuk produksi ke folder `build`.
React akan di-bundle dalam mode produksi dan dioptimalkan untuk performa terbaik.

Build akan diminifikasi dan nama file akan mengandung hash.
Aplikasi siap untuk dideploy!

Lihat bagian tentang [deployment](https://facebook.github.io/create-react-app/docs/deployment) untuk info selengkapnya.

### `npm run eject`

**Catatan: Perintah ini tidak bisa dibatalkan!**

Jika kamu tidak puas dengan konfigurasi bawaan, kamu bisa menjalankan `eject`. Ini akan menyalin semua file konfigurasi dan dependensi ke dalam project sehingga kamu punya kontrol penuh.

Semua perintah seperti `start`, `build`, dan `test` tetap bisa digunakan setelah `eject`, tapi akan mengarah ke skrip lokal yang telah disalin.

Namun, kamu tidak harus menjalankan `eject`. Konfigurasi bawaan sudah cukup untuk kebutuhan pengembangan kecil hingga menengah.

## Pelajari Lebih Lanjut

* Dokumentasi [Create React App](https://facebook.github.io/create-react-app/docs/getting-started)
* Dokumentasi [React](https://reactjs.org/)