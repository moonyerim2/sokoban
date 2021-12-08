const MapMaker = require('./mapMaker');
const GameViewer = require('./gameViewer');
const Player = require('./player');
const Ball = require('./ball');

module.exports = class GameController {
  constructor() {
    this.gameMap = new MapMaker();
    this.gameView = new GameViewer();
    this.turn = 0;
    this.currentStage = 1;
    this.command = {
      end: 'q',
      reset: 'r',
    };
    this.isBlocked = false;
    this.STAGE = 'Stage';
    this.init();
  }

  deleteLocationValue(locationValue) {
    if (Array.isArray(locationValue)) {
      return locationValue[0];
    } else {
      return ' ';
    }
  }

  addLocationValue(currentLocationValue, object) {
    if (currentLocationValue === ' ') {
      return object;
    }

    if (currentLocationValue === this.gameMap.dataMappingSet.hall) {
      return [currentLocationValue, object];
    }
  }

  setNewLocation(player, command) {
    player.move(command);

    return [...player.location];
  }

  moveToNoBlockedSpace(map, locationBeforeMove, currentLocation, object) {
    map[locationBeforeMove[0] - 1][locationBeforeMove[1] - 1] = this.deleteLocationValue(map[locationBeforeMove[0] - 1][locationBeforeMove[1] - 1]);
    map[currentLocation[0] - 1][currentLocation[1] - 1] = this.addLocationValue(map[currentLocation[0] - 1][currentLocation[1] - 1], object);
  }

  checkObstacle(obstacle) {
    return [' ', this.gameMap.dataMappingSet.hall].indexOf(obstacle);
  }


  setIsBlocked(map, locationAfterMove) {
    const empty = -1;
    const blockedInfo = {
      isBlocked: false,
      obstacle: map[locationAfterMove[0] - 1][locationAfterMove[1] - 1],
    };

    if (this.checkObstacle(blockedInfo.obstacle) === empty) {
      blockedInfo.isBlocked = true;
    }

    return blockedInfo;
  }

  changeBallLocation(obstacle, map, command, location, player) {
    if (obstacle === this.gameMap.dataMappingSet.wall) {
      return;
    }

    const locationBeforeMove = location;
    const locationAfterMove = Ball.move(command, locationBeforeMove);
    const blockedInfo = this.setIsBlocked(map, locationAfterMove);

    if (blockedInfo.isBlocked) {
      return;
    }

    this.moveToNoBlockedSpace(map, locationBeforeMove, locationAfterMove, this.gameMap.dataMappingSet.ball);
    this.changePlayerLocation(command, player, map);
  }

  changePlayerLocation(command, player, map) {
    const locationBeforeMove = [...player.location];
    const locationAfterMove = this.setNewLocation(player, command);
    const blockedInfo = this.setIsBlocked(map, locationAfterMove);
    this.isBlocked = blockedInfo.isBlocked;

    if (this.isBlocked) {
      player.location = locationBeforeMove;
      this.changeBallLocation(blockedInfo.obstacle, map, command, locationAfterMove, player);

      return;
    }

    this.moveToNoBlockedSpace(map, locationBeforeMove, locationAfterMove, this.gameMap.dataMappingSet.player);
    this.turn += 1;
  }

  countGoalFromRow(row, rowIndex, goal) {
    row.forEach((i, columnIndex) => {
      if (Array.isArray(i) && i.includes(2)) {
        goal.push([rowIndex, columnIndex]);
      }
    });
  }

  countGoal(map, player) {
    const goal = [];

    map.forEach((row, index) => {
      this.countGoalFromRow(row, index, goal);
    });

    if (goal.length === this.gameMap.stagesInfo[`${this.STAGE}${this.currentStage}`].countHall) {
      this.stageClear(player);
    }
  }

  stageClear(player) {
    if (this.currentStage === Object.keys(this.gameMap.stages).length) {
      this.gameView.renderGameClearMessage();
      return;
    }

    this.gameView.renderStageClearMessage(`${this.STAGE}${this.currentStage}`);
    this.turn = 0;

    this.currentStage += 1;

    player.location = this.gameMap.stagesInfo[`${this.STAGE}${this.currentStage}`].locationOfPlayer;
    this.gameView.renderStage(this.gameMap.stages[`${this.STAGE}${this.currentStage}`], `${this.STAGE}${this.currentStage}`);
  }

  executeCommand(player, commandArr, stage) {
    const map = this.gameMap.stages[stage];

    commandArr.forEach(command => {
      this.changePlayerLocation(command, player, map);
      this.gameView.renderMap(map);

      if (this.isBlocked) {
        this.gameView.renderErrMessage(command);
      } else {
        this.gameView.renderMessage(command);
        this.gameView.renderTurn(this.turn);
        this.countGoal(map, player);
      }
    });
  }

  resetStage(player) {
    this.currentStage = 1;
    this.turn = 0;
    const stage = `${this.STAGE}${this.currentStage}`;

    this.gameMap.setMapData();
    player.location = this.gameMap.stagesInfo[stage].locationOfPlayer;
    
    this.gameView.renderInitMessage(this.command.reset);
    this.gameView.renderStage(this.gameMap.stages[stage], stage);
  }

  creatReadlineInterface() {
    const readline = require('readline');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return rl;
  }

  play(player) {
    const rl = this.creatReadlineInterface();
    rl.setPrompt('SOKOBAN> ');
    rl.prompt();

    rl.on('line', line => {
      if (line === this.command.end) {
        this.gameView.renderMessage(this.command.end);
        rl.close();
      } else if (line === this.command.reset) {
        this.resetStage(player);
        rl.prompt();
      } else {
        this.executeCommand(player, line.toLocaleLowerCase().split(''), `${this.STAGE}${this.currentStage}`);
        rl.prompt();
      }
    });
  }

  init() {
    const stage = `${this.STAGE}${this.currentStage}`;

    this.gameMap.setMapData();
    this.gameView.renderGreetingMessage();
    this.gameView.renderStageName(stage);
    this.gameView.renderMap(this.gameMap.stages[stage]);

    this.player = new Player(this.gameMap.stagesInfo[stage].locationOfPlayer);
    this.play(this.player);
  }
};
