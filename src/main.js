import { render, RenderPosition } from './utils/render.js';
import MovieCountView from './view/movie-count.js';
import { UpdateType } from './utils/const.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import FilmsModel from './model/movies.js';
import FilterModel from './model/filter.js';
import ContentBoardPresenter from './presenter/content-board.js';
import Api from './api/api.js';
import { toast } from './utils/toast.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = 'Basic hbdvNfrH678fh652hyg1b30g';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticElement = document.querySelector('.footer__statistics');

const apiWithoutProvider = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const api = new Provider(apiWithoutProvider, store);

const filmsModel = new FilmsModel();

const filterModel = new FilterModel();


const contentBoard = new ContentBoardPresenter(siteMainElement, filmsModel, filterModel, api);
const siteMenu = new SiteMenuPresenter(siteMainElement,headerElement, filterModel, filmsModel,contentBoard);

siteMenu.init();
contentBoard.init();

api.getMovies()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(footerStatisticElement,new MovieCountView(filmsModel.getFilms()), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    render(footerStatisticElement,new MovieCountView(), RenderPosition.BEFOREEND);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.querySelector('.toast-item').remove();
  document.title = document.title.replace(' [offline]', '');
  if (api.getMovieIsChange()){
    api.sync();
  }
});

window.addEventListener('offline', () => {
  toast('Связь с интернетом потеряна');
  document.title += ' [offline]';
});
