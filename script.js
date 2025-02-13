let selectedOption = null;

const API_URL = process.env.API_URL || 'https://pemilihan-backend.onrender.com';

// Modify all fetch calls to use API_URL
async function updateResults() {
    try {
        const response = await fetch(`${API_URL}/api/results`);
        // Rest of the code remains the same
    } catch (error) {
        console.error('Error:', error);
    }
}

async function submitVote() {
    // ... existing code ...
    try {
        const response = await fetch(`${API_URL}/api/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        // Rest of the code remains the same
    } catch (error) {
        console.error('Error:', error);
        showModal('Terjadi kesalahan!', 'error');
    }
}

// Event listener untuk opsi
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
        // Hapus seleksi sebelumnya
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        // Tambah seleksi baru
        this.classList.add('selected');
        selectedOption = this.dataset.option;
    });
});

// Function untuk update hasil
async function updateResults() {
    try {
        const response = await fetch('/api/results');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Hitung persentase
        const total = data.length;
        const opsi1Count = data.filter(v => v.pilihan === "1").length;
        const opsi2Count = data.filter(v => v.pilihan === "2").length;
        
        const opsi1Percent = total ? Math.round((opsi1Count / total) * 100) : 0;
        const opsi2Percent = total ? Math.round((opsi2Count / total) * 100) : 0;

        // Update teks persentase
        document.getElementById('opsi1Percent').textContent = opsi1Percent;
        document.getElementById('opsi2Percent').textContent = opsi2Percent;

        // Update bars
        document.getElementById('bar1').style.width = `${opsi1Percent}%`;
        document.getElementById('bar2').style.width = `${opsi2Percent}%`;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function submitVote() {
    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;

    if (!nama || !kelas || !selectedOption) {
        alert('Mohon isi semua data!');
        return;
    }

    const data = {
        nama: nama,
        kelas: kelas,
        pilihan: selectedOption
    };

    try {
        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Vote berhasil disimpan!');
            // Reset form
            document.getElementById('nama').value = '';
            document.getElementById('kelas').value = '';
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            selectedOption = null;
            
            // Update hasil setelah voting
            updateResults();
        } else {
            alert('Terjadi kesalahan!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan!');
    }
}

function showModal(message, type = 'info') {
    const modal = document.getElementById('modalOverlay');
    const modalContent = modal.querySelector('.modal-content');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    // Reset classes
    modalContent.className = 'modal-content';
    
    // Set type-specific styles and titles
    if (type === 'success') {
        modalContent.classList.add('success');
        modalTitle.textContent = 'Berhasil';
    } else if (type === 'error') {
        modalContent.classList.add('error');
        modalTitle.textContent = 'Peringatan';
    } else {
        modalTitle.textContent = 'Pesan';
    }

    modalMessage.textContent = message;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.style.display = 'none';
}

// Modified submitVote function
async function submitVote() {
    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;

    if (!nama || !kelas || !selectedOption) {
        showModal('Mohon isi semua data!', 'error');
        return;
    }

    const data = {
        nama: nama,
        kelas: kelas,
        pilihan: selectedOption
    };

    try {
        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showModal('Vote berhasil disimpan!', 'success');
            // Reset form
            document.getElementById('nama').value = '';
            document.getElementById('kelas').value = '';
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            selectedOption = null;
            
            // Update hasil setelah voting
            updateResults();
        } else {
            showModal('Terjadi kesalahan!', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showModal('Terjadi kesalahan!', 'error');
    }
}

// Optional: Close modal when clicking outside
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Update hasil setiap 5 detik
setInterval(updateResults, 5000);

// Load hasil pertama kali
updateResults();