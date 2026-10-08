'use strict';

// All numbers are intentionally local sample data; no API keys or services required.
const icons = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  chart: '<path d="M3 20h18M5 20v-8h4v8m2 0V7h4v13m2 0V3h4v17"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/><circle cx="9" cy="7" r="4"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5"/>',
  sliders:
    '<path d="M3 6h5m4 0h9M3 12h11m4 0h3M3 18h3m4 0h11"/><circle cx="10" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5"/>',
  wallet:
    '<path d="M20 7H5a2 2 0 0 1 0-4h13v4M3 5v14a2 2 0 0 0 2 2h15V7m0 5h-5v5h5"/><path d="M16 14.5h.1"/>',
  bag: '<path d="M4 7h16l1 14H3zM8 9V6a4 4 0 0 1 8 0v3"/>',
  trend: '<path d="m3 5 7 7 4-4 7 7m-6 0h6V9"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 4h.01"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
};
const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.grid}</svg>`;
document
  .querySelectorAll('[data-icon]')
  .forEach((el) => el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon)));
const $ = (selector) => document.querySelector(selector);
const config = window.DASHBOARD_CONFIG;
const money = (value, decimals = 0) =>
  new Intl.NumberFormat(config.format.locale, {
    style: 'currency',
    currency: config.format.currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
const number = (value) =>
  new Intl.NumberFormat(config.format.locale).format(value);
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ],
  );
const currentRevenue = config.revenueWeights.current;
const previousRevenue = config.revenueWeights.previous;
const customers = config.customers;
const periods = config.periods;
// Actual chart arrays take precedence over the demo's aggregate revenue values.
Object.values(periods).forEach((period) => {
  if (period.chartCurrent)
    period.revenue = period.chartCurrent.reduce((sum, value) => sum + value, 0);
});
let view = 'overview';
let toastTimer;
let previousFocus;

function toast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  toastTimer = setTimeout(() => ($('#toast').hidden = true), 3500);
}

function chartData() {
  const period = $('#period').value,
    data = periods[period];
  const labels = data.chartLabels;
  const distribute = (weights, total) => {
    const filled = labels.map((_, i) => weights[i % weights.length] || 1);
    const sum = filled.reduce((a, b) => a + b, 0);
    const values = filled.map((v) => Math.round((v / sum) * total));
    values[values.length - 1] += total - values.reduce((a, b) => a + b, 0);
    return values;
  };
  const current = data.chartCurrent || distribute(currentRevenue, data.revenue);
  const previous =
    data.chartPrevious ||
    distribute(
      previousRevenue,
      Math.round(data.revenue / (1 + data.changes[0] / 100)),
    );
  return { labels, current, previous };
}

function renderChart() {
  const data = chartData();
  const compare = $('#chart-mode').value === 'compare';
  const max = Math.max(1, Math.max(...data.current, ...data.previous) * 1.12);
  const compactMoney = (value) =>
    new Intl.NumberFormat(config.format.locale, {
      style: 'currency',
      currency: config.format.currency,
      notation: 'compact',
      maximumFractionDigits: 0,
    }).format(value);
  $('.chart-y-axis').innerHTML = [max, (max * 2) / 3, max / 3, 0]
    .map((v) => `<span>${escapeHTML(compactMoney(v))}</span>`)
    .join('');
  $('#chart-bars').innerHTML = data.labels
    .map(
      (label, i) =>
        `<button class="month-group" data-month="${i}" aria-label="${escapeHTML(periods[$('#period').value].chartPrefix + label)} ${config.format.currentYear}: ${escapeHTML(money(data.current[i]))}${compare ? ', ' + config.format.previousYear + ': ' + escapeHTML(money(data.previous[i])) : ''}"><span class="bar-pair">${compare ? `<span class="bar" style="height:${(data.previous[i] / max) * 100}%"></span>` : ''}<span class="bar current" style="height:${(data.current[i] / max) * 100}%"></span></span><span class="month-label">${escapeHTML(label)}</span></button>`,
    )
    .join('');
  $('#sales-panel .panel-heading p').textContent =
    periods[$('#period').value].chartDescription;
  $('.legend-previous').parentElement.hidden = !compare;
  $('#chart-tooltip').hidden = true;
  document.querySelectorAll('.month-group').forEach((button) => {
    const show = () => {
      const i = Number(button.dataset.month),
        rect = button.getBoundingClientRect();
      const tooltip = $('#chart-tooltip');
      tooltip.innerHTML = `<strong>${escapeHTML(periods[$('#period').value].chartPrefix + data.labels[i])} · Revenue</strong><div><span>${config.format.currentYear}</span>${escapeHTML(money(data.current[i]))}</div>${compare ? `<div><span>${config.format.previousYear}</span>${escapeHTML(money(data.previous[i]))}</div>` : ''}`;
      tooltip.hidden = false;
      tooltip.style.left =
        Math.max(
          10,
          Math.min(
            rect.left - 55,
            window.innerWidth - tooltip.offsetWidth - 10,
          ),
        ) + 'px';
      tooltip.style.top = Math.max(10, rect.top + 25) + 'px';
    };
    button.addEventListener('mouseenter', show);
    button.addEventListener('focus', show);
    button.addEventListener('click', show);
    button.addEventListener(
      'mouseleave',
      () => ($('#chart-tooltip').hidden = true),
    );
    button.addEventListener('blur', () => ($('#chart-tooltip').hidden = true));
  });
}

function renderMetrics() {
  const data = periods[$('#period').value];
  const parts = new Intl.NumberFormat(config.format.locale, {
    style: 'currency',
    currency: config.format.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).formatToParts(data.revenue);
  $('#revenue-value').innerHTML = parts
    .map((part) =>
      ['decimal', 'fraction'].includes(part.type)
        ? `<span>${escapeHTML(part.value)}</span>`
        : escapeHTML(part.value),
    )
    .join('');
  $('#customers-value').textContent = number(data.customers);
  $('#orders-value').textContent = number(data.orders);
  ['revenue', 'customers', 'orders'].forEach(
    (key, i) =>
      ($('#' + key + '-change').textContent = '↗ ' + data.changes[i] + '%'),
  );
  $('#chart-total').textContent = money(data.revenue, 2);
  $('.chart-summary>.change').textContent = '↗ ' + data.changes[0] + '%';
  $('#savings-value').textContent = money(data.saved);
  $('#date-label').textContent = data.date;
  $('.costs-panel .pill').textContent = data.spendingLabel;
  $('.rings-center small').textContent =
    '↗ ' + config.spending.change + '% this period';
  renderRegions();
  renderChart();
}
const regions = config.geography.regions;
const regionCount = (region) =>
  Math.round((periods[$('#period').value].customers * region.share) / 100);

function regionCode(region) {
  const code = String(region.code || region.flag || '').toLowerCase();
  return code === 'uk' ? 'gb' : /^[a-z]{2}$/.test(code) ? code : '';
}

function flagMarkup(region) {
  const code = regionCode(region);
  const base = (
    config.geography.flagBaseUrl || 'https://flagcdn.com/w80'
  ).replace(/\/$/, '');
  return `<span class="country-flag" aria-hidden="true"><span class="flag-placeholder">${escapeHTML(code.toUpperCase() || '—')}</span>${code ? `<img src="${escapeHTML(base + '/' + code + '.png')}" data-country-code="${code}" width="24" height="16" alt="" decoding="async" referrerpolicy="no-referrer">` : ''}</span>`;
}

function initializeFlags(container) {
  container.querySelectorAll('.country-flag img').forEach((image) => {
    const loaded = () => image.parentElement.classList.add('flag-loaded');
    const failed = () => {
      const code = image.dataset.countryCode;
      const localCodes = config.geography.localFlags || [
        'us',
        'gb',
        'de',
        'jp',
        'pl',
      ];
      if (!image.dataset.localFallback && localCodes.includes(code)) {
        image.dataset.localFallback = 'true';
        image.src =
          (config.geography.localFlagPath || 'assets/flags').replace(
            /\/$/,
            '',
          ) +
          '/' +
          code +
          '.png';
      } else {
        image.hidden = true;
        image.parentElement.classList.remove('flag-loaded');
      }
    };
    image.addEventListener('load', loaded);
    image.addEventListener('error', failed);
    if (image.complete) {
      if (image.naturalWidth) loaded();
      else failed();
    }
  });
}

function renderRegions() {
  $('#country-list').innerHTML =
    '<div class="country-columns" aria-hidden="true"><span>Country</span><span>Customers</span><span>Share</span></div>' +
    regions
      .map(
        (r) =>
          `<div class="country"><div class="country-top">${flagMarkup(r)}<span class="country-name">${escapeHTML(r.name)}</span><small>${number(regionCount(r))}</small><strong>${r.share}%</strong></div><div class="country-track" role="img" aria-label="${escapeHTML(r.name)}: ${r.share}% of customers"><div class="country-fill" style="width:${Math.max(0, Math.min(100, r.share))}%"></div></div></div>`,
      )
      .join('');
  initializeFlags($('#country-list'));
}
const heatData = config.activity.current;

function renderHeatmap() {
  const last = $('#heatmap-period').value === 'last',
    times = config.activity.times,
    days = config.activity.days;
  $('#heatmap').style.gridTemplateColumns =
    `27px repeat(${days.length}, minmax(0,1fr))`;
  $('#heatmap').innerHTML =
    heatData
      .map(
        (row, r) =>
          `<span class="heat-label time">${escapeHTML(times[r])}</span>` +
          row
            .map((value, c) => {
              const count = last
                ? (config.activity.previous?.[r]?.[c] ??
                  Math.round(value * (0.7 + ((c + r) % 3) * 0.13)))
                : value;
              const level =
                count < 40
                  ? 0
                  : count < 80
                    ? 1
                    : count < 120
                      ? 2
                      : count < 180
                        ? 3
                        : 4;
              return `<button class="heat-cell level-${level}" data-count="${count}" data-day="${escapeHTML(days[c])}" data-time="${escapeHTML(times[r])}" aria-label="${escapeHTML(days[c] + ', ' + times[r] + ' ' + config.activity.timezone)}: ${count} orders">${count}</button>`;
            })
            .join(''),
      )
      .join('') +
    '<span></span>' +
    days
      .map((d) => `<span class="heat-label day">${escapeHTML(d)}</span>`)
      .join('');
}

function renderTable() {
  const isCustomers = view === 'customers',
    query = $('#table-search').value.toLowerCase().trim();
  const filtered = customers.filter((c) =>
    [c.name, c.email, c.company, c.region, c.status, c.plan].some((v) =>
      v.toLowerCase().includes(query),
    ),
  );
  $('#table-title').textContent = isCustomers
    ? 'Your customers'
    : 'Recent transactions';
  $('#table-description').textContent = isCustomers
    ? 'Contact details and subscription plans.'
    : 'Latest payments and their status.';
  $('#table-search').placeholder = isCustomers
    ? 'Search customers'
    : 'Search transactions';
  $('#table-search').setAttribute(
    'aria-label',
    isCustomers ? 'Search customers' : 'Search transactions',
  );
  const heads = isCustomers
    ? ['Customer', 'Company', 'Region', 'Plan', 'Joined']
    : ['Customer', 'Status', 'Amount', 'Date', 'Payment'];
  $('#table-head').innerHTML =
    '<tr>' + heads.map((h) => `<th scope="col">${h}</th>`).join('') + '</tr>';
  $('#table-body').innerHTML = filtered.length
    ? filtered
        .map(
          (c) =>
            `<tr><td><div class="customer-cell"><span class="customer-avatar">${escapeHTML(c.initials)}</span><span><span class="customer-name">${escapeHTML(c.name)}</span><span class="customer-email">${escapeHTML(c.email)}</span></span></div></td>${isCustomers ? `<td>${escapeHTML(c.company)}</td><td>${escapeHTML(c.region)}</td><td><span class="table-status">${escapeHTML(c.plan)}</span></td><td>${escapeHTML(c.date)}</td>` : `<td><span class="table-status ${c.status === 'Pending' ? 'pending' : c.status === 'Refunded' ? 'refunded' : ''}">${escapeHTML(c.status)}</span></td><td class="amount">${escapeHTML(money(c.amount, 2))}</td><td>${escapeHTML(c.date)}</td><td>${escapeHTML(c.payment || 'Visa ···· 4242')}</td>`}</tr>`,
        )
        .join('')
    : '<tr><td colspan="5" class="empty-cell">No results found. Try another search.</td></tr>';
  $('#table-count').textContent =
    `Showing ${filtered.length} of ${customers.length} ${isCustomers ? 'customers' : 'transactions'}`;
}
const viewDescriptions = Object.fromEntries(
  Object.entries(config.views).map(([key, data]) => [
    key,
    data.description.replace('{firstName}', config.profile.firstName),
  ]),
);

function setView(next, updateHash = true) {
  if (!Object.hasOwn(viewDescriptions, next)) next = 'overview';
  view = next;
  $('#page-title').innerHTML =
    escapeHTML(config.views[next].title) + '<span class="heading-dot">.</span>';
  $('#breadcrumb-view').textContent = config.views[next].title;
  $('#page-description').textContent = viewDescriptions[next];
  document.querySelectorAll('[data-view]').forEach((el) => {
    el.classList.toggle('active', el.dataset.view === next);
    if (el.dataset.view === next) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
  $('#overview-panels').hidden = next === 'customers' || next === 'reports';
  $('#transactions-panel').hidden =
    next === 'analytics' ||
    next === 'reports' ||
    (next === 'overview' && !config.sections.transactions);
  $('#reports-panel').hidden = next !== 'reports';
  if (updateHash && location.hash !== '#' + next)
    history.replaceState(null, '', '#' + next);
  $('#table-search').value = '';
  renderTable();
  closeMobile();
  $('#chart-tooltip').hidden = true;
}
$('#reports-panel').innerHTML = config.reports
  .map(
    ({ title, description, date, type }) =>
      `<article class="panel report-card">${icon('file')}<span class="report-date">${escapeHTML(date)} · CSV REPORT</span><h2>${escapeHTML(title)}</h2><p>${escapeHTML(description)}</p><button class="button primary" data-export="${escapeHTML(type)}">${icon('download')} Download report</button></article>`,
  )
  .join('');

function downloadReport(type = 'monthly') {
  const data = periods[$('#period').value];
  const chart = chartData();
  const currency = config.format.currency;
  const rows =
    type === 'customers'
      ? [
          ['Name', 'Email', 'Company', 'Region', 'Plan'],
          ...customers.map((c) => [
            c.name,
            c.email,
            c.company,
            c.region,
            c.plan,
          ]),
        ]
      : [
          [
            config.brand.name + ' business report',
            config.demo ? 'Demo data' : 'Business data',
          ],
          ['Period', data.date],
          ['Total revenue ' + currency, data.revenue],
          ['New customers', data.customers],
          ['Total orders', data.orders],
          ['Total savings ' + currency, data.saved],
          [],
          [
            'Reporting bucket',
            `Revenue ${config.format.currentYear} ${currency}`,
            `Revenue ${config.format.previousYear} ${currency}`,
          ],
          ...chart.labels.map((label, i) => [
            label,
            chart.current[i],
            chart.previous[i],
          ]),
        ];
  const csv =
    '\uFEFF' +
    rows
      .map((row) =>
        row
          .map((cell) => '"' + String(cell).replace(/"/g, '""') + '"')
          .join(','),
      )
      .join('\r\n');
  const url = URL.createObjectURL(
    new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `${config.brand.exportPrefix}-${type}-${$('#period').value}-days.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast('Your report is ready. Download started.');
}

