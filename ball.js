module.exports = class Ball {
  static moveUp(location) {
    return [location[0] - 1, location[1]];
  }

  static moveDown(location) {
    return [location[0] + 1, location[1]];
  }

  static moveLeft(location) {
    return [location[0], location[1] - 1];
  }

  static moveRight(location) {
    return [location[0], location[1] + 1];
  }

  static move(command, location) {
    switch (command) {
      case 'w':
        return Ball.moveUp(location);
      case 's':
        return Ball.moveDown(location);
      case 'a':
        return Ball.moveLeft(location);
      case 'd':
        return Ball.moveRight(location);
      default:
        return null;
    }
  }
};
