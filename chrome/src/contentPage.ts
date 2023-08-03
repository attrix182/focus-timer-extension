let time = '';
let intervalId;

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
    intervalId = startTimer(timeBox, duration - 1);
  }

  if (request && request.tabChanged) {
    let remainingTime = getElapsedTime();

    let minutes = remainingTime!.remainingMinutes;
    let seconds = remainingTime!.remainingSeconds;

    if (minutes == -1 || seconds == -1) {
      stopTimer(timeBox);
      return;
    }
    console.log('Retomo con: ' + minutes + ':' + seconds);
    restartTimer(timeBox, minutes + 1, seconds);
  }

  if (request && request.stop) {
    stopTimer(timeBox);
  }
});

function getElapsedTime() {
  const timerInfo = JSON.parse(localStorage.getItem('timerInfo') || '{}');
  const { startedAt, duration } = timerInfo;
  console.log(timerInfo);
  if (!startedAt || !duration) {
    return { remainingMinutes: -1, remainingSeconds: -1 };
  }

  const now = new Date();
  const startedTime = new Date(startedAt);
  const elapsedSeconds = (now.getTime() - startedTime.getTime()) / 1000;
  const remainingMinutes = Math.floor((duration * 60 - elapsedSeconds) / 60);
  const remainingSeconds = Math.round((duration * 60 - elapsedSeconds) % 60);

  console.log('Remaining: ' + remainingMinutes + ':' + remainingSeconds);
  return {
    remainingMinutes: isNaN(remainingMinutes) ? -1 : remainingMinutes,
    remainingSeconds: isNaN(remainingSeconds) ? -1 : remainingSeconds
  };
}


const restartTimer = (element, minutes, seconds = 60) => {
  timer(element, minutes, seconds);
}

const startTimer = (element, minutes, seconds = 60) => {
  localStorage.setItem('timerInfo', JSON.stringify({ startedAt: new Date().toISOString(), duration: minutes }));
  timer(element, minutes, seconds);
};


function timer(element ,minutes, seconds = 60){
  var minute = minutes;
  var sec = seconds;

  // Devolver el ID del intervalo para poder limpiarlo si es necesario
  return setInterval(() => {
    sec--;
    if (sec.toString().length == 1) {
      time = minute + ':0' + sec;
      element.innerHTML = minute + ':0' + sec;
    } else {
      time = minute + ':' + sec;
      element.innerHTML = time;
    }
    if (sec == 0) {
      minute--;
      sec = 60;

      if (minute == 0) {
        minute = 5;
      }
    }
  }, 1000);
}

// Función para detener el temporizador
const stopTimer = (timeBox) => {
  clearInterval(intervalId);
  localStorage.removeItem('timerInfo');
  timeBox.style.display = 'none';
};
