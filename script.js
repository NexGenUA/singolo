const menu = document.querySelector('#menu-list');

const setActiveLink = e => {
  
  const link = e.target;

  if (link.tagName !== 'A') return; 
  
  const liList = link.closest('ul').querySelectorAll('li');
  
  liList.forEach(el => el.classList.remove('active'))

  link.parentNode.classList.add('active')

}

menu.addEventListener('click', setActiveLink);