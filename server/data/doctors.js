/*
 * src/data/doctors.js
 * ─────────────────────────────────────────────────────────────
 * Mock doctor profiles array.
 *
 * In production, replace with API call:
 *   GET /api/v1/doctors?city=vijayawada&limit=20&page=1
 *
 * Each doctor object shape:
 * {
 *   id        number   — unique identifier (used in /doctor/:id route)
 *   name      string   — full name with Dr. prefix
 *   spec      string   — medical specialty (used in search filter)
 *   hospital  string   — primary affiliated hospital
 *   city      string   — practice city
 *   rating    number   — average review score (0.0 – 5.0)
 *   reviews   number   — total verified review count
 *   fee       number   — consultation fee in INR
 *   exp       number   — years of experience
 *   color     string   — avatar background color (CSS hex)
 *   initials  string   — 2-letter initials for avatar fallback
 *   tags      string[] — searchable specialization keywords
 *   bio       string   — professional summary (shown on detail page)
 *   education string   — qualifications
 *   nmcId     string   — NMC registration number (verified badge)
 *   verified  boolean  — NMC verified status
 *   nabh      boolean  — hospital holds NABH accreditation
 *   reviewsList object[] — sample reviews for detail page
 * }
 * ─────────────────────────────────────────────────────────────
 */
