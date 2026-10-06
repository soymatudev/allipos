import { Store } from '../store.js';
import { Sound } from '../audio.js';

export function renderSummaryView(container) {
  function render() {
    const salesData = Store.getSales();
    const { totalSales, history } = salesData;

    container.innerHTML = `
      <div class="summary-card">
        <div class="summary-card-title">💰 TOTAL VENDIDO HOY</div>
        <div class="summary-card-amount">$${totalSales.toFixed(2)}</div>
        <div style="font-size: 1rem; font-weight: 800; opacity: 0.95;">
          ${history.length} ${history.length === 1 ? 'venta realizada' : 'ventas realizadas'}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h2 style="font-size: 1.3rem; font-weight: 900;">📜 Historial de Ventas</h2>
        <button class="btn-3d btn-red" id="btn-clear-sales" style="padding: 8px 12px; font-size: 0.9rem; width: auto;">
          🔄 Reiniciar Caja
        </button>
      </div>

      <div class="history-list">
        ${history.length === 0 ? `
          <div style="text-align: center; padding: 30px; background: #fff; border-radius: var(--radius-md); border: 2px dashed #ddd;">
            <p style="color: var(--color-text-muted); font-weight: 700;">Aún no hay ventas registradas el día de hoy.</p>
          </div>
        ` : history.map(item => {
          const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return `
            <div class="history-item">
              <div>
                <div class="history-desc">${item.quantity}x ${item.productName}</div>
                <div class="history-time">⏰ ${timeStr} • Pagó: $${item.amountPaid.toFixed(2)} (Cambio: $${item.changeReturned.toFixed(2)})</div>
              </div>
              <div class="history-total">+$${item.totalPayable.toFixed(2)}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const btnClear = container.querySelector('#btn-clear-sales');
    btnClear?.addEventListener('click', () => {
      Sound.playError();
      if (confirm('¿Estás seguro de reiniciar la caja del día? Se borrará el historial de ventas actuales.')) {
        Sound.playClick();
        Store.clearSales();
        render();
      }
    });
  }

  render();
}
