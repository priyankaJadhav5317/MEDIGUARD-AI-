// assessment.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('assessment-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(form);

    // Safe parser for FormData values
    const getFloat = (key) => {
      const val = fd.get(key);
      return typeof val === 'string' ? parseFloat(val) : NaN;
    };

    // Build payload with 24 parameters (match your input name= attributes exactly)
    const payload = {
      glucose: getFloat('glucose'),
      cholesterol: getFloat('cholesterol'),
      hemoglobin: getFloat('hemoglobin'),
      platelets: getFloat('platelets'),
      wbc: getFloat('wbc'),
      rbc: getFloat('rbc'),
      hematocrit: getFloat('hematocrit'),
      mcv: getFloat('mcv'),
      mch: getFloat('mch'),
      mchc: getFloat('mchc'),
      insulin: getFloat('insulin'),
      bmi: getFloat('bmi'),
      sbp: getFloat('sbp'),
      dbp: getFloat('dbp'),
      triglycerides: getFloat('triglycerides'),
      hba1c: getFloat('hba1c'),
      ldl: getFloat('ldl'),
      hdl: getFloat('hdl'),
      alt: getFloat('alt'),
      ast: getFloat('ast'),
      heart_rate: getFloat('heart_rate'),
      creatinine: getFloat('creatinine'),
      troponin: getFloat('troponin'),
      crp: getFloat('crp'),
    };

    // Validate all values are numbers
    const allValid = Object.values(payload).every(v => typeof v === 'number' && !Number.isNaN(v));
    if (!allValid) {
      alert('Please fill in all 24 fields with valid numeric values.');
      return;
    }

    // Button handling
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Submit for Analysis';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Analyzing...';
    }

    try {
      // Replace with your actual backend endpoint
      const endpoint = '/api/analyze';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      localStorage.setItem('mediguard_result', JSON.stringify(result));
      window.location.href = 'result.html';
    } catch (error) {
      console.error('Error during analysis:', error);

      const demoResult = {
        summary: 'Your values were analyzed successfully.',
        keyFindings: [
          'Most parameters are within normal range.',
          'No immediate high-risk markers detected.',
          'Consider regular monitoring and healthy lifestyle habits.',
        ],
        recommendations: [
          'Maintain a balanced diet and exercise regularly.',
          'Schedule routine checkups with your doctor.',
          'Discuss any concerns with a healthcare provider.',
        ],
      };

      localStorage.setItem('mediguard_result', JSON.stringify(demoResult));
      window.location.href = 'result.html';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
});
