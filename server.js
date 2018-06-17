const dweetClient = require('node-dweetio');
const five = require('johnny-five');

const board = new five.Board();
const dweetio = new dweetClient();

board.on('ready', () => {
  const temperatureSensor = new five.Sensor({
    pin: 'A0',
    threshold: 4
  });

  temperatureSensor.on('change', (value) => {
    const dweetThing = 'node-temperature-monitor';
    let Vo = value;
    const R1 = 10000;
    let logR2, R2, T;
    const c1 = 1.009249522e-03;
    const c2 = 2.378405444e-04;
    const c3 = 2.019202697e-07;
    R2 = R1 * (1023.0 / Vo - 1.0);
    logR2 = Math.log(R2);
    T = (1.0 / (c1 + c2 * logR2 + c3 * logR2 * logR2 * logR2));
    T = T - 273.15;
    T = (T * 9.0) / 5.0 + 32.0;
    T = (T - 32) * (5 / 9);
    const tweetMessage = {
      temperature: +T.toFixed(2)
    };

    dweetio.dweet_for(dweetThing, tweetMessage, (err, dweet) => {
      if (err) {
        console.log('[Error]: ', err);
      }
      if (dweet) {
        console.log(dweet.content);
      }
    });
  });
});