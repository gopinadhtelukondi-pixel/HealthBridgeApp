export const COST_DATA = {
  angioplasty: { name: 'Coronary Angioplasty', base: [180000, 280000, 380000], room: 25000, meds: 40000, tests: 30000, records: 342 },
  bypass: { name: 'Bypass Surgery (CABG)', base: [280000, 420000, 580000], room: 50000, meds: 80000, tests: 50000, records: 218 },
  knee: { name: 'Knee Replacement', base: [150000, 250000, 380000], room: 30000, meds: 40000, tests: 20000, records: 489 },
  hip: { name: 'Hip Replacement', base: [160000, 280000, 400000], room: 30000, meds: 45000, tests: 20000, records: 312 },
  appendix: { name: 'Appendectomy', base: [40000, 70000, 120000], room: 15000, meds: 15000, tests: 10000, records: 621 },
  cataract: { name: 'Cataract Surgery', base: [20000, 40000, 70000], room: 0, meds: 5000, tests: 5000, records: 894 },
  dialysis: { name: 'Dialysis (per session)', base: [800, 1200, 1800], room: 0, meds: 200, tests: 200, records: 1204 },
  chemo: { name: 'Chemotherapy (per cycle)', base: [30000, 60000, 100000], room: 20000, meds: 30000, tests: 15000, records: 287 },
  mri: { name: 'MRI Scan', base: [3000, 5000, 8000], room: 0, meds: 0, tests: 0, records: 2341 },
  delivery: { name: 'Normal Delivery', base: [15000, 30000, 55000], room: 20000, meds: 8000, tests: 8000, records: 1122 },
};

export const HOSPITAL_MULTS = { govt: 0.3, tier2: 1.0, tier1: 1.5, corporate: 2.2 };
export const CITY_MULTS = { metro: 1.4, tier1city: 1.0, tier2city: 0.75, rural: 0.55 };
export const INS_MULTS = { none: 1.0, basic: 0.7, comprehensive: 0.5, ayushman: 0.2 };