const tg = window.Telegram.WebApp;

// Expande o Mini App (fica tela cheia)
tg.expand();

// Muda a cor da barra superior do Telegram
tg.setHeaderColor("#2aabee");
tg.setBackgroundColor("#f5f5f5");

// --- Mobile modal / deposit selector behavior (extended) ---
document.addEventListener('DOMContentLoaded', () => {
	const btnSaldo = document.getElementById('btn-saldo');
	const modal = document.getElementById('deposit-modal');
	const backdrop = document.getElementById('modal-backdrop');
	const btnCancel = document.getElementById('modal-cancel');
	const btnOk = document.getElementById('modal-ok');
	const select = document.getElementById('deposit-select');
	const inventory = document.getElementById('inventory');

	// Adjust modal elements
	const adjustModal = document.getElementById('adjust-modal');
	const adjustBackdrop = document.getElementById('adjust-backdrop');
	const adjustCancel = document.getElementById('adjust-cancel');
	const adjustSave = document.getElementById('adjust-save');
	const adjustAmount = document.getElementById('adjust-amount');
	const adjustItemName = document.getElementById('adjust-item-name');

	// Simulated store with items per depósito. Replace with API calls if needed.
	const store = {
			'1': {
				name: 'Depósito 1',
				items: [
					{ id: '1-1', name: 'Parafuso M4', qty: 120, unit: 'un' },
					{ id: '1-2', name: 'Porca M4', qty: 80, unit: 'un' },
					{ id: '1-3', name: 'Arruela 10mm', qty: 50, unit: 'un' }
				]
			},
		'2': {
				name: 'Depósito 2',
				items: [
					{ id: '2-1', name: 'Cabo USB', qty: 45, unit: 'un' },
					{ id: '2-2', name: 'Carregador 5V', qty: 20, unit: 'un' }
				]
		},
		'3': {
				name: 'Depósito 3',
				items: [
					{ id: '3-1', name: 'Filtro Ar', qty: 0, unit: 'un' },
					{ id: '3-2', name: 'Óleo', qty: 10, unit: 'L' }
				]
		}
	};

	function openDepositModal() {
		modal.setAttribute('aria-hidden', 'false');
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}

	function closeDepositModal() {
		modal.setAttribute('aria-hidden', 'true');
	}

		function openAdjustModal(item, depositId) {
			adjustModal.setAttribute('aria-hidden', 'false');
			adjustItemName.textContent = `${item.name} — Saldo atual: ${item.qty} ${item.unit || ''}`;
		adjustAmount.value = 1;
		// store context on modal element
		adjustModal._context = { itemId: item.id, depositId };
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}

	function closeAdjustModal() {
		adjustModal.setAttribute('aria-hidden', 'true');
		adjustModal._context = null;
	}

	btnSaldo.addEventListener('click', (e) => {
		e.preventDefault();
		openDepositModal();
	});

	backdrop.addEventListener('click', closeDepositModal);
	btnCancel.addEventListener('click', closeDepositModal);

	adjustBackdrop.addEventListener('click', closeAdjustModal);
	adjustCancel.addEventListener('click', closeAdjustModal);

	adjustSave.addEventListener('click', () => {
		const ctx = adjustModal._context;
		if (!ctx) {
			closeAdjustModal();
			return;
		}
		const amount = parseInt(adjustAmount.value, 10);
		if (Number.isNaN(amount)) {
			alert('Insira um número válido');
			return;
		}
		const deposit = store[ctx.depositId];
		if (!deposit) {
			alert('Depósito não encontrado');
			closeAdjustModal();
			return;
		}
		const item = deposit.items.find(i => i.id === ctx.itemId);
		if (!item) {
			alert('Item não encontrado');
			closeAdjustModal();
			return;
		}
		// Apply the adjustment (positive to add)
		item.qty = item.qty + amount;
		closeAdjustModal();
		renderInventory(ctx.depositId);
	});

	btnOk.addEventListener('click', () => {
		const val = select.value;
		closeDepositModal();
		if (!val) {
			inventory.innerHTML = '<p style="color:#d00">Por favor selecione um depósito.</p>';
			return;
		}
		renderInventory(val);
	});

	function renderInventory(depositId) {
		const dep = store[depositId];
		if (!dep) {
			inventory.innerHTML = '<p>Depósito não encontrado.</p>';
			return;
		}

			let html = ` <div class="card"><div style="display:flex;align-items:center;justify-content:space-between"><div><strong style="font-size:16px">${dep.name}</strong><div style="margin-top:6px;color:var(--muted);font-size:13px">Itens no depósito</div></div><div style="color:var(--muted);font-size:13px">${dep.items.length} itens</div></div></div>`;
			html += '<div class="items-list">';
			dep.items.forEach(item => {
				// determine badge class by qty
				let badgeClass = 'ok';
				if (item.qty <= 0) badgeClass = 'empty';
				else if (item.qty <= 10) badgeClass = 'low';

				// avatar: initials
				const initials = item.name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();

						html += `
							<div class="card item-row" data-item-id="${item.id}">
								<div style="display:flex;align-items:center;gap:12px">
									<div class="item-avatar">${initials}</div>
									<div class="item-info">
										<div class="item-title">${item.name}</div>
										<div class="item-qty">Quantidade: <span class="qty-val">${item.qty}</span> <span class="item-unit">${item.unit || ''}</span></div>
									</div>
								</div>
								<div class="item-actions">
									<div class="badge ${badgeClass}">${item.qty} ${item.unit || ''}</div>
									<button class="btn-small btn-help" data-action="help" data-item="${item.id}">Ajudar</button>
								</div>
							</div>`;
			});
			html += '</div>';
		inventory.innerHTML = html;

		// attach handlers for help buttons
		inventory.querySelectorAll('[data-action="help"]').forEach(btn => {
			btn.addEventListener('click', (e) => {
				const itemId = btn.getAttribute('data-item');
				const item = dep.items.find(i => i.id === itemId);
				if (item) openAdjustModal(item, depositId);
			});
		});
	}

	// initial hint
	inventory.innerHTML = `<div class="card"><p>Toque em "Ver Saldo" para selecionar um depósito e ver os itens com seus saldos.</p></div>`;
});
