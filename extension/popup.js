const TASKS = [
  '7:30 Morning medicine',
  '9:00 Drink water',
  '11:00 Brain activity',
  '1:00 Lunch',
  '4:30 Evening walk',
  '8:30 Night medicine',
];

const HELPLINES = [
  ['Emergency', '112'],
  ['Ambulance', '108'],
  ['Police', '100'],
  ['Fire', '101'],
  ['Ambulance', '102'],
  ['Health', '104'],
  ['Women', '181'],
  ['Women police', '1091'],
  ['Childline', '1098'],
  ['Elderline', '14567'],
  ['Tele-MANAS', '14416'],
  ['Tele-MANAS TF', '18008914416'],
  ['Legal aid', '14490'],
  ['Senior', '15100'],
];

document.getElementById('tasks').innerHTML = TASKS.map((row) => `<li>${row}</li>`).join('');
document.getElementById('helplines').innerHTML = HELPLINES.map(([name, phone]) => (
  `<a class="chip" href="tel:${phone}">${name} ${phone}</a>`
)).join('');

const app = document.getElementById('open-app');
app.href = 'http://127.0.0.1:5173/';
app.addEventListener('click', (event) => {
  event.preventDefault();
  chrome.tabs.create({ url: 'http://127.0.0.1:5173/' });
});
