import AbstractView from './abstract';

const createShowMoreButton = () => (
  '<button class="films-list__show-more">Show more</button>'
);

class ShowMoreButton extends AbstractView {
  constructor(){
    super();
    this._onClick = this._onClick.bind(this);
  }

  getTemplate() {
    return createShowMoreButton();
  }

  _onClick(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._onClick);
  }
}


export default ShowMoreButton;
