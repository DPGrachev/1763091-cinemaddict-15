const SortType = {
  DEFAULT: 'default',
  DATE_DOWN: 'date-down',
  RATING_DOWN: 'rating-down',
};

const KeyCode = {
  ESCAPE : 'Escape',
  ENTER: 'Enter',
};

const UserAction = {
  UPDATE_FILM_CARD: 'UPDATE_FILM_CARD',
  ADD_NEW_COMMENT: 'ADD_NEW_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const State = {
  SENDING_NEW_COMMENT: 'SENDING_NEW_COMMENT',
  DELETING: 'DELETING',
};

export {SortType, KeyCode, UserAction, UpdateType, FilterType, State};
