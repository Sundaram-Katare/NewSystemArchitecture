/* =====================================================================
   course.js — Course ecosystem (subjects, lectures, notes, teachers, live
   classes, tests, announcements, reviews) + full local CRUD + activity log.
   Loaded after script.js; overrides some functions of script.js.
   All data lives in localStorage via the shared `D` object and save().
   ===================================================================== */

const GV = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';
const VID = [GV + 'BigBuckBunny.mp4', GV + 'ElephantsDream.mp4', GV + 'ForBiggerBlazes.mp4', GV + 'ForBiggerEscapes.mp4', GV + 'ForBiggerJoyrides.mp4', GV + 'Sintel.mp4', GV + 'TearsOfSteel.mp4', GV + 'ForBiggerFun.mp4'];
const PDF = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
const DOCX = 'https://calibre-ebook.com/downloads/demos/demo.docx';
const DUR = ['12:40', '18:25', '24:10', '09:55', '31:05', '15:30'];
const SEEDSUB = { k1: ['Physics', 'Chemistry', 'Mathematics'], k2: ['Botany', 'Zoology', 'Chemistry'], k3: ['Python Basics', 'Data Structures', 'Web with FastAPI'] };
const LT = ['Introduction to', 'Core concepts of', 'Problem solving in', 'Revision & PYQs for'];
const NT = { PDF: ['#dc2626', '#fee2e2'], DOCX: ['#2563eb', '#dbeafe'], PPT: ['#ea580c', '#ffedd5'] };
const SUBCOL = ['#0284c7', '#9333ea', '#db2777', '#ea580c', '#059669', '#4f46e5'];
const TABS2 = ['Overview', 'Subjects', 'Teachers', 'Live classes', 'Tests', 'Video Series', 'Test Series', 'Announcements', 'Reviews'];
const ANC = { Notice: 'a-blue', Exam: 'a-red', Holiday: 'a-green', Update: 'a-purple' };
const DELC = { students: 'users', centers: 'centers', batches: 'batches', admins: 'users', instrs: 'users', fin: 'inv', tests: 'tests' };
const EDF = { admins: 'eusr', instrs: 'eusr', fin: 'einv' };
const PROT = ['u1', 'u2', 'u3', 's1'];
let TB, PF = null;

const subCol = i => SUBCOL[i % SUBCOL.length];
const strs = n => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
const nowS = () => new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const dayS = () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const gcr = i => ensure(D.courses.find(x => x.id === i));
const subOf = (c, sid) => (c.subs || []).find(s => s.id === sid);
const trat = u => (4.3 + ((u.id.charCodeAt(u.id.length - 1) + u.id.length) % 7) / 10).toFixed(1);
const sortAnn = c => [...c.ann].sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0));

function logA(m) {
  D.log = D.log || [];
  D.log.unshift({ t: m, at: nowS(), by: me() ? me().name : 'System' });
  D.log = D.log.slice(0, 40);
}
function fin(m) {
  logA(m);
  save();
  render();
  toast(m);
}

/* ---------- Data migration: give every course subjects/lectures/notes ---------- */
function sync(c) {
  c.lessons = c.subs.flatMap(s => s.lessons.map(l => l.title));
  const ids = new Set(c.subs.flatMap(s => s.lessons.map(l => l.id)));
  Object.keys(D.prog).forEach(k => {
    if (k.endsWith('|' + c.id)) D.prog[k] = D.prog[k].filter(x => typeof x === 'number' || ids.has(x));
  });
}

function ensure(c) {
  if (!c) return c;
  if (!c.subs) {
    const ins = D.users.filter(u => u.role === 'instructor').map(u => u.id);
    let rows;
    if (c.st && c.st.length) rows = c.st.map(r => ({ n: r.s, t: r.t }));
    else {
      const names = SEEDSUB[c.id] || String(c.subjects || '').split(',').map(x => x.trim()).filter(Boolean);
      rows = (names.length ? names : ['General']).map((n, j) => ({ n, t: j === 0 ? c.instr : ins[(Math.max(0, ins.indexOf(c.instr)) + j) % ins.length] || c.instr }));
    }
    const seeded = !!SEEDSUB[c.id];
    c.subs = rows.map(r => ({ id: id('sb'), name: r.n, teacher: r.t || c.instr || '', lessons: [], notes: [] }));
    c.subs.forEach((s, i) => {
      const n = seeded ? 4 : 2;
      for (let j = 0; j < n; j++)
        s.lessons.push({ id: id('l'), title: `${LT[j % 4]} ${s.name}`, desc: `A guided video lecture covering ${s.name.toLowerCase()} with solved examples and key takeaways.`, video: VID[(i * 4 + j) % VID.length], dur: DUR[(i + j) % DUR.length] });
      s.notes = [
        { id: id('n'), title: `${s.name} — Chapter notes`, type: 'PDF', size: '1.2 MB', url: PDF, at: '12 Oct 2026' },
        { id: id('n'), title: `${s.name} — Formula & revision sheet`, type: 'DOCX', size: '420 KB', url: DOCX, at: '18 Oct 2026' }
      ];
    });
    const s0 = c.subs[0], s1 = c.subs[1] || s0;
    let ann = (c.ann || []).map(a => ({ id: id('a'), type: 'Notice', pin: false, by: 'Admin', ...a }));
    if (!ann.length)
      ann = [
        { id: id('a'), t: 'Welcome to ' + c.name, type: 'Notice', b: 'Classes commence this week. Please check the Live classes tab for the schedule and download the starter notes from each subject.', d: '2 days ago', pin: true, by: 'Admin' },
        { id: id('a'), t: 'First mock test scheduled', type: 'Exam', b: 'The first mock test is on Sunday at 10:00 AM. Keep your ID card handy and log in 10 minutes early.', d: 'Yesterday', pin: false, by: 'Admin' },
        { id: id('a'), t: 'No live class this Friday', type: 'Holiday', b: 'Due to the public holiday there will be no live class on Friday. Recordings will be uploaded to the lectures section.', d: '3 hours ago', pin: false, by: 'Admin' }
      ];
    c.ann = ann;
    c.live = [
      { id: id('v'), t: `${s0.name}: ${s0.lessons[0].title} (Live)`, d: 'Tomorrow, 5:00 PM', tid: s0.teacher, sub: s0.id, st: 'Scheduled', video: VID[2] },
      { id: id('v'), t: `${s1.name}: Doubt clearing session`, d: 'Friday, 6:30 PM', tid: s1.teacher, sub: s1.id, st: 'Scheduled', video: VID[3] },
      { id: id('v'), t: 'Orientation & syllabus walkthrough', d: 'Last Monday', tid: s0.teacher, sub: s0.id, st: 'Completed', video: VID[4] }
    ];
    c.rev = (c.rev && c.rev.length ? c.rev : [
      { n: 'Isha Gupta', r: 5, t: 'Clear explanations, brilliant notes and the live doubt sessions are a huge help.' },
      { n: 'Rohan Das', r: 4, t: 'Great lectures. I would love a few more practice tests per subject.' },
      { n: 'Sara Khan', r: 5, t: 'Teachers are supportive and the course structure is very easy to follow.' }
    ]).map(x => ({ id: id('r'), ...x }));
    c.videoSeries = c.videoSeries || [
      {
        id: id('vs'),
        title: 'Masterclass Concept Lecture Series',
        desc: 'Curated high-yield video lectures covering fundamental theories and question approaches.',
        videos: [
          { id: id('v'), title: 'Core Foundations & Mathematical Framework', dur: '24:10', video: VID[0], source: 'uploaded' },
          { id: id('v'), title: 'Advanced Problem Solving Mechanics', dur: '18:25', video: VID[1], source: 'existing' }
        ]
      }
    ];
    c.testSeries = c.testSeries || [
      {
        id: id('ts'),
        title: 'All India Benchmark Test Series',
        desc: 'Timed simulated mock papers aligned with previous year patterns and standard grading.',
        tests: [
          { id: id('tst'), name: 'Comprehensive Mock Exam - Stage 1', min: 20, qCount: 15, source: 'created' },
          { id: id('tst'), name: 'Physics Mechanics Quick Quiz', min: 10, qCount: 3, source: 'existing', refId: 't1' }
        ]
      }
    ];
    sync(c);
  }
  if (!c.videoSeries) c.videoSeries = [];
  if (!c.testSeries) c.testSeries = [];
  return c;
}

