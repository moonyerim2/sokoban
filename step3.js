const { threadId } = require('worker_threads');

class MapMaker {
  constructor() {
    this.mapText = '';
    this.dataMappingSet = {
      wall: 0,
      hall: 1,
      ball: 2,
      player: 3,
      stageBreakPoint: 4,
    };
    this.stages = {};
    this.stagesInfo = {};
  }

  readFile() {
    const fs = require('fs');
    this.mapText = fs.readFileSync('map.txt').toString();
  }

  mapSymbolToNumber(symbol) {
    switch (symbol) {
      case '#':
        return this.dataMappingSet.wall;
      case 'O':
        return this.dataMappingSet.hall;
      case 'o':
        return this.dataMappingSet.ball;
      case 'P':
        return this.dataMappingSet.player;
      case '=':
        return this.dataMappingSet.stageBreakPoint;
      default:
        return ' ';
    }
  }

  mapLineToNumber(line) {
    return line.split('').map(i => this.mapSymbolToNumber(i));
  }

  processMapData() {
    const processedData = [];
    const dataArr = this.mapText.split('\n');

    dataArr.forEach(line => {
      if (line.includes('Stage')) {
        return;
      }
      processedData.push(this.mapLineToNumber(line));
    });

    return processedData;
  }

  setStages() {
    const dataArr = this.processMapData();
    let i = 1;
    let singleStage = [];

    dataArr.forEach(data => {
      if (data.includes(this.dataMappingSet.stageBreakPoint)) {
        this.stages[`Stage${i}`] = singleStage;
        singleStage = [];
        i += 1;
        return;
      }
      singleStage.push(data);
    });

    this.stages[`Stage${i}`] = singleStage;
  }

  initStageInfo() {
    return {
      width: 0,
      heigth: 0,
      countHall: 0,
      countBall: 0,
      locationOfPlayer: 0,
    };
  }

  setHeight(stageInfo, stage) {
    stageInfo.heigth = stage.length;
  }

  setWidth(stageInfo, row) {
    if (stageInfo.width < row.length) {
      stageInfo.width = row.length;
    }
  }

  setInfo(stageInfo, row, i) {
    row.forEach((el, j) => {
      if (el === this.dataMappingSet.hall) {
        stageInfo.countHall += 1;
      } else if (el === this.dataMappingSet.ball) {
        stageInfo.countBall += 1;
      } else if (el === this.dataMappingSet.player) {
        stageInfo.locationOfPlayer = [i + 1, j + 1];
      }
    });
  }

  setSingleStageInfo(stage) {
    const stageInfo = this.initStageInfo();
    this.setHeight(stageInfo, stage);

    stage.forEach((row, i) => {
      this.setWidth(stageInfo, row);
      this.setInfo(stageInfo, row, i);
    });

    return stageInfo;
  }

  setStagesInfo() {
    for (let stage in this.stages) {
      this.stagesInfo[stage] = this.setSingleStageInfo(this.stages[stage]);
    }
  }

  setMapData() {
    this.readFile();
    this.setStages();
    this.setStagesInfo();
  }
}

class GameViewer {
  constructor() {
    this.dataMappingSet = {
      0: '#',
      1: 'O',
      2: 'o',
      3: 'P',
    };
    this.movementKey = {
      w: '위',
      s: '아래',
      a: '왼쪽',
      d: '오른쪽',
    };
    this.q = 'Bye~';
    this.goal = '0';
  }

  mapArrayToSymbol(array) {
    switch (array[1]) {
      case 2:
        return this.goal;
      case 3:
        return this.dataMappingSet[3];
    }
  }

  mapNumberToSymbol(number) {
    if (Array.isArray(number)) {
      return this.mapArrayToSymbol(number);
    }

    switch (number) {
      case 0:
        return this.dataMappingSet[0];
      case 1:
        return this.dataMappingSet[1];
      case 2:
        return this.dataMappingSet[2];
      case 3:
        return this.dataMappingSet[3];
      default:
        return ' ';
    }
  }

  mapRowToSymbol(row) {
    return row.map(i => this.mapNumberToSymbol(i));
  }

  renderMap(mapData) {
    let stageMap = '';

    mapData.forEach(row => {
      const line = this.mapRowToSymbol(row).join('');
      stageMap += `${line}\n`;
    });

    console.log(stageMap);
  }

  renderStageName(stage) {
    console.log(`${stage}\n`);
  }

  renderStage(map, stage) {
    this.renderStageName(stage);
    this.renderMap(map);
  }

  renderInitMessage(command) {
    console.log(`${command}: 게임을 초기화합니다.\n`);
  }

  renderErrMessage(command) {
    console.log(`${command}: (경고!) 해당 명령을 수행할 수 없습니다!`);
  }

  renderMessage(command) {
    if (command === 'q') {
      console.log(this.q);
    } else if (this.movementKey[command] === undefined) {
      this.renderErrMessage(command);
    } else {
      const Message = '(으)로 이동합니다.';
      console.log(`${command}: ${this.movementKey[command]}${Message}`);
      this.turn += 1;
    }
  }

  renderTurn(turn) {
    console.log(`턴수: ${turn}`);
  }

  renderStageClearMessage(stage) {
    console.log(`\n빠밤! ${stage} 클리어!\n`);
  }

  renderGameClearMessage() {
    console.log('\n전체 게임을 클리어하셨습니다!\n축하드립니다!\n');
  }

  renderGreetingMessage() {
    console.log('\n소코반의 세계에 오신 것을 환영합니다!\n^오^\n');
  }
}

class Player {
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
}

class Ball {
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
}

class GameController {
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

  setIsBlocked(checkObstacle) {
    const noObstacle = -1;

    if (checkObstacle === noObstacle) {
      return true;
    }

    return false;
  }

  changeBallLocation(map, command, location, player) {
    const locationBeforeMove = location;
    const locationAfterMove = Ball.move(command, locationBeforeMove);

    const obstacle = map[locationAfterMove[0] - 1][locationAfterMove[1] - 1];
    const isBlocked = this.setIsBlocked(this.checkObstacle(obstacle));

    if (isBlocked) {
      return;
    }

    this.moveToNoBlockedSpace(map, locationBeforeMove, locationAfterMove, this.gameMap.dataMappingSet.ball);
    this.changePlayerLocation(command, player, map);
  }

  changePlayerLocation(command, player, map) {
    const locationBeforeMove = [...player.location];
    const locationAfterMove = this.setNewLocation(player, command);

    const obstacle = map[locationAfterMove[0] - 1][locationAfterMove[1] - 1];
    this.isBlocked = this.setIsBlocked(this.checkObstacle(obstacle));

    if (this.isBlocked) {
      player.location = locationBeforeMove;

      if (obstacle !== this.gameMap.dataMappingSet.wall) {
        this.changeBallLocation(map, command, locationAfterMove, player);
      }
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
    this.turn = 0;
    this.currentStage += 1;
    const stage = `${this.STAGE}${this.currentStage}`;

    if (this.currentStage > Object.keys(this.gameMap.stages).length) {
      this.gameView.renderGameClearMessage();
      return;
    }

    player.location = this.gameMap.stagesInfo[stage].locationOfPlayer;
    this.gameView.renderStageClearMessage(stage);
    this.gameView.renderStage(this.gameMap.stages[stage], stage);
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
}

class App {
  constructor() {
    this.init();
  }

  init() {
    new GameController();
  }
}

new App();