export const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Meena Krishnan',
    spec: 'Cardiologist',
    hospital: 'Apollo Hospitals',
    city: 'Vijayawada',
    lat: 16.5119,
    lng: 80.6321,
    rating: 4.9,
    reviews: 312,
    fee: 800,
    exp: 18,
    color: '#0a3d2e',
    initials: 'MK',
    tags: ['Interventional Cardiology', 'Heart Failure', 'Angioplasty'],
    bio: 'Senior interventional cardiologist with 18+ years at Apollo Hospitals. Pioneer of minimally invasive cardiac procedures in Andhra Pradesh with over 2,000 successful angioplasties.',
    education: 'MBBS, MD (Cardiology) — AIIMS New Delhi',
    nmcId: 'NMC-AP-2006-04821',
    verified: true,
    nabh: true,
    reviewsList: [
      { author: 'Ravi K.',   initials: 'RK', date: 'March 2026',    text: 'Exceptional doctor. Explained every step of my angioplasty clearly. Recovery was smooth and follow-up care thorough.', outcome: 5, comm: 5, cost: 4 },
      { author: 'Sunita M.', initials: 'SM', date: 'February 2026', text: 'Waited 40 minutes past appointment, but the consultation itself was excellent. Very knowledgeable and reassuring.',  outcome: 4, comm: 4, cost: 3 },
      { author: 'Prasad V.', initials: 'PV', date: 'January 2026',  text: "My father had bypass surgery under this doctor's care. The outcome exceeded our expectations. Forever grateful.",   outcome: 5, comm: 5, cost: 4 },
    ],
  },
  {
    id: 2,
    name: 'Dr. Suresh Rao',
    spec: 'Nephrologist',
    hospital: 'KIMS Hospital',
    city: 'Vijayawada',
    lat: 16.5163,
    lng: 80.6211,
    rating: 4.7,
    reviews: 198,
    fee: 600,
    exp: 14,
    color: '#1a4f8a',
    initials: 'SR',
    tags: ['Dialysis', 'Kidney Transplant', 'CKD Management'],
    bio: 'Leading nephrologist specializing in kidney transplant and chronic kidney disease. Manages one of AP\'s busiest dialysis units with 400+ transplant evaluations.',
    education: 'MBBS, MD, DM (Nephrology) — Osmania Medical College, Hyderabad',
    nmcId: 'NMC-AP-2010-07234',
    verified: true,
    nabh: false,
    reviewsList: [
      { author: 'Lakshmi N.', initials: 'LN', date: 'April 2026', text: 'Dr. Rao explained my kidney disease in simple terms and created a very clear treatment plan. Dialysis sessions well managed.', outcome: 5, comm: 4, cost: 4 },
      { author: 'Gopal R.',   initials: 'GR', date: 'March 2026', text: 'Good doctor but clinic has long wait times. Medical care quality is excellent though.',                                          outcome: 4, comm: 3, cost: 4 },
    ],
  },
  {
    id: 3,
    name: 'Dr. Priya Venkat',
    spec: 'Neurologist',
    hospital: 'Manipal Hospitals',
    city: 'Vijayawada',
    lat: 16.5042,
    lng: 80.6440,
    rating: 4.8,
    reviews: 267,
    fee: 900,
    exp: 12,
    color: '#7a2d8c',
    initials: 'PV',
    tags: ['Epilepsy', 'Stroke Rehabilitation', 'Movement Disorders'],
    bio: 'Award-winning neurologist with expertise in epilepsy surgery evaluation and stroke rehabilitation. Completed fellowship at Cleveland Clinic, USA.',
    education: 'MBBS, MD, DM (Neurology) — NIMHANS Bangalore',
    nmcId: 'NMC-AP-2012-09104',
    verified: true,
    nabh: true,
    reviewsList: [
      { author: 'Arjun P.', initials: 'AP', date: 'May 2026', text: "She correctly diagnosed my condition when three other neurologists couldn't. Life-changing treatment plan. Highly recommend.", outcome: 5, comm: 5, cost: 3 },
    ],
  },
  {
    id: 4,
    name: 'Dr. Ramesh Chandra',
    spec: 'Orthopedic',
    hospital: 'Care Hospitals',
    city: 'Guntur',
    lat: 16.3012,
    lng: 80.4488,
    rating: 4.6,
    reviews: 445,
    fee: 700,
    exp: 22,
    color: '#b8620a',
    initials: 'RC',
    tags: ['Joint Replacement', 'Sports Medicine', 'Spine Surgery'],
    bio: 'Pioneered robotic-assisted knee replacement in Andhra Pradesh with 1,500+ successful procedures. Visiting consultant for rural outreach programs.',
    education: 'MBBS, MS (Orthopaedics) — Gandhi Medical College, Hyderabad',
    nmcId: 'NMC-AP-2002-02341',
    verified: true,
    nabh: true,
    reviewsList: [
      { author: 'Venkat S.', initials: 'VS', date: 'April 2026', text: 'Knee replacement done perfectly. Back to walking without pain in 6 weeks. Robotic precision is remarkable.', outcome: 5, comm: 4, cost: 3 },
      { author: 'Kamala B.', initials: 'KB', date: 'March 2026', text: 'Hip replacement done at age 72. Doctor was patient, explained risks clearly, and recovery has been excellent.',  outcome: 5, comm: 5, cost: 4 },
    ],
  },
  {
    id: 5,
    name: 'Dr. Lakshmi Devi',
    spec: 'Gynecologist',
    hospital: 'Rainbow Hospitals',
    city: 'Vijayawada',
    lat: 16.5073,
    lng: 80.6182,
    rating: 4.9,
    reviews: 521,
    fee: 500,
    exp: 16,
    color: '#c0392b',
    initials: 'LD',
    tags: ['High-risk Pregnancy', 'IVF', 'Laparoscopic Surgery'],
    bio: 'Senior obstetrician-gynecologist with expertise in high-risk pregnancies and reproductive medicine. Has delivered 4,000+ babies and led 300+ successful IVF cycles.',
    education: 'MBBS, MD, DGO — NTR University of Health Sciences',
    nmcId: 'NMC-AP-2008-06122',
    verified: true,
    nabh: false,
    reviewsList: [
      { author: 'Ananya K.', initials: 'AK', date: 'May 2026', text: "Delivered my twins safely after a high-risk pregnancy. Dr. Lakshmi's calm and expert care made all the difference.", outcome: 5, comm: 5, cost: 5 },
    ],
  },
  {
    id: 6,
    name: 'Dr. Anil Kumar',
    spec: 'Oncologist',
    hospital: 'Omega Hospitals',
    city: 'Hyderabad',
    lat: 17.3850,
    lng: 78.4867,
    rating: 4.7,
    reviews: 189,
    fee: 1200,
    exp: 20,
    color: '#2d6a4f',
    initials: 'AK',
    tags: ['Medical Oncology', 'Immunotherapy', 'Breast Cancer'],
    bio: 'Medical oncologist with 20+ years at leading cancer centers. Expert in targeted therapy and immunotherapy. Leads AP\'s first molecular tumor board.',
    education: 'MBBS, MD, DM (Medical Oncology) — Tata Memorial Hospital, Mumbai',
    nmcId: 'NMC-TS-2004-03819',
    verified: true,
    nabh: true,
    reviewsList: [
      { author: 'Sreedhar M.', initials: 'SM', date: 'April 2026', text: "My wife's cancer treatment was managed with exceptional expertise and compassion. Dr. Anil always made time to answer our questions.", outcome: 5, comm: 5, cost: 3 },
    ],
  },
]

// All unique specialties — used to populate the search filter dropdown
export const SPECIALTIES = [...new Set(DOCTORS.map(d => d.spec))].sort()
