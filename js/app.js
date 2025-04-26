document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Pakej 1', img: '1.jpg', price: 150 },
            { id: 2, name: 'Pakej 2', img: '1.jpg', price: 200 },
            { id: 3, name: 'Pakej 3', img: '1.jpg', price: 300 },
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            // check apakah ada barang yang sama di cart
            const cartItem = this.items.find((item) => item.id === newItem.id);

            // jika belum ada / cart masih kosong
            if (!cartItem) {
                this.items.push({ ...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // Jika barang sudah ada, check apakah barang beza atau sama dengan yang ada di cart
                this.items = this.items.map((item) => {
                    // jika barang berbeza
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        // jika barang sudah ada, tambah quantity dan totalnya
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
        },
        remove(id) {
            // ambil item yang mau diremove berdasarkan id nya
            const cartItem = this.items.find((item) => item.id === id);

         // jika item lebih dari 1
            if (cartItem.quantity > 1) {
                // kira 1 1
                this.items = this.items.map((item) => {
                    // jika bukan barang yang diklik
                    if (item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }

                });
            } else if (cartItem.quantity === 1) {
                // jika barang tinggal 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        },
    });
});

// Form Validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function() {
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

// kirim data jika button submit diklik
checkoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const message = formatMessage(objData);
    window.open('http://wa.me/60199060204?text=' + encodeURIComponent(message));
});

// format pesan whatsapp
const formatMessage = (obj) => {
    return `Data Customer
    Nama : ${obj.name}
    Alamat : ${obj.alamat}
    phone : ${obj.phone}
    Bayaran : ${obj.bayaran}
    
    Data Pesanan
        ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${myr(item.total)}) \n` )}
        TOTAL: ${myr(obj.total)}
        Terima kasih.`;
};


// Convert ke MYR
const myr = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 0,
    }).format(number);
};