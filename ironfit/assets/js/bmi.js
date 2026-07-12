/* ==========================================================================
   IRON FIT GYM — BMI Calculator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('bmiForm');
  if (!form) return;

  var unitToggle = document.querySelectorAll('input[name="bmiUnit"]');
  var heightLabel = document.getElementById('heightUnitLabel');
  var weightLabel = document.getElementById('weightUnitLabel');
  var heightInput = document.getElementById('bmiHeight');
  var weightInput = document.getElementById('bmiWeight');

  var resultWrap = document.getElementById('bmiResultWrap');
  var bmiValueEl = document.getElementById('bmiValue');
  var bmiCategoryEl = document.getElementById('bmiCategory');
  var bmiFill = document.getElementById('bmiGaugeFill');
  var bmiMarker = document.getElementById('bmiMarker');
  var bmiAdvice = document.getElementById('bmiAdvice');

  var categories = [
    { max: 18.5, name: 'Underweight', color: '#3fa9f5', advice: 'You may benefit from a structured strength and nutrition plan to build healthy mass. Our trainers can build one with you.' },
    { max: 25, name: 'Normal', color: '#2ecc71', advice: 'Great work — you are in a healthy range. Keep it up with regular training and balanced meals.' },
    { max: 30, name: 'Overweight', color: '#ffb703', advice: 'A mix of cardio and strength training, paired with a nutrition guide, can help you move toward a healthier range.' },
    { max: 999, name: 'Obese', color: 'var(--red)', advice: 'Consider speaking with one of our certified trainers to build a safe, progressive fitness and nutrition plan.' }
  ];

  function setUnitLabels() {
    var isMetric = document.getElementById('unitMetric').checked;
    heightLabel.textContent = isMetric ? 'cm' : 'in';
    weightLabel.textContent = isMetric ? 'kg' : 'lb';
  }
  unitToggle.forEach(function (r) { r.addEventListener('change', setUnitLabels); });
  setUnitLabels();

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var isMetric = document.getElementById('unitMetric').checked;
    var h = parseFloat(heightInput.value);
    var w = parseFloat(weightInput.value);

    if (!h || !w || h <= 0 || w <= 0) {
      heightInput.classList.toggle('is-invalid', !h || h <= 0);
      weightInput.classList.toggle('is-invalid', !w || w <= 0);
      return;
    }
    heightInput.classList.remove('is-invalid');
    weightInput.classList.remove('is-invalid');

    var bmi;
    if (isMetric) {
      var meters = h / 100;
      bmi = w / (meters * meters);
    } else {
      bmi = (w / (h * h)) * 703;
    }
    bmi = Math.round(bmi * 10) / 10;

    var cat = categories.find(function (c) { return bmi < c.max; }) || categories[categories.length - 1];

    resultWrap.classList.remove('d-none');
    bmiValueEl.textContent = bmi.toFixed(1);
    bmiCategoryEl.textContent = cat.name;
    bmiCategoryEl.style.background = cat.color;
    bmiCategoryEl.style.color = '#08090a';
    bmiAdvice.textContent = cat.advice;

    var pct = Math.min((bmi / 40) * 100, 100);
    bmiFill.style.width = pct + '%';
    bmiFill.style.background = 'linear-gradient(90deg, #3fa9f5, #2ecc71, #ffb703, #ff2438)';
    bmiMarker.style.left = pct + '%';
  });

  form.addEventListener('reset', function () {
    resultWrap.classList.add('d-none');
  });
});
