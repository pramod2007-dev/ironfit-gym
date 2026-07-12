/* ==========================================================================
   IRON FIT GYM — Dashboard Script
   Sidebar toggle + progress charts (drawn with lightweight canvas,
   no external chart library required).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var sidebar = document.getElementById('dashSidebar');
  var toggleBtn = document.getElementById('dashSidebarToggle');
  var overlay = document.getElementById('dashOverlay');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function () {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  /* ---------- Weight progress line chart (canvas) ---------- */
  var weightCanvas = document.getElementById('weightChart');
  if (weightCanvas && weightCanvas.getContext) {
    drawLineChart(weightCanvas, [82, 81, 80.5, 79, 78.5, 77, 76, 75.2], '#ff2438');
  }

  /* ---------- Calories bar chart (canvas) ---------- */
  var calCanvas = document.getElementById('caloriesChart');
  if (calCanvas && calCanvas.getContext) {
    drawBarChart(calCanvas, [420, 610, 380, 720, 540, 810, 460]);
  }

  /* ---------- Progress rings ---------- */
  document.querySelectorAll('.progress-ring').forEach(function (ring) {
    var pct = parseFloat(ring.getAttribute('data-percent')) || 0;
    var circle = ring.querySelector('circle.ring-fg');
    if (!circle) return;
    var radius = circle.r.baseVal.value;
    var circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    requestAnimationFrame(function () {
      circle.style.transition = 'stroke-dashoffset 1s ease';
      circle.style.strokeDashoffset = circumference - (pct / 100) * circumference;
    });
  });

  function drawLineChart(canvas, data, color) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width = canvas.clientWidth * 2;
    var h = canvas.height = canvas.clientHeight * 2;
    ctx.scale(1, 1);
    var max = Math.max.apply(null, data);
    var min = Math.min.apply(null, data);
    var pad = 20;
    var stepX = (w - pad * 2) / (data.length - 1);

    ctx.clearRect(0, 0, w, h);

    // grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (var g = 0; g < 4; g++) {
      var gy = pad + g * ((h - pad * 2) / 3);
      ctx.beginPath();
      ctx.moveTo(pad, gy);
      ctx.lineTo(w - pad, gy);
      ctx.stroke();
    }

    // line
    ctx.beginPath();
    data.forEach(function (val, i) {
      var x = pad + i * stepX;
      var y = h - pad - ((val - min) / (max - min || 1)) * (h - pad * 2);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    // gradient fill under line
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(255,36,56,0.35)');
    grad.addColorStop(1, 'rgba(255,36,56,0)');
    ctx.lineTo(w - pad, h - pad);
    ctx.lineTo(pad, h - pad);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // points
    data.forEach(function (val, i) {
      var x = pad + i * stepX;
      var y = h - pad - ((val - min) / (max - min || 1)) * (h - pad * 2);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#08090a';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();
    });
  }

  function drawBarChart(canvas, data) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width = canvas.clientWidth * 2;
    var h = canvas.height = canvas.clientHeight * 2;
    var max = Math.max.apply(null, data);
    var pad = 20;
    var gap = 16;
    var barW = (w - pad * 2 - gap * (data.length - 1)) / data.length;

    ctx.clearRect(0, 0, w, h);

    data.forEach(function (val, i) {
      var barH = (val / max) * (h - pad * 2);
      var x = pad + i * (barW + gap);
      var y = h - pad - barH;
      var grad = ctx.createLinearGradient(0, y, 0, h - pad);
      grad.addColorStop(0, '#ff2438');
      grad.addColorStop(1, '#b3051b');
      ctx.fillStyle = grad;
      roundRect(ctx, x, y, barW, barH, 6);
      ctx.fill();
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
});
