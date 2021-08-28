function getRandomInt (min, max){
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

const updateItem = (items, update) => items.map((it) => it.id === update.id ? update : it);

export {getRandomInt, updateItem};
