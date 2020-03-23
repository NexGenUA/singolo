class ActiveLink {

  constructor() {
    this.links  = document.querySelectorAll('#menu-list a');
    this.menu = document.querySelector('#menu-list');
    this.anchors = [...document.querySelectorAll('section')].slice(1);
    this.blockList = {};
    this.anchors.forEach(block => {
      this.blockList[block.id] = {
        top: block.offsetTop,
        height: block.offsetHeight
      }
    });
    window.addEventListener('scroll', this.setActiveLink);
    this.menu.addEventListener('click', this.scrollTo);
    window.scrollBy(0, 1);
  }

  setActiveLink = e => {
    const shift = window.innerHeight / 4;
    for (const block in this.blockList) {
      const top = this.blockList[block].top;
      const offset = window.pageYOffset
      if (offset >= top - shift && offset <= top + shift) {
        this.links.forEach(link => {
          if (!!~link.href.indexOf(block)) {
            link.parentNode.classList.add('active');
          } else {
            link.parentNode.removeAttribute('class');
          }
        })
      }
    }
  }

  scrollTo = e => {
    e.preventDefault();
    const link = e.target;
    if (link.tagName !== 'A') return; 
    const href = link.href.replace(/^.*\#/g, '');
    const Y = this.blockList[href].top;
    window.scrollTo(0, Y);
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
    
    const sliders = [...this.sliders];
    const btn = e.target.closest('button');

    if (btn.tagName !== 'BUTTON') return;
    
    const direction = btn.classList.contains('next');

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
      slide.style.transition = 'all .5s ease-in-out';
      
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
    target.closest('.switch').classList.toggle('screen-on');
  }

  getIdx(cur, shift, len) {
    const result = cur + shift;
    return result < 0 ? len : result > len ? 0 : result;
  }
}

class Tabs {

  constructor() {
    this.ul = document.querySelector('#tabs');
    this.images = document.querySelector('.gallery');
    this.allImages = [...document.querySelectorAll('.gallery .img')];
    this.ul.addEventListener('click', this.toggleTabs);
    this.images.addEventListener('click', this.selectImage);
  }

  toggleTabs = (e) => {
    const button = e.target;

    if (!button || button.tagName !== 'BUTTON') return;
    
    if (button.classList.contains('active-tab')) return;
    const ul = button.closest('ul');
    const buttonList = ul.querySelectorAll('button');

    buttonList.forEach(el => el.classList.remove('active-tab'));

    button.classList.add('active-tab');
    
    if (button.hasAttribute('all-images')) {
      this.changeImagesPositions(this.allImages);
      return;
    }

    this.changeImagesPositions();
  }

  changeImagesPositions(allImages) {
    
    let images = [...document.querySelectorAll('.gallery .img')];
    const gallery = document.querySelector('.gallery');
    const coords = images.map(el => [el.offsetTop, el.offsetLeft]);
    
    images = allImages ? allImages : images;
    
    if (!allImages) {
      const keys = Object.keys(images);
      while (keys.length) {
        const idx = Math.floor(Math.random()*keys.length);
        const x = +keys[idx];
        keys.splice(idx, 1);
        const idx2 = Math.floor(Math.random()*keys.length);
        const y = +keys[idx2];
        keys.splice(idx2, 1);
        [images[x], images[y]] = [images[y], images[x]];
      }      
    }
    
    images.map((img, i) => {
      img.style.opacity = 0.5;
      img.style.top = `${coords[i][0] - img.offsetTop}px`;
      img.style.left = `${coords[i][1] - img.offsetLeft}px`;
    })

    setTimeout(() => {
      gallery.append(...images);
      images.map(img => {
        img.removeAttribute('style');
      })
    }, 500)
  }

  selectImage = e => {

    const selectetdImg = e.target;
    const allImages = this.allImages;
    
    if (!selectetdImg || !selectetdImg.classList.contains('img')) return;

    allImages.forEach(img => img.classList.remove('select-img'));
    selectetdImg.classList.add('select-img');
  }
}

class SendForm {

  constructor() {
    this.form = document.forms['form'];
    this.form.addEventListener('submit', this.send)
  }

  send = e => {

    e.preventDefault();

    if (!this.form.checkValidity()) return;

    const subject = this.form.elements['subject'].value.trim();
    const area = this.form.elements['area'].value.trim();
    const title = subject ? '<b>Тема:</b> ' + subject : 'Без темы';
    const describe = area ? '<b>Описание:</b> ' + area : 'Без описания';

    Modal.show(title, describe);

    this.form.reset();
  }
}

class Modal {
  
  constructor() {
    this.hover = document.querySelector('.modal-hover');
    this.modal = document.querySelector('.modal-submit');
    this.close =  document.querySelector('.close-modal');
    this.close.addEventListener('click', this.hide);
    this.html = document.querySelector('html');
  }

  static show(title, desc) {
    const titleSpan = document.querySelector('.title');
    const descSpan = document.querySelector('.describe');
    const hover = document.querySelector('.modal-hover');
    const modal = document.querySelector('.modal-submit');
    const html = document.querySelector('html');
    const padding = window.innerWidth - document.body.clientWidth;

    titleSpan.innerHTML = title;
    descSpan.innerHTML = desc;
    hover.style.display = 'flex';
    modal.classList.add('show-modal');
    html.style.overflow = 'hidden';
    html.style.paddingRight = `${padding}px`;
  }

  hide = e => {
    this.modal.classList.remove('show-modal');
    this.modal.classList.add('hide-modal');
    setTimeout(() => {
      this.hover.style.display = 'none';
      this.modal.classList.remove('hide-modal');
      this.html.style.overflow = '';
      this.html.style.paddingRight = '';
    }, 500)
  }  
}

new ActiveLink();
new Slider();
new Tabs();
new SendForm();
new Modal();
