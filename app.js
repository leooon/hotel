const textos = {
	'introducao': [
		'Olá, você herdou essa poçilga.',
		'Benção ou maldição? Vamos descobrir.',
		'Para atrair algum desesperado, construa um quarto minimamente habitável.',
	],
}

let hotel = {
	'andares': {
		'1': {
			'texto': '1.º andar',
			'preco': 1000,
			'comprado': false,
		},
		'2': {
			'texto': '2.º andar',
			'preco': 2500,
			'comprado': false,
		},
		'3': {
			'texto': '3.º andar',
			'preco': 6000,
			'comprado': false,
		},
		'4': {
			'texto': '4.º andar',
			'preco': 15000,
			'comprado': false,
		},
	},
	streetChars: [],
}

const dex = {
	'clown': {
		'unlocked': false,
		'show': [],
		'visit': [{'minAndares': 1}],
	},
	'dinossaur': {
		'unlocked': false,
		'show': [{'minAndares': 2}],
		'visit': [{'minAndares': 3}],
	},
	'ghost': {
		'unlocked': false,
		'show': [{'minAndares': 2}],
		'visit': [{'minAndares': 3}]
	}
}

let file = {
	chars: {},
	progress: {},
	building: {},
}

const actions = {
	streetWalking (char) {
		const charName = char.type;
		const el = char.el;

		const ruaRect = document.getElementById('rua').getBoundingClientRect();
		const targetX = ruaRect.width;
		const randomAnimationDuration = Math.floor(Math.random() * (36 - 12 + 1) + 12);
		const randomBottom = Math.floor(Math.random() * (50 - (-10) + 1) + (-10));
		el.style.transform = `translateY(${ruaRect.top + randomBottom}px)`;
		el.style.zIndex = 100 +randomBottom;

		sideToggle = !sideToggle;
		const translateArr = sideToggle ? [-36, targetX] : [targetX, -36];

		anime({
			targets: el,
			translateX: translateArr,
			duration: randomAnimationDuration * 1000,
			easing: 'linear',
			complete: function(anim) {
				el.remove();
				
				delete file.chars[char.id];
				save();
			},
			update: function(anim) {
				const progress = Math.round(anim.progress)
				
				if (progress == 40 && !anim.control) {
					anim.control = true;

					if (canVisit(charName)) {
						el.classList.add('clown');
					
						anim.pause();

						actions.visiting(char);
					}
				}
			}
		});
	},
	visiting (char) {
		const order = Object.values(file.chars).filter(char => char.location === 'reception').length + 1;
		
		char.location = 'reception';
		char.receptionOrder = order;
		file.chars[char.id] = char;
		save();
		
		anime({
			targets: char.el,
			keyframes: [
				{translateY: getPosition('#escada').y, translateX: getPosition('#escada').x},
				{translateY: getPosition('.gerente').y},
				{translateX: getPosition('.gerente').x + (order * 35)},
			],
			duration: 4000,
			easing: 'linear',
		});
	}
}

function save() {
	localStorage.setItem('file', JSON.stringify(file));
}

document.getElementById('reset').onclick = () => {
	localStorage.removeItem('dinheiro');
	localStorage.removeItem('hotel');
	localStorage.removeItem('file');

	location.reload();
}

window.addEventListener('load', () => {
	file = localStorage.getItem('file') ? JSON.parse(localStorage.getItem('file')) : file;

	const dinheiro = localStorage.getItem('dinheiro');
	const savedHotel = localStorage.getItem('hotel');
	
	if (savedHotel) {
		hotel = JSON.parse(savedHotel);	
	} else {
		localStorage.setItem('hotel', JSON.stringify(hotel));
	}
	renderHotel();
	loadChars();

	if (dinheiro === null) {
		document.querySelector('.fudido button').style.display = 'none';

		mensagem('introducao', () => {
			localStorage.setItem('dinheiro', 1000);
			document.getElementById('dinheiro').innerHTML = 1000;
			document.querySelector('.fudido button').style.display = 'block';
		});
		
	} else {
		document.getElementById('dinheiro').innerHTML = dinheiro;
		document.querySelector('.fudido button').style.display = 'block';
	}

	showCharsInterval();
});

function loadChars() {
	Object.values(file.chars).filter(char => char.location === 'street').forEach(char => {
		delete file.chars[char.id];
	});

	Object.entries(file.chars).filter(([id, char]) => char.location === 'reception').forEach(([id, char]) => {
		el = renderChar(char.type);
		file.chars[id].el = el;
		el.style.transform = `translateY(${getPosition('.gerente').y}px) translateX(${getPosition('.gerente').x + (char.receptionOrder * 35)}px)`;
	});
}

function mensagem(fluxo, callback) {
	const quadro = document.querySelector('#quadro');
	const texto = quadro.querySelector('p');
	let index = 0;

	quadro.style.display = 'block';
	texto.innerHTML = textos[fluxo][index];

	quadro.onclick = () => {
		index++;
		if (index < textos[fluxo].length) {
			texto.innerHTML = textos[fluxo][index];
		} else {
			quadro.style.display = 'none';
			if (callback) callback();
		}
	};
}