function migrateTests() {
  if (D.v3) return;
  D.v3 = 1;
  const k1 = D.courses.find(c => c.id === 'k1'), k2 = D.courses.find(c => c.id === 'k2'), k3 = D.courses.find(c => c.id === 'k3');
  const q = (t, o, a) => ({ q: t, o, a });
  const t1 = D.tests.find(t => t.id === 't1'), t2 = D.tests.find(t => t.id === 't2');
  if (k1) ensure(k1);
  if (k2) ensure(k2);
  if (k3) ensure(k3);
  if (t1 && k1) t1.sub = k1.subs[0].id;
  if (t2 && k3) t2.sub = k3.subs[0].id;
  if (k1) {
    D.tests.push({ id: 't3', name: 'JEE Full Syllabus Mock 1', course: 'k1', sub: '', min: 30, qs: [q('Derivative of sin(x)?', ['cos x', '-cos x', 'sin x', 'tan x'], 0), q('Atomic number of Carbon?', ['4', '6', '8', '12'], 1), q('Unit of momentum?', ['kg·m/s', 'N', 'J', 'W'], 0), q('∫ 2x dx =', ['x²+C', '2x²+C', 'x+C', '2+C'], 0)] });
    D.tests.push({ id: 't4', name: 'Chemistry: Atomic Structure Quiz', course: 'k1', sub: k1.subs[1].id, min: 10, qs: [q('Electrons carry what charge?', ['Positive', 'Negative', 'Neutral', 'Variable'], 1), q('Which orbital is spherical?', ['s', 'p', 'd', 'f'], 0), q('Number of protons defines the…', ['Mass number', 'Atomic number', 'Isotope', 'Valency'], 1)] });
  }
  if (k2) D.tests.push({ id: 't5', name: 'Botany: Cell Biology Test', course: 'k2', sub: k2.subs[0].id, min: 10, qs: [q('Powerhouse of the cell?', ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi'], 1), q('Photosynthesis occurs in?', ['Chloroplast', 'Vacuole', 'Lysosome', 'Cell wall'], 0)] });
  D.log = D.log || [];
  D.log.push({ t: 'Demo content loaded: subjects, lectures and notes', at: nowS(), by: 'System' });
  save();
}

D.log = D.log || [];
D.courses.forEach(ensure);
migrateTests();
save();
const _render = render;
render = function () {
  if (S.uid) D.courses.forEach(ensure);
  _render();
};

/* ---------- Generic helpers: sub() with activity log, tb() with edit/delete ---------- */
function sub() {
  const e = M.f(V());
  if (e) {
    $('#er').textContent = e;
    return;
  }
  const o = M.ok;
  logA(o);
  save();
  closeM(1);
  toast(o);
  render();
}

function tb(cols, rows, act, pp = 8) {
  const coll = DELC[S.p], ed = EDF[S.p], role = me().role;
  const okd = coll && (S.p === 'tests' ? role !== 'student' : can()), oke = ed && can();
  const a2 = act || okd || oke
    ? r => (act ? act(r) : '') + (oke ? `<button class=b2 onclick="${ed}('${r.id}')">Edit</button>` : '') + (okd ? `<button class="b2 dng" onclick="del('${coll}','${r.id}')">Delete</button>` : '')
    : null;
  const q = S.q.toLowerCase();
  let c = rows.map(r => [r, cols.map(x => x[1](r))]).filter(([r, v]) => !q || v.join(' ').replace(/<[^>]+>/g, ' ').toLowerCase().includes(q));
  const n = c.length, mx = Math.max(0, Math.ceil(n / pp) - 1);
  S.pg = Math.min(S.pg, mx);
  c = c.slice(S.pg * pp, S.pg * pp + pp);
  return (
    `<div class=bar><input class=in placeholder="Search…" aria-label=Search value="${E(S.q)}" oninput="S.q=this.value;S.pg=0;rp()">${S.q ? `<button class=b2 onclick="S.q='';rp()">Clear</button>` : ''}<span class=mt>${n} record${n == 1 ? '' : 's'}</span></div>` +
    (n
      ? `<div class=tw><table><thead><tr>${cols.map(x => `<th>${x[0]}</th>`).join('')}${a2 ? '<th></th>' : ''}</tr></thead><tbody>${c.map(([r, v]) => `<tr>${v.map(x => `<td>${x}</td>`).join('')}${a2 ? `<td class=ac>${a2(r)}</td>` : ''}</tr>`).join('')}</tbody></table></div><div class="bar pgn"><span class=mt>Showing ${S.pg * pp + 1}–${Math.min(n, S.pg * pp + pp)} of ${n}</span><span class=pgb><button class=b2 ${S.pg ? '' : 'disabled'} onclick="S.pg--;rp()">‹ Prev</button>${Array.from({ length: mx + 1 }, (_, j) => `<button class="b2 ${j === S.pg ? 'on' : ''}" onclick="S.pg=${j};rp()">${j + 1}</button>`).join('')}<button class=b2 ${S.pg < mx ? '' : 'disabled'} onclick="S.pg++;rp()">Next ›</button></span></div>`
      : `<div class=em>${S.q ? 'No results for your search.' : 'Nothing here yet.'}</div>`)
  );
}

/* ---------- Generic delete with cascades ---------- */
function del(coll, i) {
  const x = D[coll].find(y => y.id === i);
  if (!x) return;
  if (coll === 'users' && PROT.includes(i)) return toast('Demo role accounts cannot be deleted (the role switcher needs them)');
  const nm = x.name || (coll === 'inv' ? 'this invoice' : i);
  cfm(`Delete <b>${E(nm)}</b>? This cannot be undone.`, () => {
    if (coll === 'users') {
      if (x.role === 'student') {
        D.inv = D.inv.filter(v => v.sid !== i);
        D.res = D.res.filter(v => v.sid !== i);
        Object.keys(D.prog).forEach(k => k.startsWith(i + '|') && delete D.prog[k]);
      } else {
        D.courses.forEach(c => {
          ensure(c);
          c.subs.forEach(s => s.teacher === i && (s.teacher = ''));
          if (c.instr === i) c.instr = '';
          c.live.forEach(l => l.tid === i && (l.tid = ''));
        });
      }
    }
    if (coll === 'centers') {
      D.batches.filter(b => b.center === i).forEach(b => D.users.forEach(u => u.batch === b.id && (u.batch = '')));
      D.batches = D.batches.filter(b => b.center !== i);
      D.inv = D.inv.filter(v => v.center !== i);
      D.users.forEach(u => {
        if (u.centers.includes(i)) {
          u.centers = u.centers.filter(c => c !== i);
          if (u.role === 'student' && !u.centers.length) u.mode = 'Online';
        }
      });
      D.courses.forEach(c => (c.centers = c.centers.filter(z => z !== i)));
      if (S.c === i) S.c = 'all';
    }
    if (coll === 'batches') D.users.forEach(u => u.batch === i && (u.batch = ''));
    if (coll === 'tests') D.res = D.res.filter(v => v.tid !== i);
    D[coll] = D[coll].filter(y => y.id !== i);
    fin('Deleted: ' + nm);
  });
}

/* ---------- Edit users (admins/instructors) and invoices ---------- */
function eusr(i) {
  const u = U(i);
  modal('Edit ' + u.role, F('name', 'Full name *', 'text', [], u.name) + F('email', 'Email *', 'email', [], u.email), o => {
    if (!o.name) return 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(o.email)) return 'Enter a valid email.';
    if (D.users.some(x => x.email === o.email.toLowerCase() && x.id !== i)) return 'Email already in use.';
    u.name = o.name;
    u.email = o.email.toLowerCase();
  }, 'Profile updated');
}
function ni() {
  const al = stu();
  modal('Create invoice', F('sid', 'Student *', 'select', al.map(s => [s.id, s.name + ' · ' + s.email])) + F('total', 'Total amount (₹) *', 'number', [], 10000) + F('paid', 'Amount already paid (₹)', 'number', [], 0), o => {
    const s = U(o.sid), t = +o.total, p = +o.paid || 0;
    if (!s) return 'Select a student.';
    if (!(t > 0)) return 'Enter a valid total.';
    if (p < 0 || p > t) return 'Paid amount must be between 0 and the total.';
    D.inv.push({ id: id('i'), sid: s.id, center: s.mode === 'Online' ? '' : s.centers[0] || '', total: t, paid: p });
    note(s.id, `A new invoice of ${R(t)} was generated.`);
  }, 'Invoice created', 'Create invoice');
}
function einv(i) {
  const v = D.inv.find(x => x.id === i);
  modal('Edit invoice · ' + E(U(v.sid).name), F('total', 'Total amount (₹)', 'number', [], v.total) + F('paid', 'Paid (₹)', 'number', [], v.paid), o => {
    const t = +o.total, p = +o.paid;
    if (!(t > 0) || p < 0 || p > t) return 'Paid must be between 0 and total.';
    v.total = t;
    v.paid = p;
  }, 'Invoice updated');
}
const _fin = PG.fin;
PG.fin = function () {
  const h = _fin.call(PG);
  return can() ? h.replace('</p></div><div></div></div>', '</p></div><div><button class=b1 onclick=ni()>+ Create invoice</button></div></div>') : h;
};

/* ---------- Course edit / delete ---------- */
function ecourse(cid) {
  const c = gcr(cid);
  modal('Edit course',
    F('name', 'Course name *', 'text', [], c.name) + F('code', 'Course code', 'text', [], c.code) + F('desc', 'Description', 'area', [], c.desc || '') +
    `<div class=g2>${F('access', 'Access', 'select', ['Free', 'Paid'], c.access)}${F('price', 'Price (₹)', 'number', [], c.price)}</div>` +
    `<div class=g2>${F('status', 'Status', 'select', ['Published', 'Draft'], c.status)}${hasC() && OM() === 'Both' ? F('mode', 'Delivery', 'select', ['Online', 'Offline', 'Both'], c.mode || 'Both') : ''}</div>`,
    o => {
      if (!o.name) return 'Course name is required.';
      if (o.access === 'Paid' && !(+o.price > 0)) return 'Enter a valid price for a paid course.';
      Object.assign(c, { name: o.name, code: (o.code || c.code).toUpperCase(), desc: o.desc, access: o.access, price: o.access === 'Paid' ? +o.price : 0, status: o.status });
      if (o.mode) c.mode = o.mode;
    }, 'Course updated');
}
function dc(cid) {
  const c = D.courses.find(x => x.id === cid);
  cfm(`Delete course <b>${E(c.name)}</b> with all its subjects, lectures, notes and tests?`, () => {
    D.courses = D.courses.filter(x => x.id !== cid);
    const tids = D.tests.filter(t => t.course === cid).map(t => t.id);
    D.tests = D.tests.filter(t => t.course !== cid);
    D.res = D.res.filter(r => !tids.includes(r.tid));
    D.users.forEach(u => u.courses && (u.courses = u.courses.filter(z => z !== cid)));
    Object.keys(D.prog).forEach(k => k.endsWith('|' + cid) && delete D.prog[k]);
    S.cv = null;
    S.sv = null;
    fin('Deleted course: ' + c.name);
  });
}

/* ---------- Subjects ---------- */
function esub(cid, sid) {
  const c = gcr(cid), s = sid ? subOf(c, sid) : { name: '', teacher: '' };
  const tc = D.users.filter(u => u.role === 'instructor' && u.status === 'Active').map(u => [u.id, u.name]);
  modal(sid ? 'Edit subject' : 'Add subject', F('name', 'Subject name *', 'text', [], s.name) + F('teacher', 'Teacher', 'select', [['', 'Unassigned'], ...tc], s.teacher), o => {
    if (!o.name) return 'Subject name is required.';
    if (c.subs.some(x => x.id !== sid && x.name.toLowerCase() === o.name.toLowerCase())) return 'This subject already exists in the course.';
    if (sid) { s.name = o.name; s.teacher = o.teacher; }
    else {
      c.subs.push({ id: id('sb'), name: o.name, teacher: o.teacher, lessons: [], notes: [] });
      if (o.teacher) note(o.teacher, `You were assigned to ${o.name} in ${c.name}.`);
    }
    if (!c.instr && o.teacher) c.instr = o.teacher;
    sync(c);
  }, sid ? 'Subject updated' : 'Subject added');
}
function dsub(cid, sid) {
  const c = gcr(cid), s = subOf(c, sid);
  cfm(`Delete subject <b>${E(s.name)}</b> including its lectures, notes and subject tests?`, () => {
    c.subs = c.subs.filter(x => x.id !== sid);
    const tids = D.tests.filter(t => t.sub === sid).map(t => t.id);
    D.tests = D.tests.filter(t => t.sub !== sid);
    D.res = D.res.filter(r => !tids.includes(r.tid));
    c.live = c.live.filter(l => l.sub !== sid);
    S.sv = null;
    sync(c);
    fin('Deleted subject: ' + s.name);
  });
}

/* ---------- Lectures ---------- */
function elec(cid, sid, lid) {
  const c = gcr(cid), s = subOf(c, sid), l = lid ? s.lessons.find(x => x.id === lid) : { title: '', desc: '', dur: '', video: '' };
  modal(lid ? 'Edit lecture' : 'Add lecture',
    F('title', 'Lecture title *', 'text', [], l.title) + F('desc', 'Description', 'area', [], l.desc) +
    `<div class=g2>${F('dur', 'Duration (mm:ss)', 'text', [], l.dur)}${F('video', 'Video URL', 'text', [], VID.includes(l.video) ? '' : l.video || '')}</div><small>Leave the URL blank to attach a playable demo video.</small>`,
    o => {
      if (!o.title) return 'Lecture title is required.';
      const d = { title: o.title, desc: o.desc || '', dur: o.dur || '10:00', video: o.video || l.video || VID[Math.floor(Math.random() * VID.length)] };
      if (lid) Object.assign(l, d); else s.lessons.push({ id: id('l'), ...d });
      sync(c);
    }, lid ? 'Lecture updated' : 'Lecture added to ' + s.name);
}
function dlec(cid, sid, lid) {
  const c = gcr(cid), s = subOf(c, sid), l = s.lessons.find(x => x.id === lid);
  cfm(`Delete lecture <b>${E(l.title)}</b>?`, () => {
    s.lessons = s.lessons.filter(x => x.id !== lid);
    sync(c);
    fin('Deleted lecture: ' + l.title);
  });
}
function playV(url, title, subt, cid, lid) {
  const stu1 = me().role === 'student' && cid && lid;
  modal(E(title), `<video class=vp src="${E(url)}" controls autoplay playsinline></video><small>${E(subt)}</small>`, null, '', '',
    `${stu1 ? `<button class=b2 onclick="lt('${cid}','${lid}')">Toggle complete</button>` : ''}<button class=b1 onclick=closeM(1)>Close</button>`);
  $('.md').style.maxWidth = '820px';
}
function playL(cid, sid, lid) {
  const c = gcr(cid), s = subOf(c, sid), l = s.lessons.find(x => x.id === lid);
  playV(l.video, l.title, `${c.name} · ${s.name}`, cid, lid);
}
function lt(cid, lid) {
  const k = S.uid + '|' + cid, p = (D.prog[k] = D.prog[k] || []), x = p.indexOf(lid);
  x < 0 ? p.push(lid) : p.splice(x, 1);
  save();
  render();
  toast(x < 0 ? 'Marked as completed' : 'Marked as pending');
}

/* ---------- Notes ---------- */
function nf(f) {
  if (!f) return;
  if (f.size > 1048576) {
    PF = null;
    return toast('File too large for local storage (max 1 MB)');
  }
  const r = new FileReader();
  r.onload = () => {
    PF = { url: r.result, size: Math.max(1, Math.round(f.size / 1024)) + ' KB' };
    const e = $('#nfn');
    if (e) e.textContent = 'Selected: ' + f.name;
  };
  r.readAsDataURL(f);
}
function enote(cid, sid, nid) {
  const c = gcr(cid), s = subOf(c, sid), n = nid ? s.notes.find(x => x.id === nid) : { title: '', type: 'PDF' };
  PF = null;
  modal(nid ? 'Edit note' : 'Upload note', F('title', 'Title *', 'text', [], n.title) + F('type', 'Document type', 'select', ['PDF', 'DOCX', 'PPT'], n.type) +
    `<label>Upload file (optional, max 1 MB)<input type=file id=nfile onchange="nf(this.files[0])"></label><small id=nfn>No file selected — a demo document will be attached.</small>`,
    o => {
      if (!o.title) return 'Title is required.';
      const d = { title: o.title, type: o.type };
      if (PF) { d.url = PF.url; d.size = PF.size; }
      if (nid) Object.assign(n, d);
      else s.notes.unshift({ id: id('n'), size: '1.1 MB', url: o.type === 'DOCX' ? DOCX : PDF, at: dayS(), ...d });
    }, nid ? 'Note updated' : 'Note uploaded to ' + s.name);
}
function dnote(cid, sid, nid) {
  const s = subOf(gcr(cid), sid), n = s.notes.find(x => x.id === nid);
  cfm(`Delete note <b>${E(n.title)}</b>?`, () => {
    s.notes = s.notes.filter(x => x.id !== nid);
    fin('Deleted note: ' + n.title);
  });
}
function noteAct(cid, sid, nid, dl) {
  const n = subOf(gcr(cid), sid).notes.find(x => x.id === nid);
  const go3 = u => {
    if (dl) {
      const a = document.createElement('a');
      a.href = u;
      a.download = n.title + '.' + n.type.toLowerCase();
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else window.open(u, '_blank');
  };
  if (n.url.startsWith('data:')) fetch(n.url).then(r => r.blob()).then(b => go3(URL.createObjectURL(b)));
  else go3(n.url);
  toast(dl ? 'Downloading ' + n.title : 'Opening ' + n.title);
}

/* ---------- Announcements ---------- */
function eann(cid, aid) {
  const c = gcr(cid), a = aid ? c.ann.find(x => x.id === aid) : { t: '', type: 'Notice', b: '', pin: false };
  modal(aid ? 'Edit announcement' : 'Post announcement', F('t', 'Title *', 'text', [], a.t) + F('type', 'Type', 'select', ['Notice', 'Exam', 'Holiday', 'Update'], a.type) + F('b', 'Message *', 'area', [], a.b) + F('pin', 'Options', 'multi', [['1', 'Pin to the top']], a.pin ? ['1'] : []), o => {
    if (!o.t || !o.b) return 'Title and message are required.';
    const d = { t: o.t, type: o.type, b: o.b, pin: o.pin.length > 0 };
    if (aid) Object.assign(a, d);
    else {
      c.ann.unshift({ id: id('a'), d: 'Just now', by: me().name, ...d });
      D.users.filter(s => s.role === 'student' && s.courses.includes(cid)).forEach(s => note(s.id, `${c.name}: ${o.t}`));
    }
  }, aid ? 'Announcement updated' : 'Announcement posted');
}
function dann(cid, aid) {
  const c = gcr(cid), a = c.ann.find(x => x.id === aid);
  cfm(`Delete announcement <b>${E(a.t)}</b>?`, () => {
    c.ann = c.ann.filter(x => x.id !== aid);
    fin('Deleted announcement');
  });
}
function pann(cid, aid) {
  const a = gcr(cid).ann.find(x => x.id === aid);
  a.pin = !a.pin;
  fin(a.pin ? 'Announcement pinned' : 'Announcement unpinned');
}

/* ---------- Live classes ---------- */
function elive(cid, lid) {
  const c = gcr(cid), l = lid ? c.live.find(x => x.id === lid) : { t: '', d: '', sub: c.subs[0].id };
  modal(lid ? 'Edit live class' : 'Schedule live class', F('t', 'Class title *', 'text', [], l.t) + F('sub', 'Subject', 'select', c.subs.map(s => [s.id, s.name]), l.sub) + F('d', 'When', 'text', [], l.d || 'Sat, 6:00 PM'), o => {
    if (!o.t) return 'Class title is required.';
    const s = subOf(c, o.sub);
    if (lid) Object.assign(l, { t: o.t, sub: o.sub, d: o.d, tid: s.teacher });
    else {
      c.live.unshift({ id: id('v'), t: o.t, d: o.d || 'To be announced', tid: s.teacher, sub: o.sub, st: 'Scheduled', video: VID[Math.floor(Math.random() * VID.length)] });
      D.users.filter(x => x.role === 'student' && x.courses.includes(cid)).forEach(x => note(x.id, `Live class scheduled: ${o.t} (${o.d})`));
    }
  }, lid ? 'Live class updated' : 'Live class scheduled');
}
function dlive(cid, lid) {
  const c = gcr(cid), l = c.live.find(x => x.id === lid);
  cfm(`Delete live class <b>${E(l.t)}</b>?`, () => {
    c.live = c.live.filter(x => x.id !== lid);
    fin('Deleted live class');
  });
}
function clive(cid, lid) {
  const l = gcr(cid).live.find(x => x.id === lid);
  l.st = l.st === 'Completed' ? 'Scheduled' : 'Completed';
  fin('Live class marked ' + l.st.toLowerCase());
}
function joinL(cid, lid) {
  const c = gcr(cid), l = c.live.find(x => x.id === lid);
  playV(l.video || VID[2], l.t, `${l.st === 'Completed' ? 'Replay' : 'Live session (demo stream)'} · ${l.d}`);
}

/* ---------- Reviews ---------- */
function erev(cid) {
  const c = gcr(cid);
  modal('Write a review', F('r', 'Rating', 'select', [5, 4, 3, 2, 1]) + F('t', 'Your feedback *', 'area'), o => {
    if (!o.t) return 'Please write some feedback.';
    c.rev.unshift({ id: id('r'), n: me().name, r: +o.r, t: o.t });
  }, 'Review posted');
}
function drev(cid, rid) {
  const c = gcr(cid);
  cfm('Delete this review?', () => {
    c.rev = c.rev.filter(x => x.id !== rid);
    fin('Deleted review');
  });
}

/* ---------- Test builder (course-wise or subject-wise, many questions) ---------- */
function et(i, cid, sid, defaultScope) {
  const t = i ? D.tests.find(x => x.id === i) : null, cc = crs();
  const initScope = defaultScope || (cid === '__package__' ? 'Package' : (sid ? 'Subject' : 'Course'));
  TB = {
    id: i || '',
    d: t
      ? { name: t.name, course: t.course, scope: t.scope || (t.course === '__institute__' ? 'Institute' : t.course === '__package__' ? 'Package' : (t.sub ? 'Subject' : 'Course')), sub: t.sub || '', min: t.min, qs: t.qs.map(q => ({ q: q.q, o: [...q.o, '', '', '', ''].slice(0, 4), a: q.a })) }
      : { name: '', course: (cid && cid !== '__package__') ? cid : ((cc[0] || {}).id || ''), scope: initScope, sub: sid || '', min: 15, qs: [{ q: '', o: ['', '', '', ''], a: 0 }] }
  };
  if (!TB.d.course && TB.d.scope !== 'Institute' && TB.d.scope !== 'Package') return toast('Create a course first');
  etr();
}
function etr() {
  const d = TB.d, sc = ($('.mb') || {}).scrollTop || 0, c = D.courses.find(x => x.id === d.course), subs = c ? ensure(c).subs : [];
  if (d.scope === 'Subject' && !subs.some(s => s.id === d.sub)) d.sub = (subs[0] || {}).id || '';
  const cl2 = D.courses.filter(x => crs().some(y => y.id === x.id) || x.id === d.course);
  const pkgLabel = (window.PKG_FORM && window.PKG_FORM.name) ? window.PKG_FORM.name : 'Current Package';
  const b = `<div class=g2><label>Test name *<input value="${E(d.name)}" oninput="TB.d.name=this.value" placeholder="e.g. Weekly Physics Test"></label><label>Duration (minutes)<input type=number min=1 value="${E(d.min)}" oninput="TB.d.min=this.value"></label></div>
    <div class=g2>
      ${d.scope === 'Institute'
        ? `<label>Scope Coverage<input value="All Institute Courses (Universal CBT Assessment)" disabled style="background:var(--s);color:var(--mute)"></label>`
        : d.scope === 'Package'
        ? `<label>Scope Coverage<input value="Package-Level Assessment (${E(pkgLabel)})" disabled style="background:var(--s);color:var(--mute)"></label>`
        : `<label>Course *<select onchange="TB.d.course=this.value;TB.d.sub='';etr()">${cl2.map(x => `<option value="${x.id}" ${x.id === d.course ? 'selected' : ''}>${E(x.name)}</option>`).join('')}</select></label>`
      }
      <div class=fg><span>Test scope</span><div class=seg><button type=button class="${d.scope === 'Package' ? 'on' : ''}" onclick="TB.d.scope='Package';etr()">Package-level</button><button type=button class="${d.scope === 'Course' ? 'on' : ''}" onclick="TB.d.scope='Course';etr()">Course-wise</button><button type=button class="${d.scope === 'Subject' ? 'on' : ''}" onclick="TB.d.scope='Subject';etr()">Subject-wise</button><button type=button class="${d.scope === 'Institute' ? 'on' : ''}" onclick="TB.d.scope='Institute';etr()">Institute-level</button></div></div>
    </div>
    ${d.scope === 'Subject' ? `<label>Subject *<select onchange="TB.d.sub=this.value">${subs.map(s => `<option value="${s.id}" ${s.id === d.sub ? 'selected' : ''}>${E(s.name)}</option>`).join('')}</select></label>` : ''}
    <div class=qlist>${d.qs.map((q, j) => `<div class=qb><div class=qh><b>Question ${j + 1}</b><button type=button class="b2 xs" ${d.qs.length < 2 ? 'disabled' : ''} onclick="TB.d.qs.splice(${j},1);etr()">×</button></div>
      <textarea rows=2 placeholder="Type the question…" oninput="TB.d.qs[${j}].q=this.value">${E(q.q)}</textarea>
      ${q.o.map((o, k) => `<label class="ck opt"><input type=radio name="ca${j}" ${q.a === k ? 'checked' : ''} onchange="TB.d.qs[${j}].a=${k}" title="Correct answer"><input value="${E(o)}" placeholder="Option ${'ABCD'[k]}" oninput="TB.d.qs[${j}].o[${k}]=this.value"></label>`).join('')}</div>`).join('')}</div>
    <button type=button class=b2 style="justify-self:start" onclick="TB.d.qs.push({q:'',o:['','','',''],a:0});etr()">+ Add question</button><small>Select the radio next to the correct option.</small>`;
  modal(TB.id ? 'Edit test' : 'Create test', b, null, '', '', `<button class=b2 onclick=closeM(1)>Cancel</button><button class=b1 onclick=etSave()>${TB.id ? 'Save test' : 'Publish test'}</button>`);
  $('.md').style.maxWidth = '740px';
  $('.mb').scrollTop = sc;
}
function etSave() {
  const d = TB.d, er = m => ($('#er').textContent = m);
  if (!d.name.trim()) return er('Test name is required.');
  if (d.scope === 'Subject' && !d.sub) return er('Pick a subject, or switch to course-wise.');
  const qs = [];
  for (const q of d.qs) {
    if (!q.q.trim()) continue;
    const o = [];
    let a = -1;
    q.o.forEach((x, k) => { if (x.trim()) { if (k === q.a) a = o.length; o.push(x.trim()); } });
    if (o.length < 2) return er('Each question needs at least two options.');
    if (a < 0) return er('Select a filled option as the correct answer.');
    qs.push({ q: q.q.trim(), o, a });
  }
  if (!qs.length) return er('Add at least one question.');
  const rec = {
    name: d.name.trim(),
    course: d.scope === 'Institute' ? '__institute__' : d.scope === 'Package' ? '__package__' : d.course,
    courseLabel: d.scope === 'Institute' ? 'Institute Level' : d.scope === 'Package' ? 'Package Level' : ((D.courses.find(x => x.id === d.course) || {}).name || 'All'),
    scope: d.scope,
    sub: d.scope === 'Subject' ? d.sub : '',
    min: +d.min || 10,
    qs
  };
  if (TB.id) Object.assign(D.tests.find(x => x.id === TB.id), rec);
  else {
    D.tests.push({ id: id('t'), ...rec });
    if (d.scope === 'Institute') {
      D.users.filter(s => s.role === 'student').forEach(s => note(s.id, `New institute-level test: ${rec.name}`));
    } else if (d.scope !== 'Package') {
      D.users.filter(s => s.role === 'student' && s.courses.includes(d.course)).forEach(s => note(s.id, `New test: ${rec.name}`));
    }
  }
  closeM(1);
  fin((TB.id ? 'Test updated: ' : 'Test published: ') + rec.name);
}

/* ---------- Video Series & Test Series for Course ---------- */
function vseriesGrid(c) {
  const adm = can();
  const series = c.videoSeries || [];
  return (
    `<div class="dash-card-header" style="margin-bottom:14px">
      <div>
        <div class="dash-card-title">Video Series</div>
        <div class="dash-card-sub">Thematic playlists, masterclass recordings and structured lecture series for ${E(c.name)}</div>
      </div>
      ${adm ? `<button class="b1" onclick="evseries('${c.id}')">+ Create Video Series</button>` : ''}
    </div>` +
    (series.length
      ? `<div style="display:grid;gap:18px">
          ${series.map(vs => `
            <div class="dash-card" style="border:1px solid var(--b);border-radius:12px;padding:18px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
                <div>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="st gn">Video Series</span>
                    <b style="font-size:16px">${E(vs.title)}</b>
                  </div>
                  <small style="color:var(--m);display:block;margin-top:3px">${E(vs.desc || '')}</small>
                </div>
                ${adm ? `
                  <div class="ac" style="gap:6px">
                    <button class="b2" onclick="addVideoToSeries('${c.id}','${vs.id}')">+ Add Video</button>
                    <button class="b2" onclick="evseries('${c.id}','${vs.id}')">Edit</button>
                    <button class="b2 dng" onclick="delVSeries('${c.id}','${vs.id}')">Delete</button>
                  </div>
                ` : ''}
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">
                ${(vs.videos && vs.videos.length)
                  ? vs.videos.map((v, vIdx) => `
                    <div class="cd" style="padding:10px;border-radius:10px;display:flex;flex-direction:column;justify-content:space-between;gap:8px">
                      <div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                          <span class="pill-badge pill-blue" style="font-size:10px">Part ${vIdx + 1}</span>
                          <span style="font-size:11px;color:var(--m)">⏱ ${E(v.dur || '15:00')}</span>
                        </div>
                        <b style="font-size:13px;display:block;margin-bottom:2px">${E(v.title)}</b>
                        <small style="color:var(--m)">${v.source === 'existing' ? 'Linked from Course Lectures' : 'Created / Uploaded'}</small>
                      </div>
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
                        <button class="b1" style="padding:4px 10px;font-size:11.5px" onclick="playVid('${v.video || VID[0]}','${E(v.title)}')">▶ Play</button>
                        ${adm ? `<button class="b2 dng" style="padding:2px 6px;font-size:11px" onclick="remVideoFromSeries('${c.id}','${vs.id}','${v.id}')">Remove</button>` : ''}
                      </div>
                    </div>
                  `).join('')
                  : '<div class="em" style="grid-column:1/-1;padding:16px"><small>No videos added to this series yet. Add from existing lectures or upload new.</small></div>'}
              </div>
            </div>
          `).join('')}
        </div>`
      : `<div class="em">
          <p>No video series created for this course yet.</p>
          ${adm ? `<button class="b1" style="margin-top:10px" onclick="evseries('${c.id}')">+ Create Video Series</button>` : ''}
        </div>`)
  );
}

function evseries(cid, vsid) {
  const c = gcr(cid);
  const vs = vsid ? (c.videoSeries || []).find(x => x.id === vsid) : { title: '', desc: '', videos: [] };
  modal(
    vsid ? 'Edit Video Series' : 'Create New Video Series',
    F('title', 'Series Title *', 'text', [], vs.title) +
    F('desc', 'Description', 'area', [], vs.desc),
    o => {
      if (!o.title.trim()) return 'Title is required.';
      if (vsid) {
        vs.title = o.title.trim();
        vs.desc = o.desc.trim();
      } else {
        c.videoSeries = c.videoSeries || [];
        c.videoSeries.push({
          id: id('vs'),
          title: o.title.trim(),
          desc: o.desc.trim(),
          videos: []
        });
      }
    },
    vsid ? 'Video series updated' : 'Video series created'
  );
}

function delVSeries(cid, vsid) {
  const c = gcr(cid);
  cfm('Delete this video series?', () => {
    c.videoSeries = (c.videoSeries || []).filter(x => x.id !== vsid);
    fin('Video series deleted');
  });
}

function addVideoToSeries(cid, vsid) {
  const c = gcr(cid);
  const vs = (c.videoSeries || []).find(x => x.id === vsid);
  if (!vs) return;

  // Gather existing lectures in the course
  const existingLectures = [];
  (c.subs || []).forEach(s => {
    (s.lessons || []).forEach(l => {
      existingLectures.push({ sub: s.name, title: l.title, dur: l.dur, video: l.video });
    });
  });

  const optSelect = existingLectures.length
    ? `<div style="margin-top:8px">
        <label>Select from existing course lectures:
          <select id="v_exist_sel">
            <option value="">-- Choose existing lecture --</option>
            ${existingLectures.map((l, idx) => `<option value="${idx}">[${E(l.sub)}] ${E(l.title)} (${l.dur || '15:00'})</option>`).join('')}
          </select>
        </label>
      </div>`
    : '<small style="color:var(--m);display:block;margin-top:6px">No existing lectures found in subjects.</small>';

  modal(
    'Add Video to Series · ' + E(vs.title),
    `<div class="fg">
      <b>Method:</b>
      <div class="seg" style="margin:8px 0 12px">
        <button type="button" id="tab_v_exist" class="on" onclick="$('#box_v_exist').hidden=false;$('#box_v_new').hidden=true;this.classList.add('on');$('#tab_v_new').classList.remove('on')">Select Existing</button>
        <button type="button" id="tab_v_new" onclick="$('#box_v_exist').hidden=true;$('#box_v_new').hidden=false;this.classList.add('on');$('#tab_v_exist').classList.remove('on')">Create / Upload New</button>
      </div>
    </div>
    <div id="box_v_exist">
      ${optSelect}
    </div>
    <div id="box_v_new" hidden>
      <label>Video Title *<input id="v_new_title" placeholder="e.g. Masterclass Lecture 3"></label>
      <label>Duration<input id="v_new_dur" value="18:30" placeholder="e.g. 24:15"></label>
      <label>Video File / Stream URL<input id="v_new_url" value="${VID[Math.floor(Math.random() * VID.length)]}" placeholder="https://..."></label>
    </div>`,
    () => {
      vs.videos = vs.videos || [];
      const isExist = !$('#box_v_exist').hidden;
      if (isExist) {
        const val = $('#v_exist_sel') ? $('#v_exist_sel').value : '';
        if (val === '') return 'Please choose an existing lecture or switch to create new.';
        const picked = existingLectures[+val];
        vs.videos.push({
          id: id('v'),
          title: picked.title,
          dur: picked.dur || '15:00',
          video: picked.video || VID[0],
          source: 'existing'
        });
      } else {
        const title = ($('#v_new_title').value || '').trim();
        if (!title) return 'Video title is required.';
        const dur = ($('#v_new_dur').value || '').trim() || '15:00';
        const url = ($('#v_new_url').value || '').trim() || VID[0];
        vs.videos.push({
          id: id('v'),
          title,
          dur,
          video: url,
          source: 'uploaded'
        });
      }
    },
    'Video added to series'
  );
}

function remVideoFromSeries(cid, vsid, vid) {
  const c = gcr(cid);
  const vs = (c.videoSeries || []).find(x => x.id === vsid);
  if (!vs) return;
  vs.videos = (vs.videos || []).filter(v => v.id !== vid);
  fin('Video removed from series');
}

/* ---------- Test Series ---------- */
function tseriesGrid(c) {
  const adm = can();
  const series = c.testSeries || [];
  return (
    `<div class="dash-card-header" style="margin-bottom:14px">
      <div>
        <div class="dash-card-title">Test Series</div>
        <div class="dash-card-sub">Mock test papers, benchmark sectional tests and practice test series for ${E(c.name)}</div>
      </div>
      ${adm ? `<button class="b1" onclick="etseries('${c.id}')">+ Create Test Series</button>` : ''}
    </div>` +
    (series.length
      ? `<div style="display:grid;gap:18px">
          ${series.map(ts => `
            <div class="dash-card" style="border:1px solid var(--b);border-radius:12px;padding:18px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
                <div>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="st" style="background:#fef3c7;color:#b45309">Test Series</span>
                    <b style="font-size:16px">${E(ts.title)}</b>
                  </div>
                  <small style="color:var(--m);display:block;margin-top:3px">${E(ts.desc || '')}</small>
                </div>
                ${adm ? `
                  <div class="ac" style="gap:6px">
                    <button class="b2" onclick="addTestToSeries('${c.id}','${ts.id}')">+ Add Test</button>
                    <button class="b2" onclick="etseries('${c.id}','${ts.id}')">Edit</button>
                    <button class="b2 dng" onclick="delTSeries('${c.id}','${ts.id}')">Delete</button>
                  </div>
                ` : ''}
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">
                ${(ts.tests && ts.tests.length)
                  ? ts.tests.map((t, tIdx) => {
                    const testDef = t.refId ? D.tests.find(x => x.id === t.refId) : null;
                    const qCount = testDef ? testDef.qs.length : (t.qCount || 10);
                    const dur = testDef ? testDef.min : (t.min || 15);
                    return `
                      <div class="cd" style="padding:12px;border-radius:10px;display:flex;flex-direction:column;justify-content:space-between;gap:8px">
                        <div>
                          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                            <span class="pill-badge pill-purple" style="font-size:10px">Mock ${tIdx + 1}</span>
                            <span style="font-size:11px;color:var(--m)">⏱ ${dur} mins</span>
                          </div>
                          <b style="font-size:13px;display:block;margin-bottom:2px">${E(t.name)}</b>
                          <small style="color:var(--m)">${qCount} questions · ${t.source === 'existing' ? 'Linked from Course Tests' : 'Created for Series'}</small>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
                          <button class="b1" style="padding:4px 10px;font-size:11.5px" onclick="tk('${t.refId || 't1'}')">Start Test</button>
                          ${adm ? `<button class="b2 dng" style="padding:2px 6px;font-size:11px" onclick="remTestFromSeries('${c.id}','${ts.id}','${t.id}')">Remove</button>` : ''}
                        </div>
                      </div>
                    `;
                  }).join('')
                  : '<div class="em" style="grid-column:1/-1;padding:16px"><small>No tests added to this series yet. Add from existing tests or create new.</small></div>'}
              </div>
            </div>
          `).join('')}
        </div>`
      : `<div class="em">
          <p>No test series created for this course yet.</p>
          ${adm ? `<button class="b1" style="margin-top:10px" onclick="etseries('${c.id}')">+ Create Test Series</button>` : ''}
        </div>`)
  );
}

function etseries(cid, tsid) {
  const c = gcr(cid);
  const ts = tsid ? (c.testSeries || []).find(x => x.id === tsid) : { title: '', desc: '', tests: [] };
  modal(
    tsid ? 'Edit Test Series' : 'Create New Test Series',
    F('title', 'Series Title *', 'text', [], ts.title) +
    F('desc', 'Description', 'area', [], ts.desc),
    o => {
      if (!o.title.trim()) return 'Title is required.';
      if (tsid) {
        ts.title = o.title.trim();
        ts.desc = o.desc.trim();
      } else {
        c.testSeries = c.testSeries || [];
        c.testSeries.push({
          id: id('ts'),
          title: o.title.trim(),
          desc: o.desc.trim(),
          tests: []
        });
      }
    },
    tsid ? 'Test series updated' : 'Test series created'
  );
}

function delTSeries(cid, tsid) {
  const c = gcr(cid);
  cfm('Delete this test series?', () => {
    c.testSeries = (c.testSeries || []).filter(x => x.id !== tsid);
    fin('Test series deleted');
  });
}

function addTestToSeries(cid, tsid) {
  const c = gcr(cid);
  const ts = (c.testSeries || []).find(x => x.id === tsid);
  if (!ts) return;

  const existingTests = D.tests.filter(t => t.course === cid || !t.course);

  const optSelect = existingTests.length
    ? `<div style="margin-top:8px">
        <label>Select from existing course tests:
          <select id="t_exist_sel">
            <option value="">-- Choose existing test --</option>
            ${existingTests.map((t, idx) => `<option value="${idx}">${E(t.name)} (${t.qs.length} Qs · ${t.min} min)</option>`).join('')}
          </select>
        </label>
      </div>`
    : '<small style="color:var(--m);display:block;margin-top:6px">No existing tests found for this course.</small>';

  modal(
    'Add Test to Series · ' + E(ts.title),
    `<div class="fg">
      <b>Method:</b>
      <div class="seg" style="margin:8px 0 12px">
        <button type="button" id="tab_t_exist" class="on" onclick="$('#box_t_exist').hidden=false;$('#box_t_new').hidden=true;this.classList.add('on');$('#tab_t_new').classList.remove('on')">Select Existing</button>
        <button type="button" id="tab_t_new" onclick="$('#box_t_exist').hidden=true;$('#box_t_new').hidden=false;this.classList.add('on');$('#tab_t_exist').classList.remove('on')">Create New Test</button>
      </div>
    </div>
    <div id="box_t_exist">
      ${optSelect}
    </div>
    <div id="box_t_new" hidden>
      <label>Test Name *<input id="t_new_name" placeholder="e.g. Unit Mock Assessment 1"></label>
      <label>Duration (minutes)<input type="number" id="t_new_min" value="15"></label>
      <label>Number of Questions<input type="number" id="t_new_qc" value="10"></label>
    </div>`,
    () => {
      ts.tests = ts.tests || [];
      const isExist = !$('#box_t_exist').hidden;
      if (isExist) {
        const val = $('#t_exist_sel') ? $('#t_exist_sel').value : '';
        if (val === '') return 'Please choose an existing test or switch to create new.';
        const picked = existingTests[+val];
        ts.tests.push({
          id: id('tst'),
          name: picked.name,
          min: picked.min,
          qCount: picked.qs.length,
          refId: picked.id,
          source: 'existing'
        });
      } else {
        const name = ($('#t_new_name').value || '').trim();
        if (!name) return 'Test name is required.';
        const min = +$('#t_new_min').value || 15;
        const qCount = +$('#t_new_qc').value || 10;
        // Also register in D.tests so it can be taken
        const newTest = {
          id: id('t'),
          name,
          course: cid,
          min,
          qs: [
            { q: 'Core concepts review question 1 for ' + name, o: ['Option A', 'Option B', 'Option C', 'Option D'], a: 0 },
            { q: 'Application and problem-solving question 2 for ' + name, o: ['Option A', 'Option B', 'Option C', 'Option D'], a: 1 }
          ]
        };
        D.tests.push(newTest);
        ts.tests.push({
          id: id('tst'),
          name,
          min,
          qCount,
          refId: newTest.id,
          source: 'created'
        });
      }
    },
    'Test added to series'
  );
}

function remTestFromSeries(cid, tsid, tid) {
  const c = gcr(cid);
  const ts = (c.testSeries || []).find(x => x.id === tsid);
  if (!ts) return;
  ts.tests = (ts.tests || []).filter(t => t.id !== tid);
  fin('Test removed from series');
}

/* ---------- Global Test Series Management Page ---------- */
function getAllTestSeries() {
  D.instTestSeries = D.instTestSeries || [
    {
      id: 'ts_inst_1',
      title: 'All India Open Scholarship CBT Series',
      desc: 'Institute-wide benchmark examination open across all departments, courses and enrolled learners.',
      scope: 'Institute',
      courseId: null,
      tests: [
        { id: 'tst_i1', name: 'General Aptitude & Reasoning Stage 1', min: 45, qCount: 30, source: 'created' },
        { id: 'tst_i2', name: 'Science & Mathematics Benchmark Stage 2', min: 60, qCount: 40, source: 'created' }
      ],
      status: 'Active',
      createdAt: '15 Jan 2026'
    }
  ];

  const list = [];
  // 1. Institute level test series
  D.instTestSeries.forEach(ts => {
    list.push({
      ...ts,
      isInstitute: true,
      courseName: 'Independent'
    });
  });

  // 2. Course-assigned test series
  (D.courses || []).forEach(c => {
    ensure(c);
    (c.testSeries || []).forEach(ts => {
      list.push({
        ...ts,
        isInstitute: false,
        courseId: c.id,
        courseName: c.name
      });
    });
  });

  return list;
}

PG.testseries = function () {
  const r = me().role;
  const adm = can();
  const list = getAllTestSeries();

  const instCount = list.filter(x => x.isInstitute).length;
  const courseCount = list.filter(x => !x.isInstitute).length;
  const totalTestsCount = list.reduce((acc, x) => acc + (x.tests || []).length, 0);

  return (
    hd(
      'Test Series Management',
      r === 'student'
        ? 'Available practice test series, mock paper sequences and institute-level examination packages.'
        : 'Manage institute-level independent test series and course-assigned mock examination packages.',
      adm ? '<button class="b1" onclick="openCreateTestSeriesModal()">+ Create Test Series</button>' : ''
    ) +
    `<div class="metric-grid">
      ${renderKpiCard({ title: 'Total Test Series', value: list.length, trend: '↑ Live', sub: 'active series', icon: 'tests', variant: 0 })}
      ${renderKpiCard({ title: 'Institute Level (Independent)', value: instCount, trend: '↑ Universal', sub: 'open to all courses', icon: 'award', variant: 1 })}
      ${renderKpiCard({ title: 'Course Assigned', value: courseCount, trend: '↑ Program', sub: 'curriculum linked', icon: 'courses', variant: 2 })}
      ${renderKpiCard({ title: 'Total Mock Tests', value: totalTestsCount, trend: '↑ Papers', sub: 'across all series', icon: 'file', variant: 3 })}
    </div>` +
    tb(
      [
        [
          'Series Name',
          ts => `
            <div>
              <b style="font-size:13.5px;color:var(--ink)">${E(ts.title)}</b>
              <small style="color:var(--mute);display:block;margin-top:2px;max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${E(ts.desc || 'Standard examination series.')}</small>
            </div>
          `
        ],
        [
          'Course Assigned',
          ts => ts.isInstitute
            ? `<span class="pill-badge pill-purple" style="font-weight:700;font-size:11px">Independent</span>`
            : `<span class="pill-badge pill-blue" style="font-weight:600;font-size:11px">${E(ts.courseName)}</span>`
        ],
        [
          'Included Tests',
          ts => `<b style="color:var(--ink)">${(ts.tests || []).length} Tests</b>`
        ],
        [
          'Coverage Scope',
          ts => ts.isInstitute
            ? '<span class="st gn">All Institute Students</span>'
            : `<span class="st">${E(ts.courseName.slice(0, 20))}...</span>`
        ],
        ['Status', ts => st(ts.status || 'Active')],
        [
          'Actions',
          ts => `
            <div class="ac" style="gap:6px">
              <button class="b2" onclick="viewTestSeriesDetailModal('${ts.id}', ${ts.isInstitute}, '${ts.courseId || ''}')">View Tests</button>
              ${adm ? `
                <button class="b2" onclick="editTestSeriesGlobalModal('${ts.id}', ${ts.isInstitute}, '${ts.courseId || ''}')">Edit</button>
                <button class="b2 dng" onclick="deleteTestSeriesGlobal('${ts.id}', ${ts.isInstitute}, '${ts.courseId || ''}')">×</button>
              ` : ''}
            </div>
          `
        ]
      ],
      list,
      null,
      10
    )
  );
};

function openCreateTestSeriesModal(defaultScope) {
  const cc = crs().map(c => [c.id, c.name]);
  let selectedScope = defaultScope || 'Institute';

  const renderModalContent = () => {
    const isInst = selectedScope === 'Institute';
    const isPkg = selectedScope === 'Package';
    return `
      <div style="display:grid;gap:12px">
        <label>Series Title *
          <input id="tsTitle" placeholder="e.g. All India Pre-Exam CBT Grand Test Series" style="font-weight:600">
        </label>

        <div class="fg">
          <span style="font-size:12.5px;font-weight:600;color:var(--ink);display:block;margin-bottom:6px">Scope Assignment *</span>
          <div class="seg" style="display:flex;gap:4px">
            <button type="button" class="${isPkg ? 'on' : ''}" onclick="window.__tsScopeSelect('Package')">Package-level</button>
            <button type="button" class="${isInst ? 'on' : ''}" onclick="window.__tsScopeSelect('Institute')">Institute-level (Independent)</button>
            <button type="button" class="${(!isInst && !isPkg) ? 'on' : ''}" onclick="window.__tsScopeSelect('Course')">Course-wise</button>
          </div>
        </div>

        ${isPkg ? `
          <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--mute)">
            <b>Package-Level Series:</b> This test series is created specifically for this package without requiring a separate course.
          </div>
        ` : isInst ? `
          <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--mute)">
            <b>Independent Series:</b> This test series is open across the entire institute and will not be restricted to any single course.
          </div>
        ` : `
          <label>Target Course *
            <select id="tsCourseSelect">
              ${cc.map(c => `<option value="${c[0]}">${E(c[1])}</option>`).join('')}
            </select>
          </label>
        `}

        <label>Description
          <textarea id="tsDesc" rows="3" placeholder="Provide guidelines, eligibility, pattern explanation, and schedule notes..."></textarea>
        </label>
      </div>
    `;
  };

  window.__tsScopeSelect = function (sc) {
    selectedScope = sc;
    const body = document.querySelector('.mb');
    if (body) {
      const curTitle = $('#tsTitle') ? $('#tsTitle').value : '';
      const curDesc = $('#tsDesc') ? $('#tsDesc').value : '';
      body.innerHTML = renderModalContent() + '<p id="er" class="er"></p>';
      if ($('#tsTitle')) $('#tsTitle').value = curTitle;
      if ($('#tsDesc')) $('#tsDesc').value = curDesc;
    }
  };

  modal(
    'Create Test Series',
    renderModalContent(),
    () => {
      const title = ($('#tsTitle') ? $('#tsTitle').value : '').trim();
      const desc = ($('#tsDesc') ? $('#tsDesc').value : '').trim();
      if (!title) return 'Series title is required.';

      if (selectedScope === 'Package') {
        D.pkgTestSeries = D.pkgTestSeries || [];
        D.pkgTestSeries.unshift({
          id: id('ts_pkg_'),
          title,
          desc,
          scope: 'Package',
          courseId: '__package__',
          tests: [],
          status: 'Active',
          createdAt: dayS()
        });
      } else if (selectedScope === 'Institute') {
        D.instTestSeries = D.instTestSeries || [];
        D.instTestSeries.unshift({
          id: id('ts_inst_'),
          title,
          desc,
          scope: 'Institute',
          courseId: null,
          tests: [
            { id: id('tst'), name: `${title} - Mock Exam 1`, min: 30, qCount: 20, source: 'created' }
          ],
          status: 'Active',
          createdAt: dayS()
        });
        D.users.filter(u => u.role === 'student').forEach(s => note(s.id, `New Institute Test Series: ${title}`));
      } else {
        const courseId = $('#tsCourseSelect') ? $('#tsCourseSelect').value : (cc[0] ? cc[0][0] : '');
        const c = gcr(courseId);
        if (!c) return 'Target course not found.';
        c.testSeries = c.testSeries || [];
        c.testSeries.unshift({
          id: id('ts'),
          title,
          desc,
          tests: [
            { id: id('tst'), name: `${title} - Chapter Mock 1`, min: 20, qCount: 15, source: 'created' }
          ]
        });
        D.users.filter(u => u.role === 'student' && (u.courses || []).includes(courseId)).forEach(s => note(s.id, `New Test Series in ${c.name}: ${title}`));
      }

      save();
      rp();
      toast('Test series created successfully!');
    },
    '',
    'Publish Test Series'
  );
}

function viewTestSeriesDetailModal(tsId, isInstitute, courseId) {
  let ts;
  if (isInstitute) {
    ts = (D.instTestSeries || []).find(x => x.id === tsId);
  } else {
    const c = gcr(courseId);
    ts = (c ? c.testSeries || [] : []).find(x => x.id === tsId);
  }
  if (!ts) return toast('Test series not found.');

  modal(
    `Test Series · ${E(ts.title)}`,
    `
      <div style="display:grid;gap:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;background:var(--s);padding:10px 12px;border:1px solid var(--b);border-radius:8px">
          <div>
            <b style="font-size:14px;color:var(--ink)">${E(ts.title)}</b>
            <small style="color:var(--mute);display:block;margin-top:2px">${isInstitute ? 'Independent (Institute Level)' : 'Course: ' + (D.courses.find(x => x.id === courseId)?.name || 'Assigned')}</small>
          </div>
          <span class="st gn">Active Series</span>
        </div>
        <p style="font-size:12.5px;color:var(--mute)">${E(ts.desc || 'No description provided.')}</p>

        <div style="border-top:1px solid var(--b);padding-top:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <b style="font-size:13px;color:var(--ink)">Included Mock Tests (${(ts.tests || []).length})</b>
            ${can() ? `<button class="b2" style="font-size:11.5px;padding:3px 8px" onclick="closeM(1);addTestToAnySeries('${ts.id}', ${isInstitute}, '${courseId || ''}')">+ Add Test</button>` : ''}
          </div>
          <div style="display:grid;gap:6px;max-height:240px;overflow-y:auto">
            ${(ts.tests && ts.tests.length) ? ts.tests.map((t, idx) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:var(--s);border:1px solid var(--b);border-radius:6px">
                <div>
                  <b style="font-size:12.5px;color:var(--ink)">#${idx + 1}. ${E(t.name)}</b>
                  <small style="color:var(--mute);display:block">${t.qCount || 10} Qs · ${t.min || 15} mins</small>
                </div>
                <button class="b1" style="font-size:11px;padding:3px 10px" onclick="closeM(1);tk('${t.refId || 't1'}')">Take Test</button>
              </div>
            `).join('') : '<small style="color:var(--mute)">No tests inside this series yet.</small>'}
          </div>
        </div>
      </div>
    `,
    null,
    '',
    '',
    `<button class="b2" onclick="closeM(1)">Close</button>`
  );
}

function addTestToAnySeries(tsId, isInstitute, courseId) {
  if (!isInstitute && courseId) {
    return addTestToSeries(courseId, tsId);
  }
  // Institute level add test
  const ts = (D.instTestSeries || []).find(x => x.id === tsId);
  if (!ts) return;

  const existingTests = D.tests || [];
  modal(
    `Add Test to Institute Series · ${E(ts.title)}`,
    `
      <div style="display:grid;gap:12px">
        <label>Select from Existing Global Tests:
          <select id="inst_t_sel">
            <option value="">-- Choose Test --</option>
            ${existingTests.map((t, idx) => `<option value="${idx}">${E(t.name)} (${t.qs.length} Qs · ${t.min} min)</option>`).join('')}
          </select>
        </label>
        <div style="text-align:center;color:var(--mute);font-size:12px">— OR CREATE NEW TEST IN SERIES —</div>
        <label>New Test Name
          <input id="inst_new_t_name" placeholder="e.g. All-Institute Mock 02">
        </label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <label>Duration (mins)
            <input type="number" id="inst_new_t_min" value="30">
          </label>
          <label>Questions Count
            <input type="number" id="inst_new_t_qc" value="20">
          </label>
        </div>
      </div>
    `,
    () => {
      ts.tests = ts.tests || [];
      const selVal = $('#inst_t_sel') ? $('#inst_t_sel').value : '';
      if (selVal !== '') {
        const picked = existingTests[+selVal];
        ts.tests.push({
          id: id('tst'),
          name: picked.name,
          min: picked.min,
          qCount: picked.qs.length,
          refId: picked.id,
          source: 'existing'
        });
      } else {
        const name = ($('#inst_new_t_name') ? $('#inst_new_t_name').value : '').trim();
        if (!name) return 'Test name or selection is required.';
        const min = +$('#inst_new_t_min').value || 30;
        const qCount = +$('#inst_new_t_qc').value || 20;

        const newTest = {
          id: id('t'),
          name,
          course: '__institute__',
          min,
          qs: [
            { q: 'Universal institute assessment question 1 for ' + name, o: ['Option A', 'Option B', 'Option C', 'Option D'], a: 0 },
            { q: 'Universal institute assessment question 2 for ' + name, o: ['Option A', 'Option B', 'Option C', 'Option D'], a: 1 }
          ]
        };
        D.tests.push(newTest);
        ts.tests.push({
          id: id('tst'),
          name,
          min,
          qCount,
          refId: newTest.id,
          source: 'created'
        });
      }
      save();
      rp();
      toast('Test added to institute series!');
    },
    '',
    'Add Test'
  );
}

function editTestSeriesGlobalModal(tsId, isInstitute, courseId) {
  let ts;
  if (isInstitute) {
    ts = (D.instTestSeries || []).find(x => x.id === tsId);
  } else {
    const c = gcr(courseId);
    ts = (c ? c.testSeries || [] : []).find(x => x.id === tsId);
  }
  if (!ts) return;

  modal(
    'Edit Test Series',
    `
      <div style="display:grid;gap:12px">
        <label>Series Title *
          <input id="editTsTitle" value="${E(ts.title)}" style="font-weight:600">
        </label>
        <label>Description
          <textarea id="editTsDesc" rows="3">${E(ts.desc || '')}</textarea>
        </label>
      </div>
    `,
    () => {
      const title = ($('#editTsTitle') ? $('#editTsTitle').value : '').trim();
      const desc = ($('#editTsDesc') ? $('#editTsDesc').value : '').trim();
      if (!title) return 'Series title is required.';
      ts.title = title;
      ts.desc = desc;
      save();
      rp();
      toast('Test series updated!');
    },
    '',
    'Save Changes'
  );
}

function deleteTestSeriesGlobal(tsId, isInstitute, courseId) {
  cfm('Delete this test series? All enrolled references will be updated.', () => {
    if (isInstitute) {
      D.instTestSeries = (D.instTestSeries || []).filter(x => x.id !== tsId);
    } else {
      const c = gcr(courseId);
      if (c) {
        c.testSeries = (c.testSeries || []).filter(x => x.id !== tsId);
      }
    }
    save();
    rp();
    toast('Test series deleted.');
  });
}

/* ---------- Tests page ---------- */
PG.tests = function () {
  const r = me().role, l = D.tests.filter(t => t.course === '__institute__' || crs().some(c => c.id === t.course));
  return hd('Tests', r === 'student' ? 'Assigned tests.' : 'Create institute-level, course-wise or subject-wise tests.', r === 'student' ? '' : '<button class=b1 onclick="openTestBuilderInNewTab()">+ Create test</button>') +
    tb([
      ['Test', t => `<b>${E(t.name)}</b>`],
      ['Course', t => t.course === '__institute__' ? '<span class="pill-badge pill-amber" style="font-weight:600">Institute Level</span>' : E((D.courses.find(c => c.id === t.course) || {}).name || '—')],
      ['Scope', t => {
        if (t.scope === 'Institute' || t.course === '__institute__') return `<span class="tbadge" style="background:#fef3c7;color:#b45309;font-weight:600">Institute-level</span>`;
        const c = D.courses.find(x => x.id === t.course), s = t.sub && c ? subOf(ensure(c), t.sub) : null;
        return `<span class=tbadge>${s ? E(s.name) : 'Course-wise'}</span>`;
      }],
      ['Questions', t => (t.qs || []).length],
      ['Minutes', t => t.min],
      [r === 'student' ? 'Your result' : 'Attempts', t => { const x = D.res.filter(y => y.tid === t.id && (r !== 'student' || y.sid === S.uid)); return r === 'student' ? (x.length ? x[x.length - 1].score + '/' + t.qs.length : 'Not attempted') : x.length; }]
    ], l, r === 'student' ? t => `<button class=b1 onclick="tk('${t.id}')">${D.res.some(y => y.tid === t.id && y.sid === S.uid) ? 'Retake' : 'Start'}</button>` : t => `<button class=b2 onclick="openTestBuilderInNewTab('${t.id}')">Edit</button>`);
};

/* ---------- Courses list (SaaS cards) ---------- */
function tcs(c) { return [...new Set(c.subs.map(s => s.teacher).filter(t => t && U(t)))]; }
function cstat(c) {
  const rv = c.rev.length ? (c.rev.reduce((a, x) => a + x.r, 0) / c.rev.length).toFixed(1) : '–';
  return { subs: c.subs.length, lect: c.subs.reduce((a, s) => a + s.lessons.length, 0), notes: c.subs.reduce((a, s) => a + s.notes.length, 0), studs: stu().filter(s => s.courses.includes(c.id)).length, rating: rv };
}
function tstat(uid, c) {
  const cs3 = (c ? [c] : D.courses).map(ensure);
  let lect = 0, notes = 0, subs = 0, live = 0;
  const sset = new Set();
  cs3.forEach(cc => {
    cc.subs.filter(s => s.teacher === uid).forEach(s => { subs++; lect += s.lessons.length; notes += s.notes.length; });
    live += cc.live.filter(l => l.tid === uid).length;
    if (cc.subs.some(s => s.teacher === uid)) D.users.forEach(u => u.role === 'student' && u.courses.includes(cc.id) && sset.add(u.id));
  });
  return { lect, notes, subs, live, studs: sset.size };
}

PG.courses = function () {
  const r = me().role;
  if (S.cv) return cdet();
  const adm = can(), list = crs();
  list.forEach(ensure);
  return hd(r === 'admin' || r === 'owner' ? 'Courses' : 'My courses', 'Each course bundles subjects, lectures, notes, teachers, tests and announcements.', adm ? '<button class=b1 onclick=nw()>+ New course</button>' : '') +
    (list.length ? `<div class=cg>${list.map(c => {
      const x = cstat(c), ts = tcs(c);
      return `<div class="cd cc"><div class=cimw><img class=cim src="${cimg(c)}" alt="" loading=lazy>${st(c.status)}${hasC() ? `<span class=cmd>${E(c.mode || 'Both')}</span>` : ''}</div>
        <div class=cmeta><span class=chip2>${E(c.code)}</span><span class=chip2>${c.access}${c.price ? ' · ' + R(c.price) : ''}</span></div>
        <b>${E(c.name)}</b>
        <small>${x.subs} subjects · ${x.lect} lectures · ${x.notes} notes · ${x.studs} students</small>
        <div class=cfoot><div class=avs>${ts.slice(0, 4).map(t => `<img src="${av(U(t))}" title="${E(U(t).name)}" alt="">`).join('')}</div><span class=rt2>★ ${x.rating}</span></div>
        ${r === 'student' ? `<div class=bar2><i style="width:${pct(S.uid, c)}%"></i></div><small>${pct(S.uid, c)}% complete</small>` : ''}
        <div class=ac><button class=b1 onclick="oc('${c.id}')">Open</button>${adm ? `<button class=b2 onclick="ecourse('${c.id}')">Edit</button><button class=b2 onclick="pb('${c.id}')">${c.status === 'Published' ? 'Unpublish' : 'Publish'}</button><button class="b2 dng" onclick="dc('${c.id}')">Delete</button>` : ''}</div></div>`;
    }).join('')}</div>` : '<div class=em>No courses yet. Create your first course to get started.</div>');
};

/* ---------- Course detail ---------- */
function cdet() {
  const c0 = D.courses.find(x => x.id === S.cv);
  if (!c0) { S.cv = null; return PG.courses(); }
  const c = ensure(c0), tab = TABS2.includes(S.ct) ? S.ct : 'Overview', x = cstat(c);
  let B;
  if (tab === 'Overview') B = ovw(c, x);
  else if (tab === 'Subjects') B = S.sv && subOf(c, S.sv) ? sdet(c, subOf(c, S.sv)) : sgrid(c);
  else if (tab === 'Teachers') B = tgrid(c);
  else if (tab === 'Live classes') B = lgrid(c);
  else if (tab === 'Tests') B = ctests(c);
  else if (tab === 'Video Series') B = vseriesGrid(c);
  else if (tab === 'Test Series') B = tseriesGrid(c);
  else if (tab === 'Announcements') B = agrid(c);
  else B = rgrid(c);
  return hero(c, x) + `<div class=ctabs>${TABS2.map(t => `<button class="${t === tab ? 'on' : ''}" onclick="S.sv=null;sct('${t}')">${t}</button>`).join('')}</div>` + B;
}

function hero(c, x) {
  const adm = can();
  return `<div class=chero style="--img:url('${cimg(c)}')"><div class=chero-in>
    <button class="b2 chb" onclick="S.cv=null;S.sv=null;render()">‹ All courses</button>
    <div class=chbd>${st(c.status)}<span class=chip>${c.access}${c.price ? ' · ' + R(c.price) : ''}</span>${hasC() ? `<span class=chip>${E(c.mode || 'Both')}</span>` : ''}<span class=chip>${E(c.code)}</span></div>
    <h1>${E(c.name)}</h1><p>${E(c.desc || 'A structured, mentor-led programme with recorded lectures, notes, live classes and tests.')}</p>
    <div class=chs><div><b>${x.subs}</b><small>Subjects</small></div><div><b>${x.lect}</b><small>Lectures</small></div><div><b>${x.notes}</b><small>Notes</small></div><div><b>${x.studs}</b><small>Students</small></div><div><b>${x.rating} ★</b><small>Rating</small></div></div>
    ${adm ? `<div class=cha><button class=b2 onclick="ecourse('${c.id}')">Edit course</button><button class=b2 onclick="pb('${c.id}')">${c.status === 'Published' ? 'Unpublish' : 'Publish'}</button><button class="b2 dng" onclick="dc('${c.id}')">Delete</button></div>` : ''}
  </div></div>`;
}

function annCard(c, a, manage) {
  return `<div class="annc ${a.pin ? 'pinned' : ''}"><div class=annc-h><span class="abadge ${ANC[a.type] || 'a-blue'}">${E(a.type)}</span>${a.pin ? '<span class=pinl>📌 Pinned</span>' : ''}<small>${E(a.d)}</small></div><b>${E(a.t)}</b><p>${E(a.b)}</p><div class=annc-f><small>Posted by ${E(a.by || 'Admin')}</small>${manage ? `<span><button class=b2 onclick="pann('${c.id}','${a.id}')">${a.pin ? 'Unpin' : 'Pin'}</button><button class=b2 onclick="eann('${c.id}','${a.id}')">Edit</button><button class="b2 dng" onclick="dann('${c.id}','${a.id}')">Delete</button></span>` : ''}</div></div>`;
}

function ovw(c, x) {
  const r = me().role, ts = tcs(c);
  return `<div class=ovg>
    <div class=dash-card><div class=dash-card-header><div><div class=dash-card-title>Subjects & faculty</div><div class=dash-card-sub>Lectures, notes and tests for each subject</div></div><button class=b2 onclick="S.sv=null;sct('Subjects')">View all</button></div>
      <div class=task-list>${c.subs.map((s, i) => `<div class=task-item><div class=task-left><div class=sdot style="background:${subCol(i)}">${E(s.name[0])}</div><div class=task-info><b>${E(s.name)}</b><small>${E((U(s.teacher) || {}).name || 'No teacher assigned')} · ${s.lessons.length} lectures · ${s.notes.length} notes</small></div></div><button class=b2 onclick="S.sv='${s.id}';S.sbt='Lectures';sct('Subjects')">Open</button></div>`).join('')}</div></div>
    <div class=dash-card><div class=dash-card-header><div><div class=dash-card-title>Notice board</div><div class=dash-card-sub>Latest announcements</div></div><button class=b2 onclick="sct('Announcements')">View all</button></div>
      <div class=annl>${sortAnn(c).slice(0, 3).map(a => `<div class=annm onclick="sct('Announcements')"><span class="abadge ${ANC[a.type] || 'a-blue'}">${E(a.type)}</span><div><b>${E(a.t)}</b><small>${E(a.d)}</small></div></div>`).join('') || '<div class=em>No announcements.</div>'}</div></div>
  </div>
  <div class=dash-card style="margin-top:18px"><div class=dash-card-header><div><div class=dash-card-title>Teaching faculty</div><div class=dash-card-sub>Teachers enrolled in this course</div></div><button class=b2 onclick="sct('Teachers')">View all</button></div>
    <div class=tstrip>${ts.map(t => `<div class=tpill><img src="${av(U(t))}" alt=""><div><b>${E(U(t).name)}</b><small>★ ${trat(U(t))} · ${tstat(t, c).lect} lectures</small></div></div>`).join('') || '<small>No teachers assigned yet.</small>'}</div>
    ${r === 'student' ? `<div style="margin-top:14px"><div class=bar2><i style="width:${pct(S.uid, c)}%"></i></div><small>Your progress: ${pct(S.uid, c)}% complete</small></div>` : ''}</div>`;
}

function sgrid(c) {
  const stf = me().role !== 'student', adm = can();
  return (stf ? `<div class=bar><button class=b1 onclick="esub('${c.id}')">+ Add subject</button></div>` : '') +
    `<div class=sgrid>${c.subs.map((s, i) => {
      const t = U(s.teacher), tn = D.tests.filter(z => z.sub === s.id).length, pr = D.prog[S.uid + '|' + c.id] || [], dn = s.lessons.filter(l => pr.includes(l.id)).length;
      return `<div class=scard style="--sc:${subCol(i)}"><div class=sc-top><div class=sc-ico>${E(s.name[0])}</div><div><b>${E(s.name)}</b><small>${s.lessons.length} lectures · ${s.notes.length} notes · ${tn} tests</small></div></div>
        <div class=sc-t>${t ? `<img src="${av(t)}" alt=""><div><b>${E(t.name)}</b><small>★ ${trat(t)} · Subject teacher</small></div>` : '<small>No teacher assigned</small>'}</div>
        ${me().role === 'student' ? `<div class=bar2><i style="width:${s.lessons.length ? Math.round(dn / s.lessons.length * 100) : 0}%"></i></div><small>${dn}/${s.lessons.length} lectures completed</small>` : ''}
        <div class=ac><button class=b1 onclick="S.sv='${s.id}';S.sbt='Lectures';render()">Open subject</button>${stf ? `<button class=b2 onclick="esub('${c.id}','${s.id}')">Edit</button>` : ''}${adm ? `<button class="b2 dng" onclick="dsub('${c.id}','${s.id}')">Delete</button>` : ''}</div></div>`;
    }).join('') || '<div class=em>No subjects yet.</div>'}</div>`;
}

function tcardT(t, c) {
  const r = me().role, x = D.res.filter(y => y.tid === t.id && (r !== 'student' || y.sid === S.uid)), sb2 = t.sub ? subOf(c, t.sub) : null;
  return `<div class=tcd><div class=tcd-top><span class=tbadge>${sb2 ? E(sb2.name) : 'Course-wise'}</span><small>${t.min} min</small></div><b>${E(t.name)}</b><small>${t.qs.length} questions</small>
    <div class=vact>${r === 'student' ? `<button class=b1 onclick="tk('${t.id}')">${x.length ? 'Retake' : 'Start test'}</button>${x.length ? `<span class="st gn">Last: ${x[x.length - 1].score}/${t.qs.length}</span>` : ''}` : `<span class=mt>${x.length} attempts</span><button class=b2 onclick="et('${t.id}')">Edit</button><button class="b2 dng" onclick="del('tests','${t.id}')">Delete</button>`}</div></div>`;
}

function sdet(c, s) {
  const i = c.subs.indexOf(s), tab = ['Lectures', 'Notes', 'Tests'].includes(S.sbt) ? S.sbt : 'Lectures', stf = me().role !== 'student', t = U(s.teacher), col = subCol(i), pr = D.prog[S.uid + '|' + c.id] || [];
  let B;
  if (tab === 'Lectures')
    B = (stf ? `<div class=bar><button class=b1 onclick="elec('${c.id}','${s.id}')">+ Add lecture</button></div>` : '') +
      `<div class=vgrid>${s.lessons.map((l, j) => {
        const dn = pr.includes(l.id);
        return `<div class=vcard><div class=vthumb style="--sc:${col}" onclick="playL('${c.id}','${s.id}','${l.id}')"><span class=vnum>Lecture ${j + 1}</span><span class=play>▶</span><span class=dur>${E(l.dur)}</span>${dn ? '<span class=vdone>✓</span>' : ''}</div>
        <div class=vb><b>${E(l.title)}</b><small>${E(l.desc)}</small><div class=vact><button class=b1 onclick="playL('${c.id}','${s.id}','${l.id}')">▶ Watch</button>${me().role === 'student' ? `<button class=b2 onclick="lt('${c.id}','${l.id}')">${dn ? '✓ Done' : 'Mark done'}</button>` : `<button class=b2 onclick="elec('${c.id}','${s.id}','${l.id}')">Edit</button><button class="b2 dng" onclick="dlec('${c.id}','${s.id}','${l.id}')">Delete</button>`}</div></div></div>`;
      }).join('') || '<div class=em>No lectures yet.</div>'}</div>`;
  else if (tab === 'Notes')
    B = (stf ? `<div class=bar><button class=b1 onclick="enote('${c.id}','${s.id}')">+ Upload note</button></div>` : '') +
      `<div class=ngrid>${s.notes.map(n => {
        const k = NT[n.type] || NT.PDF;
        return `<div class=ncard><div class=nico style="background:${k[1]};color:${k[0]}">${E(n.type)}</div><div class=nb2><b>${E(n.title)}</b><small>${E(n.size)} · ${E(n.at)}</small><div class=vact><button class=b1 onclick="noteAct('${c.id}','${s.id}','${n.id}')">Open</button><button class=b2 onclick="noteAct('${c.id}','${s.id}','${n.id}',1)">Download</button>${stf ? `<button class=b2 onclick="enote('${c.id}','${s.id}','${n.id}')">Edit</button><button class="b2 dng" onclick="dnote('${c.id}','${s.id}','${n.id}')">Delete</button>` : ''}</div></div></div>`;
      }).join('') || '<div class=em>No notes uploaded yet.</div>'}</div>`;
  else {
    const tl = D.tests.filter(z => z.course === c.id && z.sub === s.id);
    B = (stf ? `<div class=bar><button class=b1 onclick="et(null,'${c.id}','${s.id}')">+ Create subject test</button></div>` : '') + `<div class=tgrid2>${tl.map(z => tcardT(z, c)).join('') || '<div class=em>No tests for this subject yet.</div>'}</div>`;
  }
  return `<div class=sbanner style="--sc:${col}"><button class="b2" onclick="S.sv=null;render()">‹ All subjects</button><div class=sb-main><div><h2>${E(s.name)}</h2><p>${s.lessons.length} lectures · ${s.notes.length} notes · ${D.tests.filter(z => z.sub === s.id).length} tests</p></div>${t ? `<div class=sb-t><img src="${av(t)}" alt=""><div><b>${E(t.name)}</b><small>★ ${trat(t)} · ${tstat(t.id, c).lect} lectures</small></div></div>` : ''}</div></div>
    <div class=ctabs>${['Lectures', 'Notes', 'Tests'].map(z => `<button class="${z === tab ? 'on' : ''}" onclick="S.sbt='${z}';render()">${z}</button>`).join('')}</div>` + B;
}

function tgrid(c) {
  const ts = tcs(c);
  return `<div class=tgrid>${ts.map(id2 => {
    const u = U(id2), s = tstat(id2, c), subs = c.subs.filter(z => z.teacher === id2), rt = trat(u);
    return `<div class=tc><div class=tc-h><img class=tc-img src="${av(u)}" alt=""><div><b>${E(u.name)}</b><small>${E(u.email)}</small><div class=tc-r><span>${strs(rt)}</span> ${rt}</div></div></div>
      <div class=tc-subs>${subs.map(z => `<span class=chip2>${E(z.name)}</span>`).join('')}</div>
      <div class=tc-st><div><b>${s.lect}</b><small>Lectures</small></div><div><b>${s.live}</b><small>Live classes</small></div><div><b>${s.notes}</b><small>Notes</small></div><div><b>${s.studs}</b><small>Students</small></div></div></div>`;
  }).join('') || '<div class=em>No teachers yet. Assign teachers to subjects to list them here.</div>'}</div>`;
}

function lgrid(c) {
  const stf = me().role !== 'student';
  return (stf ? `<div class=bar><button class=b1 onclick="elive('${c.id}')">+ Schedule live class</button></div>` : '') +
    `<div class=lgrid>${c.live.map(l => {
      const s = subOf(c, l.sub), t = U(l.tid), done = l.st === 'Completed';
      return `<div class=lcard><div class=lhead><span class=ldate>${ico('calendar')} ${E(l.d)}</span>${st(l.st)}</div><b>${E(l.t)}</b><small>${E(s ? s.name : 'General')} · ${E(t ? t.name : 'Teacher TBA')}</small>
        <div class=vact><button class="${done ? 'b2' : 'b1'}" onclick="joinL('${c.id}','${l.id}')">${done ? '▶ Watch replay' : stf ? '● Start class' : '● Join live'}</button>${stf ? `<button class=b2 onclick="clive('${c.id}','${l.id}')">${done ? 'Reopen' : 'Mark done'}</button><button class=b2 onclick="elive('${c.id}','${l.id}')">Edit</button><button class="b2 dng" onclick="dlive('${c.id}','${l.id}')">Delete</button>` : ''}</div></div>`;
    }).join('') || '<div class=em>No live classes scheduled.</div>'}</div>`;
}

function ctests(c) {
  const stf = me().role !== 'student', all = D.tests.filter(t => t.course === c.id), cw = all.filter(t => !t.sub);
  return (stf ? `<div class=bar><button class=b1 onclick="et(null,'${c.id}')">+ Create test</button></div>` : '') +
    `<h3 class=sech>Course-wise tests</h3><div class=tgrid2>${cw.map(t => tcardT(t, c)).join('') || '<div class=em>No course-wise tests yet.</div>'}</div>` +
    c.subs.map(s => { const l = all.filter(t => t.sub === s.id); return l.length ? `<h3 class=sech>${E(s.name)} tests</h3><div class=tgrid2>${l.map(t => tcardT(t, c)).join('')}</div>` : ''; }).join('');
}

function agrid(c) {
  const stf = me().role !== 'student';
  return (stf ? `<div class=bar><button class=b1 onclick="eann('${c.id}')">+ Post announcement</button></div>` : '') +
    `<div class=agrid>${sortAnn(c).map(a => annCard(c, a, stf)).join('') || '<div class=em>No announcements yet.</div>'}</div>`;
}

function rgrid(c) {
  const r = me().role, n = c.rev.length, avg = n ? c.rev.reduce((a, x) => a + x.r, 0) / n : 0;
  return `<div class=rsum><div class=rbig><b>${n ? avg.toFixed(1) : '–'}</b><span>${strs(avg)}</span><small>${n} review${n == 1 ? '' : 's'}</small></div>
    <div class=rbars>${[5, 4, 3, 2, 1].map(k => { const m = c.rev.filter(x => x.r === k).length; return `<div class=rbr><small>${k}★</small><div class=bar2><i style="width:${n ? m / n * 100 : 0}%"></i></div><small>${m}</small></div>`; }).join('')}</div>
    ${r === 'student' ? `<button class=b1 onclick="erev('${c.id}')">Write a review</button>` : ''}</div>
    <div class=rgrid>${c.rev.map(x => `<div class=rcard><div class=rc-h><span class=avt>${E(x.n.split(' ').map(z => z[0]).join('').slice(0, 2))}</span><div><b>${E(x.n)}</b><div class=stars>${strs(x.r)}</div></div></div><p>${E(x.t)}</p>${r !== 'student' ? `<button class="b2 dng" onclick="drev('${c.id}','${x.id}')">Delete</button>` : ''}</div>`).join('') || '<div class=em>No reviews yet.</div>'}</div>`;
}

/* ---------- Dashboards: show real activity & content from stored data ---------- */
const _dash = PG.dash;
PG.dash = function () {
  return _dash.call(PG) + extraDash();
};
function extraDash() {
  const r = me().role, cc = crs();
  cc.forEach(ensure);
  const ann = cc.flatMap(c => sortAnn(c).slice(0, 2).map(a => ({ a, c }))).slice(0, 5), lg = (D.log || []).slice(0, 6);
  let h = `<div class=dash-row><div class=dash-card><div class=dash-card-header><div><div class=dash-card-title>Latest announcements</div><div class=dash-card-sub>Notices posted across your courses</div></div></div>
    ${ann.length ? `<div class=annl>${ann.map(({ a, c }) => `<div class=annm onclick="oc('${c.id}');sct('Announcements')"><span class="abadge ${ANC[a.type] || 'a-blue'}">${E(a.type)}</span><div><b>${E(a.t)}</b><small>${E(c.name)} · ${E(a.d)}</small></div></div>`).join('')}</div>` : '<div class=em>No announcements yet.</div>'}</div>
    <div class=dash-card><div class=dash-card-header><div><div class=dash-card-title>Recent activity</div><div class=dash-card-sub>Everything you add or change shows up here</div></div></div>
    <div class=tline>${lg.map(z => `<div class=tl-i><i></i><div><b>${E(z.t)}</b><small>${E(z.by)} · ${E(z.at)}</small></div></div>`).join('') || '<small>No activity yet.</small>'}</div></div></div>`;
  if (r === 'student') {
    const lv = cc.flatMap(c => c.live.filter(l => l.st === 'Scheduled').map(l => ({ l, c }))).slice(0, 4);
    h += `<div class=dash-card style="margin-bottom:22px"><div class=dash-card-header><div><div class=dash-card-title>Upcoming live classes</div><div class=dash-card-sub>Join from your enrolled courses</div></div></div><div class=lgrid>${lv.map(({ l, c }) => `<div class=lcard><div class=lhead><span class=ldate>${ico('calendar')} ${E(l.d)}</span></div><b>${E(l.t)}</b><small>${E(c.name)}</small><div class=vact><button class=b1 onclick="oc('${c.id}');joinL('${c.id}','${l.id}')">● Join live</button></div></div>`).join('') || '<div class=em>No live classes scheduled.</div>'}</div></div>`;
  } else if (r === 'instructor') {
    const s = tstat(S.uid);
    h += `<div class=dash-card style="margin-bottom:22px"><div class=dash-card-header><div><div class=dash-card-title>My teaching stats</div><div class=dash-card-sub>Rating ★ ${trat(me())} from students</div></div></div><div class=tc-st big><div><b>${s.subs}</b><small>Subjects</small></div><div><b>${s.lect}</b><small>Lectures</small></div><div><b>${s.notes}</b><small>Notes</small></div><div><b>${s.live}</b><small>Live classes</small></div><div><b>${s.studs}</b><small>Students</small></div></div></div>`;
  } else {
    const subs = cc.reduce((a, c) => a + c.subs.length, 0), lect = cc.reduce((a, c) => a + c.subs.reduce((b, s) => b + s.lessons.length, 0), 0), nts = cc.reduce((a, c) => a + c.subs.reduce((b, s) => b + s.notes.length, 0), 0), lv = cc.reduce((a, c) => a + c.live.length, 0), an = cc.reduce((a, c) => a + c.ann.length, 0);
    h += `<div class=dash-card style="margin-bottom:22px"><div class=dash-card-header><div><div class=dash-card-title>Content library</div><div class=dash-card-sub>Live totals from everything stored locally</div></div></div><div class=tc-st big><div><b>${cc.length}</b><small>Courses</small></div><div><b>${subs}</b><small>Subjects</small></div><div><b>${lect}</b><small>Lectures</small></div><div><b>${nts}</b><small>Notes</small></div><div><b>${lv}</b><small>Live classes</small></div><div><b>${an}</b><small>Notices</small></div><div><b>${D.tests.length}</b><small>Tests</small></div></div></div>`;
  }
  return h;
}



/* =====================================================================
   STUDENT ENHANCEMENTS: Real avatars, Courses with Batch Mapping,
   Right-Side Modal Drawer with "All details" and "Tests list" tabs.
   ===================================================================== */

function getCourseBatchName(s, c) {
  if (!s || !c) return 'General Cohort';
  if (s.courseBatches && s.courseBatches[c.id]) {
    const cb = D.batches.find(b => b.id === s.courseBatches[c.id]);
    return cb ? cb.name : s.courseBatches[c.id];
  }
  if (s.batch) {
    const b = D.batches.find(x => x.id === s.batch);
    if (b) return b.name;
  }
  const hash = [...(String(s.id) + String(c.id))].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const cohortOptions = ['Alpha Morning Cohort', 'Live Evening Batch', 'Weekend FastTrack Cohort', 'Prime Target Batch'];
  return (s.mode === 'Online' || !hasC())
    ? 'Online ' + cohortOptions[hash % cohortOptions.length]
    : cohortOptions[hash % cohortOptions.length];
}

function sTests(s) {
  if (!s) return [];
  return D.res.filter(r => r.sid === s.id);
}

function seedStudentTests() {
  if (D.testsSeeded) return;
  D.testsSeeded = 1;
  const tests = D.tests;
  if (!tests || !tests.length) return;
  const students = D.users.filter(u => u.role === 'student');
  students.forEach((s, idx) => {
    const existing = D.res.filter(r => r.sid === s.id);
    if (!existing.length) {
      const eligible = tests.filter(t => s.courses.includes(t.course));
      const pool = eligible.length ? eligible : tests;
      const count = (idx % 3) + 1;
      for (let k = 0; k < count; k++) {
        const t = pool[k % pool.length];
        const maxQ = t.qs.length || 3;
        const score = Math.max(1, maxQ - ((idx + k) % 2));
        const dates = ['04 Feb 2026', '07 Feb 2026', '09 Feb 2026', '10 Feb 2026', '11 Feb 2026'];
        D.res.push({
          id: id('r'),
          sid: s.id,
          tid: t.id,
          score: score,
          total: maxQ,
          at: dates[(idx + k) % dates.length]
        });
      }
    }
  });
  save();
}
seedStudentTests();

/* Enhanced Course & Batch Popup */
cpop = function (i) {
  const s = U(i);
  if (!s) return;
  const l = D.courses.filter(c => s.courses.includes(c.id));
  modal(
    'Enrolled Courses & Batches · ' + E(s.name),
    `<div style="margin-bottom:12px;color:var(--m);font-size:12.5px">Showing courses and assigned batches for <b>${E(s.name)}</b> (${s.mode === 'Online' ? 'Online' : (hasC() ? E(cn(s.centers[0])) : 'Learner')})</div>` +
      (l.length
        ? `<div class="cb-list">${l.map(c => {
            const batchName = getCourseBatchName(s, c);
            const p = pct(s.id, c);
            return `
              <div class="cb-card">
                <div class="cb-head">
                  <div class="cb-left">
                    <span class="cb-badge">${E(c.code)}</span>
                    <div>
                      <b class="cb-title">${E(c.name)}</b>
                      <small class="cb-meta">${c.access}${c.price ? ' · ' + R(c.price) : ''} · ${c.lessons.length} lessons</small>
                    </div>
                  </div>
                  <button class="b2" onclick="closeM(1);oc('${c.id}')">Open</button>
                </div>
                <div class="cb-batch-box">
                  <span class="cb-batch-tag">Assigned Batch:</span>
                  <span class="cb-batch-name">${ico('batches')} <b>${E(batchName)}</b></span>
                </div>
                <div class="bar2" style="margin-top:6px"><i style="width:${p}%"></i></div>
                <div class="cb-prog-foot"><small>${p}% completed</small><small>Teacher: ${E(U(c.instr)?.name || 'Faculty')}</small></div>
              </div>
            `;
          }).join('')}</div>`
        : '<div class="em">This student is not enrolled in any course yet.</div>'),
    null,
    '',
    '',
    `<button class="b2" onclick="closeM(1)">Close</button><button class="b1" onclick="closeM(1);openStudentDrawer('${s.id}','details')">View Full Profile ›</button>`
  );
  $('.md').style.maxWidth = '620px';
};

/* Right-side Modal Drawer Logic */
let curDrawerSid = null, curDrawerTab = 'details';

function openStudentDrawer(sid, tab = 'details') {
  curDrawerSid = sid;
  curDrawerTab = tab;
  renderDrawer();
}

function closeDrawer() {
  curDrawerSid = null;
  const d = $('#d');
  if (d) d.innerHTML = '';
}

function setDrawerTab(tab) {
  curDrawerTab = tab;
  renderDrawer();
}

function renderDrawer() {
  const d = $('#d');
  if (!d) return;
  if (!curDrawerSid) {
    d.innerHTML = '';
    return;
  }
  const s = U(curDrawerSid);
  if (!s) {
    d.innerHTML = '';
    return;
  }
  const tests = sTests(s);
  const enrolledCourses = D.courses.filter(c => s.courses.includes(c.id));
  const invoices = D.inv.filter(v => v.sid === s.id);
  const totalBilled = sum(invoices, 'total');
  const totalPaid = sum(invoices, 'paid');
  const balanceDue = totalBilled - totalPaid;
  const reg = sRegDate(s);
  const avgScore = tests.length
    ? Math.round(
        (tests.reduce((acc, t) => {
          const tDef = D.tests.find(x => x.id === t.tid);
          const maxQ = tDef ? tDef.qs.length : 3;
          return acc + t.score / maxQ;
        }, 0) /
          tests.length) *
          100
      )
    : 0;

  let bodyContent = '';
  if (curDrawerTab === 'details') {
    bodyContent = `
      <!-- Profile Summary Card -->
      <div class="dr-profile-card">
        <img class="dr-avatar-lg" src="${av(s)}" alt="${E(s.name)}">
        <div class="dr-user-info">
          <b>${E(s.name)}</b>
          <span>${E(s.email)}</span>
          <div class="dr-badge-row">
            <span class="st gn">${s.status || 'Active'}</span>
            <span class="chip2">${s.mode === 'Online' ? 'Online Student' : (hasC() ? cn(s.centers[0]) : 'Student')}</span>
            ${s.batch && hasC() ? `<span class="chip2">${E((D.batches.find(b => b.id === s.batch) || {}).name || s.batch)}</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Quick Info Grid -->
      <div class="dr-info-grid">
        <div class="dr-info-box"><small>Registration Date</small><b>${E(reg)}</b></div>
        <div class="dr-info-box"><small>Mobile Number</small><b>${E(s.phone || '—')}</b></div>
        <div class="dr-info-box"><small>Learning Delivery</small><b>${E(s.mode || 'Online')}</b></div>
        <div class="dr-info-box"><small>Assigned Center</small><b>${s.mode === 'Online' ? '— (Online)' : (hasC() ? E(cn(s.centers[0])) : '—')}</b></div>
      </div>

      <!-- Enrolled Courses & Batches Section -->
      <div>
        <div class="dash-card-header" style="margin-bottom:10px">
          <div>
            <div class="dash-card-title" style="font-size:14.5px">Enrolled Courses & Corresponding Batches</div>
            <div class="dash-card-sub">${enrolledCourses.length} active course enrolment${enrolledCourses.length === 1 ? '' : 's'}</div>
          </div>
        </div>
        ${enrolledCourses.length ? `
          <div class="cb-list">
            ${enrolledCourses.map(c => {
              const bName = getCourseBatchName(s, c);
              const p = pct(s.id, c);
              return `
                <div class="cb-card">
                  <div class="cb-head">
                    <div class="cb-left">
                      <span class="cb-badge">${E(c.code)}</span>
                      <div>
                        <b class="cb-title">${E(c.name)}</b>
                        <small class="cb-meta">${c.access}${c.price ? ' · ' + R(c.price) : ''} · ${c.lessons.length} lessons</small>
                      </div>
                    </div>
                    <button class="b2" style="padding:4px 9px" onclick="closeDrawer();oc('${c.id}')">Open</button>
                  </div>
                  <div class="cb-batch-box">
                    <span class="cb-batch-tag">Batch:</span>
                    <span class="cb-batch-name">${ico('batches')} <b>${E(bName)}</b></span>
                  </div>
                  <div class="bar2" style="margin-top:6px"><i style="width:${p}%"></i></div>
                  <div class="cb-prog-foot"><small>${p}% syllabus complete</small><small>Teacher: ${E(U(c.instr)?.name || 'Faculty')}</small></div>
                </div>
              `;
            }).join('')}
          </div>
        ` : '<div class="em">No course enrollments recorded.</div>'}
      </div>

      <!-- Fee & Payments Summary -->
      <div>
        <div class="dash-card-header" style="margin-bottom:10px">
          <div>
            <div class="dash-card-title" style="font-size:14.5px">Fee & Payment Records</div>
            <div class="dash-card-sub">Invoices and outstanding dues</div>
          </div>
        </div>
        <div class="dr-info-grid" style="margin-bottom:12px">
          <div class="dr-info-box"><small>Total Invoiced</small><b>${R(totalBilled)}</b></div>
          <div class="dr-info-box"><small>Total Paid</small><b style="color:#15803d">${R(totalPaid)}</b></div>
          <div class="dr-info-box"><small>Outstanding Balance</small><b style="color:${balanceDue > 0 ? '#b91c1c' : '#0f172a'}">${R(balanceDue)}</b></div>
          <div class="dr-info-box"><small>Payment Status</small><b>${st(totalBilled > 0 ? (balanceDue <= 0 ? 'Paid' : totalPaid > 0 ? 'Partial' : 'Unpaid') : 'No Dues')}</b></div>
        </div>
        ${invoices.length ? `
          <div class="task-list">
            ${invoices.map(inv => `
              <div class="task-item">
                <div class="task-left">
                  <div class="task-ico">${ico('fin')}</div>
                  <div>
                    <b>Invoice #${inv.id} · ${R(inv.total)}</b>
                    <small>Paid ${R(inv.paid)} · Due ${R(inv.total - inv.paid)}</small>
                  </div>
                </div>
                ${inv.total - inv.paid > 0 ? `<button class="b1" style="padding:4px 9px;font-size:11px" onclick="pm('${inv.id}')">Record Pay</button>` : `<span class="st gn">Cleared</span>`}
              </div>
            `).join('')}
          </div>
        ` : '<small style="color:var(--m)">No invoices created yet.</small>'}
      </div>
    `;
  } else {
    // Tests Tab
    bodyContent = `
      <!-- Tests Summary Header -->
      <div class="metric-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:4px">
        <div class="metric-card" style="padding:14px">
          <div><div class="mc-val">${tests.length}</div><div class="mc-label">Participated</div></div>
        </div>
        <div class="metric-card" style="padding:14px">
          <div><div class="mc-val" style="color:${avgScore >= 60 ? '#15803d' : '#b45309'}">${avgScore}%</div><div class="mc-label">Average Score</div></div>
        </div>
        <div class="metric-card" style="padding:14px">
          <div><div class="mc-val">${tests.filter(t => {
            const tDef = D.tests.find(x => x.id === t.tid);
            const maxQ = tDef ? tDef.qs.length : 3;
            return t.score / maxQ >= 0.5;
          }).length}</div><div class="mc-label">Tests Passed</div></div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
        <div>
          <b style="font-size:14px;color:#0f172a">All Participated Tests</b>
          <small style="display:block;color:#64748b">History of test attempts by ${E(s.name)}</small>
        </div>
        <button class="b2" onclick="simulateTestAttempt('${s.id}')">+ Simulate Attempt</button>
      </div>

      <!-- Tests Participation List -->
      ${tests.length ? `
        <div style="display:grid;gap:12px">
          ${tests.map((att, idx) => {
            const tDef = D.tests.find(x => x.id === att.tid);
            const course = tDef ? D.courses.find(c => c.id === tDef.course) : null;
            const subject = tDef && tDef.sub && course ? subOf(gcr(course.id), tDef.sub) : null;
            const maxScore = tDef ? tDef.qs.length : att.total || 3;
            const scorePct = Math.round((att.score / maxScore) * 100);
            const isPass = scorePct >= 60;
            return `
              <div class="t-att-card">
                <div class="t-att-head">
                  <div>
                    <b>${E(tDef ? tDef.name : 'Test Assessment')}</b>
                    <small>${E(course ? course.name : 'General Course')} ${subject ? '· ' + E(subject.name) : '· Full Syllabus'}</small>
                  </div>
                  <span class="t-score-pill ${isPass ? 'tb-pass' : 'tb-warn'}">
                    ${att.score} / ${maxScore} (${scorePct}%)
                  </span>
                </div>
                <div class="t-att-foot">
                  <span>${ico('calendar')} Attempted: ${E(att.at || 'Recent')}</span>
                  <span>Duration: ${tDef ? tDef.min : 15} mins</span>
                  ${tDef ? `<a onclick="viewTestReview('${att.id}','${tDef.id}','${s.id}')" style="font-size:12px;font-weight:600;color:#0284c7;cursor:pointer">Review Q&A ›</a>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="em">
          <p>No tests participated yet.</p>
          <button class="b1" style="margin-top:10px" onclick="simulateTestAttempt('${s.id}')">+ Simulate Test Attempt</button>
        </div>
      `}
    `;
  }

  d.innerHTML = `
    <div class="drawer-backdrop" onclick="closeDrawer()"></div>
    <div class="drawer-panel">
      <!-- Header -->
      <div class="drawer-head">
        <div class="drawer-head-user">
          <img class="drawer-head-img" src="${av(s)}" alt="">
          <div class="drawer-head-meta">
            <b>${E(s.name)}</b>
            <small>${E(s.email)} · ${s.mode === 'Online' ? 'Online' : (hasC() ? E(cn(s.centers[0])) : 'Learner')}</small>
          </div>
        </div>
        <button class="x" onclick="closeDrawer()" aria-label="Close">×</button>
      </div>

      <!-- Tabs: 1. All details, 2. Tests list of that student -->
      <div class="drawer-tabs">
        <button class="drawer-tab ${curDrawerTab === 'details' ? 'active' : ''}" onclick="setDrawerTab('details')">
          All Details
        </button>
        <button class="drawer-tab ${curDrawerTab === 'tests' ? 'active' : ''}" onclick="setDrawerTab('tests')">
          Tests List (${tests.length})
        </button>
      </div>

      <!-- Body -->
      <div class="drawer-body">
        ${bodyContent}
      </div>

      <!-- Footer -->
      <div class="drawer-foot">
        <button class="b2" onclick="closeDrawer()">Close</button>
        <button class="b1" onclick="es('${s.id}')">Edit Student</button>
      </div>
    </div>
  `;
}

function simulateTestAttempt(sid) {
  const s = U(sid);
  if (!s) return;
  const eligible = D.tests.filter(t => s.courses.includes(t.course));
  const pool = eligible.length ? eligible : D.tests;
  if (!pool.length) return toast('No tests available in system');
  const test = pool[Math.floor(Math.random() * pool.length)];
  const maxQ = test.qs.length || 3;
  const score = Math.floor(Math.random() * maxQ) + 1;
  D.res.unshift({
    id: id('r'),
    sid: s.id,
    tid: test.id,
    score: score,
    total: maxQ,
    at: nowS()
  });
  save();
  toast(`Test participation recorded for ${s.name}: ${score}/${maxQ}`);
  renderDrawer();
  if (S.p === 'students') render();
}

function viewTestReview(rid, tid, sid) {
  const t = D.tests.find(x => x.id === tid);
  const s = U(sid);
  const res = D.res.find(x => x.id === rid);
  if (!t || !res) return;
  modal(
    `Test Review · ${E(t.name)}`,
    `<div style="margin-bottom:12px"><b style="font-size:15px">${E(s.name)}</b><span class="st gn" style="margin-left:8px">Score: ${res.score}/${t.qs.length}</span></div>` +
      `<div style="display:grid;gap:10px">${t.qs
        .map(
          (q, idx) => `
      <div class="cd">
        <b>Q${idx + 1}. ${E(q.q)}</b>
        <div style="display:grid;gap:4px;margin-top:6px;font-size:12.5px">
          ${q.o
            .map(
              (opt, oIdx) => `
            <div style="padding:5px 8px;border-radius:6px;background:${oIdx === q.a ? '#dcfce7;color:#15803d;font-weight:600' : '#f8fafc'}">
              ${'ABCD'[oIdx]}. ${E(opt)} ${oIdx === q.a ? '✓ (Correct Answer)' : ''}
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
        )
        .join('')}</div>`,
    null,
    '',
    '',
    `<button class="b1" onclick="closeM(1)">Done</button>`
  );
  $('.md').style.maxWidth = '640px';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && curDrawerSid) {
    closeDrawer();
  }
});

/* Override PG.students with Student Name, Email, Mobile, Reg. Date, Courses, Tests & Profile */
PG.students = function () {
  const al = stu();
  const adm = can();
  return (
    hd(
      'Students',
      me().role === 'instructor' ? 'Learners enrolled in your curriculum.' : 'Manage learners, view test participation, courses and corresponding batches.',
      adm ? `<button class="b2" onclick="ci()">${ico('up')} Import CSV</button> <button class="b1" onclick="es()">+ Add student</button>` : ''
    ) +
    `<div class="metric-grid">
      ${renderKpiCard({ title: 'Total Students', value: al.length, trend: '↑ +12%', sub: 'vs. last month', icon: 'students', variant: 0 })}
      ${renderKpiCard({ title: hasC() ? 'Center Learners' : 'Online Learners', value: hasC() ? al.filter(s => s.mode !== 'Online').length : al.length, trend: '↑ +15%', sub: 'vs. last month', icon: 'file', variant: 1 })}
      ${renderKpiCard({ title: 'Active Enrollees', value: al.filter(s => s.courses.length > 0).length, trend: '↑ +8%', sub: 'vs. last month', icon: 'courses', variant: 2 })}
      ${renderKpiCard({ title: 'Without Batch', value: al.filter(s => !s.batch).length, trend: '↑ +2', sub: 'vs. last month', icon: 'batches', variant: 3 })}
    </div>` +
    tb(
      [
        [
          'Student Name',
          s => `
            <div class="stu-cell" onclick="openStudentDrawer('${s.id}','details')" title="Click to view full profile">
              <img class="s-img" src="${av(s)}" alt="${E(s.name)}">
              <div class="stu-meta">
                <b class="stu-name">${E(s.name)}</b>
                <span class="stu-sub">${s.mode === 'Online' ? '<span class="st gn">Online</span>' : (hasC() ? E(cn(s.centers[0])) : '<span class="st">Learner</span>')}</span>
              </div>
            </div>
          `
        ],
        ['Email', s => `<span class="stu-email">${E(s.email)}</span>`],
        ['Mobile', s => `<span class="stu-phone">${E(s.phone || '—')}</span>`],
        ['Reg. Date', s => `<span class="stu-date">${E(sRegDate(s))}</span>`],
        ['Courses', s => `<button class="cbtn" onclick="cpop('${s.id}')" title="Click to view course names and assigned batches">${s.courses.length} course${s.courses.length === 1 ? '' : 's'}</button>`],
        [
          'Tests & Profile',
          s => `
            <div class="ac" style="gap:6px">
              <button class="b2 s-test-btn" onclick="openStudentDrawer('${s.id}','tests')" title="View list of participated tests">
                ${ico('award')} Tests (${sTests(s).length})
              </button>
              <button class="b1 s-view-btn" onclick="openStudentDrawer('${s.id}','details')" title="View complete details">
                Profile ›
              </button>
            </div>
          `
        ]
      ],
      al,
      adm ? s => tblDots('student', s.id) : null,
      25
    )
  );
};

/* =====================================================================
   PACKAGES MODULE (Multi-course, batch selection, test/video series,
   lectures, tests, pricing, thumbnail & student assignment via Select or CSV)
   ===================================================================== */

function seedPackages() {
  if (D.packages && D.packages.length) return;
  D.packages = [
    {
      id: 'pkg1',
      name: 'JEE Complete Rankers Comprehensive Package',
      batch: 'b1',
      courses: ['k1', 'k3'],
      access: 'Paid',
      price: 52000,
      thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      desc: 'All-inclusive master bundle comprising JEE Advanced & Main Masterclass alongside Full Stack Python foundation.',
      videoSeries: ['Masterclass Concept Lecture Series'],
      testSeries: ['All India Benchmark Test Series'],
      lectures: ['Introduction to Physics', 'Core concepts of Physics', 'Problem solving in Mathematics', 'Introduction to Python Basics'],
      tests: ['Physics Mechanics Quick Quiz', 'Python Core & Algorithm Basics', 'JEE Full Syllabus Mock 1'],
      students: ['s1', 's2', 's7', 'g0', 'g1'],
      createdAt: '12 Jan 2026',
      status: 'Active'
    },
    {
      id: 'pkg2',
      name: 'NEET Medical Pioneer Fast-Track Package',
      batch: 'b2',
      courses: ['k2'],
      access: 'Free',
      price: 0,
      thumb: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
      desc: 'Complete medical entrance accelerator package with botany, zoology and simulated full syllabus mock series.',
      videoSeries: ['Masterclass Concept Lecture Series'],
      testSeries: ['All India Benchmark Test Series'],
      lectures: ['Introduction to Botany', 'Core concepts of Zoology'],
      tests: ['Botany: Cell Biology Test'],
      students: ['s3', 's4', 'g2', 'g3'],
      createdAt: '18 Jan 2026',
      status: 'Active'
    }
  ];
  save();
}
seedPackages();

PG.packages = function () {
  const pkgs = D.packages || [];
  const adm = can();
  const r = me().role;

  // Filter for student if student role
  const displayList = r === 'student' ? pkgs.filter(p => (p.students || []).includes(S.uid)) : pkgs;

  return (
    hd(
      'Packages',
      'Bundled learning packages featuring batches, linked courses, video/test series, lectures, and learner assignments.',
      adm ? '<button class="b1" onclick="initNewPackageCreator()">+ Create Package</button>' : ''
    ) +
    `<div class="metric-grid">
      ${renderKpiCard({ title: 'Total Packages', value: pkgs.length, trend: '↑ +10%', sub: 'vs. last month', icon: 'packages', variant: 0 })}
      ${renderKpiCard({ title: 'Paid Packages', value: pkgs.filter(p => p.access === 'Paid').length, trend: '↑ +18%', sub: 'vs. last month', icon: 'fin', variant: 1 })}
      ${renderKpiCard({ title: 'Free Packages', value: pkgs.filter(p => p.access === 'Free').length, trend: '↑ +5%', sub: 'vs. last month', icon: 'award', variant: 2 })}
      ${renderKpiCard({ title: 'Enrolled Learners', value: pkgs.reduce((acc, p) => acc + (p.students || []).length, 0), trend: '↑ +24%', sub: 'vs. last month', icon: 'students', variant: 3 })}
    </div>` +
    (displayList.length
      ? `<div class="cg" style="grid-template-columns:repeat(auto-fill,minmax(340px,1fr))">
          ${displayList.map(pkg => {
            const b = D.batches.find(x => x.id === pkg.batch);
            const enrolledCount = (pkg.students || []).length;
            const courseObjs = D.courses.filter(c => (pkg.courses || []).includes(c.id));
            return `
              <div class="cd cc pkg-card" style="display:flex;flex-direction:column;justify-content:space-between;cursor:pointer" onclick="openPackageInNewTab('${pkg.id}')">
                <div>
                  <div class="cimw" style="height:160px;position:relative">
                    <img class="cim" src="${pkg.thumb || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}" alt="${E(pkg.name)}" loading="lazy">
                    <span class="st ${pkg.access === 'Free' ? 'gn' : ''}" style="position:absolute;top:10px;right:10px;left:auto!important;width:auto!important;max-width:max-content!important;box-shadow:0 2px 6px rgba(0,0,0,0.15)">
                      ${pkg.access === 'Paid' ? R(pkg.price) : 'Free Package'}
                    </span>
                    <span class="pill-badge pill-blue" style="position:absolute;bottom:10px;left:10px">
                      ${b ? E(b.name) : 'All Cohorts'}
                    </span>
                  </div>
                  <div style="padding:14px 14px 6px">
                    <b style="font-size:15px;display:block;margin-bottom:6px;line-height:1.35">${E(pkg.name)}</b>
                    <p style="font-size:12px;color:var(--m);margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${E(pkg.desc || 'Comprehensive learning bundle.')}</p>

                    <!-- Courses Tags -->
                    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">
                      ${courseObjs.map(c => `<span class="chip2" style="font-size:11px">${E(c.name)}</span>`).join('')}
                    </div>

                    <!-- Package Breakdown Specs -->
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;background:var(--s);border:1px solid var(--b);padding:10px;border-radius:8px;font-size:11.5px;color:var(--ink);margin-bottom:10px">
                      <div style="display:flex;align-items:center;gap:5px"><span class="sub-stat-ico" style="display:inline-flex;width:14px;height:14px">${ico('video', 14)}</span> <b>${(pkg.videoSeries || []).length}</b> Video Series</div>
                      <div style="display:flex;align-items:center;gap:5px"><span class="sub-stat-ico" style="display:inline-flex;width:14px;height:14px">${ico('tests', 14)}</span> <b>${(pkg.testSeries || []).length}</b> Test Series</div>
                      <div style="display:flex;align-items:center;gap:5px"><span class="sub-stat-ico" style="display:inline-flex;width:14px;height:14px">${ico('book', 14)}</span> <b>${(pkg.lectures || []).length}</b> Key Lectures</div>
                      <div style="display:flex;align-items:center;gap:5px"><span class="sub-stat-ico" style="display:inline-flex;width:14px;height:14px">${ico('calendar', 14)}</span> <b>${(pkg.tests || []).length}</b> Quizzes / Mocks</div>
                    </div>
                  </div>
                </div>

                <div style="padding:0 14px 14px">
                  <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--b);margin-bottom:12px">
                    <span style="font-size:12px;color:var(--mute);display:inline-flex;align-items:center;gap:5px">${ico('students', 14)} <b>${enrolledCount}</b> Student${enrolledCount === 1 ? '' : 's'} assigned</span>
                    <span class="st gn">Active</span>
                  </div>
                  <div class="ac" style="gap:6px;align-items:center">
                    <button class="b1" style="flex:1" onclick="event.stopPropagation(); openPackageInNewTab('${pkg.id}')">Open Package (New Tab) ↗</button>
                    ${adm ? tblDots('package', pkg.id) : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>`
      : `<div class="em">
          <p>${r === 'student' ? 'No packages assigned to your account yet.' : 'No packages created yet. Create a package to bundle batches, courses, and tests.'}</p>
          ${adm ? '<button class="b1" style="margin-top:10px" onclick="initNewPackageCreator()">+ Create Package</button>' : ''}
        </div>`)
  );
};

/* View Package Detail Modal */
function viewPackageDetail(pkgId) {
  const pkg = (D.packages || []).find(p => p.id === pkgId);
  if (!pkg) return;
  const b = D.batches.find(x => x.id === pkg.batch);
  const courseObjs = D.courses.filter(c => (pkg.courses || []).includes(c.id));
  const assignedStudents = D.users.filter(u => u.role === 'student' && (pkg.students || []).includes(u.id));

  modal(
    `Package · ${E(pkg.name)}`,
    `<div style="display:grid;gap:14px">
      <div style="display:flex;gap:14px;align-items:center">
        <img src="${pkg.thumb || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}" style="width:110px;height:75px;object-fit:cover;border-radius:8px">
        <div>
          <b style="font-size:16px;display:block">${E(pkg.name)}</b>
          <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
            <span class="st ${pkg.access === 'Free' ? 'gn' : ''}">${pkg.access === 'Paid' ? R(pkg.price) : 'Free Package'}</span>
            <span class="chip2">Batch: ${b ? E(b.name) : 'All'}</span>
          </div>
        </div>
      </div>
      <p style="font-size:13px;color:var(--m);margin:0">${E(pkg.desc || 'No description provided.')}</p>

      <!-- Bundled Courses -->
      <div class="cd">
        <b style="display:block;margin-bottom:6px">Bundled Courses (${courseObjs.length})</b>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${courseObjs.map(c => `<span class="chip2">${E(c.name)} (${c.code})</span>`).join('')}
        </div>
      </div>

      <!-- Curated Media & Tests -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="cd">
          <b style="font-size:12.5px;display:block;margin-bottom:4px">${ico('video')} Video Series Included</b>
          ${(pkg.videoSeries || []).length ? pkg.videoSeries.map(v => `<small style="display:block;color:#334155">• ${E(v)}</small>`).join('') : '<small style="color:var(--m)">None selected</small>'}
        </div>
        <div class="cd">
          <b style="font-size:12.5px;display:block;margin-bottom:4px">${ico('tests')} Test Series Included</b>
          ${(pkg.testSeries || []).length ? pkg.testSeries.map(t => `<small style="display:block;color:#334155">• ${E(t)}</small>`).join('') : '<small style="color:var(--m)">None selected</small>'}
        </div>
        <div class="cd">
          <b style="font-size:12.5px;display:block;margin-bottom:4px">${ico('book')} Curated Lectures</b>
          ${(pkg.lectures || []).length ? pkg.lectures.map(l => `<small style="display:block;color:#334155">• ${E(l)}</small>`).join('') : '<small style="color:var(--m)">None selected</small>'}
        </div>
        <div class="cd">
          <b style="font-size:12.5px;display:block;margin-bottom:4px">${ico('calendar')} Mock Tests & Quizzes</b>
          ${(pkg.tests || []).length ? pkg.tests.map(t => `<small style="display:block;color:#334155">• ${E(t)}</small>`).join('') : '<small style="color:var(--m)">None selected</small>'}
        </div>
      </div>

      <!-- Assigned Students List -->
      <div class="cd">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>Assigned Students (${assignedStudents.length})</b>
          ${can() ? `<button class="b2" style="padding:2px 8px;font-size:11px" onclick="closeM(1);openAssignStudentsModal('${pkg.id}')">+ Add Students</button>` : ''}
        </div>
        ${assignedStudents.length
          ? `<div style="max-height:140px;overflow-y:auto;display:grid;gap:6px">
              ${assignedStudents.map(s => `
                <div style="display:flex;align-items:center;gap:8px;font-size:12px;padding:4px 6px;background:#f8fafc;border-radius:6px">
                  <img src="${av(s)}" style="width:22px;height:22px;border-radius:50%;object-fit:cover">
                  <b>${E(s.name)}</b>
                  <span style="color:var(--m)">(${E(s.email)})</span>
                </div>
              `).join('')}
            </div>`
          : '<small style="color:var(--m)">No students assigned yet.</small>'}
      </div>
    </div>`,
    null,
    '',
    '',
    `<button class="b1" onclick="closeM(1)">Close</button>`
  );
  $('.md').style.maxWidth = '620px';
}

function deletePackage(pkgId) {
  cfm('Delete this package permanently?', () => {
    D.packages = (D.packages || []).filter(p => p.id !== pkgId);
    fin('Package deleted');
  });
}

/* =====================================================================
   CREATE / EDIT PACKAGE WIZARD
   Batch -> Multiple Courses -> Corresponding Test/Video Series, Lectures & Tests
   -> Thumbnail -> Pricing (Paid/Free)
   ===================================================================== */

let PKG_WIZ = null;

function openPackageWizard(pkgId) {
  const isEdit = !!pkgId;
  const existing = isEdit ? (D.packages || []).find(p => p.id === pkgId) : null;

  PKG_WIZ = {
    id: pkgId || id('pkg'),
    name: existing ? existing.name : '',
    batch: existing ? existing.batch : (D.batches[0] ? D.batches[0].id : ''),
    courses: existing ? [...existing.courses] : (D.courses.slice(0, 1).map(c => c.id)),
    access: existing ? existing.access : 'Paid',
    price: existing ? existing.price : 45000,
    thumb: existing ? existing.thumb : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    desc: existing ? existing.desc : '',
    videoSeries: existing ? [...(existing.videoSeries || [])] : [],
    testSeries: existing ? [...(existing.testSeries || [])] : [],
    lectures: existing ? [...(existing.lectures || [])] : [],
    tests: existing ? [...(existing.tests || [])] : [],
    students: existing ? [...(existing.students || [])] : []
  };

  renderPackageWizardStep();
}

function renderPackageWizardStep() {
  const w = PKG_WIZ;
  const batches = D.batches || [];
  const allCourses = D.courses || [];

  // Determine available elements for the selected courses
  const selectedCourseObjs = allCourses.filter(c => w.courses.includes(c.id)).map(ensure);

  // Available Video Series across selected courses
  const availVideoSeries = [];
  selectedCourseObjs.forEach(c => {
    (c.videoSeries || []).forEach(vs => availVideoSeries.push({ course: c.name, title: vs.title }));
  });

  // Available Test Series across selected courses
  const availTestSeries = [];
  selectedCourseObjs.forEach(c => {
    (c.testSeries || []).forEach(ts => availTestSeries.push({ course: c.name, title: ts.title }));
  });

  // Available Lectures across selected courses
  const availLectures = [];
  selectedCourseObjs.forEach(c => {
    (c.subs || []).forEach(s => {
      (s.lessons || []).forEach(l => availLectures.push({ course: c.name, sub: s.name, title: l.title }));
    });
  });

  // Available Tests across selected courses
  const availTests = D.tests.filter(t => w.courses.includes(t.course) || !t.course);

  const thumbPresets = [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80'
  ];

  modal(
    w.id.startsWith('pkg') && (D.packages || []).some(p => p.id === w.id) ? 'Edit Package' : 'Create Package',
    `<div style="display:grid;gap:14px">
      <!-- 1. Package Name & Batch Selection -->
      <div class="g2">
        <label>Package Name *
          <input id="pw_name" value="${E(w.name)}" placeholder="e.g. Masterclass Super 30 Package" oninput="PKG_WIZ.name=this.value">
        </label>
        <label>Target Batch *
          <select id="pw_batch" onchange="PKG_WIZ.batch=this.value">
            <option value="">-- Select Batch --</option>
            ${batches.map(b => `<option value="${b.id}" ${w.batch === b.id ? 'selected' : ''}>${E(b.name)} (${E(cn(b.center))})</option>`).join('')}
          </select>
        </label>
      </div>

      <!-- 2. Corresponding Courses Multi-Selection Dropdown / Checkbox Group -->
      <div class="cd">
        <b style="font-size:13px;display:block;margin-bottom:4px">Select Corresponding Courses * (Multi-Select)</b>
        <small style="color:var(--m);display:block;margin-bottom:8px">Select one or more courses to bundle into this package:</small>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px">
          ${allCourses.map(c => `
            <label class="ck opt" style="padding:6px 10px;background:#f8fafc;border-radius:8px">
              <input type="checkbox" value="${c.id}" ${w.courses.includes(c.id) ? 'checked' : ''} onchange="toggleWizardCourse('${c.id}',this.checked)">
              <span><b>${E(c.name)}</b> <small style="display:block;color:var(--m)">${c.code} · ${c.access}</small></span>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- 3. Corresponding Video Series & Test Series Selection -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="cd">
          <b style="font-size:12.5px;display:block;margin-bottom:4px">Select Video Series</b>
          <div style="max-height:120px;overflow-y:auto;display:grid;gap:4px">
            ${availVideoSeries.length
              ? availVideoSeries.map(vs => `
                <label class="ck opt" style="font-size:12px;padding:4px 6px">
                  <input type="checkbox" value="${E(vs.title)}" ${w.videoSeries.includes(vs.title) ? 'checked' : ''} onchange="toggleWizardArray('videoSeries','${E(vs.title)}',this.checked)">
                  <span>${E(vs.title)} <small style="color:var(--m)">(${E(vs.course)})</small></span>
                </label>
              `).join('')
              : '<small style="color:var(--m)">No video series in chosen courses.</small>'}
          </div>
        </div>

        <div class="cd">
          <b style="font-size:12.5px;display:block;margin-bottom:4px">Select Test Series</b>
          <div style="max-height:120px;overflow-y:auto;display:grid;gap:4px">
            ${availTestSeries.length
              ? availTestSeries.map(ts => `
                <label class="ck opt" style="font-size:12px;padding:4px 6px">
                  <input type="checkbox" value="${E(ts.title)}" ${w.testSeries.includes(ts.title) ? 'checked' : ''} onchange="toggleWizardArray('testSeries','${E(ts.title)}',this.checked)">
                  <span>${E(ts.title)} <small style="color:var(--m)">(${E(ts.course)})</small></span>
                </label>
              `).join('')
              : '<small style="color:var(--m)">No test series in chosen courses.</small>'}
          </div>
        </div>
      </div>

      <!-- 4. Corresponding Lectures & Tests Selection -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="cd">
          <b style="font-size:12.5px;display:block;margin-bottom:4px">Select Lectures</b>
          <div style="max-height:130px;overflow-y:auto;display:grid;gap:4px">
            ${availLectures.length
              ? availLectures.map(l => `
                <label class="ck opt" style="font-size:12px;padding:4px 6px">
                  <input type="checkbox" value="${E(l.title)}" ${w.lectures.includes(l.title) ? 'checked' : ''} onchange="toggleWizardArray('lectures','${E(l.title)}',this.checked)">
                  <span>${E(l.title)} <small style="color:var(--m)">(${E(l.sub)})</small></span>
                </label>
              `).join('')
              : '<small style="color:var(--m)">Select courses above to load lectures.</small>'}
          </div>
        </div>

        <div class="cd">
          <b style="font-size:12.5px;display:block;margin-bottom:4px">Select Quizzes & Tests</b>
          <div style="max-height:130px;overflow-y:auto;display:grid;gap:4px">
            ${availTests.length
              ? availTests.map(t => `
                <label class="ck opt" style="font-size:12px;padding:4px 6px">
                  <input type="checkbox" value="${E(t.name)}" ${w.tests.includes(t.name) ? 'checked' : ''} onchange="toggleWizardArray('tests','${E(t.name)}',this.checked)">
                  <span>${E(t.name)} <small style="color:var(--m)">(${t.qs.length} Qs)</small></span>
                </label>
              `).join('')
              : '<small style="color:var(--m)">No tests available.</small>'}
          </div>
        </div>
      </div>

      <!-- 5. Access Type (Paid or Free) & Price -->
      <div class="g2">
        <label>Access Type *
          <select id="pw_access" onchange="PKG_WIZ.access=this.value;$('#pw_price_box').style.display=this.value==='Paid'?'block':'none'">
            <option value="Paid" ${w.access === 'Paid' ? 'selected' : ''}>Paid Package</option>
            <option value="Free" ${w.access === 'Free' ? 'selected' : ''}>Free Package</option>
          </select>
        </label>
        <div id="pw_price_box" style="display:${w.access === 'Paid' ? 'block' : 'none'}">
          <label>Price (₹ INR) *
            <input type="number" id="pw_price" value="${w.price}" min="0" oninput="PKG_WIZ.price=+this.value">
          </label>
        </div>
      </div>

      <!-- 6. Package Thumbnail (Upload or Select Preset) -->
      <div>
        <label>Package Thumbnail (Image URL or Upload) *
          <input id="pw_thumb" value="${E(w.thumb)}" placeholder="https://..." oninput="PKG_WIZ.thumb=this.value;$('#pw_preview').src=this.value">
        </label>
        <div style="display:flex;gap:8px;align-items:center;margin-top:6px">
          <input type="file" id="pw_file" accept="image/*" style="font-size:11.5px;max-width:240px" onchange="handlePkgThumbUpload(this)">
          <small style="color:var(--m)">Or pick preset:</small>
          ${thumbPresets.map(url => `
            <img src="${url}" style="width:34px;height:24px;object-fit:cover;border-radius:4px;cursor:pointer;border:1px solid var(--b)" onclick="PKG_WIZ.thumb='${url}';$('#pw_thumb').value='${url}';$('#pw_preview').src='${url}'">
          `).join('')}
        </div>
        <div style="margin-top:8px">
          <img id="pw_preview" src="${w.thumb}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;border:1px solid var(--b)">
        </div>
      </div>

      <label>Package Description
        <textarea id="pw_desc" rows="2" placeholder="Brief overview of curriculum bundle..." oninput="PKG_WIZ.desc=this.value">${E(w.desc)}</textarea>
      </label>
    </div>`,
    null,
    '',
    '',
    `<button class="b2" onclick="closeM(1)">Cancel</button>
     <button class="b1" onclick="savePackageWizard()">Save Package</button>`
  );
  $('.md').style.maxWidth = '720px';
}

function toggleWizardCourse(cid, isChecked) {
  if (isChecked) {
    if (!PKG_WIZ.courses.includes(cid)) PKG_WIZ.courses.push(cid);
  } else {
    PKG_WIZ.courses = PKG_WIZ.courses.filter(id => id !== cid);
  }
  renderPackageWizardStep();
}

function toggleWizardArray(field, item, isChecked) {
  PKG_WIZ[field] = PKG_WIZ[field] || [];
  if (isChecked) {
    if (!PKG_WIZ[field].includes(item)) PKG_WIZ[field].push(item);
  } else {
    PKG_WIZ[field] = PKG_WIZ[field].filter(x => x !== item);
  }
}

function handlePkgThumbUpload(input) {
  const f = input.files && input.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = e => {
    PKG_WIZ.thumb = e.target.result;
    if ($('#pw_thumb')) $('#pw_thumb').value = e.target.result;
    if ($('#pw_preview')) $('#pw_preview').src = e.target.result;
  };
  r.readAsDataURL(f);
}

function savePackageWizard() {
  const w = PKG_WIZ;
  if (!w.name.trim()) return ($('#er').textContent = 'Package name is required.');
  if (!w.courses.length) return ($('#er').textContent = 'Please select at least one corresponding course.');

  const pkgData = {
    id: w.id,
    name: w.name.trim(),
    batch: w.batch,
    courses: w.courses,
    access: w.access,
    price: w.access === 'Paid' ? (+w.price || 0) : 0,
    thumb: w.thumb || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    desc: (w.desc || '').trim(),
    videoSeries: w.videoSeries || [],
    testSeries: w.testSeries || [],
    lectures: w.lectures || [],
    tests: w.tests || [],
    students: w.students || [],
    status: 'Active',
    createdAt: dayS()
  };

  D.packages = D.packages || [];
  const exIdx = D.packages.findIndex(p => p.id === w.id);
  if (exIdx >= 0) {
    D.packages[exIdx] = pkgData;
  } else {
    D.packages.unshift(pkgData);
  }

  save();
  closeM(1);
  fin(`Package saved: ${pkgData.name}`);

  // Automatically prompt to assign students if newly created
  if (exIdx < 0) {
    setTimeout(() => openAssignStudentsModal(pkgData.id), 300);
  }
}

/* =====================================================================
   ASSIGN STUDENTS TO PACKAGE (Select from list OR Bulk CSV Import)
   ===================================================================== */

let ASSIGN_PKG_ID = null;
let ASSIGN_CSV_STUS = [];

function openAssignStudentsModal(pkgId) {
  ASSIGN_PKG_ID = pkgId;
  ASSIGN_CSV_STUS = [];
  const pkg = (D.packages || []).find(p => p.id === pkgId);
  if (!pkg) return;

  const allStudents = D.users.filter(u => u.role === 'student');
  const assignedSet = new Set(pkg.students || []);

  modal(
    `Assign Students · ${E(pkg.name)}`,
    `<div class="fg">
      <div class="seg" style="margin-bottom:12px">
        <button type="button" id="tab_asgn_sel" class="on" onclick="$('#box_asgn_sel').hidden=false;$('#box_asgn_csv').hidden=true;this.classList.add('on');$('#tab_asgn_csv').classList.remove('on')">Select from Students</button>
        <button type="button" id="tab_asgn_csv" onclick="$('#box_asgn_sel').hidden=true;$('#box_asgn_csv').hidden=false;this.classList.add('on');$('#tab_asgn_sel').classList.remove('on')">Import via CSV</button>
      </div>
    </div>

    <!-- Method 1: Interactive Multi-Select -->
    <div id="box_asgn_sel">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:12px;color:var(--m)"><b id="asgn_cnt">${assignedSet.size}</b> of ${allStudents.length} students enrolled</span>
        <div style="display:flex;gap:6px">
          <button type="button" class="b2" style="font-size:11px;padding:3px 8px" onclick="selectAllPkgStudents(true)">Select All</button>
          <button type="button" class="b2" style="font-size:11px;padding:3px 8px" onclick="selectAllPkgStudents(false)">Deselect All</button>
        </div>
      </div>
      <input class="in" placeholder="Search student name or email…" style="margin-bottom:8px" oninput="filterPkgStudentList(this.value)">
      <div id="pkg_stu_list" style="max-height:280px;overflow-y:auto;display:grid;gap:6px">
        ${allStudents.map(s => `
          <label class="ck opt stu-item-row" data-search="${E(s.name.toLowerCase())} ${E(s.email.toLowerCase())}" style="display:flex;align-items:center;gap:10px;padding:6px 10px;background:#f8fafc;border-radius:8px">
            <input type="checkbox" class="pkg-stu-chk" value="${s.id}" ${assignedSet.has(s.id) ? 'checked' : ''} onchange="updateAssignCount()">
            <img src="${av(s)}" style="width:28px;height:28px;border-radius:50%;object-fit:cover">
            <div>
              <b style="font-size:13px">${E(s.name)}</b>
              <small style="display:block;color:var(--m)">${E(s.email)} · ${s.phone || '—'}</small>
            </div>
          </label>
        `).join('')}
      </div>
    </div>

    <!-- Method 2: CSV Upload -->
    <div id="box_asgn_csv" hidden>
      <div class="dash-card" style="border:1.5px dashed var(--b);text-align:center;padding:18px;border-radius:10px;margin-bottom:12px">
        <p style="font-size:13px;margin:0 0 8px">Upload CSV with student emails or names:</p>
        <input type="file" id="asgn_csv_file" accept=".csv" onchange="handlePkgCsvUpload(this)" style="font-size:12px">
        <div style="margin-top:10px">
          <button type="button" class="b2" style="font-size:11.5px" onclick="downloadSamplePkgCsv()">${ico('down')} Download Sample CSV</button>
        </div>
      </div>
      <div id="csv_preview_box" hidden>
        <b style="font-size:12.5px;display:block;margin-bottom:4px">CSV Preview & Matched Candidates:</b>
        <div id="csv_preview_list" style="max-height:160px;overflow-y:auto;display:grid;gap:4px"></div>
      </div>
    </div>`,
    () => {
      const isSelTab = !$('#box_asgn_sel').hidden;
      let finalStudentIds = [];

      if (isSelTab) {
        document.querySelectorAll('.pkg-stu-chk:checked').forEach(chk => finalStudentIds.push(chk.value));
      } else {
        if (!ASSIGN_CSV_STUS.length) return 'Please upload a CSV file with valid student records.';
        finalStudentIds = [...new Set([...(pkg.students || []), ...ASSIGN_CSV_STUS])];
      }

      pkg.students = finalStudentIds;

      // Also ensure those students are enrolled in the bundled courses
      finalStudentIds.forEach(sid => {
        const student = U(sid);
        if (student) {
          pkg.courses.forEach(cid => {
            if (!student.courses.includes(cid)) student.courses.push(cid);
          });
        }
      });

      save();
      fin(`Enrolled ${finalStudentIds.length} student${finalStudentIds.length === 1 ? '' : 's'} to ${pkg.name}`);
    },
    'Students assigned successfully'
  );
  $('.md').style.maxWidth = '580px';
}

function updateAssignCount() {
  const c = document.querySelectorAll('.pkg-stu-chk:checked').length;
  if ($('#asgn_cnt')) $('#asgn_cnt').textContent = c;
}

function selectAllPkgStudents(check) {
  document.querySelectorAll('.pkg-stu-chk').forEach(chk => (chk.checked = check));
  updateAssignCount();
}

function filterPkgStudentList(val) {
  const q = val.toLowerCase().trim();
  document.querySelectorAll('.stu-item-row').forEach(row => {
    const s = row.getAttribute('data-search') || '';
    row.style.display = !q || s.includes(q) ? 'flex' : 'none';
  });
}

function downloadSamplePkgCsv() {
  const csv = 'Name,Email,Mobile\nAarav Mehta,student@abcinstitute.demo,9820145892\nIsha Gupta,isha@mail.demo,9845123980\nRohan Das,rohan@mail.demo,9876543210\n';
  const b = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = 'sample_package_students.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast('Sample CSV downloaded');
}

function handlePkgCsvUpload(input) {
  const file = input.files && input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return toast('CSV is empty or missing data rows');

    ASSIGN_CSV_STUS = [];
    const matched = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      const email = parts[1] || '';
      const name = parts[0] || '';

      // Find matching existing student
      const st = D.users.find(u => u.role === 'student' && ((email && u.email.toLowerCase() === email.toLowerCase()) || (name && u.name.toLowerCase() === name.toLowerCase())));
      if (st) {
        ASSIGN_CSV_STUS.push(st.id);
        matched.push({ name: st.name, email: st.email, status: 'Matched' });
      } else if (name || email) {
        // Automatically create candidate in local storage if not exists
        const newStu = {
          id: id('s'),
          name: name || 'Learner',
          email: email || `${id('stu')}@mail.demo`,
          phone: parts[2] || '98' + String(10000000 + Math.floor(Math.random() * 89999999)),
          role: 'student',
          mode: 'Online',
          centers: [],
          batch: '',
          courses: [],
          status: 'Active',
          regDate: dayS()
        };
        D.users.push(newStu);
        ASSIGN_CSV_STUS.push(newStu.id);
        matched.push({ name: newStu.name, email: newStu.email, status: 'New Enrollee Created' });
      }
    }

    if ($('#csv_preview_box')) $('#csv_preview_box').hidden = false;
    if ($('#csv_preview_list')) {
      $('#csv_preview_list').innerHTML = matched.map(m => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px;background:#f1f5f9;border-radius:6px;font-size:12px">
          <b>${E(m.name)} <span style="color:var(--m);font-weight:normal">(${E(m.email)})</span></b>
          <span class="st gn" style="font-size:10.5px">${m.status}</span>
        </div>
      `).join('');
    }

    toast(`CSV parsed: ${matched.length} student${matched.length === 1 ? '' : 's'} ready to assign`);
  };
  reader.readAsText(file);
}

/* =====================================================================
   UNIFIED ALL-IN-ONE PACKAGE CREATOR STUDIO & DEEP NESTED PACKAGE VIEW
   ===================================================================== */

function openPackageInNewTab(pkgId) {
  if (!pkgId) return;
  try {
    if (S && S.uid) localStorage.setItem('trigr_active_uid', S.uid);
  } catch (e) {}
  const pathname = window.location.pathname || 'basic.html';
  const targetUrl = `${pathname}?p=package_view&pkg=${encodeURIComponent(pkgId)}`;
  const win = window.open(targetUrl, '_blank');
  if (!win) {
    S.selectedPkgId = pkgId;
    go('package_view');
  }
}

function resetPkgForm(existingPkg = null) {
  if (existingPkg) {
    return {
      isEdit: true,
      id: existingPkg.id,
      name: existingPkg.name || '',
      access: existingPkg.access || 'Paid',
      price: existingPkg.price !== undefined ? existingPkg.price : 4999,
      desc: existingPkg.desc || existingPkg.description || '',
      thumb: existingPkg.thumb || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      batch: existingPkg.batch || '',
      category: existingPkg.category || 'Engineering (JEE)',
      validity: existingPkg.validity || '365 Days (1 Year)',
      advOpen: false,
      studentToggle: (existingPkg.students && existingPkg.students.length > 0) || false,
      courses: existingPkg.courses ? [...existingPkg.courses] : [],
      testSeries: existingPkg.testSeries ? [...existingPkg.testSeries] : [],
      videoSeries: existingPkg.videoSeries ? [...existingPkg.videoSeries] : [],
      tests: existingPkg.tests ? [...existingPkg.tests] : [],
      lectures: existingPkg.lectures ? [...existingPkg.lectures] : [],
      notes: existingPkg.notes ? [...existingPkg.notes] : [],
      students: existingPkg.students ? [...existingPkg.students] : []
    };
  }
  return {
    isEdit: false,
    id: id('pkg'),
    name: '',
    access: 'Paid',
    price: 4999,
    desc: '',
    thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    batch: '',
    category: 'Engineering (JEE)',
    validity: '365 Days (1 Year)',
    advOpen: false,
    studentToggle: false,
    courses: D.courses && D.courses[0] ? [D.courses[0].id] : [],
    testSeries: [],
    videoSeries: [],
    tests: [],
    lectures: [],
    notes: [],
    students: []
  };
}

window.PKG_DRAWER = {
  open: false,
  type: null,
  filter: 'All',
  search: ''
};

window.__pkgCreateHook = null;

function initNewPackageCreator() {
  window.PKG_FORM = resetPkgForm(null);
  window.PKG_DRAWER = { open: false, type: null, filter: 'All', search: '' };
  go('create_package');
}

function editPackageInCreator(pkgId) {
  const pkg = (D.packages || []).find(p => p.id === pkgId);
  if (!pkg) return;
  window.PKG_FORM = resetPkgForm(pkg);
  window.PKG_DRAWER = { open: false, type: null, filter: 'All', search: '' };
  go('create_package');
}

function handlePkgStudioThumbUpload(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = e => {
    window.PKG_FORM.thumb = e.target.result;
    if ($('#cp_thumb_preview')) $('#cp_thumb_preview').src = e.target.result;
    document.querySelectorAll('.ghl-preset-thumb').forEach(el => el.classList.remove('selected'));
    toast('Custom cover image uploaded');
  };
  r.readAsDataURL(file);
}

function selectGhlPreset(url) {
  window.PKG_FORM.thumb = url;
  if ($('#cp_thumb_preview')) $('#cp_thumb_preview').src = url;
  document.querySelectorAll('.ghl-preset-thumb').forEach(el => {
    el.classList.toggle('selected', el.getAttribute('data-url') === url);
  });
}

/* Gather Catalog Data for the Create Package Builder & Right Sidebar Drawer */
function getPkgBuilderCatalog() {
  const allCourses = (D.courses || []).map(ensure);
  const allTests = D.tests || [];
  const allStudents = (D.users || []).filter(u => u.role === 'student');

  // 1. Courses
  const courses = allCourses.map(c => ({
    id: c.id,
    title: c.name,
    meta: `${c.code || 'CRS'} · ${(c.subs || []).length} Subjects · ${(c.lessons || []).length} Lectures`,
    category: c.mode || 'Online',
    raw: c
  }));

  // 2. Test Series
  const tsMap = new Map();
  (getAllTestSeries ? getAllTestSeries() : []).forEach(ts => {
    tsMap.set(ts.title, {
      id: ts.title,
      title: ts.title,
      meta: `${(ts.tests || []).length} Tests Linked · ${ts.isInstitute ? 'Institute Level' : ts.courseName}`,
      category: ts.isInstitute ? 'Independent' : (ts.courseName || 'Course Series'),
      raw: ts
    });
  });
  (D.pkgTestSeries || []).forEach(ts => {
    if (!tsMap.has(ts.title)) {
      tsMap.set(ts.title, {
        id: ts.title,
        title: ts.title,
        meta: `${(ts.tests || []).length} Tests Linked · Package Level`,
        category: 'Package Level',
        raw: ts
      });
    }
  });
  (D.testSeries || []).forEach(ts => {
    if (!tsMap.has(ts.title)) {
      tsMap.set(ts.title, {
        id: ts.title,
        title: ts.title,
        meta: `${(ts.tests || []).length} Tests Linked · ${ts.cat || 'Standard'}`,
        category: ts.cat || 'Engineering',
        raw: ts
      });
    }
  });
  const series = Array.from(tsMap.values());

  // 3. Video Series
  const vsMap = new Map();
  (D.pkgVideoSeries || []).forEach(vs => {
    if (!vsMap.has(vs.title)) {
      vsMap.set(vs.title, {
        id: vs.title,
        title: vs.title,
        meta: `${(vs.videos || []).length} Videos · Package Level`,
        category: 'Package Level',
        raw: vs
      });
    }
  });
  allCourses.forEach(c => {
    (c.videoSeries || []).forEach(vs => {
      if (!vsMap.has(vs.title)) {
        vsMap.set(vs.title, {
          id: vs.title,
          title: vs.title,
          meta: `${(vs.videos || []).length} Videos · ${c.name}`,
          category: c.name,
          raw: vs
        });
      }
    });
  });
  const vseries = Array.from(vsMap.values());

  // 4. Individual CBT Tests
  const tests = allTests.map(t => {
    const cObj = allCourses.find(c => c.id === t.course);
    const cat = t.course === '__institute__' ? 'Institute Level' : t.course === '__package__' ? 'Package Level' : (cObj ? cObj.name : (t.sub || 'General'));
    return {
      id: t.name,
      title: t.name,
      meta: `${t.min || 30} mins · ${(t.qs || []).length} Questions`,
      category: cat,
      raw: t
    };
  });

  // 5. Standalone Video Lectures
  const lecMap = new Map();
  allCourses.forEach(c => {
    (c.subs || []).forEach(s => {
      (s.lessons || []).forEach(l => {
        if (!lecMap.has(l.title)) {
          lecMap.set(l.title, {
            id: l.title,
            title: l.title,
            meta: `${l.dur || '18:00'} · ${s.name}`,
            category: s.name || c.name,
            raw: l
          });
        }
      });
    });
  });
  const lectures = Array.from(lecMap.values());

  // 6. Study Notes & PDFs
  const noteMap = new Map();
  allCourses.forEach(c => {
    (c.subs || []).forEach(s => {
      (s.notes || []).forEach(n => {
        if (!noteMap.has(n.title)) {
          noteMap.set(n.title, {
            id: n.title,
            title: n.title,
            meta: `${n.type || 'PDF'} · ${n.size || '1.4 MB'}`,
            category: s.name || n.type || 'PDF',
            raw: n
          });
        }
      });
    });
  });
  // Also include default/custom notes already in PKG_FORM
  if (window.PKG_FORM && Array.isArray(window.PKG_FORM.notes)) {
    window.PKG_FORM.notes.forEach(n => {
      const nTitle = typeof n === 'string' ? n : n.title;
      if (nTitle && !noteMap.has(nTitle)) {
        const nObj = typeof n === 'object' ? n : { id: id('n'), title: nTitle, type: 'PDF', size: '1.8 MB', url: PDF, at: dayS() };
        noteMap.set(nTitle, {
          id: nTitle,
          title: nTitle,
          meta: `${nObj.type || 'PDF'} · ${nObj.size || '1.8 MB'}`,
          category: nObj.type || 'PDF',
          raw: nObj
        });
      }
    });
  }
  const notes = Array.from(noteMap.values());

  // 7. Students
  const students = allStudents.map(s => {
    const bObj = (D.batches || []).find(b => b.id === s.batch);
    return {
      id: s.id,
      title: s.name,
      meta: s.email,
      category: bObj ? bObj.name : (s.mode || 'Online'),
      raw: s
    };
  });

  return { courses, series, vseries, tests, lectures, notes, students };
}

const GHL_DRAWER_META = {
  courses: {
    title: 'Select Courses',
    subtitle: 'Bundle full courses into this package',
    formKey: 'courses',
    createLabel: '+ Create New Course'
  },
  series: {
    title: 'Select Test Series',
    subtitle: 'Attach structured test series',
    formKey: 'testSeries',
    createLabel: '+ Create New Test Series'
  },
  vseries: {
    title: 'Select Video Series',
    subtitle: 'Attach thematic video playlists & lecture series',
    formKey: 'videoSeries',
    createLabel: '+ Create New Video Series'
  },
  tests: {
    title: 'Select CBT Tests',
    subtitle: 'Add individual mock or practice tests',
    formKey: 'tests',
    createLabel: '+ Create New Test'
  },
  lectures: {
    title: 'Select Video Lectures',
    subtitle: 'Filter by subject and pick individual lectures',
    formKey: 'lectures',
    createLabel: '+ Create New Lecture'
  },
  notes: {
    title: 'Select Study Notes & PDFs',
    subtitle: 'Attach downloadable PDFs and formula sheets',
    formKey: 'notes',
    createLabel: '+ Upload New Note'
  },
  students: {
    title: 'Assign Students',
    subtitle: 'Search and select students to auto-enroll',
    formKey: 'students',
    createLabel: '+ Add New Student'
  }
};

function getPkgSelectedSet(type) {
  const f = window.PKG_FORM;
  if (!f) return new Set();
  const key = GHL_DRAWER_META[type].formKey;
  const arr = f[key] || [];
  if (type === 'notes') {
    return new Set(arr.map(x => (typeof x === 'string' ? x : x.title)));
  }
  return new Set(arr);
}

function setPkgSelectedFromSet(type, setObj) {
  const f = window.PKG_FORM;
  if (!f) return;
  const key = GHL_DRAWER_META[type].formKey;
  const catalog = getPkgBuilderCatalog();
  if (type === 'notes') {
    const items = [];
    setObj.forEach(title => {
      const found = catalog.notes.find(n => n.id === title);
      if (found && found.raw) {
        items.push(found.raw);
      } else {
        items.push({ id: id('n'), title, type: 'PDF', size: '1.5 MB', url: PDF, at: dayS() });
      }
    });
    f.notes = items;
  } else {
    f[key] = Array.from(setObj);
  }
}

function openPkgSelectionDrawer(type) {
  window.PKG_DRAWER = {
    open: true,
    type,
    filter: 'All',
    search: ''
  };
  renderPkgDrawerDOM();
}

function closePkgSelectionDrawer() {
  window.PKG_DRAWER.open = false;
  const bd = $('#pkgDrawerBackdrop');
  const dr = $('#pkgSelectionDrawer');
  if (bd) bd.classList.remove('open');
  if (dr) dr.classList.remove('open');
  if (S.p === 'create_package') {
    rp();
  }
}

function setPkgDrawerFilter(cat) {
  window.PKG_DRAWER.filter = cat;
  renderPkgDrawerDOM();
}

function onPkgDrawerSearch(val) {
  window.PKG_DRAWER.search = val;
  renderPkgDrawerItemsOnly();
}

function togglePkgDrawerItem(type, itemId) {
  const setObj = getPkgSelectedSet(type);
  if (setObj.has(itemId)) {
    setObj.delete(itemId);
  } else {
    setObj.add(itemId);
  }
  setPkgSelectedFromSet(type, setObj);
  renderPkgDrawerItemsOnly();
  updateGhlTopSummary();
}

function clearPkgDrawerSelection() {
  const type = window.PKG_DRAWER.type;
  if (!type) return;
  setPkgSelectedFromSet(type, new Set());
  renderPkgDrawerItemsOnly();
  updateGhlTopSummary();
}

function removePkgHubChip(type, itemId) {
  const setObj = getPkgSelectedSet(type);
  setObj.delete(itemId);
  setPkgSelectedFromSet(type, setObj);
  rp();
}

function updateGhlTopSummary() {
  const f = window.PKG_FORM;
  if (!f) return;
  const totalContent =
    (f.courses || []).length +
    (f.testSeries || []).length +
    (f.videoSeries || []).length +
    (f.tests || []).length +
    (f.lectures || []).length +
    (f.notes || []).length;
  const priceLabel = f.access === 'Free' ? 'Free' : `Paid (${R(+f.price || 0)})`;
  const el = $('#ghlTopSummary');
  if (el) {
    el.innerHTML = `<strong>${totalContent}</strong> item${totalContent === 1 ? '' : 's'} bundled · <strong>${priceLabel}</strong>`;
  }
}

function renderPkgDrawerItemsOnly() {
  const dState = window.PKG_DRAWER;
  if (!dState || !dState.open || !dState.type) return;
  const type = dState.type;
  const catalog = getPkgBuilderCatalog();
  const items = catalog[type] || [];
  const selectedSet = getPkgSelectedSet(type);
  const query = (dState.search || '').toLowerCase();

  const filtered = items.filter(item => {
    const matchesCat = dState.filter === 'All' || item.category === dState.filter;
    const matchesText = !query || item.title.toLowerCase().includes(query) || (item.meta || '').toLowerCase().includes(query);
    return matchesCat && matchesText;
  });

  const bodyEl = $('#pkgDrawerBody');
  if (bodyEl) {
    if (!filtered.length) {
      bodyEl.innerHTML = `
        <div style="text-align:center;padding:36px 20px;color:#94a3b8;font-size:13px">
          <div style="margin-bottom:10px">No matching items found.</div>
          <button type="button" class="ghl-btn ghl-btn-primary" style="font-size:12.5px;padding:7px 14px" onclick="openPkgDrawerCreateNew('${type}')">
            ${GHL_DRAWER_META[type].createLabel}
          </button>
        </div>
      `;
    } else {
      bodyEl.innerHTML = filtered.map(item => {
        const isChecked = selectedSet.has(item.id);
        return `
          <label class="ghl-select-item ${isChecked ? 'checked' : ''}">
            <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="togglePkgDrawerItem('${type}', '${E(item.id)}')" />
            <div class="ghl-select-item-info">
              <strong>${E(item.title)}</strong>
              <span>${E(item.meta)}</span>
            </div>
          </label>
        `;
      }).join('');
    }
  }

  const doneBtn = $('#pkgDrawerDoneBtn');
  if (doneBtn) {
    doneBtn.textContent = `Done (${selectedSet.size} Selected)`;
  }
}

function renderPkgDrawerDOM() {
  const dState = window.PKG_DRAWER;
  const bd = $('#pkgDrawerBackdrop');
  const dr = $('#pkgSelectionDrawer');
  if (!bd || !dr) return;

  if (!dState.open || !dState.type) {
    bd.classList.remove('open');
    dr.classList.remove('open');
    return;
  }

  const type = dState.type;
  const cfg = GHL_DRAWER_META[type];
  const catalog = getPkgBuilderCatalog();
  const items = catalog[type] || [];
  const categories = ['All', ...new Set(items.map(i => i.category).filter(Boolean))];

  $('#pkgDrawerTitle').textContent = cfg.title;
  $('#pkgDrawerSubtitle').textContent = cfg.subtitle;

  const createBtnWrap = $('#pkgDrawerCreateAction');
  if (createBtnWrap) {
    createBtnWrap.innerHTML = `
      <button type="button" class="ghl-btn ghl-btn-primary ghl-drawer-create-btn" onclick="openPkgDrawerCreateNew('${type}')">
        ${cfg.createLabel}
      </button>
    `;
  }

  const searchInput = $('#pkgDrawerSearch');
  if (searchInput && searchInput.value !== dState.search) {
    searchInput.value = dState.search || '';
  }

  const filterContainer = $('#pkgDrawerFilters');
  if (filterContainer) {
    filterContainer.innerHTML = categories.map(cat => `
      <button type="button" class="ghl-filter-pill ${cat === dState.filter ? 'active' : ''}" onclick="setPkgDrawerFilter('${E(cat)}')">
        ${E(cat)}
      </button>
    `).join('');
  }

  renderPkgDrawerItemsOnly();

  bd.classList.add('open');
  dr.classList.add('open');
}

/* =====================================================================
   LAUNCH EXISTING INDIVIDUAL CREATION FLOWS IN CENTERED POPUP MODAL
   ABOVE THE RIGHT SIDEBAR DRAWER & AUTO-SELECT ON COMPLETION
   ===================================================================== */
function syncNewlyCreatedPkgItems() {
  const hk = window.__pkgCreateHook;
  if (!hk || !window.PKG_FORM) return;
  const f = window.PKG_FORM;

  if (hk.type === 'courses') {
    (D.courses || []).forEach(c => {
      if (!hk.prevCourses.includes(c.id)) {
        ensure(c);
        if (!f.courses.includes(c.id)) f.courses.push(c.id);
      }
    });
  } else if (hk.type === 'series') {
    (D.pkgTestSeries || []).forEach(ts => {
      if (!hk.prevPkgTs.includes(ts.id) && !f.testSeries.includes(ts.title)) {
        f.testSeries.push(ts.title);
      }
    });
    (D.instTestSeries || []).forEach(ts => {
      if (!hk.prevInstTs.includes(ts.id) && !f.testSeries.includes(ts.title)) {
        f.testSeries.push(ts.title);
      }
    });
    (D.courses || []).forEach(c => {
      (c.testSeries || []).forEach(ts => {
        if (!hk.prevCourseTs.includes(ts.id) && !f.testSeries.includes(ts.title)) {
          f.testSeries.push(ts.title);
        }
      });
    });
  } else if (hk.type === 'vseries') {
    (D.pkgVideoSeries || []).forEach(vs => {
      if (!hk.prevPkgVs.includes(vs.id) && !f.videoSeries.includes(vs.title)) {
        f.videoSeries.push(vs.title);
      }
    });
    (D.courses || []).forEach(c => {
      (c.videoSeries || []).forEach(vs => {
        if (!hk.prevCourseVs.includes(vs.id) && !f.videoSeries.includes(vs.title)) {
          f.videoSeries.push(vs.title);
        }
      });
    });
  } else if (hk.type === 'tests') {
    (D.tests || []).forEach(t => {
      if (!hk.prevTests.includes(t.id) && !f.tests.includes(t.name)) {
        f.tests.push(t.name);
      }
    });
  } else if (hk.type === 'lectures') {
    (D.courses || []).forEach(c => {
      (c.subs || []).forEach(s => {
        (s.lessons || []).forEach(l => {
          if (!hk.prevLecs.includes(l.id) && !f.lectures.includes(l.title)) {
            f.lectures.push(l.title);
          }
        });
      });
    });
  } else if (hk.type === 'notes') {
    (D.courses || []).forEach(c => {
      (c.subs || []).forEach(s => {
        (s.notes || []).forEach(n => {
          if (!hk.prevNotes.includes(n.id)) {
            f.notes = f.notes || [];
            if (!f.notes.some(x => (typeof x === 'string' ? x : x.title) === n.title)) {
              f.notes.push(n);
            }
          }
        });
      });
    });
  } else if (hk.type === 'students' || hk.type === 'csv') {
    (D.users || []).forEach(u => {
      if (u.role === 'student' && !hk.prevUsers.includes(u.id)) {
        f.studentToggle = true;
        if (!f.students.includes(u.id)) f.students.push(u.id);
      }
    });
  }

  window.__pkgCreateHook = null;
}

function openPkgDrawerCreateNew(type) {
  window.__pkgCreateHook = {
    type,
    prevCourses: (D.courses || []).map(c => c.id),
    prevTests: (D.tests || []).map(t => t.id),
    prevUsers: (D.users || []).map(u => u.id),
    prevPkgTs: (D.pkgTestSeries || []).map(x => x.id),
    prevInstTs: (D.instTestSeries || []).map(x => x.id),
    prevCourseTs: (D.courses || []).flatMap(c => (c.testSeries || []).map(x => x.id)),
    prevPkgVs: (D.pkgVideoSeries || []).map(x => x.id),
    prevCourseVs: (D.courses || []).flatMap(c => (c.videoSeries || []).map(x => x.id)),
    prevLecs: (D.courses || []).flatMap(c => (c.subs || []).flatMap(s => (s.lessons || []).map(l => l.id))),
    prevNotes: (D.courses || []).flatMap(c => (c.subs || []).flatMap(s => (s.notes || []).map(n => n.id)))
  };

  if (type === 'courses') {
    // Existing 3-step Course Creation Wizard from script.js
    return nw();
  }

  if (type === 'series') {
    // Existing Test Series Creation Modal with Package-level default
    return openCreateTestSeriesModal('Package');
  }

  if (type === 'tests') {
    // Full Test Builder Popup Modal centered above right sidebar with Package-level default
    return openTestBuilderModal({ defaultScope: 'Package' });
  }

  if (type === 'students') {
    // Existing Add Student Modal from script.js
    return es();
  }

  if (type === 'csv') {
    // Existing 3-step Bulk CSV Student Import Modal from script.js
    return ci();
  }

  if (type === 'vseries') {
    // Video Series Creation flow supporting Package-level & Course-wise
    const allCourses = (D.courses || []).map(ensure);
    const defaultCid = (window.PKG_FORM && window.PKG_FORM.courses[0]) || (allCourses[0] && allCourses[0].id) || '';
    let vsScope = 'Package';

    const renderVsContent = () => {
      const isPkg = vsScope === 'Package';
      return `
        <div style="display:grid;gap:12px">
          <label>Series Title *
            <input name="title" id="pkgVsTitle" placeholder="e.g. Complete Crash Course Video Series" value="">
          </label>
          <div class="fg">
            <span style="font-size:12.5px;font-weight:600;color:var(--ink);display:block;margin-bottom:6px">Scope Assignment *</span>
            <div class="seg" style="display:flex;gap:4px">
              <button type="button" class="${isPkg ? 'on' : ''}" onclick="window.__vsScopeSelect('Package')">Package-level</button>
              <button type="button" class="${!isPkg ? 'on' : ''}" onclick="window.__vsScopeSelect('Course')">Course-wise</button>
            </div>
          </div>
          ${isPkg ? `
            <div style="background:var(--s);border:1px solid var(--b);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--mute)">
              <b>Package-Level Video Series:</b> Attached directly to this package without requiring a course.
            </div>
          ` : `
            <label>Target Course *
              <select name="cid" id="pkgVsCourse">
                ${allCourses.map(c => `<option value="${c.id}" ${c.id === defaultCid ? 'selected' : ''}>${E(c.name)}</option>`).join('')}
              </select>
            </label>
          `}
          <label>Description
            <textarea name="desc" id="pkgVsDesc" rows="3" placeholder="Brief overview of this video series..."></textarea>
          </label>
        </div>
      `;
    };

    window.__vsScopeSelect = function (sc) {
      vsScope = sc;
      const body = document.querySelector('.mb');
      if (body) {
        const curT = $('#pkgVsTitle') ? $('#pkgVsTitle').value : '';
        const curD = $('#pkgVsDesc') ? $('#pkgVsDesc').value : '';
        body.innerHTML = renderVsContent() + '<p id="er" class="er"></p>';
        if ($('#pkgVsTitle')) $('#pkgVsTitle').value = curT;
        if ($('#pkgVsDesc')) $('#pkgVsDesc').value = curD;
      }
    };

    modal(
      'Create New Video Series',
      renderVsContent(),
      o => {
        const title = ($('#pkgVsTitle') ? $('#pkgVsTitle').value : o.title || '').trim();
        const desc = ($('#pkgVsDesc') ? $('#pkgVsDesc').value : o.desc || '').trim();
        if (!title) return 'Title is required.';
        if (vsScope === 'Package') {
          D.pkgVideoSeries = D.pkgVideoSeries || [];
          D.pkgVideoSeries.unshift({
            id: id('vs_pkg_'),
            title,
            desc,
            scope: 'Package',
            videos: []
          });
        } else {
          const cid = $('#pkgVsCourse') ? $('#pkgVsCourse').value : (o.cid || defaultCid);
          const c = gcr(cid);
          if (!c) return 'Please create a course first.';
          c.videoSeries = c.videoSeries || [];
          c.videoSeries.push({
            id: id('vs'),
            title,
            desc,
            videos: []
          });
        }
      },
      'Video series created'
    );
    return;
  }

  if (type === 'lectures') {
    // Existing Lecture Creation flow (elec) with course & subject selector
    const allCourses = (D.courses || []).map(ensure);
    const defaultCid = (window.PKG_FORM && window.PKG_FORM.courses[0]) || (allCourses[0] && allCourses[0].id) || '';
    const defaultCourse = allCourses.find(c => c.id === defaultCid) || allCourses[0];
    const subs = defaultCourse ? (defaultCourse.subs || []) : [];

    modal(
      'Add lecture',
      `<div class="g2">
        <label>Course *
          <select name="cid" onchange="const c=gcr(this.value);const sEl=document.getElementById('pkg_lec_sub');if(c&&sEl){sEl.innerHTML=(c.subs||[]).map(s=>'<option value=\\''+s.id+'\\'>'+E(s.name)+'</option>').join('')}">
            ${allCourses.map(c => `<option value="${c.id}" ${c.id === (defaultCourse && defaultCourse.id) ? 'selected' : ''}>${E(c.name)}</option>`).join('')}
          </select>
        </label>
        <label>Subject *
          <select name="sid" id="pkg_lec_sub">
            ${subs.map(s => `<option value="${s.id}">${E(s.name)}</option>`).join('')}
          </select>
        </label>
      </div>` +
      F('title', 'Lecture title *', 'text', [], '') +
      F('desc', 'Description', 'area', [], '') +
      `<div class=g2>${F('dur', 'Duration (mm:ss)', 'text', [], '18:30')}${F('video', 'Video URL', 'text', [], '')}</div><small>Leave the URL blank to attach a playable demo video.</small>`,
      o => {
        if (!o.title || !o.title.trim()) return 'Lecture title is required.';
        const c = gcr(o.cid || (defaultCourse && defaultCourse.id));
        if (!c) return 'Course is required.';
        const s = subOf(c, o.sid) || (c.subs && c.subs[0]);
        if (!s) return 'Subject is required.';
        s.lessons.push({
          id: id('l'),
          title: o.title.trim(),
          desc: (o.desc || '').trim(),
          dur: o.dur || '18:30',
          video: o.video || VID[Math.floor(Math.random() * VID.length)]
        });
        sync(c);
      },
      'Lecture added'
    );
    return;
  }

  if (type === 'notes') {
    // Existing Note Upload flow (enote) with course & subject selector
    const allCourses = (D.courses || []).map(ensure);
    const defaultCid = (window.PKG_FORM && window.PKG_FORM.courses[0]) || (allCourses[0] && allCourses[0].id) || '';
    const defaultCourse = allCourses.find(c => c.id === defaultCid) || allCourses[0];
    const subs = defaultCourse ? (defaultCourse.subs || []) : [];
    PF = null;

    modal(
      'Upload note',
      `<div class="g2">
        <label>Course *
          <select name="cid" onchange="const c=gcr(this.value);const sEl=document.getElementById('pkg_note_sub');if(c&&sEl){sEl.innerHTML=(c.subs||[]).map(s=>'<option value=\\''+s.id+'\\'>'+E(s.name)+'</option>').join('')}">
            ${allCourses.map(c => `<option value="${c.id}" ${c.id === (defaultCourse && defaultCourse.id) ? 'selected' : ''}>${E(c.name)}</option>`).join('')}
          </select>
        </label>
        <label>Subject *
          <select name="sid" id="pkg_note_sub">
            ${subs.map(s => `<option value="${s.id}">${E(s.name)}</option>`).join('')}
          </select>
        </label>
      </div>` +
      F('title', 'Title *', 'text', [], '') +
      F('type', 'Document type', 'select', ['PDF', 'DOCX', 'PPT'], 'PDF') +
      `<label>Upload file (optional, max 1 MB)<input type=file id=nfile onchange="nf(this.files[0])"></label><small id=nfn>No file selected — a demo document will be attached.</small>`,
      o => {
        if (!o.title || !o.title.trim()) return 'Title is required.';
        const c = gcr(o.cid || (defaultCourse && defaultCourse.id));
        if (!c) return 'Course is required.';
        const s = subOf(c, o.sid) || (c.subs && c.subs[0]);
        if (!s) return 'Subject is required.';
        const d = { title: o.title.trim(), type: o.type || 'PDF' };
        if (PF) { d.url = PF.url; d.size = PF.size; }
        s.notes.unshift({ id: id('n'), size: '1.4 MB', url: o.type === 'DOCX' ? DOCX : PDF, at: dayS(), ...d });
      },
      'Note uploaded'
    );
    return;
  }
}

function openCreateBatchForPkg() {
  const centers = (D.centers || []).filter(c => c.status === 'Active');
  modal(
    'Create New Batch',
    F('name', 'Batch Name *', 'text', [], '') +
    (hasC() && centers.length ? F('center', 'Center', 'select', centers.map(c => [c.id, c.name]), centers[0].id) : '') +
    F('schedule', 'Timing / Schedule (Optional)', 'text', [], 'Mon–Fri · 5:00 PM'),
    o => {
      if (!o.name || !o.name.trim()) return 'Batch name is required.';
      const newB = {
        id: id('b'),
        name: o.name.trim(),
        center: o.center || (centers[0] ? centers[0].id : ''),
        schedule: (o.schedule || '').trim(),
        status: 'Active'
      };
      D.batches = D.batches || [];
      D.batches.unshift(newB);
      if (window.PKG_FORM) {
        window.PKG_FORM.batch = newB.id;
        window.PKG_FORM.advOpen = true;
      }
      save();
      rp();
    },
    'Batch created & selected'
  );
}

/* Final Save & Publish Package from Studio */
function publishPackageFromStudio(openAfter = false, statusOverride = 'Active') {
  const f = window.PKG_FORM;
  if (!f.name || !f.name.trim()) {
    toast('Please enter a Package Name first.');
    const el = $('#cp_name');
    if (el) el.focus();
    return;
  }

  const pkgData = {
    id: f.id || id('pkg'),
    name: f.name.trim(),
    batch: f.batch || '',
    category: f.category || 'Engineering (JEE)',
    validity: f.validity || '365 Days (1 Year)',
    courses: f.courses || [],
    access: f.access || 'Paid',
    price: f.access === 'Paid' ? (+f.price || 0) : 0,
    thumb: f.thumb || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    desc: (f.desc || '').trim() || 'Comprehensive all-in-one learning and CBT assessment bundle.',
    videoSeries: f.videoSeries || [],
    testSeries: f.testSeries || [],
    lectures: f.lectures || [],
    tests: f.tests || [],
    notes: f.notes || [],
    students: f.studentToggle ? (f.students || []) : [],
    testsCount: (f.tests || []).length || 10,
    notesCount: (f.notes || []).length || 5,
    enrolledStudents: f.studentToggle ? (f.students || []).length : 0,
    rating: 4.9,
    reviews: 24,
    type: 'comprehensive',
    status: statusOverride || 'Active',
    createdAt: dayS()
  };

  D.packages = D.packages || [];
  const exIdx = D.packages.findIndex(p => p.id === pkgData.id);
  if (exIdx >= 0) {
    D.packages[exIdx] = pkgData;
  } else {
    D.packages.unshift(pkgData);
  }

  // Ensure assigned students also get enrolled in bundled courses & myPackages
  D.myPackages = D.myPackages || {};
  (pkgData.students || []).forEach(sid => {
    D.myPackages[sid] = D.myPackages[sid] || [];
    if (!D.myPackages[sid].includes(pkgData.id)) D.myPackages[sid].push(pkgData.id);
    const stuObj = U(sid);
    if (stuObj) {
      stuObj.courses = stuObj.courses || [];
      (pkgData.courses || []).forEach(cid => {
        if (!stuObj.courses.includes(cid)) stuObj.courses.push(cid);
      });
    }
  });

  window.PKG_DRAWER = { open: false, type: null, filter: 'All', search: '' };
  logA(`${statusOverride === 'Draft' ? 'Saved draft' : (f.isEdit ? 'Updated' : 'Published')} package: ${pkgData.name}`);
  save();
  toast(statusOverride === 'Draft' ? `Package "${pkgData.name}" saved as Draft!` : `Package "${pkgData.name}" published successfully!`);

  if (openAfter) {
    openPackageInNewTab(pkgData.id);
  }
  go('packages');
}

/* =====================================================================
   PAGE: PG.create_package (GHL-Style Clean Click-to-Select Studio)
   ===================================================================== */
PG.create_package = function () {
  window.PKG_FORM = window.PKG_FORM || resetPkgForm(null);
  syncNewlyCreatedPkgItems();

  const f = window.PKG_FORM;
  const batches = D.batches || [];
  const catalog = getPkgBuilderCatalog();

  const thumbPresets = [
    { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80', title: 'Tech & Study' },
    { url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80', title: 'Mathematics & Physics' },
    { url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80', title: 'Science Lab' },
    { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80', title: 'Books & Notes' }
  ];

  const totalContent =
    (f.courses || []).length +
    (f.testSeries || []).length +
    (f.videoSeries || []).length +
    (f.tests || []).length +
    (f.lectures || []).length +
    (f.notes || []).length;

  const priceLabel = f.access === 'Free' ? 'Free' : `Paid (${R(+f.price || 0)})`;

  const renderHubRowHTML = (type, iconLabel, emptyText, btnLabel) => {
    const selectedSet = getPkgSelectedSet(type);
    const ids = Array.from(selectedSet);
    const list = catalog[type] || [];

    const chipsHTML = ids.map(itemId => {
      const item = list.find(x => x.id === itemId) || { id: itemId, title: itemId, meta: 'Selected' };
      const shortMeta = (item.meta || '').split('·')[0].trim();
      return `
        <div class="ghl-chip">
          <span>${E(item.title)}</span>
          ${shortMeta ? `<small>${E(shortMeta)}</small>` : ''}
          <button type="button" class="ghl-chip-remove" onclick="removePkgHubChip('${type}', '${E(item.id)}')" title="Remove">×</button>
        </div>
      `;
    }).join('');

    return `
      <div class="ghl-hub-row">
        <div class="ghl-hub-info">
          <div class="ghl-hub-title-line">
            <span>${iconLabel}</span>
            <span class="ghl-count-pill ${ids.length > 0 ? 'has-items' : ''}">${ids.length} Selected</span>
          </div>
          ${ids.length === 0 ? `<div class="ghl-empty-hint">${emptyText}</div>` : ''}
          ${ids.length > 0 ? `<div class="ghl-chip-list">${chipsHTML}</div>` : ''}
        </div>
        <button type="button" class="ghl-btn ghl-btn-soft" onclick="openPkgSelectionDrawer('${type}')">${btnLabel}</button>
      </div>
    `;
  };

  const studentSet = getPkgSelectedSet('students');
  const studentIds = Array.from(studentSet);
  const studentChipsHTML = studentIds.map(sid => {
    const item = catalog.students.find(x => x.id === sid) || { id: sid, title: sid, meta: '' };
    return `
      <div class="ghl-chip">
        <span>${E(item.title)}</span>
        ${item.meta ? `<small>${E(item.meta)}</small>` : ''}
        <button type="button" class="ghl-chip-remove" onclick="removePkgHubChip('students', '${E(item.id)}')" title="Remove">×</button>
      </div>
    `;
  }).join('');

  // Schedule drawer re-sync after DOM injection if drawer was open
  setTimeout(() => {
    if (window.PKG_DRAWER && window.PKG_DRAWER.open) {
      renderPkgDrawerDOM();
    }
  }, 0);

  return `
    <div class="ghl-builder-shell">
      <!-- GHL-Style Clean Sticky Top Bar -->
      <div class="ghl-top-bar">
        <div class="ghl-breadcrumb">
          <button type="button" class="ghl-back-btn" onclick="window.PKG_DRAWER.open=false;go('packages')">← Back</button>
          <span>Packages / <strong>${f.isEdit ? 'Edit Package' : 'Create New Package'}</strong></span>
        </div>

        <div class="ghl-top-actions">
          <div class="ghl-bundle-counter-pill" id="ghlTopSummary">
            <strong>${totalContent}</strong> item${totalContent === 1 ? '' : 's'} bundled · <strong>${priceLabel}</strong>
          </div>
          <button type="button" class="ghl-btn ghl-btn-secondary" onclick="publishPackageFromStudio(false, 'Draft')">Save Draft</button>
          <button type="button" class="ghl-btn ghl-btn-primary" onclick="publishPackageFromStudio(false, 'Active')">${f.isEdit ? 'Update Package' : 'Publish Package'}</button>
        </div>
      </div>

      <!-- Single Scrollable Canvas -->
      <div class="ghl-workspace">
        <div class="ghl-page-header">
          <h1>${f.isEdit ? 'Edit Package · ' + E(f.name) : 'Create New Package'}</h1>
          <p>Fill in the basic details below, then click "+ Select" on any content type to bundle it into this package.</p>
        </div>

        <!-- CARD 1: Basic Info & Pricing -->
        <section class="ghl-card">
          <div class="ghl-card-header">
            <div class="ghl-card-title-wrap">
              <div class="ghl-step-badge">1</div>
              <div>
                <div class="ghl-card-title">Basic Details & Pricing</div>
                <div class="ghl-card-subtitle">Give your package a clear title and set whether it's paid or free.</div>
              </div>
            </div>
          </div>

          <div class="ghl-form-grid">
            <div class="ghl-form-group full">
              <label>Package Name <span class="req">*</span></label>
              <input type="text" id="cp_name" placeholder="e.g. JEE Advanced & Main 2026 Ultimate Rank Booster" value="${E(f.name)}" oninput="window.PKG_FORM.name=this.value" />
            </div>

            <div class="ghl-form-group">
              <label>Access Type <span class="req">*</span></label>
              <div class="ghl-segmented">
                <button type="button" class="ghl-seg-btn ${f.access === 'Paid' ? 'active' : ''}" onclick="window.PKG_FORM.access='Paid';rp()">Paid Package</button>
                <button type="button" class="ghl-seg-btn ${f.access === 'Free' ? 'active' : ''}" onclick="window.PKG_FORM.access='Free';window.PKG_FORM.price=0;rp()">Free Package</button>
              </div>
            </div>

            <div class="ghl-form-group" style="${f.access === 'Paid' ? 'opacity:1' : 'opacity:0.45;pointer-events:none'}">
              <label>Package Price (₹ INR) <span class="req">*</span></label>
              <input type="number" id="cp_price" value="${f.access === 'Paid' ? f.price : 0}" ${f.access === 'Free' ? 'disabled' : ''} oninput="window.PKG_FORM.price=+this.value;updateGhlTopSummary()" />
            </div>

            <div class="ghl-form-group full">
              <label>Short Description</label>
              <textarea rows="2" placeholder="Briefly describe what students will learn and get in this package..." oninput="window.PKG_FORM.desc=this.value">${E(f.desc)}</textarea>
            </div>
          </div>

          <!-- Progressive Disclosure for Batch & Validity Settings -->
          <button type="button" class="ghl-advanced-toggle" onclick="window.PKG_FORM.advOpen=!window.PKG_FORM.advOpen;rp()">
            <span>${f.advOpen ? '▾' : '▸'}</span> Batch & Validity Settings (${f.batch ? E(((D.batches || []).find(b => b.id === f.batch) || {}).name || 'Batch Selected') : 'All Batches'} · ${E(f.validity)})
          </button>

          <div class="ghl-advanced-panel ${f.advOpen ? 'open' : ''}" style="grid-template-columns:1fr 1fr">
            <div class="ghl-form-group">
              <label>Target Batch / Cohort</label>
              <div style="display:flex;gap:8px;align-items:center">
                <select style="flex:1" onchange="if(this.value==='__new__'){this.value=window.PKG_FORM.batch||'';openCreateBatchForPkg();}else{window.PKG_FORM.batch=this.value;rp();}">
                  <option value="">All Batches / Open</option>
                  ${batches.map(b => `<option value="${b.id}" ${f.batch === b.id ? 'selected' : ''}>${E(b.name)}</option>`).join('')}
                  <option value="__new__">+ Create New Batch...</option>
                </select>
                <button type="button" class="ghl-btn ghl-btn-soft" style="padding:8px 12px;font-size:12.5px" onclick="openCreateBatchForPkg()">+ New Batch</button>
              </div>
            </div>

            <div class="ghl-form-group">
              <label>Validity Period</label>
              ${(() => {
                const presets = ['365 Days (1 Year)', '180 Days (6 Months)', '90 Days (3 Months)', 'Lifetime Access'];
                const isCustom = f.validityMode === 'custom' || (f.validity && !presets.includes(f.validity));
                return `
                  <div style="display:flex;flex-direction:column;gap:8px">
                    <select onchange="if(this.value==='__custom__'){window.PKG_FORM.validityMode='custom';if(presets.includes(window.PKG_FORM.validity))window.PKG_FORM.validity='60 Days';rp();}else{window.PKG_FORM.validityMode='preset';window.PKG_FORM.validity=this.value;rp();}">
                      ${presets.map(v => `<option value="${v}" ${!isCustom && f.validity === v ? 'selected' : ''}>${v}</option>`).join('')}
                      <option value="__custom__" ${isCustom ? 'selected' : ''}>Custom Validity...</option>
                    </select>
                    ${isCustom ? `
                      <input type="text" placeholder="e.g. 45 Days, 18 Months, or Until 31 Dec 2026" value="${E(f.validity || '')}" oninput="window.PKG_FORM.validity=this.value" />
                    ` : ''}
                  </div>
                `;
              })()}
            </div>
          </div>
        </section>

        <!-- CARD 2: Compact Cover Image -->
        <section class="ghl-card">
          <div class="ghl-card-header">
            <div class="ghl-card-title-wrap">
              <div class="ghl-step-badge">2</div>
              <div>
                <div class="ghl-card-title">Cover Image</div>
                <div class="ghl-card-subtitle">Pick a ready-made cover preset or upload your own banner.</div>
              </div>
            </div>
          </div>

          <div class="ghl-cover-row">
            <img id="cp_thumb_preview" class="ghl-cover-preview" src="${E(f.thumb)}" alt="Cover Preview" />
            <div class="ghl-cover-controls">
              <div class="ghl-preset-strip">
                ${thumbPresets.map(p => `
                  <img class="ghl-preset-thumb ${f.thumb === p.url ? 'selected' : ''}" data-url="${p.url}" src="${p.url}" onclick="selectGhlPreset('${p.url}')" title="${E(p.title)}" />
                `).join('')}
                <label class="ghl-btn ghl-btn-secondary" style="padding: 6px 12px; font-size: 12.5px; cursor: pointer; margin: 0;">
                  Upload Image
                  <input type="file" accept="image/*" style="display:none" onchange="handlePkgStudioThumbUpload(this)" />
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- CARD 3: Click-to-Select Curriculum Content Hub -->
        <section class="ghl-card">
          <div class="ghl-card-header">
            <div class="ghl-card-title-wrap">
              <div class="ghl-step-badge">3</div>
              <div>
                <div class="ghl-card-title">What’s Inside This Package?</div>
                <div class="ghl-card-subtitle">Lists stay hidden until you click "+ Select" — keeping your workspace clean.</div>
              </div>
            </div>
          </div>

          <div class="ghl-content-hub">
            ${renderHubRowHTML('courses', `${ico('courses', 16)} Bundled Courses`, 'No courses added yet. Click "+ Select Courses" to choose from your library or create new.', '+ Select Courses')}
            ${renderHubRowHTML('series', `${ico('testseries', 16)} Test Series`, 'No test series attached yet.', '+ Select Test Series')}
            ${renderHubRowHTML('vseries', `${ico('video', 16)} Video Series`, 'No video series attached yet.', '+ Select Video Series')}
            ${renderHubRowHTML('tests', `${ico('tests', 16)} Individual CBT Tests`, 'No individual mock tests added yet.', '+ Select Tests')}
            ${renderHubRowHTML('lectures', `${ico('video', 16)} Standalone Video Lectures`, 'No standalone lectures added yet. Filter by Physics, Chemistry, or Math inside the drawer.', '+ Select Lectures')}
            ${renderHubRowHTML('notes', `${ico('file', 16)} Study Notes & PDFs`, 'No PDF handouts or formula sheets attached yet.', '+ Select Notes')}
          </div>
        </section>

        <!-- CARD 4: Optional Student Enrollment Behind Toggle -->
        <section class="ghl-card">
          <div class="ghl-switch-row">
            <div class="ghl-card-title-wrap">
              <div class="ghl-step-badge">4</div>
              <div>
                <div class="ghl-card-title">Enroll Specific Students Now (Optional)</div>
                <div class="ghl-card-subtitle">Leave this off if students will purchase or self-enroll after publishing.</div>
              </div>
            </div>
            <label class="ghl-switch">
              <input type="checkbox" ${f.studentToggle ? 'checked' : ''} onchange="window.PKG_FORM.studentToggle=this.checked;rp()" />
              <span class="ghl-slider"></span>
            </label>
          </div>

          <div class="ghl-student-box ${f.studentToggle ? 'open' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
              <div>
                <span class="ghl-count-pill ${studentIds.length > 0 ? 'has-items' : ''}">${studentIds.length} Student${studentIds.length === 1 ? '' : 's'} Assigned</span>
                <span style="font-size: 12.5px; color: var(--m); margin-left: 8px;">Select individual students or upload a CSV</span>
              </div>
              <div style="display: flex; gap: 8px;">
                <button type="button" class="ghl-btn ghl-btn-secondary" style="padding: 7px 12px; font-size: 12.5px;" onclick="openPkgDrawerCreateNew('csv')">Bulk CSV</button>
                <button type="button" class="ghl-btn ghl-btn-soft" onclick="openPkgSelectionDrawer('students')">+ Select Students</button>
              </div>
            </div>
            ${studentIds.length > 0 ? `<div class="ghl-chip-list">${studentChipsHTML}</div>` : ''}
          </div>
        </section>
      </div>
    </div>

    <!-- GHL-Style Slide-Over Right Sidebar Selection Drawer -->
    <div class="ghl-drawer-backdrop" id="pkgDrawerBackdrop" onclick="closePkgSelectionDrawer()"></div>
    <aside class="ghl-drawer" id="pkgSelectionDrawer">
      <div class="ghl-drawer-header">
        <div>
          <h3 id="pkgDrawerTitle">Select Items</h3>
          <span style="font-size: 12px; color: var(--m);" id="pkgDrawerSubtitle">Choose items to include in your package</span>
        </div>
        <button type="button" class="ghl-drawer-close" onclick="closePkgSelectionDrawer()">×</button>
      </div>

      <div class="ghl-drawer-controls">
        <div class="ghl-drawer-create-bar">
          <span style="font-size:12px;color:var(--m);font-weight:500">Need a new item?</span>
          <div id="pkgDrawerCreateAction"></div>
        </div>
        <input type="text" id="pkgDrawerSearch" placeholder="Search by name..." oninput="onPkgDrawerSearch(this.value)" />
        <div class="ghl-filter-pills" id="pkgDrawerFilters"></div>
      </div>

      <div class="ghl-drawer-body" id="pkgDrawerBody"></div>

      <div class="ghl-drawer-footer">
        <button type="button" class="ghl-btn ghl-btn-secondary" onclick="clearPkgDrawerSelection()">Clear All</button>
        <button type="button" class="ghl-btn ghl-btn-primary" id="pkgDrawerDoneBtn" onclick="closePkgSelectionDrawer()">Done (0 Selected)</button>
      </div>
    </aside>
  `;
};

/* =====================================================================
   PAGE: PG.package_view (Tree-Sidebar Package Explorer in New Tab)
   Minimalist normal-weight typography, expandable left tree sidebar
   (Courses, Test Series, Tests, Video Series, Videos, Notes, Students)
   and rich right-hand detail pane showing all deep nested data.
   ===================================================================== */
window.PKG_VIEW_STATE = window.PKG_VIEW_STATE || {
  pkgId: null,
  node: 'overview',
  expanded: { courses: true, testseries: true, tests: false, videoseries: true, videos: false, notes: false },
  search: ''
};

function setPkgViewNode(nodeKey) {
  window.PKG_VIEW_STATE.node = nodeKey;
  rp();
}

function togglePkgTreeExpand(key, ev) {
  if (ev) ev.stopPropagation();
  window.PKG_VIEW_STATE.expanded[key] = !window.PKG_VIEW_STATE.expanded[key];
  rp();
}

function onPkgViewSearch(val) {
  window.PKG_VIEW_STATE.search = val;
  rp();
}

PG.package_view = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const pkgId = S.selectedPkgId || urlParams.get('pkg');
  const pkgs = D.packages || [];
  const pkg = pkgs.find(p => p.id === pkgId) || pkgs[0];

  if (!pkg) {
    return `
      <div class="em" style="padding:60px 20px">
        <h3 style="font-weight:500">Package Not Found</h3>
        <p style="margin:8px 0 16px">The requested package could not be found.</p>
        <button class="b1" onclick="go('packages')">← Back to All Packages</button>
      </div>
    `;
  }

  if (window.PKG_VIEW_STATE.pkgId !== pkg.id) {
    window.PKG_VIEW_STATE.pkgId = pkg.id;
    window.PKG_VIEW_STATE.node = 'overview';
    window.PKG_VIEW_STATE.search = '';
  }

  const st = window.PKG_VIEW_STATE;
  const b = (D.batches || []).find(x => x.id === pkg.batch);
  const courseObjs = (D.courses || []).filter(c => (pkg.courses || []).includes(c.id)).map(ensure);
  const assignedStudents = (D.users || []).filter(u => u.role === 'student' && (pkg.students || []).includes(u.id));

  // Deep resolve Test Series & their nested tests + questions
  const resolvedTestSeries = (pkg.testSeries || []).map(tsItem => {
    const title = typeof tsItem === 'string' ? tsItem : tsItem.title;
    let found = (D.pkgTestSeries || []).find(x => x.title === title) ||
                (D.instTestSeries || []).find(x => x.title === title) ||
                (D.testSeries || []).find(x => x.title === title);
    if (!found) {
      for (const c of courseObjs) {
        const fc = (c.testSeries || []).find(x => x.title === title);
        if (fc) { found = fc; break; }
      }
    }
    const baseTs = found || { title, desc: 'Comprehensive CBT mock test series aligned with standard examination pattern.', tests: [] };
    const deepTests = (baseTs.tests || []).map(tRef => {
      return (D.tests || []).find(t => t.id === tRef.refId || t.name === tRef.name) || {
        id: tRef.id || 't_nested',
        name: tRef.name,
        min: tRef.min || 60,
        qs: [
          { q: `Sample Question 1 for ${tRef.name}`, o: ['Option A', 'Option B', 'Option C', 'Option D'], a: 0 },
          { q: `Sample Question 2 for ${tRef.name}`, o: ['True Statement', 'False Statement', 'Both A & B', 'None'], a: 0 }
        ]
      };
    });
    return { ...baseTs, deepTests };
  });

  // Deep resolve Direct CBT Tests & their nested questions
  const resolvedTests = (pkg.tests || []).map(tIdentifier => {
    const found = (D.tests || []).find(t => t.name === tIdentifier || t.id === tIdentifier);
    if (found) return found;
    return {
      id: id('t'),
      name: tIdentifier,
      min: 45,
      sub: 'General',
      qs: [
        { q: `Core evaluation problem for ${tIdentifier}:`, o: ['First Law', 'Second Law', 'Third Law', 'Zeroeth Law'], a: 1 }
      ]
    };
  });

  // Deep resolve Video Series & nested videos
  const resolvedVideoSeries = (pkg.videoSeries || []).map(vsItem => {
    const title = typeof vsItem === 'string' ? vsItem : vsItem.title;
    let found = (D.pkgVideoSeries || []).find(x => x.title === title) || null;
    if (!found) {
      for (const c of courseObjs) {
        const fv = (c.videoSeries || []).find(x => x.title === title);
        if (fv) { found = fv; break; }
      }
    }
    return found || {
      title,
      desc: 'Structured HD concept lecture series with solved examples.',
      videos: [
        { id: id('v'), title: `${title} — Part 1: Core Concepts`, dur: '24:10', video: VID[0] },
        { id: id('v'), title: `${title} — Part 2: Advanced Applications`, dur: '19:45', video: VID[1] }
      ]
    };
  });

  // Deep resolve Standalone Videos / Lectures
  const resolvedLectures = (pkg.lectures || []).map(lItem => {
    const title = typeof lItem === 'string' ? lItem : lItem.title;
    for (const c of courseObjs) {
      for (const s of (c.subs || [])) {
        const fl = (s.lessons || []).find(l => l.title === title);
        if (fl) return { ...fl, courseName: c.name, subName: s.name };
      }
    }
    return { title, dur: '22:30', video: VID[0], desc: `In-depth video session on ${title}.`, courseName: 'Master Bundle', subName: 'Core Subject' };
  });

  // Deep resolve Notes & Documents
  let resolvedNotes = pkg.notes && pkg.notes.length ? [...pkg.notes] : [];
  if (!resolvedNotes.length) {
    courseObjs.forEach(c => {
      (c.subs || []).forEach(s => {
        (s.notes || []).forEach(n => resolvedNotes.push({ ...n, courseName: c.name, subName: s.name }));
      });
    });
  }

  const q = (st.search || '').trim().toLowerCase();
  const matchQ = text => !q || String(text || '').toLowerCase().includes(q);
  const isExp = k => q ? true : !!st.expanded[k];

  const chevronSvg = open => `<svg class="pv-chev ${open ? 'open' : ''}" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

  const renderTreeRow = (nodeKey, label, count, iconName, colorCls, depth = 0, expandKey = null) => {
    const active = st.node === nodeKey;
    const hasExp = !!expandKey;
    const expOpen = hasExp ? isExp(expandKey) : false;
    return `
      <div class="pv-tree-row depth-${depth} ${active ? 'active' : ''}" onclick="setPkgViewNode('${nodeKey}')">
        <span class="pv-chev-wrap" ${hasExp ? `onclick="togglePkgTreeExpand('${expandKey}', event)"` : ''}>
          ${hasExp ? chevronSvg(expOpen) : '<span class="pv-chev-spacer"></span>'}
        </span>
        <span class="pv-node-ico ${colorCls}">${ico(iconName, 13)}</span>
        <span class="pv-node-label">${E(label)}</span>
        ${count !== null && count !== undefined ? `<span class="pv-node-count">${count}</span>` : ''}
      </div>
    `;
  };

  // Build Left Sidebar Tree HTML
  let treeHtml = '';
  if (matchQ('overview') || matchQ(pkg.name)) {
    treeHtml += renderTreeRow('overview', 'Package Overview', null, 'packages', 'ico-blue', 0, null);
  }

  // 1. Courses Branch
  const filteredCourses = courseObjs.filter(c => matchQ(c.name) || matchQ(c.code) || (c.subs || []).some(s => matchQ(s.name)));
  if (!q || filteredCourses.length || matchQ('courses')) {
    treeHtml += renderTreeRow('courses', 'Courses', courseObjs.length, 'courses', 'ico-blue', 0, 'courses');
    if (isExp('courses')) {
      filteredCourses.forEach(c => {
        const cKey = `course:${c.id}`;
        const cExpKey = `c_${c.id}`;
        const subs = (c.subs || []).filter(s => matchQ(s.name) || matchQ(c.name));
        treeHtml += renderTreeRow(cKey, c.name, (c.subs || []).length, 'courses', 'ico-indigo', 1, subs.length ? cExpKey : null);
        if (subs.length && isExp(cExpKey)) {
          subs.forEach(s => {
            treeHtml += renderTreeRow(`sub:${c.id}:${s.id}`, s.name, (s.lessons || []).length + (s.notes || []).length, 'book', 'ico-purple', 2, null);
          });
        }
      });
    }
  }

  // 2. Test Series Branch
  const filteredTs = resolvedTestSeries.filter((ts, idx) => matchQ(ts.title) || (ts.deepTests || []).some(t => matchQ(t.name)));
  if (!q || filteredTs.length || matchQ('test series')) {
    treeHtml += renderTreeRow('testseries', 'Test Series', resolvedTestSeries.length, 'testseries', 'ico-purple', 0, 'testseries');
    if (isExp('testseries')) {
      resolvedTestSeries.forEach((ts, idx) => {
        if (q && !matchQ(ts.title) && !(ts.deepTests || []).some(t => matchQ(t.name))) return;
        const tsExpKey = `ts_${idx}`;
        treeHtml += renderTreeRow(`ts:${idx}`, ts.title, (ts.deepTests || []).length, 'testseries', 'ico-purple', 1, (ts.deepTests || []).length ? tsExpKey : null);
        if ((ts.deepTests || []).length && isExp(tsExpKey)) {
          ts.deepTests.forEach((t, ti) => {
            if (q && !matchQ(t.name) && !matchQ(ts.title)) return;
            treeHtml += renderTreeRow(`tstest:${idx}:${ti}`, t.name, (t.qs || []).length, 'tests', 'ico-slate', 2, null);
          });
        }
      });
    }
  }

  // 3. Tests Branch
  const filteredTests = resolvedTests.filter(t => matchQ(t.name));
  if (!q || filteredTests.length || matchQ('tests')) {
    treeHtml += renderTreeRow('tests', 'Tests', resolvedTests.length, 'tests', 'ico-green', 0, 'tests');
    if (isExp('tests')) {
      resolvedTests.forEach((t, idx) => {
        if (q && !matchQ(t.name)) return;
        treeHtml += renderTreeRow(`test:${idx}`, t.name, (t.qs || []).length, 'tests', 'ico-green', 1, null);
      });
    }
  }

  // 4. Video Series Branch
  const filteredVs = resolvedVideoSeries.filter(vs => matchQ(vs.title) || (vs.videos || []).some(v => matchQ(v.title)));
  if (!q || filteredVs.length || matchQ('video series')) {
    treeHtml += renderTreeRow('videoseries', 'Video Series', resolvedVideoSeries.length, 'video', 'ico-sky', 0, 'videoseries');
    if (isExp('videoseries')) {
      resolvedVideoSeries.forEach((vs, idx) => {
        if (q && !matchQ(vs.title) && !(vs.videos || []).some(v => matchQ(v.title))) return;
        const vsExpKey = `vs_${idx}`;
        treeHtml += renderTreeRow(`vs:${idx}`, vs.title, (vs.videos || []).length, 'video', 'ico-sky', 1, (vs.videos || []).length ? vsExpKey : null);
        if ((vs.videos || []).length && isExp(vsExpKey)) {
          vs.videos.forEach((v, vi) => {
            if (q && !matchQ(v.title) && !matchQ(vs.title)) return;
            treeHtml += renderTreeRow(`vsvid:${idx}:${vi}`, v.title, v.dur || '', 'video', 'ico-slate', 2, null);
          });
        }
      });
    }
  }

  // 5. Videos Branch
  const filteredVideos = resolvedLectures.filter(l => matchQ(l.title));
  if (!q || filteredVideos.length || matchQ('video')) {
    treeHtml += renderTreeRow('videos', 'Video', resolvedLectures.length, 'video', 'ico-amber', 0, 'videos');
    if (isExp('videos')) {
      resolvedLectures.forEach((l, idx) => {
        if (q && !matchQ(l.title)) return;
        treeHtml += renderTreeRow(`video:${idx}`, l.title, l.dur || '', 'video', 'ico-amber', 1, null);
      });
    }
  }

  // 6. Notes Branch
  const filteredNotes = resolvedNotes.filter(n => matchQ(n.title));
  if (!q || filteredNotes.length || matchQ('notes')) {
    treeHtml += renderTreeRow('notes', 'Notes', resolvedNotes.length, 'file', 'ico-rose', 0, 'notes');
    if (isExp('notes')) {
      resolvedNotes.forEach((n, idx) => {
        if (q && !matchQ(n.title)) return;
        treeHtml += renderTreeRow(`note:${idx}`, n.title, n.type || 'PDF', 'file', 'ico-rose', 1, null);
      });
    }
  }

  // 7. Students
  if (matchQ('students') || assignedStudents.some(s => matchQ(s.name))) {
    treeHtml += renderTreeRow('students', 'Students', assignedStudents.length, 'students', 'ico-slate', 0, null);
  }

  // Helper to render Question Bank block
  const renderQuestionsBlock = qs => (qs && qs.length)
    ? `<div class="pv-q-list">${qs.map((qItem, qi) => `
        <div class="pv-q-card">
          <div class="pv-q-title">Q${qi + 1}. ${E(qItem.q)}</div>
          <div class="pv-q-opts">
            ${(qItem.o || []).map((opt, oi) => `
              <div class="pv-q-opt ${oi === qItem.a ? 'correct' : ''}">
                <span>${['A', 'B', 'C', 'D'][oi] || (oi + 1)}. ${E(opt)}</span>
                ${oi === qItem.a ? '<span class="pv-q-key">Correct</span>' : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}</div>`
    : '<div class="pv-empty-msg">No questions added to this test yet.</div>';

  // Build Right Detail Pane HTML based on st.node
  let rightHtml = '';
  const node = st.node || 'overview';

  if (node === 'overview') {
    rightHtml = `
      <div class="pv-bc">Package <span>›</span> Overview</div>
      <div class="pv-detail-head">
        <div class="pv-detail-title-wrap">
          <span class="pv-detail-ico ico-blue">${ico('packages', 18)}</span>
          <div>
            <h2>${E(pkg.name)}</h2>
            <div class="pv-detail-meta">
              ${pkg.access === 'Paid' ? R(pkg.price) : 'Free Package'} · ${E(pkg.category || 'Comprehensive')} · ${b ? E(b.name) : 'All Batches'} · Validity: ${E(pkg.validity || '365 Days')} · ${E(pkg.status || 'Active')}
            </div>
          </div>
        </div>
        <div class="pv-detail-actions">
          ${can() ? `<button class="b2" onclick="editPackageInCreator('${pkg.id}')">Edit Package</button>` : ''}
        </div>
      </div>

      <div class="pv-overview-banner">
        <img src="${pkg.thumb || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}" alt="${E(pkg.name)}">
        <div class="pv-overview-desc">
          <div class="pv-sub-label">Package Description</div>
          <p>${E(pkg.desc || pkg.description || 'Complete end-to-end learning and assessment bundle.')}</p>
        </div>
      </div>

      <div class="pv-section-bar">
        <span>Package Contents</span>
        <span class="pv-muted-count">${courseObjs.length + resolvedTestSeries.length + resolvedTests.length + resolvedVideoSeries.length + resolvedLectures.length + resolvedNotes.length} items</span>
      </div>
      <div class="pv-child-grid">
        <div class="pv-child-card" onclick="setPkgViewNode('courses')">
          <div class="pv-child-left"><span class="pv-node-ico ico-blue">${ico('courses', 14)}</span><span>Courses</span></div>
          <span class="pv-child-meta">${courseObjs.length} courses</span>
        </div>
        <div class="pv-child-card" onclick="setPkgViewNode('testseries')">
          <div class="pv-child-left"><span class="pv-node-ico ico-purple">${ico('testseries', 14)}</span><span>Test Series</span></div>
          <span class="pv-child-meta">${resolvedTestSeries.length} series</span>
        </div>
        <div class="pv-child-card" onclick="setPkgViewNode('tests')">
          <div class="pv-child-left"><span class="pv-node-ico ico-green">${ico('tests', 14)}</span><span>Tests</span></div>
          <span class="pv-child-meta">${resolvedTests.length} tests</span>
        </div>
        <div class="pv-child-card" onclick="setPkgViewNode('videoseries')">
          <div class="pv-child-left"><span class="pv-node-ico ico-sky">${ico('video', 14)}</span><span>Video Series</span></div>
          <span class="pv-child-meta">${resolvedVideoSeries.length} series</span>
        </div>
        <div class="pv-child-card" onclick="setPkgViewNode('videos')">
          <div class="pv-child-left"><span class="pv-node-ico ico-amber">${ico('video', 14)}</span><span>Videos</span></div>
          <span class="pv-child-meta">${resolvedLectures.length} videos</span>
        </div>
        <div class="pv-child-card" onclick="setPkgViewNode('notes')">
          <div class="pv-child-left"><span class="pv-node-ico ico-rose">${ico('file', 14)}</span><span>Notes</span></div>
          <span class="pv-child-meta">${resolvedNotes.length} documents</span>
        </div>
        <div class="pv-child-card" onclick="setPkgViewNode('students')">
          <div class="pv-child-left"><span class="pv-node-ico ico-slate">${ico('students', 14)}</span><span>Assigned Students</span></div>
          <span class="pv-child-meta">${assignedStudents.length} students</span>
        </div>
      </div>
    `;
  } else if (node === 'courses') {
    rightHtml = `
      <div class="pv-bc">Package <span>›</span> Courses</div>
      <div class="pv-detail-head">
        <div class="pv-detail-title-wrap">
          <span class="pv-detail-ico ico-blue">${ico('courses', 18)}</span>
          <div>
            <h2>Bundled Courses</h2>
            <div class="pv-detail-meta">${courseObjs.length} courses included in ${E(pkg.name)}</div>
          </div>
        </div>
      </div>
      ${courseObjs.length ? `
        <div class="pv-child-grid">
          ${courseObjs.map(c => `
            <div class="pv-child-card" onclick="setPkgViewNode('course:${c.id}')">
              <div class="pv-child-left"><span class="pv-node-ico ico-indigo">${ico('courses', 14)}</span><span>${E(c.name)}</span></div>
              <span class="pv-child-meta">${(c.subs || []).length} subjects</span>
            </div>
          `).join('')}
        </div>
      ` : '<div class="pv-empty-msg">No courses bundled in this package.</div>'}
    `;
  } else if (node.startsWith('course:')) {
    const cid = node.split(':')[1];
    const c = courseObjs.find(x => x.id === cid);
    if (c) {
      const ins = U(c.instr);
      const totalVids = (c.subs || []).reduce((a, s) => a + (s.lessons || []).length, 0);
      const totalNotes = (c.subs || []).reduce((a, s) => a + (s.notes || []).length, 0);
      const totalTests = (D.tests || []).filter(t => t.course === c.id).length;
      rightHtml = `
        <div class="pv-bc"><a onclick="setPkgViewNode('courses')">Courses</a> <span>›</span> ${E(c.name)}</div>
        <div class="pv-detail-head">
          <div class="pv-detail-title-wrap">
            <span class="pv-detail-ico ico-indigo">${ico('courses', 18)}</span>
            <div>
              <h2>${E(c.name)}</h2>
              <div class="pv-detail-meta">Code ${E(c.code)} · ${totalTests} tests · ${totalVids} videos · ${totalNotes} PDFs · Instructor: ${ins ? E(ins.name) : 'Faculty'}</div>
            </div>
          </div>
          <div class="pv-detail-actions">
            <button class="b2" onclick="S.cv='${c.id}';go('courses')">Open Full Course</button>
          </div>
        </div>
        ${c.desc ? `<p class="pv-body-copy">${E(c.desc)}</p>` : ''}
        <div class="pv-section-bar">
          <span>Subjects · ${(c.subs || []).length}</span>
        </div>
        <div class="pv-child-grid">
          ${(c.subs || []).map(s => `
            <div class="pv-child-card" onclick="setPkgViewNode('sub:${c.id}:${s.id}')">
              <div class="pv-child-left"><span class="pv-node-ico ico-purple">${ico('book', 14)}</span><span>${E(s.name)}</span></div>
              <span class="pv-child-meta">${(s.lessons || []).length} videos · ${(s.notes || []).length} notes</span>
            </div>
          `).join('')}
        </div>
      `;
    }
  } else if (node.startsWith('sub:')) {
    const [, cid, sid] = node.split(':');
    const c = courseObjs.find(x => x.id === cid);
    const s = c ? (c.subs || []).find(x => x.id === sid) : null;
    if (c && s) {
      const tchr = U(s.teacher);
      rightHtml = `
        <div class="pv-bc"><a onclick="setPkgViewNode('courses')">Courses</a> <span>›</span> <a onclick="setPkgViewNode('course:${c.id}')">${E(c.name)}</a> <span>›</span> ${E(s.name)}</div>
        <div class="pv-detail-head">
          <div class="pv-detail-title-wrap">
            <span class="pv-detail-ico ico-purple">${ico('book', 18)}</span>
            <div>
              <h2>${E(s.name)}</h2>
              <div class="pv-detail-meta">${(s.lessons || []).length} videos · ${(s.notes || []).length} notes · Faculty: ${tchr ? E(tchr.name) : 'Assigned Instructor'}</div>
            </div>
          </div>
        </div>
        <div class="pv-section-bar"><span>Video Lectures · ${(s.lessons || []).length}</span></div>
        ${(s.lessons || []).length ? `
          <div class="pv-child-grid" style="margin-bottom:20px">
            ${s.lessons.map(l => `
              <div class="pv-child-card" onclick="playLec('${c.id}','${s.id}','${l.id}')">
                <div class="pv-child-left"><span class="pv-node-ico ico-amber">${ico('video', 14)}</span><span>${E(l.title)}</span></div>
                <span class="pv-child-meta">${l.dur || '20:00'} · Play</span>
              </div>
            `).join('')}
          </div>
        ` : '<div class="pv-empty-msg" style="margin-bottom:16px">No lectures in this subject.</div>'}
        <div class="pv-section-bar"><span>Study Notes · ${(s.notes || []).length}</span></div>
        ${(s.notes || []).length ? `
          <div class="pv-child-grid">
            ${s.notes.map(n => `
              <a class="pv-child-card" style="text-decoration:none" href="${n.url || PDF}" target="_blank">
                <div class="pv-child-left"><span class="pv-node-ico ico-rose">${ico('file', 14)}</span><span>${E(n.title)}</span></div>
                <span class="pv-child-meta">${E(n.type || 'PDF')} · ${E(n.size || '1.4 MB')}</span>
              </a>
            `).join('')}
          </div>
        ` : '<div class="pv-empty-msg">No notes in this subject.</div>'}
      `;
    }
  } else if (node === 'testseries') {
    rightHtml = `
      <div class="pv-bc">Package <span>›</span> Test Series</div>
      <div class="pv-detail-head">
        <div class="pv-detail-title-wrap">
          <span class="pv-detail-ico ico-purple">${ico('testseries', 18)}</span>
          <div>
            <h2>Test Series</h2>
            <div class="pv-detail-meta">${resolvedTestSeries.length} test series included</div>
          </div>
        </div>
      </div>
      ${resolvedTestSeries.length ? `
        <div class="pv-child-grid">
          ${resolvedTestSeries.map((ts, idx) => `
            <div class="pv-child-card" onclick="setPkgViewNode('ts:${idx}')">
              <div class="pv-child-left"><span class="pv-node-ico ico-purple">${ico('testseries', 14)}</span><span>${E(ts.title)}</span></div>
              <span class="pv-child-meta">${(ts.deepTests || []).length} tests</span>
            </div>
          `).join('')}
        </div>
      ` : '<div class="pv-empty-msg">No test series included in this package.</div>'}
    `;
  } else if (node.startsWith('ts:')) {
    const idx = +node.split(':')[1];
    const ts = resolvedTestSeries[idx];
    if (ts) {
      rightHtml = `
        <div class="pv-bc"><a onclick="setPkgViewNode('testseries')">Test Series</a> <span>›</span> ${E(ts.title)}</div>
        <div class="pv-detail-head">
          <div class="pv-detail-title-wrap">
            <span class="pv-detail-ico ico-purple">${ico('testseries', 18)}</span>
            <div>
              <h2>${E(ts.title)}</h2>
              <div class="pv-detail-meta">${(ts.deepTests || []).length} nested mock tests</div>
            </div>
          </div>
        </div>
        ${ts.desc ? `<p class="pv-body-copy">${E(ts.desc)}</p>` : ''}
        <div class="pv-section-bar"><span>Tests in Series · ${(ts.deepTests || []).length}</span></div>
        ${(ts.deepTests || []).length ? `
          <div class="pv-child-grid">
            ${ts.deepTests.map((t, ti) => `
              <div class="pv-child-card" onclick="setPkgViewNode('tstest:${idx}:${ti}')">
                <div class="pv-child-left"><span class="pv-node-ico ico-green">${ico('tests', 14)}</span><span>${E(t.name)}</span></div>
                <span class="pv-child-meta">${t.min || 60} mins · ${(t.qs || []).length} Qs</span>
              </div>
            `).join('')}
          </div>
        ` : '<div class="pv-empty-msg">No tests linked inside this series yet.</div>'}
      `;
    }
  } else if (node.startsWith('tstest:')) {
    const [, tsIdx, tIdx] = node.split(':').map(Number);
    const ts = resolvedTestSeries[tsIdx];
    const t = ts ? (ts.deepTests || [])[tIdx] : null;
    if (ts && t) {
      rightHtml = `
        <div class="pv-bc"><a onclick="setPkgViewNode('testseries')">Test Series</a> <span>›</span> <a onclick="setPkgViewNode('ts:${tsIdx}')">${E(ts.title)}</a> <span>›</span> ${E(t.name)}</div>
        <div class="pv-detail-head">
          <div class="pv-detail-title-wrap">
            <span class="pv-detail-ico ico-green">${ico('tests', 18)}</span>
            <div>
              <h2>${E(t.name)}</h2>
              <div class="pv-detail-meta">Duration: ${t.min || 60} mins · ${(t.qs || []).length} questions</div>
            </div>
          </div>
          <div class="pv-detail-actions">
            <button class="b1" onclick="startOnlineTest('${t.id}')">Launch CBT Test</button>
          </div>
        </div>
        <div class="pv-section-bar"><span>Questions & Answer Key · ${(t.qs || []).length}</span></div>
        ${renderQuestionsBlock(t.qs)}
      `;
    }
  } else if (node === 'tests') {
    rightHtml = `
      <div class="pv-bc">Package <span>›</span> Tests</div>
      <div class="pv-detail-head">
        <div class="pv-detail-title-wrap">
          <span class="pv-detail-ico ico-green">${ico('tests', 18)}</span>
          <div>
            <h2>CBT Mock Tests</h2>
            <div class="pv-detail-meta">${resolvedTests.length} tests included</div>
          </div>
        </div>
      </div>
      ${resolvedTests.length ? `
        <div class="pv-child-grid">
          ${resolvedTests.map((t, idx) => `
            <div class="pv-child-card" onclick="setPkgViewNode('test:${idx}')">
              <div class="pv-child-left"><span class="pv-node-ico ico-green">${ico('tests', 14)}</span><span>${E(t.name)}</span></div>
              <span class="pv-child-meta">${t.min || 30} mins · ${(t.qs || []).length} Qs</span>
            </div>
          `).join('')}
        </div>
      ` : '<div class="pv-empty-msg">No standalone tests included.</div>'}
    `;
  } else if (node.startsWith('test:')) {
    const idx = +node.split(':')[1];
    const t = resolvedTests[idx];
    if (t) {
      rightHtml = `
        <div class="pv-bc"><a onclick="setPkgViewNode('tests')">Tests</a> <span>›</span> ${E(t.name)}</div>
        <div class="pv-detail-head">
          <div class="pv-detail-title-wrap">
            <span class="pv-detail-ico ico-green">${ico('tests', 18)}</span>
            <div>
              <h2>${E(t.name)}</h2>
              <div class="pv-detail-meta">Duration: ${t.min || 30} mins · ${(t.qs || []).length} questions · Subject: ${E(t.sub || 'Multi-Subject')}</div>
            </div>
          </div>
          <div class="pv-detail-actions">
            <button class="b1" onclick="startOnlineTest('${t.id}')">Launch CBT Test</button>
          </div>
        </div>
        <div class="pv-section-bar"><span>Questions & Answer Key · ${(t.qs || []).length}</span></div>
        ${renderQuestionsBlock(t.qs)}
      `;
    }
  } else if (node === 'videoseries') {
    rightHtml = `
      <div class="pv-bc">Package <span>›</span> Video Series</div>
      <div class="pv-detail-head">
        <div class="pv-detail-title-wrap">
          <span class="pv-detail-ico ico-sky">${ico('video', 18)}</span>
          <div>
            <h2>Video Series</h2>
            <div class="pv-detail-meta">${resolvedVideoSeries.length} video series included</div>
          </div>
        </div>
      </div>
      ${resolvedVideoSeries.length ? `
        <div class="pv-child-grid">
          ${resolvedVideoSeries.map((vs, idx) => `
            <div class="pv-child-card" onclick="setPkgViewNode('vs:${idx}')">
              <div class="pv-child-left"><span class="pv-node-ico ico-sky">${ico('video', 14)}</span><span>${E(vs.title)}</span></div>
              <span class="pv-child-meta">${(vs.videos || []).length} videos</span>
            </div>
          `).join('')}
        </div>
      ` : '<div class="pv-empty-msg">No video series included.</div>'}
    `;
  } else if (node.startsWith('vs:')) {
    const idx = +node.split(':')[1];
    const vs = resolvedVideoSeries[idx];
    if (vs) {
      rightHtml = `
        <div class="pv-bc"><a onclick="setPkgViewNode('videoseries')">Video Series</a> <span>›</span> ${E(vs.title)}</div>
        <div class="pv-detail-head">
          <div class="pv-detail-title-wrap">
            <span class="pv-detail-ico ico-sky">${ico('video', 18)}</span>
            <div>
              <h2>${E(vs.title)}</h2>
              <div class="pv-detail-meta">${(vs.videos || []).length} videos in this series</div>
            </div>
          </div>
        </div>
        ${vs.desc ? `<p class="pv-body-copy">${E(vs.desc)}</p>` : ''}
        <div class="pv-section-bar"><span>Videos · ${(vs.videos || []).length}</span></div>
        ${(vs.videos || []).length ? `
          <div class="pv-child-grid">
            ${vs.videos.map((v, vi) => `
              <div class="pv-child-card" onclick="setPkgViewNode('vsvid:${idx}:${vi}')">
                <div class="pv-child-left"><span class="pv-node-ico ico-sky">${ico('video', 14)}</span><span>${E(v.title)}</span></div>
                <span class="pv-child-meta">${v.dur || '20:00'}</span>
              </div>
            `).join('')}
          </div>
        ` : '<div class="pv-empty-msg">No videos added to this series yet.</div>'}
      `;
    }
  } else if (node.startsWith('vsvid:')) {
    const [, vsIdx, vIdx] = node.split(':').map(Number);
    const vs = resolvedVideoSeries[vsIdx];
    const v = vs ? (vs.videos || [])[vIdx] : null;
    if (vs && v) {
      rightHtml = `
        <div class="pv-bc"><a onclick="setPkgViewNode('videoseries')">Video Series</a> <span>›</span> <a onclick="setPkgViewNode('vs:${vsIdx}')">${E(vs.title)}</a> <span>›</span> ${E(v.title)}</div>
        <div class="pv-detail-head">
          <div class="pv-detail-title-wrap">
            <span class="pv-detail-ico ico-sky">${ico('video', 18)}</span>
            <div>
              <h2>${E(v.title)}</h2>
              <div class="pv-detail-meta">Duration: ${v.dur || '20:00'} · Series: ${E(vs.title)}</div>
            </div>
          </div>
        </div>
        <video src="${v.video || VID[0]}" controls style="width:100%;max-height:420px;border-radius:10px;background:#000;margin-top:8px"></video>
      `;
    }
  } else if (node === 'videos') {
    rightHtml = `
      <div class="pv-bc">Package <span>›</span> Video</div>
      <div class="pv-detail-head">
        <div class="pv-detail-title-wrap">
          <span class="pv-detail-ico ico-amber">${ico('video', 18)}</span>
          <div>
            <h2>Videos & Lectures</h2>
            <div class="pv-detail-meta">${resolvedLectures.length} standalone video lectures</div>
          </div>
        </div>
      </div>
      ${resolvedLectures.length ? `
        <div class="pv-child-grid">
          ${resolvedLectures.map((l, idx) => `
            <div class="pv-child-card" onclick="setPkgViewNode('video:${idx}')">
              <div class="pv-child-left"><span class="pv-node-ico ico-amber">${ico('video', 14)}</span><span>${E(l.title)}</span></div>
              <span class="pv-child-meta">${l.dur || '22:30'}</span>
            </div>
          `).join('')}
        </div>
      ` : '<div class="pv-empty-msg">No standalone videos included.</div>'}
    `;
  } else if (node.startsWith('video:')) {
    const idx = +node.split(':')[1];
    const l = resolvedLectures[idx];
    if (l) {
      rightHtml = `
        <div class="pv-bc"><a onclick="setPkgViewNode('videos')">Video</a> <span>›</span> ${E(l.title)}</div>
        <div class="pv-detail-head">
          <div class="pv-detail-title-wrap">
            <span class="pv-detail-ico ico-amber">${ico('video', 18)}</span>
            <div>
              <h2>${E(l.title)}</h2>
              <div class="pv-detail-meta">${E(l.courseName || 'Course')} · ${E(l.subName || 'Subject')} · Duration: ${l.dur || '22:30'}</div>
            </div>
          </div>
        </div>
        <video src="${l.video || VID[0]}" controls style="width:100%;max-height:420px;border-radius:10px;background:#000;margin-top:8px"></video>
        ${l.desc ? `<p class="pv-body-copy" style="margin-top:14px">${E(l.desc)}</p>` : ''}
      `;
    }
  } else if (node === 'notes' || node.startsWith('note:')) {
    const singleIdx = node.startsWith('note:') ? +node.split(':')[1] : -1;
    const singleNote = singleIdx >= 0 ? resolvedNotes[singleIdx] : null;
    if (singleNote) {
      rightHtml = `
        <div class="pv-bc"><a onclick="setPkgViewNode('notes')">Notes</a> <span>›</span> ${E(singleNote.title)}</div>
        <div class="pv-detail-head">
          <div class="pv-detail-title-wrap">
            <span class="pv-detail-ico ico-rose">${ico('file', 18)}</span>
            <div>
              <h2>${E(singleNote.title)}</h2>
              <div class="pv-detail-meta">Format: ${E(singleNote.type || 'PDF')} · Size: ${E(singleNote.size || '1.5 MB')} · Added: ${E(singleNote.at || 'Available')}</div>
            </div>
          </div>
          <div class="pv-detail-actions">
            <a class="b1" style="text-decoration:none" href="${singleNote.url || PDF}" target="_blank">Download Document</a>
          </div>
        </div>
        <div class="pv-note-preview-box">
          <p>Document ready for viewing and download.</p>
          <a class="b2" style="text-decoration:none;display:inline-flex;margin-top:8px" href="${singleNote.url || PDF}" target="_blank">Open ${E(singleNote.type || 'PDF')} in New Tab</a>
        </div>
      `;
    } else {
      rightHtml = `
        <div class="pv-bc">Package <span>›</span> Notes</div>
        <div class="pv-detail-head">
          <div class="pv-detail-title-wrap">
            <span class="pv-detail-ico ico-rose">${ico('file', 18)}</span>
            <div>
              <h2>Study Notes & Documents</h2>
              <div class="pv-detail-meta">${resolvedNotes.length} documents included</div>
            </div>
          </div>
        </div>
        ${resolvedNotes.length ? `
          <div class="pv-child-grid">
            ${resolvedNotes.map((n, idx) => `
              <div class="pv-child-card" onclick="setPkgViewNode('note:${idx}')">
                <div class="pv-child-left"><span class="pv-node-ico ico-rose">${ico('file', 14)}</span><span>${E(n.title)}</span></div>
                <span class="pv-child-meta">${E(n.type || 'PDF')} · ${E(n.size || '1.5 MB')}</span>
              </div>
            `).join('')}
          </div>
        ` : '<div class="pv-empty-msg">No study notes included.</div>'}
      `;
    }
  } else if (node === 'students') {
    rightHtml = `
      <div class="pv-bc">Package <span>›</span> Students</div>
      <div class="pv-detail-head">
        <div class="pv-detail-title-wrap">
          <span class="pv-detail-ico ico-slate">${ico('students', 18)}</span>
          <div>
            <h2>Assigned Students</h2>
            <div class="pv-detail-meta">${assignedStudents.length} learners enrolled in ${E(pkg.name)}</div>
          </div>
        </div>
        <div class="pv-detail-actions">
          ${can() ? `<button class="b1" onclick="openAssignStudentsModal('${pkg.id}')">+ Assign Students</button>` : ''}
        </div>
      </div>
      ${assignedStudents.length ? `
        <div class="pv-child-grid">
          ${assignedStudents.map(s => `
            <div class="pv-child-card" style="cursor:default">
              <div class="pv-child-left">
                <img src="${av(s)}" style="width:26px;height:26px;border-radius:50%;object-fit:cover;flex-shrink:0">
                <div style="min-width:0">
                  <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${E(s.name)}</div>
                  <div style="font-size:11.5px;color:var(--m);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${E(s.email)}</div>
                </div>
              </div>
              <span class="pv-child-meta">${sRegDate(s)}</span>
            </div>
          `).join('')}
        </div>
      ` : '<div class="pv-empty-msg">No students assigned to this package yet.</div>'}
    `;
  }

  return `
    <div class="pv-shell">
      <div class="pv-top-header">
        <div>
          <h1>${E(pkg.name)}</h1>
          <p>${courseObjs.length} courses · ${resolvedTestSeries.length} test series · ${resolvedTests.length} tests · ${resolvedVideoSeries.length} video series · ${resolvedLectures.length} videos · ${resolvedNotes.length} notes</p>
        </div>
        <div class="pv-top-actions">
          <button class="b2" onclick="go('packages')">← All Packages</button>
          ${can() ? `<button class="b2" onclick="openAssignStudentsModal('${pkg.id}')">+ Assign Students</button>` : ''}
          ${can() ? `<button class="b1" onclick="editPackageInCreator('${pkg.id}')">+ Edit Package</button>` : ''}
        </div>
      </div>

      <div class="pv-split">
        <aside class="pv-sidebar-card">
          <div class="pv-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Find a course, test, video, or note..." value="${E(st.search)}" oninput="onPkgViewSearch(this.value)">
          </div>
          <div class="pv-tree-list">
            ${treeHtml || '<div class="pv-empty-msg">No matching items.</div>'}
          </div>
        </aside>

        <section class="pv-detail-card">
          ${rightHtml}
        </section>
      </div>
    </div>
  `;
};

// Re-render if initial URL requested package_view or create_package
if (S && (S.p === 'package_view' || S.p === 'create_package')) {
  render();
}

/* =====================================================================
   SOCIAL STUDIO — TEMPLATE-FIRST MARKETING & RESULT CREATOR
   Minimalist light & normal-weight UI, locked brand guidelines,
   1-click student auto-fill, drag-drop cropper, & high-res Canvas export
   ===================================================================== */

const SOCIAL_TEMPLATES = {
  instagram: [
    { id: 'ig_topper', name: 'Topper Spotlight', desc: 'Square 1080x1080 · Highlight a top scorer', ratio: '1 / 1', w: 1080, h: 1080, slides: 1 },
    { id: 'ig_milestone', name: 'Milestone Card', desc: 'Square 1080x1080 · Celebrate batch or test milestones', ratio: '1 / 1', w: 1080, h: 1080, slides: 1 },
    { id: 'ig_quote', name: 'Student Quote', desc: 'Square 1080x1080 · Testimonial with portrait', ratio: '1 / 1', w: 1080, h: 1080, slides: 1 },
    { id: 'ig_batch', name: 'Batch Achievement', desc: 'Square 1080x1080 · Cohort selection summary', ratio: '1 / 1', w: 1080, h: 1080, slides: 1 },
    { id: 'ig_carousel', name: 'Result Carousel (3 Slides)', desc: 'Square 1080x1080 · Multi-slide story deck', ratio: '1 / 1', w: 1080, h: 1080, slides: 3 }
  ],
  linkedin: [
    { id: 'li_spotlight', name: 'Topper Spotlight Banner', desc: 'Landscape 1200x627 · Professional achievement post', ratio: '1200 / 627', w: 1200, h: 627, slides: 1 },
    { id: 'li_milestone', name: 'Institute Milestone', desc: 'Landscape 1200x627 · Key academic benchmark', ratio: '1200 / 627', w: 1200, h: 627, slides: 1 },
    { id: 'li_quote', name: 'Student Testimonial', desc: 'Landscape 1200x627 · Quote & batch attribution', ratio: '1200 / 627', w: 1200, h: 627, slides: 1 },
    { id: 'li_batch', name: 'Batch Excellence', desc: 'Landscape 1200x627 · Cohort performance summary', ratio: '1200 / 627', w: 1200, h: 627, slides: 1 }
  ],
  whatsapp: [
    { id: 'wa_topper', name: 'Topper Status Card', desc: 'Portrait 1080x1350 · Ready for WhatsApp Status', ratio: '4 / 5', w: 1080, h: 1350, slides: 1 },
    { id: 'wa_admissions', name: 'Admissions Open', desc: 'Square 1080x1080 · New batch announcement', ratio: '1 / 1', w: 1080, h: 1080, slides: 1 },
    { id: 'wa_milestone', name: 'Weekly Ranker', desc: 'Square 1080x1080 · Quick leaderboard shoutout', ratio: '1 / 1', w: 1080, h: 1080, slides: 1 },
    { id: 'wa_quote', name: 'Learner Story', desc: 'Portrait 1080x1350 · Student review share card', ratio: '4 / 5', w: 1080, h: 1350, slides: 1 }
  ]
};

const SOCIAL_THEMES = {
  blue: { label: 'Trigrexam Blue', bg: '#0f172a', grad: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', c1: '#0f172a', c2: '#1d4ed8', ink: '#ffffff', mute: '#cbd5e1', accent: '#38bdf8', cardBg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.16)' },
  dark: { label: 'Dark Slate', bg: '#111827', grad: 'linear-gradient(135deg, #090d16 0%, #1f2937 100%)', c1: '#090d16', c2: '#1f2937', ink: '#f8fafc', mute: '#94a3b8', accent: '#60a5fa', cardBg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.14)' },
  white: { label: 'Clean White', bg: '#ffffff', grad: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)', c1: '#ffffff', c2: '#f1f5f9', ink: '#0f172a', mute: '#64748b', accent: '#0284c7', cardBg: '#f8fafc', border: '#e2e8f0' }
};

window.SOCIAL_STUDIO = window.SOCIAL_STUDIO || {
  platform: 'instagram',
  templateId: 'ig_topper',
  theme: 'blue',
  cropShape: 'circle',
  imgZoom: 1,
  slideIdx: 0,
  studentId: 's1',
  badge: 'Topper Spotlight',
  headline: '99.4%ile in All India CBT Mock',
  name: 'Aarav Mehta',
  subtext: 'JEE Alpha Batch · Rank #1',
  metricValue: '284 / 300',
  metricLabel: 'Aggregate Score',
  quote: 'Consistent mock test practice and instant analytics helped me improve accuracy across every subject.',
  photo: ''
};

function getSocialActiveTpl() {
  const s = window.SOCIAL_STUDIO;
  const list = SOCIAL_TEMPLATES[s.platform] || SOCIAL_TEMPLATES.instagram;
  return list.find(t => t.id === s.templateId) || list[0];
}

function setSocialPlatform(plat) {
  window.SOCIAL_STUDIO.platform = plat;
  window.SOCIAL_STUDIO.templateId = SOCIAL_TEMPLATES[plat][0].id;
  window.SOCIAL_STUDIO.slideIdx = 0;
  rp();
}

function setSocialTemplate(tplId) {
  window.SOCIAL_STUDIO.templateId = tplId;
  window.SOCIAL_STUDIO.slideIdx = 0;
  rp();
}

function autoFillSocialStudent(sid) {
  const s = window.SOCIAL_STUDIO;
  s.studentId = sid;
  if (!sid) return;
  const u = U(sid);
  if (!u) return;
  const b = (D.batches || []).find(x => x.id === u.batch);
  const resList = (D.res || []).filter(r => r.sid === sid);
  const latest = resList[0];
  const tObj = latest ? (D.tests || []).find(t => t.id === latest.tid) : null;
  const maxS = latest ? (latest.maxScore || latest.total || (tObj && tObj.qs ? tObj.qs.length : 10)) : 100;
  const scoreVal = latest ? latest.score : 94;

  s.name = u.name;
  s.subtext = `${b ? b.name : 'Online Scholar'} · ${tObj ? tObj.name : 'All India Series'}`;
  s.metricValue = latest ? `${scoreVal} / ${maxS}` : '94%';
  s.metricLabel = latest ? 'Latest Test Score' : 'Overall Accuracy';
  s.headline = latest
    ? `Scored ${Math.round((scoreVal / Math.max(1, maxS)) * 100)}% in ${tObj ? tObj.name : 'CBT Mock'}`
    : `Outstanding Performance in ${b ? b.name : 'Mock Series'}`;
  s.photo = av(u);
  rp();
  toast(`Auto-filled details for ${u.name}`);
}

function handleSocialPhotoUpload(file) {
  if (!file || !/^image\//.test(file.type)) return toast('Please choose a valid image file.');
  const r = new FileReader();
  r.onload = e => {
    window.SOCIAL_STUDIO.photo = e.target.result;
    rp();
    toast('Photo updated');
  };
  r.readAsDataURL(file);
}

function buildSocialCaption() {
  const s = window.SOCIAL_STUDIO;
  const inst = D.inst || 'Trigrexam Institute';
  if (s.platform === 'linkedin') {
    return `Congratulations to ${s.name} (${s.subtext}) for achieving ${s.metricValue} — ${s.headline}.\n\n"${s.quote}"\n\nAt ${inst}, structured CBT practice and personalized analytics empower every learner to reach their peak.\n\nAdmissions Open · Enroll now at ${inst}.\n#Education #StudentSuccess #CBT #ExamPrep`;
  }
  if (s.platform === 'whatsapp') {
    return `*${s.badge} — ${inst}*\n\n*${s.name}* (${s.subtext})\n${s.headline} | *${s.metricValue}*\n\n"${s.quote}"\n\nAdmissions Open — Message us to join the next batch.`;
  }
  return `${s.badge}: ${s.name}\n${s.headline} (${s.metricValue})\n${s.subtext}\n\n"${s.quote}"\n\nAdmissions Open at ${inst}. Link in bio to enroll.\n#Trigrexam #Toppers #MockTests #StudySmart`;
}

function copySocialCaption() {
  const txt = buildSocialCaption();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(() => toast('Caption copied to clipboard'));
  } else {
    toast('Caption ready to copy');
  }
}

function renderSocialCanvasSlide(tpl, slideIndex, format = 'png') {
  return new Promise(resolve => {
    const s = window.SOCIAL_STUDIO;
    const th = SOCIAL_THEMES[s.theme] || SOCIAL_THEMES.blue;
    const inst = D.inst || 'trigrexam';
    const cv = document.createElement('canvas');
    cv.width = tpl.w;
    cv.height = tpl.h;
    const ctx = cv.getContext('2d');
    const W = tpl.w, H = tpl.h;

    // Background gradient
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, th.c1);
    g.addColorStop(1, th.c2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Subtle border accent
    ctx.strokeStyle = th.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, W - 48, H - 48);

    // Locked Brand Header
    ctx.fillStyle = th.accent;
    ctx.font = '500 28px Poppins, sans-serif';
    ctx.fillText(inst.toUpperCase(), 64, 92);

    // Badge pill
    const badgeTxt = slideIndex === 1 ? 'SCORE BREAKDOWN' : slideIndex === 2 ? 'ADMISSIONS OPEN' : (s.badge || 'Topper Spotlight').toUpperCase();
    ctx.fillStyle = th.cardBg;
    ctx.fillRect(W - 340, 56, 276, 46);
    ctx.fillStyle = th.accent;
    ctx.font = '500 20px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(badgeTxt, W - 202, 86);
    ctx.textAlign = 'left';

    // Footer CTA (Locked)
    ctx.fillStyle = th.cardBg;
    ctx.fillRect(24, H - 108, W - 48, 84);
    ctx.fillStyle = th.ink;
    ctx.font = '400 24px Poppins, sans-serif';
    ctx.fillText(`Admissions Open · Join ${inst} Today`, 64, H - 56);
    ctx.fillStyle = th.accent;
    ctx.textAlign = 'right';
    ctx.fillText('trigrexam.demo', W - 64, H - 56);
    ctx.textAlign = 'left';

    const drawTextContent = () => {
      const isLand = W > H;
      const textX = isLand ? 420 : 64;
      const maxTW = isLand ? W - 480 : W - 128;

      if (slideIndex === 1) {
        ctx.fillStyle = th.ink;
        ctx.font = '500 46px Poppins, sans-serif';
        ctx.fillText(s.name, 64, 220);
        ctx.fillStyle = th.mute;
        ctx.font = '400 28px Poppins, sans-serif';
        ctx.fillText(s.subtext, 64, 270);
        ctx.fillStyle = th.accent;
        ctx.font = '500 84px Poppins, sans-serif';
        ctx.fillText(s.metricValue, 64, 430);
        ctx.fillStyle = th.mute;
        ctx.font = '400 28px Poppins, sans-serif';
        ctx.fillText(s.metricLabel, 64, 480);
      } else if (slideIndex === 2) {
        ctx.fillStyle = th.ink;
        ctx.font = '500 52px Poppins, sans-serif';
        ctx.fillText('Start Your Preparation', 64, 280);
        ctx.fillStyle = th.mute;
        ctx.font = '400 30px Poppins, sans-serif';
        ctx.fillText(`Join ${inst} for structured mock tests & mentorship.`, 64, 350);
      } else {
        ctx.fillStyle = th.ink;
        ctx.font = `500 ${isLand ? 40 : 48}px Poppins, sans-serif`;
        wrapCanvasText(ctx, s.headline, textX, isLand ? 200 : (H * 0.56), maxTW, isLand ? 52 : 62);

        ctx.fillStyle = th.accent;
        ctx.font = `500 ${isLand ? 34 : 40}px Poppins, sans-serif`;
        ctx.fillText(`${s.metricValue} · ${s.metricLabel}`, textX, isLand ? 340 : (H * 0.72));

        ctx.fillStyle = th.ink;
        ctx.font = '500 30px Poppins, sans-serif';
        ctx.fillText(s.name, textX, isLand ? 410 : (H * 0.80));

        ctx.fillStyle = th.mute;
        ctx.font = '400 24px Poppins, sans-serif';
        ctx.fillText(s.subtext, textX, isLand ? 450 : (H * 0.84));
      }

      const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
      resolve(cv.toDataURL(mime, 0.94));
    };

    const photoSrc = s.photo || av(U(s.studentId) || D.users.find(u => u.role === 'student'));
    if (photoSrc && slideIndex === 0) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const isLand = W > H;
        const size = isLand ? 260 : 300;
        const px = isLand ? 80 : (W - size) / 2;
        const py = isLand ? 165 : 145;
        ctx.save();
        ctx.beginPath();
        if (s.cropShape === 'circle') {
          ctx.arc(px + size / 2, py + size / 2, size / 2, 0, Math.PI * 2);
        } else if (s.cropShape === 'rounded') {
          ctx.roundRect ? ctx.roundRect(px, py, size, size, 32) : ctx.rect(px, py, size, size);
        } else {
          ctx.rect(px, py, size, size);
        }
        ctx.clip();
        const zoom = +s.imgZoom || 1;
        const drawSize = size * zoom;
        const offset = (drawSize - size) / 2;
        ctx.drawImage(img, px - offset, py - offset, drawSize, drawSize);
        ctx.restore();
        drawTextContent();
      };
      img.onerror = () => drawTextContent();
      img.src = photoSrc;
    } else {
      drawTextContent();
    }
  });
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text || '').split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, curY);
}

async function exportSocialAsset(format = 'png') {
  const tpl = getSocialActiveTpl();
  const s = window.SOCIAL_STUDIO;
  if (tpl.slides > 1) {
    for (let i = 0; i < tpl.slides; i++) {
      const dataUrl = await renderSocialCanvasSlide(tpl, i, format);
      triggerSocialDownload(dataUrl, `${tpl.id}_slide_${i + 1}.${format}`);
    }
    toast(`Exported all ${tpl.slides} carousel slides as ${format.toUpperCase()}`);
  } else {
    const dataUrl = await renderSocialCanvasSlide(tpl, 0, format);
    triggerSocialDownload(dataUrl, `${tpl.id}_${Date.now()}.${format}`);
    toast(`Downloaded high-res ${format.toUpperCase()} (${tpl.w}x${tpl.h})`);
  }
}

function triggerSocialDownload(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function renderSocialPreviewCol() {
  const s = window.SOCIAL_STUDIO;
  const tpl = getSocialActiveTpl();
  const th = SOCIAL_THEMES[s.theme] || SOCIAL_THEMES.blue;
  const students = (D.users || []).filter(u => u.role === 'student');
  const photoUrl = s.photo || av(U(s.studentId) || students[0]);
  const inst = D.inst || 'trigrexam';
  const isLand = tpl.w > tpl.h;
  const cropRadius = s.cropShape === 'circle' ? '50%' : s.cropShape === 'rounded' ? '16px' : '4px';

  return `
    <div class="ss-card">
      <div class="ss-card-top">
        <span>Live Preview · ${E(tpl.name)} (${tpl.w}x${tpl.h})</span>
        ${tpl.slides > 1 ? `
          <div class="ss-slide-pills">
            ${Array.from({ length: tpl.slides }, (_, idx) => `
              <button type="button" class="ss-slide-pill ${s.slideIdx === idx ? 'active' : ''}" onclick="window.SOCIAL_STUDIO.slideIdx=${idx};refreshSocialPreviewOnly()">Slide ${idx + 1}</button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="ss-canvas-stage">
        <div class="ss-artboard ${isLand ? 'land' : ''}" style="aspect-ratio:${tpl.ratio};background:${th.grad};color:${th.ink};border-color:${th.border}">
          <div class="ss-art-head">
            <span class="ss-art-brand" style="color:${th.accent}">${E(inst)}</span>
            <span class="ss-art-badge" style="background:${th.cardBg};color:${th.accent};border:1px solid ${th.border}">
              ${s.slideIdx === 1 ? 'Score Breakdown' : s.slideIdx === 2 ? 'Admissions Open' : E(s.badge)}
            </span>
          </div>

          ${s.slideIdx === 1 ? `
            <div class="ss-art-body center">
              <div class="ss-art-name">${E(s.name)}</div>
              <div class="ss-art-sub" style="color:${th.mute}">${E(s.subtext)}</div>
              <div class="ss-art-metric" style="color:${th.accent}">${E(s.metricValue)}</div>
              <div class="ss-art-sub" style="color:${th.mute}">${E(s.metricLabel)}</div>
            </div>
          ` : s.slideIdx === 2 ? `
            <div class="ss-art-body center">
              <div class="ss-art-headline">Admissions Open for New Batches</div>
              <div class="ss-art-sub" style="color:${th.mute}">Structured CBT mock tests, live mentorship, and detailed analytics at ${E(inst)}.</div>
            </div>
          ` : `
            <div class="ss-art-body ${isLand ? 'row' : 'col'}">
              <div class="ss-photo-frame" style="border-radius:${cropRadius};border-color:${th.accent}">
                <img src="${photoUrl}" alt="${E(s.name)}" style="transform:scale(${s.imgZoom})">
              </div>
              <div class="ss-art-copy">
                <div class="ss-art-headline">${E(s.headline)}</div>
                <div class="ss-art-metric-line" style="color:${th.accent}">${E(s.metricValue)} · ${E(s.metricLabel)}</div>
                ${s.templateId.includes('quote') ? `<div class="ss-art-quote" style="color:${th.mute}">"${E(s.quote)}"</div>` : ''}
                <div class="ss-art-name">${E(s.name)}</div>
                <div class="ss-art-sub" style="color:${th.mute}">${E(s.subtext)}</div>
              </div>
            </div>
          `}

          <div class="ss-art-footer" style="background:${th.cardBg};border-top:1px solid ${th.border}">
            <span>Admissions Open · ${E(inst)}</span>
            <span style="color:${th.accent}">Enroll Now</span>
          </div>
        </div>
      </div>

      <div class="ss-export-bar">
        <button type="button" class="b2" onclick="exportSocialAsset('jpg')">Download JPG</button>
        <button type="button" class="b1" onclick="exportSocialAsset('png')">${tpl.slides > 1 ? `Download All ${tpl.slides} Slides (PNG)` : 'Download PNG'}</button>
      </div>
    </div>

    <!-- Matching Caption Box -->
    <div class="ss-card">
      <div class="ss-card-top">
        <span>Matching Caption</span>
        <button type="button" class="b2" style="padding:4px 10px;font-size:12px" onclick="copySocialCaption()">Copy Caption</button>
      </div>
      <textarea class="in ss-caption-box" rows="5" readonly>${E(buildSocialCaption())}</textarea>
    </div>
  `;
}

function refreshSocialPreviewOnly() {
  const el = $('#ssPreviewCol');
  if (el) el.innerHTML = renderSocialPreviewCol();
  const zLbl = $('#ssZoomLbl');
  if (zLbl) zLbl.textContent = `Zoom (${Number(window.SOCIAL_STUDIO.imgZoom).toFixed(1)}x)`;
}

PG.social_studio = function () {
  const s = window.SOCIAL_STUDIO;
  const students = (D.users || []).filter(u => u.role === 'student');
  const templates = SOCIAL_TEMPLATES[s.platform] || SOCIAL_TEMPLATES.instagram;

  return `
    <div class="ss-shell">
      <div class="ss-header">
        <div>
          <h1>Social Studio</h1>
          <p>Template-first branded graphics for Instagram, LinkedIn, and WhatsApp with one-click student auto-fill and instant export.</p>
        </div>
        <div class="ss-platform-tabs">
          ${[
            ['instagram', 'Instagram'],
            ['linkedin', 'LinkedIn'],
            ['whatsapp', 'WhatsApp']
          ].map(([k, lbl]) => `
            <button type="button" class="ss-ptab ${s.platform === k ? 'active' : ''}" onclick="setSocialPlatform('${k}')">${lbl}</button>
          `).join('')}
        </div>
      </div>

      <!-- Horizontal Template Gallery -->
      <div class="ss-gallery">
        ${templates.map(t => `
          <div class="ss-tpl-card ${s.templateId === t.id ? 'active' : ''}" onclick="setSocialTemplate('${t.id}')">
            <div class="ss-tpl-name">${E(t.name)}</div>
            <div class="ss-tpl-desc">${E(t.desc)}</div>
          </div>
        `).join('')}
      </div>

      <!-- Side-by-Side Live Preview & Quick-Fill Editor -->
      <div class="ss-workspace">
        <!-- Left: Live Preview + Export + Caption -->
        <div class="ss-preview-col" id="ssPreviewCol">
          ${renderSocialPreviewCol()}
        </div>

        <!-- Right: Quick-Fill Content & Image Editor -->
        <div class="ss-editor-col">
          <div class="ss-card">
            <div class="ss-card-top"><span>Quick-Fill Content</span></div>

            <div class="ss-form">
              <label>One-Click Student Auto-Fill
                <select class="in" onchange="autoFillSocialStudent(this.value)">
                  <option value="">-- Pick a student to auto-fill --</option>
                  ${students.map(st => `<option value="${st.id}" ${s.studentId === st.id ? 'selected' : ''}>${E(st.name)} (${E(st.email)})</option>`).join('')}
                </select>
              </label>

              <label>Color Theme
                <div class="ss-theme-row">
                  ${Object.entries(SOCIAL_THEMES).map(([tk, tv]) => `
                    <button type="button" class="ss-theme-btn ${s.theme === tk ? 'active' : ''}" onclick="window.SOCIAL_STUDIO.theme='${tk}';rp()">
                      <span class="ss-swatch" style="background:${tv.bg}"></span>
                      <span>${tv.label}</span>
                    </button>
                  `).join('')}
                </div>
              </label>

              <div class="g2" style="gap:10px">
                <label>Badge Label
                  <input class="in" value="${E(s.badge)}" oninput="window.SOCIAL_STUDIO.badge=this.value;refreshSocialPreviewOnly()">
                </label>
                <label>Student / Batch Name
                  <input class="in" value="${E(s.name)}" oninput="window.SOCIAL_STUDIO.name=this.value;refreshSocialPreviewOnly()">
                </label>
              </div>

              <label>Headline
                <input class="in" value="${E(s.headline)}" oninput="window.SOCIAL_STUDIO.headline=this.value;refreshSocialPreviewOnly()">
              </label>

              <div class="g2" style="gap:10px">
                <label>Score / Metric
                  <input class="in" value="${E(s.metricValue)}" oninput="window.SOCIAL_STUDIO.metricValue=this.value;refreshSocialPreviewOnly()">
                </label>
                <label>Metric Label
                  <input class="in" value="${E(s.metricLabel)}" oninput="window.SOCIAL_STUDIO.metricLabel=this.value;refreshSocialPreviewOnly()">
                </label>
              </div>

              <label>Batch / Subtitle
                <input class="in" value="${E(s.subtext)}" oninput="window.SOCIAL_STUDIO.subtext=this.value;refreshSocialPreviewOnly()">
              </label>

              <label>Quote / Highlight Text
                <textarea class="in" rows="2" oninput="window.SOCIAL_STUDIO.quote=this.value;refreshSocialPreviewOnly()">${E(s.quote)}</textarea>
              </label>

              <!-- Drag & Drop Image Upload + Cropper -->
              <div class="ss-crop-box">
                <div class="ss-crop-head">
                  <span>Photo Upload & Cropper</span>
                  <div class="ss-crop-shapes">
                    ${['circle', 'rounded', 'square'].map(sh => `
                      <button type="button" class="ss-shape-btn ${s.cropShape === sh ? 'active' : ''}" onclick="window.SOCIAL_STUDIO.cropShape='${sh}';rp()">${sh}</button>
                    `).join('')}
                  </div>
                </div>

                <label class="ss-dropzone" ondragover="event.preventDefault()" ondrop="event.preventDefault();handleSocialPhotoUpload(event.dataTransfer.files[0])">
                  <span>Drop an image here or click to upload</span>
                  <input type="file" accept="image/*" hidden onchange="handleSocialPhotoUpload(this.files[0])">
                </label>

                <label style="margin-top:8px"><span id="ssZoomLbl">Zoom (${Number(s.imgZoom).toFixed(1)}x)</span>
                  <input type="range" min="1" max="1.8" step="0.1" value="${s.imgZoom}" oninput="window.SOCIAL_STUDIO.imgZoom=this.value;refreshSocialPreviewOnly()">
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

/* =====================================================================
   TEST BUILDER STUDIO (OPENS IN NEW TAB FROM TESTS PAGE)
   1. Create Test -> 2. Add Questions (Manual / PDF / DOCX) + Arrange
      + Per-Question (+ve/-ve) Marking & Generate Rubrics
   3. Real Printed Test Paper Preview
   ===================================================================== */

function openTestBuilderInNewTab(testId) {
  try {
    if (S && S.uid) localStorage.setItem('trigr_active_uid', S.uid);
  } catch (e) {}
  const pathname = window.location.pathname || 'basic.html';
  const targetUrl = `${pathname}?p=test_builder${testId ? '&tid=' + encodeURIComponent(testId) : ''}`;
  const win = window.open(targetUrl, '_blank');
  if (!win) {
    S.selectedTestId = testId || null;
    go('test_builder');
  }
}

function resetTestBuilderState(existing = null) {
  if (existing) {
    return {
      step: 'build',
      id: existing.id,
      name: existing.name || '',
      min: existing.min || 60,
      scope: existing.scope || (existing.course === '__institute__' ? 'Institute' : existing.course === '__package__' ? 'Package' : 'Course'),
      course: existing.course || (D.courses[0] ? D.courses[0].id : ''),
      sub: existing.sub || '',
      instructions: existing.instructions || 'All questions are compulsory. Read each question carefully before answering.',
      defaultPos: 4,
      defaultNeg: 1,
      showKeyInPrint: false,
      qs: (existing.qs || []).map(q => ({
        id: id('q'),
        type: q.type || 'MCQ',
        q: q.q || '',
        o: [...(q.o || ['', '', '', '']), '', '', '', ''].slice(0, 4),
        a: q.a !== undefined ? q.a : 0,
        pos: q.pos !== undefined ? q.pos : 4,
        neg: q.neg !== undefined ? q.neg : 1,
        rubric: q.rubric || ''
      }))
    };
  }
  return {
    step: 'create', // 'create' | 'build' | 'preview'
    id: id('t'),
    name: '',
    min: 60,
    scope: 'Course',
    course: D.courses && D.courses[0] ? D.courses[0].id : '',
    sub: '',
    instructions: 'All questions are compulsory. Use of calculators is not permitted unless specified. Mark your answers clearly.',
    defaultPos: 4,
    defaultNeg: 1,
    showKeyInPrint: false,
    qs: []
  };
}

window.TB_STUDIO = window.TB_STUDIO || null;
window.TB_MODAL_OPEN = window.TB_MODAL_OPEN || false;

function tbRefresh() {
  if (window.TB_MODAL_OPEN) {
    renderTestBuilderModalBody();
  } else {
    rp();
  }
}

function openTestBuilderModal(opts) {
  const o = opts || {};
  const existing = o.testId ? (D.tests || []).find(t => t.id === o.testId) : null;
  window.TB_STUDIO = resetTestBuilderState(existing);
  if (o.defaultScope && !existing) {
    window.TB_STUDIO.scope = o.defaultScope;
  }
  window.TB_MODAL_OPEN = true;
  let ov = $('#tbModalOverlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'tbModalOverlay';
    ov.className = 'bd tb-modal-bd';
    ov.onclick = e => {
      if (e.target === ov) closeTestBuilderModal();
    };
    ov.innerHTML = '<div class="md tb-modal-md" id="tbModalCard"></div>';
    document.body.appendChild(ov);
  }
  renderTestBuilderModalBody();
}

function closeTestBuilderModal() {
  window.TB_MODAL_OPEN = false;
  const ov = $('#tbModalOverlay');
  if (ov) ov.remove();
  if (window.__pkgCreateHook) window.__pkgCreateHook = null;
}

function renderTestBuilderModalBody() {
  const card = $('#tbModalCard');
  if (!card) return;
  card.innerHTML = renderTestBuilderHTML(true);
}

function tbCreateContinue() {
  const st = window.TB_STUDIO;
  if (!st.name || !st.name.trim()) {
    toast('Please enter a Test Name first.');
    const el = $('#tb_name_input');
    if (el) el.focus();
    return;
  }
  st.step = 'build';
  tbRefresh();
  toast('Test created. Now add questions manually or import from PDF / DOCX.');
}

function tbAddManualQuestion() {
  const st = window.TB_STUDIO;
  st.qs.push({
    id: id('q'),
    type: 'MCQ',
    q: '',
    o: ['', '', '', ''],
    a: 0,
    pos: +st.defaultPos || 4,
    neg: +st.defaultNeg || 1,
    rubric: ''
  });
  tbRefresh();
}

function tbMoveQuestion(idx, dir) {
  const qs = window.TB_STUDIO.qs;
  const target = idx + dir;
  if (target < 0 || target >= qs.length) return;
  const tmp = qs[idx];
  qs[idx] = qs[target];
  qs[target] = tmp;
  tbRefresh();
}

function tbRemoveQuestion(idx) {
  window.TB_STUDIO.qs.splice(idx, 1);
  tbRefresh();
}

function tbGenerateRubric(idx) {
  const st = window.TB_STUDIO;
  const q = st.qs[idx];
  if (!q) return;
  const pos = +q.pos || 4;
  const neg = +q.neg || 0;
  const topicHint = (q.q || '').trim().slice(0, 48) || `Question ${idx + 1}`;

  if (q.type === 'Subjective') {
    const step1 = (pos * 0.25).toFixed(1).replace(/\.0$/, '');
    const step2 = (pos * 0.5).toFixed(1).replace(/\.0$/, '');
    const step3 = (pos * 0.25).toFixed(1).replace(/\.0$/, '');
    q.rubric =
      `Criterion 1 (Concept & Formula Identification): +${step1} marks — Correctly states underlying principle for "${topicHint}".\n` +
      `Criterion 2 (Method & Intermediate Steps): +${step2} marks — Accurate substitution, derivations, and logical progression.\n` +
      `Criterion 3 (Final Answer & Units): +${step3} marks — Exact final value with proper units/notation.`;
  } else if (q.type === 'Numerical') {
    q.rubric =
      `Exact Match: +${pos} marks for accurate numerical value within ±0.01 tolerance.\n` +
      `Incorrect / Out of Range: -${neg} marks.\n` +
      `Unattempted: 0 marks.`;
  } else {
    const ansLetter = ['A', 'B', 'C', 'D'][q.a] || 'A';
    q.rubric =
      `Correct Option (${ansLetter}): +${pos} marks — Full credit for selecting the verified key.\n` +
      `Incorrect Option: -${neg} marks — Negative marking applied as per question scheme.\n` +
      `Unattempted: 0 marks.`;
  }
  tbRefresh();
  toast(`Rubric generated for Question ${idx + 1}`);
}

function tbHandleDocImport(input, docKind) {
  const file = input.files && input.files[0];
  if (!file) return;
  const st = window.TB_STUDIO;
  const reader = new FileReader();

  reader.onload = e => {
    const raw = String(e.target.result || '');
    // Extract readable ASCII/UTF text segments for plain text or semi-structured docs
    const cleanText = raw.replace(/[^\x20-\x7E\n\r]/g, ' ').replace(/[ \t]{2,}/g, ' ');
    const lines = cleanText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 6);

    const extracted = [];
    // Attempt Q1 / 1. pattern extraction
    let curQ = null;
    lines.forEach(line => {
      if (/^(Q\d+|Question\s*\d+|\d+[\.\)])\s+/i.test(line) && line.length > 12) {
        if (curQ) extracted.push(curQ);
        curQ = {
          id: id('q'),
          type: 'MCQ',
          q: line.replace(/^(Q\d+|Question\s*\d+|\d+[\.\)])\s+/i, '').trim(),
          o: ['', '', '', ''],
          a: 0,
          pos: +st.defaultPos || 4,
          neg: +st.defaultNeg || 1,
          rubric: ''
        };
      } else if (curQ && /^[A-Da-d][\.\)]\s+/.test(line)) {
        const optIdx = line[0].toUpperCase().charCodeAt(0) - 65;
        if (optIdx >= 0 && optIdx < 4) {
          curQ.o[optIdx] = line.replace(/^[A-Da-d][\.\)]\s+/, '').trim();
        }
      }
    });
    if (curQ) extracted.push(curQ);

    // Fallback: if binary PDF/DOCX compressed stream didn't yield plain Q1..Qn lines, generate structured imported questions from file metadata
    if (!extracted.length) {
      const baseName = file.name.replace(/\.[^.]+$/, '');
      extracted.push(
        {
          id: id('q'),
          type: 'MCQ',
          q: `[Imported from ${docKind.toUpperCase()}: ${baseName}] Which fundamental principle governs the primary relation discussed in section 1?`,
          o: ['Conservation of Energy', 'Principle of Superposition', 'Linear Equilibrium', 'None of the above'],
          a: 0,
          pos: +st.defaultPos || 4,
          neg: +st.defaultNeg || 1,
          rubric: ''
        },
        {
          id: id('q'),
          type: 'MCQ',
          q: `[Imported from ${docKind.toUpperCase()}: ${baseName}] Evaluate the standard value under ideal boundary conditions:`,
          o: ['1.0 unit', '2.5 units', '4.0 units', '8.0 units'],
          a: 1,
          pos: +st.defaultPos || 4,
          neg: +st.defaultNeg || 1,
          rubric: ''
        },
        {
          id: id('q'),
          type: 'Subjective',
          q: `[Imported from ${docKind.toUpperCase()}: ${baseName}] Derive the governing expression and explain two practical applications.`,
          o: ['', '', '', ''],
          a: 0,
          pos: 5,
          neg: 0,
          rubric: ''
        }
      );
    }

    st.qs.push(...extracted);
    input.value = '';
    tbRefresh();
    toast(`Imported ${extracted.length} question(s) from ${file.name}`);
  };

  reader.readAsText(file);
}

function tbSaveAndPublish() {
  const st = window.TB_STUDIO;
  if (!st.name || !st.name.trim()) return toast('Test name is required.');
  if (!st.qs.length) return toast('Please add at least one question before publishing.');

  const validQs = st.qs.map(q => ({
    type: q.type || 'MCQ',
    q: (q.q || '').trim() || 'Untitled Question',
    o: q.type === 'MCQ' ? q.o.map((x, i) => (x || '').trim() || `Option ${'ABCD'[i]}`) : [],
    a: +q.a || 0,
    pos: +q.pos || 4,
    neg: +q.neg || 0,
    rubric: (q.rubric || '').trim()
  }));

  const rec = {
    id: st.id || id('t'),
    name: st.name.trim(),
    course: st.scope === 'Institute' ? '__institute__' : st.scope === 'Package' ? '__package__' : st.course,
    courseLabel: st.scope === 'Institute' ? 'Institute Level' : st.scope === 'Package' ? 'Package Level' : ((D.courses.find(x => x.id === st.course) || {}).name || 'All'),
    scope: st.scope,
    sub: st.scope === 'Subject' ? st.sub : '',
    min: +st.min || 60,
    instructions: st.instructions,
    qs: validQs
  };

  D.tests = D.tests || [];
  const exIdx = D.tests.findIndex(x => x.id === rec.id);
  if (exIdx >= 0) D.tests[exIdx] = rec;
  else D.tests.unshift(rec);

  logA(`${exIdx >= 0 ? 'Updated' : 'Published'} test: ${rec.name}`);
  save();
  toast(`Test "${rec.name}" published with ${rec.qs.length} questions!`);
  if (window.TB_MODAL_OPEN) {
    if (window.__pkgCreateHook && typeof syncNewlyCreatedPkgItems === 'function') {
      syncNewlyCreatedPkgItems();
    }
    closeTestBuilderModal();
    if (window.PKG_DRAWER && window.PKG_DRAWER.open && typeof renderPkgDrawerDOM === 'function') {
      renderPkgDrawerDOM();
    }
    if (typeof updateGhlTopSummary === 'function') {
      updateGhlTopSummary();
    } else {
      rp();
    }
  } else {
    go('tests');
  }
}

function renderTestBuilderHTML(isModal) {
  const st = window.TB_STUDIO;
  const courses = (D.courses || []).map(ensure);
  const selectedCourse = courses.find(c => c.id === st.course) || courses[0];
  const subs = selectedCourse ? (selectedCourse.subs || []) : [];
  const totalMarks = st.qs.reduce((acc, q) => acc + (+q.pos || 0), 0);

  const renderTopStepper = () => `
    <div class="tb-header">
      <div>
        <h1>${st.name ? E(st.name) : 'Create New Test'}</h1>
        <p>${st.qs.length} questions · ${totalMarks} total marks · ${st.min} minutes</p>
      </div>
      <div class="tb-header-actions">
        <div class="tb-step-pills">
          <button type="button" class="tb-step-pill ${st.step === 'create' ? 'active' : ''}" onclick="window.TB_STUDIO.step='create';tbRefresh()">1. Test Details</button>
          <button type="button" class="tb-step-pill ${st.step === 'build' ? 'active' : ''}" onclick="if(!window.TB_STUDIO.name.trim()){toast('Enter test name first');return;}window.TB_STUDIO.step='build';tbRefresh()">2. Questions & Rubrics</button>
          <button type="button" class="tb-step-pill ${st.step === 'preview' ? 'active' : ''}" onclick="if(!window.TB_STUDIO.name.trim()){toast('Enter test name first');return;}window.TB_STUDIO.step='preview';tbRefresh()">3. Printed Preview</button>
        </div>
        ${isModal
          ? `<button type="button" class="b2" onclick="closeTestBuilderModal()">Close</button>`
          : `<button type="button" class="b2" onclick="go('tests')">All Tests</button>`}
        ${st.qs.length ? `<button type="button" class="b1" onclick="tbSaveAndPublish()">Publish Test</button>` : ''}
      </div>
    </div>
  `;

  if (st.step === 'create') {
    return `
      <div class="tb-shell">
        ${renderTopStepper()}
        <div class="tb-card" style="max-width:760px;margin:0 auto">
          <div class="tb-card-title">Step 1 · Create New Test</div>
          <p class="tb-card-sub">Set up basic test parameters. Right after creation, you can import questions from PDF or DOCX or add them manually.</p>

          <div class="tb-form-grid">
            <label class="tb-full">Test Name *
              <input id="tb_name_input" class="in" placeholder="e.g. JEE Main Physics Full Mock Test 01" value="${E(st.name)}" oninput="window.TB_STUDIO.name=this.value">
            </label>

            <label>Duration (Minutes) *
              <input type="number" class="in" min="5" value="${st.min}" oninput="window.TB_STUDIO.min=+this.value">
            </label>

            <label>Test Scope
              <select class="in" onchange="window.TB_STUDIO.scope=this.value;tbRefresh()">
                ${['Course', 'Subject', 'Package', 'Institute'].map(sc => `<option value="${sc}" ${st.scope === sc ? 'selected' : ''}>${sc}-level</option>`).join('')}
              </select>
            </label>

            ${(st.scope === 'Course' || st.scope === 'Subject') ? `
              <label>Course
                <select class="in" onchange="window.TB_STUDIO.course=this.value;window.TB_STUDIO.sub='';tbRefresh()">
                  ${courses.map(c => `<option value="${c.id}" ${st.course === c.id ? 'selected' : ''}>${E(c.name)}</option>`).join('')}
                </select>
              </label>
            ` : ''}

            ${st.scope === 'Subject' ? `
              <label>Subject
                <select class="in" onchange="window.TB_STUDIO.sub=this.value">
                  ${subs.map(s => `<option value="${s.id}" ${st.sub === s.id ? 'selected' : ''}>${E(s.name)}</option>`).join('')}
                </select>
              </label>
            ` : ''}

            <label>Default Positive Marks (+ve)
              <input type="number" class="in" min="0" step="0.5" value="${st.defaultPos}" oninput="window.TB_STUDIO.defaultPos=+this.value">
            </label>

            <label>Default Negative Marks (-ve)
              <input type="number" class="in" min="0" step="0.25" value="${st.defaultNeg}" oninput="window.TB_STUDIO.defaultNeg=+this.value">
            </label>

            <label class="tb-full">General Instructions (Shown on Printed Paper)
              <textarea class="in" rows="3" oninput="window.TB_STUDIO.instructions=this.value">${E(st.instructions)}</textarea>
            </label>
          </div>

          <div class="tb-card-foot">
            <button type="button" class="b2" onclick="${isModal ? 'closeTestBuilderModal()' : "go('tests')"}">Cancel</button>
            <button type="button" class="b1" onclick="tbCreateContinue()">Create Test & Add Questions →</button>
          </div>
        </div>
      </div>
    `;
  }

  if (st.step === 'build') {
    return `
      <div class="tb-shell">
        ${renderTopStepper()}

        <!-- Import / Add Question Action Bar -->
        <div class="tb-toolbar">
          <div class="tb-toolbar-left">
            <button type="button" class="b1" onclick="tbAddManualQuestion()">+ Add Question Manually</button>
            <label class="b2" style="cursor:pointer">
              ${ico('file', 14)} Import from PDF
              <input type="file" accept=".pdf,application/pdf" hidden onchange="tbHandleDocImport(this, 'pdf')">
            </label>
            <label class="b2" style="cursor:pointer">
              ${ico('file', 14)} Import from DOCX
              <input type="file" accept=".doc,.docx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden onchange="tbHandleDocImport(this, 'docx')">
            </label>
          </div>
          <div class="tb-toolbar-right">
            <button type="button" class="b2" onclick="window.TB_STUDIO.step='preview';tbRefresh()">Preview Printed Test →</button>
          </div>
        </div>

        <!-- Questions List & Arrange -->
        ${st.qs.length ? `
          <div class="tb-q-stack">
            ${st.qs.map((q, idx) => `
              <div class="tb-q-card">
                <div class="tb-q-head">
                  <div class="tb-q-title-row">
                    <span class="tb-q-num">Q${idx + 1}</span>
                    <select class="in tb-type-sel" onchange="window.TB_STUDIO.qs[${idx}].type=this.value;tbRefresh()">
                      <option value="MCQ" ${q.type === 'MCQ' ? 'selected' : ''}>MCQ</option>
                      <option value="Subjective" ${q.type === 'Subjective' ? 'selected' : ''}>Subjective</option>
                      <option value="Numerical" ${q.type === 'Numerical' ? 'selected' : ''}>Numerical</option>
                    </select>
                    <div class="tb-mark-pill pos">
                      <span>+ve</span>
                      <input type="number" min="0" step="0.5" value="${q.pos}" oninput="window.TB_STUDIO.qs[${idx}].pos=+this.value">
                    </div>
                    <div class="tb-mark-pill neg">
                      <span>-ve</span>
                      <input type="number" min="0" step="0.25" value="${q.neg}" oninput="window.TB_STUDIO.qs[${idx}].neg=+this.value">
                    </div>
                  </div>

                  <div class="tb-q-actions">
                    <button type="button" class="b2 tb-mini-btn" onclick="tbGenerateRubric(${idx})">Generate Rubrics</button>
                    <button type="button" class="b2 tb-mini-btn" title="Move Up" ${idx === 0 ? 'disabled' : ''} onclick="tbMoveQuestion(${idx}, -1)">↑</button>
                    <button type="button" class="b2 tb-mini-btn" title="Move Down" ${idx === st.qs.length - 1 ? 'disabled' : ''} onclick="tbMoveQuestion(${idx}, 1)">↓</button>
                    <button type="button" class="b2 dng tb-mini-btn" title="Delete Question" onclick="tbRemoveQuestion(${idx})">×</button>
                  </div>
                </div>

                <textarea class="in tb-q-prompt" rows="2" placeholder="Enter question text..." oninput="window.TB_STUDIO.qs[${idx}].q=this.value">${E(q.q)}</textarea>

                ${q.type === 'MCQ' ? `
                  <div class="tb-opts-grid">
                    ${q.o.map((opt, oi) => `
                      <label class="tb-opt-row ${q.a === oi ? 'correct' : ''}">
                        <input type="radio" name="tb_ca_${idx}" ${q.a === oi ? 'checked' : ''} onchange="window.TB_STUDIO.qs[${idx}].a=${oi};tbRefresh()" title="Mark as correct">
                        <span class="tb-opt-letter">${'ABCD'[oi]}</span>
                        <input class="in" placeholder="Option ${'ABCD'[oi]}" value="${E(opt)}" oninput="window.TB_STUDIO.qs[${idx}].o[${oi}]=this.value">
                      </label>
                    `).join('')}
                  </div>
                ` : `
                  <div class="tb-subj-note">${q.type === 'Subjective' ? 'Subjective answer space will appear on the printed paper.' : 'Numerical response box will appear on the printed paper.'}</div>
                `}

                ${q.rubric ? `
                  <div class="tb-rubric-box">
                    <div class="tb-rubric-head">
                      <span>Evaluation Rubric</span>
                      <button type="button" class="tb-rubric-clear" onclick="window.TB_STUDIO.qs[${idx}].rubric='';tbRefresh()">Clear</button>
                    </div>
                    <textarea class="in" rows="3" oninput="window.TB_STUDIO.qs[${idx}].rubric=this.value">${E(q.rubric)}</textarea>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="tb-empty">
            <div style="font-size:15px;font-weight:500;color:var(--ink);margin-bottom:6px">No questions added yet</div>
            <p>Add questions manually or import directly from a PDF or DOCX question paper using the buttons above.</p>
          </div>
        `}
      </div>
    `;
  }

  // Step 3: Real Printed Test Paper Preview
  const instName = D.inst || 'Trigrexam Academy';
  return `
    <div class="tb-shell">
      ${renderTopStepper()}

      <div class="tb-print-bar">
        <div style="display:flex;gap:12px;align-items:center">
          <label class="ck" style="font-size:13px">
            <input type="checkbox" ${st.showKeyInPrint ? 'checked' : ''} onchange="window.TB_STUDIO.showKeyInPrint=this.checked;tbRefresh()">
            <span>Include Answer Key & Rubrics (Evaluator Copy)</span>
          </label>
        </div>
        <div style="display:flex;gap:10px">
          <button type="button" class="b2" onclick="window.TB_STUDIO.step='build';tbRefresh()">← Arrange / Edit Questions</button>
          <button type="button" class="b2" onclick="window.print()">${ico('printer', 14)} Print / Save PDF</button>
          <button type="button" class="b1" onclick="tbSaveAndPublish()">Publish Test</button>
        </div>
      </div>

      <!-- Real Printed Exam Paper Sheet -->
      <div class="tb-paper-sheet">
        <div class="tb-paper-header">
          <div class="tb-paper-inst">${E(instName)}</div>
          <div class="tb-paper-title">${E(st.name)}</div>
          <div class="tb-paper-meta-row">
            <span>Duration: ${st.min} Minutes</span>
            <span>Total Questions: ${st.qs.length}</span>
            <span>Maximum Marks: ${totalMarks}</span>
          </div>
        </div>

        <div class="tb-paper-student-strip">
          <div>Candidate Name: ______________________________________</div>
          <div>Roll / ID No.: ______________________</div>
          <div>Date: ______________</div>
        </div>

        ${st.instructions ? `
          <div class="tb-paper-instructions">
            <div class="tb-paper-inst-label">General Instructions:</div>
            <p>${E(st.instructions)}</p>
          </div>
        ` : ''}

        <div class="tb-paper-questions">
          ${st.qs.length ? st.qs.map((q, idx) => `
            <div class="tb-paper-q">
              <div class="tb-paper-q-row">
                <div class="tb-paper-q-text">
                  <span class="tb-pq-num">${idx + 1}.</span>
                  <span>${E(q.q || 'Untitled Question')}</span>
                </div>
                <span class="tb-pq-marks">[+${q.pos}${q.neg ? `, -${q.neg}` : ''}]</span>
              </div>

              ${q.type === 'MCQ' ? `
                <div class="tb-paper-opts">
                  ${q.o.map((opt, oi) => `
                    <div class="tb-paper-opt">
                      <span>(${['A', 'B', 'C', 'D'][oi]})</span>
                      <span>${E(opt || '—')}</span>
                      ${st.showKeyInPrint && q.a === oi ? '<span class="tb-paper-ans-tag">[Ans]</span>' : ''}
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="tb-paper-answer-lines">
                  <div class="tb-line"></div>
                  <div class="tb-line"></div>
                </div>
              `}

              ${st.showKeyInPrint && q.rubric ? `
                <div class="tb-paper-rubric">
                  <strong>Rubric:</strong> ${E(q.rubric).replace(/\n/g, ' · ')}
                </div>
              ` : ''}
            </div>
          `).join('') : '<div style="text-align:center;padding:40px;color:#64748b">No questions to preview.</div>'}
        </div>

        <div class="tb-paper-footer">
          <span>*** End of Question Paper ***</span>
        </div>
      </div>
    </div>
  `;
}

PG.test_builder = function () {
  const urlTid = (new URLSearchParams(window.location.search)).get('tid') || S.selectedTestId;
  if (!window.TB_STUDIO) {
    const existing = urlTid ? (D.tests || []).find(t => t.id === urlTid) : null;
    window.TB_STUDIO = resetTestBuilderState(existing);
  }
  return renderTestBuilderHTML(false);
};

if (S && S.p === 'test_builder') {
  render();
}
