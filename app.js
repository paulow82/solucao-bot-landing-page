// Add the approved commercial URL and video URL here when available.
const SITE_CONFIG = { contactUrl: null, videoUrl: null };
const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab) {
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(tabs[next]); tabs[next].focus(); }
  });
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('.close-dialog, .close-action').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => {
  if (SITE_CONFIG.contactUrl) window.location.assign(SITE_CONFIG.contactUrl);
  else {
    document.getElementById('contact-title').textContent = button.dataset.plan ? 'Conheça a opção ' + button.dataset.plan : 'Uma solução para a sua operação.';
    document.getElementById('contact-dialog').showModal();
  }
}));
document.querySelector('[data-open-video]')?.addEventListener('click', () => {
  if (SITE_CONFIG.videoUrl) window.location.assign(SITE_CONFIG.videoUrl);
  else document.getElementById('video-dialog').showModal();
});
