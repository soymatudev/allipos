import { Store } from '../store.js';
import { Sound } from '../audio.js';

export function renderAdminView(container) {
  let imageBase64 = null;
  let editingProductId = null;

  function render() {
    const products = Store.getProducts();
    const editingProduct = editingProductId ? products.find(p => p.id === editingProductId) : null;

    if (editingProduct && !imageBase64) {
      imageBase64 = editingProduct.image;
    }

    container.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h2 style="font-size: 1.4rem; font-weight: 900; margin-bottom: 4px;">
          ${editingProductId ? '✏️ Editar Producto' : '➕ Cargar Nuevo Producto'}
        </h2>
        <p style="color: var(--color-text-muted); font-weight: 700;">
          ${editingProductId ? 'Modifica los datos del producto seleccionado.' : 'Agrega postres, bebidas o antojitos para la kermés.'}
        </p>
      </div>

      <form id="product-form" style="background: #ffffff; border: 2px solid var(--color-gray-light); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 24px;">
        <div class="form-group">
          <label class="form-label" for="prod-name">Nombre del Producto:</label>
          <input type="text" id="prod-name" class="form-input" placeholder="Ej. Flan de Vainilla, Taco..." value="${editingProduct ? editingProduct.name : ''}" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="prod-price">Precio ($ MXN):</label>
          <input type="number" step="0.50" min="0.50" id="prod-price" class="form-input" placeholder="Ej. 15.00" value="${editingProduct ? editingProduct.price : ''}" required />
        </div>

        <div class="form-group">
          <label class="form-label">Foto del Producto (Cámara / Galería):</label>
          <input type="file" id="prod-image-file" accept="image/*" style="display: none;" />
          <div class="image-preview-box" id="image-box">
            ${imageBase64 
              ? `<img src="${imageBase64}" alt="Vista previa" />` 
              : `<div style="font-size: 2.2rem;">📷</div><div style="font-weight: 800; color: var(--color-blue); margin-top: 4px;">Toca para subir foto</div>`}
          </div>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 12px;">
          ${editingProductId ? `
            <button type="button" class="btn-3d btn-yellow" id="btn-cancel-edit" style="flex: 1;">
              ❌ Cancelar
            </button>
          ` : ''}
          <button type="submit" class="btn-3d btn-green" style="flex: 2;">
            ${editingProductId ? '💾 GUARDAR CAMBIOS' : '💾 AGREGAR PRODUCTO'}
          </button>
        </div>
      </form>

      <div>
        <h2 style="font-size: 1.3rem; font-weight: 900; margin-bottom: 12px;">📋 Catálogo Actual (${products.length})</h2>
        <div class="admin-list">
          ${products.length === 0 ? `
            <p style="color: var(--color-text-muted); font-weight: 700;">No hay productos guardados.</p>
          ` : products.map(p => `
            <div class="admin-item" style="${editingProductId === p.id ? 'border-color: var(--color-blue); background-color: #f0f8ff;' : ''}">
              <div class="admin-item-info">
                <img src="${p.image}" class="admin-item-thumb" alt="${p.name}" />
                <div>
                  <div class="admin-item-name">${p.name}</div>
                  <div class="admin-item-price">$${p.price.toFixed(2)}</div>
                </div>
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn-3d btn-blue btn-edit" data-id="${p.id}" style="padding: 8px 12px; font-size: 0.85rem; width: auto;">
                  ✏️ Editar
                </button>
                <button class="btn-3d btn-red btn-delete" data-id="${p.id}" style="padding: 8px 12px; font-size: 0.85rem; width: auto;">
                  🗑️ Borrar
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const form = container.querySelector('#product-form');
    const imageBox = container.querySelector('#image-box');
    const fileInput = container.querySelector('#prod-image-file');
    const btnCancelEdit = container.querySelector('#btn-cancel-edit');

    imageBox?.addEventListener('click', () => {
      Sound.playClick();
      fileInput.click();
    });

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          imageBase64 = event.target.result;
          render();
        };
        reader.readAsDataURL(file);
      }
    });

    btnCancelEdit?.addEventListener('click', () => {
      Sound.playClick();
      editingProductId = null;
      imageBase64 = null;
      render();
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = container.querySelector('#prod-name');
      const priceInput = container.querySelector('#prod-price');

      const name = nameInput.value.trim();
      const price = parseFloat(priceInput.value);

      if (!name || isNaN(price) || price <= 0) {
        Sound.playError();
        alert('Por favor ingresa un nombre y precio válido.');
        return;
      }

      Sound.playSuccess();

      if (editingProductId) {
        Store.updateProduct(editingProductId, {
          name,
          price,
          image: imageBase64
        });
      } else {
        Store.addProduct({
          name,
          price,
          image: imageBase64
        });
      }

      // Reset form & state
      editingProductId = null;
      imageBase64 = null;
      render();
    });

    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        Sound.playClick();
        editingProductId = btn.dataset.id;
        const products = Store.getProducts();
        const p = products.find(prod => prod.id === editingProductId);
        if (p) {
          imageBase64 = p.image;
        }
        render();
        // Scroll to form
        form?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm('¿Estás seguro de borrar este producto del catálogo?')) {
          Sound.playClick();
          if (editingProductId === id) {
            editingProductId = null;
            imageBase64 = null;
          }
          Store.deleteProduct(id);
          render();
        }
      });
    });
  }

  render();
}