function openDialog(title, body) {
  previousFocus = document.activeElement;
  $('#dialog-title').textContent = title;
  $('#dialog-body').innerHTML = body;
  $('#app-dialog').showModal();
  document.body.classList.add('modal-open');
}
$('#dialog-close').addEventListener('click', () => $('#app-dialog').close());
$('#app-dialog').addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  previousFocus?.focus();
});
$('#app-dialog').addEventListener('click', (event) => {
  if (event.target === $('#app-dialog')) {
    const r = event.target.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      event.target.close();
  }
});
const colorRGB = (color) =>
  color
    .slice(1)
    .match(/.{2}/g)
    .map((part) => parseInt(part, 16))
    .join(',');
const palettes = config.theme.palettes.map(({ name, color }) => [
  name,
  color,
  colorRGB(color),
]);

function applyAccent(color, rgb) {
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-rgb', rgb);
}
applyAccent(config.theme.accent, colorRGB(config.theme.accent));
try {
  const saved = localStorage.getItem(config.storageKey);
  const palette = palettes.find((p) => p[1] === saved);
  if (palette) applyAccent(palette[1], palette[2]);
} catch {
  /* Local storage can be unavailable in private browsers. */
}

function openSettings() {
  openDialog(
    'Make it yours',
    '<p>Quiet colors. A clearer workspace.</p><span>Accent color</span><div class="swatches">' +
      palettes
        .map(
          ([name, color, rgb]) =>
            `<button class="swatch" style="--swatch:${color}" data-color="${color}" data-rgb="${rgb}" aria-label="${escapeHTML(name)}" aria-pressed="${getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() === color}"></button>`,
        )
        .join('') +
      '</div><div class="dialog-note">Your choice is saved in this browser.</div>',
  );
}

