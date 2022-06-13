const regForm = document.getElementById('regForm');
const regStatus = document.getElementById('regStatus');
// ошибка обнуления таймера
const tim = new Date(2022, 07, 31);
const differ = tim - new Date();
if (differ <= 0) {
  document.querySelector('.submit').remove();
  regStatus.innerHTML = "Sorry, but timer is out";
}
// Запрос
regForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    regStatus.classList.remove('warning');
    const data = Object.fromEntries(new FormData(event.target).entries());
    const req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:3000/regform');
    req.responseType = "json";
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function() {
        if (this.readyState != 4) return;
        console.log(typeof this.response)
        if(this.response.error){
            regStatus.classList.add('warning');
        }
        regStatus.innerText = this.response.message;
    }
    req.send(JSON.stringify(data));		
})
// логика таймера
document.addEventListener('DOMContentLoaded', function () {
    const deadline = new Date(2022, 07, 31);
    let timerId = null;
    function declensionNum(num, words) {
      return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
    }
    function countdownTimer() {
      const diff = deadline - new Date();
      if (diff <= 0) {
        clearInterval(timerId);
      }
      const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
      const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
      const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
      const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;
      $days.textContent = days < 10 ? '0' + days : days;
      $hours.textContent = hours < 10 ? '0' + hours : hours;
      $minutes.textContent = minutes < 10 ? '0' + minutes : minutes;
      $seconds.textContent = seconds < 10 ? '0' + seconds : seconds;
      $days.dataset.title = declensionNum(days, ['день', 'дня', 'дней']);
      $hours.dataset.title = declensionNum(hours, ['час', 'часа', 'часов']);
      $minutes.dataset.title = declensionNum(minutes, ['минута', 'минуты', 'минут']);
      $seconds.dataset.title = declensionNum(seconds, ['секунда', 'секунды', 'секунд']);
    }
    const $days = document.querySelector('.timer__days');
    const $hours = document.querySelector('.timer__hours');
    const $minutes = document.querySelector('.timer__minutes');
    const $seconds = document.querySelector('.timer__seconds');
    countdownTimer();
    timerId = setInterval(countdownTimer, 1000);
  });