import { filterTypeToCb } from '../utils/filter';
import { FilterType } from '../utils/const';
import SmartView from './smart';
import dayjs from 'dayjs';
import { watchedFilmsInDateRange } from '../utils/statistic';

const getTotalDuration = (films) => {
  let totalDuration = 0;
  films.forEach((film) => totalDuration += film.filmInfo.runtime);
  return totalDuration;
};

const createStatsTemplate = (data) => {
  const {films, dateTo, dateFrom, currentInput} = data;
  const watchedFilms = watchedFilmsInDateRange(films, dateTo, dateFrom, currentInput);
  const watchedFilmsCount = watchedFilms.length;
  const totalDuration = getTotalDuration(watchedFilms);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentInput === 'all-time'? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentInput === 'today'? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentInput === 'week'? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentInput === 'month'? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentInput === 'year'? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${Math.floor(totalDuration/60)}<span class="statistic__item-description">h</span>${totalDuration%60}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">Sci-Fi</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

    </section>`;
};

class Stats extends SmartView{
  constructor(films){
    super();

    this._data = {
      films,
      dateFrom: (() => {
        const typeOfTime = 'year';
        return dayjs().subtract( 1 , typeOfTime).toDate();
      })(),
      dateTo: dayjs().toDate(),
      currentInput: 'all-time',
    };

    this._onDateRangeButtonClick = this._onDateRangeButtonClick.bind(this);

    this._setInnerHandlers();
  }

  getTemplate(){
    return createStatsTemplate(this._data);
  }

  _onDateRangeButtonClick(evt){
    if(evt.target.value === this._data.currentInput){
      return;
    }

    this.updateData(
      {
        dateFrom: (() => {
          const typeOfTime = evt.target.value;
          return dayjs().subtract( 1 , typeOfTime).toDate();
        })(),
        currentInput: evt.target.value,
      },
    );
  }

  _setInnerHandlers(){
    this.getElement()
      .querySelectorAll('.statistic__filters-input')
      .forEach((input) => input.addEventListener('click', this._onDateRangeButtonClick));
  }

  restoreHandlers(){
    this._setInnerHandlers();
  }
}

export default Stats;
