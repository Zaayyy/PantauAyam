/**
 * BRMP DIY Poultry Tracker - Backend Server
 * Terhubung ke Cloud Database & Storage Supabase (PostgreSQL + S3 Storage)
 * Siap untuk Vercel Deployment & Akses Global dari Mana Saja
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');

const supabaseAdapter = require('./supabase');
const localDb = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Multer (Gunakan MemoryStorage jika Supabase aktif agar foto langsung diunggah ke Cloud Storage)
let upload = null;
if (supabaseAdapter.isConfigured) {
  upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
  });
} else {
  const uploadDir = localDb.isVercel
    ? path.join('/tmp', 'brmp-uploads', 'documentation')
    : path.join(__dirname, 'uploads', 'documentation');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `doc-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    }
  });

  upload = multer({
    storage: diskStorage,
    limits: { fileSize: 10 * 1024 * 1024 }
  });
}

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname)));

// ==========================================
// API ROUTES
// ==========================================

// 0. Status Koneksi Cloud Database
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    cloud: supabaseAdapter.isConfigured,
    provider: supabaseAdapter.isConfigured ? 'Supabase Cloud (PostgreSQL)' : 'Local Database',
    message: supabaseAdapter.isConfigured 
      ? 'Database Cloud Supabase aktif. Data dapat diakses dari mana saja secara real-time.' 
      : 'Supabase belum terhubung. Berjalan dalam mode database lokal.'
  });
});

// 1. Ambil Semua Flok / Kandang
app.get('/api/flocks', async (req, res) => {
  try {
    if (supabaseAdapter.isConfigured) {
      const flocks = await supabaseAdapter.getAllFlocks();
      const result = await Promise.all(flocks.map(async f => {
        const weighings = await supabaseAdapter.getWeighingsByFlock(f.id);
        return {
          id: f.id,
          name: f.name,
          code: f.code,
          breed: f.breed,
          productionType: f.production_type || (f.breed === 'layer' ? 'layer' : 'broiler'),
          docDate: f.doc_date,
          initialPop: f.initial_pop,
          currentPop: f.current_pop,
          cageType: f.cage_type,
          location: f.location,
          officer: f.officer,
          notes: f.notes,
          createdAt: f.created_at,
          weighingsCount: weighings.length,
          weighings: weighings
        };
      }));
      return res.json({ success: true, cloud: true, data: result });
    }

    // Fallback Local / Vercel Tmp
    const rawFlocks = localDb.getAllFlocks();
    const result = rawFlocks.map(f => {
      const weighings = localDb.getWeighingsByFlock(f.id);
      return {
        id: f.id,
        name: f.name,
        code: f.code,
        breed: f.breed,
        productionType: f.production_type || (f.breed === 'layer' ? 'layer' : 'broiler'),
        docDate: f.doc_date,
        initialPop: f.initial_pop,
        currentPop: f.current_pop,
        cageType: f.cage_type,
        location: f.location,
        officer: f.officer,
        notes: f.notes,
        createdAt: f.created_at,
        weighingsCount: weighings.length,
        weighings: weighings
      };
    });
    res.json({ success: true, cloud: false, data: result });
  } catch (err) {
    console.error('Error GET /api/flocks:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Tambah Flok Baru
app.post('/api/flocks', async (req, res) => {
  try {
    const { name, code, breed, docDate, initialPop, cageType, location, officer, notes } = req.body;
    const productionType = req.body.productionType || (breed === 'layer' ? 'layer' : 'broiler');
    if (!name || !code || !docDate || !initialPop || !['broiler', 'layer'].includes(productionType)) {
      return res.status(400).json({ success: false, error: 'Data flok belum lengkap.' });
    }
    if (!Number.isInteger(Number(initialPop)) || Number(initialPop) < 1) {
      return res.status(400).json({ success: false, error: 'Populasi awal harus berupa bilangan bulat minimal 1.' });
    }

    const flockId = `flock-${Date.now()}`;
    const payload = {
      id: flockId,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      breed: breed || 'kub',
      productionType,
      docDate,
      initialPop: Number(initialPop),
      cageType: cageType || '',
      location: location || '',
      officer: officer || '',
      notes: notes || ''
    };

    if (supabaseAdapter.isConfigured) {
      const created = await supabaseAdapter.createFlock(payload);
      return res.json({
        success: true,
        cloud: true,
        data: {
          id: created.id,
          name: created.name,
          code: created.code,
          breed: created.breed,
          productionType: created.production_type || productionType,
          docDate: created.doc_date,
          initialPop: created.initial_pop,
          currentPop: created.current_pop,
          cageType: created.cage_type,
          location: created.location,
          officer: created.officer,
          notes: created.notes,
          weighings: []
        }
      });
    }

    const created = localDb.createFlock(payload);
    res.json({
      success: true,
      cloud: false,
      data: {
        id: created.id,
        name: created.name,
        code: created.code,
        breed: created.breed,
        productionType: created.production_type || productionType,
        docDate: created.doc_date,
        initialPop: created.initial_pop,
        currentPop: created.current_pop,
        cageType: created.cage_type,
        location: created.location,
        officer: created.officer,
        notes: created.notes,
        weighings: []
      }
    });
  } catch (err) {
    console.error('Error POST /api/flocks:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Detail Flok Tunggal
app.get('/api/flocks/:id', async (req, res) => {
  try {
    if (supabaseAdapter.isConfigured) {
      const f = await supabaseAdapter.getFlockById(req.params.id);
      if (!f) return res.status(404).json({ success: false, error: 'Flok tidak ditemukan.' });
      const weighings = await supabaseAdapter.getWeighingsByFlock(f.id);
      return res.json({
        success: true,
        cloud: true,
        data: {
          id: f.id,
          name: f.name,
          code: f.code,
          breed: f.breed,
          productionType: f.production_type || (f.breed === 'layer' ? 'layer' : 'broiler'),
          docDate: f.doc_date,
          initialPop: f.initial_pop,
          currentPop: f.current_pop,
          cageType: f.cage_type,
          location: f.location,
          officer: f.officer,
          notes: f.notes,
          weighings
        }
      });
    }

    const f = localDb.getFlockById(req.params.id);
    if (!f) return res.status(404).json({ success: false, error: 'Flok tidak ditemukan.' });
    const weighings = localDb.getWeighingsByFlock(f.id);
    res.json({
      success: true,
      cloud: false,
      data: {
        id: f.id,
        name: f.name,
        code: f.code,
        breed: f.breed,
        productionType: f.production_type || (f.breed === 'layer' ? 'layer' : 'broiler'),
        docDate: f.doc_date,
        initialPop: f.initial_pop,
        currentPop: f.current_pop,
        cageType: f.cage_type,
        location: f.location,
        officer: f.officer,
        notes: f.notes,
        weighings
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Hapus Flok
app.delete('/api/flocks/:id', async (req, res) => {
  try {
    if (supabaseAdapter.isConfigured) {
      await supabaseAdapter.deleteFlock(req.params.id);
      return res.json({ success: true, message: 'Flok berhasil dihapus dari Supabase.' });
    }
    localDb.deleteFlock(req.params.id);
    res.json({ success: true, message: 'Flok berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Simpan / Update Penimbangan Mingguan (Termasuk Upload Foto ke Cloud Storage)
app.post('/api/flocks/:id/weighings', upload.single('photo'), async (req, res) => {
  try {
    const flockId = req.params.id;
    const {
      week,
      date,
      ageDays,
      avgWeight,
      targetWeight,
      sampleCount,
      samples,
      uniformity,
      feedIntakeKg,
      mortality,
      cull,
      populationAdded,
      populationDecreased,
      populationShipped,
      eggCount,
      eggWeightKg,
      healthNote
    } = req.body;

    const populationValues = [populationAdded, populationDecreased, populationShipped]
      .map(value => Number(value || 0));
    const eggCountValue = Number(eggCount || 0);
    const eggWeightValue = Number(eggWeightKg || 0);
    const feedValue = Number(feedIntakeKg || 0);
    if (!Number.isInteger(Number(week)) || Number(week) < 0 || !date) {
      return res.status(400).json({ success: false, error: 'Minggu monitoring dan tanggal harus diisi dengan benar.' });
    }
    if (populationValues.some(value => !Number.isInteger(value) || value < 0)
      || !Number.isInteger(eggCountValue) || eggCountValue < 0
      || !Number.isFinite(eggWeightValue) || eggWeightValue < 0
      || !Number.isFinite(feedValue) || feedValue < 0) {
      return res.status(400).json({ success: false, error: 'Jumlah populasi, telur, bobot telur, dan pakan harus berupa angka nol atau lebih.' });
    }

    let parsedSamples = [];
    if (typeof samples === 'string') {
      try {
        parsedSamples = JSON.parse(samples);
      } catch (e) {
        parsedSamples = samples.split(/[\s,]+/).map(n => parseFloat(n)).filter(n => !isNaN(n) && n > 0);
      }
    } else if (Array.isArray(samples)) {
      parsedSamples = samples;
    }

    let photoUrl = '';
    // Jika Supabase aktif dan user mengunggah foto, unggah langsung ke Supabase S3 Storage!
    if (req.file) {
      if (supabaseAdapter.isConfigured && req.file.buffer) {
        photoUrl = await supabaseAdapter.uploadDocumentationPhoto(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
      } else if (req.file.filename) {
        photoUrl = `/uploads/documentation/${req.file.filename}`;
      }
    }

    const payload = {
      flockId,
      week: Number(week),
      date,
      ageDays: Number(ageDays || Number(week) * 7),
      avgWeight: parseFloat(avgWeight),
      targetWeight: parseFloat(targetWeight || avgWeight),
      sampleCount: Number(sampleCount || (parsedSamples.length > 0 ? parsedSamples.length : 30)),
      samples: parsedSamples,
      uniformity: parseFloat(uniformity || 90),
      feedIntakeKg: feedValue,
      mortality: Number(mortality || 0),
      cull: Number(cull || 0),
      populationAdded: populationValues[0],
      populationDecreased: populationValues[1],
      populationShipped: populationValues[2],
      eggCount: eggCountValue,
      eggWeightKg: eggWeightValue,
      healthNote: healthNote || '',
      photoUrl
    };

    if (supabaseAdapter.isConfigured) {
      await supabaseAdapter.upsertWeighing(payload);
      const updatedWeighings = await supabaseAdapter.getWeighingsByFlock(flockId);
      const updatedFlock = await supabaseAdapter.getFlockById(flockId);
      return res.json({
        success: true,
        cloud: true,
        message: `Data penimbangan minggu ke-${week} tersimpan di Cloud Supabase!`,
        data: {
          flock: updatedFlock,
          weighings: updatedWeighings
        }
      });
    }

    // Local / Tmp fallback
    localDb.upsertWeighing(payload);
    const updatedWeighings = localDb.getWeighingsByFlock(flockId);
    const updatedFlock = localDb.getFlockById(flockId);
    res.json({
      success: true,
      cloud: false,
      message: `Data penimbangan minggu ke-${week} berhasil disimpan.`,
      data: {
        flock: updatedFlock,
        weighings: updatedWeighings
      }
    });
  } catch (err) {
    console.error('Error POST weighing:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Hapus Penimbangan Mingguan
app.delete('/api/flocks/:id/weighings/:week', async (req, res) => {
  try {
    const { id, week } = req.params;
    if (supabaseAdapter.isConfigured) {
      await supabaseAdapter.deleteWeighing(id, week);
      return res.json({ success: true, message: `Data minggu ke-${week} telah dihapus dari Cloud.` });
    }
    localDb.deleteWeighing(id, week);
    res.json({ success: true, message: `Data penimbangan minggu ke-${week} berhasil dihapus.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server jika dijalankan langsung
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🐔 Server BRMP PoultryTrack aktif di http://localhost:${PORT}`);
    console.log(`🌐 Mode Database: ${supabaseAdapter.isConfigured ? '☁️ Supabase Cloud (Global Online)' : '💻 Local Database'}`);
  });
}

module.exports = app;
