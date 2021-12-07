class MapMaker {
  constructor() {
    this.mapText = `Stage 1
#####
#OoP#
#####
=====
Stage 2
  #######
###  O  ###
#    o    #
# Oo P oO #
###  o  ###
 #   O  # 
 ########`;
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

  renderInfo(infoData) {
    console.log(
      `가로크기: ${infoData.width}
세로크기: ${infoData.heigth}
구멍의 수: ${infoData.countHall}
공의 수: ${infoData.countBall}
플레이어 위치 (${infoData.locationOfPlayer})\n`
    );
  }

  renderStageName(stage) {
    console.log(`${stage}\n`);
  }

  renderStage(stage, map, info) {
    console.log(`${stage}\n`);
    this.renderMap(map);
    this.renderInfo(info);
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
    this.endCommand = 'q';
    this.init();
  }

  creatReadlineInterface() {
    const readline = require('readline');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return rl;
  }

  play() {
    const rl = this.creatReadlineInterface();
    rl.setPrompt('SOKOBAN> ');
    rl.prompt();

    rl.on('line', line => {
      if (line === this.endCommand) {
        this.gameView.renderMessage(this.endCommand);
        rl.close();
      } else {
        rl.prompt();
      }
    });
  }

  init() {
    const currentStage = 'Stage2';

    this.gameMap.setMapData();
    this.gameView.renderStageName(currentStage);
    this.gameView.renderMap(this.gameMap.stages[currentStage]);

    this.play();
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
