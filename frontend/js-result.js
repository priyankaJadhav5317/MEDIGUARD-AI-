// js/result.js

(function () {
  const container = document.getElementById('result-content');
  if (!container) return;

  const raw = localStorage.getItem('mediguard_result');
  if (!raw) {
    container.textContent = 'No result data found. Please complete an assessment.';
    return;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    container.textContent = 'There was an issue loading your result.';
    return;
  }

  // Render a clean summary view
  const frag = document.createDocumentFragment();

  // Summary
  if (data.summary) {
    const p = document.createElement('p');
    p.textContent = data.summary;
    frag.appendChild(p);
  }

  // Key findings
  if (Array.isArray(data.keyFindings) && data.keyFindings.length) {
    const h = document.createElement('h4');
    h.textContent = 'Key findings';
    frag.appendChild(h);
    const ul = document.createElement('ul');
    data.keyFindings.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
    frag.appendChild(ul);
  }

  // Recommendations
  if (Array.isArray(data.recommendations) && data.recommendations.length) {
    const h = document.createElement('h4');
    h.textContent = 'Recommendations';
    frag.appendChild(h);
    const ul = document.createElement('ul');
    data.recommendations.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
    frag.appendChild(ul);
  }

  // If backend returns additional fields (e.g., riskScores, flags)
  if (data.riskScores && typeof data.riskScores === 'object') {
    const h = document.createElement('h4');
    h.textContent = 'Risk scores';
    frag.appendChild(h);
    const ul = document.createElement('ul');
    Object.entries(data.riskScores).forEach(([k, v]) => {
      const li = document.createElement('li');
      li.textContent = `${k}: ${v}`;
      ul.appendChild(li);
    });
    frag.appendChild(ul);
  }

  container.innerHTML = '';
  container.appendChild(frag);
})();
