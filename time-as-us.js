(function () {
  var START_DATE = '2025-09-26';

  function parseDate(str) {
    var parts = str.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function dateOnly(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  // calendar-accurate months + remainder days between two dates (b assumed >= a)
  function monthsDaysDiff(a, b) {
    a = dateOnly(a);
    b = dateOnly(b);
    var months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
    var days = b.getDate() - a.getDate();
    if (days < 0) {
      months--;
      var prevMonthLastDay = new Date(b.getFullYear(), b.getMonth(), 0);
      days += prevMonthLastDay.getDate();
    }
    if (months < 0) { months = 0; days = 0; }
    return { months: months, days: days };
  }

  function formatDuration(months, days) {
    var parts = [];
    if (months > 0) parts.push(months + ' month' + (months === 1 ? '' : 's'));
    if (days > 0 || months === 0) parts.push(days + ' day' + (days === 1 ? '' : 's'));
    return parts.join(', ');
  }

  function formatTargetDate(d) {
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return 'on ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  var startDate, targetDate;

  var elapsedHero = document.getElementById('elapsedHero');
  var elapsedClock = document.getElementById('elapsedClock');
  var countdownSection = document.getElementById('countdownSection');
  var countdownHero = document.getElementById('countdownHero');
  var countdownClock = document.getElementById('countdownClock');
  var progressFill = document.getElementById('progressFill');
  var progressPct = document.getElementById('progressPct');
  var targetCaption = document.getElementById('targetCaption');
  var celebration = document.getElementById('celebration');

  function applyDates() {
    startDate = parseDate(START_DATE);
    targetDate = new Date(startDate);
    targetDate.setFullYear(targetDate.getFullYear() + 1);
    targetCaption.textContent = formatTargetDate(targetDate);
  }

  function tick() {
    var now = new Date();

    // elapsed since start
    var elapsed = monthsDaysDiff(startDate, now);
    elapsedHero.textContent = formatDuration(elapsed.months, elapsed.days);

    var secOfDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    elapsedClock.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());

    if (now >= targetDate) {
      countdownSection.classList.add('hidden');
      celebration.classList.remove('hidden');
      return;
    }

    countdownSection.classList.remove('hidden');
    celebration.classList.add('hidden');

    // countdown to target
    var remaining = monthsDaysDiff(now, targetDate);
    countdownHero.textContent = formatDuration(remaining.months, remaining.days);

    var secRemaining = 86400 - secOfDay;
    var hh = Math.floor(secRemaining / 3600);
    var mm = Math.floor((secRemaining % 3600) / 60);
    var ss = secRemaining % 60;
    countdownClock.textContent = pad(hh) + ':' + pad(mm) + ':' + pad(ss);

    var totalMs = targetDate - startDate;
    var elapsedMs = now - startDate;
    var pct = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
    progressFill.style.width = pct + '%';
    progressPct.textContent = pct.toFixed(1) + '%';
  }

  applyDates();
  tick();
  setInterval(tick, 1000);
})();
