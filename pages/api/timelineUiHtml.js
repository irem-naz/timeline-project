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
            body { font-family: sans-serif; padding: 2em; }
            h1 {
              font-family: 'Alumni Sans', sans-serif;
              font-size: 3.5em;
              letter-spacing: 0.03em;
              text-align: center;
              margin-bottom: 0.5em;
            }
            .filters {
              margin-bottom: 2em;
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
              width: 350px;
              height: 220px;
              margin: 2.4em;
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
              background: linear-gradient(135deg, #fbb040 60%, #ffffff 100%) !important;
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
              color: #a85a3a;
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
              background: linear-gradient(135deg, #00a29d 60%, #ffffff 100%);
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
            @media (max-width: 700px) {
              .card-container { flex-direction: column; align-items: center; }
              .info-card { width: 100%; min-width: 0; max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <h1>Timeline Viewer</h1>
          <div class="filters">
            <label>Year: <select id="yearFilter"></select></label>
            <label>Program: <select id="programFilter"></select></label>
            <label>Issue Tag: <select id="issueTagFilter"></select></label>
          </div>
          <div class="card-container" id="cardContainer"></div>
          <p><i>This data is stored in Vercel Blob and is temporary. You may delete it anytime by redeploying or rotating tokens.</i></p>
          <script id="timeline-data" type="application/json">${json}</script>
          <script>
            // Dynamically resize font in mini-cards to fit content
            function fitMiniCardText(card) {
              const maxFont = 0.95; // rem
              const minFont = 0.65; // rem
              const step = 0.02;
              const box = card;
              const text = card.textContent;
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
                  return;
                }
                cardContainer.innerHTML = filtered.map(function(e, idx) {
                  return '<div class="card-row" data-idx="' + idx + '">' +
                    '<div class="info-card" data-idx="' + idx + '" data-program="' + escapeHtml(e.program) + '"' +
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
                          '<div class="mini-card">' + issueInfo + '</div>',
                          '<div class="mini-card">' + fixApplied + '</div>',
                          '<div class="mini-card">' + fixRecommended + '</div>'
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
  