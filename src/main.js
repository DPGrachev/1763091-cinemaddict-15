import { render, RenderPosition } from './utils/render.js';
import MovieCountView from './view/movie-count.js';
import {generateFilmCard} from './mock/film-card-mock.js';
import SiteMenuPresenter from './presenter/filter.js';
import FilmsModel from './model/movies.js';
import FilterModel from './model/filter.js';
import ContentBoardPresenter from './presenter/content-board.js';

const FILMS_COUNT = 20;

const filmCards = new Array(FILMS_COUNT).fill().map(generateFilmCard);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const siteMenu = new SiteMenuPresenter(siteMainElement,headerElement, filterModel, filmsModel);
siteMenu.init();

const contentBoard = new ContentBoardPresenter(siteMainElement, filmsModel, filterModel);
contentBoard.init();
render(footerElement,new MovieCountView(filmCards), RenderPosition.BEFOREEND);
