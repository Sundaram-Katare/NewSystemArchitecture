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
function et(i, cid, sid) {
  const t = i ? D.tests.find(x => x.id === i) : null, cc = crs();
  TB = {
    id: i || '',
    d: t
      ? { name: t.name, course: t.course, scope: t.scope || (t.course === '__institute__' ? 'Institute' : (t.sub ? 'Subject' : 'Course')), sub: t.sub || '', min: t.min, qs: t.qs.map(q => ({ q: q.q, o: [...q.o, '', '', '', ''].slice(0, 4), a: q.a })) }
      : { name: '', course: cid || (cc[0] || {}).id || '', scope: sid ? 'Subject' : 'Course', sub: sid || '', min: 15, qs: [{ q: '', o: ['', '', '', ''], a: 0 }] }
  };
  if (!TB.d.course && TB.d.scope !== 'Institute') return toast('Create a course first');
  etr();
}
function etr() {
  const d = TB.d, sc = ($('.mb') || {}).scrollTop || 0, c = D.courses.find(x => x.id === d.course), subs = c ? ensure(c).subs : [];
  if (d.scope === 'Subject' && !subs.some(s => s.id === d.sub)) d.sub = (subs[0] || {}).id || '';
  const cl2 = D.courses.filter(x => crs().some(y => y.id === x.id) || x.id === d.course);
  const b = `<div class=g2><label>Test name *<input value="${E(d.name)}" oninput="TB.d.name=this.value" placeholder="e.g. Weekly Physics Test"></label><label>Duration (minutes)<input type=number min=1 value="${E(d.min)}" oninput="TB.d.min=this.value"></label></div>
    <div class=g2>
      ${d.scope === 'Institute'
        ? `<label>Scope Coverage<input value="All Institute Courses (Universal CBT Assessment)" disabled style="background:var(--s);color:var(--mute)"></label>`
        : `<label>Course *<select onchange="TB.d.course=this.value;TB.d.sub='';etr()">${cl2.map(x => `<option value="${x.id}" ${x.id === d.course ? 'selected' : ''}>${E(x.name)}</option>`).join('')}</select></label>`
      }
      <div class=fg><span>Test scope</span><div class=seg><button type=button class="${d.scope === 'Course' ? 'on' : ''}" onclick="TB.d.scope='Course';etr()">Course-wise</button><button type=button class="${d.scope === 'Subject' ? 'on' : ''}" onclick="TB.d.scope='Subject';etr()">Subject-wise</button><button type=button class="${d.scope === 'Institute' ? 'on' : ''}" onclick="TB.d.scope='Institute';etr()">Institute-level</button></div></div>
    </div>
    ${d.scope === 'Subject' ? `<label>Subject *<select onchange="TB.d.sub=this.value">${subs.map(s => `<option value="${s.id}" ${s.id === d.sub ? 'selected' : ''}>${E(s.name)}</option>`).join('')}</select></label>` : ''}
    <div class=qlist>${d.qs.map((q, j) => `<div class=qb><div class=qh><b>Question ${j + 1}</b><button type=button class="b2 xs" ${d.qs.length < 2 ? 'disabled' : ''} onclick="TB.d.qs.splice(${j},1);etr()">×</button></div>
      <textarea rows=2 placeholder="Type the question…" oninput="TB.d.qs[${j}].q=this.value">${E(q.q)}</textarea>
      ${q.o.map((o, k) => `<label class="ck opt"><input type=radio name="ca${j}" ${q.a === k ? 'checked' : ''} onchange="TB.d.qs[${j}].a=${k}" title="Correct answer"><input value="${E(o)}" placeholder="Option ${'ABCD'[k]}" oninput="TB.d.qs[${j}].o[${k}]=this.value"></label>`).join('')}</div>`).join('')}</div>
    <button type=button class=b2 style="justify-self:start" onclick="TB.d.qs.push({q:'',o:['','','',''],a:0});etr()">+ Add question</button><small>Select the radio next to the correct option.</small>`;
  modal(TB.id ? 'Edit test' : 'Create test', b, null, '', '', `<button class=b2 onclick=closeM(1)>Cancel</button><button class=b1 onclick=etSave()>${TB.id ? 'Save test' : 'Publish test'}</button>`);
  $('.md').style.maxWidth = '720px';
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
    course: d.scope === 'Institute' ? '__institute__' : d.course,
    courseLabel: d.scope === 'Institute' ? 'Institute Level' : ((D.courses.find(x => x.id === d.course) || {}).name || 'All'),
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
    } else {
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

function openCreateTestSeriesModal() {
  const cc = crs().map(c => [c.id, c.name]);
  let selectedScope = 'Institute';

  const renderModalContent = () => {
    const isInst = selectedScope === 'Institute';
    return `
      <div style="display:grid;gap:12px">
        <label>Series Title *
          <input id="tsTitle" placeholder="e.g. All India Pre-Exam CBT Grand Test Series" style="font-weight:600">
        </label>

        <div class="fg">
          <span style="font-size:12.5px;font-weight:600;color:var(--ink);display:block;margin-bottom:6px">Scope Assignment *</span>
          <div class="seg" style="display:flex;gap:4px">
            <button type="button" class="${isInst ? 'on' : ''}" onclick="window.__tsScopeSelect('Institute')">Institute-level (Independent)</button>
            <button type="button" class="${!isInst ? 'on' : ''}" onclick="window.__tsScopeSelect('Course')">Course-wise</button>
          </div>
        </div>

        ${isInst ? `
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

      if (selectedScope === 'Institute') {
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
  return hd('Tests', r === 'student' ? 'Assigned tests.' : 'Create institute-level, course-wise or subject-wise tests.', r === 'student' ? '' : '<button class=b1 onclick="et()">+ Create test</button>') +
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
    ], l, r === 'student' ? t => `<button class=b1 onclick="tk('${t.id}')">${D.res.some(y => y.tid === t.id && y.sid === S.uid) ? 'Retake' : 'Start'}</button>` : t => `<button class=b2 onclick="et('${t.id}')">Edit</button>`);
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
      adm ? '<button class="b1" onclick="openPackageWizard()">+ Create Package</button>' : ''
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
              <div class="cd cc pkg-card" style="display:flex;flex-direction:column;justify-content:space-between">
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
                    <button class="b1" style="flex:1" onclick="viewPackageDetail('${pkg.id}')">View Details</button>
                    ${adm ? tblDots('package', pkg.id) : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>`
      : `<div class="em">
          <p>${r === 'student' ? 'No packages assigned to your account yet.' : 'No packages created yet. Create a package to bundle batches, courses, and tests.'}</p>
          ${adm ? '<button class="b1" style="margin-top:10px" onclick="openPackageWizard()">+ Create Package</button>' : ''}
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
