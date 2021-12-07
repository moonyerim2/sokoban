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
  }

  mapNumberToSymbol(number) {
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
    }
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

class GameController {
  constructor() {
    this.gameMap = new MapMaker();
    this.gameView = new GameViewer();
    this.currentStage = 'Stage1';
    this.command = {
      end: 'q',
      reset: 'r',
    };
    this.block = false;
    this.init();
  }

  deleteLocationValue(locationValue) {
    if (Array.isArray(locationValue)) {
      locationValue.pop();
    } else {
      return ' ';
    }
  }

  addLocationValue(newLocationValue) {
    if (newLocationValue !== ' ') {
      return newLocationValue;
    }

    return this.gameMap.dataMappingSet.player;
  }

  setNewLocation(player, command, map) {
    const location = [...player.location];
    player.move(command);

    if (map[player.location[0] - 1][player.location[1] - 1] !== ' ') {
      player.location = location;
    }
  }

  isBlocked(location, newLocation) {
    return location.join('') === newLocation.join('');
  }

  changeLocation(command, player, map) {
    const location = [...player.location];
    this.setNewLocation(player, command, map);
    const newLocation = [...player.location];

    this.block = this.isBlocked(location, newLocation);

    if (!this.block) {
      map[location[0] - 1][location[1] - 1] = this.deleteLocationValue(map[location[0] - 1][location[1] - 1]);
      map[newLocation[0] - 1][newLocation[1] - 1] = this.addLocationValue(map[newLocation[0] - 1][newLocation[1] - 1]);
    }
  }

  executeCommand(player, commandArr, stage) {
    const map = this.gameMap.stages[stage];

    commandArr.forEach(command => {
      this.changeLocation(command, player, map);
      this.gameView.renderMap(map);

      if (this.block) {
        this.gameView.renderErrMessage(command);
      } else {
        this.gameView.renderMessage(command);
      }
    });
  }

  resetStage(player) {
    this.currentStage = 'Stage1';
    player.location = this.gameMap.stagesInfo[this.currentStage].locationOfPlayer;

    this.gameView.renderInitMessage(this.command.reset);
    this.gameView.renderStage(this.gameMap.stages[this.currentStage], this.currentStage);
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
        this.executeCommand(player, line.split(''), this.currentStage);
        rl.prompt();
      }
    });
  }

  init() {
    this.gameMap.setMapData();
    this.gameView.renderStageName(this.currentStage);
    this.gameView.renderMap(this.gameMap.stages[this.currentStage]);

    this.player = new Player(this.gameMap.stagesInfo[this.currentStage].locationOfPlayer);
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
