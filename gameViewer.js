module.exports = class GameViewer {
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
    console.log('\n전체 게임을 클리어하셨습니다!\n축하드립니다! 🎉\n');
  }

  renderGreetingMessage() {
    console.log('\n소코반의 세계에 오신 것을 환영합니다!\n^오^\n');
  }
};
