const generateFilter = (cards) => ({
  watchlist: cards.filter((card) => card.userDetails.isWatchlist).length,
  alreadyWatched: cards.filter((card) => card.userDetails.isAlreadyWatched).length,
  favorite : cards.filter((card) => card.userDetails.isFavorite).length,
});

export {generateFilter};
