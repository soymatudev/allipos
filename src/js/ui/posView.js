import { Store } from '../store.js';
import { Sound } from '../audio.js';
import img1 from '../../assets/diner/diner1.png';
import img2 from '../../assets/diner/diner2.png';
import img5 from '../../assets/diner/diner5.jpg';
import img10 from '../../assets/diner/diner10.jpg';
import img20 from '../../assets/diner/diner20.jpg';
import img50 from '../../assets/diner/diner50.jpg';
import img100 from '../../assets/diner/diner100.jpg';

const DENOMINATIONS = [
  { value: 100, type: 'billete', label: 'Billete $100', img: img100 },
  { value: 50, type: 'billete', label: 'Billete $50', img: img50 },
  { value: 20, type: 'billete', label: 'Billete $20', img: img20 },
  { value: 10, type: 'moneda', label: 'Moneda $10', img: img10 },
  { value: 5, type: 'moneda', label: 'Moneda $5', img: img5 },
  { value: 2, type: 'moneda', label: 'Moneda $2', img: img2 },
  { value: 1, type: 'moneda', label: 'Moneda $1', img: img1 }
];

// Generador de múltiples combinaciones realistas de cambio
function calculateAllChangeCombinations(changeAmount, maxOptions = 6) {
  if (changeAmount <= 0) return [];

  const wholeAmount = Math.floor(Math.round(changeAmount * 100) / 100);
  if (wholeAmount <= 0) return [];

  const denoms = DENOMINATIONS.map(d => d.value);
  const rawResults = [];

  function search(idx, currentSum, counts) {
    if (rawResults.length >= 80) return;
    if (currentSum === wholeAmount) {
      rawResults.push([...counts]);
      return;
    }
    if (idx >= denoms.length) return;

    const val = denoms[idx];
    const max = Math.floor((wholeAmount - currentSum) / val);
    for (let c = max; c >= 0; c--) {
      // Límites prácticos para evitar combinaciones absurdas (ej. 50 monedas de $1)
      if ((val === 1 || val === 2) && c > 10 && wholeAmount > 20) continue;
      if (val === 1 && c > 5 && wholeAmount > 10) continue;
      counts[idx] = c;
      search(idx + 1, currentSum + c * val, counts);
      counts[idx] = 0;
      if (rawResults.length >= 80) break;
    }
  }

  search(0, 0, new Array(denoms.length).fill(0));

  if (rawResults.length === 0) return [];

  const allCombos = rawResults.map(counts => {
    const breakdown = [];
    let totalPieces = 0;
    for (let i = 0; i < denoms.length; i++) {
      if (counts[i] > 0) {
        breakdown.push({ ...DENOMINATIONS[i], count: counts[i] });
        totalPieces += counts[i];
      }
    }
    return { breakdown, totalPieces };
  });

  // La opción óptima / estándar va primero, el resto ordenadas por menor cantidad de piezas
  const greedy = allCombos[0];
  const others = allCombos.slice(1).sort((a, b) => a.totalPieces - b.totalPieces);
  const finalCombos = [greedy, ...others];

  return finalCombos.slice(0, maxOptions).map(c => c.breakdown);
}

