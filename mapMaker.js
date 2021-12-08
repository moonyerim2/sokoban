module.exports = class MapMaker {
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
};

