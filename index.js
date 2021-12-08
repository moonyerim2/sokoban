const GameController = require('./gameController');

class App {
  constructor() {
    this.init();
  }

  init() {
    new GameController();
  }
}

new App();
