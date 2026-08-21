function cristalInit() {
  const whatsappBtns = document.querySelectorAll('[data-whatsapp]');

  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const message = this.getAttribute('data-message') || 'Hola, escribo desde khodontologia.com';
      const whatsappUrl = 'https://wa.me/+573125759211?text=' + encodeURIComponent(message);
      window.open(whatsappUrl, '_blank');
    });
  });

  const path = window.location.pathname;
  let greeting = 'Hola, bienvenido a KH Odontología Estética';

  if (path.includes('/servicios')) {
    greeting = 'Hola, interesado en nuestros servicios dentales';
  } else if (path.includes('/contacto')) {
    greeting = 'Hola, contacto con KH Odontología';
  } else if (path.includes('/nosotros')) {
    greeting = 'Hola, conociendo nuestro equipo';
  }

  console.log('Cristal Bot activo -', greeting);
}

document.addEventListener('DOMContentLoaded', cristalInit);
