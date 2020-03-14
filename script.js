class ActiveLink {
  constructor() {
    this.menu  = document.querySelector('#menu-list');
    this.menu.addEventListener('click', this.setActiveLink)
  }

  setActiveLink(e) {
    const link = e.target;
    if (link.tagName !== 'A') return; 
    const liList = link.closest('ul').querySelectorAll('li');
    liList.forEach(el => el.classList.remove('active'))
    link.parentNode.classList.add('active')
  }
}

class Slider {
  constructor() {
    this.sliders = document.querySelectorAll('.img-slider-container');
    this.screens = document.querySelectorAll('.screen-on');
    this.prev = document.querySelector('#prev-button');
    this.next = document.querySelector('#next-button');
    this.prev.onclick = this.next.onclick = this.changeSlider;
    this.screens.forEach(el => el.onclick = this.onScreen);
    this.isMove = false;
  }

  changeSlider = e => {

    if (this.isMove) return;
    
    const sliders = Array.from(this.sliders);
    const btn = e.target.closest('button');

    if (btn.tagName !== 'BUTTON') return;
    
    const direction = btn.classList.contains('prev');

    this.move(sliders, direction);
    
  }

  move(sliders, prev) {
    
    this.isMove = true;

    const width = window.innerWidth;
    const shift = prev ? -1 : 1;
    const currentSlide = sliders.find(el => el.hasAttribute('current-slide'));
    const currentIdx = sliders.indexOf(currentSlide);
    const nextIdx = this.getIdx(currentIdx, shift, sliders.length - 1);
    const nextSlide = sliders[nextIdx];

    [currentSlide, nextSlide].map((slide, i) => {
      slide.style.display = 'flex';
      slide.style.transition = 'all .5s linear';
      
      if (!i) {
        slide.style.marginLeft = `${prev ? '-' : ''}${width}px`;        
      } else {
        slide.style.marginLeft = `${!prev ? '-' : ''}${width}px`;
        setTimeout(() => {
          slide.style.marginLeft = '';
        }, 50)
      }

      setTimeout(() => {
        slide.style.transition = '';
        if (!i) slide.style.display = 'none';
        this.isMove = false;
      }, 500)
    })
    currentSlide.removeAttribute('current-slide');
    nextSlide.setAttribute('current-slide', '');
  }

  onScreen({ target }) {
    console.log('hi')
    target.classList.toggle('screen-on');
  }

  getIdx(cur, shift, len) {
    const result = cur + shift;
    return result < 0 ? len : result > len ? 0 : result;
  }
}

class Tabs {
  constructor() {
    this.ul = document.querySelector('#tabs');
    this.ul.addEventListener('click', this.toggleTabs);
  }

  toggleTabs(e) {
    console.log(e.target)
  }
}

new ActiveLink();
new Slider();
new Tabs();
