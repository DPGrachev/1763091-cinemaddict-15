import { FilterType } from './const';

const filter = {
  [FilterType.ALL]: (filmCards) => filmCards,
  [FilterType.WATCHLIST]: (filmCards) => filmCards.filter((filmCard) => filmCard.userDetails.isWatchlist),
  [FilterType.HISTORY]: (filmCards) => filmCards.filter((filmCard) => filmCard.userDetails.isAlreadyWatched),
  [FilterType.FAVORITES]: (filmCards) => filmCards.filter((filmCard) => filmCard.userDetails.isFavorite),
};

export {filter};