function renderHotel() {
	const hotelEl = document.getElementById('hotel');

	for (const [key, andar] of Object.entries(hotel.andares)) {
		if (andar.comprado) {
			const template = document.importNode(document.querySelector('#andar').content, true);
			template.querySelector('p').innerHTML = andar.texto;
			hotelEl.appendChild(template);
		} else {
			const template = document.importNode(document.querySelector('#andar-fudido').content, true);
			
			const button = template.querySelector('button');
			button.innerHTML = andar.preco;
			button.addEventListener('click', comprarAndar);
			
			hotelEl.appendChild(template);

			break;
		}
	};
	
	const fudidoEl = document.querySelector('.fudido button');
	const nextAndar = Object.values(hotel.andares).find(andar => !andar.comprado);
	fudidoEl.innerHTML = nextAndar.preco;


}

function comprarAndar() {
	const dinheiroEl = document.getElementById('dinheiro');
	const dinheiro = parseInt(dinheiroEl.innerHTML);

	const fudidoEl = document.querySelector('.fudido button');
	const preco = parseInt(fudidoEl.innerHTML);

	if (dinheiro >= preco) {
		const newDinheiro = dinheiro - preco;
		localStorage.setItem('dinheiro', newDinheiro);
		dinheiroEl.innerHTML = newDinheiro;

		const andar = Object.keys(hotel.andares).find(key => !hotel.andares[key].comprado);
		hotel.andares[andar].comprado = true;
		localStorage.setItem('hotel', JSON.stringify(hotel));

		const hotelEl = document.getElementById('hotel');
		const template = document.importNode(document.querySelector('#andar').content, true);
		template.querySelector('p').innerHTML = hotel.andares[andar].texto;
		hotelEl.insertBefore(template, hotelEl.querySelector('.fudido'));
	}
}

let sideToggle = false;

function showChars() {
	if (howMany('location', 'street')>= 4) return;
	
	const allowedTypes = [];

	for (const type in dex) {
		if (canShow(type)) allowedTypes.push(type);
	}

	const random = Math.floor(Math.random() * allowedTypes.length);
	const type = allowedTypes[random];

	const id = Object.keys(file.chars).length ? Math.max(...Object.values(file.chars).map(char => char.id)) + 1 : 1;
	const char = {
		id: id,
		type: type,
		location: 'street',
		action: 'streetWalking',
		el: renderChar(type)
	}
	file.chars[id] = char;
	save();

	actions.streetWalking(char);
}

function showCharsInterval() {
	showChars();
	
	const rand = Math.floor(Math.random() * (8000 - 2000 + 1)) + 2000;
	setTimeout(showCharsInterval, rand);
}

function canShow(type) {
	let can = false;

	if (!dex[type].show.length) can = true;

	for (const showCondition of dex[type].show) {
		const minAndares = showCondition.minAndares;
		if (minAndares === undefined || Object.keys(hotel.andares).filter(key => hotel.andares[key].comprado).length >= minAndares) {
			can = true;
		}
	}

	if (can) {
		file.progress[type] = file.progress[type] || {};
		file.progress[type].show = true;
		save();
	}
	
	return can;
}

function renderChar(type) {
	const el = document.createElement('div');

	if (file.progress?.[type]?.visit) {
		el.classList.add('char', type);
	} else {
		el.classList.add('char', 'locked');
		el.innerHTML = '🔒';
	}

	document.getElementById('canvas').appendChild(el);

	el.onclick = (e) => {
		openDex(type);
	};

	return el;
}

function openDex (charName) {
	const dexEl = document.getElementById('dex');
	dexEl.style.display = 'block';
	
	const p = dexEl.querySelector('p');

	const unlocked = dex[charName].unlocked;
	if (unlocked) {
		p.innerHTML = charName + '<br><br>';
	} else {
		p.innerHTML = '???<br><br>';
	}
	
	const showCondition = [];
	if (!dex[charName].show.length) showCondition.push('Sem critérios.');
	for (const condition of chars[charName].show) {
	}
	p.innerHTML += 'Aparecer: ' + showCondition.join(', ') + '<br>';

	const visitCondition = [];
	if (!dex[charName].visit.length) visitCondition.push('Sem critérios.');
	for (const condition of dex[charName].visit) {
		if (condition.minAndares) {
			visitCondition.push('Pelo menos ' + condition.minAndares + ' quarto disponível.');
		}
	}
	p.innerHTML += 'Visitar: ' + visitCondition.join(', ') + '<br>';
}

function closeDex () {
	const dexEl = document.getElementById('dex');
	dexEl.style.display = 'none';
}
document.querySelector('#dex button').addEventListener('click', closeDex);

function checkVisit(charEl) {
	
}

function canVisit (type) {
	if (Object.values(file.chars).filter(char => char.location === 'reception').length >= 4) return false;

	for (const visitCondition of dex[type].visit) {
		const minAndares = visitCondition.minAndares;
		if (minAndares === undefined || Object.keys(hotel.andares).filter(key => hotel.andares[key].comprado).length >= minAndares) {
			
			file.progress[type].visit = true;
			save();

			for (const id in file.chars) {
				const char = file.chars[id];
				if (char.type === type) {
					char.el.classList.add(type);
				}
			}
			Object.values(file.chars).filter(char => char.type === type).forEach(char => {
				char.el.classList.add(type);
				char.el.innerHTML = '';
			});

			return true;
		}
	}
	return false;
}

function getPosition(selector) {
	const el = document.querySelector(selector);
	const rect = el.getBoundingClientRect();
	return {
		x: rect.left + window.scrollX,
		y: rect.top + window.scrollY
	};
}

function howMany(type, value) {
	return Object.values(file.chars).filter(char => char[type] === value).length;
}