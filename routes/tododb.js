// folder-express/routes/tododb.js (VERSI FINAL)

const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua tugas
router.get('/', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        // DIUBAH: Menyesuaikan format output dengan front-end
        res.json({ todos: results });
    });
});

// Endpoint untuk mendapatkan tugas berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Tugas tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan tugas baru
router.post('/', (req, res) => {
    const { task } = req.body;
    if (!task || task.trim() === '') {
        return res.status(400).send('Tugas tidak boleh kosong');
    }

    db.query('INSERT INTO todos (task) VALUES (?)', [task.trim()], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newTodo = { id: results.insertId, task: task.trim(), completed: false };
        res.status(201).json(newTodo);
    });
});

// Endpoint untuk memperbarui tugas (LOGIKA DIPERBAIKI)
router.put('/:id', (req, res) => {
    const { task, completed } = req.body;
    const { id } = req.params;

    if (task === undefined && completed === undefined) {
        return res.status(400).send('Tidak ada data untuk diupdate. Kirim "task" atau "completed".');
    }

    let updateFields = [];
    let values = [];

    if (task !== undefined) {
        updateFields.push('task = ?');
        values.push(task);
    }

    if (completed !== undefined) {
        updateFields.push('completed = ?');
        values.push(completed);
    }
    
    values.push(id); 

    const sql = `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`;

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Tugas tidak ditemukan');
        }
        res.json({ message: 'Tugas berhasil diupdate' });
    });
});

// Endpoint untuk menghapus tugas
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Tugas tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;