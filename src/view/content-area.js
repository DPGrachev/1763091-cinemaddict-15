import AbstractView from './abstract';

const createContentAreaTemplate = () => (
  `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container main-films-list">
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
