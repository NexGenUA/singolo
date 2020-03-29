class ActiveLink {

  constructor() {
    this.links  = document.querySelectorAll('#menu-list a');
    this.menu = document.querySelector('#menu-list');
    this.html = document.querySelector('html');
    this.topSection = document.querySelector('#top');
    this.anchors = [...document.querySelectorAll('section')].slice(1);
    this.blockList = {};
    this.anchors.forEach(block => {
      this.blockList[block.id] = {
        top: block.offsetTop,
        height: block.offsetHeight
      }
    });
    this.setActiveLink = this.setActiveLink.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.onLoad = this.onLoad.bind(this)
    window.addEventListener('scroll', this.setActiveLink);
    this.menu.addEventListener('click', this.scrollTo);
    window.addEventListener('DOMContentLoaded', this.onLoad);
    window.scrollBy(0, 0);
  }

  setActiveLink(e) {
    const shift = window.innerHeight / 6;
    const offset = window.pageYOffset;
    
    for (const block in this.blockList) {
      const top = this.blockList[block].top;
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

  scrollTo(e) {
    e.preventDefault();
    const link = e.target;
    if (link.tagName !== 'A') return; 
    const href = link.href.replace(/^.*\#/g, '');
    this.anchors.forEach(block => {
      this.blockList[block.id] = {
        top: block.offsetTop,
        height: block.offsetHeight
      }
    });
    const Y = this.blockList[href].top;
    window.scrollTo(0, Y);
  }

  onLoad(e) {
    for (const block in this.blockList) {
      const top = this.blockList[block].top;
      const bottom = this.blockList[block].height + top;
      const position = window.pageYOffset;
      if (position >= top && position < bottom) {
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
}

class Slider {

  constructor() {
    this.sliders = document.querySelectorAll('.img-slider-container');
    this.screens = document.querySelectorAll('.screen-on');
    this.prev = document.querySelector('#prev-button');
    this.next = document.querySelector('#next-button');
    this.changeSlider = this.changeSlider.bind(this);
    this.onScreen = this.onScreen.bind(this);
    this.prev.onclick = this.next.onclick = this.changeSlider;
    this.screens.forEach(el => el.onclick = this.onScreen);
    this.isMove = false;
  }

  changeSlider(e) {

    if (this.isMove) return;
    
    const sliders = [...this.sliders];
    const btn = e.target.closest('button');

    if (btn.tagName !== 'BUTTON') return;
    
    const direction = btn.classList.contains('next');

    this.move(sliders, direction);
    
  }

  move(sliders, prev) {
    
    this.isMove = true;

    const width = document.body.clientWidth;
    const shift = prev ? -1 : 1;
    const currentSlide = sliders.find(el => el.hasAttribute('current-slide'));
    const currentIdx = sliders.indexOf(currentSlide);
    const nextIdx = this.getIdx(currentIdx, shift, sliders.length - 1);
    const nextSlide = sliders[nextIdx];

    [currentSlide, nextSlide].map((slide, i) => {
      slide.style.display = 'flex';
      slide.style.transition = 'all .5s ease-in-out';
      
      if (!i) {
        slide.style.transform = `translateX(${prev ? '-' : ''}${width}px)`;
      } else {
        slide.style.transform = `translateX(${!prev ? '-' : ''}${width}px)`;
        setTimeout(() => {
          slide.style.transform = '';
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
    this.toggleTabs = this.toggleTabs.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.ul.addEventListener('click', this.toggleTabs);
    this.images.addEventListener('click', this.selectImage);
  }

  toggleTabs(e) {
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

  selectImage(e) {

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
    this.send = this.send.bind(this);
    this.form.addEventListener('submit', this.send)
  }

  send(e) {

    e.preventDefault();

    if (!this.form.checkValidity()) return;

    const subject = this.form.elements['subject'].value.trim();
    const area = this.form.elements['area'].value.trim();
    const title = subject ? 'Тема: ' + subject : 'Без темы';
    const describe = area ? 'Описание: ' + area : 'Без описания';

    Modal.show(title, describe);

    this.form.reset();
  }
}

class Modal {
  
  constructor() {
    this.hover = document.querySelector('.modal-hover');
    this.modal = document.querySelector('.modal-submit');
    this.close =  document.querySelector('.close-modal');
    this.hide = this.hide.bind(this);
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

    titleSpan.textContent = title;
    descSpan.textContent = desc;
    hover.style.display = 'flex';
    modal.classList.add('show-modal');
    html.style.overflow = 'hidden';
    html.style.paddingRight = `${padding}px`;
  }

  hide(e) {
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

class showHamburgerMenu {
  
  constructor() {
    this.hamburgerMenu = document.querySelector('#hamburger');
    this.logo = document.querySelector('#logo');
    this.menu = document.querySelector('#menu');
    this.ul = this.menu.querySelector('#menu-list');
    this.showMenu = this.showMenu.bind(this);
    this.hamburgerMenu.addEventListener('click', this.showMenu);
    this.menu.addEventListener('click', this.showMenu);
    this.stop = false;
  }

  showMenu(e) {
    const hamburger = e.target.closest('.hamburger-menu');
    
    const close = () => {
      this.hamburgerMenu.classList.remove('open-hamburger');
      this.hamburgerMenu.classList.add('close-hamburger');
      this.ul.style.transform = 'translateX(-278px)';
      this.menu.style.background = 'rgba(45,48,58,0)';
      this.logo.style.left = '3px';
      
      setTimeout(() => {
        this.hamburgerMenu.classList.remove('close-hamburger');
        this.ul.removeAttribute('style');
        this.menu.style.background = '';
        this.menu.style.display = 'none';
        this.menu.removeAttribute('style');
        this.stop = false;
      }, 500);
    };
    
    if (e.target.tagName === 'A' && window.innerWidth < 768) close();

    if (!hamburger) return;
    
    if (this.stop) return;
    
    this.stop = true;
    
    const show = () => {
      this.menu.style.display = 'flex';
      this.ul.style.transition = 'all .5s ease';

      setTimeout(() => {
        this.logo.style.left = 'calc(-50vw + 110px';
        this.menu.style.background = 'rgba(45,48,58,.6)';
        this.ul.style.transform = 'translateX(0)';
      }, 50);

      hamburger.classList.add('open-hamburger');

      setTimeout(() => {
        this.stop = false;
      }, 500);
    };


    if (hamburger.classList.contains('open-hamburger')) {
      close();
    } else {
      show();
    }
  }
}

new ActiveLink();
new Slider();
new Tabs();
new SendForm();
new Modal();
new showHamburgerMenu();
