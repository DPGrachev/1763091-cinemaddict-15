import AbstractView from './abstract';
import { FilterType } from '../utils/const';

const textTypeToEmptyFilmsList = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createEmptyFilmsList = (filterType) => {
  const emptyFilmsListTextValue = textTypeToEmptyFilmsList[filterType];
  return ` <section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${emptyFilmsListTextValue}</h2>
    </section>
  </section>
  </main>`;
};

class EmptyFilmsList extends AbstractView {
  constructor(data){
    super(),
    this._data = data;
  }

  getTemplate() {
    return createEmptyFilmsList(this._data);
  }
}

export default EmptyFilmsList;
