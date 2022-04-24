/** @format */

const panels = document.querySelectorAll('.panel');

panels.forEach((panel) => {
  panel.addEventListener('mouseover', () => {
    removeActive();
    panel.classList.add('active');
  });
});

function removeActive() {
  panels.forEach((panel) => {
    panel.classList.remove('active');
    console.log('event');
  });
}
