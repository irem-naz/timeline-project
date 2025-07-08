export default async function timelineUiHtml(data) {
    const entries = Array.isArray(data && data.entries) ? data.entries : [];
    const safeData = { ...data, entries };
    const json = JSON.stringify(safeData).replace(/</g, '\\u003c');
    return `
      <html>
        <head>
          <title>Timeline View</title>
          <style>
            body { font-family: sans-serif; padding: 2em; }
            .filters { margin-bottom: 1em; display: flex; gap: 1em; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Timeline Viewer</h1>
          <div class="filters">
            <label>Year: <select id="yearFilter"></select></label>
            <label>Program: <select id="programFilter"></select></label>
          </div>
          <table id="timelineTable">
            <thead>
              <tr>
                <th>Year</th>
                <th>Program</th>
                <th>Issue</th>
                <th>Info</th>
                <th>Fix Applied</th>
                <th>Fix Recommended</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <p><i>This data is stored in Vercel Blob and is temporary. You may delete it anytime by redeploying or rotating tokens.</i></p>
          <script id="timeline-data" type="application/json">${json}</script>
          <script>
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
              const tableBody = document.querySelector('#timelineTable tbody');
  
              function getUnique(arr, key) {
                return Array.from(new Set(arr.map(function(e) { return e[key]; })));
              }
  
              function renderFilters() {
                yearFilter.innerHTML = '<option value="">All</option>' +
                  getUnique(entries, 'year').map(function(y) { return '<option value="' + escapeHtml(y) + '">' + escapeHtml(y) + '</option>'; }).join('');
                programFilter.innerHTML = '<option value="">All</option>' +
                  getUnique(entries, 'program').map(function(p) { return '<option value="' + escapeHtml(p) + '">' + escapeHtml(p) + '</option>'; }).join('');
              }
  
              function renderTable() {
                const year = yearFilter.value;
                const program = programFilter.value;
                const filtered = entries.filter(function(e) {
                  return (!year || e.year === year) && (!program || e.program === program);
                });
                if (filtered.length === 0) {
                  tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:16px;">No entries found.</td></tr>';
                  return;
                }
                tableBody.innerHTML = filtered.map(function(e) {
                  return '<tr>' +
                    '<td>' + escapeHtml(e.year) + '</td>' +
                    '<td>' + escapeHtml(e.program) + '</td>' +
                    '<td>' + escapeHtml(e.issueHeader) + '</td>' +
                    '<td>' + escapeHtml(e.issueInfo) + '</td>' +
                    '<td>' + escapeHtml(e.fixApplied) + '</td>' +
                    '<td>' + escapeHtml(e.fixRecommended) + '</td>' +
                  '</tr>';
                }).join('');
              }
  
              yearFilter.addEventListener('change', renderTable);
              programFilter.addEventListener('change', renderTable);
  
              renderFilters();
              renderTable();
              console.log("DATA FOR TABLE:", data.entries);
            });
          </script>
        </body>
      </html>
    `;
  }
  