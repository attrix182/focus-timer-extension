let time = '';

chrome.runtime.onMessage.addListener((request, sender, respond) => {
  let timeBox = document.createElement('div');
  timeBox.style.cssText =
    'position: absolute; top: 10px; right: 15px; z-index: 1000; font-size: 20px; color: white; font-weight: bold; background: #4f6ae3;padding: 10px;border-radius: 15px;';
  document.body.appendChild(timeBox);
  let duration = request.duration;

  if (request.stop) {
    console.log('stop');
    stopTimer(timeBox);
  }
  if (request && request.duration) {
    startTimer(timeBox, duration);
  }
});

function stopTimer(timeBox) {
  timeBox.style.display = 'none';
  document.body.removeChild(timeBox);
}

function startTimer(element, duration) {
  var minute = duration - 1;
  var sec = 60;
  setInterval(function () {
    sec--;
    if (sec.toString().length == 1) {
      time = minute + ':0' + sec;
      element.innerHTML = minute + ':0' + sec;
    } else {
      time = minute + ':' + sec;
      element.innerHTML = minute + ':' + sec;
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
