import AbstractView from './abstract';

const createTopRatedFilmsTemplate = () => `<section class="films-list films-list--extra">
  <h2 class="films-list__title">Top rated</h2>
  <div class="films-list__container top-rated-films-list"> 
  </div> 
  </section>`;

class TopRatedFilms extends AbstractView{
  getTemplate(){
    return createTopRatedFilmsTemplate();
  }
}

export default TopRatedFilms;
