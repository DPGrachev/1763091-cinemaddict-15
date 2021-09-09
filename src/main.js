import { render, RenderPosition } from './utils/render.js';
import MovieCountView from './view/movie-count.js';
import { UpdateType } from './utils/const.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import FilmsModel from './model/movies.js';
import FilterModel from './model/filter.js';
import ContentBoardPresenter from './presenter/content-board.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic hSJHBh5hjtjhyg1b30g';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticElement = document.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

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