export function renderPosView(container) {
  let currentStep = 1; // 1: Select Product, 2: Select Quantity, 3: Select Payment, 4: Success/Change
  let selectedProduct = null;
  let quantity = 1;
  let selectedBill = null;
  let currentComboIndex = 0;

  function render() {
    const products = Store.getProducts();

    if (products.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 4rem; margin-bottom: 10px;">📦</div>
          <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 10px;">No hay productos cargados</h2>
          <p style="color: var(--color-text-muted); font-weight: 700; margin-bottom: 20px;">
            Pídele al maestro o ve a la pestaña <b>PRODUCTOS</b> para agregar el primer producto.
          </p>
        </div>
      `;
      return;
    }

    // Step Progress percentage
    const stepProgressMap = { 1: 25, 2: 50, 3: 75, 4: 100 };
    const progressPercent = stepProgressMap[currentStep];

    let contentHtml = `
      <div class="step-bar-container">
        <div class="step-bar">
          <div class="step-progress" style="width: ${progressPercent}%;"></div>
        </div>
        <span class="step-indicator-text">Paso ${currentStep} de 4</span>
      </div>
    `;

    // PASO 1: Seleccionar Producto
    if (currentStep === 1) {
      contentHtml += `
        <div class="step-title">
          <span>1️⃣</span> Toca el producto que vas a vender:
        </div>
        <div class="product-grid">
          ${products.map(p => `
            <div class="product-card ${selectedProduct?.id === p.id ? 'selected' : ''}" data-id="${p.id}">
              <div class="product-img-wrapper">
                <img src="${p.image}" alt="${p.name}" class="product-img" />
              </div>
              <div class="product-name">${p.name}</div>
              <div class="product-price">$${p.price.toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // PASO 2: Ajustar Cantidad
    else if (currentStep === 2) {
      const total = (selectedProduct.price * quantity).toFixed(2);
      contentHtml += `
        <div class="step-title">
          <span>2️⃣</span> ¿Cuántos <b>${selectedProduct.name}</b> llevan?
        </div>

        <div style="text-align: center; margin-bottom: 10px;">
          <div class="product-img-wrapper" style="width: 110px; height: 110px; margin: 0 auto 10px;">
            <img src="${selectedProduct.image}" alt="${selectedProduct.name}" class="product-img" />
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 900;">${selectedProduct.name}</h3>
          <p style="color: var(--color-text-muted); font-weight: 800;">$${selectedProduct.price.toFixed(2)} c/u</p>
        </div>

        <div class="quantity-container">
          <button class="btn-3d btn-red btn-qty" id="btn-minus" ${quantity <= 1 ? 'disabled' : ''}>-</button>
          <div class="qty-display">${quantity}</div>
          <button class="btn-3d btn-green btn-qty" id="btn-plus">+</button>
        </div>

        <div class="total-banner">
          <div class="total-label">TOTAL A COBRAR</div>
          <div class="total-amount">$${total}</div>
        </div>

        <div class="bottom-nav" style="display: flex; gap: 12px;">
          <button class="btn-3d btn-yellow" id="btn-back" style="flex: 1;">⬅️ Volver</button>
          <button class="btn-3d btn-green" id="btn-next-step3" style="flex: 2;">Cobrar $${total} ➡️</button>
        </div>
      `;
    }

    // PASO 3: Seleccionar Dinero Recibido ($1, $2, $5, $10, $20, $50, $100 / Teclado Numérico Directo)
    else if (currentStep === 3) {
      const totalPayable = selectedProduct.price * quantity;
      const isBillEntered = selectedBill !== null && selectedBill !== undefined && selectedBill > 0;
      const isEnough = selectedBill !== null && selectedBill >= totalPayable;
      const amountNeeded = (totalPayable - (selectedBill || 0)).toFixed(2);

      contentHtml += `
        <div class="step-title">
          <span>3️⃣</span> ¿Con cuánto dinero te pagan?
        </div>

        <div class="total-banner" style="margin-top: 0; padding: 10px 14px;">
          <div class="total-label">Total por ${quantity}x ${selectedProduct.name}:</div>
          <div class="total-amount" style="font-size: 2rem;">$${totalPayable.toFixed(2)}</div>
        </div>

        <!-- Input directo para Teclado Numérico del celular -->
        <div style="margin: 10px 0; background: #f0f4f8; padding: 10px; border-radius: var(--radius-md); border: 2px solid var(--color-gray-light);">
          <label for="input-paid-amount" style="font-weight: 800; font-size: 0.9rem; color: var(--color-text); display: block; margin-bottom: 4px;">
            💵 Dinero recibido ($):
          </label>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-size: 1.8rem; font-weight: 900; color: var(--color-green-shadow);">$</span>
            <input type="number" id="input-paid-amount" class="form-input" 
                   inputmode="decimal" pattern="[0-9]*" step="0.5" min="0" 
                   placeholder="0.00" value="${selectedBill !== null && selectedBill > 0 ? selectedBill : ''}" 
                   style="font-size: 1.8rem; font-weight: 900; text-align: center; color: var(--color-green-shadow); padding: 6px; background: #fff;" />
            <button class="btn-3d btn-red" id="btn-clear-paid" style="padding: 8px 12px; font-size: 0.9rem; width: auto; font-weight: 900;" title="Borrar">
              🧹 Borrar
            </button>
          </div>
        </div>

        <div style="font-size: 0.85rem; font-weight: 800; color: var(--color-text-muted); margin-bottom: 6px; text-align: center;">
          👇 Toca las monedas o billetes para sumar:
        </div>

        <div class="bills-grid" style="margin-bottom: 8px; gap: 6px;">
          <button class="bill-btn bill-1" data-add="1" style="padding: 6px 8px;">
            <span style="font-size: 0.9em; opacity: 0.85; font-weight: 800;">+</span>
            <img src="${img1}" class="bill-img" alt="$1" />
            <span>$1</span>
          </button>
          <button class="bill-btn bill-2" data-add="2" style="padding: 6px 8px;">
            <span style="font-size: 0.9em; opacity: 0.85; font-weight: 800;">+</span>
            <img src="${img2}" class="bill-img" alt="$2" />
            <span>$2</span>
          </button>
          <button class="bill-btn bill-5" data-add="5" style="padding: 6px 8px;">
            <span style="font-size: 0.9em; opacity: 0.85; font-weight: 800;">+</span>
            <img src="${img5}" class="bill-img" alt="$5" />
            <span>$5</span>
          </button>
          <button class="bill-btn bill-10" data-add="10" style="padding: 6px 8px;">
            <span style="font-size: 0.9em; opacity: 0.85; font-weight: 800;">+</span>
            <img src="${img10}" class="bill-img" alt="$10" />
            <span>$10</span>
          </button>
          <button class="bill-btn bill-20" data-add="20" style="padding: 6px 8px;">
            <span style="font-size: 0.9em; opacity: 0.85; font-weight: 800;">+</span>
            <img src="${img20}" class="bill-img" alt="$20" />
            <span>$20</span>
          </button>
          <button class="bill-btn bill-50" data-add="50" style="padding: 6px 8px;">
            <span style="font-size: 0.9em; opacity: 0.85; font-weight: 800;">+</span>
            <img src="${img50}" class="bill-img" alt="$50" />
            <span>$50</span>
          </button>
          <button class="bill-btn bill-100" data-add="100" style="grid-column: span 2; padding: 6px 8px;">
            <span style="font-size: 0.9em; opacity: 0.85; font-weight: 800;">+</span>
            <img src="${img100}" class="bill-img" alt="$100" />
            <span>$100</span>
          </button>
          <button class="bill-btn bill-exact" id="btn-set-exact" style="grid-column: span 2; padding: 10px;">
            ✨ ¡PAGO EXACTO! ($${totalPayable.toFixed(2)})
          </button>
        </div>

        <div class="bottom-nav" style="display: flex; gap: 12px; margin-bottom: .5rem;">
          <button class="btn-3d btn-yellow" id="btn-back" style="flex: 1;">⬅️ Volver</button>
          <button class="btn-3d btn-green" id="btn-calculate-change" ${!isEnough ? 'disabled' : ''} style="flex: 2;">
            Calcular Cambio ➡️
          </button>
        </div>

        ${isBillEntered && !isEnough ? `
          <div class="alert-box">
            <span style="font-size: 1.8rem;">⚠️</span>
            <div style="font-size: 0.95rem; font-weight: 700;">
              Recibido ($${selectedBill.toFixed(2)}) < Total ($${totalPayable.toFixed(2)}). Faltan $${amountNeeded}.
            </div>
          </div>
        ` : isEnough ? `
          <div style="background-color: #e8f5e9; border: 2px solid var(--color-green); border-radius: var(--radius-md); padding: 4px; color: var(--color-green-shadow); font-weight: 800; text-align: center; margin-bottom: 16px;">
            ✅ Dinero suficiente • Cambio a entregar: $${(selectedBill - totalPayable).toFixed(2)}
          </div>
        ` : ''}
      `;
    }

    // PASO 4: Resultado, Desglose Visual, Múltiples Formas de Cambio y Voz
    else if (currentStep === 4) {
      const totalPayable = selectedProduct.price * quantity;
      const change = Math.round((selectedBill - totalPayable) * 100) / 100;
      const combinations = calculateAllChangeCombinations(change);
      const breakdown = combinations[currentComboIndex] || combinations[0] || [];

      contentHtml += `
        <div class="step-title" style="justify-content: space-between; color: var(--color-green-shadow); margin-bottom: 12px; align-items: center;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span>🎉</span> ¡VENTA COMPLETA!
          </div>
          <button class="btn-3d btn-blue" id="btn-speak-change" style="padding: 6px 12px; font-size: 0.85rem; width: auto;" title="Escuchar cambio por voz">
            🔊 Escuchar
          </button>
        </div>

        <div class="result-card" style="padding: 14px; margin-bottom: 14px;">
          <div class="result-title">CAMBIO A ENTREGAR AL CLIENTE</div>
          <div class="change-amount" style="font-size: 3rem; margin-bottom: 6px;">$${change.toFixed(2)}</div>

          ${change <= 0 ? `
            <div style="font-size: 1.05rem; font-weight: 800; color: var(--color-green-shadow); margin: 10px 0;">
              ✨ ¡Pago exacto! No hay cambio que entregar.
            </div>
          ` : `
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0 6px;">
              <span style="font-weight: 800; font-size: 0.9rem; color: var(--color-text-muted);">
                👉 Entrega al cliente ${combinations.length > 1 ? `(Opción ${currentComboIndex + 1} de ${combinations.length})` : ''}:
              </span>
            </div>

            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 10px;">
              ${breakdown.map(item => `
                <div style="background: #f0f4f8; border: 2px solid var(--color-gray-light); border-radius: 12px; padding: 6px 10px; text-align: center; min-width: 75px;">
                  <img src="${item.img}" style="height: 38px; object-fit: contain; border-radius: 4px; display: block; margin: 0 auto 4px;" alt="${item.label}" />
                  <div style="font-weight: 900; font-size: 1.15rem; color: var(--color-green-shadow);">${item.count}x</div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: var(--color-text);">${item.label}</div>
                </div>
              `).join('')}
            </div>

            ${combinations.length > 1 ? `
              <button class="btn-3d btn-blue" id="btn-cycle-change" style="width: 100%; padding: 10px 12px; font-size: 0.95rem; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span>🔄</span>
                <span>Ver otra forma de dar cambio</span>
                <span style="background: rgba(255,255,255,0.25); border-radius: 10px; padding: 2px 7px; font-size: 0.8rem; font-weight: 900;">
                  ${currentComboIndex + 1}/${combinations.length}
                </span>
              </button>
            ` : ''}
          `}

          <div class="summary-row">
            <span>Producto:</span>
            <span><strong>${quantity}x ${selectedProduct.name}</strong></span>
          </div>
          <div class="summary-row">
            <span>Total a pagar:</span>
            <span>$${totalPayable.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Cliente pagó con:</span>
            <span>$${selectedBill.toFixed(2)}</span>
          </div>
        </div>

        <button class="btn-3d btn-green" id="btn-finish-sale" style="font-size: 1.4rem; padding: 18px;">
          ✅ CONCLUIR VENTA Y SIGUIENTE
        </button>
      `;
    }

    container.innerHTML = contentHtml;
    attachEvents();
  }

  function attachEvents() {
    // Step 1 Click Product Card
    if (currentStep === 1) {
      container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
          Sound.playClick();
          const pId = card.dataset.id;
          const products = Store.getProducts();
          selectedProduct = products.find(p => p.id === pId);
          quantity = 1;
          selectedBill = null;
          currentComboIndex = 0;
          currentStep = 2;
          render();
        });
      });
    }

    // Step 2 Quantity events
    if (currentStep === 2) {
      const btnMinus = container.querySelector('#btn-minus');
      const btnPlus = container.querySelector('#btn-plus');
      const btnBack = container.querySelector('#btn-back');
      const btnNext = container.querySelector('#btn-next-step3');

      btnMinus?.addEventListener('click', () => {
        if (quantity > 1) {
          Sound.playClick();
          quantity--;
          render();
        }
      });

      btnPlus?.addEventListener('click', () => {
        Sound.playClick();
        quantity++;
        render();
      });

      btnBack?.addEventListener('click', () => {
        Sound.playClick();
        currentStep = 1;
        render();
      });

      btnNext?.addEventListener('click', () => {
        Sound.playClick();
        currentStep = 3;
        render();
      });
    }

    // Step 3 Payment Entry & Bill Addition
    if (currentStep === 3) {
      const inputPaid = container.querySelector('#input-paid-amount');
      const btnClearPaid = container.querySelector('#btn-clear-paid');
      const btnExact = container.querySelector('#btn-set-exact');
      const addButtons = container.querySelectorAll('[data-add]');
      const btnBack = container.querySelector('#btn-back');
      const btnCalculate = container.querySelector('#btn-calculate-change');
      const totalPayable = selectedProduct.price * quantity;

      // Direct manual numeric input typing
      inputPaid?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        selectedBill = isNaN(val) ? 0 : val;
        updateStep3Status();
      });

      // Clear payment input
      btnClearPaid?.addEventListener('click', () => {
        Sound.playClick();
        selectedBill = 0;
        Sound.speak('Borrado');
        if (inputPaid) inputPaid.value = '';
        updateStep3Status();
      });

      // Set Exact Pay
      btnExact?.addEventListener('click', () => {
        Sound.playClick();
        selectedBill = totalPayable;
        Sound.speak(`Pago exacto, ${totalPayable === 1 ? '1 peso' : totalPayable + ' pesos'}`);
        if (inputPaid) inputPaid.value = totalPayable.toFixed(2);
        updateStep3Status();
      });

      // Add Bill/Coin tap buttons con voz inmediata
      addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          Sound.playClick();
          const addVal = parseFloat(btn.dataset.add);
          selectedBill = (selectedBill || 0) + addVal;
          Sound.speakAmount(addVal);
          if (inputPaid) inputPaid.value = selectedBill.toFixed(2);
          updateStep3Status();
        });
      });

      btnBack?.addEventListener('click', () => {
        Sound.playClick();
        currentStep = 2;
        render();
      });

      btnCalculate?.addEventListener('click', () => {
        if (selectedBill !== null && selectedBill >= totalPayable) {
          Sound.playSuccess();
          currentStep = 4;
          currentComboIndex = 0;
          render();
          const chg = Math.round((selectedBill - totalPayable) * 100) / 100;
          const combos = calculateAllChangeCombinations(chg);
          setTimeout(() => {
            Sound.speakChange(chg, combos[0] || []);
          }, 350);
        } else {
          Sound.playError();
        }
      });

      function updateStep3Status() {
        render();
      }
    }

    // Step 4 Finish Sale, Voice Speech & Cycle Change Options
    if (currentStep === 4) {
      const btnFinish = container.querySelector('#btn-finish-sale');
      const btnSpeak = container.querySelector('#btn-speak-change');
      const btnCycle = container.querySelector('#btn-cycle-change');
      const totalPayable = selectedProduct.price * quantity;
      const change = Math.round((selectedBill - totalPayable) * 100) / 100;
      const combinations = calculateAllChangeCombinations(change);
      const breakdown = combinations[currentComboIndex] || combinations[0] || [];

      btnSpeak?.addEventListener('click', () => {
        Sound.playClick();
        Sound.speakChange(change, breakdown);
      });

      btnCycle?.addEventListener('click', () => {
        Sound.playClick();
        currentComboIndex = (currentComboIndex + 1) % combinations.length;
        render();
        const nextBreakdown = combinations[currentComboIndex] || combinations[0] || [];
        Sound.speakChange(change, nextBreakdown);
      });

      btnFinish?.addEventListener('click', () => {
        Sound.playClick();
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        Store.addSale({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity: quantity,
          totalPayable: totalPayable,
          amountPaid: selectedBill,
          changeReturned: change
        });

        // Reset to Step 1
        currentStep = 1;
        selectedProduct = null;
        quantity = 1;
        selectedBill = null;
        currentComboIndex = 0;
        render();
      });
    }
  }

  render();
}
