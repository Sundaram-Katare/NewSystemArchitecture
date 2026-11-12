/* ============================================================== */
/* refine.js — Refined Engine for Instructor Side & Course Hub    */
/* ============================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------ */
  /* LIVE INTERNET IMAGES POOL FOR COURSES, LECTURES & PACKAGES   */
  /* ------------------------------------------------------------ */

  const LIVE_COURSE_IMAGES = {
    k1: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop&auto=format&q=80', // JEE Advanced Physics & Maths
    k2: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=450&fit=crop&auto=format&q=80', // NEET Medical Excellence
    k3: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop&auto=format&q=80'  // Full Stack Python
  };

  const LIVE_COURSE_POOL = [
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=450&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop&auto=format&q=80'
  ];

  const LIVE_LECTURE_POOL = {
    Physics: [
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=640&h=360&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=640&h=360&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&h=360&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&h=360&fit=crop&auto=format&q=80'
    ],
    Chemistry: [
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=640&h=360&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=640&h=360&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=640&h=360&fit=crop&auto=format&q=80'
    ],
    Mathematics: [
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=640&h=360&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=640&h=360&fit=crop&auto=format&q=80'
    ],
    Biology: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=640&h=360&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=640&h=360&fit=crop&auto=format&q=80'
    ],
    Programming: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&h=360&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=640&h=360&fit=crop&auto=format&q=80'
    ],
    General: [
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=640&h=360&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=360&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=640&h=360&fit=crop&auto=format&q=80'
    ]
  };

  const LIVE_PACKAGE_IMAGES = {
    pkg1: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop&auto=format&q=80',
    pkg2: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop&auto=format&q=80',
    pkg3: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop&auto=format&q=80'
  };

  const LIVE_PACKAGE_POOL = [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=450&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&auto=format&q=80'
  ];

  window.getLiveCourseImg = function (c) {
    if (c && c.img && c.img.startsWith('http')) return c.img;
    if (c && LIVE_COURSE_IMAGES[c.id]) return LIVE_COURSE_IMAGES[c.id];
    const idx = c ? [...String(c.id || c.name || '')].reduce((a, ch) => a + ch.charCodeAt(0), 0) : 0;
    return LIVE_COURSE_POOL[idx % LIVE_COURSE_POOL.length];
  };

  window.getLiveLectureImg = function (l, subjectName = '', idx = 0) {
    if (l && l.img && l.img.startsWith('http')) return l.img;
    const sKey = Object.keys(LIVE_LECTURE_POOL).find(k => (subjectName || '').toLowerCase().includes(k.toLowerCase())) || 'General';
    const pool = LIVE_LECTURE_POOL[sKey] || LIVE_LECTURE_POOL.General;
    return pool[idx % pool.length];
  };

  window.getLivePackageImg = function (p) {
    if (p && p.thumb && p.thumb.startsWith('http')) return p.thumb;
    if (p && LIVE_PACKAGE_IMAGES[p.id]) return LIVE_PACKAGE_IMAGES[p.id];
    const idx = p ? [...String(p.id || p.name || '')].reduce((a, ch) => a + ch.charCodeAt(0), 0) : 0;
    return LIVE_PACKAGE_POOL[idx % LIVE_PACKAGE_POOL.length];
  };

  // Bind cimg to the live image resolver globally
  window.cimg = window.getLiveCourseImg;

  /* ------------------------------------------------------------ */
  /* ROW-BASED / LIST-VIEW TESTS INSIDE COURSES                   */
  /* ------------------------------------------------------------ */

  function renderTestRowItem(t, c) {
    const r = me().role;
    const resList = D.res.filter(y => y.tid === t.id && (r !== 'student' || y.sid === S.uid));
    const subObj = t.sub && c ? subOf(c, t.sub) : null;
    const qCount = (t.qs || []).length || t.total_qs || 4;
    const pos = t.marks_positive || 4;
    const neg = t.marks_negative || 1;
    const isStudent = r === 'student';

    let statusBadge = '';
    if (isStudent) {
      if (!resList.length) {
        statusBadge = '<span class="pill-badge" style="background:var(--s);color:var(--mute);border:1px solid var(--b)">Not Attempted</span>';
      } else {
        const best = resList[resList.length - 1];
        const maxScore = t.max_score || (pos * qCount) || 32;
        statusBadge = `<span class="pill-badge pill-green">Score: ${best.score} / ${maxScore}</span>`;
      }
    } else {
      statusBadge = `<span class="pill-badge pill-purple">${resList.length} Attempt${resList.length === 1 ? '' : 's'}</span>`;
    }

    return `
      <div class="refine-test-row">
        <div class="refine-test-row-main">
          <div class="refine-test-row-ico">
            ${ico('tests')}
          </div>
          <div class="refine-test-row-info">
            <div class="refine-test-row-title">
              <span>${E(t.name)}</span>
              <span class="pill-badge pill-blue" style="font-size:11px">${subObj ? E(subObj.name) : 'Course-wise'}</span>
            </div>
            <div class="refine-test-row-meta">
              <span>Sections: <b>${(t.sections || ['Physics', 'Chemistry', 'Mathematics']).join(', ')}</b></span>
              <span>Language: <b>${t.lang || 'EN + HI'}</b></span>
              <span>Calc: <b>${t.is_calc_allow ? 'Allowed' : 'Prohibited'}</b></span>
            </div>
          </div>
        </div>

        <div class="refine-test-row-stats">
          <div class="refine-test-stat-cell">
            <b>${qCount}</b>
            <small>Questions</small>
          </div>
          <div class="refine-test-stat-cell">
            <b>${t.min || 20}m</b>
            <small>Duration</small>
          </div>
          <div class="refine-test-stat-cell">
            <b>+${pos} / -${neg}</b>
            <small>Marking</small>
          </div>
          <div class="refine-test-stat-cell">
            ${statusBadge}
          </div>
        </div>

        <div class="refine-test-row-actions">
          ${isStudent ? `
            <button class="b1" style="font-size:12px;padding:6px 14px" onclick="startOnlineTest('${t.id}')">
              ${resList.length ? 'Retake Test' : 'Start Test'}
            </button>
          ` : `
            <button class="b2" style="font-size:12px;padding:5px 10px" onclick="startOnlineTest('${t.id}')">
              Preview CBT
            </button>
            ${tblDots('test', t.id)}
          `}
        </div>
      </div>
    `;
  }

  // Override ctests() to show tests inside courses as the Table UI matching the screenshot
  window.ctests = function (c) {
    const stf = me().role !== 'student';
    const courseTests = (D.tests || []).filter(t => t.course === c.id || !t.course || t.courseLabel === c.name || t.courseLabel === c.code || (c.id === 'k1' && ['t1', 't4', 't7'].includes(t.id)) || (c.id === 'k2' && ['t3', 't6'].includes(t.id)) || (c.id === 'k3' && ['t2', 't5'].includes(t.id)));
    const displayTests = courseTests.length ? courseTests : (D.tests || []).slice(0, 5);

    return `
      <div class="refine-test-table-card" style="margin-top:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px">
          <div>
            <h2 style="font-size:16px;font-weight:700;color:var(--ink);margin:0 0 2px">Course Assessments & Mock Tests</h2>
            <p style="font-size:12.5px;color:var(--mute);margin:0">CBT mock exams, subjective tests and evaluation assessments assigned to ${E(c.name)}</p>
          </div>
          ${stf ? `<button class="b1" onclick="et(null,'${c.id}')">+ Create CBT Assessment</button>` : ''}
        </div>

        ${window.renderTestsTable(displayTests, {
          course: c,
          pageKey: 'cTestPg_' + c.id,
          pageSize: 10,
          onPage: 'render()',
          onSearch: 'render()'
        })}
      </div>
    `;
  };

  /* ------------------------------------------------------------ */
  /* 1. INSTRUCTOR SIDE: REFINED FACULTY DASHBOARD                */
  /* ------------------------------------------------------------ */

  PG.dashInstructor = function () {
    const u = me() || { name: 'Meera Iyer', email: 'instructor@abcinstitute.demo', subject: 'Physics' };
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
      <!-- Faculty Profile Banner -->
      <div class="faculty-banner">
        <div class="faculty-profile-block">
          <div class="faculty-avatar-box">
            <img src="${av(u)}" alt="${E(u.name)}">
            <span class="faculty-online-dot" title="Active Faculty"></span>
          </div>
          <div class="faculty-details">
            <h2>Welcome back, ${E(u.name)}</h2>
            <div class="faculty-meta-tags">
              <span class="faculty-subject-pill">${ico('book')} ${E(u.subject || 'Physics')} Lead Faculty</span>
              <span>• ${E(u.email)}</span>
              <span>• Rating: <b style="color:#fbbf24">★ 4.9</b> (from 240+ students)</span>
            </div>
          </div>
        </div>
        <div class="faculty-quick-actions">
          <button class="b2" style="background:rgba(255,255,255,0.1);color:#fff;border-color:rgba(255,255,255,0.25)" onclick="et()">
            ${ico('tests')} + Create Quiz
          </button>
          <button class="b1" style="background:#0284c7;border-color:#0284c7" onclick="openFacultyScheduleLiveModal()">
            ${ico('video')} + Schedule Live Class
          </button>
        </div>
      </div>

      <!-- Quick Action Tools Grid -->
      <div class="faculty-tools-grid">
        <div class="faculty-tool-card" onclick="launchLiveClassroomModal(null, 'live_demo_1')">
          <div class="faculty-tool-ico ft-blue">${ico('video')}</div>
          <div>
            <b>Go Live Classroom</b>
            <small>Launch instant broadcast studio</small>
          </div>
        </div>
        <div class="faculty-tool-card" onclick="openFacultyScheduleLiveModal()">
          <div class="faculty-tool-ico ft-purple">${ico('calendar')}</div>
          <div>
            <b>Schedule Webinar</b>
            <small>Plan upcoming live lectures</small>
          </div>
        </div>
        <div class="faculty-tool-card" onclick="openFacultyHandoutUploadModal()">
          <div class="faculty-tool-ico ft-emerald">${ico('file')}</div>
          <div>
            <b>Upload Handouts</b>
            <small>Add PDFs, formula sheets & notes</small>
          </div>
        </div>
        <div class="faculty-tool-card" onclick="et()">
          <div class="faculty-tool-ico ft-amber">${ico('tests')}</div>
          <div>
            <b>Draft CBT Test</b>
            <small>Author MCQ & NAT assessments</small>
          </div>
        </div>
      </div>

      <!-- Metric KPI Cards -->
      <div class="metric-grid">
        ${renderKpiCard({ title: 'Assigned Courses', value: myCourses.length, trend: '↑ Active', sub: 'in curriculum portfolio', icon: 'courses', link: 'courses', variant: 0 })}
        ${renderKpiCard({ title: 'Enrolled Learners', value: myStudents.length, trend: '↑ +12%', sub: 'under guidance', icon: 'students', link: 'students', variant: 1 })}
        ${renderKpiCard({ title: 'Evaluated Quizzes', value: myTests.length, trend: '↑ Live', sub: 'scheduled tests', icon: 'tests', link: 'tests', variant: 2 })}
        ${renderKpiCard({ title: 'Avg. Cohort Score', value: 86, suffix: '%', trend: '↑ Top Tier', sub: 'overall accuracy', icon: 'award', link: 'tests', variant: 3 })}
      </div>

      <!-- Live Session & Teaching Schedule -->
      <div class="dash-row">
        <!-- Teaching Delivery Analytics Chart -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Teaching Delivery & Classroom Hours</div>
              <div class="dash-card-sub">Lecture hours and doubt-resolution sessions delivered</div>
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
                <linearGradient id="instrGradRefined" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0284c7"/>
                  <stop offset="100%" stop-color="#bae6fd"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="540" y2="40" stroke="var(--b)" stroke-dasharray="4"/>
              <line x1="0" y1="90" x2="540" y2="90" stroke="var(--b)" stroke-dasharray="4"/>
              <line x1="0" y1="140" x2="540" y2="140" stroke="var(--b)" stroke-dasharray="4"/>
              <line x1="0" y1="160" x2="540" y2="160" stroke="var(--b)"/>
              ${chartData.labels.map((l, i) => {
                const count = chartData.labels.length;
                const slotW = 540 / count;
                const barW = Math.min(36, slotW * 0.45);
                const x = i * slotW + (slotW - barW) / 2;
                const h = Math.max(14, (chartData.hours[i] / maxH) * 120);
                const y = 160 - h;
                return `
                  <rect class="svg-bar" x="${x}" y="${y}" width="${barW}" height="${h}" rx="6" fill="url(#instrGradRefined)"/>
                  <text x="${x + barW / 2}" y="176" text-anchor="middle" font-size="11" fill="var(--mute)" font-family="Poppins">${l}</text>
                `;
              }).join('')}
            </svg>
          </div>
        </div>

        <!-- Upcoming Live Lectures Strip -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Live Class Schedule</div>
              <div class="dash-card-sub">Next scheduled webinars & faculty broadcasts</div>
            </div>
            <button class="b2" style="font-size:11px;padding:3px 8px" onclick="openFacultyScheduleLiveModal()">+ Schedule</button>
          </div>

          <div class="live-strip-card">
            <div class="live-strip-left">
              <span class="live-pulse-badge"><span class="pulse-circle"></span> Today</span>
              <div>
                <b style="font-size:13.5px;color:var(--ink);display:block">Newton's Laws of Motion Problem Drill</b>
                <small style="color:var(--mute)">5:00 PM · 45 Students Enrolled · JEE Batch</small>
              </div>
            </div>
            <button class="b1" style="padding:5px 12px;font-size:12px" onclick="launchLiveClassroomModal(null, 'live_1')">
              Launch Room
            </button>
          </div>

          <div class="live-strip-card">
            <div class="live-strip-left">
              <span class="pill-badge pill-blue">Friday</span>
              <div>
                <b style="font-size:13.5px;color:var(--ink);display:block">Weekly Doubt Clearance & PYQ Session</b>
                <small style="color:var(--mute)">6:30 PM · Open Cohort · Live Interactive</small>
              </div>
            </div>
            <button class="b2" style="padding:5px 12px;font-size:12px" onclick="toast('Room will open 10 minutes prior to session')">
              Manage
            </button>
          </div>

          <div class="live-strip-card" style="margin-bottom:0">
            <div class="live-strip-left">
              <span class="pill-badge pill-green">Recorded</span>
              <div>
                <b style="font-size:13.5px;color:var(--ink);display:block">Kinematics 2D & Projectile Motion</b>
                <small style="color:var(--mute)">Replay uploaded · 58 student views</small>
              </div>
            </div>
            <button class="b2" style="padding:5px 12px;font-size:12px" onclick="openLecturePlayerModal(null, null, 'l1')">
              Review
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Portfolio: Assigned Courses & Quick Links -->
      <div class="dash-row">
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">Curriculum Delivery Progress</div>
              <div class="dash-card-sub">Syllabus delivery across active programs</div>
            </div>
          </div>
          <div class="gauge-box">
            <svg class="gauge-svg" viewBox="0 0 200 110">
              <path class="gauge-bg" d="M 20 100 A 80 80 0 0 1 180 100" />
              <path class="gauge-val" d="M 20 100 A 80 80 0 0 1 180 100" stroke="#0284c7" stroke-dasharray="251.2" stroke-dashoffset="45" />
            </svg>
            <div class="gauge-center-text">
              <b class="stat-counter" data-target="82" data-suffix="%">82%</b>
              <small>Syllabus Completed</small>
            </div>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-item"><span class="breakdown-sq" style="background:#0284c7"></span><span><b>14</b> Completed Video Modules</span></div>
            <div class="breakdown-item"><span class="breakdown-sq" style="background:var(--b)"></span><span><b>3</b> Upcoming Live Chapters</span></div>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">My Teaching Portfolio</div>
              <div class="dash-card-sub">Courses in which you teach subjects</div>
            </div>
            <button class="b2" style="font-size:11px;padding:3px 8px" onclick="go('courses')">View All</button>
          </div>
          <div class="task-list">
            ${myCourses.map(c => `
              <div class="task-item">
                <div class="task-left">
                  <div class="task-ico" style="background:#e0f2fe;color:#0284c7">${ico('courses')}</div>
                  <div class="task-info">
                    <b>${E(c.name)}</b>
                    <small>${c.lessons.length} lessons · ${c.code} · ${c.access}</small>
                  </div>
                </div>
                <button class="b2" onclick="oc('${c.id}')">Explore</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  };

  /* ------------------------------------------------------------ */
  /* 2. INSIDE COURSE CONTENT EVERYWHERE: REFINED HERO & TABS     */
  /* ------------------------------------------------------------ */

  window.cdet = function () {
    const c0 = D.courses.find(x => x.id === S.cv);
    if (!c0) {
      S.cv = null;
      return PG.courses();
    }
    const c = ensure(c0);
    const tab = TABS2.includes(S.ct) ? S.ct : 'Overview';
    const x = cstat(c);

    let bodyContent;
    if (tab === 'Overview') bodyContent = ovw(c, x);
    else if (tab === 'Subjects') bodyContent = S.sv && subOf(c, S.sv) ? refinedSubjectDetail(c, subOf(c, S.sv)) : refinedSubjectGrid(c);
    else if (tab === 'Teachers') bodyContent = tgrid(c);
    else if (tab === 'Live classes') bodyContent = lgrid(c);
    else if (tab === 'Tests') bodyContent = ctests(c);
    else if (tab === 'Video Series') bodyContent = vseriesGrid(c);
    else if (tab === 'Test Series') bodyContent = tseriesGrid(c);
    else if (tab === 'Announcements') bodyContent = agrid(c);
    else bodyContent = rgrid(c);

    return `
      <!-- Refined Course Hero Banner -->
      <div class="refine-course-hero">
        <div class="refine-course-hero-cover" style="background-image: url('${getLiveCourseImg(c)}')">
          <div class="refine-course-hero-overlay">
            <div class="refine-course-hero-top">
              <button type="button" class="refine-back-btn" onclick="S.cv=null;S.sv=null;render()">
                ‹ All Courses
              </button>
              <div class="refine-course-hero-badges">
                ${st(c.status)}
                <span class="refine-hero-chip">${c.access}${c.price ? ' · ' + R(c.price) : ''}</span>
                ${hasC() ? `<span class="refine-hero-chip">${E(c.mode || 'Both')}</span>` : ''}
                <span class="refine-hero-chip">${E(c.code)}</span>
              </div>
            </div>
            <div class="refine-course-hero-meta">
              <h1>${E(c.name)}</h1>
              <p>${E(c.desc || 'A structured mentor-led learning program with interactive video lectures, chapter notes, live doubt-clearing sessions and CBT assessments.')}</p>
            </div>
          </div>
        </div>

        <!-- Course Metrics & Quick Toolbar -->
        <div class="refine-course-bar">
          <div class="refine-course-stats">
            <div class="refine-cstat-item">
              <b>${x.subs}</b>
              <small>Subjects</small>
            </div>
            <div class="refine-cstat-item">
              <b>${x.lect}</b>
              <small>Lectures</small>
            </div>
            <div class="refine-cstat-item">
              <b>${x.notes}</b>
              <small>Notes / PDFs</small>
            </div>
            <div class="refine-cstat-item">
              <b>${x.studs}</b>
              <small>Enrolled Students</small>
            </div>
            <div class="refine-cstat-item">
              <b style="color:#fbbf24">★ ${x.rating}</b>
              <small>Student Rating</small>
            </div>
          </div>

          <div class="refine-course-tools">
            ${can() ? `
              <button class="b2" style="font-size:12px;padding:6px 12px" onclick="openCourseHandoutModal('${c.id}')">${ico('file')} + Handout</button>
              <button class="b2" style="font-size:12px;padding:6px 12px" onclick="openCourseLiveClassModal('${c.id}')">${ico('video')} + Live Class</button>
              <button class="b2" style="font-size:12px;padding:6px 12px" onclick="ecourse('${c.id}')">Edit Course</button>
            ` : ''}
            ${me().role === 'instructor' ? `
              <button class="b1" style="font-size:12px;padding:6px 14px" onclick="launchLiveClassroomModal('${c.id}', null)">${ico('video')} Start Live Stream</button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Segmented Course Navigation Tabs -->
      <div class="refine-course-tabs">
        ${TABS2.map(t => {
          let count = '';
          if (t === 'Subjects') count = x.subs;
          else if (t === 'Live classes') count = (c.live || []).length;
          else if (t === 'Tests') count = D.tests.filter(z => z.course === c.id).length;
          else if (t === 'Video Series') count = (c.videoSeries || []).length;
          else if (t === 'Test Series') count = (c.testSeries || []).length;
          else if (t === 'Announcements') count = (c.ann || []).length;
          else if (t === 'Reviews') count = (c.rev || []).length;

          return `
            <button type="button" class="refine-ctab-btn ${t === tab ? 'active' : ''}" onclick="S.sv=null;sct('${t}')">
              <span>${t}</span>
              ${count !== '' ? `<span class="refine-ctab-badge">${count}</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Active Tab Body -->
      ${bodyContent}
    `;
  };

  /* ------------------------------------------------------------ */
  /* 3. REFINED SUBJECTS GRID & SUBJECT DETAIL VIEW               */
  /* ------------------------------------------------------------ */

  function refinedSubjectGrid(c) {
    const stf = me().role !== 'student';
    const adm = can();

    return `
      ${stf ? `
        <div class="bar" style="margin-bottom:16px">
          <button class="b1" onclick="esub('${c.id}')">+ Add Subject Module</button>
        </div>
      ` : ''}
      <div class="refine-subject-grid">
        ${c.subs.map((s, i) => {
          const t = U(s.teacher);
          const tn = D.tests.filter(z => z.sub === s.id).length;
          const pr = D.prog[S.uid + '|' + c.id] || [];
          const dn = s.lessons.filter(l => pr.includes(l.id)).length;
          const pctDone = s.lessons.length ? Math.round((dn / s.lessons.length) * 100) : 0;
          const col = subCol(i);

          return `
            <div class="refine-subject-card">
              <div class="refine-subject-accent" style="background:${col}"></div>
              <div class="refine-subject-head">
                <div class="refine-subject-ico" style="background:${col}">
                  ${E(s.name[0])}
                </div>
                <div class="refine-subject-title-box">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                    <b>${E(s.name)}</b>
                    <span class="pill-badge" style="font-size:10px;padding:1px 6px;background:${col}18;color:${col};border:1px solid ${col}33">Module</span>
                  </div>
                  <small style="color:var(--mute);font-size:11.5px">Core curriculum subject</small>
                </div>
              </div>

              <!-- Refined 3-cell metric strip (No text wrap or awkward breaks) -->
              <div class="refine-subject-stat-bar">
                <div class="sub-stat-item">
                  <span class="sub-stat-ico" style="color:#0284c7">${ico('video', 14)}</span>
                  <div>
                    <b>${s.lessons.length}</b>
                    <small>Lectures</small>
                  </div>
                </div>
                <div class="sub-stat-divider"></div>
                <div class="sub-stat-item">
                  <span class="sub-stat-ico" style="color:#8b5cf6">${ico('file', 14)}</span>
                  <div>
                    <b>${s.notes.length}</b>
                    <small>Notes</small>
                  </div>
                </div>
                <div class="sub-stat-divider"></div>
                <div class="sub-stat-item">
                  <span class="sub-stat-ico" style="color:#10b981">${ico('tests', 14)}</span>
                  <div>
                    <b>${tn}</b>
                    <small>Tests</small>
                  </div>
                </div>
              </div>

              <div class="refine-subject-teacher">
                <img src="${av(t)}" alt="">
                <div style="flex:1;min-width:0">
                  <b style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t ? E(t.name) : 'Faculty TBA'}</b>
                  <small>${t && t.subject ? E(t.subject) + ' Faculty' : 'Subject Instructor'}</small>
                </div>
              </div>

              ${me().role === 'student' ? `
                <div style="padding:8px 18px 0">
                  <div class="bar2"><i style="width:${pctDone}%"></i></div>
                  <small style="color:var(--mute);font-size:11px">${dn}/${s.lessons.length} lectures completed (${pctDone}%)</small>
                </div>
              ` : ''}

              <div class="refine-subject-foot">
                <button class="b1" style="flex:1" onclick="S.sv='${s.id}';S.sbt='Lectures';render()">
                  Explore Subject Curriculum ›
                </button>
                ${stf ? `
                  <div style="display:flex;gap:4px">
                    <button class="b2" title="Edit Subject" style="padding:6px 10px;font-size:12px" onclick="esub('${c.id}','${s.id}')">Edit</button>
                    ${adm ? `<button class="b2 dng" title="Delete Subject" style="padding:6px 10px;font-size:12px" onclick="dsub('${c.id}','${s.id}')">×</button>` : ''}
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function refinedSubjectDetail(c, s) {
    const i = c.subs.indexOf(s);
    const tab = ['Lectures', 'Notes', 'Tests'].includes(S.sbt) ? S.sbt : 'Lectures';
    const stf = me().role !== 'student';
    const t = U(s.teacher);
    const col = subCol(i);
    const pr = D.prog[S.uid + '|' + c.id] || [];

    let subViewBody;
    if (tab === 'Lectures') {
      subViewBody = `
        ${stf ? `
          <div class="bar" style="margin-bottom:14px">
            <button class="b1" onclick="elec('${c.id}','${s.id}')">+ Add Video Lecture</button>
          </div>
        ` : ''}
        <div class="refine-lecture-grid">
          ${s.lessons.map((l, j) => {
            const isCompleted = pr.includes(l.id);
            const liveImg = getLiveLectureImg(l, s.name, j);

            return `
              <div class="refine-lecture-card">
                <div class="refine-video-thumb" onclick="openLecturePlayerModal('${c.id}','${s.id}','${l.id}')">
                  <img class="refine-video-img" src="${liveImg}" alt="${E(l.title)}" loading="lazy">
                  <div class="refine-thumb-overlay"></div>
                  <div class="refine-play-button">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <span class="refine-duration-chip">${E(l.dur || '24:10')}</span>
                  ${isCompleted ? `<span class="refine-done-badge">✓ Completed</span>` : ''}
                </div>
                <div class="refine-lecture-body">
                  <div>
                    <b>Lecture ${j + 1}: ${E(l.title)}</b>
                    <p>${E(l.desc || 'Core concept lecture covering theoretical formulations, step-by-step solved drills and exam takeaways.')}</p>
                  </div>
                  <div class="refine-lecture-actions">
                    <button class="b1" style="font-size:12px;padding:4px 12px" onclick="openLecturePlayerModal('${c.id}','${s.id}','${l.id}')">
                      ▶ Watch
                    </button>
                    ${me().role === 'student' ? `
                      <button class="b2" style="font-size:12px;padding:4px 10px" onclick="lt('${c.id}','${l.id}')">
                        ${isCompleted ? '✓ Completed' : 'Mark Done'}
                      </button>
                    ` : `
                      <div style="display:flex;gap:4px">
                        <button class="b2" style="font-size:11px;padding:4px 8px" onclick="elec('${c.id}','${s.id}','${l.id}')">Edit</button>
                        <button class="b2 dng" style="font-size:11px;padding:4px 8px" onclick="dlec('${c.id}','${s.id}','${l.id}')">×</button>
                      </div>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('') || '<div class="em">No video lectures uploaded yet for this subject.</div>'}
        </div>
      `;
    } else if (tab === 'Notes') {
      subViewBody = `
        ${stf ? `
          <div class="bar" style="margin-bottom:14px">
            <button class="b1" onclick="enote('${c.id}','${s.id}')">+ Upload Study Handout</button>
          </div>
        ` : ''}
        <div class="refine-notes-grid">
          ${s.notes.map(n => {
            const ext = (n.type || 'PDF').toLowerCase();
            const cls = ext === 'pdf' ? 'nt-pdf' : ext === 'docx' ? 'nt-docx' : 'nt-ppt';
            return `
              <div class="refine-note-card">
                <div class="refine-note-type-box ${cls}">
                  ${E(n.type || 'PDF')}
                </div>
                <div class="refine-note-info">
                  <b>${E(n.title)}</b>
                  <small>${E(n.size || '1.4 MB')} · Uploaded ${E(n.at || 'Recently')}</small>
                </div>
                <div style="display:flex;gap:6px">
                  <button class="b1" style="font-size:11.5px;padding:4px 10px" onclick="openDocumentViewerModal('${c.id}','${s.id}','${n.id}')">
                    Preview
                  </button>
                  <button class="b2" style="font-size:11.5px;padding:4px 8px" title="Download Document" onclick="noteAct('${c.id}','${s.id}','${n.id}',1)">
                    ${ico('down')}
                  </button>
                  ${stf ? `
                    <button class="b2 dng" style="font-size:11.5px;padding:4px 8px" onclick="dnote('${c.id}','${s.id}','${n.id}')">×</button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('') || '<div class="em">No study handouts uploaded yet.</div>'}
        </div>
      `;
    } else {
      // Row-based Test View for Subject Tests
      const tl = D.tests.filter(z => (z.course === c.id && z.sub === s.id) || (z.sub === s.id));
      subViewBody = `
        ${stf ? `
          <div class="bar" style="margin-bottom:14px">
            <button class="b1" onclick="et(null,'${c.id}','${s.id}')">+ Create Subject Assessment</button>
          </div>
        ` : ''}
        <div class="refine-test-list">
          ${tl.map(z => renderTestRowItem(z, c)).join('') || '<div class="em">No assessments created for this subject yet.</div>'}
        </div>
      `;
    }

    return `
      <!-- Subject Header Card -->
      <div class="sbanner" style="--sc:${col};margin-bottom:16px">
        <button type="button" class="b2" onclick="S.sv=null;render()">‹ Back to All Subjects</button>
        <div class="sb-main">
          <div>
            <h2>${E(s.name)}</h2>
            <p>${s.lessons.length} video lectures • ${s.notes.length} study handouts • ${D.tests.filter(z => z.sub === s.id).length} assessments</p>
          </div>
          ${t ? `
            <div class="sb-t">
              <img src="${av(t)}" alt="">
              <div>
                <b>${E(t.name)}</b>
                <small>${t.subject || 'Faculty'} · ★ ${trat(t)}</small>
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Sub Navigation Bar -->
      <div class="ctabs" style="margin-bottom:16px">
        ${['Lectures', 'Notes', 'Tests'].map(z => `
          <button type="button" class="${z === tab ? 'on' : ''}" onclick="S.sbt='${z}';render()">
            ${z === 'Lectures' ? ico('video') : z === 'Notes' ? ico('file') : ico('tests')}
            ${z}
          </button>
        `).join('')}
      </div>

      ${subViewBody}
    `;
  }

  /* ------------------------------------------------------------ */
  /* 4. PACKAGES VIEW WITH LIVE INTERNET IMAGES                   */
  /* ------------------------------------------------------------ */

  const origPackages = PG.packages;

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
              const liveThumb = getLivePackageImg(pkg);

              return `
                <div class="cd cc pkg-card" style="display:flex;flex-direction:column;justify-content:space-between">
                  <div>
                    <div class="cimw pkg-thumb" style="height:170px;position:relative">
                      <img class="cim pkg-thumb-img" src="${liveThumb}" alt="${E(pkg.name)}" loading="lazy">
                      <div class="pkg-thumb-overlay"></div>
                      <span class="st ${pkg.access === 'Free' ? 'gn' : ''}" style="position:absolute;top:10px;right:10px;z-index:3;box-shadow:0 2px 6px rgba(0,0,0,0.3)">
                        ${pkg.access === 'Paid' ? R(pkg.price) : 'Free Package'}
                      </span>
                      <span class="pill-badge pill-blue" style="position:absolute;bottom:10px;left:10px;z-index:3">
                        ${b ? E(b.name) : 'All Cohorts'}
                      </span>
                    </div>
                    <div style="padding:14px 14px 6px">
                      <b style="font-size:15px;display:block;margin-bottom:6px;line-height:1.35;color:var(--ink)">${E(pkg.name)}</b>
                      <p style="font-size:12px;color:var(--mute);margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${E(pkg.desc || 'Comprehensive learning bundle.')}</p>

                      <!-- Courses Tags -->
                      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">
                        ${courseObjs.map(c => `<span class="chip2" style="font-size:11px">${E(c.name)}</span>`).join('')}
                      </div>

                      <!-- Package Breakdown Specs -->
                      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;background:var(--s);border:1px solid var(--b);padding:10px;border-radius:8px;font-size:11.5px;color:var(--ink);margin-bottom:10px">
                        <div style="display:flex;align-items:center;gap:5px">${ico('video', 14)} <b>${(pkg.videoSeries || []).length}</b> Video Series</div>
                        <div style="display:flex;align-items:center;gap:5px">${ico('tests', 14)} <b>${(pkg.testSeries || []).length}</b> Test Series</div>
                        <div style="display:flex;align-items:center;gap:5px">${ico('book', 14)} <b>${(pkg.lectures || []).length}</b> Key Lectures</div>
                        <div style="display:flex;align-items:center;gap:5px">${ico('calendar', 14)} <b>${(pkg.tests || []).length}</b> Quizzes / Mocks</div>
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

  /* ------------------------------------------------------------ */
  /* 5. INTERACTIVE LECTURE VIDEO PLAYER MODAL                    */
  /* ------------------------------------------------------------ */

  window.openLecturePlayerModal = function (cid, sid, lid) {
    let lessonTitle = 'Core Formulations & Step-by-Step Drills';
    let courseName = 'Curriculum Masterclass';
    let duration = '24:10';

    if (cid) {
      const c = D.courses.find(x => x.id === cid);
      if (c) {
        courseName = c.name;
        if (sid && c.subs) {
          const s = c.subs.find(sb => sb.id === sid);
          if (s && s.lessons) {
            const l = s.lessons.find(ls => ls.id === lid);
            if (l) {
              lessonTitle = l.title;
              duration = l.dur || duration;
            }
          }
        }
      }
    }

    const content = `
      <div class="refine-player-wrap">
        <div class="refine-player-main">
          <div class="refine-video-screen">
            <video id="refineVideoEl" src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" controls autoplay playsinline style="width:100%;height:100%"></video>
          </div>
          <div class="refine-player-controls">
            <div class="refine-scrub-bar" onclick="toast('Fast forwarded 10 seconds')">
              <div class="refine-scrub-prog"></div>
            </div>
            <div class="refine-ctrl-row">
              <div style="display:flex;align-items:center;gap:10px">
                <button class="refine-ctrl-btn" onclick="const v=$('#refineVideoEl'); if(v.paused) v.play(); else v.pause();">▶ / ⏸ Play/Pause</button>
                <span>08:42 / ${duration}</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <button class="refine-ctrl-btn" onclick="const v=$('#refineVideoEl'); v.playbackRate = v.playbackRate === 2 ? 1 : v.playbackRate + 0.25; toast('Playback Speed: ' + v.playbackRate + 'x')">Speed 1.25x</button>
                <button class="refine-ctrl-btn" onclick="toast('HD 1080p stream active')">1080p HD</button>
              </div>
            </div>
          </div>
        </div>

        <div class="refine-player-side">
          <b style="font-size:14px;color:var(--ink);line-height:1.3">${E(lessonTitle)}</b>
          <small style="color:var(--mute)">Part of ${E(courseName)}</small>
          
          <div style="background:var(--card);border:1px solid var(--b);border-radius:8px;padding:10px;font-size:12px;line-height:1.5">
            <b>Key Chapter Concepts:</b>
            <ul style="padding-left:16px;margin:6px 0 0;color:var(--mute)">
              <li>Fundamental Free-Body Diagrams</li>
              <li>Limiting vs. Kinetic Friction Equations</li>
              <li>Conservation of Linear Momentum in 2D</li>
            </ul>
          </div>

          <div style="margin-top:auto;display:flex;flex-direction:column;gap:8px">
            ${cid && lid ? `
              <button class="b1" style="width:100%;font-size:12.5px" onclick="lt('${cid}','${lid}');closeM(1);toast('Lecture progress updated!')">
                ✓ Mark as Completed
              </button>
            ` : ''}
            <button class="b2" style="width:100%;font-size:12.5px" onclick="toast('Simulated handout downloaded for this session')">
              ${ico('down')} Download Lecture Notes
            </button>
          </div>
        </div>
      </div>
    `;

    modal(
      `Video Lecture · ${E(lessonTitle)}`,
      content,
      null,
      '',
      '',
      `<button class="b2" onclick="closeM(1)">Close Player</button>`
    );
    $('.md').style.maxWidth = '920px';
  };

  /* ------------------------------------------------------------ */
  /* 6. INTERACTIVE DOCUMENT & NOTES VIEWER MODAL                 */
  /* ------------------------------------------------------------ */

  window.openDocumentViewerModal = function (cid, sid, nid) {
    let docTitle = 'High-Yield Formula Sheet & Revision Handout';
    let docType = 'PDF Document';

    if (cid && sid && nid) {
      const c = D.courses.find(x => x.id === cid);
      if (c && c.subs) {
        const s = c.subs.find(sb => sb.id === sid);
        if (s && s.notes) {
          const n = s.notes.find(nt => nt.id === nid);
          if (n) {
            docTitle = n.title;
            docType = n.type || 'PDF';
          }
        }
      }
    }

    const content = `
      <div class="refine-doc-viewer">
        <div class="refine-doc-toolbar">
          <div style="display:flex;align-items:center;gap:8px">
            <span class="pill-badge pill-blue">${docType}</span>
            <small style="color:var(--mute)">Page <b>1</b> of <b>8</b> • 100% Zoom</small>
          </div>
          <div style="display:flex;gap:6px">
            <button class="b2" style="font-size:11px;padding:3px 8px" onclick="toast('Zoom In: 125%')">🔍 +</button>
            <button class="b2" style="font-size:11px;padding:3px 8px" onclick="toast('Zoom Out: 75%')">🔍 -</button>
            <button class="b1" style="font-size:11px;padding:3px 10px" onclick="window.print()">${ico('printer')} Print Document</button>
          </div>
        </div>

        <div class="refine-doc-paper">
          <h2 style="font-size:20px;font-family:system-ui;margin:0 0 8px;color:#0f172a">${E(docTitle)}</h2>
          <p style="color:#64748b;font-size:12px;font-family:system-ui;margin-bottom:20px">Prepared by Senior Faculty & Subject Specialists • Trigrexam Digital Vault</p>
          
          <hr style="border:0;border-top:1px solid #e2e8f0;margin-bottom:20px">

          <h3 style="font-size:15px;color:#0284c7;font-family:system-ui;margin-bottom:8px">1. Core Axioms & Fundamental Postulates</h3>
          <p>Let an isolated physical system be subjected to a vector sum of external impulses. Newton's second law is generalized as dP/dt = F_ext. In rotating reference frames, pseudo-forces (Coriolis acceleration and Centrifugal force) must be introduced to restore Newtonian equations of motion.</p>

          <h3 style="font-size:15px;color:#0284c7;font-family:system-ui;margin:16px 0 8px">2. High-Yield Examination Summary Tables</h3>
          <p>• Kinematic relation in 1D: v² = u² + 2as<br>
          • Total Work done by conservative force: W = -ΔU<br>
          • Center of Mass position: R_cm = (Σ m_i · r_i) / (Σ m_i)</p>
        </div>
      </div>
    `;

    modal(
      `Document Viewer · ${E(docTitle)}`,
      content,
      null,
      '',
      '',
      `
        <button class="b2" onclick="closeM(1)">Close</button>
        <button class="b1" onclick="toast('Downloaded ${E(docTitle)}')">${ico('down')} Download File</button>
      `
    );
    $('.md').style.maxWidth = '780px';
  };

  /* ------------------------------------------------------------ */
  /* 7. INTERACTIVE LIVE CLASSROOM BROADCAST SIMULATOR            */
  /* ------------------------------------------------------------ */

  window.launchLiveClassroomModal = function (cid, lid) {
    const isInstr = me().role === 'instructor' || can();
    const content = `
      <div style="display:grid;grid-template-columns:1fr 280px;gap:14px;background:#0b0f19;padding:14px;border-radius:12px;color:#fff">
        <!-- Main Video Screen -->
        <div style="display:flex;flex-direction:column;gap:10px">
          <div style="position:relative;background:#000;border-radius:8px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;overflow:hidden">
            <video src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover"></video>
            
            <div style="position:absolute;top:10px;left:10px;display:flex;gap:6px">
              <span class="live-pulse-badge" style="background:rgba(239,68,68,0.9);color:#fff"><span class="pulse-circle"></span> LIVE BROADCAST</span>
              <span style="background:rgba(0,0,0,0.6);padding:3px 8px;border-radius:999px;font-size:11px">48 Learners Online</span>
            </div>

            <div style="position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,0.65);padding:4px 10px;border-radius:6px;font-size:12px">
              Presenter: <b>${isInstr ? me().name : 'Dr. Meera Iyer (Physics)'}</b>
            </div>
          </div>

          <!-- Presenter Controls -->
          <div style="display:flex;justify-content:space-between;align-items:center;background:#172033;padding:8px 14px;border-radius:8px">
            <div style="display:flex;gap:8px">
              <button class="b2" style="font-size:11.5px;padding:4px 10px;background:#1e293b;color:#fff;border-color:#334155" onclick="toast('Mic unmuted')">🎤 Mic On</button>
              <button class="b2" style="font-size:11.5px;padding:4px 10px;background:#1e293b;color:#fff;border-color:#334155" onclick="toast('HD WebCam active')">📹 Camera</button>
              <button class="b2" style="font-size:11.5px;padding:4px 10px;background:#1e293b;color:#fff;border-color:#334155" onclick="toast('Digital Whiteboard loaded')">🖊 Whiteboard</button>
            </div>
            <button class="b1" style="background:#dc2626;border-color:#dc2626;font-size:11.5px;padding:4px 12px" onclick="closeM(1);toast('Live broadcast terminated')">
              End Stream
            </button>
          </div>
        </div>

        <!-- Live Chat / Doubt Feed -->
        <div style="display:flex;flex-direction:column;background:#151b26;border:1px solid #252d3a;border-radius:8px;padding:12px;font-size:12px">
          <b style="font-size:13px;border-bottom:1px solid #252d3a;padding-bottom:8px;margin-bottom:8px;display:flex;justify-content:space-between">
            <span>Live Learner Doubts</span>
            <span style="color:#10b981">● Connected</span>
          </b>
          <div style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;max-height:260px;margin-bottom:8px" id="liveChatMessages">
            <div><b style="color:#38bdf8">Aarav Mehta:</b> Sir, could you repeat the boundary condition at t=0?</div>
            <div><b style="color:#a855f7">Isha Gupta:</b> Is the friction coefficient kinetic or static here?</div>
            <div><b style="color:#10b981">Rohan Das:</b> Understood! Acceleration is 2 m/s².</div>
          </div>
          <div style="display:flex;gap:4px">
            <input type="text" id="liveChatInput" placeholder="Reply to class..." style="background:#0d1117;border:1px solid #252d3a;color:#fff;border-radius:6px;padding:4px 8px;font-size:11.5px;flex:1">
            <button class="b1" style="padding:4px 10px;font-size:11px" onclick="
              const inp = $('#liveChatInput');
              if (inp.value.trim()) {
                const box = $('#liveChatMessages');
                box.innerHTML += '<div><b style=\'color:#f59e0b\'>' + (me() ? me().name : 'Faculty') + ':</b> ' + E(inp.value.trim()) + '</div>';
                inp.value = '';
                box.scrollTop = box.scrollHeight;
              }
            ">Send</button>
          </div>
        </div>
      </div>
    `;

    modal(
      'Live Interactive Classroom Broadcaster',
      content,
      null,
      '',
      '',
      `<button class="b2" onclick="closeM(1)">Minimize View</button>`
    );
    $('.md').style.maxWidth = '920px';
  };

  /* ------------------------------------------------------------ */
  /* 8. QUICK FACULTY SCHEDULING & HANDOUT UPLOAD MODALS          */
  /* ------------------------------------------------------------ */

  window.openFacultyScheduleLiveModal = function (defaultCid) {
    const courses = D.courses || [];
    const content = `
      <div style="display:grid;gap:12px;font-size:13px">
        <label>Live Class Topic / Title *
          <input id="fsc_title" placeholder="e.g. Mechanics Newton's Laws Problem Solving Live Drill" value="Doubt Clearing & Problem Solving Session">
        </label>
        <div class="g2">
          <label>Target Course *
            <select id="fsc_course">
              ${courses.map(c => `<option value="${c.id}" ${defaultCid === c.id ? 'selected' : ''}>${E(c.name)}</option>`).join('')}
            </select>
          </label>
          <label>Subject Domain
            <input id="fsc_subj" value="${E(me() ? (me().subject || 'Physics') : 'Physics')}">
          </label>
        </div>
        <div class="g2">
          <label>Date and Scheduled Time *
            <input id="fsc_date" value="Tomorrow, 5:00 PM">
          </label>
          <label>Expected Duration
            <select id="fsc_dur">
              <option value="45 min">45 Minutes</option>
              <option value="60 min" selected>60 Minutes (1 Hour)</option>
              <option value="90 min">90 Minutes</option>
            </select>
          </label>
        </div>
      </div>
    `;

    modal(
      'Schedule Faculty Live Class',
      content,
      () => {
        const title = $('#fsc_title')?.value.trim();
        const cid = $('#fsc_course')?.value;
        const date = $('#fsc_date')?.value.trim();

        if (!title) return toast('Class title is required');
        const c = D.courses.find(x => x.id === cid);
        if (c) {
          c.live = c.live || [];
          c.live.unshift({
            id: id('v'),
            t: title,
            d: date || 'Tomorrow, 5:00 PM',
            who: me().name,
            st: 'Scheduled',
            video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          });
          save();
          render();
          toast(`Live class “${title}” scheduled successfully!`);
        }
      },
      '',
      'Schedule Class'
    );
  };

  window.openFacultyHandoutUploadModal = function (defaultCid) {
    const courses = D.courses || [];
    const content = `
      <div style="display:grid;gap:12px;font-size:13px">
        <label>Handout / Resource Title *
          <input id="fup_title" placeholder="e.g. Kinematics High-Yield Cheat Sheet & PYQs" value="Comprehensive Module Notes">
        </label>
        <div class="g2">
          <label>Target Course *
            <select id="fup_course">
              ${courses.map(c => `<option value="${c.id}" ${defaultCid === c.id ? 'selected' : ''}>${E(c.name)}</option>`).join('')}
            </select>
          </label>
          <label>Document Format
            <select id="fup_type">
              <option value="PDF" selected>PDF Handout</option>
              <option value="DOCX">DOCX Word Document</option>
              <option value="PPT">Presentation Deck (PPT)</option>
            </select>
          </label>
        </div>
        <div style="border:1.5px dashed var(--b);border-radius:10px;padding:20px;text-align:center;background:var(--s)">
          <div style="font-size:26px;color:#0284c7;margin-bottom:4px">${ico('up')}</div>
          <b>Choose Handout Document File</b>
          <small style="display:block;color:var(--mute);margin-top:2px">Supported formats: PDF, DOCX, PPTX (Max 25 MB)</small>
          <input type="file" style="margin-top:10px;font-size:12px">
        </div>
      </div>
    `;

    modal(
      'Upload Study Handout & Notes',
      content,
      () => {
        const title = $('#fup_title')?.value.trim();
        const cid = $('#fup_course')?.value;
        const type = $('#fup_type')?.value || 'PDF';

        if (!title) return toast('Document title is required');
        const c = D.courses.find(x => x.id === cid);
        if (c) {
          c.notes = c.notes || [];
          c.notes.unshift({
            t: title,
            s: `${type} · 1.8 MB · Uploaded just now`
          });
          if (c.subs && c.subs.length) {
            c.subs[0].notes = c.subs[0].notes || [];
            c.subs[0].notes.unshift({
              id: id('n'),
              title,
              type,
              size: '1.8 MB',
              at: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            });
          }
          save();
          render();
          toast(`Handout “${title}” published to student library!`);
        }
      },
      '',
      'Upload Handout'
    );
  };

  window.openCourseHandoutModal = function (cid) {
    openFacultyHandoutUploadModal(cid);
  };

  window.openCourseLiveClassModal = function (cid) {
    openFacultyScheduleLiveModal(cid);
  };

})();