function openSearch() {
  openDialog(
    'Find your next insight',
    '<input class="dialog-input" id="global-search" type="search" placeholder="Search pages, customers or reports..." aria-label="Search pages, customers or reports"><div id="search-results"></div>',
  );
  const render = () => {
    const q = $('#global-search').value.toLowerCase().trim();
    let results = Object.keys(viewDescriptions)
      .filter(
        (name) =>
          name.includes(q) ||
          config.views[name].title.toLowerCase().includes(q),
      )
      .map((name) => ({ label: config.views[name].title, target: name }));
    if (q)
      results = results.concat(
        customers
          .filter((c) =>
            [c.name, c.company, c.email].some((v) =>
              v.toLowerCase().includes(q),
            ),
          )
          .map((c) => ({
            label: c.name + ' · ' + c.company,
            target: 'customers',
            query: c.name,
          })),
      );
    $('#search-results').innerHTML = results.length
      ? results
          .map(
            (r) =>
              `<button class="search-result" data-search-view="${r.target}" data-query="${escapeHTML(r.query || '')}">${escapeHTML(r.label)} <span>↗</span></button>`,
          )
          .join('')
      : '<p>No matches. Try a page or customer name.</p>';
  };
  $('#global-search').addEventListener('input', render);
  render();
  $('#global-search').focus();
}

