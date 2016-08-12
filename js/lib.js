/*
  Класс Секундомер

  Конструктор принимает DOM-элемент, в который нужно вставить секундомер, по-умолчанию
будет добавлен в body.
  Предполагается использование ОДНОГО секундомера на странице, поэтому для идентификации
кнопок используется атрибут Id. 
  
  Классы CSS для наведения красоты:

.stopwatch              - общий контейнер для элементов
.stopwatch__hh,         - счетчик часов
.stopwatch__mm,         - счетчик минут
.stopwatch__ss,         - счетчик секунд
.stopwatch__ms,         - счетчик милисекунд
.stopwatch__buttons     - контейнер для кнопок
.stopwatch__button,     - кнопки
.stopwatch__timestamp   - контейнер для метки времени (появляется при нажатии на Стоп/Круг)
*/

function Stopwatch(parent) {
  var _miliseconds = 0;
  var _seconds = 0;
  var _minutes = 0;
  var _hours = 0;
  var _stamp = 0;

  var _timestampCount = 0;
  var _isWorking = false;

  var _milisecondsTimer, _secondsTimer, _minutesTimer, _hoursTimer;

  var self = this;

  self.getMiliseconds = function(asText) {
    var ms;
    ms = _isWorking ? (_miliseconds + (+(new Date)) - _stamp)%1000 : _miliseconds;

    if(asText) {
      return ('00' + ms).slice(-3);
    }
    return ms;
  }

  self.getSeconds = function(asText) {

    if(asText) {
      return ('0' + _seconds).slice(-2);
    }
    return _seconds;
  }

  self.getMinutes = function(asText) {
    if(asText) {
      return ('0' + _minutes).slice(-2);
    }
    return _minutes;
  }

  self.getHours = function(asText) {
    if (asText) {
     return ( ('' + _hours).Length > 2 ) ? ('' + _hours) : ('0' + _hours).slice(-2);
    }
    return _hours;
  }

  self.setMiliseconds = function(miliseconds) {
    if(miliseconds >= 1000) {
      _miliseconds = 0;
    } else {
      _miliseconds = miliseconds;
    }
  }

  self.setSeconds = function(seconds) {
    if(seconds >= 60) {
      _seconds = 0;
    } else {
    _seconds = seconds;
    }
  }

  self.setMinutes = function(minutes) {
    if(minutes >= 60) {
      _minutes = 0;
    } else {
    _minutes = minutes;
    }
    _minutes = minutes;
  }

  self.setHours = function(hours) {
    _hours = hours;
  }

  self.getStopwatchValues = function(asText) {
    var values = [];
    if (asText) {
      values.push( self.getHours(1) );
      values.push( self.getMinutes(1) );
      values.push( self.getSeconds(1) );
      values.push( self.getMiliseconds(1) );      
    } else {
      values.push(_hours);
      values.push(_minutes);
      values.push(_seconds);
      values.push(self.getMiliseconds());
    }
    return values;
  }

  self.start = function(e) {
    _isWorking = true;
    _startTimers();
    _stamp = +new Date;

    var elem = e.target;
    elem.innerHTML = 'Стоп';
    elem.removeEventListener('click', self.start);
    elem.addEventListener('click', self.stop);
  }

  self.stop = function(e) {
    _miliseconds = self.getMiliseconds();
    _stopTimers()
    _isWorking = false;
    _addTimestamp('Стоп');
    _refresh();

    var element;

    if (!e || !e.target) {
      element = document.getElementById('stopwatch__start');
    } else {
      element = e.target;
    }

    element.innerHTML = 'Старт';
    element.removeEventListener('click', self.stop);
    element.addEventListener('click', self.start);
    _isWorking = false;
  }

  self.split = function() {
    if (_isWorking) {
      _addTimestamp('Круг');     
    }
  }

  self.reset = function() {
    self.stop();
    _hours = _minutes = _seconds = _miliseconds = _timestampCount = 0;
   
    var parentElement = document.querySelector('.stopwatch');
    var timestamps = document.querySelectorAll('.stopwatch__timestamp');

    timestamps.forEach(function(item, i, arr) {
      parentElement.removeChild(item);
    })
    _refresh();
  }

  /* 
    Создаем div, в котором находятся элементы секундомера, и возвращаем полученный элемент
  для вставки на страницу
  */
  function _createSelf() {
    var parentElement = document.createElement('div');
    parentElement.classList.add('stopwatch');

    var text = document.createTextNode(':');

    var element = document.createElement('span');
    element.classList.add('stopwatch__hh');
    element.id = 'stopwatch__hh';
    element.innerHTML =  '' + self.getHours(1);
    parentElement.appendChild(element);
    
    parentElement.appendChild(text);

    element = document.createElement('span');
    element.classList.add('stopwatch__mm');
    element.id = 'stopwatch__mm';
    element.innerHTML =  '' + self.getMinutes(1);
    parentElement.appendChild(element);
    
    text = document.createTextNode(':');
    parentElement.appendChild(text);

    element = document.createElement('span');
    element.classList.add('stopwatch__ss');
    element.id = 'stopwatch__ss';
    element.innerHTML =  '' + self.getSeconds(1);
    parentElement.appendChild(element);
    
    text = document.createTextNode('.');
    parentElement.appendChild(text);

    element = document.createElement('span');
    element.classList.add('stopwatch__ms');
    element.id = 'stopwatch__ms';
    element.innerHTML =  '' + self.getMiliseconds(1);
    parentElement.appendChild(element);

    var subElement = document.createElement('div');
    element.classList.add('stopwatch__buttons');
    parentElement.appendChild(subElement);

    element = document.createElement('button');
    element.classList.add('stopwatch__button');
    element.id = 'stopwatch__start';
    element.innerHTML =  'Старт';
    element.addEventListener('click', self.start);
    subElement.appendChild(element);

    element = document.createElement('button');
    element.classList.add('stopwatch__button');
    element.id = 'stopwatch__start';
    element.innerHTML =  'Круг';
    element.addEventListener('click', self.split);
    subElement.appendChild(element);

    element = document.createElement('button');
    element.classList.add('stopwatch__button');
    element.id = 'stopwatch__start';
    element.innerHTML =  'Сброс';
    element.addEventListener('click', self.reset);
    subElement.appendChild(element);

    return parentElement;
  }

  function _startTimers() {
    _hoursTimer = setInterval(
      function() {
        self.setHours(++_hours);
      }, 
      3600000);
    
    _minutesTimer = setInterval(
      function() {
        self.setMinutes(++_minutes);
      }, 
      60000);
    
    _secondsTimer = setInterval(
      function() {
        _stamp = +new Date;
        _miliseconds = 0;
        self.setSeconds(++_seconds);
      },
      1000);

    _milisecondsTimer = setInterval(
      function() {
        _refresh();      
      },
      1);
  }

  function _stopTimers() {
    clearInterval(_milisecondsTimer);
    clearInterval(_secondsTimer);
    clearInterval(_minutesTimer);
    clearInterval(_hoursTimer);
  }

  function _refresh() {
    var arr = self.getStopwatchValues(1);
    
    var element = document.getElementById('stopwatch__hh');
    element.innerHTML = arr[0];

    element = document.getElementById('stopwatch__mm');
    element.innerHTML = arr[1];

    element = document.getElementById('stopwatch__ss');
    element.innerHTML = arr[2];

    element = document.getElementById('stopwatch__ms');
    element.innerHTML = arr[3];
  }

  function _addTimestamp(source) {
    var arr = self.getStopwatchValues(1);
    _timestampCount++;

    var parentElement = document.querySelector('.stopwatch');
    var element = document.createElement('div');
    element.classList.add('stopwatch__timestamp');
    
    element.innerHTML = _timestampCount + ' ' + source + ': ' + arr[0] +
      ':' + arr[1] + ':' + arr[2] + '.' + arr[3];

    parentElement.appendChild(element);
  }

  /* 
    Здесь нужно добавить проверку на допустимость родительского элемента для вставки в него div-а,
    пока просто проверяется, что это html-элемент
  */
  if (!parent || !parent.tagName) {
    parent = document.getElementsByTagName('body')[0];
  }
  parent.appendChild( _createSelf() );
}

/*
  Пример использования
*/
var element = document.querySelector('.wrapper');
var stopwatch = new Stopwatch(element);
