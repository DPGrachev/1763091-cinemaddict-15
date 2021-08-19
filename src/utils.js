const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const KeyCode = {
  ESCAPE : 'Escape',
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:{
      container.prepend(element);
      break;
    }
    case RenderPosition.BEFOREEND:{
      container.append(element);
      break;
    }
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export {createElement, render, RenderPosition, KeyCode};
