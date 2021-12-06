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
}
