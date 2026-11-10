/**
 * Standar Acuan Bobot Ayam per Minggu (dalam gram)
 * Sumber: Standar Balai Penelitian Ternak / BRMP Balitbangtan
 */
const POULTRY_STANDARDS = {
  kub: {
    id: 'kub',
    name: 'Ayam KUB (Kampung Unggul Balitbangtan)',
    category: 'Ayam Kampung Unggul',
    docWeight: 30, // gram
    harvestWeek: 10,
    targetHarvestWeight: 900,
    description: 'Ayam kampung galur unggul hasil riset Litbang Pertanian / BRMP dengan pertumbuhan lebih cepat dan daya tahan tinggi.',
    weeklyStandards: [
      { week: 0, ageDays: 0, standardWeight: 30, minWeight: 26, maxWeight: 34, feedPerWeek: 0, note: 'DOC Masuk kandang brooding' },
      { week: 1, ageDays: 7, standardWeight: 65, minWeight: 58, maxWeight: 72, feedPerWeek: 70, note: 'Brooding hangat, pakan starter halus' },
      { week: 2, ageDays: 14, standardWeight: 120, minWeight: 108, maxWeight: 132, feedPerWeek: 120, note: 'Vaksinasi ND-1/IB, mulai aktif' },
      { week: 3, ageDays: 21, standardWeight: 195, minWeight: 175, maxWeight: 215, feedPerWeek: 180, note: 'Bulu sayap dan ekor mulai tumbuh sempurna' },
      { week: 4, ageDays: 28, standardWeight: 290, minWeight: 260, maxWeight: 320, feedPerWeek: 250, note: 'Lepas pemanas brooding, peralihan pakan' },
      { week: 5, ageDays: 35, standardWeight: 410, minWeight: 370, maxWeight: 450, feedPerWeek: 330, note: 'Pertumbuhan tulang & rangka pesat' },
      { week: 6, ageDays: 42, standardWeight: 540, minWeight: 490, maxWeight: 590, feedPerWeek: 410, note: 'Keseragaman flok dipantau ketat' },
      { week: 7, ageDays: 49, standardWeight: 680, minWeight: 615, maxWeight: 745, feedPerWeek: 490, note: 'Pakan grower, kontrol ventilasi' },
      { week: 8, ageDays: 56, standardWeight: 820, minWeight: 740, maxWeight: 900, feedPerWeek: 560, note: 'Pembentukan daging dada & paha' },
      { week: 9, ageDays: 63, standardWeight: 960, minWeight: 870, maxWeight: 1050, feedPerWeek: 620, note: 'Mendekati bobot panen konsumsi' },
      { week: 10, ageDays: 70, standardWeight: 1100, minWeight: 990, maxWeight: 1210, feedPerWeek: 680, note: 'Bobot siap panen pasar resto / bibit' },
      { week: 11, ageDays: 77, standardWeight: 1240, minWeight: 1120, maxWeight: 1360, feedPerWeek: 730, note: 'Seleksi calon indukan' },
      { week: 12, ageDays: 84, standardWeight: 1380, minWeight: 1250, maxWeight: 1510, feedPerWeek: 770, note: 'Masa akhir pembesaran' }
    ]
  },
  joper: {
    id: 'joper',
    name: 'Ayam Jowo Super (Joper)',
    category: 'Ayam Silangan Pedaging',
    docWeight: 32,
    harvestWeek: 8,
    targetHarvestWeight: 950,
    description: 'Ayam persilangan pejantan bangkok/kampung dengan betina layer petelur, panen cepat umur 55-60 hari.',
    weeklyStandards: [
      { week: 0, ageDays: 0, standardWeight: 32, minWeight: 28, maxWeight: 36, feedPerWeek: 0, note: 'DOC Masuk kandang' },
      { week: 1, ageDays: 7, standardWeight: 75, minWeight: 67, maxWeight: 83, feedPerWeek: 80, note: 'Pemanas optimal' },
      { week: 2, ageDays: 14, standardWeight: 145, minWeight: 130, maxWeight: 160, feedPerWeek: 140, note: 'Vaksinasi wajib' },
      { week: 3, ageDays: 21, standardWeight: 240, minWeight: 215, maxWeight: 265, feedPerWeek: 220, note: 'Pertumbuhan cepat' },
      { week: 4, ageDays: 28, standardWeight: 360, minWeight: 325, maxWeight: 395, feedPerWeek: 310, note: 'Peralihan pakan grower' },
      { week: 5, ageDays: 35, standardWeight: 510, minWeight: 460, maxWeight: 560, feedPerWeek: 420, note: 'Cek kepadatan sekam' },
      { week: 6, ageDays: 42, standardWeight: 680, minWeight: 615, maxWeight: 745, feedPerWeek: 520, note: 'Pelebaran kandang' },
      { week: 7, ageDays: 49, standardWeight: 860, minWeight: 780, maxWeight: 940, feedPerWeek: 610, note: 'Finishing awal' },
      { week: 8, ageDays: 56, standardWeight: 1030, minWeight: 930, maxWeight: 1130, feedPerWeek: 690, note: 'Siap panen 0.9 - 1.1 kg' }
    ]
  },
  broiler: {
    id: 'broiler',
    name: 'Ayam Broiler (Pedaging Komersial)',
    category: 'Ayam Ras Pedaging',
    docWeight: 42,
    harvestWeek: 5,
    targetHarvestWeight: 2000,
    description: 'Ayam ras pedaging komersial (Cobb/Ross) dengan laju pertumbuhan sangat cepat.',
    weeklyStandards: [
      { week: 0, ageDays: 0, standardWeight: 42, minWeight: 38, maxWeight: 46, feedPerWeek: 0, note: 'DOC Broiler tiba' },
      { week: 1, ageDays: 7, standardWeight: 185, minWeight: 170, maxWeight: 200, feedPerWeek: 160, note: 'Kunci bobot minggu pertama (4x DOC)' },
      { week: 2, ageDays: 14, standardWeight: 450, minWeight: 410, maxWeight: 490, feedPerWeek: 340, note: 'Fase starter akhir' },
      { week: 3, ageDays: 21, standardWeight: 900, minWeight: 820, maxWeight: 980, feedPerWeek: 620, note: 'Fase grower' },
      { week: 4, ageDays: 28, standardWeight: 1520, minWeight: 1400, maxWeight: 1640, feedPerWeek: 950, note: 'Ventilasi kandang ekstra' },
      { week: 5, ageDays: 35, standardWeight: 2150, minWeight: 1980, maxWeight: 2320, feedPerWeek: 1250, note: 'Fase finisher & panen' },
      { week: 6, ageDays: 42, standardWeight: 2800, minWeight: 2600, maxWeight: 3000, feedPerWeek: 1450, note: 'Panen bobot besar' }
    ]
  },
  kampung_asli: {
    id: 'kampung_asli',
    name: 'Ayam Kampung Asli (Lokal DIY)',
    category: 'Ayam Non-Ras Asli',
    docWeight: 27,
    harvestWeek: 14,
    targetHarvestWeight: 850,
    description: 'Ayam kampung lokal tradisional dengan tekstur daging kenyal dan gurih khas, laju tumbuh santai.',
    weeklyStandards: [
      { week: 0, ageDays: 0, standardWeight: 27, minWeight: 24, maxWeight: 30, feedPerWeek: 0, note: 'Kondisi awal' },
      { week: 1, ageDays: 7, standardWeight: 52, minWeight: 46, maxWeight: 58, feedPerWeek: 50, note: 'Brooding hangat' },
      { week: 2, ageDays: 14, standardWeight: 90, minWeight: 80, maxWeight: 100, feedPerWeek: 90, note: 'Pakan dedak + konsentrat' },
      { week: 3, ageDays: 21, standardWeight: 145, minWeight: 130, maxWeight: 160, feedPerWeek: 130, note: 'Adaptasi lingkungan' },
      { week: 4, ageDays: 28, standardWeight: 210, minWeight: 185, maxWeight: 235, feedPerWeek: 180, note: 'Mulai dilepas semi intensif' },
      { week: 5, ageDays: 35, standardWeight: 290, minWeight: 260, maxWeight: 320, feedPerWeek: 230, note: 'Tahan penyakit alami' },
      { week: 6, ageDays: 42, standardWeight: 380, minWeight: 340, maxWeight: 420, feedPerWeek: 280, note: 'Pemberian hijau-hijauan' },
      { week: 7, ageDays: 49, standardWeight: 480, minWeight: 430, maxWeight: 530, feedPerWeek: 330, note: 'Aktivitas lincah' },
      { week: 8, ageDays: 56, standardWeight: 590, minWeight: 530, maxWeight: 650, feedPerWeek: 380, note: 'Pakan hijauan & bijian' },
      { week: 9, ageDays: 63, standardWeight: 700, minWeight: 630, maxWeight: 770, feedPerWeek: 430, note: 'Pertumbuhan stabil' },
      { week: 10, ageDays: 70, standardWeight: 810, minWeight: 730, maxWeight: 890, feedPerWeek: 480, note: 'Bobot mulai konsumsi' },
      { week: 11, ageDays: 77, standardWeight: 910, minWeight: 820, maxWeight: 1000, feedPerWeek: 520, note: 'Kematangan fisik' },
      { week: 12, ageDays: 84, standardWeight: 1000, minWeight: 900, maxWeight: 1100, feedPerWeek: 550, note: 'Siap panen pasar lokal' }
    ]
  }
};

window.POULTRY_STANDARDS = POULTRY_STANDARDS;