function closeMobile() {
  const wasOpen = $('#sidebar').classList.contains('mobile-open');
  $('#sidebar').classList.remove('mobile-open');
  $('#mobile-backdrop').hidden = true;
  $('#mobile-toggle').setAttribute('aria-expanded', 'false');
  if (wasOpen && window.innerWidth <= 1050) $('#mobile-toggle').focus();
}
document.addEventListener('click', (event) => {
  if (event.target.closest('.brand-mark, .wordmark')) {
    event.preventDefault();
    setView('overview');
  }
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) setView(viewButton.dataset.view);
  if (event.target.closest('[data-settings]')) openSettings();
  const swatch = event.target.closest('[data-color]');
  if (swatch) {
    applyAccent(swatch.dataset.color, swatch.dataset.rgb);
    try {
      localStorage.setItem(config.storageKey, swatch.dataset.color);
    } catch {}
    document
      .querySelectorAll('.swatch')
      .forEach((s) => s.setAttribute('aria-pressed', String(s === swatch)));
  }
  const report = event.target.closest('[data-export]');
  if (report) downloadReport(report.dataset.export);
  const result = event.target.closest('[data-search-view]');
  if (result) {
    $('#app-dialog').close();
    setView(result.dataset.searchView);
    if (result.dataset.query) {
      $('#table-search').value = result.dataset.query;
      renderTable();
    }
    $('#page-title').setAttribute('tabindex', '-1');
    $('#page-title').focus();
  }
  const cell = event.target.closest('.heat-cell');
  if (cell)
    toast(
      `${cell.dataset.day}, ${cell.dataset.time} ${config.activity.timezone} · ${cell.dataset.count} orders`,
    );
  if (!event.target.closest('#notification-button, #notification-panel')) {
    $('#notification-panel').hidden = true;
    $('#notification-button').setAttribute('aria-expanded', 'false');
  }
});
$('#period').addEventListener('change', renderMetrics);
$('#chart-mode').addEventListener('change', renderChart);
$('#heatmap-period').addEventListener('change', renderHeatmap);
$('#table-search').addEventListener('input', renderTable);
$('#export-button').addEventListener('click', () =>
  downloadReport(view === 'customers' ? 'customers' : 'monthly'),
);
$('#search-trigger').addEventListener('click', openSearch);
$('#notification-button').addEventListener('click', () => {
  const panel = $('#notification-panel');
  panel.hidden = !panel.hidden;
  $('#notification-button').setAttribute(
    'aria-expanded',
    String(!panel.hidden),
  );
});
$('#notification-report').addEventListener('click', () => {
  setView('reports');
  $('#notification-panel').hidden = true;
  $('#notification-button').setAttribute('aria-expanded', 'false');
});
$('#profile-button').addEventListener('click', () =>
  openDialog(
    `Hello, ${config.profile.firstName}.`,
    `<p><strong>${escapeHTML(config.profile.name)}</strong><br>${escapeHTML(config.profile.role)} · ${escapeHTML(config.brand.workspace)}<br>${escapeHTML(config.profile.email)}</p><div class="dialog-note">${config.demo ? 'This is a portfolio demo profile. ' : ''}Explore the dashboard, change its accent color, or download a report.</div>`,
  ),
);
$('#workspace-button').addEventListener('click', () =>
  openDialog(
    config.brand.workspace,
    `<p>${escapeHTML(config.brand.workspaceDescription)}</p><div class="dialog-note">${config.demo ? 'Demo workspace · ' : ''}${config.geography.countries} customer regions</div>`,
  ),
);
$('#insights-button').addEventListener('click', () => setView('reports'));
$('#help-button').addEventListener('click', () =>
  openDialog(
    'A few helpful shortcuts',
    '<p>Less clicking. More clarity.</p><div class="shortcut-row"><span>Search anything</span><kbd>Ctrl / ⌘ + K</kbd></div><div class="shortcut-row"><span>Switch dashboard page</span><kbd>Alt + 1–4</kbd></div><div class="shortcut-row"><span>Close a dialog or menu</span><kbd>Esc</kbd></div><p style="margin-top:18px">Use Tab to navigate and focus chart bars for their revenue details. Export reports as CSV to explore the data further.</p>',
  ),
);
$('#geography-button').addEventListener('click', () => {
  const otherShare = Math.max(
    0,
    100 - regions.reduce((sum, r) => sum + r.share, 0),
  );
  openDialog(
    'Your customer regions',
    '<p>Customer distribution for the selected reporting period.</p>' +
      regions
        .map(
          (r) =>
            `<div class="region-row"><span class="region-identity">${flagMarkup(r)}${escapeHTML(r.name)}</span><strong>${number(regionCount(r))} · ${r.share}%</strong></div>`,
        )
        .join('') +
      (otherShare
        ? `<div class="region-row"><span>${Math.max(0, config.geography.countries - regions.length)} other countries</span><strong>${otherShare}%</strong></div>`
        : ''),
  );
  initializeFlags($('#dialog-body'));
});
$('#mobile-toggle').addEventListener('click', () => {
  const open = !$('#sidebar').classList.contains('mobile-open');
  $('#sidebar').classList.toggle('mobile-open', open);
  $('#mobile-backdrop').hidden = !open;
  $('#mobile-toggle').setAttribute('aria-expanded', String(open));
  if (open) $('#sidebar .nav-item.active').focus();
});
$('#mobile-backdrop').addEventListener('click', closeMobile);
$('#sidebar-close').addEventListener('click', closeMobile);
document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Tab' &&
    $('#sidebar').classList.contains('mobile-open') &&
    !$('#app-dialog').open
  ) {
    const items = [...$('#sidebar').querySelectorAll('button,a[href]')].filter(
      (el) => el.getClientRects().length,
    );
    const first = items[0],
      last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (!$('#app-dialog').open) openSearch();
  }
  if (
    event.altKey &&
    ['1', '2', '3', '4'].includes(event.key) &&
    !$('#app-dialog').open
  ) {
    event.preventDefault();
    setView(
      ['overview', 'analytics', 'customers', 'reports'][Number(event.key) - 1],
    );
  }
  if (event.key === 'Escape') {
    const open = $('#sidebar').classList.contains('mobile-open');
    closeMobile();
    if (open) $('#mobile-toggle').focus();
    $('#notification-panel').hidden = true;
    $('#notification-button').setAttribute('aria-expanded', 'false');
    $('#chart-tooltip').hidden = true;
  }
});
window.addEventListener('hashchange', () =>
  setView(location.hash.slice(1), false),
);
window.addEventListener('resize', () => {
  if (window.innerWidth > 1050) closeMobile();
  $('#chart-tooltip').hidden = true;
});
window.addEventListener('scroll', () => ($('#chart-tooltip').hidden = true), {
  passive: true,
});

