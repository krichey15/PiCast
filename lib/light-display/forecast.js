
'use strict';

module.exports = (forecast) => {

  const Gpio = require('onoff').Gpio;

  const on = 1,
    count = 25,
    seconds = 5000;

  const blue = new Gpio(18, 'out'),
    white = new Gpio(23, 'out'),
    yellow = new Gpio(24, 'out'),
    red = new Gpio(21, 'out');

  const rain = [ 'chancerain', 'tstorms','chancesleet', 'chancestorms', 'sleet', 'rain', 'tstorms' ],
    sun =  [ 'sunny', 'partlysunny', 'mostlysunny', 'clear' ],
    cloudy = [ 'cloudy', 'fog', 'partlycloudy', 'mostlycloudy' ],
    severe = [ 'snow', 'sleet', 'HWW', 'VOL', 'FIR', 'SPE', 'FOG', 'HEA', 'SVR', 'WND', 'WAT', 'FLO', 'WIN', 'SEW', 'WRN', 'TOW', 'TOR', 'HUR' ];

  let blink = (count, led) => {

    if (count <= 0) return led.unexport();

    led.read((err, value) => {
      if (err) throw err;

      led.write(value ^ 1, (err) => {
        if (err) throw err;
      });

    });

    setTimeout(() => {
      blink(count - 1, led);
    }, 200);

  };

  let turnOff = (...bulbs) => {

    for(let each in bulbs) {
      clearInterval();
      bulbs[each].writeSync(0);
      bulbs[each].unexport();
    }

  };

  if(rain.indexOf(forecast) !== -1) {

    if(forecast === 'rain' || forecast === 'tstorms'){

      blue.writeSync(on);
      setTimeout(() => turnOff(blue), seconds);

    }
    else blink(count, blue);

  }

  if(cloudy.indexOf(forecast) !== -1){

    white.writeSync(on);
    setTimeout(() => turnOff(white), seconds);

  }

  if(sun.indexOf(forecast) !== -1){

    yellow.writeSync(on);
    if(forecast === 'mostlysunny' || forecast === 'partlysunny') blink(count, yellow);
    else setTimeout(() => turnOff(yellow), seconds);

  }

  if(severe.indexOf(forecast) !== -1){

    red.writeSync(on);

    if(forecast === 'snow' || forecast === 'WIN') {
      white.writeSync(on);
      setTimeout(() => turnOff(red, white), seconds);
    } 
    
    else if (forecast === 'FLO' || forecast === 'sleet' || forecast === 'WRN' || forecast === 'SEW') {
      blink(count, blue);
    }
    else setTimeout(() => turnOff(red), seconds);

  }

};