const $ = selector => document.querySelector(selector);
const modal = $('#client-modal');
let selectedName = 'João Silva';
document.querySelectorAll('.customers button').forEach(button => button.addEventListener('click', () => {
  selectedName = button.dataset.name;
  $('#work-current').textContent = button.dataset.name;
  $('#name').textContent = button.dataset.name;
  $('#car').textContent = button.dataset.car;
  $('#risk').textContent = `${button.dataset.risk}%`;
  $('#risk-label').textContent = Number(button.dataset.risk) >= 75 ? 'ALTO RISCO' : 'RISCO MODERADO';
  $('#factors').innerHTML = button.dataset.factors.split('|').map(item => `<li>${item}</li>`).join('');
  modal.classList.add('show');
}));
document.querySelectorAll('.close').forEach(button => button.addEventListener('click', () => modal.classList.remove('show')));
modal.addEventListener('click', event => { if (event.target === modal) modal.classList.remove('show'); });
$('#opportunity').addEventListener('click', () => {
  modal.classList.remove('show');
  const success = $('#success');
  success.classList.add('show', 'processing');
  $('#status').textContent = 'Analisando oportunidade...';
  $('#lead-message').textContent = `${selectedName} foi adicionado à lista de oportunidades da concessionária.`;
  setTimeout(() => { $('#status').textContent = 'Oportunidade priorizada para a concessionária'; success.classList.remove('processing'); }, 850);
});
$('#back-customers').addEventListener('click', () => {
  $('#success').classList.remove('show');
  $('#risk-counter').textContent = '2.183';
  $('#prioritized').textContent = '1 oportunidade priorizada';
  $('#risk-counter').parentElement.classList.add('updated');
});
