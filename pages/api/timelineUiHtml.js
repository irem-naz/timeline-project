export default function timelineUiHtml(data) {
    const entries = Array.isArray(data && data.entries) ? data.entries : [];
    const safeData = { ...data, entries };
    const json = JSON.stringify(safeData).replace(/</g, '\u003c');
    return `
      <html>
        <head>
          <title>Timeline View</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Alumni+Sans:wght@700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
          <style>
            html, body {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            h1 {
              font-family: 'Alumni Sans', sans-serif;
              font-size: 3.5em;
              letter-spacing: 0.03em;
              text-align: center;
              margin-bottom: 0.5em;
            }
            .filters {
              margin-top: 2.5em;
              display: flex;
              gap: 2.5em;
              justify-content: center;
              align-items: center;
            }
            .filters label, .filters select { font-family: 'Montserrat', sans-serif; font-size: 1.05em; }
            .card-container {
              display: flex;
              flex-wrap: wrap;
              gap: 1.2em;
              justify-content: center;
              align-items: flex-start;
            }
            .card-row {
              display: flex;
              flex-direction: row;
              align-items: stretch;
              width: 360px;
              height: 240px;
              margin: 2em 0.2em;
              gap: 18px;
            }
            .info-card {
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              align-items: flex-end;
              padding: 0.7em 0.7em;
              width: 400px;
              height: 220px;
              font-family: 'Georgia', serif;
              font-size: 1.8rem;
              color: #05585f;
              transition: transform 0.2s, box-shadow 0.2s, width 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.4s;
              cursor: pointer;
              user-select: none;
              will-change: transform, width, opacity;
              word-break: break-word;
              overflow: hidden;
              background: linear-gradient(135deg, #00a29d 60%, #ffffff 100%);
              box-shadow: 0 2px 16px #0002;
              border-radius: 18px;
              margin: 0;
            }
            .info-card.collapsing {
              width: 20px !important;
              min-width: 20px !important;
              opacity: 1;
              padding: 0.7em 0.7em;
              position: relative;
              /* background will be set after transition */
            }
            .info-card.collapsed-orange {
              background: linear-gradient(135deg, #ffe066 60%, #ffffff 100%) !important;
            }
            .info-main.hide-main {
              display: none !important;
            }
            .vertical-program {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%) rotate(-90deg);
              white-space: nowrap;
              font-family: 'Georgia', serif;
              font-size: 1.1rem;
              color: #000000;
              font-weight: 700;
              letter-spacing: 0.1em;
              pointer-events: none;
            }
            .mini-card-group {
              display: flex;
              flex-direction: column;
              justify-content: stretch;
              width: 350px;
              height: 265px;
              border-radius: 18px;
              overflow: visible;
              margin: 0;
              gap: 12px;
            }
            .mini-card-group-bgless {
              background: none !important;
              box-shadow: none !important;
            }
            .mini-card {
              flex: 1 1 0;
              min-height: 0;
              background: linear-gradient(135deg, #00a29d 0%, #ffffff 100%);
              border-radius: 18px;
              box-shadow: 0 2px 16px #0002;
              margin: 0;
              border: none;
              display: flex;
              align-items: center;
              justify-content: center;

              padding: 0.8rem 0.8rem;
              font-size: 0.95rem;
              font-family: 'Montserrat', sans-serif;
              color: #05585f;
              font-weight: 200;
              transition: background 0.2s;
            }
            .info-main {
              overflow: auto;
              flex: 1 1 auto;
              display: block;
              max-height: 100%;
              text-align: right;
              font-size: 2.1rem;
            }
            .info-card:active,
            .info-card.expanded,
            .info-card:hover {
              transform: scale(1.08);
              box-shadow: 0 4px 32px #0003;
            }
            .info-highlight {
              background: #05585f;
              color: #ffffff;
              border-radius: 0px;
              padding: 0 0.2em;
              font-weight: regular;
              font-size: 1.1em;
              display: inline-block;
              margin-left: 0.15em;
            }
            .subtitle {
              font-family: 'Montserrat', sans-serif;
              font-size: 1.6em;
              font-weight: 600;
              text-align: left;
              margin: 2em 1em 1em 5em;
              color: #222;
              letter-spacing: 0.01em;
            }
            @media (max-width: 700px) {
              .card-container { flex-direction: column; align-items: center; }
              .info-card { width: 100%; min-width: 0; max-width: 100%; }
            }
            .highlight-card {
              box-shadow: 0 0 0 8px #ffe066cc, 0 2px 16px #ffe06655 !important;
              border: 2.5px solid #ffe066 !important;
              transition: box-shadow 0.3s, border 0.3s;
            }
            .timeline-dot {
              cursor: pointer;
              transition: all 0.22s cubic-bezier(.4,1.3,.6,1);
            }
            .timeline-dot:hover, .timeline-dot.active {
              fill: #00a29d !important;
              stroke: #00a29d !important;
              r: 19 !important;
            }
            .timeline-description {
              font-family: 'Montserrat', sans-serif;
              font-size: 1.13em;
              color: #333;
              margin: 2.2em auto 1.2em auto;
              max-width: 1140px;
              min-width: 340px;
              width: calc(3 * 350px + 2 * 36px); /* 3 cards + 2 gaps */
              text-align: left;
              font-weight: 400;
              letter-spacing: 0.01em;
              line-height: 1.5;
              padding-left: 0.5em;
              padding-right: 0.5em;
              box-sizing: border-box;
            }
            .mini-label {
              color: #fff;
              font-weight: 200;
              font-family: 'Montserrat', sans-serif;
              font-size: 1em;
              margin-right: 0.2em;
              white-space: pre-line;
              display: inline;
            }
            .footer-section {
              width: 100vw;
              min-height: 180px;
              background: #23273b;
              display: flex;
              align-items: flex-end;
              justify-content: center;
              margin-top: 3.5em;
              margin-bottom: 0;
              padding: 0 0 3em 0;
              box-sizing: border-box;
              position: relative;
              left: 50%;
              right: 50%;
              transform: translateX(-50%);
            }
            .footer-logo {
              display: block;
              margin: 0 auto;
              max-width: 270px;
              width: 100%;
              height: auto;
              opacity: 0.98;
            }
            .top-section {
              width: 100vw;
              background: #23273b;
              margin: 0;
              padding: 3.5em 0 2.5em 0;
              box-sizing: border-box;
            }
            .top-section h1,
            .top-section .timeline-description {
              color: #fff;
            }
            .timeline-description {
              /* override margin for top-section */
              margin-bottom: 0.5em;
            }
          </style>
        </head>
        <body>
          <div class="top-section" style="position:relative; overflow:hidden;">
            <svg class="squiggle-svg" width="480" height="180" viewBox="0 0 480 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute; left:-40px; top:-40px; z-index:0;">
              <path d="M30 160 Q 60 40 140 120 Q 220 200 260 60 Q 300 -40 400 60 Q 500 160 430 160" stroke="#F7D6D0" stroke-width="18" fill="none" stroke-linecap="round"/>
            </svg>
            <svg class="squiggle-svg" width="480" height="180" viewBox="0 0 480 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute; right:-40px; top:-40px; z-index:0; transform: scaleX(-1);">
              <path d="M30 160 Q 60 40 140 120 Q 220 200 260 60 Q 300 -40 400 60 Q 500 160 430 160" stroke="#F7D6D0" stroke-width="18" fill="none" stroke-linecap="round"/>
            </svg>
            <div style="position:relative; z-index:1;">
              <h1>Timeline Visualizer</h1>
              <div class="timeline-description">
                Dear STARTAD team, <br> <br> This website allows you to visually explore and filter program timelines, issues, and solutions. Use the selectors below to filter by year, program, or issue tag. Click on any timeline dot to jump to the relevant information card. When you click on the information card, you will be able to access details on the observed issue log. All data is temporary and for demonstration purposes only.
                <br> <br> With love, Naz.
              </div>
            </div>
          </div>
          <div class="filters">
            <label>Year: <select id="yearFilter"></select></label>
            <label>Program: <select id="programFilter"></select></label>
            <label>Issue Tag: <select id="issueTagFilter"></select></label>
          </div>
          <div class="subtitle" style="margin-top:2.5em;">Timeline</div>
          <div id="timeline-graph" style="width:1300px;height:320px;margin: 0 0 0 0;"></div>
          <div class="subtitle">Information Cards</div>
          <div class="card-container" id="cardContainer"></div>
          <div class="footer-section">
            <img src="/logo.png" alt="Logo" class="footer-logo" style="margin-bottom: 0; margin-top: -60px;" />
          </div>
          <script id="timeline-data" type="application/json">${json}</script>
          <script>
            // Dynamically resize font in mini-cards to fit content
            function fitMiniCardText(card) {
              const maxFont = 0.95; // rem
              const minFont = 0.65; // rem
              const step = 0.02;
              let fontSize = maxFont;
              card.style.fontSize = fontSize + 'rem';
              card.style.whiteSpace = 'pre-line';
              card.style.wordBreak = 'break-word';
              // Shrink font until fits
              while ((card.scrollHeight > card.clientHeight || card.scrollWidth > card.clientWidth) && fontSize > minFont) {
                fontSize -= step;
                card.style.fontSize = fontSize + 'rem';
              }
            }
            function fitAllMiniCards() {
              document.querySelectorAll('.mini-card').forEach(fitMiniCardText);
            }
            // Observe DOM changes to fit text when mini-cards are added
            const observer = new MutationObserver(fitAllMiniCards);
            observer.observe(document.body, { childList: true, subtree: true });
            // Also fit on window resize
            window.addEventListener('resize', fitAllMiniCards);
            // Initial fit
            document.addEventListener('DOMContentLoaded', fitAllMiniCards);

            // Render empty timeline graph
            function renderTimelineGraph(entries) {
              const graphDiv = document.getElementById('timeline-graph');
              if (!graphDiv) return;
              // Extract years and programs from entries
              const years = entries.map(e => parseInt(e.year)).filter(y => !isNaN(y));
              if (years.length === 0) { graphDiv.innerHTML = ''; return; }
              const minYear = Math.min(...years);
              const maxYear = Math.max(...years) + 1;
              const yearRange = [];
              for (let y = minYear; y <= maxYear; y++) yearRange.push(y);
              const programs = Array.from(new Set(entries.map(e => e.program))).filter(Boolean);
              // SVG dimensions
              const width = 1300, height = 320, margin = {left: 200, right: 0, top: 40, bottom: 40};
              const graphW = width - margin.left - margin.right;
              const graphH = height - margin.top - margin.bottom;
              // X: years, Y: programs (vertical lines)
              const xStep = graphW / (yearRange.length-1);
              const yStep = graphH / (programs.length+1);
              // SVG grid
              let svg = '<svg width="' + width + '" height="' + height + '" style="background:transparent;">';
              svg += '<g font-family="Montserrat,sans-serif" font-size="15">';
              // Draw vertical grid lines for each program
              const programX = {};
              programs.forEach((prog, i) => {
                const x = margin.left + (i+1)*((graphW)/(programs.length+1));
                programX[prog] = x;
                svg += '<line x1="' + x + '" y1="' + margin.top + '" x2="' + x + '" y2="' + (height-margin.bottom) + '" stroke="#d0d8e0" stroke-width="2" />';
                svg += '<text x="' + x + '" y="' + (height-margin.bottom+24) + '" text-anchor="middle" fill="#05585f" font-size="16" font-weight="600">' + prog + '</text>';
              });
              // Draw horizontal grid lines for each year
              const yearY = {};
              yearRange.forEach((year, i) => {
                const y = margin.top + i*(graphH/(yearRange.length-1));
                yearY[year] = y;
                svg += '<line x1="' + margin.left + '" y1="' + y + '" x2="' + (width-margin.right) + '" y2="' + y + '" stroke="#e0e6ee" stroke-width="1" />';
                svg += '<text x="' + (margin.left-10) + '" y="' + (y+5) + '" text-anchor="end" fill="#222">' + year + '</text>';
              });
              // Draw circles for each data entry
              // Group entries by (year, program)
              const groupMap = {};
              entries.forEach(e => {
                const key = e.year + '||' + e.program;
                if (!groupMap[key]) groupMap[key] = [];
                groupMap[key].push(e);
              });
              const circleRadius = 16;
              const circleSpread = 28; // distance from center for multiple dots
              // Draw circles with unique ids for interaction
              Object.entries(groupMap).forEach(([key, group]) => {
                const [year, program] = key.split('||');
                const cx = programX[program];
                const cy = yearY[year];
                if (group.length === 1) {
                  const e = group[0];
                  const cardId = 'card-' + encodeURIComponent(e.year + '-' + e.program + '-' + e.issueHeader);
                  svg += '<circle class="timeline-dot" data-cardid="' + cardId + '" cx="' + cx + '" cy="' + cy + '" r="' + circleRadius + '" fill="#fff" stroke="#00a29d" stroke-width="4" style="cursor:pointer;transition:all 0.2s;filter:drop-shadow(0 2px 8px #00a29d33)" />';
                } else {
                  // Distribute in a ring
                  group.forEach((e, i) => {
                    const angle = (2 * Math.PI * i) / group.length;
                    const dotCx = cx + Math.cos(angle) * circleSpread;
                    const dotCy = cy + Math.sin(angle) * circleSpread;
                    const cardId = 'card-' + encodeURIComponent(e.year + '-' + e.program + '-' + e.issueHeader);
                    svg += '<circle class="timeline-dot" data-cardid="' + cardId + '" cx="' + dotCx + '" cy="' + dotCy + '" r="' + circleRadius + '" fill="#fff" stroke="#00a29d" stroke-width="4" style="cursor:pointer;transition:all 0.2s;filter:drop-shadow(0 2px 8px #00a29d33)" />';
                  });
                }
              });
              svg += '</g></svg>';
              graphDiv.innerHTML = svg;
              // Only add the event listener once
              if (!graphDiv._timelineDotClickAttached) {
                graphDiv.addEventListener('click', function(event) {
                  const dot = event.target.closest('.timeline-dot');
                  if (dot) {
                    const cardId = dot.getAttribute('data-cardid');
                    const card = document.getElementById(cardId);
                    console.log('Clicked dot for cardId:', cardId, 'Found card:', !!card);
                    if (card) {
                      card.scrollIntoView({behavior: 'smooth', block: 'center'});
                      card.classList.add('highlight-card');
                      setTimeout(function() { card.classList.remove('highlight-card'); }, 1200);
                    } else {
                      alert('No card found for this data point!');
                    }
                  }
                });
                graphDiv._timelineDotClickAttached = true;
              }
            }

            document.addEventListener('DOMContentLoaded', function() {
              function escapeHtml(str) {
                if (typeof str !== 'string') return '';
                return str.replace(/[&<>'"]/g, function (c) {
                    return {'&':'&amp;','<':'&lt;','>':'&gt;', "'":'&#39;', '"':'&quot;'}[c];
                });
              }

              // SAFELY PARSE DATA
              const data = JSON.parse(document.getElementById('timeline-data').textContent);
              const entries = Array.isArray(data.entries) ? data.entries : [];
              const yearFilter = document.getElementById('yearFilter');
              const programFilter = document.getElementById('programFilter');
              const issueTagFilter = document.getElementById('issueTagFilter');
              const cardContainer = document.getElementById('cardContainer');
  
              function getUnique(arr, key) {
                return Array.from(new Set(arr.map(function(e) { return e[key]; }))).filter(Boolean);
              }
  
              function renderFilters() {
                yearFilter.innerHTML = '<option value="">All</option>' +
                  getUnique(entries, 'year').map(function(y) { return '<option value="' + escapeHtml(y) + '">' + escapeHtml(y) + '</option>'; }).join('');
                programFilter.innerHTML = '<option value="">All</option>' +
                  getUnique(entries, 'program').map(function(p) { return '<option value="' + escapeHtml(p) + '">' + escapeHtml(p) + '</option>'; }).join('');
                issueTagFilter.innerHTML = '<option value="">All</option>' +
                  getUnique(entries, 'issueHeader').map(function(tag) { return '<option value="' + escapeHtml(tag) + '">' + escapeHtml(tag) + '</option>'; }).join('');
              }
  
              function renderCards() {
                const year = yearFilter.value;
                const program = programFilter.value;
                const issueTag = issueTagFilter.value;
                const filtered = entries.filter(function(e) {
                  return (!year || e.year === year) &&
                         (!program || e.program === program) &&
                         (!issueTag || e.issueHeader === issueTag);
                });
                if (filtered.length === 0) {
                  cardContainer.innerHTML = '<div style="width:100%;text-align:center;padding:2em;">No entries found.</div>';
                  renderTimelineGraph([]);
                  return;
                }
                cardContainer.innerHTML = filtered.map(function(e, idx) {
                  // Create a unique id for each card based on year, program, and issueHeader
                  const cardId = 'card-' + encodeURIComponent(e.year + '-' + e.program + '-' + e.issueHeader);
                  return '<div class="card-row" data-idx="' + idx + '">' +
                    '<div class="info-card" id="' + cardId + '" data-idx="' + idx + '" data-program="' + escapeHtml(e.program) + '"' +
                      ' data-issueinfo="' + escapeHtml(e.issueInfo) + '"' +
                      ' data-fixapplied="' + escapeHtml(e.fixApplied) + '"' +
                      ' data-fixrecommended="' + escapeHtml(e.fixRecommended) + '">' +
                      '<div class="info-main">' +
                        'In ' + escapeHtml(e.year) + ' edition of ' + escapeHtml(e.program) + ' an issue that was faced was <span class="info-highlight">' + escapeHtml(e.issueHeader) + '</span>' +
                      '</div>' +
                    '</div>' +
                  '</div>';
                }).join('');
                // Add expand/collapse behavior
                cardContainer.querySelectorAll('.info-card').forEach(function(card) {
                  card.addEventListener('click', function(ev) {
                    var row = card.closest('.card-row');
                    var miniGroup = row.querySelector('.mini-card-group');
                    var programName = card.getAttribute('data-program');
                    var infoMain = card.querySelector('.info-main');
                    if (!card.classList.contains('collapsing')) {
                      card.classList.add('collapsing');
                      if (!miniGroup) {
                        miniGroup = document.createElement('div');
                        miniGroup.className = 'mini-card-group mini-card-group-bgless';
                        var issueInfo = card.getAttribute('data-issueinfo') || '';
                        var fixApplied = card.getAttribute('data-fixapplied') || '';
                        var fixRecommended = card.getAttribute('data-fixrecommended') || '';
                        miniGroup.innerHTML = [
                          '<div class="mini-card">Issue info: ' + issueInfo + '</div>',
                          '<div class="mini-card">Fix applied: ' + fixApplied + '</div>',
                          '<div class="mini-card">Recommendation: ' + fixRecommended + '</div>'
                        ].join('');
                        row.appendChild(miniGroup);
                      }
                     setTimeout(function() {
                       // Hide main text, show vertical, and change color after collapse
                       if (infoMain) infoMain.classList.add('hide-main');
                       card.classList.add('collapsed-orange');
                       if (!card.querySelector('.vertical-program')) {
                         var vert = document.createElement('div');
                         vert.className = 'vertical-program';
                         vert.textContent = programName || '';
                         card.appendChild(vert);
                       }
                     }, 600); // match collapse transition
                    } else {
                      card.classList.remove('collapsing');
                      card.classList.remove('collapsed-orange');
                     var vert = card.querySelector('.vertical-program');
                     if (vert) vert.remove();
                     if (infoMain) infoMain.classList.remove('hide-main');
                      if (miniGroup) {
                        miniGroup.remove();
                      }
                    }
                  });
                });
                fitAllMiniCards();
                renderTimelineGraph(filtered);
              }
  
              yearFilter.addEventListener('change', renderCards);
              programFilter.addEventListener('change', renderCards);
              issueTagFilter.addEventListener('change', renderCards);
  
              renderFilters();
              renderCards();
              console.log("DATA FOR CARDS:", data.entries);
            });
          </script>
        </body>
      </html>
    `;
  }
  