module.exports = class Player {
  constructor(location) {
    this.movement = {
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd',
    };
    this.location = location;
  }

  moveUp() {
    this.location[0] -= 1;
  }

  moveDown() {
    this.location[0] += 1;
  }

  moveLeft() {
    this.location[1] -= 1;
  }

  moveRight() {
    this.location[1] += 1;
  }

  move(command) {
    switch (command) {
      case this.movement.up:
        this.moveUp();
        break;
      case this.movement.down:
        this.moveDown();
        break;
      case this.movement.left:
        this.moveLeft();
        break;
      case this.movement.right:
        this.moveRight();
        break;
      default:
        return null;
    }
  }
};
