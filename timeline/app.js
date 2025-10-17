// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Greeting by month (customize messages as you like)
(function setMonthlyGreeting() {
  const monthName = new Date().toLocaleDateString(undefined, { month: 'long' });

  const messages = {
    January:   'Hello January ❄️',
    February:  'Hello February ❤️',
    March:     'Hello March 🌱',
    April:     'Hello April 🌦️',
    May:       'Hello May 🌼',
    June:      'Hello June ☀️',
    July:      'Hello July 🎆',
    August:    'Hello August 🏖️',
    September: 'Hello September 📚',
    October:   'Hello October 🎃',
    November:  'Hello November 🦃',
    December:  'Hello December 🎄'
  };

  const el = document.getElementById('greeting');
  if (el) el.textContent = messages[monthName] || `Hello ${monthName}`;

  // Optional: let CSS react to the current month
  document.documentElement.setAttribute('data-month', monthName.toLowerCase());
})();
