let time = '';

chrome.runtime.onMessage.addListener((request, sender, respond) => {
  let timeBox = document.getElementById('timeBox');
  if (!timeBox) {
    timeBox = document.createElement('div');
    timeBox.setAttribute('id', 'timeBox');
    timeBox.style.cssText =
      'position: fixed; top: 10px; right: 15px; z-index: 1001; font-size: 20px; color: white; font-weight: bold; background: #4f6ae3;padding: 10px;border-radius: 15px;';
    document.body.appendChild(timeBox);
  }

  let duration = request.duration;
  if (request && request.duration) {
    stopTimer(timeBox);
    timeBox.style.display = 'block';
    startTimer(timeBox, duration);
  }

  if (request && request.tabChanged) {
    let remainingTime = getElapsedTime();

    return setInterval(() => {
      let remainingTime = getElapsedTime();
      if(remainingTime <= '00:00') {
        stopTimer(timeBox);
      }
      timeBox!.innerHTML = remainingTime;
    });
  }

  if (request && request.stop) {
    stopTimer(timeBox);
  }
});

const startTimer = (element: HTMLElement, duration: number) => {
  let finishTime = getFinish(duration).getTime();
  localStorage.setItem('timerInfo', JSON.stringify({ finishAt: finishTime }));
  return setInterval(() => {
    let remainingTime = getElapsedTime();
    if(remainingTime <= '00:00') {
      stopTimer(element);
    }
    element.innerHTML = remainingTime;
  });
};

const getElapsedTime = () => {
  const timerInfo = JSON.parse(localStorage.getItem('timerInfo') || '{}');
  const out = getMinutesRemaining(timerInfo.finishAt);
  return new Date(out).toLocaleTimeString('es-ES', { minute: '2-digit', second: '2-digit' });
};

const getMinutesRemaining = (finishDate) => {
  let now = new Date().getTime();
  let finishParse = finishDate;
  return finishParse - now;
};

const getFinish = (duartion) => {
  let now = new Date();
  return new Date(now.getTime() + duartion * 60000); // 1 minute = 60000 milliseconds
};

// Función para detener el temporizador
const stopTimer = (timeBox) => {
  localStorage.removeItem('timerInfo');
  timeBox.style.display = 'none';
};
