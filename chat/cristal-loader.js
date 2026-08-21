document.addEventListener('DOMContentLoaded', function() {
  const container = document.createElement('div');
  container.id = 'cristal-container';
  container.innerHTML = `
    <h3>🦋 Cristal Bot</h3>
    <p>Asistente dental automatizado</p>
    <p>Soy Cristal, tu asistente de KH Odontología Estética. Puedo ayudarte con:</p>
    <options value="general">Odontología General</options>
    <options value="cosmetica">Cosmética Dental</options>
    <options value="rehabilitacion">Rehabilitación Oral</options>
    <options value="ortodoncia">Ortodoncia</options>
    <options value="periodoncia">Periodoncia</options>
    <options value="endodoncia">Endodoncia</options>
    <options value="cirugia">Cirugía Oral</options>
    <p>¿En qué puedo ayudarte?</p>
    <button id="cristal-btn" class="btn">Iniciar Charla</button>
  `;
  document.body.insertBefore(container, document.body.firstChild);

  const btn = document.getElementById('cristal-btn');
  if (btn) {
    btn.addEventListener('click', function() {
      const select = document.querySelector('options:checked');
      const service = select ? select.value : 'general';
      const messages = {
        general: 'Hola, interés en odontología general',
        cosmetica: 'Hola, interés en cosmética dental',
        rehabilitacion: 'Hola, interés en rehabilitación oral',
        ortodoncia: 'Hola, interés en ortodoncia',
        periodoncia: 'Hola, interés en periodontia',
        endodoncia: 'Hola, interés en endodoncia',
        cirugia: 'Hola, interés en cirugía oral'
      };
      const msg = messages[service] || 'Hola, interés dental';
      const url = 'https://wa.me/+573125759211?text=' + encodeURIComponent(msg);
      window.open(url, '_blank');
    });
  }
});
