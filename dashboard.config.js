'use strict';

// START HERE. Change this file to adapt the dashboard to your own project.
// Loaded before app.js; no build tools, imports or server required.
window.DASHBOARD_CONFIG = {
  brand: {
    name: 'Dashboard',
    wordmark: 'dashboard',
    workspace: 'Portfolio Workspace',
    workspaceDescription: 'Business workspace',
    title: 'Business Analytics',
    description:
      'A free, editable business analytics dashboard for portfolio projects.',
    footer: 'Free to use and edit for your portfolio.',
    exportPrefix: 'dashboard',
  },
  profile: {
    name: 'Alex Johnson',
    firstName: 'Alex',
    initials: 'AJ',
    email: 'alex@example.com',
    role: 'Workspace owner',
  },
  format: {
    locale: 'en-US',
    currency: 'USD',
    currentYear: 2026,
    previousYear: 2025,
  },
  // Give each project its own storage key so preferences don't leak between demos.
  storageKey: 'portfolio-dashboard-accent',
  theme: {
    accent: '#6684ad',
    palettes: [
      { name: 'Slate blue', color: '#6684ad' },
      { name: 'Steel blue', color: '#70939f' },
      { name: 'Dusty indigo', color: '#8186a5' },
    ],
  },
  demo: true,
  views: {
    overview: {
      title: 'Overview',
      description: 'Welcome back, {firstName}. Here’s your business summary.',
    },
    analytics: {
      title: 'Analytics',
      description:
        'Revenue, spending and order activity for the selected period.',
    },
    customers: {
      title: 'Customers',
      description: 'Customer records, plans and locations.',
    },
    reports: {
      title: 'Reports',
      description: 'Download revenue summaries and customer records.',
    },
  },
  // Set a section to false to remove it from Overview and Analytics.
  sections: {
    revenue: true,
    spending: true,
    geography: true,
    activity: true,
    transactions: true,
  },
  copy: {
    eyebrow: 'BUSINESS ANALYTICS',
    metrics: ['Total revenue', 'New customers', 'Total orders'],
    panels: {
      revenue: 'Revenue overview',
      spending: 'Cost savings',
      geography: 'Customers by country',
      activity: 'Order activity',
    },
    promo: {
      title: 'Monthly reports',
      description: 'Revenue summaries and customer records, ready to export.',
      action: 'View reports',
    },
  },
  spending: {
    change: 12.8,
    categories: [
      { name: 'Operations', progress: 82 },
      { name: 'Marketing', progress: 68 },
      { name: 'Logistics', progress: 54 },
    ],
  },
  reports: [
    {
      title: 'September performance',
      description:
        'Revenue, customers and orders in one clear monthly snapshot.',
      date: 'Sep 30, 2026',
      type: 'monthly',
    },
    {
      title: 'Customer growth',
      description: 'A breakdown of the people and regions driving your growth.',
      date: 'Sep 30, 2026',
      type: 'customers',
    },
  ],
  // Weights shape the demo chart. Each period's revenue is distributed over its labels.
  revenueWeights: {
    current: [
      14500, 18200, 16800, 22100, 19700, 24500, 21600, 26200, 28700, 23400,
      25600, 29100,
    ],
    previous: [
      11200, 13600, 10800, 15700, 14200, 18100, 16400, 19200, 20500, 17400,
      18900, 21800,
    ],
  },
  periods: {
    30: {
      label: 'Last 30 days',
      revenue: 380240,
      customers: 5254,
      orders: 9830,
      saved: 23123,
      date: 'Sep 1 – Sep 30, 2026',
      changes: [24.8, 18.6, 32.4],
      spendingLabel: 'THIS MONTH',
      chartDescription: 'September revenue · grouped every three days',
      chartPrefix: 'Sep ',
      chartLabels: [
        '1–3',
        '4–6',
        '7–9',
        '10–12',
        '13–15',
        '16–18',
        '19–21',
        '22–24',
        '25–27',
        '28–30',
      ],
      // Optional: provide chartCurrent and chartPrevious arrays with your actual values.
      // chartCurrent must contain one value per chart label. Its sum becomes the revenue metric.
    },
    90: {
      label: 'Last 90 days',
      revenue: 1026648,
      customers: 14201,
      orders: 26541,
      saved: 62432,
      date: 'Jul 1 – Sep 30, 2026',
      changes: [21.2, 16.3, 28.7],
      spendingLabel: 'THIS QUARTER',
      chartDescription: 'Quarterly revenue · grouped by reporting week',
      chartPrefix: '',
      chartLabels: [
        'Jul 1',
        'Jul 8',
        'Jul 16',
        'Jul 24',
        'Aug 1',
        'Aug 8',
        'Aug 16',
        'Aug 24',
        'Sep 1',
        'Sep 8',
        'Sep 16',
        'Sep 24',
      ],
    },
    365: {
      label: 'This year',
      revenue: 3954496,
      customers: 54642,
      orders: 102232,
      saved: 240479,
      date: 'Jan 1 – Sep 30, 2026 · year to date',
      changes: [19.5, 22.1, 30.2],
      spendingLabel: 'THIS YEAR',
      chartDescription: 'Year-to-date revenue · grouped by month',
      chartPrefix: '',
      chartLabels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
      ],
    },
  },
  customers: [
    {
      name: 'Olivia Rhye',
      email: 'olivia@acme.com',
      initials: 'OR',
      company: 'Acme Inc.',
      region: 'United States',
      date: 'Sep 30, 2026',
      amount: 1240,
      status: 'Completed',
      plan: 'Pro',
    },
    {
      name: 'Phoenix Baker',
      email: 'phoenix@layers.design',
      initials: 'PB',
      company: 'Layers',
      region: 'United Kingdom',
      date: 'Sep 30, 2026',
      amount: 890,
      status: 'Completed',
      plan: 'Team',
    },
    {
      name: 'Lana Steiner',
      email: 'lana@sisyphus.com',
      initials: 'LS',
      company: 'Sisyphus',
      region: 'Germany',
      date: 'Sep 29, 2026',
      amount: 2450,
      status: 'Pending',
      plan: 'Business',
    },
    {
      name: 'Demi Wilkinson',
      email: 'demi@catalog.studio',
      initials: 'DW',
      company: 'Catalog',
      region: 'Canada',
      date: 'Sep 29, 2026',
      amount: 560,
      status: 'Completed',
      plan: 'Pro',
    },
    {
      name: 'Drew Cano',
      email: 'drew@circooles.com',
      initials: 'DC',
      company: 'Circooles',
      region: 'Japan',
      date: 'Sep 28, 2026',
      amount: 1820,
      status: 'Refunded',
      plan: 'Business',
    },
  ],
  geography: {
    countries: 24,
    // ISO country codes. Use GB for the United Kingdom, not UK.
    flagBaseUrl: 'https://flagcdn.com/w80',
    localFlagPath: 'assets/flags',
    localFlags: ['us', 'gb', 'de', 'jp', 'pl'],
    regions: [
      { code: 'US', name: 'United States', share: 36 },
      { code: 'GB', name: 'United Kingdom', share: 24 },
      { code: 'DE', name: 'Germany', share: 16 },
      { code: 'JP', name: 'Japan', share: 10 },
    ],
  },
  activity: {
    timezone: 'UTC',
    times: ['8 am', '11 am', '2 pm', '5 pm', '8 pm'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    current: [
      [18, 34, 72, 25, 41, 105, 26],
      [42, 84, 124, 67, 86, 176, 53],
      [68, 127, 192, 82, 112, 246, 74],
      [46, 98, 154, 57, 126, 184, 61],
      [22, 56, 98, 42, 83, 132, 37],
    ],
    // Set previous to a matching matrix for your real previous-week numbers.
    previous: null,
  },
};
