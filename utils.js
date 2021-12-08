const copyObjectDeeply = obj => {
  return JSON.parse(JSON.stringify(obj));
};

module.exports = copyObjectDeeply;