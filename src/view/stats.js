import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart';
import dayjs from 'dayjs';
import { getWatchedFilmsChart } from '../utils/statistic';

const getTotalDuration = (films) => {
  let totalDuration = 0;
  films.forEach((film) => totalDuration += film.filmInfo.runtime);
  return totalDuration;
};

const renderGenresChart = (statisticCtx, data) => {
  const {films, dateTo, dateFrom, currentInput} = data;
  const WatchedFilmsChart = getWatchedFilmsChart(films, dateTo, dateFrom, currentInput);


  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * WatchedFilmsChart.uniqGenres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: WatchedFilmsChart.uniqGenres,
      datasets: [{
        data: WatchedFilmsChart.filmsByGenresCount,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = (data, userRank) => {
  const {films, dateTo, dateFrom, currentInput} = data;
  const TOP_GENRE_INDEX = 0;
  const WatchedFilmsChart = getWatchedFilmsChart(films, dateTo, dateFrom, currentInput);
  const totalDuration = getTotalDuration(WatchedFilmsChart.watchedFilms);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
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
        <p class="statistic__item-text">${WatchedFilmsChart.watchedFilms.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${Math.floor(totalDuration/60)}<span class="statistic__item-description">h</span>${totalDuration%60}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${WatchedFilmsChart.watchedFilms.length > 0 ? WatchedFilmsChart.uniqGenres[TOP_GENRE_INDEX] : ''}</p>
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
    this._userRank = document.querySelector('.profile__rating').textContent;
    this._genresChart = null;

    this._onDateRangeButtonClick = this._onDateRangeButtonClick.bind(this);
    this._setInnerHandlers();
    this._setGenresChart();
  }

  removeElement(){
    super.removeElement();

    if(this._genresChart !== null){
      this._genresChart = null;
    }
  }

  getTemplate(){
    return createStatsTemplate(this._data, this._userRank);
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

  _setGenresChart(){
    if(this._genresChart !== null){
      this._genresChart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    this._genresChart = renderGenresChart(statisticCtx, this._data);
  }

  _setInnerHandlers(){
    this.getElement()
      .querySelectorAll('.statistic__filters-input')
      .forEach((input) => input.addEventListener('click', this._onDateRangeButtonClick));
  }

  restoreHandlers(){
    this._setGenresChart();
    this._setInnerHandlers();
  }
}

export default Stats;
