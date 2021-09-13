const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

const toast = (message, showTime) => {
  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');

  toastContainer.append(toastItem);
  if(showTime){
    setTimeout(() => {
      toastItem.remove();
    }, showTime);
  }
};

export {toast};
