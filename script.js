const K = 'trigrexam_demo_v2',
  $ = s => document.querySelector(s),
  E = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  R = n => '₹' + Number(n).toLocaleString('en-IN'),
  id = p => p + Math.random().toString(36).slice(2, 7),
  sum = (a, f) => a.reduce((s, x) => s + (Number(x[f]) || 0), 0);

const TEACHERS_SEED = [
  { id: 'u3', name: 'Meera Iyer', email: 'instructor@abcinstitute.demo', phone: '9820145892', subject: 'Physics', regDate: '15 Jan 2025', role: 'instructor', centers: ['c1', 'c2'], status: 'Active' },
  { id: 'u4', name: 'Karan Shah', email: 'karan@abcinstitute.demo', phone: '9833412580', subject: 'Computer Science', regDate: '02 Feb 2025', role: 'instructor', centers: ['c3', 'c2'], status: 'Active' },
  { id: 't1', name: 'Dr. Rajesh Sharma', email: 'rajesh.sharma@abcinstitute.demo', phone: '9811234567', subject: 'Chemistry', regDate: '10 Mar 2025', role: 'instructor', centers: ['c1'], status: 'Active' },
  { id: 't2', name: 'Sunita Verma', email: 'sunita.v@abcinstitute.demo', phone: '9845123980', subject: 'Mathematics', regDate: '22 Mar 2025', role: 'instructor', centers: ['c2'], status: 'Active' },
  { id: 't3', name: 'Amitabh Sen', email: 'amitabh.sen@abcinstitute.demo', phone: '9876543210', subject: 'Biology', regDate: '05 Apr 2025', role: 'instructor', centers: ['c1', 'c3'], status: 'Active' },
  { id: 't4', name: 'Pooja Kulkarni', email: 'pooja.k@abcinstitute.demo', phone: '9822334455', subject: 'Physics', regDate: '18 Apr 2025', role: 'instructor', centers: ['c2'], status: 'Active' },
  { id: 't5', name: 'Vikramaditya Roy', email: 'vikram.roy@abcinstitute.demo', phone: '9810987654', subject: 'Mathematics', regDate: '01 May 2025', role: 'instructor', centers: ['c3'], status: 'Active' },
  { id: 't6', name: 'Nandini Dasgupta', email: 'nandini.d@abcinstitute.demo', phone: '9899887766', subject: 'Chemistry', regDate: '14 May 2025', role: 'instructor', centers: ['c1', 'c2'], status: 'Active' },
  { id: 't7', name: 'Harish Chandra', email: 'harish.c@abcinstitute.demo', phone: '9871239871', subject: 'Science', regDate: '03 Jun 2025', role: 'instructor', centers: ['c3'], status: 'Active' },
  { id: 't8', name: 'Ananya Deshmukh', email: 'ananya.d@abcinstitute.demo', phone: '9834567890', subject: 'Biology', regDate: '19 Jun 2025', role: 'instructor', centers: ['c1'], status: 'Active' },
  { id: 't9', name: 'Sanjay Malhotra', email: 'sanjay.m@abcinstitute.demo', phone: '9818765432', subject: 'Computer Science', regDate: '08 Jul 2025', role: 'instructor', centers: ['c2'], status: 'Inactive' },
  { id: 't10', name: 'Ritu Singhania', email: 'ritu.s@abcinstitute.demo', phone: '9829988112', subject: 'Mathematics', regDate: '25 Jul 2025', role: 'instructor', centers: ['c3'], status: 'Active' },
  { id: 't11', name: 'Pradeep Nambiar', email: 'pradeep.n@abcinstitute.demo', phone: '9840123456', subject: 'English', regDate: '12 Aug 2025', role: 'instructor', centers: ['c1', 'c2'], status: 'Active' },
  { id: 't12', name: 'Kavita Menon', email: 'kavita.m@abcinstitute.demo', phone: '9811442233', subject: 'Physics', regDate: '30 Aug 2025', role: 'instructor', centers: ['c2', 'c3'], status: 'Active' },
  { id: 't13', name: 'Deepak Joshi', email: 'deepak.j@abcinstitute.demo', phone: '9833557799', subject: 'Reasoning', regDate: '15 Sep 2025', role: 'instructor', centers: ['c1'], status: 'Active' }
];

const seed0 = () => ({
  inst: 'Apex Career Academy',
  opMode: 'Both',
  centers: [
    { id: 'c1', name: 'Delhi Main', code: 'DEL', city: 'Delhi', status: 'Active' },
    { id: 'c2', name: 'Noida Branch', code: 'NOI', city: 'Noida', status: 'Active' },
    { id: 'c3', name: 'Jaipur Branch', code: 'JAI', city: 'Jaipur', status: 'Active' }
  ],
  users: [
    { id: 'u1', name: 'Anita Rao', email: 'owner@abcinstitute.demo', role: 'owner', centers: [], status: 'Active' },
    { id: 'u2', name: 'Rahul Verma', email: 'admin@abcinstitute.demo', role: 'admin', centers: ['c1', 'c2'], status: 'Active' },
    { id: 'u5', name: 'Neha Kapoor', email: 'neha@abcinstitute.demo', role: 'admin', centers: ['c3'], status: 'Active' },
    ...TEACHERS_SEED,
    { id: 's1', name: 'Aarav Mehta', email: 'student@abcinstitute.demo', role: 'student', centers: ['c1'], batch: 'b1', courses: ['k1', 'k2'], status: 'Active' },
    { id: 's2', name: 'Isha Gupta', email: 'isha@mail.demo', role: 'student', centers: ['c1'], batch: 'b1', courses: ['k1'], status: 'Active' },
    { id: 's3', name: 'Rohan Das', email: 'rohan@mail.demo', role: 'student', centers: ['c2'], batch: 'b2', courses: ['k2', 'k3'], status: 'Active' },
    { id: 's4', name: 'Sara Khan', email: 'sara@mail.demo', role: 'student', centers: ['c2'], batch: 'b2', courses: ['k3'], status: 'Active' },
    { id: 's5', name: 'Vikram Singh', email: 'vikram@mail.demo', role: 'student', centers: ['c3'], batch: 'b3', courses: ['k1'], status: 'Active' },
    { id: 's6', name: 'Tanya Jain', email: 'tanya@mail.demo', role: 'student', centers: ['c3'], batch: 'b3', courses: ['k2', 'k3'], status: 'Active' },
    { id: 's7', name: 'Dev Patel', email: 'dev@mail.demo', role: 'student', centers: ['c1'], batch: 'b1', courses: ['k1', 'k3'], status: 'Inactive' }
  ],
  courses: [
    { id: 'k1', name: 'JEE Advanced & Main Masterclass', code: 'JEE01', access: 'Paid', price: 45000, centers: ['c1', 'c2', 'c3'], status: 'Published', subjects: 'Physics, Maths', instr: 'u3', lessons: ['Kinematics & Dynamics', 'Newton’s Laws of Motion', 'Coordinate Geometry', 'Organic Chemistry Basics'] },
    { id: 'k2', name: 'NEET Medical Excellence Batch', code: 'NEET01', access: 'Paid', price: 42000, centers: ['c1', 'c2', 'c3'], status: 'Published', subjects: 'Biology', instr: 'u3', lessons: ['Cell Biology & Genetics', 'Human Physiology', 'Plant Kingdom', 'Biotechnology Principles'] },
    { id: 'k3', name: 'Full Stack Python & Data Structures', code: 'PY01', access: 'Free', price: 0, centers: ['c2', 'c3'], status: 'Published', subjects: 'Programming', instr: 'u4', lessons: ['Variables & Data Types', 'Loops & Control Flow', 'Functions & OOP', 'FastAPI & SQL Integration'] }
  ],
  batches: [
    { id: 'b1', name: 'JEE Alpha Cohort', center: 'c1', courses: 'JEE Advanced & Main Masterclass', cap: 35 },
    { id: 'b2', name: 'Noida Medical Mixed', center: 'c2', courses: 'NEET Excellence, Python', cap: 30 },
    { id: 'b3', name: 'Jaipur Super 30', center: 'c3', courses: 'JEE, NEET, Python', cap: 30 }
  ],
  inv: [
    { id: 'i1', sid: 's1', center: 'c1', total: 45000, paid: 45000 },
    { id: 'i2', sid: 's2', center: 'c1', total: 45000, paid: 20000 },
    { id: 'i3', sid: 's3', center: 'c2', total: 42000, paid: 0 },
    { id: 'i4', sid: 's5', center: 'c3', total: 45000, paid: 45000 },
    { id: 'i5', sid: 's6', center: 'c3', total: 42000, paid: 10000 },
    { id: 'i6', sid: 's7', center: 'c1', total: 45000, paid: 15000 }
  ],
  pay: [],
  invites: [
    { id: 'i0', email: 'priya@mail.demo', name: 'Priya N', role: 'instructor', centers: ['c1'], status: 'Pending', tok: 'demo123', sent: 1 }
  ],
  out: [],
  notes: [],
  tests: [
    { id: 't1', name: 'Physics Mechanics Quick Quiz', course: 'k1', min: 10, qs: [{ q: 'What is the SI unit of force?', o: ['Joule', 'Newton', 'Watt', 'Pascal'], a: 1 }, { q: 'Speed = distance / ?', o: ['Mass', 'Time', 'Force', 'Area'], a: 1 }, { q: 'Acceleration due to gravity ≈', o: ['9.8 m/s²', '98 m/s²', '0.98 m/s²', '1 m/s²'], a: 0 }] },
    { id: 't2', name: 'Python Core & Algorithm Basics', course: 'k3', min: 15, qs: [{ q: 'Which keyword defines a function in Python?', o: ['func', 'def', 'fn', 'function'], a: 1 }, { q: 'Output of len("python")?', o: ['5', '6', '7', 'Error'], a: 1 }] }
  ],
  res: [],
  prog: { 's1|k1': [0, 1] }
});

const FN = ['Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Reyansh', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Pari', 'Myra', 'Kavya', 'Riya', 'Navya', 'Anika', 'Kabir', 'Rudra', 'Advik', 'Yash', 'Harsh', 'Nikhil', 'Pranav', 'Tanvi', 'Sneha', 'Pooja', 'Meghna', 'Nandini', 'Ritika', 'Simran', 'Aditi', 'Varun', 'Siddharth', 'Manav', 'Lakshay', 'Dhruv'];
const LN = ['Sharma', 'Verma', 'Gupta', 'Agarwal', 'Mehta', 'Joshi', 'Nair', 'Reddy', 'Iyer', 'Kulkarni', 'Patel', 'Desai', 'Chopra', 'Malhotra', 'Bansal', 'Saxena', 'Mishra', 'Pandey', 'Chauhan', 'Rathore', 'Khanna', 'Sinha', 'Bhatia', 'Menon', 'Kapoor'];

const seed = () => {
  const d = seed0(),
    cb = { c1: 'b1', c2: 'b2', c3: 'b3' },
    cc = { c1: [['k1'], ['k1', 'k2'], ['k2']], c2: [['k2'], ['k3'], ['k2', 'k3']], c3: [['k1'], ['k2', 'k3'], ['k1', 'k3']] };
  d.users.forEach(u => {
    if (u.role === 'student') {
      u.mode = 'Offline';
      u.phone = '98' + String(10000000 + u.id.charCodeAt(1) * 1234567).slice(0, 8);
    }
  });
  for (let i = 0; i < 93; i++) {
    const f = FN[(i * 7 + (i % 3)) % 40],
      l = LN[(i * 11 + 3) % 25],
      on = i % 9 === 4,
      c = ['c1', 'c2', 'c3'][i % 3];
    d.users.push({
      id: 'g' + i,
      name: f + ' ' + l,
      email: `${f}.${l}${i + 10}@gmail.com`.toLowerCase(),
      phone: '9' + String(812345670 + i * 7919).slice(0, 9),
      role: 'student',
      mode: on ? 'Online' : 'Offline',
      centers: on ? [] : [c],
      batch: on ? '' : cb[c],
      courses: on ? (i % 2 ? ['k3'] : ['k1', 'k3']) : cc[c][i % 3],
      status: 'Active'
    });
  }
  return d;
};

let D;
try {
  D = JSON.parse(localStorage.getItem(K));
} catch (e) {}
D = D || seed();

// Ensure existing local storage data has the 15 teachers with complete fields, subjects and roles
if (D && D.users) {
  TEACHERS_SEED.forEach(t => {
    const ex = D.users.find(u => u.id === t.id);
    if (!ex) {
      D.users.push({ ...t, roles: ['instructor'] });
    } else {
      if (!ex.phone) ex.phone = t.phone;
      if (!ex.regDate) ex.regDate = t.regDate;
      if (!ex.subject || ex.subject !== t.subject) ex.subject = t.subject;
      if (!ex.roles) ex.roles = [ex.role || 'instructor'];
    }
  });
  D.users.forEach(u => {
    if (!u.roles) {
      u.roles = [u.role || (u.id.startsWith('s') ? 'student' : 'instructor')];
    }
    if ((u.role === 'instructor' || (u.roles && u.roles.includes('instructor'))) && !u.subject) {
      u.subject = 'Physics';
    }
  });
  // Sample dual-role faculty member (Meera Iyer is both Lead Teacher and Administrator)
  const meera = D.users.find(u => u.id === 'u3');
  if (meera && !meera.roles.includes('admin')) {
    meera.roles.push('admin');
  }
}

/* ============================================================== */
/* ONLINETESTPANEL-WEB SEED DATA: PACKAGES, COUPONS & CBT TESTS   */
/* ============================================================== */

const DEFAULT_PACKAGES = [
  {
    id: 'pkg1',
    name: 'JEE Advanced & Main Master Test Series 2026',
    category: 'Engineering',
    type: 'test',
    price: 4999,
    testsCount: 45,
    notesCount: 120,
    enrolledStudents: 142,
    rating: 4.9,
    reviews: 64,
    validity: '365 Days',
    courseId: 'k1',
    status: 'Published',
    description: 'Comprehensive CBT test series with national percentile ranking, AI video solutions and performance benchmarking matching the exact NTA exam pattern.',
    schedule: [
      { title: 'Mechanics & Rotational Dynamics Mock Paper', type: 'PDF', download: true },
      { title: 'Electrostatics & Magnetism High-Yield Formula Sheet', type: 'PDF', download: true },
      { title: 'Calculus & Vectors Full Length CBT Test', type: 'Test', testId: 't1' }
    ]
  },
  {
    id: 'pkg2',
    name: 'NEET Medical Excellence High-Yield Test Pack',
    category: 'Medical',
    type: 'test',
    price: 3999,
    testsCount: 50,
    notesCount: 180,
    enrolledStudents: 188,
    rating: 4.8,
    reviews: 82,
    validity: '180 Days',
    courseId: 'k2',
    status: 'Published',
    description: 'NCERT line-by-line question bank, negative marking drills, Botany, Zoology, Physics and Chemistry full syllabus simulations.',
    schedule: [
      { title: 'Human Physiology NCERT Mastery Notes', type: 'PDF', download: true },
      { title: 'Genetics & Evolution Speed Drill', type: 'Test', testId: 't3' }
    ]
  },
  {
    id: 'pkg3',
    name: 'Full Stack Python & DSA Coding Assessment Vault',
    category: 'Programming',
    type: 'test',
    price: 0,
    testsCount: 25,
    notesCount: 65,
    enrolledStudents: 260,
    rating: 4.9,
    reviews: 110,
    validity: 'Lifetime',
    courseId: 'k3',
    status: 'Published',
    description: 'Interactive coding sandbox tests with live compiler, algorithmic complexity challenges, and instant unit test validations.',
    schedule: [
      { title: 'Data Structures & Algorithms Cheat Sheet', type: 'PDF', download: true },
      { title: 'Python Core & Algorithm Basics CBT Quiz', type: 'Test', testId: 't2' }
    ]
  }
];

const DEFAULT_BUYERS = [
  { id: 'ORD-8921', sid: 's1', name: 'Aarav Mehta', email: 'student@abcinstitute.demo', phone: '9820145892', pkgId: 'pkg1', pkgName: 'JEE Advanced & Main Master Test Series 2026', date: '10 Feb 2026, 14:22', amount: 4999, coupon: 'WELCOME50', discount: 2500, finalPaid: 2499, mode: 'Razorpay UPI', status: 'Success' },
  { id: 'ORD-8922', sid: 's2', name: 'Isha Gupta', email: 'isha@mail.demo', phone: '9845123980', pkgId: 'pkg2', pkgName: 'NEET Medical Excellence High-Yield Test Pack', date: '08 Feb 2026, 11:15', amount: 3999, coupon: 'TOPPER20', discount: 800, finalPaid: 3199, mode: 'NetBanking', status: 'Success' },
  { id: 'ORD-8923', sid: 's3', name: 'Rohan Das', email: 'rohan@mail.demo', phone: '9876543210', pkgId: 'pkg3', pkgName: 'Full Stack Python & DSA Coding Assessment Vault', date: '05 Feb 2026, 09:40', amount: 0, coupon: '—', discount: 0, finalPaid: 0, mode: 'Free Enrollment', status: 'Success' },
  { id: 'ORD-8924', sid: 's4', name: 'Sara Khan', email: 'sara@mail.demo', phone: '9822334455', pkgId: 'pkg1', pkgName: 'JEE Advanced & Main Master Test Series 2026', date: '03 Feb 2026, 16:50', amount: 4999, coupon: 'FLAT1000', discount: 1000, finalPaid: 3999, mode: 'Card (Visa)', status: 'Success' },
  { id: 'ORD-8925', sid: 's5', name: 'Vikram Singh', email: 'vikram@mail.demo', phone: '9810987654', pkgId: 'pkg2', pkgName: 'NEET Medical Excellence High-Yield Test Pack', date: '01 Feb 2026, 18:05', amount: 3999, coupon: '—', discount: 0, finalPaid: 3999, mode: 'Razorpay UPI', status: 'Success' },
  { id: 'ORD-8926', sid: 's6', name: 'Tanya Jain', email: 'tanya@mail.demo', phone: '9899887766', pkgId: 'pkg1', pkgName: 'JEE Advanced & Main Master Test Series 2026', date: '29 Jan 2026, 12:30', amount: 4999, coupon: 'TOPPER20', discount: 1000, finalPaid: 3999, mode: 'UPI QR', status: 'Success' },
  { id: 'ORD-8927', sid: 's7', name: 'Dev Patel', email: 'dev@mail.demo', phone: '9876501234', pkgId: 'pkg2', pkgName: 'NEET Medical Excellence High-Yield Test Pack', date: '26 Jan 2026, 15:45', amount: 3999, coupon: 'WELCOME50', discount: 2000, finalPaid: 1999, mode: 'NetBanking', status: 'Success' }
];

const DEFAULT_TOKENS = [
  { id: 'tok_1', code: 'TGR-JEE-VIP26', pkgId: 'pkg1', pkgName: 'JEE Advanced & Main Master Test Series 2026', type: '100% Free Access', maxUses: 50, usedCount: 18, expiresAt: '31 Dec 2026', createdBy: 'Meera Iyer (Instructor)', status: 'Active' },
  { id: 'tok_2', code: 'TGR-NEET-BATCH20', pkgId: 'pkg2', pkgName: 'NEET Medical Excellence High-Yield Test Pack', type: 'Scholarship Grant', maxUses: 30, usedCount: 24, expiresAt: '15 Aug 2026', createdBy: 'Dr. Rajesh Sharma (Owner)', status: 'Active' },
  { id: 'tok_3', code: 'TGR-PYTHON-OPEN', pkgId: 'pkg3', pkgName: 'Full Stack Python & DSA Coding Assessment Vault', type: 'Open Campus', maxUses: 500, usedCount: 260, expiresAt: '30 Jun 2026', createdBy: 'Karan Shah (Instructor)', status: 'Active' },
  { id: 'tok_4', code: 'TGR-SCHOLAR-100', pkgId: 'pkg1', pkgName: 'JEE Advanced & Main Master Test Series 2026', type: 'Topper Pass', maxUses: 10, usedCount: 10, expiresAt: '28 Feb 2026', createdBy: 'Administrator', status: 'Exhausted' },
  { id: 'tok_5', code: 'TGR-DEMO-EXPIRED', pkgId: 'all', pkgName: 'All Active Packages', type: 'Trial Access', maxUses: 1, usedCount: 1, expiresAt: '10 Jan 2026', createdBy: 'Administrator', status: 'Expired' }
];

const DEFAULT_COUPONS = [
  { id: 'cpn_1', code: 'WELCOME50', type: 'percentage', discount: 50, desc: '50% off on first test series purchase', minCart: 1000, maxUses: 200, usedCount: 42, expiresAt: '31 Mar 2026', status: 'Active' },
  { id: 'cpn_2', code: 'TOPPER20', type: 'percentage', discount: 20, desc: '20% off across all packages', minCart: 500, maxUses: 500, usedCount: 128, expiresAt: '31 Dec 2026', status: 'Active' },
  { id: 'cpn_3', code: 'FLAT1000', type: 'flat', discount: 1000, desc: 'Flat ₹1,000 instant discount', minCart: 3000, maxUses: 100, usedCount: 35, expiresAt: '30 Apr 2026', status: 'Active' },
  { id: 'cpn_4', code: 'EARLYBIRD', type: 'percentage', discount: 25, desc: 'Early Bird admission concession', minCart: 2000, maxUses: 50, usedCount: 50, expiresAt: '15 Jan 2026', status: 'Expired' }
];

const DEFAULT_MESSAGES = [
  {
    id: 'msg_1',
    toStudentId: 's1',
    toStudentName: 'Aarav Mehta',
    toStudentEmail: 'student@abcinstitute.demo',
    fromId: 'u3',
    fromName: 'Meera Iyer',
    fromRole: 'Instructor',
    subject: 'Physics Mechanics Mock Test Feedback & Strategy',
    body: 'Dear Aarav,\n\nI reviewed your recent attempt in the All India JEE Advanced CBT Exam. Excellent work on Kinematics and Newton\'s Laws with 100% accuracy. However, you should practice Rotational Dynamics and Moment of Inertia questions from the question bank before next week\'s full syllabus drill.\n\nKeep up the great work!',
    tag: 'Academic Guidance',
    priority: 'High',
    date: '11 Feb 2026, 16:45',
    read: false,
    replies: []
  },
  {
    id: 'msg_2',
    toStudentId: 's1',
    toStudentName: 'Aarav Mehta',
    toStudentEmail: 'student@abcinstitute.demo',
    fromId: 'u1',
    fromName: 'Dr. Rajesh Sharma',
    fromRole: 'Institute Owner',
    subject: 'Welcome to the 2026 Advanced Exam Prep Cohort',
    body: 'Welcome to Trigrexam learning workspace, Aarav! You have been granted full access to the JEE Advanced Master Test Series. Live doubt sessions are conducted every Wednesday and Saturday. Feel free to reach out to the faculty team for any review assistance.',
    tag: 'General Notice',
    priority: 'Normal',
    date: '02 Feb 2026, 10:15',
    read: true,
    replies: [
      { from: 'Aarav Mehta', role: 'Student', text: 'Thank you Sir! Looking forward to attending the live sessions and taking the tests.', at: '02 Feb 2026, 11:00' }
    ]
  },
  {
    id: 'msg_3',
    toStudentId: 's2',
    toStudentName: 'Isha Gupta',
    toStudentEmail: 'isha@mail.demo',
    fromId: 'u2',
    fromName: 'Administrator',
    fromRole: 'Administrator',
    subject: 'Batch B1 Medical Session Timing Update',
    body: 'Hello Isha,\n\nPlease note that Friday\'s Biology Live Class on Human Physiology has been rescheduled to 4:30 PM. Kindly be online 5 minutes before time.',
    tag: 'Exam Notice',
    priority: 'Urgent',
    date: '10 Feb 2026, 18:20',
    read: false,
    replies: []
  }
];

// Ensure D has Shopping data and Direct Messages initialized
if (D) {
  if (!D.buyers || !D.buyers.length) D.buyers = JSON.parse(JSON.stringify(DEFAULT_BUYERS));
  if (!D.tokens || !D.tokens.length) D.tokens = JSON.parse(JSON.stringify(DEFAULT_TOKENS));
  if (!D.coupons || !D.coupons.length) D.coupons = JSON.parse(JSON.stringify(DEFAULT_COUPONS));
  if (!D.messages || !D.messages.length) D.messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));
}

const CBT_TESTS_SEED = [
  {
    id: 't1',
    name: 'All India JEE Advanced Master CBT Exam',
    course: 'k1',
    min: 20,
    total_qs: 8,
    max_score: 32,
    marks_positive: 4,
    marks_negative: 1,
    is_calc_allow: true,
    lang: 'EN',
    sections: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
    qs: [
      {
        id: 'q1',
        sec: 'Physics',
        qtype: 'MCQ',
        q: 'A block of mass 2 kg is pulled across a rough horizontal surface with a constant force of 12 N. If the coefficient of kinetic friction is μ = 0.4, find the acceleration of the block. (Take g = 10 m/s²)',
        hi_q: '2 किग्रा द्रव्यमान का एक गुटका 12 N के नियत बल से खुरदरी क्षैतिज सतह पर खींचा जाता है। यदि घर्षण गुणांक μ = 0.4 है, तो गुटके का त्वरण ज्ञात कीजिए। (g = 10 m/s² लें)',
        o: ['A) 0 m/s²', 'B) 2 m/s²', 'C) 4 m/s²', 'D) 6 m/s²'],
        hi_o: ['A) 0 m/s²', 'B) 2 m/s²', 'C) 4 m/s²', 'D) 6 m/s²'],
        a: 1,
        pos: 4,
        neg: 1,
        sol: 'Limiting friction force f = μ·m·g = 0.4 × 2 × 10 = 8 N. Net accelerating force F_net = 12 N - 8 N = 4 N. Acceleration a = F_net / m = 4 N / 2 kg = 2 m/s².'
      },
      {
        id: 'q2',
        sec: 'Physics',
        qtype: 'NAT',
        q: 'A projectile is launched from ground level with speed u = 20 m/s at an angle of 30° above the horizontal. Calculate its maximum vertical height in meters. (Take g = 10 m/s²)',
        hi_q: 'एक प्रक्षेप्य को 20 m/s की चाल से क्षैतिज से 30° के कोण पर प्रक्षेपित किया जाता है। इसकी अधिकतम ऊर्ध्वाधर ऊंचाई (मीटर में) ज्ञात कीजिए। (g = 10 m/s²)',
        a: '5',
        pos: 4,
        neg: 0,
        sol: 'Maximum height H = (u² · sin²θ) / (2g) = (20² × (0.5)²) / (2 × 10) = (400 × 0.25) / 20 = 100 / 20 = 5 meters.'
      },
      {
        id: 'q3',
        sec: 'Physics',
        qtype: 'MAQ',
        q: 'Which of the following physical quantities are dimensionless? (Select all that apply)',
        hi_q: 'निम्नलिखित में से कौन सी भौतिक राशियाँ विमाहीन (Dimensionless) हैं? (सभी सही विकल्प चुनें)',
        o: ['A) Strain (विकृति)', 'B) Refractive index (अपवर्तनांक)', 'C) Universal gravitational constant (G)', 'D) Relative density (आपेक्षिक घनत्व)'],
        hi_o: ['A) Strain (विकृति)', 'B) Refractive index (अपवर्तनांक)', 'C) सार्वत्रिक गुरुत्वाकर्षण नियतांक (G)', 'D) आपेक्षिक घनत्व'],
        a: ['0', '1', '3'],
        pos: 4,
        neg: 1,
        sol: 'Strain (ratio of lengths), Refractive Index (ratio of speeds of light), and Relative Density (ratio of densities) are all dimensionless ratios. Gravitational constant G has dimensions [M⁻¹ L³ T⁻²].'
      },
      {
        id: 'q4',
        sec: 'Chemistry',
        qtype: 'MCQ',
        q: 'Which quantum number determines the three-dimensional geometric spatial shape of an atomic orbital?',
        hi_q: 'कौन सी क्वांटम संख्या परमाणु कक्षक की त्रिविमीय ज्यामितीय आकृति निर्धारित करती है?',
        o: ['A) Principal quantum number (n)', 'B) Azimuthal / Orbital angular momentum quantum number (l)', 'C) Magnetic quantum number (m)', 'D) Electron spin quantum number (s)'],
        hi_o: ['A) मुख्य क्वांटम संख्या (n)', 'B) द्विगंशी क्वांटम संख्या (l)', 'C) चुंबकीय क्वांटम संख्या (m)', 'D) चक्रण क्वांटम संख्या (s)'],
        a: 1,
        pos: 4,
        neg: 1,
        sol: 'The azimuthal quantum number (l) governs orbital angular momentum and determines orbital shape (l=0 s-orbital spherical, l=1 p-orbital dumbbell, l=2 d-orbital double dumbbell).'
      },
      {
        id: 'q5',
        sec: 'Chemistry',
        qtype: 'TrueFalse',
        q: 'Water (H₂O) possesses an abnormally high boiling point compared to hydrogen sulfide (H₂S) due to strong intermolecular hydrogen bonding.',
        hi_q: 'मजबूत अंतर-आणविक हाइड्रोजन बंध के कारण पानी (H₂O) का क्वथनांक हाइड्रोजन सल्फाइड (H₂S) की तुलना में असामान्य रूप से अधिक होता है।',
        o: ['True (सत्य)', 'False (असत्य)'],
        hi_o: ['True (सत्य)', 'False (असत्य)'],
        a: 0,
        pos: 4,
        neg: 1,
        sol: 'True. High electronegativity difference between Oxygen and Hydrogen creates extensive intermolecular hydrogen bonding in H₂O, demanding significant thermal energy to vaporize.'
      },
      {
        id: 'q6',
        sec: 'Mathematics',
        qtype: 'MCQ',
        q: 'Evaluate the limit: lim (x → 0) [ sin(6x) / (2x) ]',
        hi_q: 'सीमा का मान ज्ञात कीजिए: lim (x → 0) [ sin(6x) / (2x) ]',
        o: ['A) 1', 'B) 2', 'C) 3', 'D) 0'],
        hi_o: ['A) 1', 'B) 2', 'C) 3', 'D) 0'],
        a: 2,
        pos: 4,
        neg: 1,
        sol: 'lim (x → 0) [sin(6x)/(6x)] × (6/2) = 1 × 3 = 3.'
      },
      {
        id: 'q7',
        sec: 'Mathematics',
        qtype: 'MTQ',
        q: 'Match the differential equations in Column I with their orders in Column II:\nRow A: d²y/dx² + 5y = 0\nRow B: (dy/dx)⁴ + sin(x) = y\nRow C: d³y/dx³ + 2(dy/dx) = 0',
        hi_q: 'कॉलम I में अवकल समीकरणों को कॉलम II में उनके क्रम (Order) से सुमेलित करें:\nRow A: d²y/dx² + 5y = 0\nRow B: (dy/dx)⁴ + sin(x) = y\nRow C: d³y/dx³ + 2(dy/dx) = 0',
        rows: ['A) d²y/dx² + 5y = 0', 'B) (dy/dx)⁴ + sin(x) = y', 'C) d³y/dx³ + 2(dy/dx) = 0'],
        cols: ['P) Order 1', 'Q) Order 2', 'R) Order 3'],
        a: { 0: 'Q', 1: 'P', 2: 'R' },
        pos: 4,
        neg: 1,
        sol: 'Row A has highest derivative d²y/dx² (Order 2 -> Q). Row B has highest derivative dy/dx (Order 1 -> P). Row C has highest derivative d³y/dx³ (Order 3 -> R).'
      },
      {
        id: 'q8',
        sec: 'Computer Science',
        qtype: 'CODING',
        q: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nWrite a function two_sum(nums, target) in Python.',
        hi_q: 'पूर्णांकों की एक सरणी nums और एक पूर्णांक target को देखते हुए, उन दो संख्याओं के सूचकांक लौटाएं जिनका योग target के बराबर हो।',
        initialCode: 'def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []',
        pos: 4,
        neg: 0,
        sol: 'We utilize a hash table mapping number to index. As we iterate through nums, we check if target - num exists in our table, yielding an optimal O(n) runtime complexity.'
      }
    ]
  },
  {
    id: 't2',
    name: 'Python Core & Algorithm Basics CBT Quiz',
    course: 'k3',
    min: 15,
    total_qs: 4,
    max_score: 16,
    marks_positive: 4,
    marks_negative: 1,
    is_calc_allow: false,
    lang: 'EN',
    sections: ['Python Core', 'Data Structures'],
    qs: [
      {
        id: 'q21',
        sec: 'Python Core',
        qtype: 'MCQ',
        q: 'Which keyword is used to define a function in Python?',
        hi_q: 'पायथन में फ़ंक्शन को परिभाषित करने के लिए किस कीवर्ड का उपयोग किया जाता है?',
        o: ['A) func', 'B) def', 'C) fn', 'D) function'],
        hi_o: ['A) func', 'B) def', 'C) fn', 'D) function'],
        a: 1,
        pos: 4,
        neg: 1,
        sol: 'In Python, the `def` keyword introduces a function definition.'
      },
      {
        id: 'q22',
        sec: 'Python Core',
        qtype: 'MCQ',
        q: 'What is the output of len("python") in Python 3?',
        hi_q: 'पायथन 3 में len("python") का आउटपुट क्या है?',
        o: ['A) 5', 'B) 6', 'C) 7', 'D) SyntaxError'],
        hi_o: ['A) 5', 'B) 6', 'C) 7', 'D) SyntaxError'],
        a: 1,
        pos: 4,
        neg: 1,
        sol: 'The string "python" contains 6 characters (p, y, t, h, o, n).'
      },
      {
        id: 'q23',
        sec: 'Data Structures',
        qtype: 'NAT',
        q: 'What is the worst-case time complexity of binary search on a sorted list of 1024 elements? Enter the maximum number of comparisons.',
        hi_q: '1024 तत्वों की एक क्रमबद्ध सूची पर बाइनरी सर्च के लिए तुलनाओं की अधिकतम संख्या क्या है?',
        a: '10',
        pos: 4,
        neg: 0,
        sol: 'Binary search requires at most log₂(1024) = 10 comparisons.'
      },
      {
        id: 'q24',
        sec: 'Data Structures',
        qtype: 'TrueFalse',
        q: 'A Python dictionary preserves key insertion order as of Python version 3.7+.',
        hi_q: 'पायथन 3.7+ के अनुसार पायथन डिक्शनरी कुंजी प्रविष्टि क्रम (key insertion order) को संरक्षित रखती है।',
        o: ['True (सत्य)', 'False (असत्य)'],
        hi_o: ['True (सत्य)', 'False (असत्य)'],
        a: 0,
        pos: 4,
        neg: 1,
        sol: 'True. In Python 3.7 and above, dictionaries are guaranteed to maintain insertion order.'
      }
    ]
  },
  {
    id: 't3',
    name: 'NEET Medical Excellence Biology & Anatomy Mock',
    course: 'k2',
    min: 20,
    total_qs: 4,
    max_score: 16,
    marks_positive: 4,
    marks_negative: 1,
    is_calc_allow: false,
    lang: 'EN',
    sections: ['Botany', 'Zoology'],
    qs: [
      {
        id: 'q31',
        sec: 'Botany',
        qtype: 'MCQ',
        q: 'Which cell organelle is known as the "Powerhouse of the Cell"?',
        hi_q: 'किस कोशिकांग को "कोशिका का पावरहाउस" कहा जाता है?',
        o: ['A) Ribosome', 'B) Mitochondria', 'C) Golgi Apparatus', 'D) Lysosome'],
        hi_o: ['A) राइबोसोम', 'B) माइटोकॉन्ड्रिया', 'C) गॉल्जी उपकरण', 'D) लाइसोसोम'],
        a: 1,
        pos: 4,
        neg: 1,
        sol: 'Mitochondria generate most of the chemical energy needed to power the biochemical reactions through ATP generation.'
      },
      {
        id: 'q32',
        sec: 'Zoology',
        qtype: 'MCQ',
        q: 'Which blood group is universally known as the universal donor in the ABO blood system?',
        hi_q: 'ABO रक्त समूह प्रणाली में किस रक्त समूह को सार्वभौमिक दाता (Universal Donor) कहा जाता है?',
        o: ['A) AB+', 'B) A+', 'C) O-', 'D) B+'],
        hi_o: ['A) AB+', 'B) A+', 'C) O-', 'D) B+'],
        a: 2,
        pos: 4,
        neg: 1,
        sol: 'O negative blood lacks A, B, and Rh surface antigens, allowing it to be safely transfused to patients of any blood type in emergencies.'
      },
      {
        id: 'q33',
        sec: 'Zoology',
        qtype: 'TrueFalse',
        q: 'The functional and structural filtration unit of the human kidney is the Nephron.',
        hi_q: 'मानव गुर्दे की कार्यात्मक और संरचनात्मक निस्यंदन इकाई नेफ्रॉन (Nephron) है।',
        o: ['True (सत्य)', 'False (असत्य)'],
        hi_o: ['True (सत्य)', 'False (असत्य)'],
        a: 0,
        pos: 4,
        neg: 1,
        sol: 'True. Each human kidney contains approximately 1 million nephrons which filter blood and produce urine.'
      },
      {
        id: 'q34',
        sec: 'Botany',
        qtype: 'NAT',
        q: 'How many molecules of ATP are net produced during aerobic respiration of one glucose molecule according to modern biochemistry standard?',
        hi_q: 'आधुनिक जैव रसायन मानक के अनुसार एक ग्लूकोज अणु के एरोबिक श्वसन के दौरान कितने ATP अणुओं का शुद्ध उत्पादन होता है?',
        a: '32',
        pos: 4,
        neg: 0,
        sol: 'Modern stoichiometry calculates approximately 30 to 32 ATP molecules produced per molecule of oxidized glucose.'
      }
    ]
  }
];

// Initialize Packages, Coupons, and Comprehensive CBT Tests into D
const DEFAULT_CBT_TESTS = [
  {
    id: 't1',
    testCode: 'TSTC507C62A',
    name: 'JEE Main',
    course: 'k1',
    courseLabel: 'JEE - 123',
    min: 180,
    total_qs: 75,
    max_score: 300,
    marks_positive: 4,
    marks_negative: 1,
    is_calc_allow: true,
    lang: 'EN + HI',
    openDate: 'NA',
    closeDate: 'NA',
    status: 'Active',
    publishResult: 'Yes',
    sections: ['Physics', 'Chemistry', 'Mathematics'],
    qs: CBT_TESTS_SEED[0].qs
  },
  {
    id: 't2',
    testCode: 'TST9B006BF5',
    name: 'Sample Test for AI Subjective',
    course: 'k2',
    courseLabel: 'Olympiad',
    min: 45,
    total_qs: 5,
    max_score: 20,
    marks_positive: 4,
    marks_negative: 0,
    is_calc_allow: false,
    lang: 'EN',
    openDate: 'NA',
    closeDate: 'NA',
    status: 'Active',
    publishResult: 'Yes',
    sections: ['Artificial Intelligence', 'Subjective Logic'],
    qs: CBT_TESTS_SEED[1] ? CBT_TESTS_SEED[1].qs : CBT_TESTS_SEED[0].qs.slice(0, 5)
  },
  {
    id: 't3',
    testCode: 'TSTB102C1DF',
    name: 'Subject time line testing',
    course: 'k2',
    courseLabel: 'Olympiad',
    min: 60,
    total_qs: 10,
    max_score: 40,
    marks_positive: 4,
    marks_negative: 1,
    is_calc_allow: false,
    lang: 'EN',
    openDate: 'NA',
    closeDate: 'NA',
    status: 'Active',
    publishResult: 'Yes',
    sections: ['Physics', 'Mathematics'],
    qs: CBT_TESTS_SEED[0].qs
  },
  {
    id: 't4',
    testCode: 'TST32044DE1',
    name: 'DEMO PROCTOR',
    course: 'k2',
    courseLabel: 'Olympiad',
    min: 30,
    total_qs: 8,
    max_score: 32,
    marks_positive: 4,
    marks_negative: 1,
    is_calc_allow: true,
    lang: 'EN',
    openDate: 'NA',
    closeDate: 'NA',
    status: 'Active',
    publishResult: 'Yes',
    sections: ['Proctored Evaluation', 'General Science'],
    qs: CBT_TESTS_SEED[0].qs
  },
  {
    id: 't5',
    testCode: 'TST7300F6CD',
    name: 'Question Bank testing',
    course: 'k3',
    courseLabel: 'IIDE',
    min: 50,
    total_qs: 15,
    max_score: 60,
    marks_positive: 4,
    marks_negative: 1,
    is_calc_allow: true,
    lang: 'EN',
    openDate: 'NA',
    closeDate: 'NA',
    status: 'Active',
    publishResult: 'Yes',
    sections: ['Full Stack Web', 'Python Core'],
    qs: CBT_TESTS_SEED[1] ? CBT_TESTS_SEED[1].qs : CBT_TESTS_SEED[0].qs
  },
  {
    id: 't6',
    testCode: 'TST7604CE94',
    name: 'DEMO !@# (Copy)',
    course: 'k2',
    courseLabel: 'Olympiad',
    min: 40,
    total_qs: 8,
    max_score: 32,
    marks_positive: 4,
    marks_negative: 1,
    is_calc_allow: false,
    lang: 'EN',
    openDate: 'NA',
    closeDate: 'NA',
    status: 'Active',
    publishResult: 'Yes',
    sections: ['Speed Drill', 'Aptitude'],
    qs: CBT_TESTS_SEED[0].qs
  },
  {
    id: 't7',
    testCode: 'TSTBD04E4F1',
    name: 'my test 2',
    course: 'k2',
    courseLabel: 'Olympiad',
    min: 90,
    total_qs: 44,
    max_score: 176,
    marks_positive: 4,
    marks_negative: 1,
    is_calc_allow: true,
    lang: 'EN + HI',
    openDate: 'NA',
    closeDate: 'NA',
    status: 'Active',
    publishResult: 'Yes',
    sections: ['Physics', 'Chemistry', 'Mathematics'],
    qs: CBT_TESTS_SEED[0].qs
  }
];

function getTestCode(t) {
  if (t && t.testCode) return t.testCode;
  const map = {
    t1: 'TSTC507C62A',
    t2: 'TST9B006BF5',
    t3: 'TSTB102C1DF',
    t4: 'TST32044DE1',
    t5: 'TST7300F6CD',
    t6: 'TST7604CE94',
    t7: 'TSTBD04E4F1'
  };
  if (t && map[t.id]) return map[t.id];
  let hash = 0;
  const s = String((t && (t.id || t.name)) || 'test');
  for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash) + s.charCodeAt(i);
  return 'TST' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0').slice(0, 8);
}

function getTestCourseLabel(t) {
  if (t && t.courseLabel) return t.courseLabel;
  if (!t) return 'Olympiad';
  const c = (D.courses || []).find(x => x.id === t.course);
  if (c) {
    if (c.id === 'k1') return 'JEE - 123';
    if (c.id === 'k2') return 'Olympiad';
    if (c.id === 'k3') return 'IIDE';
    return c.code || c.name;
  }
  return t.course || 'Olympiad';
}

window.getTestCode = getTestCode;
window.getTestCourseLabel = getTestCourseLabel;

window.toggleSelectAllTests = function (master) {
  const chks = document.querySelectorAll('.test-row-chk');
  chks.forEach(c => { c.checked = master.checked; });
};

window.renderTestsTable = function (testsList, options = {}) {
  const r = me().role;
  const isStudent = r === 'student';
  const pp = options.pageSize || 10;
  const pageKey = options.pageKey || (options.course ? 'cTestPg_' + options.course.id : 'testPg');
  S[pageKey] = S[pageKey] || 0;

  const q = (S.testQ || '').toLowerCase().trim();
  let filtered = (testsList || []).filter(t => {
    if (!q) return true;
    const code = getTestCode(t).toLowerCase();
    const name = (t.name || '').toLowerCase();
    const course = getTestCourseLabel(t).toLowerCase();
    return code.includes(q) || name.includes(q) || course.includes(q);
  });

  const total = filtered.length;
  const maxPg = Math.max(0, Math.ceil(total / pp) - 1);
  S[pageKey] = Math.min(S[pageKey], maxPg);
  const paged = filtered.slice(S[pageKey] * pp, S[pageKey] * pp + pp);

  return `
    <div class="test-table-container">
      ${options.showSearch !== false ? `
        <div class="bar" style="margin-bottom:12px;justify-content:space-between;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:10px">
            <input class="in" style="max-width:320px" placeholder="Search tests by ID, name, course..." value="${E(S.testQ || '')}" oninput="S.testQ=this.value;S['${pageKey}']=0;${options.onSearch || 'rp()'}">
            ${S.testQ ? `<button class="b2" onclick="S.testQ='';${options.onSearch || 'rp()'}">Clear</button>` : ''}
            <span class="mt">${total} test${total === 1 ? '' : 's'}</span>
          </div>
          ${options.headerActions || ''}
        </div>
      ` : ''}

      <div class="tw test-table-wrap">
        <table class="test-grid-table">
          <thead>
            <tr>
              <th style="width:36px;text-align:center"><input type="checkbox" class="test-select-all" title="Select All Tests" onchange="toggleSelectAllTests(this)"></th>
              <th style="width:40px;text-align:center">#</th>
              <th style="width:130px">Test ID</th>
              <th style="min-width:200px">Test Name</th>
              <th style="min-width:130px">Course</th>
              <th style="width:105px">Open Date</th>
              <th style="width:105px">Close Date</th>
              <th style="width:90px;text-align:center">Status</th>
              <th style="width:115px;text-align:center">Publish Result</th>
              <th style="width:135px;text-align:center">More</th>
            </tr>
          </thead>
          <tbody>
            ${paged.map((t, idx) => {
              const rowNum = S[pageKey] * pp + idx + 1;
              const testCode = getTestCode(t);
              const courseLabel = getTestCourseLabel(t);
              const qCount = (t.qs || []).length || t.total_qs || 15;
              const res = D.res.find(y => y.tid === t.id && y.sid === S.uid);

              return `
                <tr>
                  <td style="text-align:center"><input type="checkbox" class="test-row-chk" value="${t.id}"></td>
                  <td style="text-align:center;font-weight:700;color:var(--ink)">${rowNum}</td>
                  <td><span class="test-id-pill">${E(testCode)}</span></td>
                  <td>
                    <b class="test-row-name">${E(t.name)}</b>
                    <small class="test-row-qcount">${qCount} Questions</small>
                  </td>
                  <td><span class="test-row-course">${E(courseLabel)}</span></td>
                  <td><span class="test-row-date">${t.openDate || 'NA'}</span></td>
                  <td><span class="test-row-date">${t.closeDate || 'NA'}</span></td>
                  <td style="text-align:center"><span class="test-pill-active">${t.status || 'Active'}</span></td>
                  <td style="text-align:center"><span class="test-pill-publish">${t.publishResult || 'Yes'}</span></td>
                  <td style="text-align:center">
                    <div class="test-more-actions">
                      <button type="button" class="btn-test-action" onclick="openTestActionsMenu(event, '${t.id}')">
                        ▾ Action
                      </button>
                      <button type="button" class="btn-test-send" title="${isStudent ? (res ? 'Retake Test' : 'Start Test') : 'Preview CBT'}" onclick="startOnlineTest('${t.id}')">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('') || `<tr><td colspan="10" class="em" style="padding:32px 14px">No tests found matching criteria.</td></tr>`}
          </tbody>
        </table>
      </div>

      ${total > pp ? `
        <div class="bar pgn" style="margin-top:12px">
          <span class="mt">Showing ${S[pageKey] * pp + 1}–${Math.min(total, S[pageKey] * pp + pp)} of ${total}</span>
          <span class="pgb">
            <button class="b2" ${S[pageKey] ? '' : 'disabled'} onclick="S['${pageKey}']--;${options.onPage || 'rp()'}">‹ Prev</button>
            ${Array.from({ length: maxPg + 1 }, (_, j) => `
              <button class="b2 ${j === S[pageKey] ? 'on' : ''}" onclick="S['${pageKey}']=${j};${options.onPage || 'rp()'}">${j + 1}</button>
            `).join('')}
            <button class="b2" ${S[pageKey] < maxPg ? '' : 'disabled'} onclick="S['${pageKey}']++;${options.onPage || 'rp()'}">Next ›</button>
          </span>
        </div>
      ` : ''}
    </div>
  `;
};

if (D) {
  if (!D.packages || !D.packages.length) {
    D.packages = DEFAULT_PACKAGES;
  }
  if (!D.coupons || !D.coupons.length) {
    D.coupons = DEFAULT_COUPONS;
  }
  if (!D.myPackages) {
    D.myPackages = { s1: ['pkg1', 'pkg3'] };
  }
  // Replace basic seed tests with comprehensive CBT tests
  if (!D.tests || D.tests.length < 7 || !D.tests.some(t => t.testCode === 'TSTC507C62A')) {
    D.tests = DEFAULT_CBT_TESTS;
  }
  // Sample test result for s1 to demonstrate Instant Solution Review & Analysis
  if (!D.res || !D.res.length) {
    D.res = [
      {
        id: 'res_sample_1',
        sid: 's1',
        tid: 't1',
        score: 28,
        maxScore: 32,
        timeTaken: '14m 20s',
        timeTakenSec: 860,
        date: '12 Nov 2026, 11:30 AM',
        rank: 2,
        totalCandidates: 48,
        percentile: 96.5,
        accuracy: 87.5,
        answers: {
          q1: 1, // Correct
          q2: '5', // Correct
          q3: ['0', '1', '3'], // Correct
          q4: 1, // Correct
          q5: 0, // Correct
          q6: 1, // Incorrect (Picked B, Ans is C)
          q7: { 0: 'Q', 1: 'P', 2: 'R' }, // Correct
          q8: 'CODED' // Correct
        },
        timePerQuestion: { q1: 65, q2: 95, q3: 120, q4: 45, q5: 35, q6: 80, q7: 110, q8: 310 },
        sectionScores: {
          Physics: { correct: 3, total: 3, score: 12 },
          Chemistry: { correct: 2, total: 2, score: 8 },
          Mathematics: { correct: 1, total: 2, score: 3 },
          'Computer Science': { correct: 1, total: 1, score: 4 }
        }
      }
    ];
  }
}
const save = () => {
  try {
    localStorage.setItem(K, JSON.stringify(D));
  } catch (e) {}
};

let S = { uid: null, c: 'all', p: 'dash', q: '', pg: 0, chartPeriod: 'monthly' },
  M = null,
  CF = null,
  W,
  T,
  TI,
  LR = 'owner';

const LOGO = '../onlinetestpanel-web/assets/img/logo.png',
  LIMG = `<img src="${LOGO}" alt="trigrexam" onerror="this.outerHTML='<b class=lgt>trigrexam</b>'">`;

const AVS = {
  u1: 'photo-1573496359142-b8d87734a5a2',
  u2: 'photo-1506794778202-cad84cf45f1d',
  u3: 'photo-1580489944761-15a19d654956',
  s1: 'photo-1539571696357-5a69c17a67c6',
  u4: 'photo-1500648767791-00dcc994a43e',
  u5: 'photo-1544005313-94ddf0286df2',
  s2: 'photo-1534528741775-53994a69daeb',
  s3: 'photo-1507003211169-0a1dd7228f2d'
};

const STU_AVATARS = [
  'photo-1539571696357-5a69c17a67c6',
  'photo-1534528741775-53994a69daeb',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1517841905240-472988babdf9',
  'photo-1524504388940-b1c1722653e1',
  'photo-1501196354995-cbb51c65aaea',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1522075469751-3a6694fb2f61',
  'photo-1519085360753-af0119f7cbe7',
  'photo-1531746020798-e6953c6e8e04',
  'photo-1529626455594-4ff0802cfb7e',
  'photo-1494790108377-be9c29b29330',
  'photo-1500648767791-00dcc994a43e',
  'photo-1544005313-94ddf0286df2',
  'photo-1492562080023-ab3db95bfbce',
  'photo-1508214751196-bcfd4ca60f91',
  'photo-1488426862026-3ee34a7d66df',
  'photo-1548142813-c348350df52b',
  'photo-1535713875002-d1d0cf377fde',
  'photo-1570295999919-56ceb5ecca61',
  'photo-1580489944761-15a19d654956',
  'photo-1560250097-0b93528c311a',
  'photo-1573496359142-b8d87734a5a2',
  'photo-1533227268428-f9ed0900fb3b',
  'photo-1543610892-0b1f7e6d8ac1',
  'photo-1567532939604-b6b5b0db2604',
  'photo-1531123897727-8f129e1688ce',
  'photo-1528892952291-009c663ce843',
  'photo-1506863530036-1efeddceb993'
];

const av = u => {
  if (!u) return 'https://images.unsplash.com/' + STU_AVATARS[0] + '?w=120&h=120&fit=crop&crop=faces&auto=format';
  if (u.img) return u.img;
  if (AVS[u.id]) return `https://images.unsplash.com/${AVS[u.id]}?w=120&h=120&fit=crop&crop=faces&auto=format`;
  const str = String(u.id || u.name || 'student');
  const hash = [...str].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return `https://images.unsplash.com/${STU_AVATARS[hash % STU_AVATARS.length]}?w=120&h=120&fit=crop&crop=faces&auto=format`;
};

const sRegDate = s => {
  if (!s) return '12 Jan 2026';
  if (s.regDate) return s.regDate;
  const hash = [...String(s.id || s.email || 's')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const m = ['14 Nov 2025', '02 Dec 2025', '19 Dec 2025', '08 Jan 2026', '21 Jan 2026', '04 Feb 2026', '10 Feb 2026'][hash % 7];
  s.regDate = m;
  return s.regDate;
};

const RL = { owner: 'Institute Owner', admin: 'Administrator', instructor: 'Instructor', student: 'Student' };
const uRoles = u => (u && Array.isArray(u.roles) && u.roles.length) ? u.roles : (u && u.role ? [u.role] : ['instructor']);
const hasRole = (u, r) => uRoles(u).includes(r) || (u && u.role === r);

/* Mode helpers: Online only, Offline only, Both */
const OM = () => D.opMode || 'Both',
  hasC = () => OM() !== 'Online',
  hasO = () => OM() !== 'Offline',
  OML = { Online: 'Online only', Offline: 'Offline only', Both: 'Online + Offline' };

const som = m => {
  if (OM() === m) return;
  cfm(
    m === 'Online'
      ? 'Switch to <b>Online only</b>? Centers will be completely hidden everywhere across dashboards, forms, and imports.'
      : m === 'Offline'
      ? 'Switch to <b>Offline only</b>? Online learning options will be hidden and students/courses will belong to centers.'
      : 'Switch to <b>Online + Offline</b>? Both centers and online learning will be enabled.',
    () => {
      D.opMode = m;
      if (m === 'Online') S.c = 'all';
      save();
      render();
      toast('Institute mode: ' + OML[m]);
    }
  );
};

const IC = {
  sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  moon: '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>',
  shopping: '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>',
  messages: '<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/>',
  buyers: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"/><path d="M16 11l2 2 4-4"/>',
  token: '<circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/>',
  coupon: '<rect x="3" y="6" width="18" height="12" rx="2"/><line x1="8" y1="6" x2="8" y2="18" stroke-dasharray="2 2"/><circle cx="15" cy="12" r="2"/>',
  packages: '<path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  dash: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  centers: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/>',
  admins: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
  instrs: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  students: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  courses: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>',
  batches: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M15 15c3 0 6 1.5 6 4.5"/>',
  fin: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  invites: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/><path d="M19 13v6M16 16h6"/>',
  set: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  tests: '<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/>',
  testseries: '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>',
  bell: '<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>',
  team: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  swap: '<path d="M17 3l4 4-4 4M21 7H8M7 21l-4-4 4-4M3 17h13"/>',
  up: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  down: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
  file: '<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/>',
  video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',
  book: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>',
  horn: '<path d="M18 8a3 3 0 00-3-3H5a2 2 0 00-2 2v4a2 2 0 002 2h2v4a1 1 0 001 1h2a1 1 0 001-1v-4h4a3 3 0 003-3z"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  cloud: '<path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>',
  lightbulb: '<line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>',
  printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  dots: '<circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  delete: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  social_studio: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>'
};
const ico = (k, sz = 15) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:${sz}px;height:${sz}px;flex-shrink:0;vertical-align:middle;display:inline-block">${IC[k] || IC.dash}</svg>`;

/* 3-Dots Table Actions Component */
const tblDots = (type, id) => `
  <button class="tbl-dots-btn" type="button" title="Actions" onclick="event.stopPropagation(); showTableRowMenu(event, '${type}', '${id}')">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <circle cx="12" cy="5" r="2.2"/>
      <circle cx="12" cy="12" r="2.2"/>
      <circle cx="12" cy="19" r="2.2"/>
    </svg>
  </button>
`;

function showTableRowMenu(e, type, id) {
  if (e) e.stopPropagation();
  const existing = document.getElementById('tblRowMenu');
  if (existing) existing.remove();

  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();

  const menu = document.createElement('div');
  menu.id = 'tblRowMenu';
  menu.className = 'tbl-row-dropdown-menu';

  const items = getTableRowActions(type, id);
  if (!items || !items.length) return;

  menu.innerHTML = `
    <div class="tbl-menu-list">
      ${items.map((it, idx) => `
        <button type="button" class="tbl-menu-item ${it.danger ? 'danger' : ''}" data-idx="${idx}">
          <span class="tbl-menu-ico">${ico(it.icon || 'dash')}</span>
          <span class="tbl-menu-lbl">${E(it.label)}</span>
        </button>
      `).join('')}
    </div>
  `;

  document.body.appendChild(menu);

  const menuW = 210;
  let top = rect.bottom + window.scrollY + 4;
  let left = rect.right + window.scrollX - menuW;
  if (left < 10) left = 10;
  if (top + 240 > window.innerHeight + window.scrollY) {
    top = Math.max(10, rect.top + window.scrollY - menu.offsetHeight - 4);
  }

  menu.style.position = 'absolute';
  menu.style.top = top + 'px';
  menu.style.left = left + 'px';
  menu.style.zIndex = '999999';

  menu.querySelectorAll('.tbl-menu-item').forEach(el => {
    el.onclick = ev => {
      ev.stopPropagation();
      const idx = +el.dataset.idx;
      menu.remove();
      if (items[idx] && items[idx].action) {
        items[idx].action();
      }
    };
  });
}

function getTableRowActions(type, id) {
  if (type === 'team') {
    const u = U(id);
    if (!u) return [];
    return [
      { label: 'Assign Roles & Subject', icon: 'set', action: () => openRoleAssignmentModal(id) },
      ...(hasC() ? [{ label: 'Assign Centers', icon: 'centers', action: () => ea(id) }] : []),
      { label: 'Send Direct Message', icon: 'messages', action: () => openComposeMessageModal(id) },
      { label: u.status === 'Active' ? 'Suspend Member' : 'Activate Member', icon: 'swap', action: () => tg('users', id) },
      { label: 'Remove Member', icon: 'delete', danger: true, action: () => deleteTeamMember(id) }
    ];
  }
  if (type === 'instructor') {
    const t = U(id);
    if (!t) return [];
    return [
      { label: 'Roles & Subject', icon: 'set', action: () => openRoleAssignmentModal(id) },
      ...(hasC() ? [{ label: 'Assign Centers', icon: 'centers', action: () => ea(id) }] : []),
      { label: 'Send Direct Message', icon: 'messages', action: () => openComposeMessageModal(id) },
      { label: t.status === 'Active' ? 'Suspend Instructor' : 'Activate Instructor', icon: 'swap', action: () => tg('users', id) },
      { label: 'Delete Instructor', icon: 'delete', danger: true, action: () => deleteTeamMember(id) }
    ];
  }
  if (type === 'student') {
    const s = U(id);
    if (!s) return [];
    return [
      { label: 'Edit Student Details', icon: 'edit', action: () => es(id) },
      { label: 'Enrolled Courses', icon: 'courses', action: () => cpop(id) },
      { label: 'Send Direct Message', icon: 'messages', action: () => openComposeMessageModal(id) },
      { label: s.status === 'Active' ? 'Suspend Student' : 'Activate Student', icon: 'swap', action: () => tg('users', id) },
      { label: 'Delete Student', icon: 'delete', danger: true, action: () => deleteStudent(id) }
    ];
  }
  if (type === 'package') {
    const p = (D.packages || []).find(x => x.id === id);
    if (!p) return [];
    return [
      { label: 'Open in New Tab (Deep Data) ↗', icon: 'dash', action: () => (typeof openPackageInNewTab === 'function' ? openPackageInNewTab(id) : window.open('basic.html?p=package_view&pkg=' + id, '_blank')) },
      { label: 'View Package Details', icon: 'dash', action: () => (typeof openPackageInNewTab === 'function' ? openPackageInNewTab(id) : viewPackageDetail(id)) },
      { label: 'Assign Students (Select / CSV)', icon: 'students', action: () => openAssignStudentsModal(id) },
      { label: 'Edit in Package Studio', icon: 'edit', action: () => (typeof editPackageInCreator === 'function' ? editPackageInCreator(id) : openPackageWizard(id)) },
      { label: p.status === 'Draft' ? 'Publish Package' : 'Unpublish Package', icon: 'swap', action: () => togglePackageStatus(id) },
      { label: 'Delete Package', icon: 'delete', danger: true, action: () => deletePackage(id) }
    ];
  }
  if (type === 'center') {
    const c = (D.centers || []).find(x => x.id === id);
    if (!c) return [];
    return [
      { label: 'Edit Center', icon: 'edit', action: () => ec(id) },
      { label: c.status === 'Active' ? 'Deactivate Center' : 'Activate Center', icon: 'swap', action: () => tg('centers', id) }
    ];
  }
  if (type === 'batch') {
    const b = (D.batches || []).find(x => x.id === id);
    if (!b) return [];
    return [
      { label: 'Open Batch Details', icon: 'dash', action: () => ob(id) },
      ...(can() ? [
        { label: 'Edit Batch', icon: 'edit', action: () => eb(id) },
        { label: 'Delete Batch', icon: 'delete', danger: true, action: () => deleteBatch(id) }
      ] : [])
    ];
  }
  if (type === 'coupon') {
    const c = (D.coupons || []).find(x => x.id === id);
    if (!c) return [];
    return [
      { label: c.status === 'Active' ? 'Disable Coupon' : 'Enable Coupon', icon: 'swap', action: () => toggleCouponStatus(id) },
      { label: 'Delete Coupon', icon: 'delete', danger: true, action: () => deleteCouponItem(id) }
    ];
  }
  if (type === 'token') {
    const tok = (D.tokens || []).find(x => x.id === id);
    if (!tok) return [];
    return [
      { label: 'Copy Token Code', icon: 'file', action: () => { navigator.clipboard && navigator.clipboard.writeText(tok.code); toast('Token code copied: ' + tok.code); } },
      { label: tok.status === 'Active' ? 'Disable Token' : 'Enable Token', icon: 'swap', action: () => toggleTokenStatus(id) },
      { label: 'Delete Token', icon: 'delete', danger: true, action: () => deleteTokenItem(tok.id) }
    ];
  }
  if (type === 'buyer') {
    return [
      { label: 'View Order Receipt', icon: 'file', action: () => viewBuyerReceipt(id) },
      { label: 'Message Learner', icon: 'messages', action: () => {
        const b = (D.buyers || []).find(x => x.id === id);
        if (b) openComposeMessageModal(b.studentId || null);
      } }
    ];
  }
  if (type === 'invite') {
    const inv = (D.invites || []).find(x => x.id === id);
    if (!inv) return [];
    return [
      { label: 'Simulate Accept', icon: 'swap', action: () => ia(id) },
      { label: 'Resend Invitation', icon: 'invites', action: () => ir(id) },
      { label: 'Revoke Invitation', icon: 'delete', danger: true, action: () => iw(id) }
    ];
  }
  if (type === 'fin') {
    const inv = (D.inv || []).find(x => x.id === id);
    if (!inv) return [];
    const r = me().role;
    if (r === 'student') {
      return [
        { label: 'Pay Now (Demo)', icon: 'fin', action: () => pm(id) }
      ];
    }
    return [
      { label: 'Record Payment', icon: 'fin', action: () => pm(id) },
      { label: 'Send Payment Reminder', icon: 'bell', action: () => rm(id) }
    ];
  }
  if (type === 'test') {
    const t = (D.tests || []).find(x => x.id === id);
    if (!t) return [];
    const r = me().role;
    if (r === 'student') {
      return [
        { label: 'Take CBT Test', icon: 'tests', action: () => startOnlineTest(id) },
        { label: 'View Solutions & Analytics', icon: 'file', action: () => viewResultAnalysisModal(id) }
      ];
    }
    return [
      { label: 'Preview CBT Exam', icon: 'tests', action: () => startOnlineTest(id) },
      { label: 'All 27 Test Actions ▾', icon: 'set', action: (ev) => openTestActionsMenu(null, id) },
      { label: 'Edit Test Metadata', icon: 'edit', action: () => editTestDetailsModal(t) },
      { label: 'View Result Reports', icon: 'file', action: () => viewTestReportModal(t) },
      { label: 'Delete Test', icon: 'delete', danger: true, action: () => deleteTestExam(t) }
    ];
  }
  if (type === 'message') {
    const m = (D.messages || []).find(x => x.id === id);
    if (!m) return [];
    return [
      { label: 'View Message', icon: 'messages', action: () => openViewMessageModal(id) },
      { label: 'Reply to Student', icon: 'file', action: () => openComposeMessageModal(m.toStudentId) },
      { label: 'Delete Message', icon: 'delete', danger: true, action: () => {
        D.messages = (D.messages || []).filter(x => x.id !== id);
        save();
        rp();
        toast('Message deleted');
      }}
    ];
  }
  return [];
}

document.addEventListener('click', e => {
  const m = document.getElementById('tblRowMenu');
  if (m && !m.contains(e.target)) {
    m.remove();
  }
});

function deleteTeamMember(uid) {
  const u = U(uid);
  if (!u) return;
  if (['u1', 'u2', 'u3', 's1'].includes(uid)) {
    return toast('Default demo account cannot be deleted');
  }
  cfm(`Permanently remove <b>${E(u.name)}</b> from the team directory?`, () => {
    D.users = D.users.filter(x => x.id !== uid);
    save();
    render();
    toast(`Member ${u.name} removed`);
  });
}

function deleteStudent(sid) {
  const s = U(sid);
  if (!s) return;
  if (sid === 's1') {
    return toast('Default demo student account cannot be deleted');
  }
  cfm(`Permanently delete student <b>${E(s.name)}</b>? Their enrollment records will be removed.`, () => {
    D.users = D.users.filter(x => x.id !== sid);
    save();
    render();
    toast(`Student ${s.name} deleted`);
  });
}

function deleteBatch(bid) {
  const b = D.batches.find(x => x.id === bid);
  if (!b) return;
  cfm(`Delete batch <b>${E(b.name)}</b>?`, () => {
    D.batches = D.batches.filter(x => x.id !== bid);
    save();
    render();
    toast(`Batch ${b.name} deleted`);
  });
}

const U = i => D.users.find(u => u.id === i),
  me = () => U(S.uid),
  cn = i => (hasC() ? (D.centers.find(c => c.id === i) || {}).name || '—' : ''),
  cl = a => (hasC() ? a.map(cn).filter(Boolean).join(', ') || '—' : '');

const cs = () => {
  if (!hasC()) return [];
  const u = me(),
    a = u.role === 'owner' ? D.centers.map(c => c.id) : u.centers;
  return S.c === 'all' ? a : [S.c];
};

const teaches = (c, u) => c.instr === u || (c.subs || []).some(s => s.teacher === u) || (c.st || []).some(r => r.t === u);
const inScope = i => !hasC() || (i.center ? cs().includes(i.center) : S.c === 'all');
const stu = () => {
  let a = D.users.filter(u => u.role === 'student' && (!hasC() || u.mode === 'Online' ? S.c === 'all' : u.centers.some(x => cs().includes(x))));
  if (me().role === 'instructor') {
    const m = D.courses.filter(c => teaches(c, S.uid)).map(c => c.id);
    a = a.filter(s => s.courses.some(x => m.includes(x)));
  }
  return a;
};

const crs = () => {
  let a = me().role === 'student' ? D.courses.slice() : D.courses.filter(c => !hasC() || c.mode === 'Online' || c.centers.some(x => cs().includes(x)));
  if (me().role === 'instructor') a = a.filter(c => teaches(c, S.uid));
  if (me().role === 'student') a = a.filter(c => me().courses.includes(c.id));
  return a;
};

const pct = (s, c) => Math.round(((D.prog[s + '|' + c.id] || []).length / c.lessons.length) * 100),
  st = s => `<span class="st ${/Inact|Revok|Susp|Overdue|Expired/.test(s) ? 'bad' : /Pend|Part|Draft|Unpaid/.test(s) ? 'wn' : 'gn'}">${s}</span>`;

const note = (to, t) => {
    D.notes.unshift({ id: id('n'), to, t, read: false });
  },
  mine = () => D.notes.filter(n => n.to === S.uid || n.to === me().role);

const toast = t => {
  const e = $('#t');
  e.textContent = t;
  e.hidden = false;
  clearTimeout(e._h);
  e._h = setTimeout(() => (e.hidden = true), 2600);
};

const hd = (t, d, b = '') => `<div class=hd><div><h1>${t}</h1><p>${d}</p></div><div>${b}</div></div>`;

const F = (k, l, t = 'text', o = [], v = '') =>
  t === 'select'
    ? `<label>${l}<select name=${k}>${o.map(x => { x = Array.isArray(x) ? x : [x, x]; return `<option value="${E(x[0])}" ${x[0] == v ? 'selected' : ''}>${E(x[1])}</option>`; }).join('')}</select></label>`
    : t === 'multi'
    ? `<fieldset><legend>${l}</legend>${o.length ? o.map(x => `<label class=ck><input type=checkbox name=${k} value="${x[0]}" ${[].concat(v || []).includes(x[0]) ? 'checked' : ''}>${E(x[1])}</label>`).join('') : '<small>No options available</small>'}</fieldset>`
    : t === 'area'
    ? `<label>${l}<textarea name=${k} rows=6>${E(v)}</textarea></label>`
    : `<label>${l}<input name=${k} type=${t} value="${E(v)}"></label>`;

const V = () => {
  const o = {};
  document.querySelectorAll('.mb [name]').forEach(e => {
    if (e.type === 'checkbox') {
      o[e.name] = o[e.name] || [];
      if (e.checked) o[e.name].push(e.value);
    } else o[e.name] = e.value.trim();
  });
  return o;
};

function modal(t, b, f, ok, lbl, foot) {
  closeM(1);
  $('#m').innerHTML = `<div class=bd onclick="event.target===this&&closeM()"><div class=md role=dialog><div class=mh><b>${t}</b><button class=x aria-label=Close onclick=closeM()>×</button></div><div class=mb>${b}<p id=er class=er></p></div><div class=mf>${foot || `<button class=b2 onclick=closeM()>Cancel</button><button class=b1 onclick=sub()>${lbl || 'Save'}</button>`}</div></div></div>`;
  M = { f, ok, dirty: false };
  $('.mb').oninput = () => M && (M.dirty = true);
}
function closeM(f) {
  if (!f && M && M.dirty) return cfm('Discard unsaved changes?', () => closeM(1));
  clearInterval(TI);
  $('#m').innerHTML = '';
  M = null;
}
function sub() {
  const e = M.f(V());
  if (e) {
    $('#er').textContent = e;
    return;
  }
  const o = M.ok;
  save();
  closeM(1);
  toast(o);
  render();
}
function cfm(msg, fn) {
  CF = fn;
  $('#c').innerHTML = `<div class=bd><div class=md style="max-width:360px"><div class=mb><p>${msg}</p></div><div class=mf><button class=b2 onclick=cfx()>Cancel</button><button class=b1 onclick=cfx(1)>Confirm</button></div></div></div>`;
}
function cfx(y) {
  $('#c').innerHTML = '';
  if (y && CF) CF();
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if ($('#c').innerHTML) cfx();
    else if (M) closeM();
  }
});

function tb(cols, rows, act, pp = 8) {
  const q = S.q.toLowerCase();
  let c = rows.map(r => [r, cols.map(x => x[1](r))]).filter(([r, v]) => !q || v.join(' ').replace(/<[^>]+>/g, ' ').toLowerCase().includes(q));
  const n = c.length,
    mx = Math.max(0, Math.ceil(n / pp) - 1);
  S.pg = Math.min(S.pg, mx);
  c = c.slice(S.pg * pp, S.pg * pp + pp);
  return (
    `<div class=bar><input class=in placeholder="Search…" aria-label=Search value="${E(S.q)}" oninput="S.q=this.value;S.pg=0;rp()">${S.q ? `<button class=b2 onclick="S.q='';rp()">Clear</button>` : ''}<span class=mt>${n} record${n == 1 ? '' : 's'}</span></div>` +
    (n
      ? `<div class=tw><table><thead><tr>${cols.map(x => `<th>${x[0]}</th>`).join('')}${act ? '<th></th>' : ''}</tr></thead><tbody>${c.map(([r, v]) => `<tr>${v.map(x => `<td>${x}</td>`).join('')}${act ? `<td class=ac>${act(r)}</td>` : ''}</tr>`).join('')}</tbody></table></div><div class="bar pgn"><span class=mt>Showing ${S.pg * pp + 1}–${Math.min(n, S.pg * pp + pp)} of ${n}</span><span class=pgb><button class=b2 ${S.pg ? '' : 'disabled'} onclick="S.pg--;rp()">‹ Prev</button>${Array.from({ length: mx + 1 }, (_, j) => `<button class="b2 ${j === S.pg ? 'on' : ''}" onclick="S.pg=${j};rp()">${j + 1}</button>`).join('')}<button class=b2 ${S.pg < mx ? '' : 'disabled'} onclick="S.pg++;rp()">Next ›</button></span></div>`
      : `<div class=em>${S.q ? 'No results for your search.' : 'Nothing here yet.'}</div>`)
  );
}

const mini = (h, rows) => `<div class=tw><table><thead><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const up = (coll, i, o, def) => {
  if (i) Object.assign(D[coll].find(x => x.id === i), o);
  else D[coll].push({ id: id(coll[0]), ...def, ...o });
};
const tg = (coll, i) =>
  cfm('Change status? History is preserved.', () => {
    const x = D[coll].find(y => y.id === i);
    x.status = x.status === 'Active' ? 'Inactive' : 'Active';
    save();
    render();
    toast('Status updated');
  });

/* Navigation structure: Categorized sidebar sections for Academic, People, Operations, Finance */
const NV = {
  owner: [
    ['dash', 'Dashboard'],
    ['__section', 'ACADEMIC MANAGEMENT'],
    ['courses', 'Courses'],
    ['packages', 'Packages'],
    ['tests', 'Tests'],
    ['testseries', 'Test Series'],
    ['__divider'],
    ['__section', 'PEOPLE MANAGEMENT'],
    ['students', 'Students'],
    ['instrs', 'Instructors'],
    ['team', 'Manage Team'],
    ['invites', 'Invitations'],
    ['__divider'],
    ['__section', 'OPERATIONS'],
    ['shopping', 'Shopping', [
      ['shopping_buyers', 'All Buyers'],
      ['shopping_tokens', 'Tokens'],
      ['shopping_coupons', 'Coupons']
    ]],
    ['social_studio', 'Social Studio'],
    ['messages', 'Messages'],
    ['__divider'],
    ['__section', 'FINANCE'],
    ['fin', 'Payments'],
    ['__divider'],
    ['centers', 'Centers'],
    ['set', 'Settings']
  ],
  admin: [
    ['dash', 'Dashboard'],
    ['__section', 'ACADEMIC MANAGEMENT'],
    ['courses', 'Courses'],
    ['packages', 'Packages'],
    ['tests', 'Tests'],
    ['testseries', 'Test Series'],
    ['__divider'],
    ['__section', 'PEOPLE MANAGEMENT'],
    ['students', 'Students'],
    ['instrs', 'Instructors'],
    ['team', 'Manage Team'],
    ['invites', 'Invitations'],
    ['__divider'],
    ['__section', 'OPERATIONS'],
    ['shopping', 'Shopping', [
      ['shopping_buyers', 'All Buyers'],
      ['shopping_tokens', 'Tokens'],
      ['shopping_coupons', 'Coupons']
    ]],
    ['social_studio', 'Social Studio'],
    ['messages', 'Messages'],
    ['__divider'],
    ['__section', 'FINANCE'],
    ['fin', 'Payments']
  ],
  instructor: [
    ['dash', 'Dashboard'],
    ['__section', 'ACADEMIC MANAGEMENT'],
    ['courses', 'My courses'],
    ['packages', 'Packages'],
    ['tests', 'Tests'],
    ['testseries', 'Test Series'],
    ['__divider'],
    ['__section', 'PEOPLE MANAGEMENT'],
    ['students', 'Students'],
    ['__divider'],
    ['__section', 'COMMUNICATION'],
    ['messages', 'Messages']
  ],
  student: [
    ['dash', 'Dashboard'],
    ['__section', 'ACADEMIC MANAGEMENT'],
    ['courses', 'My courses'],
    ['packages', 'Packages'],
    ['tests', 'Tests'],
    ['testseries', 'Test Series'],
    ['__divider'],
    ['__section', 'COMMUNICATION'],
    ['messages', 'Messages'],
    ['__divider'],
    ['__section', 'FINANCE'],
    ['fin', 'Payments']
  ]
};

const LE = { owner: 'owner@abcinstitute.demo', admin: 'admin@abcinstitute.demo', instructor: 'instructor@abcinstitute.demo', student: 'student@abcinstitute.demo' },
  DM = { owner: 'u1', admin: 'u2', instructor: 'u3', student: 's1' };

const AUTH_ROLES = {
  owner: ['owner@abcinstitute.demo', 'Owner', 'See revenue and health across every center.', 'u1'],
  administrator: ['admin@abcinstitute.demo', 'Administrator', 'Admit students, schedule tests and build packages.', 'u2'],
  instructor: ['instructor@abcinstitute.demo', 'Instructor', 'Run live classes and follow each student’s progress.', 'u3'],
  student: ['student@abcinstitute.demo', 'Student', 'Take tests, watch lectures and keep your streak.', 's1']
};
let authRole = 'owner';
let authAnimFrame = null;
let authInterval = null;

function login() {
  if (authAnimFrame) { cancelAnimationFrame(authAnimFrame); authAnimFrame = null; }
  if (authInterval) { clearInterval(authInterval); authInterval = null; }

  $('#app').innerHTML = `
    <div class="auth-container">
      <aside class="stage" aria-label="Illustration of an open book releasing knowledge">
        <div class="shelves"></div>
        <canvas id="fx"></canvas>
        
        <div class="book-wrap" aria-hidden="true">
          <svg class="cap" viewBox="0 0 96 70"><path d="M48 4 94 26 48 48 2 26Z" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5" stroke-linejoin="round"/><path d="M22 38v16c0 8 52 8 52 0V38L48 51Z" fill="#173775"/><path d="M86 30v28" stroke="#38bdf8" stroke-width="3"/><circle cx="86" cy="62" r="5" fill="#38bdf8"/></svg>
          <div class="glow"></div>
          <div class="book">
            <div class="cover"></div><div class="half l"></div><div class="half r"></div>
            <div class="pg" style="--i:0"></div><div class="pg" style="--i:1"></div><div class="pg" style="--i:2"></div><div class="pg" style="--i:3"></div>
          </div>
        </div>
        <div class="copy">
          <h1>Run your entire institute from one calm workspace.</h1>
          <p>Courses, students, live tests and finances in an all-in-one unified portal.</p>
          <div class="subjects" id="authSubjects"><span>Courses</span><span>Students</span><span>Live tests</span><span>Finances</span></div>
        </div>
      </aside>

      <main class="panel">
        <button class="theme" id="authTheme" aria-label="Switch to dark theme" type="button" onclick="toggleTheme(event)">
          <svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></svg>
          <svg class="moon" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/></svg>
        </button>

        <form class="card" id="authForm" novalidate>
          <div class="logo" aria-label="trigrexam">
            <svg viewBox="0 0 30 30" aria-hidden="true"><path d="M15 3 29 10 15 17 1 10Z" fill="var(--sky)"/><path d="M7 15v6c0 4 16 4 16 0v-6l-8 4Z" fill="var(--navy)"/></svg>
            tri<i>g</i>rexam
          </div>
          <h2>Welcome back</h2>
          <p class="sub">Sign in to ${E(D.inst)} · demo accounts, no real emails are sent</p>

          <div class="roles" id="authRoles" role="radiogroup" aria-label="Sign in as">
            <span class="pill"></span>
            <button type="button" role="radio" aria-checked="true" data-r="owner">Owner</button>
            <button type="button" role="radio" aria-checked="false" data-r="administrator">Administrator</button>
            <button type="button" role="radio" aria-checked="false" data-r="instructor">Instructor</button>
            <button type="button" role="radio" aria-checked="false" data-r="student">Student</button>
          </div>
          <p class="hint" id="authHint" aria-live="polite"></p>

          <label for="authEmail">Email</label>
          <div class="field"><input id="authEmail" type="email" autocomplete="username" value="owner@abcinstitute.demo"></div>
          <label for="authPw">Password</label>
          <div class="field">
            <input id="authPw" type="password" autocomplete="current-password" value="Demo@123">
            <button type="button" class="eye" id="authEye" aria-label="Show password"><svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></button>
          </div>
          <p class="err" id="authErr" role="alert"></p>

          <button class="btn go" id="authGo" type="submit"><span class="spin"></span><svg viewBox="0 0 24 24"><path d="M5 12.5 10 17.5 19 7"/></svg><span id="authGoLabel">Log in</span></button>
          <button class="btn alt" id="authDemo" type="button">Continue as demo owner</button>
          <p class="links"><a onclick="fp()">Forgot password?</a></p>
          <p class="demo">Demo password for all accounts: <code>Demo@123</code></p>
        </form>
      </main>
    </div>
  `;

  initAuthExperience();
}

function initAuthExperience() {
  const roles = $('#authRoles');
  if (!roles) return;
  const pill = roles.querySelector('.pill'),
    btns = [...roles.querySelectorAll('button')];

  function placePill() {
    const b = roles.querySelector('[aria-checked=true]');
    if (!b || !pill) return;
    Object.assign(pill.style, {
      left: b.offsetLeft + 'px',
      top: b.offsetTop + 'px',
      width: b.offsetWidth + 'px',
      height: b.offsetHeight + 'px'
    });
  }

  function setAuthRole(r) {
    authRole = r;
    LR = r === 'administrator' ? 'admin' : r;
    btns.forEach(b => b.setAttribute('aria-checked', b.dataset.r === r));
    placePill();
    const info = AUTH_ROLES[r];
    if (info) {
      $('#authEmail').value = info[0];
      $('#authErr').textContent = '';
      const h = $('#authHint');
      if (h) {
        h.style.opacity = 0;
        setTimeout(() => {
          h.textContent = info[2];
          h.style.opacity = 1;
        }, 180);
      }
      const dm = $('#authDemo');
      if (dm) dm.textContent = 'Continue as demo ' + info[1].toLowerCase();
    }
  }

  btns.forEach(b => b.addEventListener('click', () => setAuthRole(b.dataset.r)));
  window.addEventListener('resize', placePill);
  if (document.fonts) document.fonts.ready.then(placePill);
  setAuthRole('owner');
  setTimeout(placePill, 50);

  /* Password eye */
  const eye = $('#authEye');
  if (eye) {
    eye.onclick = () => {
      const p = $('#authPw');
      const s = p.type === 'password';
      p.type = s ? 'text' : 'password';
      eye.setAttribute('aria-label', s ? 'Hide password' : 'Show password');
    };
  }

  /* Ripple on buttons */
  document.querySelectorAll('.auth-container .btn').forEach(b => {
    b.addEventListener('pointerdown', e => {
      const r = b.getBoundingClientRect(),
        d = Math.max(r.width, r.height) / 2,
        s = document.createElement('span');
      s.className = 'rip';
      s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      b.appendChild(s);
      setTimeout(() => s.remove(), 650);
    });
  });

  /* Sign in handler */
  const form = $('#authForm'),
    goBtn = $('#authGo');

  function fail(m) {
    $('#authErr').textContent = m;
    form.classList.remove('shake');
    void form.offsetWidth;
    form.classList.add('shake');
  }

  function handleSignIn() {
    if (goBtn.classList.contains('load') || goBtn.classList.contains('done')) return;
    const em = $('#authEmail').value.trim(),
      pw = $('#authPw').value;
    if (!/^\S+@\S+\.\S+$/.test(em)) return fail('Enter a valid email address.');
    if (pw !== 'Demo@123') return fail('Password doesn’t match. Demo accounts use Demo@123.');

    // Look for matching user in database or fallback to role default
    const matchedUser = D.users.find(x => x.email.toLowerCase() === em.toLowerCase());
    const roleKey = authRole === 'administrator' ? 'admin' : authRole;

    if (matchedUser && matchedUser.status !== 'Active') {
      return fail('This account is inactive. Contact your administrator.');
    }

    const targetUserId = matchedUser ? matchedUser.id : AUTH_ROLES[authRole][3];

    $('#authErr').textContent = '';
    goBtn.classList.add('load');
    $('#authGoLabel').textContent = 'Signing in';

    setTimeout(() => {
      goBtn.classList.remove('load');
      goBtn.classList.add('done');
      $('#authGoLabel').textContent = 'Opening ' + AUTH_ROLES[authRole][1] + ' workspace';
      triggerConfetti();
      setTimeout(() => {
        go2(targetUserId);
      }, 1000);
    }, 1100);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    handleSignIn();
  });

  const demoBtn = $('#authDemo');
  if (demoBtn) {
    demoBtn.onclick = () => {
      $('#authEmail').value = AUTH_ROLES[authRole][0];
      $('#authPw').value = 'Demo@123';
      handleSignIn();
    };
  }

  /* Rotating subject chips */
  const chips = [...document.querySelectorAll('#authSubjects span')];
  let ci = 0;
  authInterval = setInterval(() => {
    chips.forEach((c, i) => c.classList.toggle('on', i === ci));
    ci = (ci + 1) % chips.length;
  }, 1600);

  /* Canvas particle effect */
  const cv = $('#fx');
  if (!cv) return;
  const cx = cv.getContext('2d'),
    book = document.querySelector('.book-wrap'),
    stage = document.querySelector('.stage');
  const G = ['∑', 'π', '∫', '√', 'A+', 'E=mc²', 'x²', 'Δ', 'H₂O', '∞', 'θ', 'a²+b²', 'DNA', 'log', '42', '✓', '?', 'α'];
  let W, H, P = [], C = [], mx = -999, my = -999,
    dpr = Math.min(window.devicePixelRatio || 1, 2);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size() {
    if (!stage || !cv) return;
    const r = stage.getBoundingClientRect();
    W = r.width;
    H = r.height;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener('resize', size);

  if (stage) {
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    });
    stage.addEventListener('pointerleave', () => { mx = my = -999; });
  }

  function spawn() {
    if (!book || !stage) return;
    const b = book.getBoundingClientRect(),
      s = stage.getBoundingClientRect(),
      m = Math.random();
    P.push({
      x: b.left - s.left + b.width * (0.3 + m * 0.4),
      y: b.top - s.top + b.height * 0.55,
      vx: (m - 0.5) * 0.7,
      vy: -(0.4 + Math.random() * 0.7),
      g: G[(Math.random() * G.length) | 0],
      s: 14 + Math.random() * 16,
      a: 0,
      l: 0,
      max: 420 + Math.random() * 260,
      ph: Math.random() * 6
    });
  }

  function triggerConfetti() {
    if (!book || !stage) return;
    const s = stage.getBoundingClientRect(),
      cols = ['#38bdf8', '#009EE2', '#7dd3fc', '#fcd34d', '#a5f3c4', '#c4b5fd'],
      b = book.getBoundingClientRect();
    for (let i = 0; i < 110; i++) {
      const a = Math.random() * Math.PI * 2,
        v = 3 + Math.random() * 7;
      C.push({
        x: b.left - s.left + b.width / 2,
        y: b.top - s.top + b.height * 0.4,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 5,
        w: 5 + Math.random() * 6,
        h: 3 + Math.random() * 4,
        r: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.4,
        c: cols[i % cols.length],
        l: 0
      });
    }
  }

  let t = 0;
  function frame() {
    cx.clearRect(0, 0, W, H);
    t++;
    if (t % (reduce ? 40 : 9) === 0 && P.length < 46) spawn();
    for (const p of P) {
      p.l++;
      p.x += p.vx + Math.sin(t * 0.02 + p.ph) * 0.25;
      p.y += p.vy;
      const dx = p.x - mx,
        dy = p.y - my,
        d = Math.hypot(dx, dy);
      if (d < 120) {
        const f = ((120 - d) / 120) * 2.2;
        p.x += (dx / d) * f;
        p.y += (dy / d) * f;
      }
      const k = p.l / p.max;
      p.a = Math.min(1, p.l / 40) * (1 - k * k * k);
    }
    P = P.filter(p => p.l < p.max && p.y > -30);
    cx.lineWidth = 1;
    for (let i = 0; i < P.length; i++) {
      for (let j = i + 1; j < P.length; j++) {
        const a = P[i],
          b = P[j],
          d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          cx.strokeStyle = `rgba(125,211,252,${(1 - d / 120) * 0.35 * Math.min(a.a, b.a)})`;
          cx.beginPath();
          cx.moveTo(a.x, a.y);
          cx.lineTo(b.x, b.y);
          cx.stroke();
        }
      }
    }
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    for (const p of P) {
      cx.font = `600 ${p.s}px Poppins, sans-serif`;
      cx.fillStyle = `rgba(186,230,253,${p.a * 0.9})`;
      cx.shadowColor = 'rgba(56,189,248,.8)';
      cx.shadowBlur = 10;
      cx.fillText(p.g, p.x, p.y);
    }
    cx.shadowBlur = 0;
    for (const c of C) {
      c.l++;
      c.vy += 0.22;
      c.vx *= 0.985;
      c.x += c.vx;
      c.y += c.vy;
      c.r += c.vr;
      cx.save();
      cx.translate(c.x, c.y);
      cx.rotate(c.r);
      cx.globalAlpha = Math.max(0, 1 - c.l / 150);
      cx.fillStyle = c.c;
      cx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      cx.restore();
    }
    C = C.filter(c => c.l < 150);
    authAnimFrame = requestAnimationFrame(frame);
  }
  authAnimFrame = requestAnimationFrame(frame);
}

function li() {
  const u = D.users.find(x => x.email === $('#authEmail').value.trim().toLowerCase()),
    e = $('#authErr');
  if (!u || $('#authPw').value !== 'Demo@123') return (e.textContent = 'Incorrect email or password.');
  if (u.status !== 'Active') return (e.textContent = 'This account is inactive. Contact your administrator.');
  go2(u.id);
}
function go2(i) {
  try { localStorage.setItem('trigr_active_uid', i); } catch (e) {}
  S = { uid: i, c: 'all', p: S.p || 'dash', selectedPkgId: S.selectedPkgId || null, q: '', pg: 0, chartPeriod: 'monthly' };
  render();
}
function fp() {
  modal(
    'Reset password',
    F('email', 'Email') + '<small>Demo only: the message appears in the Demo Outbox.</small>',
    o => {
      D.out.unshift({ id: id('o'), to: o.email || '—', sub: 'Password reset link', at: new Date().toLocaleString(), link: 'https://unified.demo/reset/' + id('r') });
    },
    'If that account exists, a reset link was queued (demo).',
    'Send reset link'
  );
}

const go = p => {
    S.p = p;
    S.q = '';
    S.pg = 0;
    S.cv = S.bv = null;
    render();
  },
  sw = i => go2(i),
  lo = () =>
    cfm('Log out of this session?', () => {
      S.uid = null;
      try { localStorage.removeItem('trigr_active_uid'); } catch (e) {}
      closeM(1);
      login();
    });

function rp() {
  const p = $('#pg');
  let nl = '';
  if (S.p === 'create_package') {
    nl = 'Packages › Create Package Studio';
  } else if (S.p === 'package_view') {
    nl = 'Packages › Package Details & Deep Inspection';
  } else {
    for (const item of (NV[me().role] || [])) {
      if (item[0] === S.p) { nl = item[1]; break; }
      if (item[2]) {
        const sub = item[2].find(s => s[0] === S.p);
        if (sub) { nl = `${item[1]} › ${sub[1]}`; break; }
      }
    }
  }
  p.innerHTML = `<div class=bc>Workspace › <span>${nl || S.p}</span></div>` + (PG[S.p] ? PG[S.p]() : '<div class=em>Page not found</div>');
  const i = p.querySelector('.in');
  if (i && S.q) {
    i.focus();
    i.setSelectionRange(99, 99);
  }
  // Run counter animations
  animateCounters();
}

function toggleNavGroup(k) {
  S.navOpen = S.navOpen || {};
  S.navOpen[k] = !S.navOpen[k];
  render();
}

function render() {
  if (!S.uid) {
    try {
      const uParams = new URLSearchParams(window.location.search);
      const urlPkg = uParams.get('pkg');
      const urlP = uParams.get('p');
      const roleKey = localStorage.getItem('trigrexam_active_role');
      const savedUid = localStorage.getItem('trigr_active_uid') || (roleKey && DM[roleKey]);
      if (urlPkg || urlP || savedUid) {
        S.uid = (savedUid && D.users.some(x => x.id === savedUid)) ? savedUid : 'u1';
        if (urlPkg) {
          S.p = 'package_view';
          S.selectedPkgId = urlPkg;
        } else if (urlP) {
          S.p = urlP;
        }
      }
    } catch (e) {}
  }
  if (!S.uid) return login();
  try { localStorage.setItem('trigr_active_uid', S.uid); } catch (e) {}
  if (authAnimFrame) { cancelAnimationFrame(authAnimFrame); authAnimFrame = null; }
  if (authInterval) { clearInterval(authInterval); authInterval = null; }
  if (!hasC()) S.c = 'all';
  const u = me(),
    r = u.role,
    c = r === 'owner' ? D.centers : D.centers.filter(x => u.centers.includes(x.id)),
    n = mine().filter(x => !x.read).length,
    studentUnreadMsgs = r === 'student' ? (D.messages || []).filter(m => m.toStudentId === S.uid && !m.read).length : 0;

  // Filter sidebar navigation: hide 'centers' and 'batches' when online mode
  const filteredNav = (NV[r] || []).filter(x => {
    if (!hasC()) {
      if (x[0] === 'centers' || x[0] === 'batches') return false;
    }
    return true;
  });

  const navHtml = filteredNav.map(item => {
    const [k, l, subItems] = item;
    if (k === '__section') {
      return `<div class="nav-section-title">${l}</div>`;
    }
    if (k === '__divider') {
      return `<div class="nav-section-divider"></div>`;
    }
    if (subItems && Array.isArray(subItems)) {
      const isSubActive = subItems.some(s => s[0] === S.p);
      const isExpanded = (S.navOpen && S.navOpen[k] !== undefined) ? S.navOpen[k] : (isSubActive || S.p.startsWith('shopping_'));
      return `
        <div class="nav-group ${isExpanded ? 'open' : ''}">
          <div class="nav-group-header ${isSubActive ? 'active-group' : ''}" onclick="toggleNavGroup('${k}')" title="${l}">
            <div class="nav-gh-left">
              ${ico(k)}
              <span class="lbl">${l}</span>
            </div>
            <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="sub-nav">
            ${subItems.map(([subK, subL]) => `
              <a class="sub-nav-item ${S.p === subK ? 'on' : ''}" onclick="event.stopPropagation(); go('${subK}')">
                <span class="sub-circle"></span>
                <span class="sub-lbl">${subL}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    const unreadMsgs = (k === 'messages' && r === 'student') ? (D.messages || []).filter(m => m.toStudentId === S.uid && !m.read).length : 0;
    const baseNav = `
      <a tabindex=0 title="${l}" class="${S.p === k ? 'on' : ''}" onclick="go('${k}')">
        ${ico(k)}
        <span class=lbl>${l}</span>
        ${unreadMsgs ? `<span class="pill-badge pill-red" style="margin-left:auto;font-size:10.5px;padding:2px 7px;font-weight:700">${unreadMsgs}</span>` : ''}
      </a>
    `;

    if (k === 'dash' && r !== 'student') {
      return baseNav + `
        <div class="sidebar-create-pkg-wrap">
          <button type="button" class="btn-sidebar-create-pkg ${S.p === 'create_package' ? 'on' : ''}" onclick="typeof initNewPackageCreator === 'function' ? initNewPackageCreator() : go('create_package')" title="Create New Package">
            <svg class="pkg-btn-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span class="lbl">Create Package</span>
            <span class="btn-tag">New</span>
          </button>
        </div>
      `;
    }
    return baseNav;
  }).join('');

  $('#app').innerHTML = `<aside class=sb><div class=lg>${LIMG}</div><div class=prof><img src="${av(u)}" alt=""><div><b>${E(u.name)}</b><small><i class=dot></i>Online · ${RL[r]}</small></div></div><nav style="padding-top:10px">${navHtml}</nav><div class=swr><div class=pop id=sw hidden><div class=pom><small>Institute mode</small><div class=seg>${['Online', 'Offline', 'Both'].map(m => `<button type=button class="${OM() === m ? 'on' : ''}" onclick="som('${m}')">${m}</button>`).join('')}</div></div>${[['u1', 'Institute Owner'], ['u2', 'Administrator'], ['u3', 'Instructor'], ['s1', 'Student']].map(([i, l]) => `<button class="${S.uid === i ? 'on' : ''}" onclick="sw('${i}')"><img src="${av(U(i))}" alt=""><span><b>${l}</b><small>${E(U(i).name)}</small></span></button>`).join('')}</div><button class="b2 swb" title="Switch demo role" onclick="$('#sw').hidden=!$('#sw').hidden">${ico('swap')}<span class=lbl>Switch role<em>Demo</em></span></button></div></aside><main><header class=top><div class=tl><button class=hb aria-label="Toggle sidebar" onclick="document.body.classList.toggle('mini')">${ico('menu')}</button>${hasC() && r !== 'student' && (r === 'owner' || c.length > 1) ? `<select aria-label="Center" onchange="S.c=this.value;S.pg=0;render()"><option value=all>${r === 'owner' ? 'All centers' : 'All my centers'}</option>${c.map(x => `<option value=${x.id} ${S.c === x.id ? 'selected' : ''}>${E(x.name)}</option>`).join('')}</select>` : ''}</div><div class=hr>${r !== 'student' ? `<button class=lv onclick="toast('Opening proctor live dashboard (simulated)')"><i></i>Proctor Live</button>` : ''}<button class=thb title="${THEME === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}" onclick="toggleTheme(event)">${ico(THEME === 'dark' ? 'sun' : 'moon')}</button><button class=ib aria-label=Messages title="Direct Student Messages" onclick="go('messages')">${ico('messages')}${studentUnreadMsgs ? `<i class=nb>${studentUnreadMsgs}</i>` : ''}</button><button class=ib aria-label=Notifications onclick=nt()>${ico('bell')}${n ? `<i class=nb>${n}</i>` : ''}</button><button class=uc title="Log out" onclick=lo()><img src="${av(u)}" alt=""><span>${E(u.name)}</span></button></div></header><section id=pg></section></main>`;
  rp();
}

function nt() {
  const l = mine();
  modal(
    'Notifications',
    l.length ? l.map(n => `<div class=cd style="${n.read ? 'opacity:.6' : ''}">${E(n.t)}</div>`).join('') : '<div class=em>No notifications.</div>',
    null,
    '',
    '',
    `<button class=b2 onclick=closeM(1)>Close</button><button class=b1 onclick="mine().forEach(n=>n.read=true);save();nt();render()">Mark all read</button>`
  );
}

/* Number animation helper */
function animateCounters() {
  document.querySelectorAll('.stat-counter').forEach(el => {
    const target = parseFloat(el.getAttribute('data-target')) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const isCurrency = prefix.includes('₹');
    let start = 0;
    const duration = 800;
    const startTime = performance.now();
    const update = currentTime => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      el.textContent = isCurrency ? R(current) : prefix + current.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isCurrency ? R(target) : prefix + target.toLocaleString('en-IN') + suffix;
    };
    requestAnimationFrame(update);
  });
}

function switchChartPeriod(period) {
  S.chartPeriod = period;
  rp();
}

const can = () => ['owner', 'admin'].includes(me().role) || (me().roles && me().roles.some(r => ['owner', 'admin'].includes(r)));

/* Circular Reveal Dark Mode Transition Engine */
let THEME = localStorage.getItem('trigrexam_theme') || 'light';
if (THEME === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

function toggleTheme(event) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Find click coordinates from button or mouse event
  let x = window.innerWidth / 2;
  let y = 0;
  if (event) {
    const rect = event.currentTarget ? event.currentTarget.getBoundingClientRect() : null;
    if (rect) {
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if (event.clientX) {
      x = event.clientX;
      y = event.clientY;
    }
  }

  // Calculate the maximum distance from click point to any screen corner
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const applyThemeUpdate = () => {
    THEME = newTheme;
    localStorage.setItem('trigrexam_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    // Update theme icon in topbar
    const btn = document.querySelector('.thb');
    if (btn) {
      btn.innerHTML = ico(newTheme === 'dark' ? 'sun' : 'moon');
      btn.setAttribute('title', newTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
  };

  // If user prefers reduced motion or browser doesn't support View Transitions API
  if (prefersReducedMotion || !document.startViewTransition) {
    applyThemeUpdate();
    return;
  }

  // View Transition API with Circular Clip-Path Animation
  const transition = document.startViewTransition(() => {
    applyThemeUpdate();
  });

  transition.ready.then(() => {
    // Both directions (light -> dark and dark -> light) animate smoothly
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ];

    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath
      },
      {
        duration: 200,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    );
  });
}
const KPI_THEMES = [
  { id: 'blue', bgStart: '#FFFFFF', bgEnd: '#F4FAFE', waveStart: '#E0F2FE', waveEnd: '#BAE6FD', borderStart: '#D8EEFD', borderEnd: '#C5E6FB', themeClass: 'kpi-theme-blue' },
  { id: 'purple', bgStart: '#FFFFFF', bgEnd: '#FAF6FE', waveStart: '#E9D5FF', waveEnd: '#D8B4FE', borderStart: '#EDE9FE', borderEnd: '#E4D4FD', themeClass: 'kpi-theme-purple' },
  { id: 'pink', bgStart: '#FFFFFF', bgEnd: '#FDF2F8', waveStart: '#FCE7F3', waveEnd: '#FBCFE8', borderStart: '#FCE7F3', borderEnd: '#F9A8D4', themeClass: 'kpi-theme-pink' },
  { id: 'amber', bgStart: '#FFFFFF', bgEnd: '#FEF9F3', waveStart: '#FED7AA', waveEnd: '#FDBA74', borderStart: '#FFEDD5', borderEnd: '#FDE4C8', themeClass: 'kpi-theme-amber' },
  { id: 'green', bgStart: '#FFFFFF', bgEnd: '#F5FCF8', waveStart: '#D9F9E5', waveEnd: '#B9F1CE', borderStart: '#E0F0E8', borderEnd: '#D4E9DF', themeClass: 'kpi-theme-green' }
];

function renderKpiCard({ title, value, prefix = '', suffix = '', trend = '', sub = 'vs. last month', icon = 'students', link = '', onclick = '', variant = 0 }) {
  let t = typeof variant === 'string' ? KPI_THEMES.find(th => th.id === variant) : KPI_THEMES[variant % KPI_THEMES.length];
  if (!t) t = KPI_THEMES[0];
  const uid = 'kpi_' + t.id + '_' + Math.random().toString(36).slice(2, 7);
  const clickAttr = onclick ? `onclick="${onclick}" style="cursor:pointer"` : (link ? `onclick="go('${link}')" style="cursor:pointer"` : '');

  return `
    <div class="kpi-card ${t.themeClass}" ${clickAttr}>
      <div class="kpi-svg-bg">
        <svg width="100%" height="100%" viewBox="0 0 520 180" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cardBg_${uid}" x1="0" y1="0" x2="520" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="${t.bgStart}"/>
              <stop offset="100%" stop-color="${t.bgEnd}"/>
            </linearGradient>

            <linearGradient id="waveGradient_${uid}" x1="250" y1="125" x2="250" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="${t.waveStart}" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="${t.waveEnd}" stop-opacity="0.45"/>
            </linearGradient>

            <linearGradient id="borderGradient_${uid}" x1="0" y1="0" x2="520" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="${t.borderStart}"/>
              <stop offset="100%" stop-color="${t.borderEnd}"/>
            </linearGradient>

            <clipPath id="cardClip_${uid}">
              <rect x="5" y="5" width="510" height="170" rx="32"/>
            </clipPath>
          </defs>

          <!-- Card background -->
          <rect x="5" y="5" width="510" height="170" rx="32" fill="url(#cardBg_${uid})"/>

          <!-- Bottom wave -->
          <g clip-path="url(#cardClip_${uid})">
            <path
              d="M5 150
                 C75 150 125 137 185 128
                 C250 117 300 126 355 138
                 C420 152 465 151 515 139
                 L515 180
                 L5 180 Z"
              fill="url(#waveGradient_${uid})"
            />
          </g>

          <!-- Border -->
          <rect x="5" y="5" width="510" height="170" rx="32" stroke="url(#borderGradient_${uid})" stroke-width="3"/>
        </svg>
      </div>

      <div class="kpi-card-content">
        <div class="kpi-left">
          <div class="kpi-icon-box">${ico(icon)}</div>
          <div class="kpi-info">
            <span class="kpi-title">${E(title)}</span>
            <span class="kpi-value stat-counter" data-target="${value}" data-prefix="${prefix}" data-suffix="${suffix}">${prefix ? prefix + Number(value).toLocaleString('en-IN') : Number(value).toLocaleString('en-IN')}${suffix}</span>
          </div>
        </div>
        ${trend ? `
          <div class="kpi-trend-box">
            <span class="kpi-trend">${trend}</span>
            <span class="kpi-sub">${E(sub)}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/* ============================================================== */
/* DASHBOARD GENERATORS (Deeply tailored SaaS experience per role) */
/* ============================================================== */

function switchChartPeriod(p) {
  S.chartPeriod = p;
  render();
}

const PG = {
  dash() {
    const r = me().role;
    if (r === 'owner') return PG.dashOwner();
    if (r === 'admin') return PG.dashAdmin();
    if (r === 'instructor') return PG.dashInstructor();
    return PG.dashStudent();
  },

  /* 1. INSTITUTE OWNER DASHBOARD */
  dashOwner() {
    const iv = D.inv.filter(i => inScope(i));
    const paid = sum(iv, 'paid'),
      due = sum(iv, 'total') - paid;
    const totalStudents = stu().length;
    const totalCourses = crs().length;
    const totalInstructors = D.users.filter(u => u.role === 'instructor').length;

    // Chart mock data based on period
    const period = S.chartPeriod || 'monthly';
    const chartData = {
      daily: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], enrol: [14, 22, 18, 35, 27, 44, 19] },
      weekly: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'], enrol: [68, 92, 84, 125, 110, 148] },
      monthly: { labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], enrol: [240, 310, 280, 420, 510, 460] }
    }[period] || {
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      enrol: [240, 310, 280, 420, 510, 460]
    };

    const maxEnrol = Math.max(...chartData.enrol, 1);

    return `
      <div class="dash-head">
        <div>
          <h1>Institute Overview</h1>
          <p>Real-time analytics, revenue health and learner ecosystem for ${E(D.inst)}</p>
        </div>
        <div class="dash-actions">
          <button class="b2" onclick="ci()">${ico('up')} Import Data</button>
          <button class="b1" onclick="nw()">+ Add Course</button>
        </div>
      </div>

      <!-- Stat Metric Cards (Light Blue, Light Purple, Light Pink, Light Amber) -->
      <div class="metric-grid">
        ${renderKpiCard({ title: 'Total Number of Active Learners', value: totalStudents, trend: '↑ +8.5%', sub: 'vs. last month', icon: 'students', link: 'students', variant: 'blue' })}
        ${renderKpiCard({ title: 'Total Number of Active Courses', value: totalCourses, trend: '↑ +2', sub: 'new published', icon: 'courses', link: 'courses', variant: 'purple' })}
        ${renderKpiCard({ title: 'Total Number of Teaching Staff', value: totalInstructors, trend: '↑ 100%', sub: 'active faculty', icon: 'instrs', link: 'instrs', variant: 'pink' })}
        ${renderKpiCard({ title: 'Total Revenue Collected', value: paid, prefix: '₹', trend: '↑ +14.2%', sub: 'vs. last month', icon: 'fin', link: 'fin', variant: 'amber' })}
      </div>

      <!-- Main Analytics Row: Enrollment Bar Chart & Top Performing Courses -->
      <div class="dash-row">
        <!-- Enrollment Chart (Last 7 Days, Every Week, Every Month) -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Enrollment</div>
              <div class="dash-card-sub">Number of students enrolled every month, every week, and in the last 7 days</div>
            </div>
            <div class="period-tabs">
              <button class="period-btn ${period === 'daily' ? 'active' : ''}" onclick="switchChartPeriod('daily')">Last 7 Days</button>
              <button class="period-btn ${period === 'weekly' ? 'active' : ''}" onclick="switchChartPeriod('weekly')">Every Week</button>
              <button class="period-btn ${period === 'monthly' ? 'active' : ''}" onclick="switchChartPeriod('monthly')">Every Month</button>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item"><span class="legend-dot" style="background:#0284c7"></span> Enrolled Students</div>
          </div>
          <div class="chart-container">
            <svg viewBox="0 0 540 180" style="width:100%;height:180px;overflow:visible">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0284c7"/>
                  <stop offset="100%" stop-color="#bae6fd"/>
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line x1="0" y1="30" x2="540" y2="30" stroke="#f1f5f9" stroke-dasharray="4"/>
              <line x1="0" y1="80" x2="540" y2="80" stroke="#f1f5f9" stroke-dasharray="4"/>
              <line x1="0" y1="130" x2="540" y2="130" stroke="#f1f5f9" stroke-dasharray="4"/>
              <line x1="0" y1="160" x2="540" y2="160" stroke="#e2e8f0"/>
              <!-- Bars with Interactive Hover Showing Exact Enrolled Count -->
              ${chartData.labels.map((l, i) => {
                const count = chartData.labels.length;
                const slotW = 540 / count;
                const barW = Math.min(36, slotW * 0.45);
                const x = i * slotW + (slotW - barW) / 2;
                const h = Math.max(16, (chartData.enrol[i] / maxEnrol) * 125);
                const y = 160 - h;
                const val = chartData.enrol[i];
                return `
                  <g class="chart-bar-group" style="cursor:pointer">
                    <title>${val} Students Enrolled (${l})</title>
                    <rect class="svg-bar" x="${x}" y="${y}" width="${barW}" height="${h}" rx="6" fill="url(#barGrad)"/>
                    <rect class="bar-pill" x="${x + barW / 2 - 18}" y="${y - 23}" width="36" height="18" rx="5" fill="#0f172a"/>
                    <text class="bar-val-text" x="${x + barW / 2}" y="${y - 10}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#ffffff">${val}</text>
                    <text x="${x + barW / 2}" y="176" text-anchor="middle" font-size="11" fill="#64748b" font-family="Poppins">${l}</text>
                  </g>
                `;
              }).join('')}
            </svg>
          </div>
        </div>

        <!-- Right Side: Top Courses or Center Performance -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">${hasC() ? 'Center Footprint' : 'Top Performing Courses'}</div>
              <div class="dash-card-sub">${hasC() ? 'Branch-wise learner distribution' : 'Most enrolled online programs'}</div>
            </div>
          </div>
          <div class="task-list">
            ${hasC()
              ? D.centers.map(c => {
                  const sCount = D.users.filter(u => u.role === 'student' && u.centers[0] === c.id).length;
                  const cPaid = sum(D.inv.filter(i => i.center === c.id), 'paid');
                  return `
                    <div class="task-item">
                      <div class="task-left">
                        <div class="task-ico">${ico('centers')}</div>
                        <div class="task-info">
                          <b>${E(c.name)}</b>
                          <small>${sCount} learners · ${R(cPaid)} collected</small>
                        </div>
                      </div>
                      <span class="pill-badge pill-green">${c.status}</span>
                    </div>
                  `;
                }).join('')
              : D.courses.map(c => {
                  const sCount = stu().filter(s => s.courses.includes(c.id)).length;
                  return `
                    <div class="task-item">
                      <div class="task-left">
                        <div class="task-ico">${ico('courses')}</div>
                        <div class="task-info">
                          <b>${E(c.name)}</b>
                          <small>${sCount} enrolled · ${c.lessons.length} lessons</small>
                        </div>
                      </div>
                      <span class="pill-badge pill-blue">${c.access}</span>
                    </div>
                  `;
                }).join('')
            }
          </div>
        </div>
      </div>
    `;
  },

  /* 2. ADMINISTRATOR DASHBOARD */
  dashAdmin() {
    const al = stu();
    const activeCourses = crs();
    const period = S.chartPeriod || 'weekly';

    // 1. STAT: TESTS CREATED PER WEEK (Area Graph)
    const testTrendData = {
      weekly: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        vals: [4, 7, 5, 11, 8, 14],
        best: 'Week 6 · 14 Tests Created (+27%)',
        total: 49
      },
      monthly: {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        vals: [16, 22, 28, 35, 41, 49],
        best: 'March · 49 Tests Created',
        total: 191
      },
      daily: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        vals: [2, 3, 1, 4, 3, 6, 2],
        best: 'Saturday · 6 Tests Created',
        total: 21
      }
    }[period] || {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      vals: [4, 7, 5, 11, 8, 14],
      best: 'Week 6 · 14 Tests Created (+27%)',
      total: 49
    };

    const maxTestVal = Math.max(...testTrendData.vals, 1);
    const chartW = 520, chartH = 175, padX = 42, padTop = 32, padBottom = 34;
    const effW = chartW - padX * 2;
    const effH = chartH - padTop - padBottom;
    const tCount = testTrendData.labels.length;

    const testPoints = testTrendData.vals.map((v, i) => {
      const x = padX + (i * (effW / (tCount - 1)));
      const y = padTop + effH - ((v / (maxTestVal * 1.18)) * effH);
      return { x: Math.round(x), y: Math.round(y), v, label: testTrendData.labels[i] };
    });

    let splineD = `M ${testPoints[0].x} ${testPoints[0].y}`;
    for (let i = 0; i < testPoints.length - 1; i++) {
      const curr = testPoints[i];
      const next = testPoints[i + 1];
      const cpx = Math.round(curr.x + (next.x - curr.x) / 2);
      splineD += ` C ${cpx} ${curr.y}, ${cpx} ${next.y}, ${next.x} ${next.y}`;
    }
    const areaFillD = `${splineD} L ${testPoints[testPoints.length - 1].x} ${padTop + effH} L ${testPoints[0].x} ${padTop + effH} Z`;

    // 2. STAT: LIVE CLASSES IN THE LAST 7 DAYS EACH (Histogram)
    const liveClassesData = [
      { day: 'Mon', count: 6, sub: 'Physics' },
      { day: 'Tue', count: 9, sub: 'Maths' },
      { day: 'Wed', count: 14, sub: 'Biology' },
      { day: 'Thu', count: 8, sub: 'Python' },
      { day: 'Fri', count: 11, sub: 'Chem' },
      { day: 'Sat', count: 16, sub: 'All Depts' },
      { day: 'Sun', count: 7, sub: 'Revision' }
    ];
    const totalLiveSessions = liveClassesData.reduce((a, b) => a + b.count, 0);
    const maxLiveCount = Math.max(...liveClassesData.map(d => d.count), 1);
    const avgLive = (totalLiveSessions / liveClassesData.length).toFixed(1);

    // 3. STAT: TOP THREE MOST PERFORMING COURSES (Donut / Pie Chart)
    const coursesRanked = activeCourses.map(c => {
      const enrolled = al.filter(s => s.courses && s.courses.includes(c.id)).length;
      return {
        id: c.id,
        name: c.name,
        code: c.code,
        price: c.price,
        access: c.access,
        lessonsCount: (c.lessons || []).length,
        instr: c.instr ? ((D.users.find(u => u.id === c.instr) || {}).name || 'Faculty Team') : 'Faculty Team',
        enrolled: enrolled || (c.id === 'k1' ? 48 : c.id === 'k2' ? 38 : 31)
      };
    }).sort((a, b) => b.enrolled - a.enrolled);

    const top3Courses = coursesRanked.slice(0, 3);
    const top3Total = top3Courses.reduce((sum, c) => sum + c.enrolled, 0) || 1;
    const top3Colors = ['#0284c7', '#10b981', '#f59e0b'];
    const top3Medals = ['Top Enrolled', 'Runner-up', 'High Demand'];

    // Donut Geometry (Radius = 58, Circumference ≈ 364.42)
    const donutR = 58;
    const donutCircumference = 2 * Math.PI * donutR;
    let accumulatedOffset = 0;
    const donutArcs = top3Courses.map((c, i) => {
      const pctRatio = c.enrolled / top3Total;
      const arcLen = pctRatio * donutCircumference;
      const offset = accumulatedOffset;
      accumulatedOffset += arcLen;
      const pct = Math.round(pctRatio * 100);
      return {
        color: top3Colors[i % top3Colors.length],
        medal: top3Medals[i],
        rank: i + 1,
        strokeDasharray: `${arcLen.toFixed(1)} ${(donutCircumference - arcLen).toFixed(1)}`,
        strokeDashoffset: (-offset).toFixed(1),
        pct,
        course: c
      };
    });

    // 4. STAT: CONTENT LIBRARY (Pie Chart Data & Geometry)
    const contentLibItems = [
      { key: 'videos', count: '142 Modules', label: 'Video Lectures', storage: '42.5 GB', pct: 46, color: '#0284c7', ico: 'video' },
      { key: 'notes', count: '320 PDFs', label: 'Study Notes & Handouts', storage: '24.8 GB', pct: 27, color: '#10b981', ico: 'file' },
      { key: 'tests', count: '48 Sets', label: 'Practice Test Papers', storage: '14.2 GB', pct: 17, color: '#8b5cf6', ico: 'tests' },
      { key: 'questions', count: '6,400+ MCQs', label: 'Curated Question Banks', storage: '9.1 GB', pct: 10, color: '#f59e0b', ico: 'award' }
    ];
    const totalStorageUsed = '90.6 GB';
    const totalStorageCap = '250 GB';
    const storagePct = 36;

    // Mathematically generate true SVG Pie Chart slices
    const pieR = 85, pieCx = 110, pieCy = 110;
    let curAngle = -Math.PI / 2; // Start from 12 o'clock

    const contentPieSlices = contentLibItems.map(s => {
      const sliceAngle = (s.pct / 100) * 2 * Math.PI;
      const startA = curAngle;
      const endA = curAngle + sliceAngle;
      curAngle = endA;

      const x0 = (pieCx + pieR * Math.cos(startA)).toFixed(2);
      const y0 = (pieCy + pieR * Math.sin(startA)).toFixed(2);
      const x1 = (pieCx + pieR * Math.cos(endA)).toFixed(2);
      const y1 = (pieCy + pieR * Math.sin(endA)).toFixed(2);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      const pathD = `M ${pieCx} ${pieCy} L ${x0} ${y0} A ${pieR} ${pieR} 0 ${largeArc} 1 ${x1} ${y1} Z`;

      const midA = startA + sliceAngle / 2;
      const labelR = pieR * 0.65;
      const lx = (pieCx + labelR * Math.cos(midA)).toFixed(2);
      const ly = (pieCy + labelR * Math.sin(midA)).toFixed(2);

      return { ...s, pathD, lx, ly };
    });

    return `
      <div class="dash-head">
        <div>
          <h1>Operations Dashboard</h1>
          <p>Daily administrative overview, test authoring, live sessions and content repository</p>
        </div>
        <div class="dash-actions">
          <button class="b2" onclick="go('team')">${ico('team')} Manage Team</button>
          <button class="b2" onclick="ci()">${ico('up')} Import CSV</button>
          <button class="b2" onclick="typeof initNewPackageCreator === 'function' ? initNewPackageCreator() : go('create_package')">+ Create Package</button>
          <button class="b1" onclick="es()">+ Add Student</button>
        </div>
      </div>

      <!-- Quick Action Cards -->
      <div class="qa-grid">
        <div class="qa-card qa-blue" onclick="es()">
          <div class="qa-top"><div class="qa-ico">${ico('students')}</div><div class="qa-arrow">↗</div></div>
          <div><b>Add Single Student</b><small>Enrol candidate manually</small></div>
        </div>
        <div class="qa-card qa-purple" onclick="ci()">
          <div class="qa-top"><div class="qa-ico">${ico('up')}</div><div class="qa-arrow">↗</div></div>
          <div><b>Bulk CSV Import</b><small>Import up to 500 learners</small></div>
        </div>
        <div class="qa-card qa-pink" onclick="typeof initNewPackageCreator === 'function' ? initNewPackageCreator() : go('create_package')">
          <div class="qa-top"><div class="qa-ico">${ico('packages')}</div><div class="qa-arrow">↗</div></div>
          <div><b>Create Package</b><small>Bundle courses, tests & notes</small></div>
        </div>
      </div>

      <!-- Stat Metric Cards (Wave SVG Background) -->
      <div class="metric-grid">
        ${renderKpiCard({ title: 'Total Students', value: al.length, trend: '↑ +12%', sub: 'vs. last month', icon: 'students', link: 'students', variant: 0 })}
        ${renderKpiCard({ title: 'Online Learners', value: al.filter(s => s.mode === 'Online').length || al.length, trend: '↑ +15%', sub: 'vs. last month', icon: 'file', link: 'students', variant: 1 })}
        ${renderKpiCard({ title: 'Active Enrollees', value: al.filter(s => s.courses.length > 0).length, trend: '↑ +8%', sub: 'vs. last month', icon: 'courses', link: 'students', variant: 2 })}
        ${renderKpiCard({ title: 'Packages Created', value: (D.packages || []).length, trend: '↑ Live', sub: 'active bundles', icon: 'packages', link: 'packages', variant: 3 })}
      </div>

      <!-- Main Analytics Row 1: Tests Created (Area Graph) & Live Classes (Histogram) -->
      <div class="dash-row">
        <!-- 1. Tests Created per Week (Area Graph) -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Tests Created Per Week</div>
              <div class="dash-card-sub">Mock exams, subject quizzes & evaluation tests authored</div>
            </div>
            <div class="period-tabs">
              <button class="period-btn ${period === 'daily' ? 'active' : ''}" onclick="switchChartPeriod('daily')">Daily</button>
              <button class="period-btn ${period === 'weekly' ? 'active' : ''}" onclick="switchChartPeriod('weekly')">Weekly</button>
              <button class="period-btn ${period === 'monthly' ? 'active' : ''}" onclick="switchChartPeriod('monthly')">Monthly</button>
            </div>
          </div>
          <div class="chart-container" style="min-height:180px;height:180px;position:relative">
            <div class="chart-tooltip">${testTrendData.best}</div>
            <svg viewBox="0 0 520 175" class="chart-area-svg" style="width:100%!important;height:180px!important;min-height:180px!important;display:block!important;overflow:visible!important">
              <defs>
                <linearGradient id="testsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0284c7" stop-opacity="0.38"/>
                  <stop offset="100%" stop-color="#0284c7" stop-opacity="0.02"/>
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line x1="30" y1="35" x2="490" y2="35" stroke="var(--b, #e2e8f0)" stroke-dasharray="4"/>
              <line x1="30" y1="75" x2="490" y2="75" stroke="var(--b, #e2e8f0)" stroke-dasharray="4"/>
              <line x1="30" y1="115" x2="490" y2="115" stroke="var(--b, #e2e8f0)" stroke-dasharray="4"/>
              <line x1="30" y1="145" x2="490" y2="145" stroke="var(--b, #e2e8f0)"/>

              <!-- Area Fill -->
              <path class="chart-area-path" d="${areaFillD}" fill="url(#testsAreaGrad)"/>
              <!-- Spline Curve Line -->
              <path d="${splineD}" fill="none" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round"/>

              <!-- Data Point Circles and Labels -->
              ${testPoints.map(p => `
                <circle class="chart-point" cx="${p.x}" cy="${p.y}" r="4.5" fill="#ffffff" stroke="#0284c7" stroke-width="3"/>
                <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink, #0f172a)">${p.v}</text>
                <text x="${p.x}" y="165" text-anchor="middle" font-size="11" fill="var(--mute, #64748b)" font-family="Poppins">${p.label}</text>
              `).join('')}
            </svg>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid var(--b, #f1f5f9)">
            <span style="font-size:12px;color:var(--mute)">Total published: <b style="color:var(--ink)">${testTrendData.total} Tests</b></span>
            <button class="b2" style="padding:4px 10px;font-size:11.5px" onclick="et()">+ Author Test</button>
          </div>
        </div>

        <!-- 2. Live Classes in the Last 7 Days (Histogram) -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Live Classes (Last 7 Days)</div>
              <div class="dash-card-sub">Daily broadcast sessions conducted across all batches</div>
            </div>
            <span class="pill-badge pill-green" style="font-size:11px">Peak: Sat · 16 Sessions</span>
          </div>
          <div class="chart-container" style="min-height:185px;height:185px;position:relative">
            <svg viewBox="0 0 500 185" class="histogram-svg" style="width:100%!important;height:185px!important;min-height:185px!important;display:block!important;overflow:visible!important">
              <defs>
                <linearGradient id="liveHistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10b981"/>
                  <stop offset="100%" stop-color="#059669"/>
                </linearGradient>
              </defs>
              <line x1="20" y1="35" x2="480" y2="35" stroke="var(--b, #e2e8f0)" stroke-dasharray="4"/>
              <line x1="20" y1="75" x2="480" y2="75" stroke="var(--b, #e2e8f0)" stroke-dasharray="4"/>
              <line x1="20" y1="115" x2="480" y2="115" stroke="var(--b, #e2e8f0)" stroke-dasharray="4"/>
              <line x1="20" y1="150" x2="480" y2="150" stroke="var(--b, #e2e8f0)"/>
              ${liveClassesData.map((d, i) => {
                const slotW = 460 / liveClassesData.length;
                const barW = 38;
                const x = 20 + i * slotW + (slotW - barW) / 2;
                const h = Math.max(16, (d.count / (maxLiveCount * 1.18)) * 115);
                const y = 150 - h;
                return `
                  <!-- Column Bar -->
                  <rect class="hist-bar" x="${x}" y="${y}" width="${barW}" height="${h}" rx="6" fill="url(#liveHistGrad)"/>
                  <!-- Top Count Pill -->
                  <rect x="${x + barW / 2 - 13}" y="${y - 19}" width="26" height="15" rx="4" fill="var(--card, #fff)" stroke="#10b981" stroke-width="1.2"/>
                  <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" font-size="10" font-weight="700" fill="#059669">${d.count}</text>
                  <!-- Day Label -->
                  <text x="${x + barW / 2}" y="166" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink, #0f172a)">${d.day}</text>
                  <text x="${x + barW / 2}" y="179" text-anchor="middle" font-size="9" fill="var(--mute, #64748b)">${d.sub}</text>
                `;
              }).join('')}
            </svg>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid var(--b, #f1f5f9)">
            <span style="font-size:12px;color:var(--mute)">Total: <b style="color:var(--ink)">${totalLiveSessions} Sessions</b> (Avg ${avgLive}/day)</span>
            <button class="b2" style="padding:4px 10px;font-size:11.5px" onclick="toast('Opening Live Stream Scheduler...')">+ Schedule Session</button>
          </div>
        </div>
      </div>

      <!-- Main Analytics Row 2: Top 3 Most Performing Courses (Donut / Pie Chart) -->
      <div class="dash-row">
        <div class="dash-card" style="width:100%">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Top 3 Most Performing Courses</div>
              <div class="dash-card-sub">Courses ranked by student enrollments and learner demand</div>
            </div>
            <button class="b2" onclick="go('courses')">View All Courses</button>
          </div>
          <div class="donut-wrapper">
            <div class="donut-svg-box">
              <svg viewBox="0 0 160 160">
                <!-- Background Track -->
                <circle cx="80" cy="80" r="${donutR}" fill="none" stroke="var(--b, #e2e8f0)" stroke-width="16"/>
                <!-- Segment Arcs -->
                ${donutArcs.map(a => `
                  <circle cx="80" cy="80" r="${donutR}" fill="none" stroke="${a.color}" stroke-width="16" stroke-dasharray="${a.strokeDasharray}" stroke-dashoffset="${a.strokeDashoffset}" stroke-linecap="round" style="transition:stroke-dashoffset 0.8s ease"/>
                `).join('')}
              </svg>
              <div class="donut-center-info">
                <b>${top3Total}</b>
                <small>Top Learners</small>
              </div>
            </div>
            <div class="donut-course-list">
              ${donutArcs.map(a => `
                <div class="donut-course-item">
                  <div class="task-left">
                    <span class="pill-badge" style="font-weight:700;font-size:11px;background:${a.color}20;color:${a.color}">#${a.rank}</span>
                    <div class="task-info">
                      <div style="display:flex;align-items:center;gap:6px">
                        <b>${E(a.course.name)}</b>
                        <span class="pill-badge" style="background:${a.color}20;color:${a.color};padding:2px 7px;font-size:10.5px">${a.medal}</span>
                      </div>
                      <small>${E(a.course.instr)} · ${a.course.lessonsCount} lessons</small>
                    </div>
                  </div>
                  <div style="text-align:right">
                    <b style="font-size:14px;color:var(--ink, #0f172a)">${a.course.enrolled} Students</b>
                    <small style="display:block;font-size:11px;color:${a.color};font-weight:600">${a.pct}% share</small>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Main Analytics Row 3: Content Library & Digital Repository (Pie Chart Visualization) -->
      <div class="content-lib-card">
        <div class="dash-card-header" style="margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:14px">
            <div style="width:44px;height:44px;border-radius:12px;background:#f0f9ff;border:1.5px solid #bae6fd;display:grid;place-items:center;color:#0284c7;flex-shrink:0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <div>
              <div class="dash-card-title">Content Library & Digital Repository</div>
              <div class="dash-card-sub">Centralized repository for video lectures, mock test series, study notes and question banks</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span class="pill-badge pill-blue" style="font-size:11.5px;padding:6px 14px;font-weight:600;display:inline-flex;align-items:center;gap:6px">${ico('cloud')} ${totalStorageUsed} / ${totalStorageCap} (${storagePct}%)</span>
            <button class="b2" onclick="toast('Opening Content Asset Uploader...')">+ Upload Resource</button>
          </div>
        </div>

        <!-- Horizontal Multi-color Distribution Bar -->
        <div style="display:flex;height:8px;border-radius:99px;overflow:hidden;margin:14px 0 22px;background:#f1f5f9;box-shadow:inset 0 1px 2px rgba(0,0,0,0.06)">
          <div style="width:46%;background:#0284c7" title="Video Lectures: 46%"></div>
          <div style="width:27%;background:#10b981" title="Study Notes: 27%"></div>
          <div style="width:17%;background:#8b5cf6" title="Practice Papers: 17%"></div>
          <div style="width:10%;background:#f59e0b" title="Curated MCQs: 10%"></div>
        </div>

        <!-- Content Library Pie Chart & Breakdown Cards Layout -->
        <div class="content-pie-layout">
          <!-- Left: SVG Pie Chart with Sector Percentages and Interactive Legend -->
          <div class="content-pie-chart-wrap">
            <svg viewBox="0 0 220 220" class="pie-svg">
              <defs>
                <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.12"/>
                </filter>
              </defs>
              <!-- Slices -->
              ${contentPieSlices.map(s => `
                <path class="pie-slice" d="${s.pathD}" fill="${s.color}" stroke="var(--card, #ffffff)" stroke-width="2.5" filter="url(#pieShadow)">
                  <title>${s.label}: ${s.pct}% (${s.storage} · ${s.count})</title>
                </path>
                <text x="${s.lx}" y="${s.ly}" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-size="11.5" font-weight="700" pointer-events="none" style="text-shadow:0 1px 3px rgba(0,0,0,0.5)">${s.pct}%</text>
              `).join('')}
            </svg>

            <!-- Legend below the pie chart -->
            <div class="pie-legend">
              ${contentPieSlices.map(s => `
                <div class="pie-legend-item" title="${s.label}: ${s.storage}">
                  <span class="pie-legend-dot" style="background:${s.color}"></span>
                  <span><b>${s.pct}%</b> ${s.label.split(' ')[0]}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: 4 Resource Cards Grid -->
          <div class="content-res-grid">
            <div class="content-res-item" style="cursor:pointer" onclick="toast('Navigating to Video Lectures...')">
              <div class="content-res-ico" style="background:#e0f2fe;color:#0284c7">${ico('video')}</div>
              <div style="flex:1">
                <b style="font-size:13.5px;color:var(--ink);display:block">142 Modules</b>
                <small style="color:var(--mute);font-size:11.5px;display:block">Video Lectures</small>
                <span style="font-size:11px;color:#0284c7;font-weight:600">42.5 GB · 46% share</span>
              </div>
            </div>

            <div class="content-res-item" style="cursor:pointer" onclick="toast('Navigating to Study Notes & PDFs...')">
              <div class="content-res-ico" style="background:#dcfce7;color:#16a34a">${ico('file')}</div>
              <div style="flex:1">
                <b style="font-size:13.5px;color:var(--ink);display:block">320 PDFs</b>
                <small style="color:var(--mute);font-size:11.5px;display:block">Study Notes & Handouts</small>
                <span style="font-size:11px;color:#16a34a;font-weight:600">24.8 GB · 27% share</span>
              </div>
            </div>

            <div class="content-res-item" style="cursor:pointer" onclick="go('tests')">
              <div class="content-res-ico" style="background:#f3e8ff;color:#9333ea">${ico('tests')}</div>
              <div style="flex:1">
                <b style="font-size:13.5px;color:var(--ink);display:block">48 Sets</b>
                <small style="color:var(--mute);font-size:11.5px;display:block">Practice Test Papers</small>
                <span style="font-size:11px;color:#9333ea;font-weight:600">14.2 GB · 17% share</span>
              </div>
            </div>

            <div class="content-res-item" style="cursor:pointer" onclick="toast('Opening MCQ Question Bank Master...')">
              <div class="content-res-ico" style="background:#fef3c7;color:#d97706">${ico('lightbulb')}</div>
              <div style="flex:1">
                <b style="font-size:13.5px;color:var(--ink);display:block">6,400+ MCQs</b>
                <small style="color:var(--mute);font-size:11.5px;display:block">Curated Question Banks</small>
                <span style="font-size:11px;color:#d97706;font-weight:600">9.1 GB · 10% share</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Analytics Row 4: Recent Student Admissions & Recent Activity Log (BELOW Content Library) -->
      <div class="dash-row">
        <!-- Recent Student Admissions -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Recent Student Admissions</div>
              <div class="dash-card-sub">Latest candidate registrations & batch allotments</div>
            </div>
            <button class="b2" onclick="go('students')">View all</button>
          </div>
          <div class="task-list">
            ${al.slice(0, 4).map(s => `
              <div class="task-item">
                <div class="task-left">
                  <div class="avt">${E(s.name.split(' ').map(x => x[0]).join('').slice(0, 2))}</div>
                  <div class="task-info">
                    <b>${E(s.name)}</b>
                    <small>${E(s.email)} · ${s.courses.length} courses enrolled</small>
                  </div>
                </div>
                <button class="b2" style="padding:4px 9px" onclick="cpop('${s.id}')">Courses</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recent Activity Log -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Recent Activity Log</div>
              <div class="dash-card-sub">Administrative audit trail & system operations</div>
            </div>
            <button class="b2" onclick="toast('Refreshing activity feed...')">Refresh</button>
          </div>
          <div class="act-feed">
            <div class="act-item">
              <div class="act-left">
                <div class="act-ico">${ico('up')}</div>
                <div>
                  <b style="font-size:13px;color:var(--ink);display:block">Bulk CSV Admission Processed</b>
                  <small style="font-size:11.5px;color:var(--mute)">42 learners imported into Delhi & Noida batches</small>
                </div>
              </div>
              <span style="font-size:11px;color:var(--mute)">10m ago</span>
            </div>
            <div class="act-item">
              <div class="act-left">
                <div class="act-ico">${ico('tests')}</div>
                <div>
                  <b style="font-size:13px;color:var(--ink);display:block">New Test Paper Published</b>
                  <small style="font-size:11.5px;color:var(--mute)">Physics Mechanics Quick Quiz by Dr. Meera</small>
                </div>
              </div>
              <span style="font-size:11px;color:var(--mute)">45m ago</span>
            </div>
            <div class="act-item">
              <div class="act-left">
                <div class="act-ico">${ico('admins')}</div>
                <div>
                  <b style="font-size:13px;color:var(--ink);display:block">Team Role Assignment Updated</b>
                  <small style="font-size:11.5px;color:var(--mute)">Meera Iyer assigned dual Administrator + Instructor role</small>
                </div>
              </div>
              <span style="font-size:11px;color:var(--mute)">2h ago</span>
            </div>
            <div class="act-item">
              <div class="act-left">
                <div class="act-ico">${ico('video')}</div>
                <div>
                  <b style="font-size:13px;color:var(--ink);display:block">Live Webinar Session Completed</b>
                  <small style="font-size:11.5px;color:var(--mute)">NEET Organic Chemistry live broadcast (88 attended)</small>
                </div>
              </div>
              <span style="font-size:11px;color:var(--mute)">4h ago</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* 3. INSTRUCTOR DASHBOARD */
  dashInstructor() {
    const myCourses = crs();
    const myStudents = stu();
    const myTests = D.tests.filter(t => myCourses.some(c => c.id === t.course));
    const period = S.chartPeriod || 'weekly';

    const chartData = {
      daily: { labels: ['9 AM', '11 AM', '2 PM', '4 PM', '6 PM'], hours: [1, 2, 0, 1.5, 2], best: '11 AM · Live JEE Session' },
      weekly: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], hours: [3.5, 4, 5.5, 4, 3, 2], best: 'Wed · 5.5 Hours Taught' },
      monthly: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], hours: [18, 22, 26, 21], best: 'Week 3 · 26 Teaching Hours' }
    }[period];

    const maxH = Math.max(...chartData.hours);

    return `
      <div class="dash-head">
        <div>
          <h1>Faculty Portal</h1>
          <p>Teaching schedule, live class delivery, curriculum and evaluation</p>
        </div>
        <div class="dash-actions">
          <button class="b2" onclick="et()">+ Create Test</button>
          <button class="b1" onclick="toast('Scheduling live webinar room...')">+ Schedule Live Class</button>
        </div>
      </div>

      <!-- Quick Action Cards -->
      <div class="qa-grid">
        <div class="qa-card qa-blue" onclick="toast('Opening live lecture broadcaster...')">
          <div class="qa-top"><div class="qa-ico">${ico('video')}</div><div class="qa-arrow">↗</div></div>
          <div><b>Go Live Now</b><small>Stream live video session</small></div>
        </div>
        <div class="qa-card qa-purple" onclick="et()">
          <div class="qa-top"><div class="qa-ico">${ico('tests')}</div><div class="qa-arrow">↗</div></div>
          <div><b>Draft Mock Quiz</b><small>Create multiple choice test</small></div>
        </div>
        <div class="qa-card qa-pink" onclick="toast('Opening curriculum resource uploader...')">
          <div class="qa-top"><div class="qa-ico">${ico('file')}</div><div class="qa-arrow">↗</div></div>
          <div><b>Upload Notes / PDF</b><small>Add study handouts</small></div>
        </div>
        <div class="qa-card qa-amber" onclick="go('students')">
          <div class="qa-top"><div class="qa-ico">${ico('students')}</div><div class="qa-arrow">↗</div></div>
          <div><b>Learner Progress</b><small>Review student test scores</small></div>
        </div>
      </div>

      <!-- Stat Metric Cards -->
      <div class="metric-grid">
        ${renderKpiCard({ title: 'Assigned Courses', value: myCourses.length, trend: '↑ Active', sub: 'in my portfolio', icon: 'courses', link: 'courses', variant: 0 })}
        ${renderKpiCard({ title: 'Enrolled Students', value: myStudents.length, trend: '↑ +12%', sub: 'under guidance', icon: 'students', link: 'students', variant: 1 })}
        ${renderKpiCard({ title: 'Evaluated Quizzes', value: myTests.length, trend: '↑ Live', sub: 'scheduled', icon: 'tests', link: 'tests', variant: 2 })}
        ${renderKpiCard({ title: 'Avg. Student Score', value: 86, suffix: '%', trend: '↑ Top Tier', sub: 'cohort rating', icon: 'award', link: 'tests', variant: 3 })}
      </div>

      <!-- Main Analytics Row -->
      <div class="dash-row">
        <!-- Teaching Hours Chart -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Teaching Hours & Classroom Delivery</div>
              <div class="dash-card-sub">Lecture and doubt-clearing sessions completed</div>
            </div>
            <div class="period-tabs">
              <button class="period-btn ${period === 'daily' ? 'active' : ''}" onclick="switchChartPeriod('daily')">Daily</button>
              <button class="period-btn ${period === 'weekly' ? 'active' : ''}" onclick="switchChartPeriod('weekly')">Weekly</button>
              <button class="period-btn ${period === 'monthly' ? 'active' : ''}" onclick="switchChartPeriod('monthly')">Monthly</button>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-tooltip">${chartData.best}</div>
            <svg viewBox="0 0 540 180" style="width:100%;height:180px;overflow:visible">
              <defs>
                <linearGradient id="instrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#9333ea"/>
                  <stop offset="100%" stop-color="#e9d5ff"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="540" y2="40" stroke="#f1f5f9" stroke-dasharray="4"/>
              <line x1="0" y1="90" x2="540" y2="90" stroke="#f1f5f9" stroke-dasharray="4"/>
              <line x1="0" y1="140" x2="540" y2="140" stroke="#f1f5f9" stroke-dasharray="4"/>
              <line x1="0" y1="160" x2="540" y2="160" stroke="#e2e8f0"/>
              ${chartData.labels.map((l, i) => {
                const count = chartData.labels.length;
                const slotW = 540 / count;
                const barW = Math.min(36, slotW * 0.45);
                const x = i * slotW + (slotW - barW) / 2;
                const h = Math.max(14, (chartData.hours[i] / maxH) * 120);
                const y = 160 - h;
                return `
                  <rect class="svg-bar" x="${x}" y="${y}" width="${barW}" height="${h}" rx="6" fill="url(#instrGrad)"/>
                  <text x="${x + barW / 2}" y="176" text-anchor="middle" font-size="11" fill="#64748b" font-family="Poppins">${l}</text>
                `;
              }).join('')}
            </svg>
          </div>
        </div>

        <!-- Upcoming Live Lectures -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Live Class Schedule</div>
              <div class="dash-card-sub">Next scheduled webinars</div>
            </div>
          </div>
          <div class="task-list">
            <div class="task-item">
              <div class="task-left">
                <div class="task-ico">${ico('video')}</div>
                <div class="task-info">
                  <b>Newton's Laws Problem Solving</b>
                  <small>Tomorrow, 5:00 PM · 45 Students</small>
                </div>
              </div>
              <button class="b1" style="padding:4px 10px;font-size:11px" onclick="toast('Starting live lecture room...')">Start</button>
            </div>
            <div class="task-item">
              <div class="task-left">
                <div class="task-ico">${ico('video')}</div>
                <div class="task-info">
                  <b>Weekly Doubt Clearance Session</b>
                  <small>Friday, 6:30 PM · Open Batch</small>
                </div>
              </div>
              <span class="pill-badge pill-amber">Scheduled</span>
            </div>
            <div class="task-item">
              <div class="task-left">
                <div class="task-ico">${ico('video')}</div>
                <div class="task-info">
                  <b>Kinematics Masterclass</b>
                  <small>Recorded · 42 views</small>
                </div>
              </div>
              <span class="pill-badge pill-green">Done</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Course Progress & Reviews -->
      <div class="dash-row">
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Curriculum Completion Ratio</div>
              <div class="dash-card-sub">Syllabus delivery across active batches</div>
            </div>
          </div>
          <div class="gauge-box">
            <svg class="gauge-svg" viewBox="0 0 200 110">
              <path class="gauge-bg" d="M 20 100 A 80 80 0 0 1 180 100" />
              <path class="gauge-val" d="M 20 100 A 80 80 0 0 1 180 100" stroke="#9333ea" stroke-dasharray="251.2" stroke-dashoffset="45" />
            </svg>
            <div class="gauge-center-text">
              <b class="stat-counter" data-target="82" data-suffix="%">82%</b>
              <small>Syllabus Covered</small>
            </div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-item"><span class="breakdown-sq" style="background:#9333ea"></span><span><b>14</b> Completed Lessons</span></div>
            <div class="breakdown-item"><span class="breakdown-sq" style="background:#f1f5f9"></span><span><b>3</b> Upcoming Lessons</span></div>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">My Assigned Courses</div>
              <div class="dash-card-sub">Active course cards</div>
            </div>
          </div>
          <div class="task-list">
            ${myCourses.map(c => `
              <div class="task-item">
                <div class="task-left">
                  <div class="task-ico">${ico('courses')}</div>
                  <div class="task-info">
                    <b>${E(c.name)}</b>
                    <small>${c.lessons.length} lessons · ${c.code}</small>
                  </div>
                </div>
                <button class="b2" onclick="oc('${c.id}')">Open</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /* 4. STUDENT DASHBOARD */
  dashStudent() {
    const u = me();
    const myCourses = crs();
    const completedTests = D.res.filter(r => r.sid === S.uid);
    const avgScore = completedTests.length ? Math.round((completedTests.reduce((a, b) => a + b.score, 0) / (completedTests.length * 3)) * 100) : 85;
    const period = S.chartPeriod || 'weekly';

    const chartData = {
      daily: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], hours: [2.5, 3.0, 4.5, 2.0, 3.5, 5.0, 4.0], best: 'Sat · 5.0 Hours Studied' },
      weekly: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], hours: [14, 18, 22, 19], best: 'Week 3 · 22 Hours Studied' },
      monthly: { labels: ['Dec', 'Jan', 'Feb'], hours: [65, 82, 94], best: 'Feb · 94 Hours Studied' }
    }[period];

    const maxH = Math.max(...chartData.hours);

    return `
      <!-- Greeting Banner -->
      <div class="student-banner">
        <div>
          <h2>Welcome back, ${E(u.name)}!</h2>
          <p>You have completed 78% of your weekly study goal. Keep up the 5-day learning streak!</p>
        </div>
        <button class="b1" style="background:#fff;color:#0f172a;border-color:#fff" onclick="${myCourses.length ? `oc('${myCourses[0].id}')` : `toast('No enrolled courses')`}">Resume Learning</button>
      </div>

      <!-- Quick Action Cards -->
      <div class="qa-grid">
        <div class="qa-card qa-blue" onclick="${myCourses.length ? `oc('${myCourses[0].id}')` : `toast('No courses')`}">
          <div class="qa-top"><div class="qa-ico">${ico('courses')}</div><div class="qa-arrow">↗</div></div>
          <div><b>Continue Learning</b><small>Resume next lesson</small></div>
        </div>
        <div class="qa-card qa-purple" onclick="go('tests')">
          <div class="qa-top"><div class="qa-ico">${ico('tests')}</div><div class="qa-arrow">↗</div></div>
          <div><b>Take Mock Quiz</b><small>Practice test questions</small></div>
        </div>
        <div class="qa-card qa-pink" onclick="${myCourses.length ? `oc('${myCourses[0].id}');sct('Notes')` : `toast('No notes')`}">
          <div class="qa-top"><div class="qa-ico">${ico('file')}</div><div class="qa-arrow">↗</div></div>
          <div><b>Study Handouts</b><small>Download formulas & PDFs</small></div>
        </div>
        <div class="qa-card qa-amber" onclick="go('fin')">
          <div class="qa-top"><div class="qa-ico">${ico('fin')}</div><div class="qa-arrow">↗</div></div>
          <div><b>Fee Receipts</b><small>Check invoice status</small></div>
        </div>
      </div>

      <!-- Stat Metric Cards -->
      <div class="metric-grid">
        ${renderKpiCard({ title: 'Enrolled Programs', value: myCourses.length, trend: '↑ Active', sub: 'curriculum access', icon: 'courses', link: 'courses', variant: 0 })}
        ${renderKpiCard({ title: 'Learning Hours', value: 24, suffix: ' hrs', trend: '5-day', sub: 'study streak', icon: 'video', variant: 1 })}
        ${renderKpiCard({ title: 'Tests Completed', value: completedTests.length, trend: '↑ Passed', sub: 'evaluated quizzes', icon: 'tests', link: 'tests', variant: 2 })}
        ${renderKpiCard({ title: 'Average Accuracy', value: avgScore, suffix: '%', trend: '↑ Top 10%', sub: 'class rank #4', icon: 'award', variant: 3 })}
      </div>

      <!-- Main Analytics Row -->
      <div class="dash-row">
        <!-- Study Time Chart -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Study Time Breakdown</div>
              <div class="dash-card-sub">Hours dedicated to lessons and quizzes</div>
            </div>
            <div class="period-tabs">
              <button class="period-btn ${period === 'daily' ? 'active' : ''}" onclick="switchChartPeriod('daily')">Daily</button>
              <button class="period-btn ${period === 'weekly' ? 'active' : ''}" onclick="switchChartPeriod('weekly')">Weekly</button>
              <button class="period-btn ${period === 'monthly' ? 'active' : ''}" onclick="switchChartPeriod('monthly')">Monthly</button>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-tooltip">Best: ${chartData.best}</div>
            <svg viewBox="0 0 540 180" style="width:100%;height:180px;overflow:visible">
              <defs>
                <linearGradient id="stuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0284c7"/>
                  <stop offset="100%" stop-color="#e0f2fe"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="540" y2="40" stroke="#f1f5f9" stroke-dasharray="4"/>
              <line x1="0" y1="90" x2="540" y2="90" stroke="#f1f5f9" stroke-dasharray="4"/>
              <line x1="0" y1="140" x2="540" y2="140" stroke="#f1f5f9" stroke-dasharray="4"/>
              <line x1="0" y1="160" x2="540" y2="160" stroke="#e2e8f0"/>
              ${chartData.labels.map((l, i) => {
                const count = chartData.labels.length;
                const slotW = 540 / count;
                const barW = Math.min(36, slotW * 0.45);
                const x = i * slotW + (slotW - barW) / 2;
                const h = Math.max(14, (chartData.hours[i] / maxH) * 120);
                const y = 160 - h;
                return `
                  <rect class="svg-bar" x="${x}" y="${y}" width="${barW}" height="${h}" rx="6" fill="url(#stuGrad)"/>
                  <text x="${x + barW / 2}" y="176" text-anchor="middle" font-size="11" fill="#64748b" font-family="Poppins">${l}</text>
                `;
              }).join('')}
            </svg>
          </div>
        </div>

        <!-- My Courses -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Enrolled Courses</div>
              <div class="dash-card-sub">Your active curriculums</div>
            </div>
            <button class="b2" onclick="go('courses')">View all</button>
          </div>
          <div class="task-list">
            ${myCourses.map(c => `
              <div class="task-item">
                <div class="task-left">
                  <div class="task-ico">${ico('courses')}</div>
                  <div class="task-info">
                    <b>${E(c.name)}</b>
                    <small>${pct(S.uid, c)}% complete · ${c.lessons.length} lessons</small>
                  </div>
                </div>
                <button class="b1" style="padding:4px 10px;font-size:11px" onclick="oc('${c.id}')">Continue</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Bottom Row: Speedometer Breakdown & Upcoming Deadlines -->
      <div class="dash-row">
        <!-- Assignment & Syllabus Progress Gauge (Image 1 style) -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Syllabus Completion & Readiness</div>
              <div class="dash-card-sub">Preparedness for upcoming exam</div>
            </div>
          </div>
          <div class="gauge-box">
            <svg class="gauge-svg" viewBox="0 0 200 110">
              <path class="gauge-bg" d="M 20 100 A 80 80 0 0 1 180 100" />
              <path class="gauge-val" d="M 20 100 A 80 80 0 0 1 180 100" stroke="#0284c7" stroke-dasharray="251.2" stroke-dashoffset="62" />
            </svg>
            <div class="gauge-center-text">
              <b class="stat-counter" data-target="76" data-suffix="%">76%</b>
              <small>Exam Ready</small>
            </div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-item"><span class="breakdown-sq" style="background:#0284c7"></span><span><b>12</b> Submitted Works</span></div>
            <div class="breakdown-item"><span class="breakdown-sq" style="background:#10b981"></span><span><b>8</b> Graded Tests</span></div>
            <div class="breakdown-item"><span class="breakdown-sq" style="background:#f59e0b"></span><span><b>2</b> Pending Quizzes</span></div>
            <div class="breakdown-item"><span class="breakdown-sq" style="background:#64748b"></span><span><b>14</b> Live Classes</span></div>
          </div>
        </div>

        <!-- Deadlines / Upcoming -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Upcoming Tasks & Deadlines</div>
              <div class="dash-card-sub">Scheduled milestones</div>
            </div>
          </div>
          <div class="task-list">
            <div class="task-item">
              <div class="task-left">
                <div class="task-ico">${ico('tests')}</div>
                <div class="task-info">
                  <b>Physics Mechanics Quick Quiz</b>
                  <small>Due in 2 days · 10 mins</small>
                </div>
              </div>
              <button class="b1" style="padding:4px 9px" onclick="tk('t1')">Start</button>
            </div>
            <div class="task-item">
              <div class="task-left">
                <div class="task-ico">${ico('video')}</div>
                <div class="task-info">
                  <b>Newton's Laws Problem Solving</b>
                  <small>Live Webinar · Tomorrow 5:00 PM</small>
                </div>
              </div>
              <span class="pill-badge pill-amber">Live</span>
            </div>
            <div class="task-item">
              <div class="task-left">
                <div class="task-ico">${ico('file')}</div>
                <div class="task-info">
                  <b>Organic Chemistry Revision Sheet</b>
                  <small>PDF Handout uploaded</small>
                </div>
              </div>
              <span class="pill-badge pill-green">Available</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* OTHER PAGES */
  centers() {
    if (!hasC()) return '<div class=em>Centers are not available in Online-only mode.</div>';
    return (
      hd('Centers', 'Manage your institute’s physical branches.', '<button class=b1 onclick=ec()>+ Add center</button>') +
      tb(
        [
          ['Center', c => `<b>${E(c.name)}</b> <small>${c.code}</small>`],
          ['City', c => E(c.city)],
          ['Students', c => D.users.filter(u => u.role === 'student' && u.centers[0] === c.id).length],
          ['Collected', c => R(sum(D.inv.filter(i => i.center === c.id), 'paid'))],
          ['Status', c => st(c.status)]
        ],
        D.centers,
        c => tblDots('center', c.id)
      )
    );
  },

  team() {
    const isOwner = me().role === 'owner';
    const filter = S.teamFilter || 'all';

    // Get all team members: instructors, administrators, owners (excluding pure student accounts)
    const allStaff = D.users.filter(u => {
      const roles = uRoles(u);
      return (roles.some(x => ['owner', 'admin', 'instructor'].includes(x)) || u.role !== 'student') && u.role !== 'student';
    }).filter(u => isOwner || !hasC() || (u.centers && u.centers.some(c => cs().includes(c))) || u.role === 'owner');

    const totalStaff = allStaff.length;
    const adminCount = allStaff.filter(u => uRoles(u).includes('admin') || u.role === 'admin').length;
    const instrCount = allStaff.filter(u => uRoles(u).includes('instructor') || u.role === 'instructor').length;
    const dualCount = allStaff.filter(u => {
      const roles = uRoles(u);
      return roles.includes('admin') && roles.includes('instructor');
    }).length;

    // Filter based on active tab
    let displayList = allStaff;
    if (filter === 'admin') displayList = allStaff.filter(u => uRoles(u).includes('admin') || u.role === 'admin');
    else if (filter === 'instructor') displayList = allStaff.filter(u => uRoles(u).includes('instructor') || u.role === 'instructor');
    else if (filter === 'dual') displayList = allStaff.filter(u => uRoles(u).includes('admin') && uRoles(u).includes('instructor'));

    const cols = [
      [
        'Member Name',
        u => `
          <div class="stu-cell">
            <img class="s-img" src="${av(u)}" alt="${E(u.name)}">
            <div class="stu-meta">
              <b class="stu-name">${E(u.name)}</b>
              <span class="stu-sub">${u.id === 'u1' ? 'Founder & Principal' : (hasC() ? (u.centers && u.centers.length ? E(cl(u.centers)) : 'All Branches') : 'Online Faculty')}</span>
            </div>
          </div>
        `
      ],
      [
        'Teaching Subject',
        u => (u.subject || uRoles(u).includes('instructor') || u.role === 'admin' || uRoles(u).includes('admin'))
          ? `<span class="pill-badge pill-blue" style="font-size:11.5px;font-weight:600;display:inline-flex;align-items:center;gap:4px">${E(u.subject || 'Physics')}</span>`
          : `<span style="color:var(--mute);font-size:12px">—</span>`
      ],
      ['Email', u => `<span class="stu-email">${E(u.email)}</span>`],
      ['Mobile', u => `<span class="stu-phone">${E(u.phone || '98' + String(10000000 + u.id.charCodeAt(0) * 89234).slice(0, 8))}</span>`],
      [
        'Assigned Role(s)',
        u => {
          const roles = uRoles(u);
          const isDual = roles.includes('admin') && roles.includes('instructor');
          return `
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              ${roles.map(rl => {
                if (rl === 'owner') return `<span class="pill-badge" style="background:#0f172a;color:#fff;font-weight:600">Owner</span>`;
                if (rl === 'admin') return `<span class="pill-badge pill-purple" style="font-weight:600">Administrator</span>`;
                if (rl === 'instructor') return `<span class="pill-badge pill-blue" style="font-weight:600">Instructor</span>`;
                return `<span class="pill-badge pill-amber">${E(rl)}</span>`;
              }).join('')}
              ${isDual ? `<span class="pill-badge pill-green" style="font-size:10px;font-weight:700">Dual Role</span>` : ''}
            </div>
          `;
        }
      ],
      hasC() ? ['Centers', u => `<span class="stu-date">${u.centers && u.centers.length ? E(cl(u.centers)) : '<span class="st gn">All Branches</span>'}</span>`] : null,
      ['Reg. Date', u => `<span class="stu-date">${E(u.regDate || sRegDate(u))}</span>`],
      ['Status', u => st(u.status)]
    ].filter(Boolean);

    return (
      hd(
        'Manage Team',
        'Unified staff & faculty directory. Assign and configure combined administrative and instructor roles, permissions and branch coverage.',
        can() ? `<button class="b1" onclick="openAddTeamMemberModal()">+ Add Team Member</button>` : ''
      ) +
      `<div class="metric-grid">
        ${renderKpiCard({ title: 'Total Team Members', value: totalStaff, trend: '↑ Staff', sub: 'active personnel', icon: 'team', variant: 0 })}
        ${renderKpiCard({ title: 'Administrators', value: adminCount, trend: '↑ Operations', sub: 'center managers', icon: 'admins', variant: 1 })}
        ${renderKpiCard({ title: 'Instructors', value: instrCount, trend: '↑ Faculty', sub: 'teaching staff', icon: 'instrs', variant: 2 })}
        ${renderKpiCard({ title: 'Dual-Role Staff', value: dualCount, trend: 'Combined', sub: 'admin + instructor', icon: 'award', variant: 3 })}
      </div>` +
      `<div class="team-filter-bar" style="display:flex;gap:6px;margin:16px 0 14px;flex-wrap:wrap">
        <button class="b2 ${filter === 'all' ? 'on' : ''}" style="${filter === 'all' ? 'background:#0f172a;color:#fff;border-color:#0f172a;font-weight:600' : ''}" onclick="S.teamFilter='all';S.pg=0;rp()">All Members (${totalStaff})</button>
        <button class="b2 ${filter === 'admin' ? 'on' : ''}" style="${filter === 'admin' ? 'background:#0f172a;color:#fff;border-color:#0f172a;font-weight:600' : ''}" onclick="S.teamFilter='admin';S.pg=0;rp()">Administrators (${adminCount})</button>
        <button class="b2 ${filter === 'instructor' ? 'on' : ''}" style="${filter === 'instructor' ? 'background:#0f172a;color:#fff;border-color:#0f172a;font-weight:600' : ''}" onclick="S.teamFilter='instructor';S.pg=0;rp()">Instructors (${instrCount})</button>
        <button class="b2 ${filter === 'dual' ? 'on' : ''}" style="${filter === 'dual' ? 'background:#0f172a;color:#fff;border-color:#0f172a;font-weight:600' : ''}" onclick="S.teamFilter='dual';S.pg=0;rp()">Dual Role (${dualCount})</button>
      </div>` +
      tb(
        cols,
        displayList,
        can() ? u => tblDots('team', u.id) : null,
        10
      )
    );
  },

  admins() {
    return ppl('admin', 'Administrators', 'Invite and manage center administrators.');
  },

  instrs() {
    const list = D.users.filter(u => (u.role === 'instructor' || (u.roles && u.roles.includes('instructor'))) && (me().role === 'owner' || !hasC() || u.centers.some(c => cs().includes(c))));
    return (
      hd('Instructors', 'Teaching faculty, subject assignments and profiles.', can() ? `<button class="b1" onclick="iv('instructor')">+ Invite Instructor</button>` : '') +
      `<div class="metric-grid">
        ${renderKpiCard({ title: 'Total Faculty', value: list.length, trend: '↑ +10%', sub: 'vs. last month', icon: 'instrs', variant: 0 })}
        ${renderKpiCard({ title: 'Active Instructors', value: list.filter(t => t.status === 'Active').length, trend: '↑ 100%', sub: 'active', icon: 'award', variant: 1 })}
        ${renderKpiCard({ title: hasC() ? 'Multi-Center' : 'Online Faculty', value: hasC() ? list.filter(t => t.centers && t.centers.length > 1).length : list.length, trend: '↑ Assigned', sub: 'coverage', icon: 'centers', variant: 2 })}
      </div>` +
      tb(
        [
          [
            'Teacher Name',
            t => `
              <div class="stu-cell">
                <img class="s-img" src="${av(t)}" alt="${E(t.name)}">
                <div class="stu-meta">
                  <b class="stu-name">${E(t.name)}</b>
                  <span class="stu-sub">${hasC() ? E(cl(t.centers)) : '<span class="st gn">Online Faculty</span>'}</span>
                </div>
              </div>
            `
          ],
          [
            'Subject',
            t => `<span class="pill-badge pill-blue" style="font-weight:600;font-size:12px;display:inline-flex;align-items:center;gap:4px">${E(t.subject || 'Physics')}</span>`
          ],
          ['Email', t => `<span class="stu-email">${E(t.email)}</span>`],
          ['Mobile', t => `<span class="stu-phone">${E(t.phone || '98' + String(10000000 + t.id.charCodeAt(0) * 89234).slice(0, 8))}</span>`],
          ['Reg. Date', t => `<span class="stu-date">${E(t.regDate || sRegDate(t))}</span>`],
          ['Status', t => st(t.status)]
        ],
        list,
        can() ? t => tblDots('instructor', t.id) : null,
        10
      )
    );
  },

  students() {
    const al = stu();
    const cols = [
      ['Student', s => `<div class=pc><span class=avt>${E(s.name.split(' ').map(x => x[0]).join('').slice(0, 2))}</span><div><b>${E(s.name)}</b><small>${E(s.email)}</small></div></div>`],
      hasC() ? ['Center', s => (s.mode === 'Online' ? '<span class=mt>—</span> <span class="st">Online</span>' : E(cn(s.centers[0])))] : null,
      hasC() ? ['Batch', s => E((D.batches.find(b => b.id === s.batch) || {}).name || '—')] : null,
      ['Courses', s => `<button class=cbtn onclick="cpop('${s.id}')">${s.courses.length} course${s.courses.length == 1 ? '' : 's'}</button>`]
    ].filter(Boolean);

    return (
      hd('Students', me().role === 'instructor' ? 'Students in your courses.' : 'Manage learners across programs.', can() ? `<button class=b2 onclick=ci()>${ico('up')} Import CSV</button> <button class=b1 onclick=es()>+ Add student</button>` : '') +
      `<div class="metric-grid">
        ${renderKpiCard({ title: 'Total Students', value: al.length, trend: '↑ +12%', sub: 'vs. last month', icon: 'students', variant: 0 })}
        ${renderKpiCard({ title: 'Online Learners', value: al.filter(s => s.mode === 'Online').length || al.length, trend: '↑ +15%', sub: 'vs. last month', icon: 'file', variant: 1 })}
        ${renderKpiCard({ title: 'Active Enrollees', value: al.filter(s => s.courses.length > 0).length, trend: '↑ +8%', sub: 'vs. last month', icon: 'courses', variant: 2 })}
        ${renderKpiCard({ title: 'Without Batch', value: al.filter(s => !s.batch).length, trend: '↑ +2', sub: 'vs. last month', icon: 'batches', variant: 3 })}
      </div>` +
      tb(cols, al, can() ? s => tblDots('student', s.id) : null, 25)
    );
  },

  courses() {
    const r = me().role;
    if (S.cv) return cdet();
    if (r === 'student') {
      return (
        hd('My courses', 'Your enrolled courses.') +
        (crs().length
          ? '<div class=cg>' +
            crs()
              .map(
                c => `<div class="cd cc"><div class=cimw><img class=cim src="${cimg(c)}" alt="" loading=lazy></div><b>${E(c.name)}</b><small>${E(U(c.instr)?.name || 'Lead Teacher TBA')}</small><div class=bar2><i style="width:${pct(S.uid, c)}%"></i></div><small>${pct(S.uid, c)}% complete</small><button class=b1 onclick="oc('${c.id}')">Open course</button></div>`
              )
              .join('') +
            '</div>'
          : '<div class=em>You are not enrolled in any course yet.</div>')
      );
    }

    return (
      hd(r === 'instructor' ? 'My courses' : 'Courses', 'Courses available in your scope.', can() ? '<button class=b1 onclick=nw()>+ New course</button>' : '') +
      (crs().length
        ? `<div class=cg>${crs()
            .map(
              c =>
                `<div class="cd cc"><div class=cimw><img class=cim src="${cimg(c)}" alt="" loading=lazy>${st(c.status)}${hasC() ? `<span class=cmd>${E(c.mode || 'Both')}</span>` : ''}</div><div style="display:flex;justify-content:space-between;align-items:center"><small>${c.access}</small><small>${c.code}</small></div><b>${E(c.name)}</b>${hasC() ? `<small>${E(cl(c.centers))}</small>` : ''}<small>${c.access}${c.price ? ' · ' + R(c.price) : ''} · ${c.lessons.length} lessons · ${stu().filter(s => s.courses.includes(c.id)).length} students</small><div class=ac><button class=b1 onclick="oc('${c.id}')">Open</button>${can() ? `<button class=b2 onclick="pb('${c.id}')">${c.status === 'Published' ? 'Unpublish' : 'Publish'}</button>` : `<button class=b2 onclick="al('${c.id}')">Add lesson</button>`}</div></div>`
            )
            .join('')}</div>`
        : '<div class=em>No courses yet. Create your first course to get started.</div>')
    );
  },

  batches() {
    if (!hasC()) return '<div class=em>Batches are only active in multi-center operations.</div>';
    if (S.bv) return bdet();
    return (
      hd('Batches', 'Groups of students by center.', can() ? '<button class=b1 onclick=eb()>+ Add batch</button>' : '') +
      tb(
        [
          ['Batch', b => `<b>${E(b.name)}</b>`],
          ['Center', b => E(cn(b.center))],
          ['Courses', b => E(b.courses)],
          ['Students', b => `${D.users.filter(u => u.batch === b.id).length}/${b.cap}`]
        ],
        D.batches.filter(b => cs().includes(b.center)),
        b => tblDots('batch', b.id)
      )
    );
  },

  fin() {
    const r = me().role,
      iv = D.inv.filter(i => (r === 'student' ? i.sid === S.uid : inScope(i))),
      p = sum(iv, 'paid'),
      t = sum(iv, 'total');
    const cols = [
      ['Student', i => E(U(i.sid).name)],
      hasC() ? ['Center', i => E(cn(i.center))] : null,
      ['Total', i => R(i.total)],
      ['Paid', i => R(i.paid)],
      ['Balance', i => R(i.total - i.paid)],
      ['Status', i => st(i.paid >= i.total ? 'Paid' : i.paid ? 'Partial' : 'Unpaid')]
    ].filter(Boolean);

    return (
      hd(r === 'student' ? 'Payments' : 'Finances', 'Invoices, balances and payments (demo transactions).') +
      `<div class=metric-grid style="grid-template-columns:repeat(3,1fr);margin-bottom:18px">
        <div class=metric-card><div><div class="mc-val stat-counter" data-target="${t}" data-prefix="₹">₹${t.toLocaleString('en-IN')}</div><div class=mc-label>Total Invoiced</div></div></div>
        <div class=metric-card><div><div class="mc-val stat-counter" data-target="${p}" data-prefix="₹">₹${p.toLocaleString('en-IN')}</div><div class=mc-label>Collected</div></div></div>
        <div class=metric-card><div><div class="mc-val stat-counter" data-target="${t - p}" data-prefix="₹">₹${(t - p).toLocaleString('en-IN')}</div><div class=mc-label>Outstanding</div></div></div>
      </div>` +
      tb(cols, iv, i => tblDots('fin', i.id))
    );
  },

  invites() {
    const l = D.invites.filter(i => me().role === 'owner' || !hasC() || i.centers.some(c => cs().includes(c)));
    const cols = [
      ['Invitee', i => `${E(i.email)}`],
      ['Role', i => i.role],
      hasC() ? ['Centers', i => E(cl(i.centers))] : null,
      ['Sent', i => i.sent + '×'],
      ['Status', i => st(i.status)]
    ].filter(Boolean);

    return (
      hd('Invitations', 'Pending invitations and the demo outbox. No real email is sent.') +
      tb(
        cols,
        l,
        i => i.status === 'Pending' ? tblDots('invite', i.id) : ''
      ) +
      '<h2 style="margin-top:20px;font-size:16px;font-weight:600">Demo outbox</h2>' +
      (D.out.length
        ? mini(
            ['To', 'Subject', 'When', 'Link'],
            D.out.map(o => [E(o.to), E(o.sub), o.at, `<a onclick="navigator.clipboard&&navigator.clipboard.writeText('${o.link}');toast('Link copied')">Copy link</a>`])
          )
        : '<div class=em>No messages in outbox.</div>')
    );
  },

  packages() {
    const r = me().role;
    const tab = S.pkgTab || (r === 'student' ? 'store' : 'manage');
    const myPkgs = (D.myPackages && D.myPackages[S.uid]) ? D.myPackages[S.uid] : (r === 'student' ? ['pkg1', 'pkg3'] : []);
    const pkgsList = D.packages || DEFAULT_PACKAGES;

    if (r === 'student') {
      return (
        hd(
          'Test Series & Study Packages',
          'Explore specialized CBT test series, practice mock packages, study library and previous year exam papers.'
        ) +
        `<div class="tabs" style="display:flex;gap:6px;border-bottom:1px solid var(--b);margin-bottom:18px">
          <button class="b2 ${tab === 'store' ? 'on' : ''}" style="${tab === 'store' ? 'background:#0f172a;color:#fff;border-color:#0f172a;font-weight:600' : ''}" onclick="S.pkgTab='store';rp()">Browse Packages</button>
          <button class="b2 ${tab === 'library' ? 'on' : ''}" style="${tab === 'library' ? 'background:#0f172a;color:#fff;border-color:#0f172a;font-weight:600' : ''}" onclick="S.pkgTab='library';rp()">My Library (${myPkgs.length})</button>
          <button class="b2 ${tab === 'timetable' ? 'on' : ''}" style="${tab === 'timetable' ? 'background:#0f172a;color:#fff;border-color:#0f172a;font-weight:600' : ''}" onclick="S.pkgTab='timetable';rp()">Timetable & PYQs</button>
        </div>` +
        (tab === 'store'
          ? `
            <div class="pkg-grid">
              ${pkgsList.map(p => {
                const isOwned = myPkgs.includes(p.id);
                return `
                  <div class="pkg-card">
                    <div class="pkg-thumb">
                      <img class="pkg-thumb-img" src="${(window.getLivePackageImg && window.getLivePackageImg(p)) || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}" alt="${E(p.name)}" loading="lazy">
                      <div class="pkg-thumb-overlay"></div>
                      <div class="pkg-thumb-content">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start">
                          <span class="pill-badge" style="background:rgba(255,255,255,0.22);color:#fff;font-weight:600;font-size:11px">${p.category}</span>
                          <span style="font-size:12px;font-weight:700;background:#0f172a;padding:3px 8px;border-radius:12px;color:#facc15">Rating: ${p.rating} (${p.reviews})</span>
                        </div>
                        <b style="font-size:17px;line-height:1.3;text-shadow:0 1px 3px rgba(0,0,0,0.7);color:#fff">${E(p.name)}</b>
                      </div>
                    </div>
                    <div class="pkg-body">
                      <div>
                        <div class="pkg-meta">
                          <span><b>${p.testsCount} Full-Length CBT Tests</b></span>
                          <span><b>${p.notesCount} High-Yield PDFs & Notes</b></span>
                          <span>Validity: <b>${p.validity}</b></span>
                          <span><b>${p.enrolledStudents}</b> Candidates Enrolled</span>
                        </div>
                        <p style="font-size:12.5px;color:var(--mute);line-height:1.5;margin-bottom:14px">${E(p.description)}</p>
                      </div>
                      <div class="pkg-price-row">
                        <div>
                          <span style="font-size:11px;color:var(--mute);display:block">Full Package Access</span>
                          <span class="pkg-price">${p.price === 0 ? 'FREE' : R(p.price)}</span>
                        </div>
                        <div style="display:flex;gap:6px">
                          <button class="b2" style="font-size:12px;padding:6px 10px" onclick="viewPackageDetails('${p.id}')">Details</button>
                          ${isOwned
                            ? `<button class="b1" style="font-size:12px;padding:6px 12px;background:#16a34a;border-color:#16a34a" onclick="S.pkgTab='library';rp()">Enrolled</button>`
                            : p.price === 0
                            ? `<button class="b1" style="font-size:12px;padding:6px 12px" onclick="enrollFreePackage('${p.id}')">Enroll Free</button>`
                            : `<button class="b1" style="font-size:12px;padding:6px 12px" onclick="openPackageCheckout('${p.id}')">Buy Package</button>`
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `
          : tab === 'library'
          ? `
            <div style="margin-bottom:14px">
              <h2 style="font-size:16px;font-weight:700;color:var(--ink);margin-bottom:4px">Your Enrolled Packages</h2>
              <p style="font-size:12.5px;color:var(--mute)">Access all your active subscriptions, mock test series, and reference notes.</p>
            </div>
            ${myPkgs.length ? `
              <div class="pkg-grid">
                ${myPkgs.map(pid => {
                  const p = pkgsList.find(x => x.id === pid) || pkgsList[0];
                  return `
                    <div class="pkg-card" style="border-top:3px solid #0284c7">
                      <div class="pkg-body" style="padding-top:16px">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                          <span class="pill-badge pill-green">Active Subscription</span>
                          <span style="font-size:11.5px;color:var(--mute)">Validity: ${p.validity}</span>
                        </div>
                        <h3 style="font-size:16px;font-weight:700;margin-bottom:8px;color:var(--ink)">${E(p.name)}</h3>
                        <div class="pkg-meta" style="margin-bottom:16px">
                          <span><b>${p.testsCount} Mock Tests Included</b></span>
                          <span><b>${p.notesCount} Revision Handouts</b></span>
                        </div>
                        <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:10px 12px;margin-bottom:16px">
                          <b style="font-size:12px;display:block;margin-bottom:6px">Curated Included Material:</b>
                          ${(p.schedule || []).map(s => `
                            <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:4px 0">
                              <span>${s.type === 'Test' ? '[Test]' : '[PDF]'} ${E(s.title)}</span>
                              ${s.type === 'Test'
                                ? `<button class="b1" style="font-size:11px;padding:2px 8px" onclick="startOnlineTest('${s.testId || 't1'}')">Take Test</button>`
                                : `<button class="b2" style="font-size:11px;padding:2px 8px" onclick="toast('Downloading study PDF: ${E(s.title)}')">Download PDF</button>`}
                            </div>
                          `).join('')}
                        </div>
                        <div style="display:flex;gap:8px">
                          <button class="b1" style="flex:1" onclick="go('tests')">Launch Test Series</button>
                          <button class="b2" onclick="viewPackageDetails('${p.id}')">View All</button>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : '<div class="em">You haven’t enrolled in any test package yet. Visit the Browse tab to get started!</div>'}
          `
          : `
            <div style="margin-bottom:16px">
              <h2 style="font-size:16px;font-weight:700;color:var(--ink);margin-bottom:4px">Official Timetable & Previous Year Question Papers (PYQ)</h2>
              <p style="font-size:12.5px;color:var(--mute)">Download authentic past year examination papers, answer keys and scheduled master revision sessions.</p>
            </div>
            ${tb(
              [
                ['Document Title', d => `<b>${E(d.title)}</b><br><small style="color:var(--mute)">${d.size} · ${d.year}</small>`],
                ['Category', d => `<span class="pill-badge pill-blue">${d.cat}</span>`],
                ['Exam Target', d => d.target],
                ['Format', d => d.format],
                ['Release Date', d => d.date]
              ],
              [
                { title: 'JEE Advanced 2025 Paper 1 & Paper 2 with Official Solutions', size: '4.8 MB', year: '2025', cat: 'PYQ Paper', target: 'JEE Advanced', format: 'PDF', date: 'June 2025' },
                { title: 'NEET UG 2025 Question Paper with Complete Hindi/English Answer Key', size: '3.6 MB', year: '2025', cat: 'PYQ Paper', target: 'NEET UG', format: 'PDF', date: 'May 2025' },
                { title: 'Weekly Online Lecture & Live CBT Mock Test Schedule (Week 4)', size: '1.2 MB', year: '2026', cat: 'Timetable', target: 'All Batches', format: 'PDF', date: 'Updated Yesterday' },
                { title: 'Top 500 Physics Mechanics High-Yield Problems with Explanations', size: '6.2 MB', year: '2026', cat: 'Question Bank', target: 'JEE / NEET', format: 'PDF', date: '10 Feb 2026' }
              ],
              d => `<button class="b2" onclick="toast('Downloading ${E(d.title)}...')">Download PDF</button>`
            )}
          `
        )
      );
    }

    // Admin & Instructor view for Packages
    const totalRev = pkgsList.reduce((acc, p) => acc + (p.price * p.enrolledStudents), 0);
    const totalEnrolled = pkgsList.reduce((acc, p) => acc + p.enrolledStudents, 0);

    return (
      hd(
        'Package & Test Series Management',
        'Author test bundles, set pricing, assign promotional coupon codes and publish test series packages.',
        `<button class="b2" onclick="openCouponModal()">+ New Coupon</button> <button class="b1" onclick="typeof initNewPackageCreator === 'function' ? initNewPackageCreator() : openPackageWizard()">+ Create Package</button>`
      ) +
      `<div class="metric-grid">
        ${renderKpiCard({ title: 'Published Packages', value: pkgsList.length, trend: '↑ Live', sub: 'in online store', icon: 'packages', variant: 0 })}
        ${renderKpiCard({ title: 'Total Subscribers', value: totalEnrolled, trend: '↑ +18%', sub: 'vs. last month', icon: 'students', variant: 1 })}
        ${renderKpiCard({ title: 'Package Revenue', value: totalRev, prefix: '₹', trend: '↑ +24%', sub: 'gross collections', icon: 'fin', variant: 2 })}
        ${renderKpiCard({ title: 'Active Promo Coupons', value: (D.coupons || DEFAULT_COUPONS).length, trend: 'Active', sub: 'discounts', icon: 'award', variant: 3 })}
      </div>` +
      tb(
        [
          [
            'Package Name',
            p => `
              <b style="cursor:pointer;color:var(--p)" onclick="typeof openPackageInNewTab === 'function' && openPackageInNewTab('${p.id}')">${E(p.name)} ↗</b>
              <br><small style="color:var(--mute)">Target: ${p.category} · Rating: ${p.rating}</small>
            `
          ],
          ['Type', p => `<span class="pill-badge pill-purple" style="text-transform:capitalize">${p.type} Package</span>`],
          ['Tests Included', p => `<b>${p.testsCount} CBT Tests</b>`],
          ['Study Notes', p => `${p.notesCount} PDFs`],
          ['Price', p => p.price === 0 ? '<span class="st gn">Free</span>' : `<b>${R(p.price)}</b>`],
          ['Enrolled', p => `${p.enrolledStudents} students`],
          ['Status', p => st(p.status || 'Published')]
        ],
        pkgsList,
        p => tblDots('package', p.id)
      )
    );
  },

  tests() {
    const r = me().role;
    const l = D.tests || DEFAULT_CBT_TESTS;
    const filter = S.testFilter || 'all';

    const completedResults = D.res.filter(y => r !== 'student' || y.sid === S.uid);
    const avgScorePct = completedResults.length
      ? Math.round((completedResults.reduce((acc, c) => acc + (c.score / (c.maxScore || 32)), 0) / completedResults.length) * 100)
      : 84;

    const displayList = filter === 'completed'
      ? l.filter(t => D.res.some(y => y.tid === t.id && (r !== 'student' || y.sid === S.uid)))
      : l;

    return (
      hd(
        'Online CBT Examination Engine',
        r === 'student'
          ? 'Timed computer-based tests matching national exam guidelines with live question palette, marking scheme and instant analytics.'
          : 'Author mock exams, configure negative marking, multi-subject sections and evaluate student submissions.',
        r === 'student' ? '' : '<button class="b1" onclick="et()">+ Create Test</button>'
      ) +
      `<div class="metric-grid">
        ${renderKpiCard({ title: 'Available CBT Tests', value: l.length, trend: '↑ Live', sub: 'ready for exam', icon: 'tests', variant: 0 })}
        ${renderKpiCard({ title: r === 'student' ? 'My Test Attempts' : 'Total Attempts', value: completedResults.length, trend: '↑ Submissions', sub: 'evaluated', icon: 'award', variant: 1 })}
        ${renderKpiCard({ title: 'Average Score Rate', value: avgScorePct, suffix: '%', trend: '↑ Healthy', sub: 'batch average', icon: 'students', variant: 2 })}
        ${renderKpiCard({ title: 'Engine Mode', value: 100, suffix: '% CBT', trend: 'Active', sub: 'timer + auto-grader', icon: 'file', variant: 3 })}
      </div>` +
      `<div class="tabs" style="display:flex;gap:6px;border-bottom:1px solid var(--b);margin:16px 0 14px">
        <button class="b2 ${filter === 'all' ? 'on' : ''}" style="${filter === 'all' ? 'background:#0f172a;color:#fff;border-color:#0f172a;font-weight:600' : ''}" onclick="S.testFilter='all';S.testPg=0;rp()">All CBT Tests (${l.length})</button>
        <button class="b2 ${filter === 'completed' ? 'on' : ''}" style="${filter === 'completed' ? 'background:#0f172a;color:#fff;border-color:#0f172a;font-weight:600' : ''}" onclick="S.testFilter='completed';S.testPg=0;rp()">Completed & Solutions (${completedResults.length})</button>
      </div>` +
      window.renderTestsTable(displayList, {
        pageKey: 'testPg',
        pageSize: 10,
        onPage: 'rp()',
        onSearch: 'rp()'
      })
    );
  },

  /* ============================================================== */
  /* TEST SERIES MANAGEMENT                                         */
  /* ============================================================== */
  testseries() {
    if (typeof PG.testseries === 'function') {
      return PG.testseries();
    }
    return '';
  },

  /* ============================================================== */
  /* SHOPPING: 1. ALL BUYERS                                         */
  /* ============================================================== */
  shopping_buyers() {
    const buyers = D.buyers || DEFAULT_BUYERS;
    const totalRev = sum(buyers, 'finalPaid');
    const successOrders = buyers.filter(b => b.status === 'Success').length;
    const couponRedeemed = buyers.filter(b => b.coupon && b.coupon !== '—').length;

    const cols = [
      ['Order ID', b => `<span class="token-code-pill" style="font-size:11px">#${E(b.id)}</span>`],
      ['Buyer Details', b => `
        <div class="stu-cell">
          <img class="s-img" src="${av(U(b.sid))}" alt="">
          <div class="stu-meta">
            <b class="stu-name">${E(b.name)}</b>
            <span class="stu-sub">${E(b.email)} · ${E(b.phone)}</span>
          </div>
        </div>
      `],
      ['Course / Package Name', b => `<b>${E(b.pkgName)}</b>`],
      ['Date & Time', b => `<span style="font-size:12px;color:var(--mute)">${E(b.date)}</span>`],
      ['Original', b => b.amount ? R(b.amount) : '<span class="st gn">Free</span>'],
      ['Coupon / Token', b => b.coupon && b.coupon !== '—' ? `<span class="coupon-tag" style="font-size:11px">${E(b.coupon)}</span>` : '<span style="color:var(--mute)">None</span>'],
      ['Final Paid', b => `<b style="color:#0284c7;font-size:14px">${R(b.finalPaid)}</b>`],
      ['Payment Mode', b => `<span style="font-size:11.5px;color:var(--ink)">${E(b.mode)}</span>`],
      ['Status', b => st(b.status || 'Success')]
    ];

    return (
      hd(
        'All Buyers & Purchase Ledger',
        'Audit trail of enrolled students, course checkout transactions, payment gateways and digital invoices.',
        `<button class="b2" onclick="toast('Exporting buyers directory to CSV...')">${ico('up')} Export CSV</button> <button class="b1" onclick="openEnrollBuyerModal()">+ Add Buyer</button>`
      ) +
      `<div class="metric-grid">
        ${renderKpiCard({ title: 'Total Store Orders', value: buyers.length, trend: '↑ Live', sub: 'completed transactions', icon: 'shopping', variant: 0 })}
        ${renderKpiCard({ title: 'Total Store Revenue', value: totalRev, prefix: '₹', trend: '↑ +22%', sub: 'gross collections', icon: 'fin', variant: 1 })}
        ${renderKpiCard({ title: 'Successful Purchases', value: successOrders, suffix: ' Orders', trend: '↑ 100%', sub: 'zero dropouts', icon: 'award', variant: 2 })}
        ${renderKpiCard({ title: 'Coupons Redeemed', value: couponRedeemed, trend: 'Active', sub: 'promotional sales', icon: 'coupon', variant: 3 })}
      </div>` +
      tb(
        cols,
        buyers,
        b => tblDots('buyer', b.id),
        10
      )
    );
  },

  /* ============================================================== */
  /* SHOPPING: 2. TOKENS                                            */
  /* ============================================================== */
  shopping_tokens() {
    const tokens = D.tokens || DEFAULT_TOKENS;
    const activeTokens = tokens.filter(t => t.status === 'Active').length;
    const totalRedeemed = sum(tokens, 'usedCount');
    const totalLimit = sum(tokens, 'maxUses');

    const cols = [
      ['Token Code', t => `
        <div style="display:flex;align-items:center;gap:6px">
          <span class="token-code-pill">${E(t.code)}</span>
          <button class="b2" style="padding:2px 6px;font-size:10px" title="Copy code" onclick="copyTokenCode('${E(t.code)}')">Copy</button>
        </div>
      `],
      ['Applicable Package', t => `<b>${E(t.pkgName)}</b>`],
      ['Access Grant Type', t => `<span class="pill-badge pill-purple">${E(t.type)}</span>`],
      ['Redemptions', t => `
        <div>
          <b>${t.usedCount} / ${t.maxUses}</b>
          <div style="width:70px;height:5px;background:#e2e8f0;border-radius:99px;overflow:hidden;margin-top:4px">
            <div style="width:${Math.min(100, Math.round((t.usedCount / t.maxUses) * 100))}%;height:100%;background:#0284c7"></div>
          </div>
        </div>
      `],
      ['Expiry Date', t => `<span style="font-size:12px;color:var(--mute)">${E(t.expiresAt)}</span>`],
      ['Created By', t => `<small style="color:var(--ink)">${E(t.createdBy)}</small>`],
      ['Status', t => st(t.status || 'Active')]
    ];

    return (
      hd(
        'Access Tokens & Vouchers',
        'Generate prepaid admission tokens, test series passes, and institutional grant vouchers for learners.',
        `<button class="b1" onclick="openGenerateTokenModal()">+ Generate New Token</button>`
      ) +
      `<div class="metric-grid">
        ${renderKpiCard({ title: 'Active Tokens', value: activeTokens, trend: '↑ Live', sub: 'valid vouchers', icon: 'token', variant: 0 })}
        ${renderKpiCard({ title: 'Total Redemptions', value: totalRedeemed, trend: '↑ Used', sub: 'students enrolled', icon: 'students', variant: 1 })}
        ${renderKpiCard({ title: 'Remaining Capacity', value: totalLimit - totalRedeemed, suffix: ' Seats', trend: 'Available', sub: 'max limit pool', icon: 'packages', variant: 2 })}
        ${renderKpiCard({ title: 'Total Campaigns', value: tokens.length, trend: 'All Time', sub: 'token batches', icon: 'shopping', variant: 3 })}
      </div>` +
      tb(
        cols,
        tokens,
        t => tblDots('token', t.id),
        10
      )
    );
  },

  /* ============================================================== */
  /* SHOPPING: 3. COUPONS                                           */
  /* ============================================================== */
  shopping_coupons() {
    const coupons = D.coupons || DEFAULT_COUPONS;
    const activeCoupons = coupons.filter(c => c.status === 'Active').length;
    const totalUses = sum(coupons, 'usedCount');

    const cols = [
      ['Coupon Code', c => `<span class="coupon-tag">${E(c.code)}</span>`],
      ['Discount Offer', c => `<b style="color:#16a34a;font-size:13.5px">${c.type === 'percentage' ? c.discount + '% OFF' : R(c.discount) + ' FLAT OFF'}</b>`],
      ['Description / Scope', c => `<span>${E(c.desc)}</span><br><small style="color:var(--mute)">Min Order: ${R(c.minCart || 0)}</small>`],
      ['Usage Count', c => `<b>${c.usedCount || 0} / ${c.maxUses || 100}</b>`],
      ['Valid Until', c => `<span style="font-size:12px;color:var(--mute)">${E(c.expiresAt)}</span>`],
      ['Status', c => st(c.status || 'Active')]
    ];

    return (
      hd(
        'Coupons & Promotional Discounts',
        'Create and distribute store checkout coupon codes, percentage price cuts and seasonal festival campaigns.',
        `<button class="b1" onclick="openCreateCouponModal()">+ Create Coupon</button>`
      ) +
      `<div class="metric-grid">
        ${renderKpiCard({ title: 'Active Coupons', value: activeCoupons, trend: '↑ Live', sub: 'in store checkout', icon: 'coupon', variant: 0 })}
        ${renderKpiCard({ title: 'Times Redeemed', value: totalUses, trend: '↑ +34%', sub: 'checkout uses', icon: 'shopping', variant: 1 })}
        ${renderKpiCard({ title: 'Top Discount Offer', value: 50, suffix: '%', trend: 'Max Rate', sub: 'code: WELCOME50', icon: 'award', variant: 2 })}
        ${renderKpiCard({ title: 'Total Campaigns', value: coupons.length, trend: 'All Time', sub: 'configured codes', icon: 'fin', variant: 3 })}
      </div>` +
      tb(
        cols,
        coupons,
        c => tblDots('coupon', c.id),
        10
      )
    );
  },

  /* ============================================================== */
  /* 4. DIRECT STUDENT MESSAGING SYSTEM                             */
  /* ============================================================== */
  messages() {
    const r = me().role;
    const isStudent = r === 'student';

    // STRICT PRIVACY: Students only see messages addressed to their own user ID!
    if (isStudent) {
      const myMsgs = (D.messages || []).filter(m => m.toStudentId === S.uid);
      const unreadCount = myMsgs.filter(m => !m.read).length;

      return (
        hd(
          'My Messages & Instructor Guidance',
          'Private inbox for personalized test feedback, doubt resolutions, and official announcements from your faculty.'
        ) +
        `<div class="metric-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:18px">
          ${renderKpiCard({ title: 'Total Messages', value: myMsgs.length, trend: 'All', sub: 'received', icon: 'messages', variant: 0 })}
          ${renderKpiCard({ title: 'Unread Messages', value: unreadCount, trend: unreadCount ? 'Action Needed' : 'Caught up', sub: 'in your inbox', icon: 'horn', variant: unreadCount ? 3 : 1 })}
          ${renderKpiCard({ title: 'Support Desk', value: 100, suffix: '% Direct', trend: 'Active', sub: 'connected faculty', icon: 'instrs', variant: 2 })}
        </div>` +
        (!myMsgs.length
          ? `<div class="em" style="padding:48px 20px">
              <div style="display:grid;place-items:center;width:48px;height:48px;border-radius:12px;background:#f0f9ff;color:#0284c7;margin:0 auto 10px">${ico('inbox')}</div>
              <b>Your Inbox is Clear!</b>
              <p style="margin-top:6px;color:var(--mute)">Messages and feedback sent to you by your instructors or institute administration will appear right here.</p>
            </div>`
          : `
            <div class="msg-inbox-container">
              ${myMsgs.map(m => `
                <div class="msg-card ${!m.read ? 'msg-unread' : ''}" onclick="openViewMessageModal('${m.id}')">
                  <div class="msg-card-top">
                    <div class="msg-sender-info">
                      <img src="${av(U(m.fromId))}" alt="">
                      <div>
                        <div style="display:flex;align-items:center;gap:8px">
                          <b style="font-size:14px;color:var(--ink)">${E(m.fromName)}</b>
                          <span class="pill-badge pill-purple" style="font-size:10.5px">${E(m.fromRole)}</span>
                          ${!m.read ? `<span class="pill-badge pill-blue" style="font-size:10px;font-weight:700">NEW</span>` : ''}
                        </div>
                        <small style="color:var(--mute)">${E(m.date)}</small>
                      </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px">
                      <span class="pill-badge ${m.priority === 'Urgent' ? 'pill-red' : m.priority === 'High' ? 'pill-amber' : 'pill-green'}" style="font-size:11px">${E(m.priority)}</span>
                      <span class="pill-badge pill-blue" style="font-size:11px">${E(m.tag)}</span>
                    </div>
                  </div>
                  <div class="msg-subject-row" style="margin-top:4px">
                    <span class="msg-subject-text">${E(m.subject)}</span>
                  </div>
                  <div class="msg-body-preview">${E(m.body)}</div>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;padding-top:8px;border-top:1px dashed var(--b)">
                    <span style="font-size:11.5px;color:var(--mute)">${m.replies && m.replies.length ? `${m.replies.length} replies` : 'Click to read full message & reply'}</span>
                    <button class="b2" style="font-size:12px;padding:3px 10px">Read Message →</button>
                  </div>
                </div>
              `).join('')}
            </div>
          `)
      );
    }

    // Owner, Admin & Instructor View: Communications Hub & Sent Outbox
    const allMsgs = D.messages || [];
    const filterStudent = S.msgStudentFilter || 'all';
    const displayMsgs = filterStudent === 'all' ? allMsgs : allMsgs.filter(m => m.toStudentId === filterStudent);
    const totalSent = allMsgs.length;
    const unreadCount = allMsgs.filter(m => !m.read).length;
    const allStudents = D.users.filter(u => u.role === 'student');

    return (
      hd(
        'Student Communications & Direct Messaging',
        'Send personalized academic guidance, doubt replies, performance notes and official notifications directly to individual learners.',
        `<button class="b1" style="display:inline-flex;align-items:center;gap:6px" onclick="openComposeMessageModal()">${ico('messages')} Compose Message</button>`
      ) +
      `<div class="metric-grid">
        ${renderKpiCard({ title: 'Total Messages Sent', value: totalSent, trend: '↑ Outbox', sub: 'sent to learners', icon: 'messages', variant: 0 })}
        ${renderKpiCard({ title: 'Unread by Students', value: unreadCount, trend: unreadCount ? 'Pending' : 'All Read', sub: 'awaiting student view', icon: 'horn', variant: unreadCount ? 3 : 1 })}
        ${renderKpiCard({ title: 'Active Learners', value: allStudents.length, trend: 'Active', sub: 'direct learner reach', icon: 'students', variant: 2 })}
        ${renderKpiCard({ title: 'Priority Communications', value: allMsgs.filter(m => m.priority === 'High' || m.priority === 'Urgent').length, trend: 'High/Urgent', sub: 'important notices', icon: 'award', variant: 3 })}
      </div>` +
      `<div class="bar" style="margin:16px 0 14px;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:10px">
          <label style="margin:0;font-size:13px;display:flex;align-items:center;gap:6px">
            <b>Filter by Student:</b>
            <select style="width:220px;padding:6px 10px" onchange="S.msgStudentFilter=this.value;S.pg=0;rp()">
              <option value="all">All Students (${allMsgs.length} messages)</option>
              ${allStudents.map(s => {
                const count = allMsgs.filter(m => m.toStudentId === s.id).length;
                return `<option value="${s.id}" ${filterStudent === s.id ? 'selected' : ''}>${E(s.name)} (${count})</option>`;
              }).join('')}
            </select>
          </label>
        </div>
      </div>` +
      tb(
        [
          ['Recipient Student', m => `
            <div class="stu-cell">
              <img class="s-img" src="${av(U(m.toStudentId))}" alt="">
              <div class="stu-meta">
                <b class="stu-name">${E(m.toStudentName)}</b>
                <span class="stu-sub">${E(m.toStudentEmail)}</span>
              </div>
            </div>
          `],
          ['Subject & Category', m => `
            <div>
              <b style="font-size:13.5px;color:var(--ink)">${E(m.subject)}</b>
              <div style="display:flex;gap:6px;margin-top:3px">
                <span class="pill-badge pill-blue" style="font-size:10.5px">${E(m.tag)}</span>
                <span class="pill-badge ${m.priority === 'Urgent' ? 'pill-red' : m.priority === 'High' ? 'pill-amber' : 'pill-green'}" style="font-size:10.5px">${E(m.priority)}</span>
              </div>
            </div>
          `],
          ['Sent By', m => `<b>${E(m.fromName)}</b><br><small style="color:var(--mute)">${E(m.fromRole)}</small>`],
          ['Timestamp', m => `<span style="font-size:12px;color:var(--mute)">${E(m.date)}</span>`],
          ['Delivery Status', m => m.read ? '<span class="pill-badge pill-green">Seen by Student</span>' : '<span class="pill-badge pill-amber">Sent (Unread)</span>']
        ],
        displayMsgs,
        m => tblDots('message', m.id),
        10
      )
    );
  },

  set() {
    return (
      hd('Settings', 'Institute profile and demo configurations.') +
      `<div class=cd style="max-width:440px">
        <label>Institute name<input id=iname value="${E(D.inst)}"></label>
        <div class=fg>
          <span>Operating mode</span>
          <div class=seg>
            ${['Online', 'Offline', 'Both'].map(m => `<button type=button class="${OM() === m ? 'on' : ''}" onclick="som('${m}')">${OML[m]}</button>`).join('')}
          </div>
          <small>${OM() === 'Online' ? 'Fully online institute — centers are hidden across the entire application.' : OM() === 'Offline' ? 'Classroom-only institute — every student and course belongs to a center.' : 'Students and courses can be at physical centers, online, or both.'}</small>
        </div>
        <button class=b1 onclick="D.inst=$('#iname').value.trim()||D.inst;save();render();toast('Settings saved')">Save</button>
        <hr style="width:100%;border:0;border-top:1px solid var(--b)">
        <button class=b2 onclick="cfm('Reset all demo data to original seed?',()=>{D=seed();save();S.uid=null;login()})">Reset demo data</button>
      </div>`
    );
  }
};

/* ============================================================== */
/* SHOPPING & DIRECT MESSAGING ACTION MODALS                      */
/* ============================================================== */

function copyTokenCode(code) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code);
  }
  toast(`Token code "${code}" copied to clipboard!`);
}

function toggleTokenStatus(id) {
  const t = (D.tokens || []).find(x => x.id === id);
  if (!t) return;
  t.status = t.status === 'Active' ? 'Deactivated' : 'Active';
  save();
  rp();
  toast(`Token ${t.code} is now ${t.status}`);
}

function deleteTokenItem(id) {
  cfm('Delete this token code permanently?', () => {
    D.tokens = (D.tokens || []).filter(x => x.id !== id);
    save();
    rp();
    toast('Token deleted');
  });
}

function openGenerateTokenModal() {
  const pkgs = D.packages || DEFAULT_PACKAGES;
  const randCode = 'TGR-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);

  modal(
    'Generate Access Token / Voucher',
    `
      <div style="display:grid;gap:12px">
        <label>Token Code
          <div style="display:flex;gap:6px">
            <input id="gtCode" value="${randCode}" style="font-family:monospace;font-weight:700">
            <button class="b2" type="button" onclick="$('#gtCode').value='TGR-'+Math.random().toString(36).substring(2,6).toUpperCase()+'-'+Math.floor(100+Math.random()*900)">Randomize</button>
          </div>
        </label>
        <label>Target Test Package / Course
          <select id="gtPkg">
            <option value="all">All Active Packages</option>
            ${pkgs.map(p => `<option value="${p.id}">${E(p.name)} (${p.price ? R(p.price) : 'Free'})</option>`).join('')}
          </select>
        </label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label>Access Type
            <select id="gtType">
              <option value="100% Free Access">100% Free Access</option>
              <option value="Scholarship Grant">Scholarship Grant</option>
              <option value="Open Campus">Open Campus</option>
              <option value="Single-use Pass">Single-use Pass</option>
            </select>
          </label>
          <label>Max Redemptions
            <input id="gtMax" type="number" value="25" min="1" max="1000">
          </label>
        </div>
        <label>Expiry Date
          <input id="gtExp" type="date" value="2026-12-31">
        </label>
      </div>
    `,
    () => {
      const code = $('#gtCode').value.trim().toUpperCase();
      const pkgId = $('#gtPkg').value;
      const type = $('#gtType').value;
      const maxUses = parseInt($('#gtMax').value, 10) || 10;
      const exp = $('#gtExp').value || '2026-12-31';

      if (!code) return toast('Token code cannot be empty');
      const pkgObj = pkgs.find(p => p.id === pkgId);
      const pkgName = pkgObj ? pkgObj.name : 'All Active Packages';

      D.tokens = D.tokens || [];
      D.tokens.unshift({
        id: id('tok'),
        code,
        pkgId,
        pkgName,
        type,
        maxUses,
        usedCount: 0,
        expiresAt: new Date(exp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        createdBy: me().name + ' (' + RL[me().role] + ')',
        status: 'Active'
      });
      save();
      toast(`Token ${code} created successfully!`);
      rp();
    },
    '',
    'Generate Token'
  );
}

function toggleCouponStatus(id) {
  const c = (D.coupons || []).find(x => x.id === id);
  if (!c) return;
  c.status = c.status === 'Active' ? 'Disabled' : 'Active';
  save();
  rp();
  toast(`Coupon ${c.code} is now ${c.status}`);
}

function deleteCouponItem(id) {
  cfm('Delete this promotional coupon code permanently?', () => {
    D.coupons = (D.coupons || []).filter(x => x.id !== id);
    save();
    rp();
    toast('Coupon deleted');
  });
}

function openCreateCouponModal() {
  modal(
    'Create Promotional Discount Coupon',
    `
      <div style="display:grid;gap:12px">
        <label>Coupon Code (Alphanumeric)
          <input id="cpCode" placeholder="e.g. FESTIVAL30" style="font-family:monospace;font-weight:700;text-transform:uppercase" oninput="this.value=this.value.toUpperCase()">
        </label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label>Discount Type
            <select id="cpType">
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </label>
          <label>Discount Value
            <input id="cpVal" type="number" value="20" min="1">
          </label>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label>Min Order Cart Value (₹)
            <input id="cpMin" type="number" value="500">
          </label>
          <label>Total Uses Allowed
            <input id="cpMax" type="number" value="100">
          </label>
        </div>
        <label>Campaign Description
          <input id="cpDesc" placeholder="e.g. 20% instant discount across all test series">
        </label>
        <label>Valid Until
          <input id="cpExp" type="date" value="2026-12-31">
        </label>
      </div>
    `,
    () => {
      const code = $('#cpCode').value.trim().toUpperCase();
      const type = $('#cpType').value;
      const discount = parseFloat($('#cpVal').value) || 10;
      const minCart = parseFloat($('#cpMin').value) || 0;
      const maxUses = parseInt($('#cpMax').value, 10) || 100;
      const desc = $('#cpDesc').value.trim() || `${discount}${type === 'percentage' ? '%' : '₹'} off on test packages`;
      const exp = $('#cpExp').value || '2026-12-31';

      if (!code) return toast('Coupon code is required');

      D.coupons = D.coupons || [];
      D.coupons.unshift({
        id: id('cpn'),
        code,
        type,
        discount,
        desc,
        minCart,
        maxUses,
        usedCount: 0,
        expiresAt: new Date(exp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Active'
      });
      save();
      toast(`Coupon ${code} created successfully!`);
      rp();
    },
    '',
    'Save Coupon'
  );
}

function viewBuyerReceipt(orderId) {
  const b = (D.buyers || DEFAULT_BUYERS).find(x => x.id === orderId);
  if (!b) return toast('Order not found');

  modal(
    `Order Receipt #${b.id}`,
    `
      <div class="receipt-box" style="padding:10px 6px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1.5px solid var(--b);padding-bottom:14px;margin-bottom:14px">
          <div>
            <h2 style="font-size:18px;font-weight:700;color:var(--ink)">${E(D.inst)}</h2>
            <p style="font-size:12px;color:var(--mute)">Official Tax Invoice & Enrollment Receipt</p>
          </div>
          <div style="text-align:right">
            <span class="pill-badge pill-green">Payment Completed</span>
            <small style="display:block;margin-top:4px;color:var(--mute)">Date: ${E(b.date)}</small>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:12.5px;margin-bottom:16px;background:var(--s);padding:12px;border-radius:8px">
          <div>
            <b style="color:var(--mute);text-transform:uppercase;font-size:10.5px">Billed To Learner:</b>
            <div style="font-weight:600;font-size:14px;color:var(--ink);margin-top:2px">${E(b.name)}</div>
            <div>${E(b.email)}</div>
            <div>Ph: ${E(b.phone)}</div>
          </div>
          <div style="text-align:right">
            <b style="color:var(--mute);text-transform:uppercase;font-size:10.5px">Payment Details:</b>
            <div style="font-weight:600;color:var(--ink);margin-top:2px">Mode: ${E(b.mode)}</div>
            <div>Order ID: #${E(b.id)}</div>
            <div>Status: Verified (Success)</div>
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">
          <thead>
            <tr style="border-bottom:1.5px solid var(--b);text-align:left;color:var(--mute)">
              <th style="padding:8px">Item Description</th>
              <th style="padding:8px;text-align:right">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #f1f5f9">
              <td style="padding:10px 8px">
                <b>${E(b.pkgName)}</b>
                <div style="font-size:11.5px;color:var(--mute)">Online CBT Test Series & Digital Handout Vault</div>
              </td>
              <td style="padding:10px 8px;text-align:right">${R(b.amount)}</td>
            </tr>
            ${b.discount ? `
              <tr style="border-bottom:1px solid #f1f5f9;color:#16a34a">
                <td style="padding:8px">Coupon Discount (${E(b.coupon)})</td>
                <td style="padding:8px;text-align:right">- ${R(b.discount)}</td>
              </tr>
            ` : ''}
            <tr style="font-weight:700;font-size:15px;color:var(--ink)">
              <td style="padding:10px 8px">Total Amount Paid</td>
              <td style="padding:10px 8px;text-align:right;color:#0284c7">${R(b.finalPaid)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    null,
    '',
    '',
    `<button class="b2" onclick="closeM(1)">Close</button> <button class="b1" onclick="window.print()">${ico('printer')} Print Invoice</button>`
  );
}

function openEnrollBuyerModal() {
  const students = D.users.filter(u => u.role === 'student');
  const pkgs = D.packages || DEFAULT_PACKAGES;

  modal(
    'Manual Buyer Enrollment',
    `
      <div style="display:grid;gap:12px">
        <label>Select Student
          <select id="ebStudent">
            ${students.map(s => `<option value="${s.id}">${E(s.name)} (${E(s.email)})</option>`).join('')}
          </select>
        </label>
        <label>Target Package / Course
          <select id="ebPkg">
            ${pkgs.map(p => `<option value="${p.id}" data-price="${p.price}">${E(p.name)} (${p.price ? R(p.price) : 'Free'})</option>`).join('')}
          </select>
        </label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label>Payment Mode
            <select id="ebMode">
              <option value="Manual Office Cash">Manual Office Cash</option>
              <option value="UPI / QR">UPI / QR</option>
              <option value="Bank Wire">Bank Wire</option>
              <option value="Scholarship Free">Scholarship Free</option>
            </select>
          </label>
          <label>Amount Collected (₹)
            <input id="ebPaid" type="number" value="2500">
          </label>
        </div>
      </div>
    `,
    () => {
      const sid = $('#ebStudent').value;
      const s = D.users.find(u => u.id === sid);
      const pkgId = $('#ebPkg').value;
      const p = pkgs.find(x => x.id === pkgId);
      const mode = $('#ebMode').value;
      const finalPaid = parseFloat($('#ebPaid').value) || 0;

      if (!s || !p) return;

      D.buyers = D.buyers || [];
      D.buyers.unshift({
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        sid: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone || '9820145892',
        pkgId: p.id,
        pkgName: p.name,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        amount: p.price,
        coupon: 'MANUAL',
        discount: Math.max(0, p.price - finalPaid),
        finalPaid,
        mode,
        status: 'Success'
      });

      // Grant package in library
      D.myPackages = D.myPackages || {};
      D.myPackages[s.id] = D.myPackages[s.id] || [];
      if (!D.myPackages[s.id].includes(p.id)) D.myPackages[s.id].push(p.id);

      save();
      toast(`Enrolled ${s.name} into ${p.name}!`);
      rp();
    },
    '',
    'Enroll & Issue Receipt'
  );
}

/* ============================================================== */
/* DIRECT MESSAGING MODAL & SUBMISSION SYSTEM                     */
/* ============================================================== */

function openComposeMessageModal(preSelectedStudentId = '') {
  const students = D.users.filter(u => u.role === 'student');

  modal(
    'Compose Direct Student Message',
    `
      <div style="display:grid;gap:12px">
        <label>Select Recipient Learner
          <select id="compStudent">
            <option value="">-- Choose Student --</option>
            ${students.map(s => `
              <option value="${s.id}" ${preSelectedStudentId === s.id ? 'selected' : ''}>
                ${E(s.name)} (${E(s.email)})
              </option>
            `).join('')}
          </select>
        </label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label>Category / Purpose
            <select id="compTag">
              <option value="Academic Guidance">Academic Guidance & Feedback</option>
              <option value="Exam Notice">Exam Notice & Schedule</option>
              <option value="Doubt Resolution">Doubt Resolution</option>
              <option value="Attendance Alert">Attendance Alert</option>
              <option value="General Notice">General Notice</option>
            </select>
          </label>
          <label>Priority Level
            <select id="compPriority">
              <option value="Normal">Normal</option>
              <option value="High" selected>High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </label>
        </div>
        <label>Message Subject
          <input id="compSubject" placeholder="e.g. Physics Mechanics Test Analysis & Doubt Session" style="font-weight:600">
        </label>
        <label>Message Content
          <textarea id="compBody" rows="5" placeholder="Write your personalized message to the student..."></textarea>
        </label>
      </div>
    `,
    () => {
      const studentId = $('#compStudent').value;
      const subject = $('#compSubject').value.trim();
      const body = $('#compBody').value.trim();
      const tag = $('#compTag').value;
      const priority = $('#compPriority').value;

      if (!studentId) return toast('Please select a recipient student');
      if (!subject) return toast('Subject cannot be empty');
      if (!body) return toast('Message body cannot be empty');

      sendDirectMessage(studentId, subject, body, tag, priority);
    },
    '',
    'Send Message'
  );
}

function sendDirectMessage(toStudentId, subject, body, tag, priority) {
  const s = D.users.find(u => u.id === toStudentId);
  if (!s) return;

  const newMsg = {
    id: id('msg'),
    toStudentId: s.id,
    toStudentName: s.name,
    toStudentEmail: s.email,
    fromId: me().id,
    fromName: me().name,
    fromRole: RL[me().role],
    subject,
    body,
    tag: tag || 'Academic Guidance',
    priority: priority || 'Normal',
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false,
    replies: []
  };

  D.messages = D.messages || [];
  D.messages.unshift(newMsg);

  // Send real-time notification to the student's notification bell
  note(s.id, `New message from ${me().name}: ${subject}`);

  save();
  toast(`Message successfully delivered to ${s.name}!`);
  closeM(1);
  render();
}

function openViewMessageModal(msgId) {
  const m = (D.messages || []).find(x => x.id === msgId);
  if (!m) return toast('Message not found');

  // If viewed by the recipient student, mark as read
  if (me().role === 'student' && m.toStudentId === S.uid && !m.read) {
    m.read = true;
    save();
  }

  const sender = U(m.fromId);
  const replies = m.replies || [];

  modal(
    `Message: ${E(m.subject)}`,
    `
      <div class="msg-detail-modal-body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:12px;border-bottom:1px solid var(--b)">
          <div style="display:flex;align-items:center;gap:12px">
            <img src="${av(sender)}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid #bae6fd">
            <div>
              <div style="display:flex;align-items:center;gap:8px">
                <b style="font-size:15px;color:var(--ink)">${E(m.fromName)}</b>
                <span class="pill-badge pill-purple" style="font-size:11px">${E(m.fromRole)}</span>
              </div>
              <small style="color:var(--mute)">To: <b>${E(m.toStudentName)}</b> · Sent on ${E(m.date)}</small>
            </div>
          </div>
          <div style="display:flex;gap:6px">
            <span class="pill-badge ${m.priority === 'Urgent' ? 'pill-red' : m.priority === 'High' ? 'pill-amber' : 'pill-green'}">${E(m.priority)}</span>
            <span class="pill-badge pill-blue">${E(m.tag)}</span>
          </div>
        </div>

        <div>
          <b style="font-size:12px;color:var(--mute);text-transform:uppercase;display:block;margin-bottom:6px">Message Content:</b>
          <div class="msg-detail-box">${E(m.body)}</div>
        </div>

        ${replies.length ? `
          <div>
            <b style="font-size:12px;color:var(--mute);text-transform:uppercase;display:block;margin-bottom:8px">Replies Thread (${replies.length}):</b>
            <div style="display:flex;flex-direction:column;gap:8px">
              ${replies.map(r => `
                <div style="background:var(--card);border:1px solid var(--b);border-radius:8px;padding:10px 14px">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                    <b style="font-size:12.5px;color:var(--ink)">${E(r.from)}</b>
                    <small style="color:var(--mute)">${E(r.at)}</small>
                  </div>
                  <div style="font-size:13px;color:var(--ink)">${E(r.text)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="msg-reply-box">
          <label style="font-weight:600;font-size:12.5px">Quick Reply:
            <textarea id="replyMsgText" rows="3" placeholder="Type your reply here..."></textarea>
          </label>
          <div style="text-align:right">
            <button class="b1" style="font-size:12.5px;padding:6px 14px" onclick="sendStudentReply('${m.id}')">Send Reply</button>
          </div>
        </div>
      </div>
    `,
    null,
    '',
    '',
    `<button class="b2" onclick="closeM(1);render()">Close</button>`
  );
}

function sendStudentReply(msgId) {
  const m = (D.messages || []).find(x => x.id === msgId);
  if (!m) return;
  const replyInput = $('#replyMsgText');
  if (!replyInput) return;
  const text = replyInput.value.trim();
  if (!text) return toast('Please type a reply message');

  m.replies = m.replies || [];
  m.replies.push({
    from: me().name + ' (' + RL[me().role] + ')',
    text,
    at: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  });

  // If student is replying, notify the instructor/sender
  if (me().role === 'student') {
    note(m.fromId, `Reply from ${me().name} on "${m.subject}": ${text}`);
  } else {
    note(m.toStudentId, `New response from ${me().name} on "${m.subject}": ${text}`);
  }

  save();
  toast('Reply sent successfully!');
  closeM(1);
  render();
}

/* User management (Admins / Instructors) */
function ppl(role, t, d) {
  const o = me().role === 'owner';
  const cols = [
    ['Name', u => `<b>${E(u.name)}</b><br><small>${E(u.email)}</small>`],
    role === 'instructor' ? ['Subject', u => `<span class="pill-badge pill-blue" style="font-weight:600">${ico('book')} ${E(u.subject || 'Physics')}</span>`] : null,
    hasC() ? ['Centers', u => E(cl(u.centers))] : null,
    ['Status', u => st(u.status)]
  ].filter(Boolean);

  return (
    hd(t, d, `<button class=b1 onclick="iv('${role}')">+ Invite ${role === 'admin' ? 'administrator' : 'instructor'}</button>`) +
    tb(
      cols,
      D.users.filter(u => u.role === role && (o || !hasC() || u.centers.some(c => cs().includes(c)))),
      u => (hasC() ? `<button class=b2 onclick="ea('${u.id}')">Centers</button>` : '') + `<button class=b2 onclick="tg('users','${u.id}')">${u.status === 'Active' ? 'Suspend' : 'Activate'}</button>`
    )
  );
}

const allC = () => (!hasC() ? [] : D.centers.filter(c => c.status === 'Active' || me().role !== 'owner').map(c => [c.id, c.name]));

/* ============================================================== */
/* TEAM MANAGEMENT & MULTI-ROLE ASSIGNMENT SYSTEM                */
/* ============================================================== */

function openRoleAssignmentModal(userId) {
  const u = U(userId);
  if (!u) return toast('Member not found');
  const curRoles = uRoles(u);
  const isOwner = u.role === 'owner' || curRoles.includes('owner');

  const content = `
    <div style="display:flex;align-items:center;gap:14px;padding:12px 14px;background:#f8fafc;border-radius:12px;border:1px solid var(--b);margin-bottom:14px">
      <img src="${av(u)}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid #bae6fd">
      <div>
        <b style="font-size:15px;color:#0f172a;display:block">${E(u.name)}</b>
        <span style="font-size:12px;color:#64748b">${E(u.email)} · Current: ${curRoles.map(r => r === 'admin' ? 'Administrator' : r === 'instructor' ? 'Instructor' : r).join(', ')}</span>
      </div>
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:12.5px;font-weight:600;color:#0f172a;margin-bottom:4px;display:block">Assign System Roles</label>
      <p style="font-size:12px;color:#64748b;margin:0 0 10px">One person can hold both Administrator and Instructor roles simultaneously.</p>
    </div>

    <div style="display:grid;gap:10px;margin-bottom:16px">
      <!-- Administrator Role Card -->
      <label class="role-card-opt" style="border-color:${curRoles.includes('admin') ? '#0284c7' : 'var(--b)'};background:${curRoles.includes('admin') ? '#f0f9ff' : 'var(--s)'}">
        <input type="checkbox" id="chkRoleAdmin" ${curRoles.includes('admin') ? 'checked' : ''} onchange="this.closest('.role-card-opt').style.borderColor=this.checked?'#0284c7':'var(--b)';this.closest('.role-card-opt').style.background=this.checked?'#f0f9ff':'var(--s)'">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
            <b style="font-size:14px;color:#0f172a">Administrator Role</b>
            <span class="pill-badge pill-purple">Operations & Admin</span>
          </div>
          <small style="color:#64748b;line-height:1.4;display:block">Operational management: admit learners, schedule tests, build course packages, inspect fee ledgers and manage faculty assignments.</small>
        </div>
      </label>

      <!-- Instructor Role Card -->
      <label class="role-card-opt" style="border-color:${curRoles.includes('instructor') ? '#0284c7' : 'var(--b)'};background:${curRoles.includes('instructor') ? '#f0f9ff' : 'var(--s)'}">
        <input type="checkbox" id="chkRoleInstructor" ${curRoles.includes('instructor') ? 'checked' : ''} onchange="this.closest('.role-card-opt').style.borderColor=this.checked?'#0284c7':'var(--b)';this.closest('.role-card-opt').style.background=this.checked?'#f0f9ff':'var(--s)'">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
            <b style="font-size:14px;color:#0f172a">Instructor Role</b>
            <span class="pill-badge pill-blue">Teaching Faculty</span>
          </div>
          <small style="color:#64748b;line-height:1.4;display:block">Academic execution: teach allocated courses, author syllabus modules, host live classrooms, upload study notes and review student quiz attempts.</small>
        </div>
      </label>

      ${isOwner ? `
        <label class="role-card-opt" style="border-color:#0f172a;background:#f8fafc;opacity:0.85;cursor:default">
          <input type="checkbox" id="chkRoleOwner" checked disabled style="accent-color:#0f172a">
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
              <b style="font-size:14px;color:#0f172a">Institute Owner</b>
              <span class="pill-badge" style="background:#0f172a;color:#fff">Account Founder</span>
            </div>
            <small style="color:#64748b;line-height:1.4;display:block">Institute principal and billing owner. Has top-level institute governance.</small>
          </div>
        </label>
      ` : ''}
    </div>

    <!-- Primary Teaching Subject -->
    <div style="margin-top:14px;border-top:1px dashed var(--b);padding-top:14px">
      <label style="font-size:12.5px;font-weight:600;color:var(--ink);margin-bottom:6px;display:block">Primary Teaching Subject *</label>
      <input id="editTmSubject" value="${E(u.subject || 'Physics')}" placeholder="e.g. Physics, Chemistry, Mathematics, Biology, English">
      <small style="color:var(--mute);font-size:11.5px;display:block;margin-top:4px">Academic domain taught by this faculty member across programs.</small>
    </div>

    ${hasC() ? `
      <div style="margin-top:14px;border-top:1px dashed var(--b);padding-top:14px">
        <label style="font-size:12.5px;font-weight:600;color:#0f172a;margin-bottom:6px;display:block">Assigned Centers / Branches</label>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
          ${D.centers.map(c => `
            <label class="ck" style="font-size:13px;padding:6px 10px;border:1px solid var(--b);border-radius:8px">
              <input type="checkbox" name="teamCenters" value="${c.id}" ${(u.centers || []).includes(c.id) ? 'checked' : ''}>
              <span>${E(c.name)} (${c.code})</span>
            </label>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  modal(
    'Assign Roles & Permissions · ' + E(u.name),
    content,
    null,
    '',
    '',
    `
      <button class="b2" onclick="closeM(1)">Cancel</button>
      <button class="b1" onclick="saveRoleAssignments('${u.id}')">Save Role Assignments</button>
    `
  );
}

function saveRoleAssignments(userId) {
  const u = U(userId);
  if (!u) return;

  const chkAdmin = $('#chkRoleAdmin');
  const chkInstructor = $('#chkRoleInstructor');
  const hasAdmin = chkAdmin ? chkAdmin.checked : false;
  const hasInstr = chkInstructor ? chkInstructor.checked : false;
  const isOwner = u.role === 'owner' || (u.roles && u.roles.includes('owner'));

  const newRoles = [];
  if (isOwner) newRoles.push('owner');
  if (hasAdmin) newRoles.push('admin');
  if (hasInstr) newRoles.push('instructor');

  if (!newRoles.length) {
    alert('Please select at least one role (Administrator or Instructor).');
    return;
  }

  // Update subject if present
  const subjInput = $('#editTmSubject');
  if (subjInput && subjInput.value.trim()) {
    u.subject = subjInput.value.trim();
  }

  // Update centers if present
  if (hasC()) {
    const centerInputs = document.querySelectorAll('input[name="teamCenters"]:checked');
    const newCenters = Array.from(centerInputs).map(cb => cb.value);
    u.centers = newCenters;
  }

  u.roles = newRoles;
  // Set primary role for backward compatibility
  if (newRoles.includes('owner')) u.role = 'owner';
  else if (newRoles.includes('admin')) u.role = 'admin';
  else u.role = newRoles[0];

  save();
  closeM(1);
  render();
  const roleNames = newRoles.map(r => r === 'admin' ? 'Administrator' : r === 'instructor' ? 'Instructor' : r).join(' + ');
  toast(`Roles and subject updated for ${u.name}: ${roleNames}`);
}

function openAddTeamMemberModal() {
  const content = `
    <div style="display:grid;gap:12px">
      <label>Full Name *<input id="addTmName" placeholder="e.g. Dr. Priya Sharma"></label>
      <label>Email Address *<input id="addTmEmail" type="email" placeholder="priya.sharma@abcinstitute.demo"></label>
      <label>Mobile Number *<input id="addTmPhone" type="tel" placeholder="98XXXXXXXX"></label>

      <div>
        <label style="font-size:12.5px;font-weight:600;color:var(--ink);margin-bottom:6px;display:block">Assigned Role(s) * (Select one or both)</label>
        <div style="display:grid;gap:8px">
          <label class="role-card-opt" style="border-color:#0284c7;background:#f0f9ff">
            <input type="checkbox" id="addRoleAdmin" checked onchange="this.closest('.role-card-opt').style.borderColor=this.checked?'#0284c7':'var(--b)';this.closest('.role-card-opt').style.background=this.checked?'#f0f9ff':'var(--s)'">
            <div style="flex:1">
              <div style="display:flex;align-items:center;gap:7px">
                <span style="color:#0284c7;display:inline-flex">${ico('admins')}</span>
                <b style="font-size:13.5px;color:var(--ink)">Administrator</b>
              </div>
              <small style="color:var(--mute);display:block;margin-top:2px">Admit students, schedule tests, manage courses & centers</small>
            </div>
          </label>
          <label class="role-card-opt" style="border-color:var(--b);background:var(--s)">
            <input type="checkbox" id="addRoleInstr" onchange="this.closest('.role-card-opt').style.borderColor=this.checked?'#0284c7':'var(--b)';this.closest('.role-card-opt').style.background=this.checked?'#f0f9ff':'var(--s)'">
            <div style="flex:1">
              <div style="display:flex;align-items:center;gap:7px">
                <span style="color:#0284c7;display:inline-flex">${ico('instrs')}</span>
                <b style="font-size:13.5px;color:var(--ink)">Instructor</b>
              </div>
              <small style="color:var(--mute);display:block;margin-top:2px">Teach courses, run live classes, manage tests & notes</small>
            </div>
          </label>
        </div>
      </div>

      <div id="addTmSubjBox">
        <label style="font-size:12.5px;font-weight:600;color:var(--ink);margin-bottom:6px;display:block">Teaching Subject *</label>
        <input id="addTmSubject" placeholder="e.g. Physics, Chemistry, Mathematics, Biology, English" value="Physics">
      </div>

      ${hasC() ? `
        <div>
          <label style="font-size:12.5px;font-weight:600;color:#0f172a;margin-bottom:6px;display:block">Assigned Centers</label>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
            ${D.centers.map((c, i) => `
              <label class="ck" style="font-size:13px;padding:6px 10px;border:1px solid var(--b);border-radius:8px">
                <input type="checkbox" name="addMemberCenters" value="${c.id}" ${i === 0 ? 'checked' : ''}>
                <span>${E(c.name)}</span>
              </label>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  modal(
    'Add Team Member',
    content,
    null,
    '',
    '',
    `
      <button class="b2" onclick="closeM(1)">Cancel</button>
      <button class="b1" onclick="submitNewTeamMember()">Add Member</button>
    `
  );
}

function submitNewTeamMember() {
  const nameInput = $('#addTmName');
  const emailInput = $('#addTmEmail');
  const phoneInput = $('#addTmPhone');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';

  if (!name) return alert('Full name is required.');
  if (!/^\S+@\S+\.\S+$/.test(email)) return alert('Valid email address is required.');
  if (D.users.some(u => u.email.toLowerCase() === email)) return alert('A user with this email already exists.');

  const hasAdmin = $('#addRoleAdmin') && $('#addRoleAdmin').checked;
  const hasInstr = $('#addRoleInstr') && $('#addRoleInstr').checked;

  const roles = [];
  if (hasAdmin) roles.push('admin');
  if (hasInstr) roles.push('instructor');

  if (!roles.length) return alert('Select at least one role for this team member.');

  let centers = [];
  if (hasC()) {
    const checkedCenters = document.querySelectorAll('input[name="addMemberCenters"]:checked');
    centers = Array.from(checkedCenters).map(cb => cb.value);
    if (!centers.length && D.centers.length) centers = [D.centers[0].id];
  }

  const subjInput = $('#addTmSubject');
  const subject = subjInput ? subjInput.value.trim() : 'Physics';

  const newId = id('t');
  const newMember = {
    id: newId,
    name,
    email,
    phone: phone || '98' + String(10000000 + Math.floor(Math.random() * 89999999)),
    subject: subject || 'Physics',
    regDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    role: roles.includes('admin') ? 'admin' : roles[0],
    roles,
    centers,
    status: 'Active'
  };

  D.users.push(newMember);
  save();
  closeM(1);
  render();
  toast(`Team member ${name} added with ${roles.join(' + ')} role(s)!`);
}

function ec(i) {
  if (!hasC()) return;
  const c = i ? D.centers.find(x => x.id === i) : {};
  modal(
    i ? 'Edit center' : 'Add center',
    F('name', 'Center name *', 'text', [], c.name) + F('code', 'Code', 'text', [], c.code) + F('city', 'City', 'text', [], c.city) + F('status', 'Status', 'select', ['Active', 'Inactive'], c.status || 'Active'),
    o => {
      if (!o.name) return 'Center name is required.';
      up('centers', i, o, { status: 'Active' });
    },
    i ? 'Center updated' : 'Center created'
  );
}

function ea(i) {
  if (!hasC()) return;
  const u = U(i);
  modal(
    'Assign centers · ' + E(u.name),
    F('centers', 'Centers', 'multi', allC(), u.centers),
    o => {
      if (!o.centers.length) return 'Pick at least one center.';
      u.centers = o.centers;
    },
    'Assignments updated'
  );
}

function iv(role) {
  modal(
    'Invite ' + role,
    F('name', 'Full name (optional)') +
      F('email', 'Email *', 'email') +
      (role === 'instructor' ? F('subject', 'Teaching subject *', 'select', SUBJ.map(s => [s, s]), 'Physics') : '') +
      (hasC() ? F('centers', 'Assigned centers', 'multi', allC(), [D.centers[0].id]) : '') +
      F('msg', 'Personal message (optional)', 'area'),
    o => {
      if (!/^\S+@\S+\.\S+$/.test(o.email)) return 'Enter a valid email.';
      o.email = o.email.toLowerCase();
      if (D.users.some(u => u.email === o.email)) return 'This person already has an account.';
      if (D.invites.some(x => x.email === o.email && x.status === 'Pending')) return 'A pending invitation already exists.';
      if (hasC() && !o.centers.length) return 'Pick at least one center.';
      const t = id('tok');
      D.invites.unshift({ id: id('i'), email: o.email, name: o.name, role, subject: o.subject || (role === 'instructor' ? 'Physics' : ''), centers: hasC() ? o.centers : [], status: 'Pending', tok: t, sent: 1 });
      D.out.unshift({ id: id('o'), to: o.email, sub: `You’re invited to ${D.inst} as ${role}`, at: new Date().toLocaleString(), link: 'https://unified.demo/invite/' + t });
      note('u1', `Invitation sent to ${o.email} (demo).`);
    },
    'Invitation queued in Demo Outbox',
    'Send invite'
  );
}

const ia = i => {
    const v = D.invites.find(x => x.id === i);
    D.users.push({ id: id('u'), name: v.name || v.email.split('@')[0], email: v.email, role: v.role, subject: v.subject || (v.role === 'instructor' ? 'Physics' : ''), centers: v.centers || [], status: 'Active' });
    v.status = 'Accepted';
    note('u1', `${v.email} accepted the invitation.`);
    save();
    render();
    toast('Account created from invitation');
  },
  ir = i => {
    const v = D.invites.find(x => x.id === i);
    v.sent++;
    save();
    render();
    toast('Invitation resent (demo)');
  },
  iw = i =>
    cfm('Revoke this invitation? The link will stop working.', () => {
      D.invites.find(x => x.id === i).status = 'Revoked';
      save();
      render();
      toast('Invitation revoked');
    });

function eb(i) {
  if (!hasC()) return;
  const b = i ? D.batches.find(x => x.id === i) : {};
  modal(
    i ? 'Edit batch' : 'Add batch',
    F('name', 'Batch name *', 'text', [], b.name) +
      F('center', 'Center', 'select', D.centers.filter(c => cs().includes(c.id)).map(c => [c.id, c.name]), b.center) +
      F('courses', 'Courses (label)', 'text', [], b.courses) +
      F('cap', 'Capacity', 'number', [], b.cap || 25),
    o => {
      if (!o.name) return 'Batch name is required.';
      o.cap = +o.cap || 25;
      up('batches', i, o, {});
    },
    i ? 'Batch updated' : 'Batch created'
  );
}

function pb(i) {
  const c = D.courses.find(x => x.id === i);
  c.status = c.status === 'Published' ? 'Draft' : 'Published';
  save();
  render();
  toast('Course ' + c.status.toLowerCase());
}

/* Course Details */
const TABS = ['Overview', 'Lessons', 'Notes', 'Live classes', 'Recordings', 'Teachers', 'Tests', 'Reviews', 'Announcements'];
const sct = t => {
  S.ct = t;
  render();
};
const oc = i => {
  S.p = 'courses';
  S.cv = i;
  S.ct = 'Overview';
  render();
};
const ob = i => {
  S.p = 'batches';
  S.bv = i;
  S.bt = 'Overview';
  render();
};

function ex(c) {
  if (c.notes) return c;
  const t = U(c.instr)?.name || 'Faculty';
  c.notes = [
    { t: c.name + ' formula cheat sheet', s: 'PDF · 1.4 MB' },
    { t: 'Module 1 comprehensive notes', s: 'PDF · 820 KB' }
  ];
  c.live = [
    { t: c.lessons[0] + ' live lecture', d: 'Tomorrow, 5:00 PM', who: t, st: 'Scheduled' },
    { t: 'Live Doubt Clearing Forum', d: 'Friday, 6:30 PM', who: t, st: 'Scheduled' }
  ];
  c.rec = c.lessons.map((l, i) => ({ t: l + ' full session', m: 30 + i * 8 + ' min' }));
  c.rev = [
    { n: 'Isha G.', r: 5, t: 'Crystal clear explanations and incredible study sheets.' },
    { n: 'Rohan D.', r: 5, t: 'The live doubt solving helped me secure top rank in mocks.' }
  ];
  c.ann = [{ t: 'Welcome to ' + c.name, d: '2 days ago', b: 'Classes commence this week. Check the schedule.' }];
  return c;
}

const AD = {
  notes: ['Upload note', [['t', 'Title *']], o => ({ t: o.t, s: 'PDF · uploaded' })],
  live: ['Schedule class', [['t', 'Class title *'], ['d', 'Date and time']], o => ({ t: o.t, d: o.d || 'To be announced', who: me().name, st: 'Scheduled' })],
  rec: ['Add recording', [['t', 'Title *'], ['m', 'Duration (e.g. 45 min)']], o => ({ t: o.t, m: o.m || '—' })],
  ann: ['Post announcement', [['t', 'Title *'], ['b', 'Message', 'area']], o => ({ t: o.t, d: 'Just now', b: o.b })],
  rev: ['Write a review', [['t', 'Your feedback *'], ['r', 'Rating', 'select', [5, 4, 3, 2, 1]]], o => ({ n: me().name, r: +o.r, t: o.t })]
};

function ad(i, key) {
  const c = D.courses.find(x => x.id === i),
    [l, fs, mk] = AD[key];
  modal(
    l,
    fs.map(f => F(f[0], f[1], f[2] || 'text', f[3] || [])).join(''),
    o => {
      if (!o.t) return 'The title is required.';
      c[key].unshift(mk(o));
      if (key === 'ann') D.users.filter(s => s.role === 'student' && s.courses.includes(i)).forEach(s => note(s.id, 'Announcement: ' + o.t));
    },
    'Saved',
    l
  );
}

const tw = (i, j) => {
  const k2 = S.uid + '|' + i,
    p = (D.prog[k2] = D.prog[k2] || []),
    x = p.indexOf(j);
  x < 0 ? p.push(j) : p.splice(x, 1);
  save();
  render();
};

function cdet() {
  const c = ex(D.courses.find(x => x.id === S.cv)),
    r = me().role,
    tab = S.ct || 'Overview',
    stf = r !== 'student',
    sd = stu().filter(s => s.courses.includes(c.id)),
    ab = (key, show = stf) => (show ? `<div class=bar><button class=b1 onclick="ad('${c.id}','${key}')">${AD[key][0]}</button></div>` : ''),
    p = D.prog[S.uid + '|' + c.id] || [],
    tt = D.tests.filter(t => t.course === c.id);

  let B = '';
  if (tab === 'Overview')
    B = `
      <div class="metric-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:18px">
        <div class=metric-card><div><div class=mc-val>${c.lessons.length}</div><div class=mc-label>Lessons</div></div></div>
        <div class=metric-card><div><div class=mc-val>${sd.length}</div><div class=mc-label>Enrolled Students</div></div></div>
        <div class=metric-card><div><div class=mc-val>4.9 ★</div><div class=mc-label>Average Rating</div></div></div>
        <div class=metric-card><div><div class=mc-val>${c.price ? R(c.price) : 'Free'}</div><div class=mc-label>Access Fee</div></div></div>
      </div>
      <div class=cd>
        <b>About this program</b>
        ${c.desc ? `<span>${E(c.desc)}</span>` : ''}
        ${c.st && c.st.length ? `<small>Subjects & faculty: ${c.st.map(r => E(r.s) + ' — ' + E(U(r.t)?.name || 'TBA')).join(' · ')}</small>` : ''}
        ${hasC() ? `<small>Delivery mode: ${E(c.mode || 'Both')} · Available at: ${E(cl(c.centers))}</small>` : ''}
        <small>Lead instructor: ${E(U(c.instr)?.name || 'Not assigned')}</small>
        ${r === 'student' ? `<div class=bar2 style="margin-top:10px"><i style="width:${pct(S.uid, c)}%"></i></div><small>${pct(S.uid, c)}% completed</small>` : ''}
      </div>`;
  else if (tab === 'Lessons')
    B =
      (stf ? `<div class=bar><button class=b1 onclick="al('${c.id}')">+ Add lesson</button></div>` : '') +
      `<div class=task-list>${c.lessons.map((l, j) => `<div class=task-item><div class=task-left><div class=task-ico>${ico('file')}</div><div><b>Lesson ${j + 1}: ${E(l)}</b><small>Core syllabus module</small></div></div>${r === 'student' ? `<label class=ck><input type=checkbox ${p.includes(j) ? 'checked' : ''} onclick="tw('${c.id}',${j})"> Completed</label>` : ''}</div>`).join('')}</div>`;
  else if (tab === 'Notes')
    B =
      ab('notes') +
      `<div class=task-list>${c.notes.map(x => `<div class=task-item><div class=task-left><div class=task-ico>${ico('file')}</div><div><b>${E(x.t)}</b><small>${x.s}</small></div></div><button class=b2 onclick="toast('Demo: file simulated download')">Download</button></div>`).join('')}</div>`;
  else if (tab === 'Live classes')
    B =
      ab('live') +
      `<div class=task-list>${c.live.map(x => `<div class=task-item><div class=task-left><div class=task-ico>${ico('video')}</div><div><b>${E(x.t)}</b><small>${x.d} · ${E(x.who)}</small></div></div>${st(x.st)}<button class=b2 onclick="toast('Opening classroom room...')">${stf ? 'Start' : 'Join'}</button></div>`).join('')}</div>`;
  else if (tab === 'Recordings')
    B =
      ab('rec') +
      `<div class=task-list>${c.rec.map(x => `<div class=task-item><div class=task-left><div class=task-ico>${ico('video')}</div><div><b>${E(x.t)}</b><small>${x.m}</small></div></div><button class=b2 onclick="toast('Playing video recording...')">Watch</button></div>`).join('')}</div>`;
  else if (tab === 'Teachers')
    B = `<div class=task-list>${D.users.filter(u => (u.role === 'instructor' || (u.roles && u.roles.includes('instructor'))) && (!hasC() || u.centers.some(x => c.centers.includes(x)))).map(u => `<div class=task-item><div class=task-left><img src="${av(u)}" style="width:34px;height:34px;border-radius:50%"><div><b>${E(u.name)}</b><small>${E(u.email)} · <span class="pill-badge pill-blue" style="font-size:10.5px">${E(u.subject || 'Physics')}</span></small></div></div>${u.id === c.instr ? st('Lead Teacher') : ''}</div>`).join('')}</div>`;
  else if (tab === 'Tests')
    B =
      (stf ? '<div class=bar><button class=b1 onclick=et()>+ Create test</button></div>' : '') +
      `<div class=task-list>${tt.map(t => `<div class=task-item><div class=task-left><div class=task-ico>${ico('tests')}</div><div><b>${E(t.name)}</b><small>${t.qs.length} questions · ${t.min} mins</small></div></div>${r === 'student' ? `<button class=b1 onclick="tk('${t.id}')">${D.res.some(y => y.tid === t.id && y.sid === S.uid) ? 'Retake' : 'Start'}</button>` : ''}</div>`).join('')}</div>`;
  else if (tab === 'Reviews')
    B = ab('rev', r === 'student') + `<div class=task-list>${c.rev.map(x => `<div class=task-item><div><b>${E(x.n)} · ${'★'.repeat(x.r)}</b><small style="display:block;margin-top:4px">${E(x.t)}</small></div></div>`).join('')}</div>`;
  else
    B = ab('ann') + `<div class=task-list>${c.ann.map(x => `<div class=cd><b>${E(x.t)}</b><small>${x.d}</small><p style="margin-top:6px;font-size:13px">${E(x.b)}</p></div>`).join('')}</div>`;

  return (
    `<div class=hd><div><button class=b2 onclick="S.cv=null;render()">‹ Back to courses</button><h1 style="margin-top:10px">${E(c.name)}</h1><p>${c.code} · ${st(c.status)}</p></div></div>` +
    `<div class=tabs style="display:flex;gap:4px;border-bottom:1px solid var(--b);margin-bottom:16px">${TABS.map(t => `<button class="b2 ${t === tab ? 'on' : ''}" style="${t === tab ? 'background:#0f172a;color:#fff;border-color:#0f172a' : ''}" onclick="sct('${t}')">${t}</button>`).join('')}</div>` +
    B
  );
}

function al(i) {
  const c = D.courses.find(x => x.id === i);
  modal(
    'Add lesson · ' + E(c.name),
    F('t', 'Lesson title *'),
    o => {
      if (!o.t) return 'Title is required.';
      c.lessons.push(o.t);
    },
    'Lesson added'
  );
}

function et() {
  const cc = crs().map(c => [c.id, c.name]);
  const content = `
    <div style="font-size:13px;line-height:1.6">
      <div class="g2">
        <label>Exam / Test Title *<input id="newTestName" placeholder="e.g. JEE Main Full Mock Exam 05" value="Advanced Master Mock Assessment"></label>
        <label>Target Course *
          <select id="newTestCourse">
            ${cc.map(c => `<option value="${c[0]}">${E(c[1])}</option>`).join('')}
          </select>
        </label>
      </div>

      <div class="g2">
        <label>Duration (Minutes) *<input type="number" id="newTestMin" value="20"></label>
        <label>Subject Sections (Comma separated)<input id="newTestSecs" value="Physics, Chemistry, Mathematics"></label>
      </div>

      <div class="g2">
        <label>Positive Marks (Correct)<input type="number" id="newTestPos" value="4"></label>
        <label>Negative Marks (Incorrect)<input type="number" id="newTestNeg" value="1"></label>
      </div>

      <div class="g2">
        <label>Scientific Calculator Allowed?
          <select id="newTestCalc">
            <option value="yes" selected>Yes (Allowed)</option>
            <option value="no">No (Prohibited)</option>
          </select>
        </label>
        <label>Question Type
          <select id="newTestQType">
            <option value="MCQ" selected>Single Choice MCQ</option>
            <option value="NAT">Numerical Answer Type (NAT)</option>
            <option value="MAQ">Multiple Answer (MAQ)</option>
            <option value="TrueFalse">True / False</option>
            <option value="CODING">Coding Assessment</option>
          </select>
        </label>
      </div>

      <label>Sample Question Text *<textarea id="newTestQ" rows="2" placeholder="Enter question formulation...">What is the acceleration of a 5 kg mass subjected to a net external force of 25 N?</textarea></label>

      <div class="g2">
        <label>Option A<input id="newTestOptA" value="A) 2 m/s²"></label>
        <label>Option B<input id="newTestOptB" value="B) 5 m/s²"></label>
      </div>
      <div class="g2">
        <label>Option C<input id="newTestOptC" value="C) 10 m/s²"></label>
        <label>Option D<input id="newTestOptD" value="D) 125 m/s²"></label>
      </div>

      <div class="g2">
        <label>Correct Option
          <select id="newTestAns">
            <option value="0">A</option>
            <option value="1" selected>B</option>
            <option value="2">C</option>
            <option value="3">D</option>
          </select>
        </label>
        <label>Step-by-Step Solution / Concept<input id="newTestSol" value="Newton's Second Law: a = F / m = 25 N / 5 kg = 5 m/s²."></label>
      </div>
    </div>
  `;

  modal(
    'Create CBT Examination Test',
    content,
    null,
    '',
    '',
    `
      <button class="b2" onclick="closeM(1)">Cancel</button>
      <button class="b1" onclick="submitNewCBTTest()">Publish CBT Test</button>
    `
  );
  $('.md').style.maxWidth = '680px';
}

function submitNewCBTTest() {
  const name = $('#newTestName')?.value.trim();
  const course = $('#newTestCourse')?.value;
  const min = +($('#newTestMin')?.value || 20);
  const secs = ($('#newTestSecs')?.value || 'Physics, Chemistry, Mathematics').split(',').map(s => s.trim()).filter(Boolean);
  const pos = +($('#newTestPos')?.value || 4);
  const neg = +($('#newTestNeg')?.value || 1);
  const calc = $('#newTestCalc')?.value === 'yes';
  const qType = $('#newTestQType')?.value || 'MCQ';
  const q = $('#newTestQ')?.value.trim();
  const optA = $('#newTestOptA')?.value.trim();
  const optB = $('#newTestOptB')?.value.trim();
  const optC = $('#newTestOptC')?.value.trim();
  const optD = $('#newTestOptD')?.value.trim();
  const ans = +($('#newTestAns')?.value || 0);
  const sol = $('#newTestSol')?.value.trim();

  if (!name) return alert('Test title is required.');
  if (!q) return alert('Question text is required.');

  const newTest = {
    id: id('t_'),
    name,
    course,
    min,
    total_qs: 4,
    max_score: pos * 4,
    marks_positive: pos,
    marks_negative: neg,
    is_calc_allow: calc,
    lang: 'EN',
    sections: secs,
    qs: [
      {
        id: 'q_custom_1',
        sec: secs[0] || 'Physics',
        qtype: qType,
        q,
        hi_q: q,
        o: [optA, optB, optC, optD].filter(Boolean),
        hi_o: [optA, optB, optC, optD].filter(Boolean),
        a: ans,
        pos,
        neg,
        sol
      },
      ...CBT_TESTS_SEED[0].qs.slice(1, 4)
    ]
  };

  D.tests = D.tests || CBT_TESTS_SEED;
  D.tests.unshift(newTest);
  D.users.filter(s => s.role === 'student' && s.courses.includes(course)).forEach(s => note(s.id, `New CBT Test published: ${name}`));
  save();
  closeM(1);
  render();
  toast(`Test “${name}” published to students!`);
}

function pm(i) {
  const v = D.inv.find(x => x.id === i),
    b = v.total - v.paid,
    s = me().role === 'student';
  modal(
    s ? 'Pay now (demo)' : 'Record payment',
    `<p class=mt>${E(U(v.sid).name)} · balance ${R(b)}</p>` +
      F('amt', 'Amount (₹)', 'number', [], b) +
      F('mth', 'Method', 'select', ['UPI', 'Cash', 'Card', 'Bank transfer']) +
      (s ? '<small>Simulated payment, no money moves.</small>' : ''),
    o => {
      const a = +o.amt;
      if (!(a > 0) || a > b) return `Enter an amount between 1 and ${b}.`;
      v.paid += a;
      D.pay.push({ id: id('p'), inv: i, amt: a, m: o.mth, at: new Date().toLocaleDateString() });
      note(v.sid, `Payment of ${R(a)} received (demo).`);
    },
    'Payment recorded',
    s ? 'Pay (demo)' : 'Save payment'
  );
}

const rm = i => {
  const v = D.inv.find(x => x.id === i);
  D.out.unshift({ id: id('o'), to: U(v.sid).email, sub: `Fee reminder: ${R(v.total - v.paid)} due`, at: new Date().toLocaleString(), link: 'https://unified.demo/pay/' + i });
  note(v.sid, 'Fee reminder: balance due.');
  save();
  toast('Reminder added to Demo Outbox');
};

/* ============================================================== */
/* 27-OPTION TEST ACTIONS DROPDOWN SYSTEM                         */
/* ============================================================== */

const TEST_ACTION_ITEMS = [
  { key: 'details', label: 'View Details', icon: IC.file },
  { key: 'edit', label: 'Edit', icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>' },
  { key: 'add_manual', label: 'Add Question Manualy', icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>' },
  { key: 'add_docx', label: 'Add Question DOCX', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
  { key: 'add_pdf', label: 'Add Question PDF', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
  { key: 'update_answers_docx', label: 'Update Answers/Solutions DOCX', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 12 18 16 13"/>' },
  { key: 'add_excel', label: 'Add Question Excel', icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>' },
  { key: 'add_qbank', label: 'Add Question from Question Bank', icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>' },
  { key: 'arrange_q', label: 'Arrange Question', icon: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
  { key: 'view_q', label: 'View Question', icon: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' },
  { key: 'print_test', label: 'Print Test', icon: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>' },
  { key: 'merge_offline', label: 'Merge Offline Report', icon: '<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/><polyline points="18 8 22 12 18 16"/><line x1="10" y1="12" x2="22" y2="12"/>' },
  { key: 'student_feedback', label: 'Student Feedback', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  { key: 'bonus', label: 'Bonus Marks', icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
  { key: 'reports', label: 'Reports', icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
  { key: 'subjective', label: 'Subjective Questions', icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>' },
  { key: 'enable_cbt', label: 'Enable CBT', icon: '<polygon points="5 3 19 12 5 21 5 3"/>' },
  { key: 'duplicate', label: 'Duplicate Test', icon: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' },
  { key: 'export_excel', label: 'Export Test (Excel)', icon: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>' },
  { key: 'duplicate_no_qs', label: 'Duplicate Test Without Qs', icon: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' },
  { key: 'update_reports', label: 'Update Reports', icon: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>' },
  { key: 'repair', label: 'Test Repair', icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' },
  { key: 'assign_series', label: 'Assign to Series', icon: '<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="8" y1="12" x2="16" y2="12"/>' },
  { key: 'assign_teacher', label: 'Assign to Teacher', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>' },
  { key: 'take_test', label: 'Take Test', icon: '<polygon points="5 3 19 12 5 21 5 3"/>' },
  { key: 'share_link', label: 'Share Test Link', icon: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' },
  { key: 'delete', label: 'Delete', icon: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>', danger: true }
];

function openTestActionsMenu(event, tid) {
  event.stopPropagation();
  closeTestActionsMenu();
  const t = (D.tests || CBT_TESTS_SEED).find(x => x.id === tid);
  if (!t) return;

  const btn = event.currentTarget;
  const rect = btn.getBoundingClientRect();

  const menu = document.createElement('div');
  menu.id = 'activeTestActionsMenu';
  menu.className = 'test-actions-menu';

  let top = rect.bottom + 6;
  let left = rect.right - 240;
  if (top + 380 > window.innerHeight) {
    top = Math.max(10, rect.top - 386);
  }
  if (left < 10) left = 10;

  menu.style.top = top + 'px';
  menu.style.left = left + 'px';

  menu.innerHTML = `
    <div class="test-actions-header">
      <span>Actions · ${E(t.name.slice(0, 15))}...</span>
      <button type="button" onclick="closeTestActionsMenu()" style="background:none;border:0;cursor:pointer;color:var(--m);font-size:16px;line-height:1">×</button>
    </div>
    <input type="text" class="test-actions-search" placeholder="Search 27 actions..." oninput="filterTestActions(this.value)" onclick="event.stopPropagation()">
    <div class="test-actions-list" id="testActionsList">
      ${TEST_ACTION_ITEMS.map(item => `
        <div class="test-action-item ${item.danger ? 'danger' : ''}" data-label="${item.label.toLowerCase()}" onclick="handleTestAction('${item.key}', '${tid}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${item.icon}</svg>
          <span>${item.label}</span>
        </div>
      `).join('')}
    </div>
  `;

  document.body.appendChild(menu);

  setTimeout(() => {
    window.addEventListener('click', closeTestActionsMenuOnOutside);
  }, 10);
}

function filterTestActions(q) {
  const list = document.getElementById('testActionsList');
  if (!list) return;
  const items = list.querySelectorAll('.test-action-item');
  const query = (q || '').trim().toLowerCase();
  items.forEach(el => {
    const lbl = el.getAttribute('data-label') || '';
    el.style.display = lbl.includes(query) ? 'flex' : 'none';
  });
}

function closeTestActionsMenu() {
  const existing = document.getElementById('activeTestActionsMenu');
  if (existing) existing.remove();
  window.removeEventListener('click', closeTestActionsMenuOnOutside);
}

function closeTestActionsMenuOnOutside(e) {
  const menu = document.getElementById('activeTestActionsMenu');
  if (menu && !menu.contains(e.target)) {
    closeTestActionsMenu();
  }
}

function handleTestAction(actionKey, tid) {
  closeTestActionsMenu();
  const t = (D.tests || CBT_TESTS_SEED).find(x => x.id === tid);
  if (!t) return;

  switch (actionKey) {
    case 'details':
      showTestDetailsModal(t);
      break;
    case 'edit':
      editTestModal(t);
      break;
    case 'add_manual':
      addQuestionManuallyModal(t);
      break;
    case 'add_docx':
      importDocxQuestionsModal(t);
      break;
    case 'add_pdf':
      importPdfQuestionsModal(t);
      break;
    case 'update_answers_docx':
      updateDocxSolutionsModal(t);
      break;
    case 'add_excel':
      importExcelQuestionsModal(t);
      break;
    case 'add_qbank':
      addFromQBankModal(t);
      break;
    case 'arrange_q':
      arrangeQuestionsModal(t);
      break;
    case 'view_q':
      viewQuestionsModal(t);
      break;
    case 'print_test':
      printTestPaper(t);
      break;
    case 'merge_offline':
      mergeOfflineReportModal(t);
      break;
    case 'student_feedback':
      studentFeedbackModal(t);
      break;
    case 'bonus':
      bonusMarksModal(t);
      break;
    case 'reports':
      showCBTAnalysis('res_sample_1');
      break;
    case 'subjective':
      subjectiveQuestionsModal(t);
      break;
    case 'enable_cbt':
      t.cbt_enabled = t.cbt_enabled === false ? true : false;
      save();
      toast(`CBT mode is now ${t.cbt_enabled !== false ? 'Enabled' : 'Disabled'} for "${t.name}"`);
      rp();
      break;
    case 'duplicate':
      duplicateTest(t, true);
      break;
    case 'export_excel':
      exportTestExcel(t);
      break;
    case 'duplicate_no_qs':
      duplicateTest(t, false);
      break;
    case 'update_reports':
      toast(`Recalculated analytics, percentiles & ranks for "${t.name}"`);
      break;
    case 'repair':
      runTestRepair(t);
      break;
    case 'assign_series':
      assignToSeriesModal(t);
      break;
    case 'assign_teacher':
      assignToTeacherModal(t);
      break;
    case 'take_test':
      startOnlineTest(t.id);
      break;
    case 'share_link':
      shareTestLink(t);
      break;
    case 'delete':
      cfm(`Delete test "${t.name}" permanently? All submissions and question records will be removed.`, () => {
        D.tests = (D.tests || CBT_TESTS_SEED).filter(x => x.id !== t.id);
        save();
        rp();
        toast(`Test "${t.name}" deleted`);
      });
      break;
  }
}

function showTestDetailsModal(t) {
  modal(
    `Test Specifications · ${E(t.name)}`,
    `
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;background:var(--s);padding:14px;border-radius:10px;border:1px solid var(--b)">
          <div>
            <small style="color:var(--mute);text-transform:uppercase;font-size:10.5px">Exam Identifier</small>
            <div style="font-weight:700;font-family:monospace;color:var(--ink)">${t.id}</div>
          </div>
          <div>
            <small style="color:var(--mute);text-transform:uppercase;font-size:10.5px">Duration & Time Limit</small>
            <div style="font-weight:600;color:var(--ink)">${t.min} Minutes</div>
          </div>
          <div>
            <small style="color:var(--mute);text-transform:uppercase;font-size:10.5px">Marking Scheme</small>
            <div style="font-weight:600;color:var(--ink)">+${t.marks_positive || 4} / -${t.marks_negative || 1} Marks</div>
          </div>
          <div>
            <small style="color:var(--mute);text-transform:uppercase;font-size:10.5px">Scientific Calculator</small>
            <div style="font-weight:600;color:var(--ink)">${t.is_calc_allow ? 'Allowed' : 'Prohibited'}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <small style="color:var(--mute);text-transform:uppercase;font-size:10.5px">Exam Sections</small>
            <div style="font-weight:600;color:var(--ink);margin-top:2px">${(t.sections || ['Physics', 'Chemistry', 'Mathematics']).join(', ')}</div>
          </div>
          <div>
            <small style="color:var(--mute);text-transform:uppercase;font-size:10.5px">Language Interface</small>
            <div style="font-weight:600;color:var(--ink);margin-top:2px">${t.lang || 'English + Hindi'}</div>
          </div>
        </div>

        <div style="border-top:1px solid var(--b);padding-top:12px">
          <small style="color:var(--mute);text-transform:uppercase;font-size:10.5px">Questions Bank Composition</small>
          <div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap">
            <span class="pill-badge pill-blue">${(t.qs || []).length} Total Questions</span>
            <span class="pill-badge pill-green">${t.max_score || (t.qs.length * 4)} Max Points</span>
            <span class="pill-badge pill-purple">CBT Active</span>
          </div>
        </div>
      </div>
    `,
    null,
    '',
    '',
    `
      <button class="b2" onclick="closeM(1)">Close</button>
      <button class="b2" onclick="closeM(1);editTestModal(U('${t.id}')||D.tests.find(x=>x.id==='${t.id}'))">Edit Test</button>
      <button class="b1" onclick="closeM(1);startOnlineTest('${t.id}')">Take Test</button>
    `
  );
}

function editTestModal(t) {
  modal(
    `Edit Test · ${E(t.name)}`,
    `
      <div style="display:grid;gap:12px">
        <label>Exam Title *<input id="editTestName" value="${E(t.name)}"></label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label>Duration (Minutes)<input type="number" id="editTestMin" value="${t.min || 20}"></label>
          <label>Language<input id="editTestLang" value="${E(t.lang || 'English + Hindi')}"></label>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label>Positive Marks<input type="number" id="editTestPos" value="${t.marks_positive || 4}"></label>
          <label>Negative Marks<input type="number" id="editTestNeg" value="${t.marks_negative || 1}"></label>
        </div>
        <label>Sections (Comma separated)<input id="editTestSecs" value="${(t.sections || ['Physics', 'Chemistry', 'Mathematics']).join(', ')}"></label>
        <label>Scientific Calculator
          <select id="editTestCalc">
            <option value="yes" ${t.is_calc_allow ? 'selected' : ''}>Allowed</option>
            <option value="no" ${!t.is_calc_allow ? 'selected' : ''}>Prohibited</option>
          </select>
        </label>
      </div>
    `,
    () => {
      const name = $('#editTestName').value.trim();
      if (!name) return toast('Test title cannot be empty');
      t.name = name;
      t.min = parseInt($('#editTestMin').value, 10) || 20;
      t.lang = $('#editTestLang').value.trim() || 'English';
      t.marks_positive = parseFloat($('#editTestPos').value) || 4;
      t.marks_negative = parseFloat($('#editTestNeg').value) || 1;
      t.sections = $('#editTestSecs').value.split(',').map(s => s.trim()).filter(Boolean);
      t.is_calc_allow = $('#editTestCalc').value === 'yes';
      save();
      rp();
      toast('Test configurations saved!');
    },
    '',
    'Save Changes'
  );
}

function addQuestionManuallyModal(t) {
  modal(
    `Add Question Manually · ${E(t.name)}`,
    `
      <div style="display:grid;gap:12px">
        <label>Section
          <select id="manQSec">
            ${(t.sections || ['Physics', 'Chemistry', 'Mathematics']).map(s => `<option value="${s}">${s}</option>`).join('')}
          </select>
        </label>
        <label>Question Formulation *
          <textarea id="manQText" rows="3" placeholder="Enter question description, mathematical formula or statement..."></textarea>
        </label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <label>Option A *<input id="manQOptA" placeholder="Option A text"></label>
          <label>Option B *<input id="manQOptB" placeholder="Option B text"></label>
          <label>Option C<input id="manQOptC" placeholder="Option C text"></label>
          <label>Option D<input id="manQOptD" placeholder="Option D text"></label>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label>Correct Answer
            <select id="manQAns">
              <option value="0">A</option>
              <option value="1">B</option>
              <option value="2">C</option>
              <option value="3">D</option>
            </select>
          </label>
          <label>Weightage Marks<input type="number" id="manQMarks" value="${t.marks_positive || 4}"></label>
        </div>
        <label>Detailed Solution & Explanation
          <textarea id="manQSol" rows="2" placeholder="Step-by-step scientific solution..."></textarea>
        </label>
      </div>
    `,
    () => {
      const qText = $('#manQText').value.trim();
      const optA = $('#manQOptA').value.trim();
      const optB = $('#manQOptB').value.trim();
      const optC = $('#manQOptC').value.trim();
      const optD = $('#manQOptD').value.trim();
      const ans = parseInt($('#manQAns').value, 10) || 0;
      const sec = $('#manQSec').value;
      const sol = $('#manQSol').value.trim();

      if (!qText) return toast('Question text is required');
      if (!optA || !optB) return toast('At least Option A and Option B are required');

      t.qs = t.qs || [];
      t.qs.push({
        id: 'q_' + Math.random().toString(36).substring(2, 7),
        sec,
        qtype: 'MCQ',
        q: qText,
        hi_q: qText,
        o: [optA, optB, optC, optD].filter(Boolean),
        hi_o: [optA, optB, optC, optD].filter(Boolean),
        a: ans,
        pos: t.marks_positive || 4,
        neg: t.marks_negative || 1,
        sol: sol || 'Standard solution derived from first principles.'
      });
      t.max_score = t.qs.length * (t.marks_positive || 4);
      save();
      rp();
      toast('Question added successfully!');
    },
    '',
    'Add Question to Test'
  );
}

function importDocxQuestionsModal(t) {
  modal(
    'Import Questions from DOCX File',
    `
      <div style="display:flex;flex-direction:column;gap:14px;text-align:center;padding:12px 6px">
        <div style="border:2px dashed var(--b);border-radius:12px;padding:32px 20px;background:var(--s);cursor:pointer" onclick="$('#docxInputSim').click()">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#0284c7" stroke-width="2" style="margin-bottom:8px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div style="font-weight:600;font-size:14px;color:var(--ink)">Drag & Drop Word Document (.docx) here</div>
          <small style="color:var(--mute);margin-top:4px;display:block">Or click to browse file from your computer</small>
          <input type="file" id="docxInputSim" accept=".docx" style="display:none" onchange="$('#docxFileName').textContent=this.files[0]?this.files[0].name:'Sample_Mock_Exam_Paper.docx'">
        </div>
        <div id="docxFileName" style="font-weight:600;font-size:12.5px;color:#0284c7">Sample_Physics_Mock_Paper.docx</div>
        <div style="background:var(--card);padding:10px 14px;border-radius:8px;border:1px solid var(--b);text-align:left;font-size:12px;color:var(--mute)">
          <b>Supported Syntax Format:</b><br>
          • <b>Question 1.</b> Question text statement<br>
          • <b>(A)</b> Option 1 &nbsp; <b>(B)</b> Option 2 &nbsp; <b>(C)</b> Option 3 &nbsp; <b>(D)</b> Option 4<br>
          • <b>Answer:</b> B &nbsp; | &nbsp; <b>Solution:</b> Step-by-step breakdown
        </div>
      </div>
    `,
    () => {
      t.qs = t.qs || [];
      t.qs.push({
        id: 'q_docx_' + Date.now(),
        sec: t.sections && t.sections[0] ? t.sections[0] : 'Physics',
        qtype: 'MCQ',
        q: 'Imported from DOCX: A particle moves in a circle of radius 20 cm with a linear speed of 10 m/s. Find the angular velocity.',
        hi_q: 'DOCX से आयातित प्रश्न',
        o: ['25 rad/s', '50 rad/s', '100 rad/s', '200 rad/s'],
        hi_o: ['25 rad/s', '50 rad/s', '100 rad/s', '200 rad/s'],
        a: 1,
        pos: t.marks_positive || 4,
        neg: t.marks_negative || 1,
        sol: 'Angular velocity ω = v / r = 10 / 0.20 = 50 rad/s.'
      });
      t.max_score = t.qs.length * (t.marks_positive || 4);
      save();
      rp();
      toast('Successfully parsed and imported questions from DOCX!');
    },
    '',
    'Process & Import DOCX'
  );
}

function importPdfQuestionsModal(t) {
  modal(
    'Import Questions from PDF Booklet',
    `
      <div style="display:flex;flex-direction:column;gap:14px;text-align:center;padding:12px 6px">
        <div style="border:2px dashed var(--b);border-radius:12px;padding:32px 20px;background:var(--s);cursor:pointer" onclick="$('#pdfInputSim').click()">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#ef4444" stroke-width="2" style="margin-bottom:8px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          <div style="font-weight:600;font-size:14px;color:var(--ink)">Select PDF Question Paper</div>
          <small style="color:var(--mute);margin-top:4px;display:block">Automatic OCR text recognition for questions and diagrams</small>
          <input type="file" id="pdfInputSim" accept=".pdf" style="display:none" onchange="$('#pdfFileName').textContent=this.files[0]?this.files[0].name:'Question_Bank_2026.pdf'">
        </div>
        <div id="pdfFileName" style="font-weight:600;font-size:12.5px;color:#ef4444">NEET_UG_Sample_Paper.pdf</div>
      </div>
    `,
    () => {
      toast('Extracted 4 high-yield questions from PDF booklet!');
      rp();
    },
    '',
    'Extract & Import PDF'
  );
}

function updateDocxSolutionsModal(t) {
  modal(
    'Update Answers & Solutions via DOCX',
    `
      <div style="display:flex;flex-direction:column;gap:14px;padding:10px 4px">
        <p style="font-size:13px;color:var(--mute)">Upload official solution document to batch-update answer keys and explanations for all ${(t.qs || []).length} questions.</p>
        <div style="border:1.5px dashed var(--b);border-radius:8px;padding:24px;text-align:center;background:var(--s)">
          <div style="font-weight:600;color:var(--ink)">Answers_Key_Official_Solutions.docx</div>
          <small style="color:var(--mute)">Ready for synchronization</small>
        </div>
      </div>
    `,
    () => {
      toast('Solutions and answer keys updated across all test questions!');
    },
    '',
    'Update Answers Now'
  );
}

function importExcelQuestionsModal(t) {
  modal(
    'Import Questions from Excel (.xlsx / .csv)',
    `
      <div style="display:flex;flex-direction:column;gap:14px;padding:10px 4px">
        <p style="font-size:13px;color:var(--mute)">Upload standard tabular test questions spreadsheet with columns: Question, OptionA, OptionB, OptionC, OptionD, AnswerKey, Explanation.</p>
        <div style="border:1.5px dashed var(--b);border-radius:8px;padding:24px;text-align:center;background:var(--s)">
          <div style="font-weight:600;color:#16a34a">Excel_Test_Questions_Template.xlsx</div>
          <small style="color:var(--mute);display:block;margin-top:4px"><a href="#" onclick="toast('Downloading Excel template...');return false" style="color:#0284c7">Download Blank Excel Template</a></small>
        </div>
      </div>
    `,
    () => {
      toast('Parsed and imported 12 questions from Excel spreadsheet!');
      rp();
    },
    '',
    'Import Excel Questions'
  );
}

function addFromQBankModal(t) {
  const sampleBank = [
    { q: 'What is the SI unit of magnetic flux density?', o: ['Weber', 'Tesla', 'Henry', 'Gauss'], a: 'Tesla', sec: 'Physics' },
    { q: 'Which orbital has zero angular nodes?', o: ['1s', '2p', '3d', '4f'], a: '1s', sec: 'Chemistry' },
    { q: 'Evaluate the limit as x approaches 0 for sin(5x)/x.', o: ['0', '1', '5', 'Undefined'], a: '5', sec: 'Mathematics' },
    { q: 'Which organelle is known as the powerhouse of the cell?', o: ['Ribosome', 'Mitochondria', 'Golgi Apparatus', 'Lysosome'], a: 'Mitochondria', sec: 'Biology' }
  ];

  modal(
    'Add Questions from Question Bank Repository',
    `
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <small style="color:var(--mute);text-transform:uppercase;font-size:11px;font-weight:700">6,400+ Curated National Exam Questions</small>
          <span class="pill-badge pill-blue">Repository Active</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;max-height:280px;overflow-y:auto">
          ${sampleBank.map((item, idx) => `
            <label class="ck" style="border:1px solid var(--b);border-radius:8px;padding:10px 12px;background:var(--s);display:flex;align-items:flex-start;gap:10px;cursor:pointer">
              <input type="checkbox" name="qbank_pick" value="${idx}" checked style="margin-top:3px">
              <div style="flex:1">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span class="pill-badge pill-purple" style="font-size:10px">${item.sec}</span>
                  <small style="color:#16a34a;font-weight:600">Correct: ${item.a}</small>
                </div>
                <div style="font-size:12.5px;font-weight:600;color:var(--ink);margin-top:4px">${item.q}</div>
              </div>
            </label>
          `).join('')}
        </div>
      </div>
    `,
    () => {
      sampleBank.forEach(b => {
        t.qs.push({
          id: 'qb_' + Math.random().toString(36).substring(2, 7),
          sec: b.sec,
          qtype: 'MCQ',
          q: b.q,
          hi_q: b.q,
          o: b.o,
          hi_o: b.o,
          a: b.o.indexOf(b.a) >= 0 ? b.o.indexOf(b.a) : 0,
          pos: t.marks_positive || 4,
          neg: t.marks_negative || 1,
          sol: `Correct answer is ${b.a}. Standard standard curriculum derivation.`
        });
      });
      t.max_score = t.qs.length * (t.marks_positive || 4);
      save();
      rp();
      toast('Added selected questions from Question Bank!');
    },
    '',
    'Add Selected to Test'
  );
}

function arrangeQuestionsModal(t) {
  const renderList = () => {
    const box = document.getElementById('arrangeQuestionsList');
    if (!box) return;
    box.innerHTML = (t.qs || []).map((q, idx) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--s);border:1px solid var(--b);border-radius:8px;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-weight:700;font-size:13px;color:var(--m)">#${idx + 1}</span>
          <div>
            <b style="font-size:12.5px;color:var(--ink);display:block">${E((q.q || '').slice(0, 50))}...</b>
            <small style="color:var(--mute)">Section: ${q.sec || 'General'} · Type: ${q.qtype || 'MCQ'}</small>
          </div>
        </div>
        <div style="display:flex;gap:4px">
          <button class="b2" style="padding:2px 8px;font-size:12px" ${idx === 0 ? 'disabled' : ''} onclick="swapQuestionsOrder('${t.id}', ${idx}, ${idx - 1})">↑</button>
          <button class="b2" style="padding:2px 8px;font-size:12px" ${idx === t.qs.length - 1 ? 'disabled' : ''} onclick="swapQuestionsOrder('${t.id}', ${idx}, ${idx + 1})">↓</button>
        </div>
      </div>
    `).join('');
  };

  modal(
    `Arrange Questions Order · ${E(t.name)}`,
    `
      <div style="display:flex;flex-direction:column;gap:10px">
        <p style="font-size:12.5px;color:var(--mute)">Re-order questions using the arrow controls to set examination flow.</p>
        <div id="arrangeQuestionsList" style="display:flex;flex-direction:column;gap:6px;max-height:320px;overflow-y:auto"></div>
      </div>
    `,
    null,
    '',
    '',
    `<button class="b1" onclick="closeM(1);toast('Question order saved');rp()">Done Arranging</button>`
  );

  setTimeout(renderList, 20);
}

function swapQuestionsOrder(tid, i1, i2) {
  const t = (D.tests || CBT_TESTS_SEED).find(x => x.id === tid);
  if (!t || !t.qs || !t.qs[i1] || !t.qs[i2]) return;
  const temp = t.qs[i1];
  t.qs[i1] = t.qs[i2];
  t.qs[i2] = temp;
  save();
  const box = document.getElementById('arrangeQuestionsList');
  if (box) {
    box.innerHTML = (t.qs || []).map((q, idx) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--s);border:1px solid var(--b);border-radius:8px;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-weight:700;font-size:13px;color:var(--m)">#${idx + 1}</span>
          <div>
            <b style="font-size:12.5px;color:var(--ink);display:block">${E((q.q || '').slice(0, 50))}...</b>
            <small style="color:var(--mute)">Section: ${q.sec || 'General'} · Type: ${q.qtype || 'MCQ'}</small>
          </div>
        </div>
        <div style="display:flex;gap:4px">
          <button class="b2" style="padding:2px 8px;font-size:12px" ${idx === 0 ? 'disabled' : ''} onclick="swapQuestionsOrder('${t.id}', ${idx}, ${idx - 1})">↑</button>
          <button class="b2" style="padding:2px 8px;font-size:12px" ${idx === t.qs.length - 1 ? 'disabled' : ''} onclick="swapQuestionsOrder('${t.id}', ${idx}, ${idx + 1})">↓</button>
        </div>
      </div>
    `).join('');
  }
}

function viewQuestionsModal(t) {
  modal(
    `Questions List (${(t.qs || []).length} Questions) · ${E(t.name)}`,
    `
      <div style="display:flex;flex-direction:column;gap:12px;max-height:400px;overflow-y:auto">
        ${(t.qs || []).map((q, idx) => `
          <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <b style="font-size:13px;color:var(--ink)">Question ${idx + 1} · Section: ${E(q.sec || 'General')}</b>
              <span class="pill-badge pill-blue">+${q.pos || 4} / -${q.neg || 1}</span>
            </div>
            <p style="font-size:13px;margin:4px 0 8px;color:var(--ink)">${E(q.q)}</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px">
              ${(q.o || []).map((opt, oIdx) => `
                <div style="padding:6px 10px;border-radius:6px;border:1px solid ${q.a === oIdx ? '#16a34a' : 'var(--b)'};background:${q.a === oIdx ? '#f0fdf4' : 'var(--card)'};font-weight:${q.a === oIdx ? '600' : 'normal'}">
                  ${String.fromCharCode(65 + oIdx)}. ${E(opt)} ${q.a === oIdx ? '✓' : ''}
                </div>
              `).join('')}
            </div>
            ${q.sol ? `<small style="display:block;margin-top:8px;color:var(--mute)"><b>Solution:</b> ${E(q.sol)}</small>` : ''}
          </div>
        `).join('')}
      </div>
    `,
    null,
    '',
    '',
    `<button class="b1" onclick="closeM(1)">Close</button>`
  );
}

function printTestPaper(t) {
  const printWin = window.open('', '_blank', 'width=800,height=900');
  if (!printWin) return toast('Pop-up blocked. Please allow pop-ups to print test.');
  printWin.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Test - ${t.name}</title>
        <style>
          body { font-family: sans-serif; padding: 24px; color: #0f172a; line-height: 1.5; }
          .hdr { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
          .q { margin-bottom: 20px; page-break-inside: avoid; }
          .opt { margin: 4px 0 4px 20px; }
        </style>
      </head>
      <body>
        <div class="hdr">
          <h1>${D.inst} - Examination Paper</h1>
          <h2>${t.name}</h2>
          <p>Duration: ${t.min} Minutes | Max Marks: ${t.max_score || (t.qs.length * 4)} | Marking: +${t.marks_positive || 4} / -${t.marks_negative || 1}</p>
        </div>
        ${(t.qs || []).map((q, idx) => `
          <div class="q">
            <b>Q${idx + 1}. [${q.sec || 'General'}] ${q.q}</b>
            ${(q.o || []).map((opt, oIdx) => `<div class="opt">(${String.fromCharCode(65 + oIdx)}) ${opt}</div>`).join('')}
          </div>
        `).join('')}
      </body>
    </html>
  `);
  printWin.document.close();
  printWin.focus();
  setTimeout(() => { printWin.print(); }, 250);
}

function mergeOfflineReportModal(t) {
  modal(
    'Merge Offline OMR Exam Scores',
    `
      <div style="display:flex;flex-direction:column;gap:12px;padding:10px 4px">
        <p style="font-size:13px;color:var(--mute)">Upload OMR optical scanner export or offline CSV score roster to merge classroom candidates into this test’s percentile rank pool.</p>
        <div style="border:1.5px dashed var(--b);border-radius:8px;padding:24px;text-align:center;background:var(--s)">
          <div style="font-weight:600;color:var(--ink)">OMR_Physical_Answer_Sheets_BatchA.csv</div>
          <small style="color:var(--mute)">Contains 36 evaluated student answer sheets</small>
        </div>
      </div>
    `,
    () => {
      toast('Merged 36 offline candidates into test rankings and percentile curve!');
      rp();
    },
    '',
    'Upload & Merge Scores'
  );
}

function studentFeedbackModal(t) {
  modal(
    `Candidate Feedback & Ratings · ${E(t.name)}`,
    `
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;background:var(--s);padding:14px;border-radius:10px;border:1px solid var(--b)">
          <div>
            <div style="font-size:26px;font-weight:700;color:var(--ink)">4.8 / 5.0</div>
            <small style="color:var(--mute)">Based on 42 student ratings</small>
          </div>
          <div style="text-align:right">
            <span class="pill-badge pill-green">94% Recommended</span>
          </div>
        </div>

        <div>
          <b style="font-size:12.5px;color:var(--ink);display:block;margin-bottom:8px">Perceived Difficulty Breakdown:</b>
          <div style="display:flex;height:8px;border-radius:99px;overflow:hidden;background:#e2e8f0;margin-bottom:6px">
            <div style="width:25%;background:#10b981" title="Easy: 25%"></div>
            <div style="width:55%;background:#0284c7" title="Moderate: 55%"></div>
            <div style="width:20%;background:#ef4444" title="Hard: 20%"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--mute)">
            <span>Easy (25%)</span>
            <span>Moderate / Exam Caliber (55%)</span>
            <span>Challenging (20%)</span>
          </div>
        </div>

        <div style="border-top:1px solid var(--b);padding-top:10px">
          <b style="font-size:12.5px;display:block;margin-bottom:8px">Recent Candidate Comments:</b>
          <div style="display:flex;flex-direction:column;gap:6px;font-size:12.5px">
            <div style="background:var(--card);padding:8px 10px;border-radius:6px;border:1px solid var(--b)">
              <b>Arjun Mehta:</b> High accuracy questions aligned exactly with national JEE mock patterns.
            </div>
            <div style="background:var(--card);padding:8px 10px;border-radius:6px;border:1px solid var(--b)">
              <b>Sara Khan:</b> Timer pressure was realistic, detailed solutions helped clear doubt on Q3.
            </div>
          </div>
        </div>
      </div>
    `,
    null,
    '',
    '',
    `<button class="b1" onclick="closeM(1)">Close</button>`
  );
}

function bonusMarksModal(t) {
  modal(
    'Award Bonus Marks to Candidates',
    `
      <div style="display:grid;gap:12px">
        <label>Select Affected Question
          <select id="bonusQSelect">
            <option value="all">All Questions (General Grace Points)</option>
            ${(t.qs || []).map((q, idx) => `<option value="${idx}">Question #${idx + 1} (${q.sec || 'General'})</option>`).join('')}
          </select>
        </label>
        <label>Bonus Points to Award
          <input type="number" id="bonusPointsVal" value="4" min="1" max="10">
        </label>
        <label>Reason for Bonus Award
          <input id="bonusReason" value="Question Ambiguity / Curriculum Correction">
        </label>
      </div>
    `,
    () => {
      const pts = parseFloat($('#bonusPointsVal').value) || 4;
      D.res.filter(r => r.tid === t.id).forEach(r => {
        r.score += pts;
      });
      save();
      rp();
      toast(`Awarded +${pts} bonus marks to all candidate attempts for ${t.name}!`);
    },
    '',
    'Distribute Bonus Marks'
  );
}

function subjectiveQuestionsModal(t) {
  modal(
    `Subjective & Descriptive Evaluation Panel · ${E(t.name)}`,
    `
      <div style="display:flex;flex-direction:column;gap:12px;padding:8px 4px">
        <p style="font-size:13px;color:var(--mute)">Configure rubric grading, step-marking criteria and handwritten answer sheet evaluations for this examination.</p>
        <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:12px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <b>Subjective Section Status</b>
            <span class="pill-badge pill-green">Rubric Evaluator Active</span>
          </div>
          <small style="color:var(--mute);margin-top:4px;display:block">Supports PDF answer uploads, teacher annotations and digital pen marking.</small>
        </div>
      </div>
    `,
    null,
    '',
    '',
    `<button class="b1" onclick="closeM(1)">Done</button>`
  );
}

function duplicateTest(t, withQs) {
  const clone = JSON.parse(JSON.stringify(t));
  clone.id = id('t_');
  clone.name = clone.name + (withQs ? ' (Copy)' : ' (Blank Template)');
  if (!withQs) clone.qs = [];
  D.tests = D.tests || CBT_TESTS_SEED;
  D.tests.unshift(clone);
  save();
  rp();
  toast(`Test duplicated successfully: "${clone.name}"`);
}

function exportTestExcel(t) {
  const rows = [
    ['Question Number', 'Section', 'Question Type', 'Question Text', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Positive Marks', 'Negative Marks', 'Solution'],
    ...(t.qs || []).map((q, idx) => [
      idx + 1,
      q.sec || 'General',
      q.qtype || 'MCQ',
      `"${(q.q || '').replace(/"/g, '""')}"`,
      `"${(q.o && q.o[0] ? q.o[0] : '').replace(/"/g, '""')}"`,
      `"${(q.o && q.o[1] ? q.o[1] : '').replace(/"/g, '""')}"`,
      `"${(q.o && q.o[2] ? q.o[2] : '').replace(/"/g, '""')}"`,
      `"${(q.o && q.o[3] ? q.o[3] : '').replace(/"/g, '""')}"`,
      q.a != null ? String.fromCharCode(65 + q.a) : 'A',
      q.pos || 4,
      q.neg || 1,
      `"${(q.sol || '').replace(/"/g, '""')}"`
    ])
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${t.name.replace(/[^a-z0-9]/gi, '_')}_export.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast(`Exported "${t.name}" questions roster to CSV!`);
}

function runTestRepair(t) {
  let issues = 0;
  (t.qs || []).forEach(q => {
    if (!q.q || !q.o || q.o.length < 2) issues++;
  });
  toast(`Test diagnostics check complete: ${issues} syntax issues found. Test structure is verified and healthy.`);
}

function assignToSeriesModal(t) {
  const pkgs = D.packages || DEFAULT_PACKAGES;
  modal(
    `Assign to Package / Test Series · ${E(t.name)}`,
    `
      <div style="display:flex;flex-direction:column;gap:10px">
        <p style="font-size:12.5px;color:var(--mute)">Select published test series packages that should include this test:</p>
        <div style="display:flex;flex-direction:column;gap:8px;max-height:260px;overflow-y:auto">
          ${pkgs.map(p => `
            <label class="ck" style="border:1px solid var(--b);border-radius:8px;padding:8px 12px;background:var(--s);display:flex;align-items:center;gap:10px">
              <input type="checkbox" name="assign_pkg_series" value="${p.id}" checked>
              <div>
                <b style="font-size:13px;color:var(--ink)">${E(p.name)}</b>
                <small style="display:block;color:var(--mute)">${p.category} · ${p.testsCount} Tests</small>
              </div>
            </label>
          `).join('')}
        </div>
      </div>
    `,
    () => {
      toast(`Test "${t.name}" linked to selected test series packages!`);
    },
    '',
    'Save Package Assignment'
  );
}

function assignToTeacherModal(t) {
  const teachers = D.users.filter(u => u.role === 'instructor' || (u.roles && u.roles.includes('instructor')));
  modal(
    `Assign Lead Teacher & Evaluator · ${E(t.name)}`,
    `
      <div style="display:flex;flex-direction:column;gap:10px">
        <p style="font-size:12.5px;color:var(--mute)">Designate lead faculty member responsible for authoring questions and grading subjective responses:</p>
        <div style="display:grid;gap:8px">
          ${teachers.map((u, i) => `
            <label class="ck" style="border:1px solid var(--b);border-radius:8px;padding:10px 12px;background:var(--s);display:flex;align-items:center;gap:10px">
              <input type="radio" name="assign_teacher_radio" value="${u.id}" ${i === 0 ? 'checked' : ''}>
              <div class="stu-cell">
                <img class="s-img" src="${av(u)}" alt="">
                <div class="stu-meta">
                  <b class="stu-name">${E(u.name)}</b>
                  <span class="stu-sub">${E(u.subject || 'Physics')} · ${E(u.email)}</span>
                </div>
              </div>
            </label>
          `).join('')}
        </div>
      </div>
    `,
    () => {
      toast(`Lead instructor assigned for "${t.name}"!`);
    },
    '',
    'Confirm Teacher Assignment'
  );
}

function shareTestLink(t) {
  const shareUrl = `https://dev.ruppi.in/student/livetest/index/1/1/${t.id}/?preview=1`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareUrl);
  }
  toast(`Test link copied to clipboard: ${shareUrl}`);
}

let CBT = null;
let CBT_CALC_VAL = '';

function tk(i) {
  startOnlineTest(i);
}

/* 1. Official CBT Instructions & Guidelines Dialog */
function startOnlineTest(testId) {
  const t = (D.tests || CBT_TESTS_SEED).find(x => x.id === testId) || (D.tests || CBT_TESTS_SEED)[0];
  const u = me();
  const crsObj = D.courses.find(c => c.id === t.course) || { name: 'Master Program' };

  const content = `
    <div style="font-size:13.5px;color:var(--ink);line-height:1.6">
      <!-- Exam Meta Banner -->
      <div style="display:flex;align-items:center;justify-content:space-between;background:var(--s);border:1px solid var(--b);border-radius:12px;padding:14px 18px;margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:14px">
          <img src="${av(u)}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid #0284c7">
          <div>
            <b style="font-size:15px;display:block;color:var(--ink)">${E(t.name)}</b>
            <span style="font-size:12px;color:var(--mute)">Candidate: <b>${E(u.name)}</b> · Roll No: <b>TRG-${u.id.toUpperCase()}</b> · ${E(crsObj.name)}</span>
          </div>
        </div>
        <span class="pill-badge pill-green" style="font-size:12px;padding:4px 10px">Live CBT Exam</span>
      </div>

      <!-- Quick Metrics Grid -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px">
        <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:10px 12px;text-align:center">
          <small style="color:var(--mute);font-size:11px;display:block">DURATION</small>
          <b style="font-size:15px;color:#0284c7">${t.min} Mins</b>
        </div>
        <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:10px 12px;text-align:center">
          <small style="color:var(--mute);font-size:11px;display:block">TOTAL QUESTIONS</small>
          <b style="font-size:15px;color:var(--ink)">${(t.qs || []).length} Qs</b>
        </div>
        <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:10px 12px;text-align:center">
          <small style="color:var(--mute);font-size:11px;display:block">MAXIMUM MARKS</small>
          <b style="font-size:15px;color:#16a34a">${t.max_score || (t.qs.length * 4)} Marks</b>
        </div>
        <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:10px 12px;text-align:center">
          <small style="color:var(--mute);font-size:11px;display:block">MARKING SCHEME</small>
          <b style="font-size:14px;color:#16a34a">+${t.marks_positive || 4} <span style="color:#dc2626">-${t.marks_negative || 1}</span></b>
        </div>
      </div>

      <!-- Section Details -->
      <div style="margin-bottom:16px">
        <b style="font-size:13.5px;display:block;margin-bottom:6px">Sections Included in this Examination:</b>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${(t.sections || ['Physics', 'Chemistry', 'Mathematics']).map(s => {
            const count = (t.qs || []).filter(q => q.sec === s).length || Math.round((t.qs || []).length / t.sections.length);
            return `<span class="pill-badge pill-blue" style="font-size:12px;padding:4px 10px">${s}: <b>${count} Questions</b></span>`;
          }).join('')}
        </div>
      </div>

      <!-- Question Palette Symbol Guide -->
      <div style="background:var(--s);border:1px solid var(--b);border-radius:10px;padding:14px;margin-bottom:18px">
        <b style="font-size:13px;display:block;margin-bottom:10px">Question Palette Legend Guide (NTA Exam Standard):</b>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px 16px;font-size:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="cbt-badge cbt-badge-ans">✓</span>
            <span><b>Answered:</b> Question answered and marked for evaluation.</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span class="cbt-badge cbt-badge-not-ans">✕</span>
            <span><b>Not Answered:</b> Question visited but no option chosen.</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span class="cbt-badge cbt-badge-not-visited">?</span>
            <span><b>Not Visited:</b> Question not opened yet.</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span class="cbt-badge cbt-badge-review">★</span>
            <span><b>Marked for Review:</b> Marked for later inspection.</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;grid-column:span 2">
            <span class="cbt-badge cbt-badge-ans-review">★</span>
            <span><b>Answered & Marked for Review:</b> Answered, but flagged for final verification.</span>
          </div>
        </div>
      </div>

      <!-- Language Selection & Candidate Declaration -->
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:14px;margin-bottom:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <label style="font-size:13px;font-weight:600;color:#0369a1">Choose Default Exam Language:</label>
          <select id="cbtInstLang" style="width:160px;padding:5px 8px;border-radius:6px;border:1px solid #0284c7">
            <option value="EN" selected>English (Default)</option>
            <option value="HI">Hindi (हिंदी)</option>
          </select>
        </div>

        <label class="ck" style="font-size:12px;color:#0f172a;cursor:pointer;display:flex;align-items:flex-start;gap:8px">
          <input type="checkbox" id="cbtAgreeCheckbox" style="margin-top:2px">
          <span>I have read and understood all instructions. I declare that I am not in possession of any unauthorized gadgets or study notes. I agree to abide by all examination code of conduct.</span>
        </label>
      </div>
    </div>
  `;

  modal(
    'CBT Examination Instructions · ' + E(t.name),
    content,
    null,
    '',
    '',
    `
      <button class="b2" onclick="closeM(1)">Cancel</button>
      <button class="b1" style="background:#16a34a;border-color:#16a34a" onclick="validateAndLaunchCBT('${t.id}')">I am ready to begin ›</button>
    `
  );
  $('.md').style.maxWidth = '780px';
}

function validateAndLaunchCBT(testId) {
  const cb = $('#cbtAgreeCheckbox');
  if (!cb || !cb.checked) {
    alert('Please confirm the candidate declaration checkbox to proceed with the exam.');
    return;
  }
  const langSel = $('#cbtInstLang');
  const lang = langSel ? langSel.value : 'EN';
  closeM(1);
  launchCBTExam(testId, lang);
}

/* 2. Launch Fullscreen CBT Examination Interface */
function launchCBTExam(testId, lang = 'EN') {
  const t = (D.tests || CBT_TESTS_SEED).find(x => x.id === testId) || (D.tests || CBT_TESTS_SEED)[0];
  const u = me();

  CBT = {
    test: t,
    curQ: 0,
    curSec: (t.sections && t.sections[0]) || (t.qs[0] && t.qs[0].sec) || 'Physics',
    answers: {},
    reviewFlags: {},
    visited: { 0: true },
    timeRemaining: (t.min || 20) * 60,
    timeSpent: {},
    timerInterval: null,
    lang: lang,
    startTime: Date.now()
  };

  // Mount CBT Fullscreen Container
  let cbtEl = $('#cbtExamOverlay');
  if (!cbtEl) {
    cbtEl = document.createElement('div');
    cbtEl.id = 'cbtExamOverlay';
    document.body.appendChild(cbtEl);
  }

  cbtEl.innerHTML = `
    <div class="cbt-container">
      <!-- Top Navigation Bar -->
      <header class="cbt-header">
        <div class="cbt-header-left">
          ${LIMG}
          <div class="cbt-exam-title" title="${E(t.name)}">${E(t.name)}</div>
        </div>
        <div class="cbt-header-right">
          <div class="cbt-timer-badge" id="cbtClock">
            ⏱ <span id="cbtTimeStr">${Math.floor(CBT.timeRemaining / 60)}:00</span>
          </div>
          <div class="cbt-cand-info">
            <img class="cbt-cand-photo" src="${av(u)}" alt="">
            <div class="cbt-cand-meta">
              <span class="cbt-cand-name">${E(u.name)}</span>
              <span class="cbt-cand-sub">TRG-${u.id.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Section Tabs & Tool Buttons -->
      <div class="cbt-sec-bar">
        <div class="cbt-sec-tabs" id="cbtSecTabs">
          ${(t.sections || ['Physics', 'Chemistry', 'Mathematics']).map((sec, idx) => `
            <button class="cbt-sec-tab ${sec === CBT.curSec ? 'active' : ''}" onclick="cbtSwitchSection('${sec}')">
              ${sec} <span class="cbt-sec-tab-badge" id="cbtSecBadge_${idx}">0</span>
            </button>
          `).join('')}
        </div>
        <div class="cbt-tools-right">
          ${t.is_calc_allow ? `<button class="cbt-btn-tool" onclick="openScientificCalc()">🖩 Calculator</button>` : ''}
          <button class="cbt-btn-tool" onclick="openQuestionPaperModal()">📄 Question Paper</button>
        </div>
      </div>

      <!-- Main Body: Left Question Canvas + Right Question Palette -->
      <div class="cbt-body">
        <!-- Left: Question Canvas -->
        <div class="cbt-left">
          <!-- Question Header (Number, Section, Marks, Lang Toggle) -->
          <div class="cbt-q-header">
            <div class="cbt-q-title" id="cbtQTitle">Question 1</div>
            <div style="display:flex;align-items:center;gap:16px">
              <div class="cbt-q-marks">
                <span>Marks: <span class="cbt-mark-pos">+${t.marks_positive || 4.0}</span></span>
                <span>Negative: <span class="cbt-mark-neg">-${t.marks_negative || 1.0}</span></span>
              </div>
              <select id="cbtLangSwitch" onchange="cbtToggleLang(this.value)" style="padding:3px 8px;font-size:12px;border-radius:4px;border:1px solid #cbd5e1;background:var(--s)">
                <option value="EN" ${CBT.lang === 'EN' ? 'selected' : ''}>English</option>
                <option value="HI" ${CBT.lang === 'HI' ? 'selected' : ''}>Hindi (हिंदी)</option>
              </select>
            </div>
          </div>

          <!-- Question Content & Options Container -->
          <div class="cbt-q-canvas" id="cbtQCanvas">
            <!-- Dynamic Question Formats rendered here -->
          </div>

          <!-- Bottom Action Buttons Bar -->
          <footer class="cbt-footer">
            <div class="cbt-footer-left">
              <button class="b2" onclick="cbtPrev()">‹ Previous</button>
              <button class="b2" onclick="cbtClear()">Clear Response</button>
              <button class="b2" style="color:#7c3aed;border-color:#c4b5fd" onclick="cbtMarkReview()">Mark for Review & Next</button>
            </div>
            <div class="cbt-footer-right">
              <button class="b2" style="background:#f3e8ff;border-color:#7c3aed;color:#7c3aed;font-weight:600" onclick="cbtSaveAndMarkReview()">Save & Mark for Review</button>
              <button class="b1" style="background:#0284c7;border-color:#0284c7;font-weight:600;padding:8px 18px" onclick="cbtSaveAndNext()">Save & Next ›</button>
            </div>
          </footer>
        </div>

        <!-- Right: Palette Sidebar -->
        <aside class="cbt-right">
          <!-- Legend Box -->
          <div class="cbt-legend-box">
            <div class="cbt-legend-grid">
              <div class="cbt-legend-item"><span class="cbt-badge cbt-badge-ans" id="cbtCntAns">0</span> Answered</div>
              <div class="cbt-legend-item"><span class="cbt-badge cbt-badge-not-ans" id="cbtCntNotAns">0</span> Not Answered</div>
              <div class="cbt-legend-item"><span class="cbt-badge cbt-badge-not-visited" id="cbtCntNotVis">0</span> Not Visited</div>
              <div class="cbt-legend-item"><span class="cbt-badge cbt-badge-review" id="cbtCntRev">0</span> Marked Review</div>
              <div class="cbt-legend-item" style="grid-column:span 2"><span class="cbt-badge cbt-badge-ans-review" id="cbtCntAnsRev">0</span> Ans & Marked for Review</div>
            </div>
          </div>

          <!-- Question Number Jump Grid -->
          <div class="cbt-palette-canvas">
            <div style="font-size:12px;font-weight:600;margin-bottom:8px;color:var(--mute)">Choose a Question:</div>
            <div class="cbt-grid" id="cbtPaletteGrid">
              <!-- Number buttons 1..N -->
            </div>
          </div>

          <!-- Submit Exam Section -->
          <div class="cbt-submit-box">
            <button class="cbt-btn-submit" onclick="confirmSubmitCBT()">Submit Test Exam</button>
          </div>
        </aside>
      </div>
    </div>
  `;

  // Start Live Ticking Countdown Timer
  CBT.timerInterval = setInterval(cbtTick, 1000);

  // Render First Question
  renderCBTQuestion();
  updateCBTPalette();
}

/* Timer Tick */
function cbtTick() {
  if (!CBT) return;
  CBT.timeRemaining--;

  // Track time spent on current question
  CBT.timeSpent[CBT.curQ] = (CBT.timeSpent[CBT.curQ] || 0) + 1;

  const clockEl = $('#cbtClock');
  const timeStrEl = $('#cbtTimeStr');
  const m = Math.floor(CBT.timeRemaining / 60);
  const s = CBT.timeRemaining % 60;
  if (timeStrEl) timeStrEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  if (CBT.timeRemaining <= 300 && clockEl) {
    clockEl.classList.add('warning');
  }

  if (CBT.timeRemaining <= 0) {
    clearInterval(CBT.timerInterval);
    CBT.timerInterval = null;
    toast('Exam time expired! Auto-submitting responses.');
    finalizeCBTSubmission();
  }
}

/* Render Active Question Canvas */
function renderCBTQuestion() {
  if (!CBT) return;
  const q = CBT.test.qs[CBT.curQ];
  const lang = CBT.lang;

  // Question Title
  const titleEl = $('#cbtQTitle');
  if (titleEl) titleEl.textContent = `Question ${CBT.curQ + 1} of ${CBT.test.qs.length} (${q.sec})`;

  // Mark visited
  CBT.visited[CBT.curQ] = true;

  // Match section tab active status
  if (q.sec !== CBT.curSec) {
    CBT.curSec = q.sec;
    updateCBTSectionTabs();
  }

  const qCanvas = $('#cbtQCanvas');
  if (!qCanvas) return;

  const questionText = lang === 'HI' && q.hi_q ? q.hi_q : q.q;
  const savedAns = CBT.answers[CBT.curQ];

  let inputHtml = '';

  // 1. Single Choice (MCQ)
  if (q.qtype === 'MCQ' || !q.qtype) {
    const opts = lang === 'HI' && q.hi_o ? q.hi_o : q.o;
    inputHtml = `
      <div class="cbt-options-list">
        ${opts.map((opt, i) => {
          const isSelected = savedAns === i;
          return `
            <div class="cbt-opt-card ${isSelected ? 'selected' : ''}" onclick="cbtSelectMCQ(${i})">
              <span class="cbt-opt-badge">${String.fromCharCode(65 + i)}</span>
              <span class="cbt-opt-text">${E(opt)}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  // 2. Numerical Answer Type (NAT)
  else if (q.qtype === 'NAT') {
    inputHtml = `
      <div class="cbt-nat-box">
        <label style="font-size:12.5px;font-weight:600;display:block;margin-bottom:8px">Enter Decimal / Integer Answer:</label>
        <input type="text" id="cbtNatInput" class="cbt-nat-input" value="${savedAns != null ? E(savedAns) : ''}" placeholder="e.g. 5" oninput="CBT.answers[${CBT.curQ}]=this.value.trim();updateCBTPalette()">
        <div class="cbt-numpad">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'DEL'].map(val => `
            <button class="cbt-num-btn" type="button" onclick="cbtNumpadInput('${val}')">${val}</button>
          `).join('')}
        </div>
      </div>
    `;
  }
  // 3. Multiple Answer Question (MAQ)
  else if (q.qtype === 'MAQ') {
    const opts = lang === 'HI' && q.hi_o ? q.hi_o : q.o;
    const selectedArr = Array.isArray(savedAns) ? savedAns : [];
    inputHtml = `
      <div style="font-size:12px;color:#0284c7;font-weight:600;margin-bottom:10px">Select one or more correct options:</div>
      <div class="cbt-options-list">
        ${opts.map((opt, i) => {
          const isSelected = selectedArr.includes(String(i));
          return `
            <div class="cbt-opt-card ${isSelected ? 'selected' : ''}" onclick="cbtToggleMAQ('${i}')">
              <input type="checkbox" ${isSelected ? 'checked' : ''} style="width:18px;height:18px;pointer-events:none">
              <span class="cbt-opt-badge">${String.fromCharCode(65 + i)}</span>
              <span class="cbt-opt-text">${E(opt)}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  // 4. True / False
  else if (q.qtype === 'TrueFalse') {
    const opts = lang === 'HI' && q.hi_o ? q.hi_o : q.o;
    inputHtml = `
      <div style="display:flex;gap:14px;max-width:400px;margin-top:14px">
        ${opts.map((opt, i) => `
          <button class="cbt-opt-card ${savedAns === i ? 'selected' : ''}" style="flex:1;justify-content:center;font-weight:700;padding:16px" onclick="cbtSelectMCQ(${i})">
            ${E(opt)}
          </button>
        `).join('')}
      </div>
    `;
  }
  // 5. Match The Following Matrix (MTQ)
  else if (q.qtype === 'MTQ') {
    const curMap = savedAns || {};
    inputHtml = `
      <div style="margin-top:14px">
        <table class="cbt-mtq-table">
          <thead>
            <tr>
              <th style="text-align:left">Column I</th>
              ${(q.cols || []).map(col => `<th>${E(col)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${(q.rows || []).map((row, rIdx) => `
              <tr>
                <td style="text-align:left;font-weight:600">${E(row)}</td>
                ${(q.cols || []).map(col => {
                  const colKey = col.slice(0, 1);
                  const isChecked = curMap[rIdx] === colKey;
                  return `
                    <td>
                      <input type="radio" name="mtq_row_${rIdx}" ${isChecked ? 'checked' : ''} onchange="cbtSelectMTQ(${rIdx}, '${colKey}')">
                    </td>
                  `;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  // 6. Coding Simulator
  else if (q.qtype === 'CODING') {
    const initial = savedAns || q.initialCode || '# Write your solution here\n';
    inputHtml = `
      <div style="margin-top:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;background:#0f172a;color:#94a3b8;padding:8px 14px;border-radius:8px 8px 0 0;font-size:12px">
          <span>Python 3.10 Engine</span>
          <button class="b1" style="font-size:11.5px;padding:3px 10px;background:#16a34a;border-color:#16a34a" onclick="cbtSimulateRunCode()">▶ Run Test Cases</button>
        </div>
        <textarea id="cbtCodeEditor" style="width:100%;height:180px;font-family:monospace;background:#0b0f19;color:#38bdf8;padding:12px;border:1px solid #1e293b;border-radius:0 0 8px 8px;font-size:13px" oninput="CBT.answers[${CBT.curQ}]=this.value;updateCBTPalette()">${E(initial)}</textarea>
        <div id="cbtCodeOutput" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;margin-top:10px;font-size:12px;font-family:monospace;display:none">
          <b style="color:#16a34a">✓ All Sample Test Cases Passed (Runtime: 42ms, Memory: 14.2MB)</b>
        </div>
      </div>
    `;
  }

  qCanvas.innerHTML = `
    <div class="cbt-q-text">${E(questionText)}</div>
    ${inputHtml}
  `;
}

function cbtSelectMCQ(idx) {
  CBT.answers[CBT.curQ] = idx;
  renderCBTQuestion();
  updateCBTPalette();
}

function cbtToggleMAQ(optKey) {
  let cur = CBT.answers[CBT.curQ];
  if (!Array.isArray(cur)) cur = [];
  if (cur.includes(optKey)) {
    cur = cur.filter(x => x !== optKey);
  } else {
    cur.push(optKey);
  }
  CBT.answers[CBT.curQ] = cur.length ? cur : null;
  renderCBTQuestion();
  updateCBTPalette();
}

function cbtNumpadInput(char) {
  const inp = $('#cbtNatInput');
  if (!inp) return;
  if (char === 'DEL') {
    inp.value = inp.value.slice(0, -1);
  } else {
    inp.value += char;
  }
  CBT.answers[CBT.curQ] = inp.value.trim();
  updateCBTPalette();
}

function cbtSelectMTQ(rowIdx, colKey) {
  CBT.answers[CBT.curQ] = CBT.answers[CBT.curQ] || {};
  CBT.answers[CBT.curQ][rowIdx] = colKey;
  updateCBTPalette();
}

function cbtSimulateRunCode() {
  const out = $('#cbtCodeOutput');
  if (out) {
    out.style.display = 'block';
    out.innerHTML = `<span style="color:#16a34a">✓ Test 1: Passed [Input: nums=[2,7,11,15], target=9 -> Output: [0, 1]]<br>✓ Test 2: Passed [Input: nums=[3,2,4], target=6 -> Output: [1, 2]]</span>`;
  }
  CBT.answers[CBT.curQ] = $('#cbtCodeEditor').value;
  updateCBTPalette();
  toast('Code executed against test cases successfully');
}

/* Action Handlers */
function cbtSaveAndNext() {
  CBT.reviewFlags[CBT.curQ] = false;
  if (CBT.curQ < CBT.test.qs.length - 1) {
    CBT.curQ++;
    renderCBTQuestion();
    updateCBTPalette();
  } else {
    confirmSubmitCBT();
  }
}

function cbtSaveAndMarkReview() {
  CBT.reviewFlags[CBT.curQ] = true;
  if (CBT.curQ < CBT.test.qs.length - 1) {
    CBT.curQ++;
    renderCBTQuestion();
    updateCBTPalette();
  } else {
    confirmSubmitCBT();
  }
}

function cbtMarkReview() {
  CBT.reviewFlags[CBT.curQ] = true;
  if (CBT.curQ < CBT.test.qs.length - 1) {
    CBT.curQ++;
    renderCBTQuestion();
    updateCBTPalette();
  }
}

function cbtClear() {
  delete CBT.answers[CBT.curQ];
  CBT.reviewFlags[CBT.curQ] = false;
  renderCBTQuestion();
  updateCBTPalette();
}

function cbtPrev() {
  if (CBT.curQ > 0) {
    CBT.curQ--;
    renderCBTQuestion();
    updateCBTPalette();
  }
}

function cbtJump(idx) {
  CBT.curQ = idx;
  renderCBTQuestion();
  updateCBTPalette();
}

function cbtSwitchSection(secName) {
  CBT.curSec = secName;
  const firstIdx = CBT.test.qs.findIndex(q => q.sec === secName);
  if (firstIdx !== -1) {
    CBT.curQ = firstIdx;
  }
  updateCBTSectionTabs();
  renderCBTQuestion();
  updateCBTPalette();
}

function cbtToggleLang(l) {
  CBT.lang = l;
  renderCBTQuestion();
}

function updateCBTSectionTabs() {
  const tabs = document.querySelectorAll('.cbt-sec-tab');
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.textContent.includes(CBT.curSec));
  });
}

/* Palette Status & Badge Counts */
function updateCBTPalette() {
  if (!CBT) return;
  const total = CBT.test.qs.length;
  let ansCount = 0;
  let notAnsCount = 0;
  let notVisCount = 0;
  let revCount = 0;
  let ansRevCount = 0;

  const gridEl = $('#cbtPaletteGrid');
  if (!gridEl) return;

  let gridHtml = '';

  CBT.test.qs.forEach((q, i) => {
    const isVisited = !!CBT.visited[i];
    const hasAnswer = CBT.answers[i] != null && CBT.answers[i] !== '';
    const isReview = !!CBT.reviewFlags[i];
    const isCurrent = i === CBT.curQ;

    let stateClass = 'not-visited';

    if (!isVisited) {
      notVisCount++;
      stateClass = 'not-visited';
    } else if (hasAnswer && isReview) {
      ansRevCount++;
      stateClass = 'ans-review';
    } else if (isReview) {
      revCount++;
      stateClass = 'review';
    } else if (hasAnswer) {
      ansCount++;
      stateClass = 'ans';
    } else {
      notAnsCount++;
      stateClass = 'not-ans';
    }

    gridHtml += `
      <button class="cbt-q-btn ${stateClass} ${isCurrent ? 'current' : ''}" onclick="cbtJump(${i})" title="Q${i + 1} (${q.sec})">
        ${i + 1}
      </button>
    `;
  });

  gridEl.innerHTML = gridHtml;

  // Update Legend counters
  const elAns = $('#cbtCntAns');
  const elNotAns = $('#cbtCntNotAns');
  const elNotVis = $('#cbtCntNotVis');
  const elRev = $('#cbtCntRev');
  const elAnsRev = $('#cbtCntAnsRev');

  if (elAns) elAns.textContent = ansCount;
  if (elNotAns) elNotAns.textContent = notAnsCount;
  if (elNotVis) elNotVis.textContent = notVisCount;
  if (elRev) elRev.textContent = revCount;
  if (elAnsRev) elAnsRev.textContent = ansRevCount;
}

/* 3. Submit Confirmation Modal */
function confirmSubmitCBT() {
  if (!CBT) return;
  const t = CBT.test;

  // Compute breakdown per section
  const sections = t.sections || ['Physics', 'Chemistry', 'Mathematics'];
  const secBreakdown = sections.map(sec => {
    const secQs = t.qs.map((q, idx) => ({ ...q, idx })).filter(q => q.sec === sec);
    let secAns = 0;
    let secNotAns = 0;
    let secRev = 0;
    let secNotVis = 0;

    secQs.forEach(q => {
      const isVisited = !!CBT.visited[q.idx];
      const hasAnswer = CBT.answers[q.idx] != null && CBT.answers[q.idx] !== '';
      const isRev = !!CBT.reviewFlags[q.idx];

      if (!isVisited) secNotVis++;
      else if (isRev) secRev++;
      else if (hasAnswer) secAns++;
      else secNotAns++;
    });

    return { sec, total: secQs.length, answered: secAns, notAnswered: secNotAns, review: secRev, notVisited: secNotVis };
  });

  const totalAnswered = Object.keys(CBT.answers).filter(k => CBT.answers[k] != null && CBT.answers[k] !== '').length;

  const content = `
    <div style="font-size:13px;line-height:1.6">
      <div style="background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:12px 14px;border-radius:8px;margin-bottom:14px">
        ⚠️ <b>Are you sure you want to submit your final exam?</b><br>
        You have answered <b>${totalAnswered}</b> out of <b>${t.qs.length}</b> questions. Once submitted, you cannot resume or alter your choices.
      </div>

      <div class="tw" style="margin-bottom:14px">
        <table>
          <thead>
            <tr>
              <th>Section</th>
              <th>Total Qs</th>
              <th>Answered</th>
              <th>Not Answered</th>
              <th>Marked Review</th>
              <th>Not Visited</th>
            </tr>
          </thead>
          <tbody>
            ${secBreakdown.map(b => `
              <tr>
                <td><b>${b.sec}</b></td>
                <td>${b.total}</td>
                <td><span class="st gn">${b.answered}</span></td>
                <td><span class="st bad">${b.notAnswered}</span></td>
                <td><span class="st pu">${b.review}</span></td>
                <td>${b.notVisited}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  modal(
    'Confirm Examination Submission',
    content,
    null,
    '',
    '',
    `
      <button class="b2" onclick="closeM(1)">Cancel & Resume Exam</button>
      <button class="b1" style="background:#16a34a;border-color:#16a34a" onclick="finalizeCBTSubmission()">Submit Final Test ✓</button>
    `
  );
  $('.md').style.maxWidth = '680px';
}

/* 4. Finalize Submission & Score Calculation */
function finalizeCBTSubmission() {
  if (!CBT) return;
  clearInterval(CBT.timerInterval);
  closeM(1);

  const t = CBT.test;
  const elapsedSec = Math.max(1, (t.min * 60) - CBT.timeRemaining);
  const m = Math.floor(elapsedSec / 60);
  const s = elapsedSec % 60;
  const timeTakenStr = `${m}m ${s}s`;

  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  const sectionScores = {};

  t.qs.forEach((q, idx) => {
    const ans = CBT.answers[idx];
    const sec = q.sec || 'Default';
    sectionScores[sec] = sectionScores[sec] || { correct: 0, total: 0, score: 0 };
    sectionScores[sec].total++;

    if (ans == null || ans === '') {
      unattemptedCount++;
      return;
    }

    let isCorrect = false;

    // Check correctness by question type
    if (q.qtype === 'MCQ' || q.qtype === 'TrueFalse' || !q.qtype) {
      if (ans === q.a) isCorrect = true;
    } else if (q.qtype === 'NAT') {
      if (String(ans).trim() === String(q.a).trim()) isCorrect = true;
    } else if (q.qtype === 'MAQ') {
      const correctArr = Array.isArray(q.a) ? q.a : [];
      const userArr = Array.isArray(ans) ? ans : [];
      if (correctArr.length === userArr.length && correctArr.every(x => userArr.includes(String(x)))) {
        isCorrect = true;
      }
    } else if (q.qtype === 'MTQ') {
      const correctObj = q.a || {};
      let match = true;
      Object.keys(correctObj).forEach(k => {
        if (!ans || ans[k] !== correctObj[k]) match = false;
      });
      if (match) isCorrect = true;
    } else if (q.qtype === 'CODING') {
      isCorrect = true; // Simulated full pass
    }

    if (isCorrect) {
      totalScore += (q.pos || t.marks_positive || 4);
      correctCount++;
      sectionScores[sec].correct++;
      sectionScores[sec].score += (q.pos || t.marks_positive || 4);
    } else {
      totalScore -= (q.neg || t.marks_negative || 1);
      incorrectCount++;
      sectionScores[sec].score -= (q.neg || t.marks_negative || 1);
    }
  });

  const attemptedCount = correctCount + incorrectCount;
  const accuracyPct = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
  const maxScore = t.max_score || (t.qs.length * 4);
  const percentile = Math.min(99.4, Math.max(50.0, Math.round((totalScore / maxScore) * 100 * 0.9 + 10)));
  const calculatedRank = Math.max(1, Math.round((100 - percentile) * 0.48) + 1);

  const resObj = {
    id: id('res_'),
    sid: S.uid,
    tid: t.id,
    score: Math.max(0, totalScore),
    maxScore: maxScore,
    correctCount,
    incorrectCount,
    unattemptedCount,
    timeTaken: timeTakenStr,
    timeTakenSec: elapsedSec,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    rank: calculatedRank,
    totalCandidates: 48,
    percentile: percentile,
    accuracy: accuracyPct,
    answers: { ...CBT.answers },
    timePerQuestion: { ...CBT.timeSpent },
    sectionScores
  };

  D.res.push(resObj);
  save();

  // Remove CBT fullscreen overlay and restore normal app UI
  const cbtEl = $('#cbtExamOverlay');
  if (cbtEl) cbtEl.remove();
  CBT = null;

  render();
  showCBTAnalysis(resObj.id);
  toast('Test submitted successfully! Evaluation complete.');
}

/* 5. Comprehensive Score Overview & Deep Analysis Dialog */
function showCBTAnalysis(resultId) {
  const r = D.res.find(x => x.id === resultId) || D.res[D.res.length - 1];
  if (!r) return toast('Result record not found');
  const t = (D.tests || CBT_TESTS_SEED).find(x => x.id === r.tid) || (D.tests || CBT_TESTS_SEED)[0];

  S.solFilter = S.solFilter || 'all';
  const filter = S.solFilter;

  // Filter questions for Solution review
  const qsWithMeta = t.qs.map((q, idx) => {
    const userAns = r.answers[idx];
    const isAttempted = userAns != null && userAns !== '';
    let isCorrect = false;

    if (isAttempted) {
      if (q.qtype === 'MCQ' || q.qtype === 'TrueFalse' || !q.qtype) {
        isCorrect = userAns === q.a;
      } else if (q.qtype === 'NAT') {
        isCorrect = String(userAns).trim() === String(q.a).trim();
      } else if (q.qtype === 'MAQ') {
        const correctArr = Array.isArray(q.a) ? q.a : [];
        const userArr = Array.isArray(userAns) ? userAns : [];
        isCorrect = correctArr.length === userArr.length && correctArr.every(x => userArr.includes(String(x)));
      } else if (q.qtype === 'MTQ') {
        const correctObj = q.a || {};
        let match = true;
        Object.keys(correctObj).forEach(k => {
          if (!userAns || userAns[k] !== correctObj[k]) match = false;
        });
        isCorrect = match;
      } else if (q.qtype === 'CODING') {
        isCorrect = true;
      }
    }

    const status = !isAttempted ? 'skipped' : (isCorrect ? 'correct' : 'incorrect');
    return { ...q, idx, userAns, status, isCorrect, timeSpent: (r.timePerQuestion && r.timePerQuestion[idx]) || 45 };
  });

  const filteredQs = qsWithMeta.filter(q => filter === 'all' || q.status === filter);

  const content = `
    <div style="font-size:13.5px;color:var(--ink)">
      <!-- Top Scorecard Gradient Banner -->
      <div class="analysis-score-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <span class="pill-badge" style="background:rgba(255,255,255,0.22);color:#fff;margin-bottom:6px">Performance Scorecard</span>
            <h2 style="font-size:22px;font-weight:800;margin:0 0 4px">${E(t.name)}</h2>
            <small style="opacity:0.85">Submitted on ${r.date} · Evaluation Complete</small>
          </div>
          <div style="text-align:right">
            <span style="font-size:12px;opacity:0.8;display:block">TOTAL SCORE</span>
            <b style="font-size:32px;font-weight:900;color:#38bdf8">${r.score} <span style="font-size:18px;color:#ffffff">/ ${r.maxScore || 32}</span></b>
          </div>
        </div>

        <div class="analysis-metrics-grid">
          <div class="analysis-metric-item">
            <b>#${r.rank}</b>
            <small>National Rank (of ${r.totalCandidates || 48})</small>
          </div>
          <div class="analysis-metric-item">
            <b style="color:#38bdf8">${r.percentile}%</b>
            <small>Percentile Score</small>
          </div>
          <div class="analysis-metric-item">
            <b style="color:#4ade80">${r.accuracy}%</b>
            <small>Accuracy Rate</small>
          </div>
          <div class="analysis-metric-item">
            <b>⏱ ${r.timeTaken}</b>
            <small>Time Taken (Allowed ${t.min}m)</small>
          </div>
        </div>
      </div>

      <!-- Section Breakdown Table -->
      <div style="margin-bottom:20px">
        <b style="font-size:14px;color:var(--ink);display:block;margin-bottom:8px">Section-Wise Performance Breakdown:</b>
        <div class="tw">
          <table>
            <thead>
              <tr>
                <th>Section</th>
                <th>Total Questions</th>
                <th>Correct</th>
                <th>Score Scored</th>
                <th>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              ${Object.keys(r.sectionScores || {}).map(sec => {
                const s = r.sectionScores[sec];
                const acc = s.total ? Math.round((s.correct / s.total) * 100) : 0;
                return `
                  <tr>
                    <td><b>${sec}</b></td>
                    <td>${s.total}</td>
                    <td><span class="st gn">${s.correct} / ${s.total}</span></td>
                    <td><b style="color:#0284c7">${s.score} Marks</b></td>
                    <td><b>${acc}%</b></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Toppers Leaderboard Comparison -->
      <div style="background:var(--s);border:1px solid var(--b);border-radius:12px;padding:14px 18px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <b style="font-size:13.5px;color:var(--ink)">Top Performers Benchmark Comparison:</b>
          <span style="font-size:12px;color:var(--mute)">Class Avg: <b>18.4 / 32</b></span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          <div style="background:var(--card);border:1px solid var(--b);padding:10px;border-radius:8px;text-align:center">
            <span style="font-size:18px">🥇</span>
            <b style="font-size:13px;display:block">Isha Gupta</b>
            <small style="color:#16a34a;font-weight:700">32 / 32 (100%)</small>
          </div>
          <div style="background:var(--card);border:1px solid #0284c7;padding:10px;border-radius:8px;text-align:center;box-shadow:0 0 8px rgba(2,132,199,0.15)">
            <span style="font-size:18px">🥈</span>
            <b style="font-size:13px;display:block">You (${E(me().name)})</b>
            <small style="color:#0284c7;font-weight:700">${r.score} / ${r.maxScore || 32} (${r.percentile}%)</small>
          </div>
          <div style="background:var(--card);border:1px solid var(--b);padding:10px;border-radius:8px;text-align:center">
            <span style="font-size:18px">🥉</span>
            <b style="font-size:13px;display:block">Rohan Das</b>
            <small style="color:#f59e0b;font-weight:700">26 / 32 (81%)</small>
          </div>
        </div>
      </div>

      <!-- Solution Review & Step-by-Step Explanations -->
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <b style="font-size:14px;color:var(--ink)">Question-Wise Solutions & Step-by-Step Explanations:</b>
          <div class="solution-filter-tabs">
            <button class="b2 ${filter === 'all' ? 'on' : ''}" style="${filter === 'all' ? 'background:#0f172a;color:#fff' : ''}" onclick="S.solFilter='all';showCBTAnalysis('${r.id}')">All (${qsWithMeta.length})</button>
            <button class="b2 ${filter === 'correct' ? 'on' : ''}" style="${filter === 'correct' ? 'background:#16a34a;color:#fff' : ''}" onclick="S.solFilter='correct';showCBTAnalysis('${r.id}')">Correct (${qsWithMeta.filter(x => x.status === 'correct').length})</button>
            <button class="b2 ${filter === 'incorrect' ? 'on' : ''}" style="${filter === 'incorrect' ? 'background:#dc2626;color:#fff' : ''}" onclick="S.solFilter='incorrect';showCBTAnalysis('${r.id}')">Incorrect (${qsWithMeta.filter(x => x.status === 'incorrect').length})</button>
            <button class="b2 ${filter === 'skipped' ? 'on' : ''}" style="${filter === 'skipped' ? 'background:#64748b;color:#fff' : ''}" onclick="S.solFilter='skipped';showCBTAnalysis('${r.id}')">Skipped (${qsWithMeta.filter(x => x.status === 'skipped').length})</button>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:12px">
          ${filteredQs.map(q => {
            const badgeClass = q.status === 'correct' ? 'sol-badge-correct' : (q.status === 'incorrect' ? 'sol-badge-incorrect' : 'sol-badge-skipped');
            const badgeText = q.status === 'correct' ? '✓ Correct (+4)' : (q.status === 'incorrect' ? '✕ Incorrect (-1)' : '— Skipped (0)');

            let ansText = 'Not Attempted';
            let correctText = '';

            if (q.qtype === 'MCQ' || q.qtype === 'TrueFalse' || !q.qtype) {
              ansText = q.userAns != null ? (q.o && q.o[q.userAns]) || `Option ${String.fromCharCode(65 + q.userAns)}` : 'Not Attempted';
              correctText = (q.o && q.o[q.a]) || `Option ${String.fromCharCode(65 + q.a)}`;
            } else if (q.qtype === 'NAT') {
              ansText = q.userAns != null ? q.userAns : 'Not Attempted';
              correctText = q.a;
            } else if (q.qtype === 'MAQ') {
              ansText = Array.isArray(q.userAns) ? q.userAns.map(idx => (q.o && q.o[idx]) || `Opt ${idx}`).join(', ') : 'Not Attempted';
              correctText = Array.isArray(q.a) ? q.a.map(idx => (q.o && q.o[idx]) || `Opt ${idx}`).join(', ') : 'A, B, D';
            } else if (q.qtype === 'MTQ') {
              ansText = q.userAns ? JSON.stringify(q.userAns) : 'Not Attempted';
              correctText = JSON.stringify(q.a);
            } else if (q.qtype === 'CODING') {
              ansText = 'Submitted Python Function';
              correctText = 'All Test Cases Passed (O(n) Optimal Hash Solution)';
            }

            return `
              <div class="sol-q-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                  <span style="font-weight:700;font-size:13px;color:var(--ink)">Q${q.idx + 1}. [${q.sec}] ${q.qtype}</span>
                  <div style="display:flex;align-items:center;gap:10px">
                    <span style="font-size:11.5px;color:var(--mute)">Time spent: <b>${q.timeSpent}s</b></span>
                    <span class="sol-q-badge ${badgeClass}">${badgeText}</span>
                  </div>
                </div>

                <p style="font-size:14px;color:var(--ink);line-height:1.5;margin-bottom:10px">${E(q.q)}</p>

                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;font-size:12.5px;margin-bottom:8px">
                  <div style="background:var(--s);padding:8px 12px;border-radius:6px;border:1px solid var(--b)">
                    <span style="color:var(--mute);display:block;font-size:11px">Your Chosen Response:</span>
                    <b style="color:${q.status === 'correct' ? '#16a34a' : (q.status === 'incorrect' ? '#dc2626' : 'var(--mute)')}">${E(ansText)}</b>
                  </div>
                  <div style="background:var(--s);padding:8px 12px;border-radius:6px;border:1px solid var(--b)">
                    <span style="color:var(--mute);display:block;font-size:11px">Official Correct Answer:</span>
                    <b style="color:#16a34a">${E(correctText)}</b>
                  </div>
                </div>

                <!-- Explanation Drawer -->
                <div class="sol-drawer">
                  <b style="color:#0284c7;display:block;margin-bottom:4px">💡 Step-by-Step Solution & Concept:</b>
                  ${E(q.sol || 'Detailed step-by-step mathematical reasoning verified by faculty.')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  modal(
    'Exam Result Analysis & Solutions · ' + E(t.name),
    content,
    null,
    '',
    '',
    `
      <button class="b2" onclick="closeM(1);go('tests')">Back to Tests</button>
      <button class="b1" onclick="closeM(1);startOnlineTest('${t.id}')">Retake Test Exam</button>
    `
  );
  $('.md').style.maxWidth = '880px';
}

/* 6. Virtual Scientific Calculator Modal */
function openScientificCalc() {
  CBT_CALC_VAL = CBT_CALC_VAL || '0';

  const modalEl = document.createElement('div');
  modalEl.id = 'cbtCalcModal';
  modalEl.style.position = 'fixed';
  modalEl.style.top = '100px';
  modalEl.style.right = '40px';
  modalEl.style.zIndex = '100000';
  modalEl.style.boxShadow = '0 12px 36px rgba(0,0,0,0.4)';
  modalEl.style.borderRadius = '14px';

  modalEl.innerHTML = `
    <div class="cbt-calc-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <b style="font-size:13px;color:#38bdf8">Scientific Calculator</b>
        <button style="background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer" onclick="$('#cbtCalcModal').remove()">×</button>
      </div>
      <div class="cbt-calc-screen" id="cbtCalcScreen">${CBT_CALC_VAL}</div>
      <div class="cbt-calc-grid">
        <button class="cbt-calc-btn" onclick="cbtCalcPress('sin(')">sin</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('cos(')">cos</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('tan(')">tan</button>
        <button class="cbt-calc-btn op" onclick="cbtCalcClear()">AC</button>

        <button class="cbt-calc-btn" onclick="cbtCalcPress('log(')">log</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('ln(')">ln</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('sqrt(')">√</button>
        <button class="cbt-calc-btn op" onclick="cbtCalcPress('/')">/</button>

        <button class="cbt-calc-btn" onclick="cbtCalcPress('7')">7</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('8')">8</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('9')">9</button>
        <button class="cbt-calc-btn op" onclick="cbtCalcPress('*')">×</button>

        <button class="cbt-calc-btn" onclick="cbtCalcPress('4')">4</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('5')">5</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('6')">6</button>
        <button class="cbt-calc-btn op" onclick="cbtCalcPress('-')">-</button>

        <button class="cbt-calc-btn" onclick="cbtCalcPress('1')">1</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('2')">2</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('3')">3</button>
        <button class="cbt-calc-btn op" onclick="cbtCalcPress('+')">+</button>

        <button class="cbt-calc-btn" onclick="cbtCalcPress('0')">0</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('.')">.</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress('(')">(</button>
        <button class="cbt-calc-btn" onclick="cbtCalcPress(')')">)</button>

        <button class="cbt-calc-btn op" style="grid-column:span 4;background:#16a34a;font-size:16px" onclick="cbtCalcEquals()">=</button>
      </div>
    </div>
  `;

  const old = $('#cbtCalcModal');
  if (old) old.remove();
  document.body.appendChild(modalEl);
}

function cbtCalcPress(val) {
  if (CBT_CALC_VAL === '0' && !isNaN(val)) CBT_CALC_VAL = '';
  CBT_CALC_VAL += val;
  const s = $('#cbtCalcScreen');
  if (s) s.textContent = CBT_CALC_VAL;
}

function cbtCalcClear() {
  CBT_CALC_VAL = '0';
  const s = $('#cbtCalcScreen');
  if (s) s.textContent = CBT_CALC_VAL;
}

function cbtCalcEquals() {
  try {
    let expr = CBT_CALC_VAL.replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(');
    const res = Function(`"use strict"; return (${expr})`)();
    CBT_CALC_VAL = String(Math.round(res * 100000) / 100000);
  } catch (e) {
    CBT_CALC_VAL = 'Error';
  }
  const s = $('#cbtCalcScreen');
  if (s) s.textContent = CBT_CALC_VAL;
}

/* 7. Full Question Paper Preview Modal */
function openQuestionPaperModal() {
  if (!CBT) return;
  const t = CBT.test;

  const content = `
    <div style="max-height:70vh;overflow-y:auto;padding-right:8px">
      ${t.qs.map((q, idx) => `
        <div style="background:var(--s);border:1px solid var(--b);border-radius:10px;padding:14px;margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <b style="color:#0284c7">Question ${idx + 1} (${q.sec}) · ${q.qtype}</b>
            <span style="font-size:12px;color:var(--mute)">+${q.pos || 4} / -${q.neg || 1}</span>
          </div>
          <p style="font-size:13.5px;color:var(--ink);line-height:1.5;margin-bottom:8px">${E(q.q)}</p>
          ${q.o ? `
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;font-size:12px">
              ${q.o.map((opt, oIdx) => `
                <div style="background:var(--card);padding:6px 10px;border-radius:6px;border:1px solid var(--b)">
                  <b>${String.fromCharCode(65 + oIdx)}.</b> ${E(opt)}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;

  modal(
    'Question Paper · ' + E(t.name),
    content,
    null,
    '',
    '',
    `<button class="b1" onclick="closeM(1)">Return to Exam</button>`
  );
  $('.md').style.maxWidth = '780px';
}

/* 8. Package Store & Cart Management */
function viewPackageDetails(pkgId) {
  const p = (D.packages || DEFAULT_PACKAGES).find(x => x.id === pkgId) || (D.packages || DEFAULT_PACKAGES)[0];
  const isEnrolled = (D.myPackages && D.myPackages[S.uid] && D.myPackages[S.uid].includes(p.id));

  const content = `
    <div style="font-size:13.5px;line-height:1.6">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
        <div>
          <span class="pill-badge pill-blue" style="margin-bottom:6px">${p.category}</span>
          <h2 style="font-size:18px;font-weight:700;color:var(--ink);margin:0 0 4px">${E(p.name)}</h2>
          <span style="color:var(--mute);font-size:12px">Validity: <b>${p.validity}</b> · ★ ${p.rating} (${p.reviews} verified candidate reviews)</span>
        </div>
        <b style="font-size:24px;color:#0284c7">${p.price === 0 ? 'FREE' : R(p.price)}</b>
      </div>

      <p style="color:var(--mute);margin-bottom:16px">${E(p.description)}</p>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px">
        <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:10px;text-align:center">
          <small style="color:var(--mute);display:block;font-size:11px">TESTS INCLUDED</small>
          <b style="font-size:16px;color:#0284c7">${p.testsCount} Mock Tests</b>
        </div>
        <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:10px;text-align:center">
          <small style="color:var(--mute);display:block;font-size:11px">HANDOUTS & NOTES</small>
          <b style="font-size:16px;color:#16a34a">${p.notesCount} PDFs</b>
        </div>
        <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:10px;text-align:center">
          <small style="color:var(--mute);display:block;font-size:11px">STUDENTS</small>
          <b style="font-size:16px;color:var(--ink)">${p.enrolledStudents} Active</b>
        </div>
      </div>

      <b style="font-size:13.5px;display:block;margin-bottom:8px">Included Syllabus Materials & Test Papers:</b>
      <div style="background:var(--s);border:1px solid var(--b);border-radius:10px;padding:10px 14px;margin-bottom:16px">
        ${(p.schedule || []).map(s => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--b)">
            <span>${s.type === 'Test' ? '⚡' : '📄'} <b>${E(s.title)}</b> (${s.type})</span>
            ${s.type === 'Test'
              ? `<button class="b1" style="font-size:11.5px;padding:3px 10px" onclick="closeM(1);startOnlineTest('${s.testId || 't1'}')">Launch CBT</button>`
              : `<button class="b2" style="font-size:11.5px;padding:3px 10px" onclick="toast('Downloading PDF handout: ${E(s.title)}')">PDF ⬇</button>`}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal(
    'Package Details · ' + E(p.name),
    content,
    null,
    '',
    '',
    `
      <button class="b2" onclick="closeM(1)">Close</button>
      ${isEnrolled
        ? `<button class="b1" style="background:#16a34a;border-color:#16a34a" onclick="closeM(1);S.p='packages';S.pkgTab='library';render()">Go to My Library</button>`
        : p.price === 0
        ? `<button class="b1" onclick="closeM(1);enrollFreePackage('${p.id}')">Enroll Free</button>`
        : `<button class="b1" onclick="closeM(1);openPackageCheckout('${p.id}')">Proceed to Checkout ›</button>`
      }
    `
  );
  $('.md').style.maxWidth = '680px';
}

/* 9. Checkout & Coupon Code Application Modal */
let CURRENT_CHECKOUT = null;

function openPackageCheckout(pkgId) {
  const p = (D.packages || DEFAULT_PACKAGES).find(x => x.id === pkgId) || (D.packages || DEFAULT_PACKAGES)[0];
  CURRENT_CHECKOUT = {
    pkg: p,
    originalPrice: p.price,
    discount: 0,
    appliedCoupon: '',
    finalPrice: p.price,
    gateway: 'razorpay'
  };
  renderCheckoutModal();
}

function renderCheckoutModal() {
  if (!CURRENT_CHECKOUT) return;
  const c = CURRENT_CHECKOUT;
  const p = c.pkg;

  const content = `
    <div style="font-size:13.5px;line-height:1.6">
      <div style="display:flex;justify-content:space-between;align-items:center;background:var(--s);border:1px solid var(--b);border-radius:10px;padding:12px 16px;margin-bottom:16px">
        <div>
          <b style="font-size:15px;color:var(--ink);display:block">${E(p.name)}</b>
          <span style="font-size:12px;color:var(--mute)">Target: ${p.category} · Validity: ${p.validity}</span>
        </div>
        <b style="font-size:18px;color:#0284c7">${R(p.price)}</b>
      </div>

      <!-- Coupon Code Section -->
      <div style="background:var(--card);border:1px solid var(--b);border-radius:10px;padding:14px;margin-bottom:16px">
        <label style="font-size:12.5px;font-weight:600;display:block;margin-bottom:6px">Have a Promo / Discount Coupon?</label>
        <div class="coupon-input-group">
          <input type="text" id="chkCouponCode" placeholder="Try WELCOME50, TOPPER20 or FLAT1000" style="flex:1;text-transform:uppercase" value="${E(c.appliedCoupon)}">
          <button class="b1" type="button" onclick="applyCouponCode()">Apply Coupon</button>
        </div>
        ${c.appliedCoupon ? `
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">
            <span class="coupon-tag">${ico('coupon')} Coupon ${c.appliedCoupon} applied (-${R(c.discount)})</span>
            <a style="font-size:12px;color:#dc2626;cursor:pointer" onclick="removeCouponCode()">Remove</a>
          </div>
        ` : '<small style="color:var(--mute);font-size:11.5px">Active codes: <b>WELCOME50</b> (50% off), <b>TOPPER20</b> (20% off), <b>FLAT1000</b> (₹1000 off)</small>'}
      </div>

      <!-- Payment Method Gateway -->
      <div style="margin-bottom:18px">
        <label style="font-size:12.5px;font-weight:600;display:block;margin-bottom:8px">Select Payment Gateway:</label>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          <label class="ck" style="border:1.5px solid ${c.gateway === 'razorpay' ? '#0284c7' : 'var(--b)'};background:${c.gateway === 'razorpay' ? '#f0f9ff' : 'var(--s)'};padding:10px;border-radius:8px;font-size:12px">
            <input type="radio" name="chkGateway" value="razorpay" ${c.gateway === 'razorpay' ? 'checked' : ''} onchange="CURRENT_CHECKOUT.gateway='razorpay';renderCheckoutModal()">
            <span><b>Razorpay</b><br><small style="color:var(--mute)">UPI / Cards / Netbanking</small></span>
          </label>
          <label class="ck" style="border:1.5px solid ${c.gateway === 'instamojo' ? '#0284c7' : 'var(--b)'};background:${c.gateway === 'instamojo' ? '#f0f9ff' : 'var(--s)'};padding:10px;border-radius:8px;font-size:12px">
            <input type="radio" name="chkGateway" value="instamojo" ${c.gateway === 'instamojo' ? 'checked' : ''} onchange="CURRENT_CHECKOUT.gateway='instamojo';renderCheckoutModal()">
            <span><b>Instamojo</b><br><small style="color:var(--mute)">Wallets / QR Pay</small></span>
          </label>
          <label class="ck" style="border:1.5px solid ${c.gateway === 'token' ? '#0284c7' : 'var(--b)'};background:${c.gateway === 'token' ? '#f0f9ff' : 'var(--s)'};padding:10px;border-radius:8px;font-size:12px">
            <input type="radio" name="chkGateway" value="token" ${c.gateway === 'token' ? 'checked' : ''} onchange="CURRENT_CHECKOUT.gateway='token';renderCheckoutModal()">
            <span><b>Voucher Token</b><br><small style="color:var(--mute)">Institute Voucher</small></span>
          </label>
        </div>
      </div>

      <!-- Price Summary -->
      <div style="background:var(--s);border:1px solid var(--b);border-radius:10px;padding:12px 16px;line-height:1.7">
        <div style="display:flex;justify-content:space-between"><span>Base Package Fee:</span> <span>${R(c.originalPrice)}</span></div>
        ${c.discount ? `<div style="display:flex;justify-content:space-between;color:#16a34a"><span>Coupon Discount:</span> <span>-${R(c.discount)}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between"><span>Convenience Charges (2%):</span> <span>₹0 (Waived)</span></div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid var(--b);margin-top:6px;padding-top:6px;font-size:15px;font-weight:800;color:var(--ink)">
          <span>Total Payable Amount:</span>
          <span style="color:#0284c7">${R(c.finalPrice)}</span>
        </div>
      </div>
    </div>
  `;

  modal(
    'Checkout · ' + E(p.name),
    content,
    null,
    '',
    '',
    `
      <button class="b2" onclick="closeM(1)">Cancel</button>
      <button class="b1" style="background:#16a34a;border-color:#16a34a;font-weight:700" onclick="payPackageOnline()">Pay ${R(c.finalPrice)} Now ›</button>
    `
  );
  $('.md').style.maxWidth = '580px';
}

function applyCouponCode() {
  const codeInp = $('#chkCouponCode');
  const code = (codeInp ? codeInp.value : '').trim().toUpperCase();
  if (!code) return alert('Enter a coupon code.');

  const coupon = (D.coupons || DEFAULT_COUPONS).find(c => c.code.toUpperCase() === code);
  if (!coupon) return alert('Invalid coupon code. Try WELCOME50 or TOPPER20.');

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = Math.round((CURRENT_CHECKOUT.originalPrice * coupon.discount) / 100);
  } else {
    discount = coupon.discount;
  }

  CURRENT_CHECKOUT.discount = discount;
  CURRENT_CHECKOUT.appliedCoupon = code;
  CURRENT_CHECKOUT.finalPrice = Math.max(0, CURRENT_CHECKOUT.originalPrice - discount);

  renderCheckoutModal();
  toast(`Coupon ${code} applied! Saved ${R(discount)}`);
}

function removeCouponCode() {
  CURRENT_CHECKOUT.discount = 0;
  CURRENT_CHECKOUT.appliedCoupon = '';
  CURRENT_CHECKOUT.finalPrice = CURRENT_CHECKOUT.originalPrice;
  renderCheckoutModal();
  toast('Coupon removed');
}

function payPackageOnline() {
  if (!CURRENT_CHECKOUT) return;
  const c = CURRENT_CHECKOUT;
  const p = c.pkg;
  const uid = S.uid;

  // Add to enrolled list
  D.myPackages = D.myPackages || {};
  D.myPackages[uid] = D.myPackages[uid] || [];
  if (!D.myPackages[uid].includes(p.id)) {
    D.myPackages[uid].push(p.id);
  }

  // Create simulated transaction invoice
  const transId = 'TXN-' + Math.random().toString(36).slice(2, 9).toUpperCase();
  D.inv.push({
    id: id('i'),
    sid: uid,
    center: D.centers[0]?.id || 'c1',
    total: c.finalPrice,
    paid: c.finalPrice,
    note: `Purchased ${p.name} via ${c.gateway.toUpperCase()}`
  });

  // Link course if applicable
  const student = U(uid);
  if (student && p.courseId && !student.courses.includes(p.courseId)) {
    student.courses.push(p.courseId);
  }

  p.enrolledStudents++;
  save();
  closeM(1);

  S.pkgTab = 'library';
  render();
  toast(`Payment successful! Transaction ID: ${transId}. Package added to your library.`);
}

function enrollFreePackage(pkgId) {
  const p = (D.packages || DEFAULT_PACKAGES).find(x => x.id === pkgId);
  const uid = S.uid;
  D.myPackages = D.myPackages || {};
  D.myPackages[uid] = D.myPackages[uid] || [];
  if (!D.myPackages[uid].includes(pkgId)) {
    D.myPackages[uid].push(pkgId);
  }
  if (p) p.enrolledStudents++;
  save();
  S.pkgTab = 'library';
  render();
  toast(`Enrolled in ${p ? p.name : 'Free Package'}! Access granted in your library.`);
}

function togglePackageStatus(pkgId) {
  const p = (D.packages || DEFAULT_PACKAGES).find(x => x.id === pkgId);
  if (!p) return;
  p.status = p.status === 'Published' ? 'Draft' : 'Published';
  save();
  render();
  toast(`Package ${p.status.toLowerCase()}`);
}

/* 10. Admin: Package Wizard */
function openPackageWizard() {
  const content = `
    <div style="font-size:13px;line-height:1.6">
      <div class="g2">
        <label>Package Title *<input id="wizPkgName" placeholder="e.g. JEE Main 2026 Rank Booster Series"></label>
        <label>Target Category *
          <select id="wizPkgCat">
            <option value="Engineering">Engineering (JEE Main / Adv)</option>
            <option value="Medical">Medical (NEET UG)</option>
            <option value="Programming">Computer Science & Coding</option>
            <option value="Foundation">Foundation (Class 9-10)</option>
          </select>
        </label>
      </div>

      <div class="g2">
        <label>Package Price (₹) *<input type="number" id="wizPkgPrice" value="2999" placeholder="Enter 0 for Free"></label>
        <label>Validity Period *
          <select id="wizPkgVal">
            <option value="365 Days">365 Days (1 Year)</option>
            <option value="180 Days">180 Days (6 Months)</option>
            <option value="90 Days">90 Days (Quarterly)</option>
            <option value="Lifetime">Lifetime Access</option>
          </select>
        </label>
      </div>

      <label>Package Description<textarea id="wizPkgDesc" rows="3" placeholder="Provide test series highlights, syllabus coverage, and proctoring features.">Full length CBT mock tests crafted by IIT & AIIMS faculty with live percentile benchmarking.</textarea></label>

      <div class="g2">
        <label>Included CBT Tests Count<input type="number" id="wizPkgTests" value="30"></label>
        <label>Included Study Handouts (PDFs)<input type="number" id="wizPkgNotes" value="80"></label>
      </div>
    </div>
  `;

  modal(
    'Create New Test Series Package',
    content,
    null,
    '',
    '',
    `
      <button class="b2" onclick="closeM(1)">Cancel</button>
      <button class="b1" onclick="submitPackageWizard()">Publish Package</button>
    `
  );
  $('.md').style.maxWidth = '640px';
}

function submitPackageWizard() {
  const name = $('#wizPkgName')?.value.trim();
  const cat = $('#wizPkgCat')?.value;
  const price = +($('#wizPkgPrice')?.value || 0);
  const val = $('#wizPkgVal')?.value;
  const desc = $('#wizPkgDesc')?.value.trim();
  const tests = +($('#wizPkgTests')?.value || 25);
  const notes = +($('#wizPkgNotes')?.value || 50);

  if (!name) return alert('Package title is required.');

  const newPkg = {
    id: id('pkg_'),
    name,
    category: cat,
    type: 'test',
    price,
    testsCount: tests,
    notesCount: notes,
    enrolledStudents: 0,
    rating: 5.0,
    reviews: 0,
    validity: val,
    status: 'Published',
    description: desc,
    schedule: [
      { title: name + ' Comprehensive Mock 1', type: 'Test', testId: 't1' },
      { title: name + ' High-Yield Formula Sheet', type: 'PDF', download: true }
    ]
  };

  D.packages = D.packages || DEFAULT_PACKAGES;
  D.packages.unshift(newPkg);
  save();
  closeM(1);
  render();
  toast(`New package “${name}” published!`);
}

function openCouponModal() {
  const content = `
    <div style="font-size:13px;line-height:1.6">
      <div class="g2">
        <label>Coupon Code *<input id="coupCode" placeholder="e.g. MEGA50" style="text-transform:uppercase"></label>
        <label>Discount Type
          <select id="coupType">
            <option value="percentage">Percentage (%) Discount</option>
            <option value="flat">Flat Amount (₹) Discount</option>
          </select>
        </label>
      </div>
      <div class="g2">
        <label>Discount Value *<input type="number" id="coupVal" placeholder="e.g. 50 for 50% or 500 for ₹500" value="30"></label>
        <label>Min Cart Value (₹)<input type="number" id="coupMin" value="1000"></label>
      </div>
      <label>Description<input id="coupDesc" placeholder="e.g. Special festive discount on all packages" value="Special discount for new enrollments"></label>
    </div>
  `;

  modal(
    'Create Promotional Coupon Code',
    content,
    null,
    '',
    '',
    `
      <button class="b2" onclick="closeM(1)">Cancel</button>
      <button class="b1" onclick="submitNewCoupon()">Create Coupon</button>
    `
  );
}

function submitNewCoupon() {
  const code = $('#coupCode')?.value.trim().toUpperCase();
  const type = $('#coupType')?.value;
  const val = +($('#coupVal')?.value || 0);
  const min = +($('#coupMin')?.value || 0);
  const desc = $('#coupDesc')?.value.trim();

  if (!code) return alert('Coupon code is required.');
  if (val <= 0) return alert('Enter a valid discount value.');

  D.coupons = D.coupons || DEFAULT_COUPONS;
  D.coupons.push({ code, type, discount: val, desc, minCart: min });
  save();
  closeM(1);
  render();
  toast(`Coupon ${code} created successfully!`);
}

/* ============================================================== */
/* STUDENTS: ADD/EDIT, CSV IMPORT, DETAILS                        */
/* ============================================================== */

const scC = () => (hasC() ? D.centers.filter(c => cs().includes(c.id) && c.status === 'Active').map(c => [c.id, c.name]) : []);

function es(i) {
  const s = i ? U(i) : { mode: !hasC() ? 'Online' : 'Offline', centers: hasC() ? [S.c !== 'all' ? S.c : (scC()[0] || [])[0]] : [], courses: [], batch: '' };
  modal(
    i ? 'Edit student' : 'Add student',
    `<div class=g2>${F('name', 'Full name *', 'text', [], s.name)}${F('phone', 'Mobile number', 'tel', [], s.phone)}</div>` +
      F('email', 'Email *', 'email', [], s.email) +
      (hasC() && OM() === 'Both'
        ? F('mode', 'Learning mode', 'select', [['Offline', 'At a center (offline)'], ['Online', 'Online class (no center)']], s.mode || 'Offline')
        : `<input type=hidden name=mode value="${!hasC() ? 'Online' : OM()}">`) +
      (hasC()
        ? `<div class=g2 id=cbx>${F('center', 'Center *', 'select', scC(), s.centers[0])}${F('batch', 'Batch', 'select', [['', 'No batch'], ...D.batches.filter(b => cs().includes(b.center)).map(b => [b.id, b.name + ' · ' + cn(b.center)])], s.batch || '')}</div>`
        : '') +
      F('courses', 'Enrolled courses', 'multi', D.courses.filter(c => c.status === 'Published' || s.courses.includes(c.id)).map(c => [c.id, c.name + ' · ' + (c.price ? R(c.price) : 'Free')]), s.courses),
    o => {
      if (!o.name) return 'Full name is required.';
      if (!/^\S+@\S+\.\S+$/.test(o.email)) return 'Enter a valid email address.';
      if (o.phone && !/^[6-9]\d{9}$/.test(o.phone)) return 'Mobile number must be 10 digits starting with 6–9.';
      const em = o.email.toLowerCase();
      if (D.users.some(u => u.email === em && u.id !== i)) return 'This email is already in use.';
      const off = hasC() && o.mode !== 'Online';
      if (off && !o.center) return 'Select a center.';
      const d = { name: o.name, email: em, phone: o.phone, mode: off ? 'Offline' : 'Online', centers: off ? [o.center] : [], batch: off ? o.batch : '', courses: o.courses || [] };
      if (i) {
        (o.courses || []).filter(c => !s.courses.includes(c)).forEach(c => note(i, 'You were enrolled in ' + D.courses.find(x => x.id === c).name + '.'));
        Object.assign(s, d);
      } else {
        const n = { id: id('s'), role: 'student', status: 'Active', ...d };
        D.users.push(n);
        note(n.id, 'Welcome to ' + D.inst + '! Your account is ready.');
      }
    },
    i ? 'Student updated' : 'Student added',
    i ? 'Save changes' : 'Add student'
  );

  const m = $('.mb [name=mode]');
  if (m && hasC()) {
    const f = () => {
      const el = $('#cbx');
      if (el) el.hidden = m.value === 'Online';
    };
    m.addEventListener('change', f);
    f();
  }
}

function cpop(i) {
  const s = U(i),
    l = D.courses.filter(c => s.courses.includes(c.id));
  modal(
    'Courses · ' + E(s.name),
    l.length
      ? `<div class=task-list>${l.map(c => `<div class=task-item><div class=task-left><div class=task-ico>${ico('courses')}</div><div><b>${E(c.name)}</b><small>${c.code} · ${c.price ? R(c.price) : 'Free'}</small></div></div><button class=b2 onclick="closeM(1);oc('${c.id}')">Open</button></div>`).join('')}</div>`
      : '<div class=em>This student is not enrolled in any course yet.</div>',
    null,
    '',
    '',
    `<button class=b2 onclick=closeM(1)>Close</button>${can() ? `<button class=b1 onclick="closeM(1);es('${i}')">Manage enrolment</button>` : ''}`
  );
}

/* CSV Import */
let IM = { center: '', rows: null, file: '', err: '' };
function ci() {
  IM = { center: !hasC() ? 'online' : S.c !== 'all' ? S.c : '', rows: null, file: '', err: '' };
  imr();
}

function imr() {
  const op = !hasC()
    ? [['online', 'Online students']]
    : [['', 'Select a center…'], ...scC(), ...(hasO() ? [['online', 'Online students (no center)']] : [])];
  const ok = IM.rows ? IM.rows.filter(r => r.ok).length : 0;

  let b = '';
  if (hasC()) {
    b += `<div class=steps><span class="${IM.center ? 'dn' : 'on'}">1 · Center</span><span class="${IM.rows ? 'dn' : IM.center ? 'on' : ''}">2 · Upload</span><span class="${IM.rows ? 'on' : ''}">3 · Preview</span></div>
      <label>Center *<select onchange="IM.center=this.value;if(IM.rows)vC();imr()">${op.map(([v, l]) => `<option value="${v}" ${v === IM.center ? 'selected' : ''}>${E(l)}</option>`).join('')}</select></label>`;
  } else {
    IM.center = 'online';
    b += `<div class=steps><span class="${IM.rows ? 'dn' : 'on'}">1 · Upload</span><span class="${IM.rows ? 'on' : ''}">2 · Preview & Import</span></div>`;
  }

  if (hasC() && !IM.center) {
    b += '<small>Select the center these students belong to. You can then download the sample file or upload your CSV.</small>';
  } else {
    b += `
      <div class=imo style="margin-top:10px">
        <button class=imc onclick=dlS()>${ico('down')}<b>Download sample CSV</b><small>Template with required headers</small></button>
        <label class=imc>${ico('up')}<b>${IM.file ? 'Choose another file' : 'Import CSV'}</b><small>${IM.file ? E(IM.file) : 'Select a .csv file from your computer'}</small><input type=file accept=".csv,text/csv" hidden onchange="rdC(this.files[0])"></label>
      </div>
      <small style="display:block;margin-top:8px">Required columns: <b>name</b>, <b>email</b>. Optional: <b>phone</b>${hasC() ? ', <b>batch</b>' : ''}, <b>courses</b> (names separated by |).</small>`;
  }

  if (IM.err) b += `<p class=er style="margin-top:8px">${E(IM.err)}</p>`;
  if (IM.rows) {
    b += `
      <div class=imp style="margin-top:12px">${ico('file')}<b>${E(IM.file)}</b><span>${IM.rows.length} rows</span><span class="st gn">${ok} ready</span>${IM.rows.length - ok ? `<span class="st bad">${IM.rows.length - ok} skipped</span>` : ''}</div>
      <div class="tw pv" style="margin-top:8px">
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th>${hasC() ? '<th>Batch</th>' : ''}<th>Courses</th><th>Status</th></tr></thead>
          <tbody>
            ${IM.rows.map((r, j) => `<tr class="${r.ok ? '' : 'bad'}"><td>${j + 1}</td><td>${E(r.name) || '—'}</td><td>${E(r.email) || '—'}</td><td>${E(r.phone) || '—'}</td>${hasC() ? `<td>${E(r.bn || '—')}</td>` : ''}<td>${r.cids.length}</td><td>${r.ok ? '<span class="st gn">Ready</span>' : `<span class="st bad">${r.why}</span>`}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  modal('Import students (CSV)', b, null, '', '', `<button class=b2 onclick=closeM(1)>Cancel</button>${IM.rows ? `<button class=b1 ${ok ? '' : 'disabled'} onclick=doI()>Import ${ok} student${ok == 1 ? '' : 's'}</button>` : ''}`);
  $('.md').style.maxWidth = IM.rows ? '860px' : '560px';
}

function dlS() {
  const c = IM.center === 'online' || !hasC(),
    b = c ? '' : (D.batches.find(x => x.center === IM.center) || {}).name || '',
    headers = hasC() ? 'name,email,phone,batch,courses\n' : 'name,email,phone,courses\n',
    rows = [
      ['Ananya Sharma', 'ananya.sharma@gmail.com', '9876543210', ...(hasC() ? [b] : []), 'JEE Advanced & Main Masterclass|NEET Medical Excellence Batch'],
      ['Rohit Kulkarni', 'rohit.kulkarni@gmail.com', '9812345678', ...(hasC() ? [b] : []), 'JEE Advanced & Main Masterclass'],
      ['Sneha Nair', 'sneha.nair@gmail.com', '9934567812', ...(hasC() ? [''] : []), 'Full Stack Python & Data Structures']
    ];
  const csv = headers + rows.map(r => r.join(',')).join('\n') + '\n';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'trigrexam_students_sample.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast('Sample CSV downloaded');
}

const pL = l => l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(x => x.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

function rdC(f) {
  if (!f) return;
  if (!/\.csv$/i.test(f.name)) {
    IM.err = 'Please choose a .csv file.';
    return imr();
  }
  const r = new FileReader();
  r.onload = () => {
    const ln = String(r.result).replace(/^\uFEFF/, '').split(/\r?\n/).filter(x => x.trim());
    IM.file = f.name;
    IM.err = '';
    IM.rows = null;
    if (ln.length < 2) {
      IM.err = 'The file has no data rows.';
      return imr();
    }
    const h = pL(ln[0]).map(x => x.toLowerCase()),
      ix = k => h.indexOf(k);
    if (ix('name') < 0 || ix('email') < 0) {
      IM.err = 'Missing required column(s): ' + ['name', 'email'].filter(k => ix(k) < 0).join(', ') + '. Download sample CSV to inspect.';
      return imr();
    }
    IM.rows = ln.slice(1).map(l => {
      const v = pL(l),
        g = k => (ix(k) < 0 ? '' : v[ix(k)] || '');
      return { name: g('name'), email: g('email').toLowerCase(), phone: g('phone').replace(/\D/g, ''), bn: g('batch'), cn: g('courses') };
    });
    vC();
    imr();
  };
  r.readAsText(f);
}

function vC() {
  const seen = {};
  IM.rows.forEach(r => {
    r.cids = r.cn
      .split('|')
      .map(x => x.trim().toLowerCase())
      .filter(Boolean)
      .map(n => (D.courses.find(c => c.name.toLowerCase() === n || c.code.toLowerCase() === n) || {}).id)
      .filter(Boolean);
    const b = r.bn && hasC() && IM.center !== 'online' ? D.batches.find(x => x.name.toLowerCase() === r.bn.toLowerCase() && x.center === IM.center) : null;
    r.bid = b ? b.id : '';
    r.ok = false;
    if (!r.name) r.why = 'Missing name';
    else if (!/^\S+@\S+\.\S+$/.test(r.email)) r.why = 'Invalid email';
    else if (D.users.some(u => u.email === r.email)) r.why = 'Already exists';
    else if (seen[r.email]) r.why = 'Duplicate in file';
    else if (r.phone && !/^[6-9]\d{9}$/.test(r.phone)) r.why = 'Invalid phone';
    else if (r.bn && hasC() && IM.center !== 'online' && !b) r.why = 'Batch not found';
    else r.ok = true;
    seen[r.email] = 1;
  });
}

function doI() {
  const on = IM.center === 'online' || !hasC(),
    l = IM.rows.filter(r => r.ok);
  l.forEach(r => {
    const n = { id: id('s'), name: r.name, email: r.email, phone: r.phone, role: 'student', mode: on ? 'Online' : 'Offline', centers: on ? [] : [IM.center], batch: on ? '' : r.bid, courses: r.cids, status: 'Active' };
    D.users.push(n);
    note(n.id, 'Welcome to ' + D.inst + '! Your account is ready.');
  });
  const sk = IM.rows.length - l.length;
  save();
  closeM(1);
  S.q = '';
  S.pg = 0;
  render();
  toast(`Imported ${l.length} student${l.length == 1 ? '' : 's'}${sk ? `, skipped ${sk}` : ''}`);
}

/* ============================================================== */
/* COURSES: IMAGES + 3-STEP CREATION WIZARD                      */
/* ============================================================== */

const CIMG = {
  k1: 'photo-1635070041078-e363dbe005cb',
  k2: 'photo-1532187863486-abf9dbad1b69',
  k3: 'photo-1526379095098-d400fd0bf935'
};
const CPOOL = [
  'photo-1503676260728-1c00da094a0b',
  'photo-1497633762265-9d179a990aa6',
  'photo-1513258496099-48168024aec0',
  'photo-1456513080510-7bf3a84b82f8',
  'photo-1509062522246-3755977927d7',
  'photo-1434030216411-0b793f4b4173'
];
const cimg = c => c.img || `https://images.unsplash.com/${CIMG[c.id] || CPOOL[[...c.id].reduce((a, x) => a + x.charCodeAt(0), 0) % CPOOL.length]}?w=640&h=360&fit=crop&auto=format&q=70`;
const SUBJ = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Science', 'English', 'Computer Science', 'Reasoning'];

function nw() {
  W = {
    step: 1,
    d: {
      name: '',
      code: '',
      mode: !hasC() ? 'Online' : OM(),
      centers: hasC() ? scC().map(c => c[0]) : [],
      access: 'Paid',
      price: '',
      img: '',
      desc: '',
      st: [{ s: '', t: '' }],
      students: [],
      newS: [],
      csv: ''
    }
  };
  ow();
}

const wset = (k, v, r) => {
    W.d[k] = v;
    if (r) ow();
  },
  seg = (k, o) => `<div class=seg>${o.map(x => `<button type=button class="${W.d[k] === x ? 'on' : ''}" onclick="wset('${k}','${x}',1)">${x}</button>`).join('')}</div>`;

const wpool = () => {
  const mc = me().role === 'owner' ? D.centers.map(c => c.id) : me().centers;
  return D.users.filter(u => u.role === 'student' && u.status === 'Active' && (!hasC() || u.mode === 'Online' || u.centers.some(x => mc.includes(x))));
};

function ow() {
  const d = W.d,
    s = W.step;
  let b = `<div class=steps><span class="${s > 1 ? 'dn' : 'on'}">1 · Details</span><span class="${s > 2 ? 'dn' : s == 2 ? 'on' : ''}">2 · Subjects & teachers</span><span class="${s == 3 ? 'on' : ''}">3 · Students</span></div>`;

  if (s == 1) {
    b += `
      <div class=thu onclick="$('#thf').click()">${d.img ? `<img src="${d.img}" alt="">` : `${ico('up')}<b>Upload course thumbnail</b><small>JPG or PNG · recommended 1280×720</small>`}<input id=thf type=file accept="image/*" hidden onchange="thU(this.files[0])"></div>${d.img ? `<a onclick="wset('img','',1)">Remove thumbnail</a>` : ''}
      <div class=g2><label>Course name *<input value="${E(d.name)}" oninput="W.d.name=this.value" placeholder="e.g. JEE Main 2027 Crash Course"></label><label>Course code<input value="${E(d.code)}" oninput="W.d.code=this.value" placeholder="e.g. JEE27"></label></div>
      <label>Description<textarea rows=3 oninput="W.d.desc=this.value" placeholder="What will students learn in this course?">${E(d.desc)}</textarea></label>
      ${hasC() && OM() === 'Both' ? `<div class=fg><span>Delivery mode *</span>${seg('mode', ['Online', 'Offline', 'Both'])}</div>` : ''}
      ${hasC() && d.mode !== 'Online' ? `<fieldset><legend>Available at centers *</legend>${scC().map(([v, l]) => `<label class=ck><input type=checkbox ${d.centers.includes(v) ? 'checked' : ''} onchange="W.d.centers=this.checked?[...W.d.centers,'${v}']:W.d.centers.filter(x=>x!=='${v}')">${E(l)}</label>`).join('')}</fieldset>` : ''}
      <div class=fg><span>Access *</span>${seg('access', ['Free', 'Paid'])}</div>
      ${d.access === 'Paid' ? `<label>Price (₹) *<input type=number min=1 value="${E(d.price)}" oninput="W.d.price=this.value" placeholder="e.g. 45000"></label>` : ''}`;
  } else if (s == 2) {
    const tc = D.users.filter(u => (u.role === 'instructor' || (u.roles && u.roles.includes('instructor'))) && u.status === 'Active');
    b +=
      `<small>Add each subject and pick the instructor who will teach it.</small><datalist id=sbl>${SUBJ.map(x => `<option value="${x}">`).join('')}</datalist><div class=sth><span>Subject</span><span>Teacher</span><span></span></div>` +
      d.st.map((r, j) => `<div class=strow><input list=sbl placeholder="e.g. Physics" value="${E(r.s)}" oninput="W.d.st[${j}].s=this.value"><select onchange="W.d.st[${j}].t=this.value"><option value="">Select teacher…</option>${tc.map(u => `<option value="${u.id}" ${r.t === u.id ? 'selected' : ''}>${E(u.name)} (${E(u.subject || 'Faculty')})${hasC() ? ' · ' + E(cl(u.centers)) : ''}</option>`).join('')}</select><button class="b2 xs" title="Remove" onclick="W.d.st.splice(${j},1);ow()" ${d.st.length < 2 ? 'disabled' : ''}>×</button></div>`).join('') +
      `<button class=b2 style="justify-self:start" onclick="W.d.st.push({s:'',t:''});ow()">+ Add subject</button>`;
  } else {
    const p = wpool();
    b += `
      <div class=imo>
        <label class=imc>${ico('up')}<b>Import students from CSV</b><small>Columns: name, email</small><input type=file accept=".csv,text/csv" hidden onchange="wcsv(this.files[0])"></label>
        <button class=imc onclick=wsam()>${ico('down')}<b>Download sample CSV</b><small>Template with headers</small></button>
      </div>${d.csv ? `<div class=imp>${ico('file')}<span>${E(d.csv)}</span></div>` : ''}
      <div class=bar style="margin:0"><input class=in placeholder="Search ${p.length} students…" oninput="wq(this.value)"><button class=b2 onclick="wall(1)">Select all</button><button class=b2 onclick="wall(0)">Clear</button><span class=mt id=wsc>${d.students.length + d.newS.length} selected</span></div>
      <div class=sl>${p.map(u => `<label class=ck data-t="${E((u.name + ' ' + u.email + ' ' + (u.mode === 'Online' || !hasC() ? 'online' : cn(u.centers[0]))).toLowerCase())}"><input type=checkbox value="${u.id}" ${d.students.includes(u.id) ? 'checked' : ''} onchange="wtg(this)"><span class=avt>${E(u.name.split(' ').map(x => x[0]).join('').slice(0, 2))}</span><span class=sli><b>${E(u.name)}</b><small>${E(u.email)}${hasC() ? ' · ' + (u.mode === 'Online' ? 'Online' : E(cn(u.centers[0]))) : ''}</small></span></label>`).join('')}</div>`;
  }

  modal(
    `New course · step ${s} of 3`,
    b,
    null,
    '',
    '',
    `<button class=b2 onclick=closeM()>Cancel</button>${s > 1 ? '<button class=b2 onclick="W.step--;ow()">Back</button>' : ''}<button class=b1 onclick=wn()>${s < 3 ? 'Continue' : 'Create course'}</button>`
  );
  $('.md').style.maxWidth = '640px';
}

function thU(f) {
  if (!f) return;
  if (!/^image\//.test(f.type)) return toast('Please choose an image file');
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const w = Math.min(800, im.width),
        cv = document.createElement('canvas');
      cv.width = w;
      cv.height = Math.round((im.height * w) / im.width);
      cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
      W.d.img = cv.toDataURL('image/jpeg', 0.8);
      ow();
    };
    im.src = r.result;
  };
  r.readAsDataURL(f);
}

const wcnt = () => {
  const e = $('#wsc');
  if (e) e.textContent = W.d.students.length + W.d.newS.length + ' selected';
};
function wtg(el) {
  const a = W.d.students;
  el.checked ? a.includes(el.value) || a.push(el.value) : (W.d.students = a.filter(x => x !== el.value));
  wcnt();
}
function wq(v) {
  v = v.toLowerCase();
  document.querySelectorAll('.sl label').forEach(l => (l.hidden = !l.dataset.t.includes(v)));
}
function wall(on) {
  document.querySelectorAll('.sl label:not([hidden]) input').forEach(i => {
    i.checked = !!on;
    wtg(i);
  });
}
function wsam() {
  const csv = 'name,email\n' + wpool().slice(0, 3).map(u => u.name + ',' + u.email).join('\n') + '\nKunal Bhatia,kunal.bhatia@gmail.com\n';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'trigrexam_course_students_sample.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast('Sample CSV downloaded');
}
function wcsv(f) {
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    const ln = String(r.result).replace(/^\uFEFF/, '').split(/\r?\n/).filter(x => x.trim()),
      h = pL(ln[0] || '').map(x => x.toLowerCase()),
      ni = h.indexOf('name'),
      ei = h.indexOf('email');
    if (ei < 0) {
      W.d.csv = f.name + ': missing required column "email".';
      return ow();
    }
    let m = 0,
      n = 0,
      bad = 0;
    ln.slice(1).forEach(l => {
      const v = pL(l),
        em = (v[ei] || '').toLowerCase(),
        nm = ni < 0 ? '' : v[ni] || '';
      if (!/^\S+@\S+\.\S+$/.test(em)) {
        bad++;
        return;
      }
      const u = D.users.find(x => x.email === em);
      if (u) {
        if (u.role !== 'student') {
          bad++;
          return;
        }
        W.d.students.includes(u.id) || W.d.students.push(u.id);
        m++;
      } else if (nm) {
        W.d.newS.some(x => x.email === em) || W.d.newS.push({ name: nm, email: em });
        n++;
      } else bad++;
    });
    W.d.csv = `${f.name}: ${m} existing matched, ${n} new candidates, ${bad} skipped`;
    ow();
  };
  r.readAsText(f);
}

function wn() {
  const d = W.d,
    e = $('#er');
  if (W.step == 1) {
    if (!d.name.trim()) return (e.textContent = 'Course name is required.');
    if (hasC() && d.mode !== 'Online' && !d.centers.length) return (e.textContent = 'Select at least one center for offline delivery.');
    if (d.access === 'Paid' && !(+d.price > 0)) return (e.textContent = 'Enter a valid price for a paid course.');
  }
  if (W.step == 2) {
    if (d.st.some(r => r.t && !r.s.trim())) return (e.textContent = 'Enter the subject name for each selected teacher.');
  }
  if (W.step < 3) {
    W.step++;
    return ow();
  }

  const st = d.st.filter(r => r.s.trim()).map(r => ({ s: r.s.trim(), t: r.t })),
    c = {
      id: id('k'),
      name: d.name.trim(),
      code: (d.code.trim() || d.name.trim().split(/\s+/).map(x => x[0]).join('').slice(0, 4) + String(D.courses.length + 1).padStart(2, '0')).toUpperCase(),
      mode: !hasC() ? 'Online' : d.mode,
      access: d.access,
      price: d.access === 'Paid' ? +d.price : 0,
      centers: !hasC() || d.mode === 'Online' ? [] : d.centers,
      status: 'Draft',
      desc: d.desc.trim(),
      img: d.img,
      st,
      subjects: st.map(r => r.s).join(', '),
      instr: (st.find(r => r.t) || {}).t || '',
      lessons: ['Introduction & Foundations']
    };
  D.courses.push(c);

  d.newS.forEach(x => {
    const u = { id: id('s'), name: x.name, email: x.email, phone: '', role: 'student', mode: 'Online', centers: [], batch: '', courses: [], status: 'Active' };
    D.users.push(u);
    d.students.push(u.id);
  });

  d.students.forEach(i => {
    const s = U(i);
    if (!s.courses.includes(c.id)) s.courses.push(c.id);
    note(i, `You were enrolled in ${c.name}.`);
  });

  save();
  closeM(1);
  S.cv = null;
  render();
  toast(`Yes! Course “${c.name}” has been created`);
}

/* Initialization */
render();
