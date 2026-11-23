const screens = document.querySelector('#choose-video');
const qualities = document.querySelector('#choose-quality');
const watch = document.querySelector('#watch');
const video = document.querySelector('#video');
const qualityButtons = [...document.querySelectorAll('[data-quality]')];
const play = document.querySelector('#play');
const message = document.querySelector('#player-message');
let activeScreen;
let activeQuality;

function show(section, focusTarget) {
  for (const step of [screens, qualities, watch]) {
    step.hidden = step !== section;
  }
  focusTarget.focus();
}

for (const button of document.querySelectorAll('[data-screen]')) {
  button.addEventListener('click', () => {
    activeScreen = button;
    activeQuality = undefined;
    for (const choice of qualityButtons) choice.setAttribute('aria-pressed', 'false');
    play.disabled = true;
    document.querySelector('#selected-screen').textContent = button.textContent.trim();
    show(qualities, document.querySelector('#quality-title'));
  });
}

for (const button of qualityButtons) {
  button.addEventListener('click', () => {
    activeQuality = button;
    for (const choice of qualityButtons) choice.setAttribute('aria-pressed', String(choice === button));
    play.disabled = false;
  });
}

document.querySelector('#back-to-screens').addEventListener('click', () => show(screens, activeScreen));

play.addEventListener('click', () => {
  const title = document.querySelector('#now-playing');
  title.textContent = activeScreen.textContent.trim() + ' · ' + activeQuality.querySelector('strong').textContent;
  message.textContent = '';
  video.poster = './media/' + activeScreen.dataset.screen + '.jpg';
  video.src = './media/' + activeScreen.dataset.screen + '-' + activeQuality.dataset.quality + '.mp4';
  show(watch, title);
  video.play().catch((error) => {
    if (error.name === 'NotAllowedError' && !watch.hidden) {
      message.textContent = 'Użyj przycisku odtwarzania na wideo.';
    }
  });
});

video.addEventListener('error', () => {
  if (!watch.hidden) message.textContent = 'Nie udało się wczytać wideo. Spróbuj ponownie lub wybierz inną jakość.';
});

document.querySelector('#back-to-quality').addEventListener('click', () => {
  show(qualities, activeQuality);
  video.pause();
  video.removeAttribute('src');
  video.load();
});
