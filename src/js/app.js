import { Store } from './store.js';
import { Sound } from './audio.js';
import { renderPosView } from './ui/posView.js';
import { renderAdminView } from './ui/adminView.js';
import { renderSummaryView } from './ui/summaryView.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize storage
  Store.init();

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('Service Worker registrado con éxito:', reg.scope);
      }).catch((err) => {
        console.warn('Error al registrar Service Worker:', err);
      });
    });
  }

  const viewContainer = document.getElementById('view-container');
  const navButtons = document.querySelectorAll('.nav-btn');

  function switchTab(viewName) {
    navButtons.forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    viewContainer.innerHTML = '';
    if (viewName === 'pos') {
      renderPosView(viewContainer);
    } else if (viewName === 'admin') {
      renderAdminView(viewContainer);
    } else if (viewName === 'summary') {
      renderSummaryView(viewContainer);
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      Sound.playClick();
      switchTab(btn.dataset.view);
    });
  });

  // Default initial view: POS
  switchTab('pos');
});
