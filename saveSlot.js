module.exports = class SaveSlot {
  constructor() {
    this.slot = {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
    };
  }

  setSlot(slotNumber, map) {
    this.slot[slotNumber] = map;
  }
};