function initializeBrand() {
  const brand = config.brand;

  document.title = brand.name + ' — ' + brand.title;
  $('meta[name="description"]').content = brand.description;
  $('.wordmark').firstChild.textContent = brand.wordmark;
  $('.brand-mark').firstChild.textContent = brand.name[0].toLowerCase();
  $('.brand-mark').setAttribute('aria-label', brand.name + ' home');
  $('.workspace-logo').textContent = brand.name[0].toUpperCase();
  $('#workspace-button').children[1].firstChild.textContent = brand.workspace;
  $('#workspace-button small').textContent = brand.workspaceDescription;
  document
    .querySelectorAll('.avatar')
    .forEach((el) => (el.textContent = config.profile.initials));
  $('#profile-button').setAttribute(
    'aria-label',
    config.profile.name + ' profile',
  );
  $('.main-footer>span:first-child').innerHTML =
    `${escapeHTML(brand.workspace)} <span class="footer-dot">·</span> ${escapeHTML(brand.footer)}`;

  $('.geography-panel .panel-foot').firstChild.textContent =
    `${config.geography.countries} countries in total`;
  $('.geography-panel .panel-foot>span').textContent =
    'Top ' + regions.length + ' shown';
  $('.heatmap-footer>span').textContent =
    'All times in ' + config.activity.timezone;
  $('.legend-previous').parentElement.lastChild.textContent =
    config.format.previousYear;
  $('.legend>span:last-child').lastChild.textContent =
    config.format.currentYear;

  $('#period').innerHTML = Object.entries(periods)
    .map(
      ([key, period]) =>
        `<option value="${escapeHTML(key)}">${escapeHTML(period.label)}</option>`,
    )
    .join('');
  document.querySelectorAll('.nav-item[data-view]').forEach((el) => {
    const text = [...el.childNodes].find(
      (node) => node.nodeType === 3 && node.textContent.trim(),
    );
    if (text) text.textContent = config.views[el.dataset.view].title;
  });
  document
    .querySelectorAll('.rail [data-view]')
    .forEach((el) =>
      el.setAttribute('aria-label', config.views[el.dataset.view].title),
    );
  $('.count').textContent = config.reports.length;
  $('.count').hidden = !config.reports.length;

  const setDirectText = (element, text) => {
    const node = [...element.childNodes].find(
      (node) => node.nodeType === 3 && node.textContent.trim(),
    );
    if (node) node.textContent = text;
  };
  setDirectText($('.eyebrow'), config.copy.eyebrow);
  document
    .querySelectorAll('.metric-top>span:first-child')
    .forEach((el, i) => (el.textContent = config.copy.metrics[i]));
  $('.sidebar-promo h3').textContent = config.copy.promo.title;
  $('.sidebar-promo h3').style.whiteSpace = 'pre-line';
  $('.sidebar-promo p').textContent = config.copy.promo.description;
  setDirectText($('#insights-button'), config.copy.promo.action + ' ');

  $('.demo-strip').classList.toggle('live-workspace', !config.demo);
  $('.demo-strip>span:first-child').hidden = !config.demo;
  $('.demo-strip').childNodes.forEach((node) => {
    if (node.nodeType === 3 && node.textContent.trim())
      node.textContent = config.demo
        ? ' Sample business data '
        : ' ' + brand.workspace + ' ';
  });
  $('.table-footer .pill').hidden = !config.demo;
  $('.notification-panel small').textContent = config.demo
    ? 'Demo workspace · sample notifications'
    : brand.workspace;
  $('.notification-panel p').textContent = config.reports.length
    ? config.reports[0].title + ' is ready.'
    : 'No new reports.';
  $('#notification-report').hidden = !config.reports.length;

  const panels = {
    revenue: '.sales-panel',
    spending: '.costs-panel',
    geography: '.geography-panel',
    activity: '.heatmap-panel',
  };
  Object.entries(panels).forEach(([key, selector]) => {
    $(selector).hidden = config.sections[key] === false;
    setDirectText($(selector + ' h2'), config.copy.panels[key]);
  });

  const categories = config.spending.categories.slice(0, 3);
  categories.forEach((category, i) => {
    const legend = $('.cost-legend').children[i];
    legend.querySelector('span').textContent = category.name;
    legend.querySelector('strong').textContent = category.progress + '%';
    $('.cost-rings')
      .querySelectorAll('.ring')
      [i].setAttribute(
        'stroke-dasharray',
        Math.max(0, Math.min(100, category.progress)) + ' 100',
      );
  });
  $('.cost-rings').setAttribute(
    'aria-label',
    'Savings progress: ' +
      categories.map((c) => c.name + ' ' + c.progress + '%').join(', '),
  );

  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="${config.theme.accent}"/><text x="20" y="28" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="white">${escapeHTML(brand.name[0])}</text></svg>`;
  $('link[rel="icon"]').href =
    'data:image/svg+xml,' + encodeURIComponent(favicon);
}

initializeBrand();
renderMetrics();
renderHeatmap();
setView(location.hash.slice(1) || 'overview', false);
