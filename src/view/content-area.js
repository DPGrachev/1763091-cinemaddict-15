import AbstractView from './abstract';

const createContentAreaTemplate = () => (
  `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container main-films-list">
    </div>
  </section>
  <section class="films-list films-list--extra ">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container top-rated-films-list">
      
    </div>
  </section>
  <section class="films-list films-list--extra ">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container most-commented-films-list">  
    </div>
  </section>
  </section>`
);

class ContentArea extends AbstractView {
  getTemplate() {
    return createContentAreaTemplate();
  }
}

export default ContentArea;
