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
		'show': {},
		'visit': {
			'floors': 1,
		},
	},
	'dinossaur': {
		'show': {
			'guests': {
				'clown': 1
			},
		},
		'visit': {
			'guests': {
				'clown': 3
			},
		},
	},
	'ghost': {
		'show': {
			'guests': {
				'dinosaur': 1
			},
		},
		'visit': {
			'floors': 2,
		},
	}
}

let file = {
	chars: {},
	progress: {},
	building: {},
	coins: 0
}

const actions = {
	showChar: () => {
		if (howMany({location: 'street'})>= 4) return;

		const allowedTypes = [];
		for (const type in dex) {
			if (checkers.canShow(type)) allowedTypes.push(type);
		}

		const type = allowedTypes[helper.rand(0, allowedTypes.length - 1)];
	
		const id = Object.keys(file.chars).length ? Math.max(...Object.values(file.chars).map(char => char.id)) + 1 : 1;
		const char = {
			id: id,
			type: type,
			location: 'street',
			el: actions.renderChar(type)
		}
		file.chars[id] = char;
		save();
	
		actions.streetWalking(char);
	},
	renderChar(type) {
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
	},
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

					if (checkers.canVisit(charName)) {
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

		const animation = anime({
			targets: char.el,
			easing: 'linear',
			keyframes: [
				{
					duration: 1000,
					translateY: getPosition('#escada').y,
					translateX: getPosition('#escada').x
				},
				{
					duration: 500,
					translateY: getPosition('.gerente').y
				},
				{
					duration: 500 * (5 - order),
					translateX: getPosition('.gerente').x + (order * 35),
				},
			],
			complete: () => {
				openCheckin();
				if (file.chars[char.id].receptionOrder != order) actions.adjustLine(char);
			},
		});

		updateChar(char.id, {
			location: 'reception',
			receptionOrder: order,
			animation: animation
		});
	},
	adjustLine: (char) => {
		anime({
			targets: char.el,
			duration: 200,
			easing: 'linear',
			translateX: getPosition('.gerente').x + (file.chars[char.id].receptionOrder * 35),
			complete: openCheckin,
		})
	},
	advanceLine: () => {
		Object.values(file.chars)
			.filter(char => char.location === 'reception')
			.forEach(char => {
				updateChar(char.id, {
					receptionOrder: char.receptionOrder - 1
				});

				if (!char.animation || char.animation.completed) actions.adjustLine(char);
		});
	},
	deny: () => {
		const first = helper.firstInLine();

		deleteChar(first.id);

		first.el.style.zIndex = 99999;
		
		anime({
			targets: first.el,
			keyframes: [
				{
					scale: 9,
					translateY: '-=100px',
					translateX: `+=${Math.floor(Math.random() * 161) - 30}px`,
					duration: 200,
					easing: 'easeOutQuint'
				}, {
					translateY: '+=500px',
					duration: 1200,
					easing: 'easeInQuint'
				}
			],
			complete: () => first.el.remove()
		});
		
		document.getElementById('checkin').classList.remove('active');
		if (Object.values(file.chars).some(char => char.location === 'reception')) actions.advanceLine();
	},
	checkIn: () => {
		const first = helper.firstInLine();

		const floor = file.building[1];
		updateChar(first.id, {
			location: 'hotel'
		});

		const porta = floor.el.querySelector('.porta');

		anime({
			targets: first.el,
			easing: 'linear',
			keyframes: [
				{
					duration: 1400,
					translateX: getPosition('#recepcao .porta').x,
				}, {
					duration: 500,
					opacity: 0,
				}, {
					duration: 500,
					opacity: 1,
					translateY: [getPosition(porta).y + 20, getPosition(porta).y + 20],
				}, {
					duration: 1000,
					translateX: 120,
				}
			]
		});

		actions.advanceLine();
	},
}

function openCheckin() {
	document.getElementById('checkin').classList.add('active');
}

function save() {
	localStorage.setItem('file', JSON.stringify(file));
}

function reset() {
	localStorage.removeItem('dinheiro');
	localStorage.removeItem('hotel');
	localStorage.removeItem('file');

	location.reload();
}

window.addEventListener('load', () => {
	load.loadFile();
	load.building();
	load.chars();
	load.ux();
	load.showCharInterval();
});

const load = {
	loadFile: () => {
		if (!localStorage.getItem('file')) {
			mensagem('introducao', () => {
				updateCoins(1000);
				document.querySelector('.fudido button').style.display = 'block';
			});
			
		} else {
			file = JSON.parse(localStorage.getItem('file'));
			document.getElementById('dinheiro').innerHTML = '🪙 ' + file.coins;
		}
	},
	chars: () => {
		Object.values(file.chars).filter(char => char.location === 'street').forEach(char => {
			delete file.chars[char.id];
		});
	
		Object.entries(file.chars).filter(([id, char]) => char.location === 'reception').forEach(([id, char]) => {
			el = actions.renderChar(char.type);
			file.chars[id].el = el;
			el.style.transform = `translateY(${getPosition('.gerente').y}px) translateX(${getPosition('.gerente').x + (char.receptionOrder * 35)}px)`;
		});
	},
	building: () => {
		const hotelEl = document.getElementById('hotel');

		Object.entries(file.building).forEach(([key, floor]) => {
			const template = document.querySelector('#andar').content;
			const floorEl = template.firstElementChild.cloneNode(true);
			floorEl.querySelector('p').innerHTML = hotel.andares[1].texto;
			hotelEl.appendChild(floorEl);

			file.building[key].el = floorEl;
		});

		const template = document.importNode(document.querySelector('#andar-fudido').content, true);
		
		const button = template.querySelector('button');
		button.innerHTML = andar.preco;
		button.addEventListener('click', comprarAndar);
		
		hotelEl.appendChild(template);
		
		const fudidoEl = document.querySelector('.fudido button');
		const nextAndar = Object.values(hotel.andares).find(andar => !andar.comprado);
		fudidoEl.innerHTML = nextAndar.preco;
	},
	ux: () => {
		if (Object.values(file.chars).some(char => char.location === 'reception')) openCheckin();

		document.querySelector('#reset').addEventListener('click', reset);
		document.querySelector('#dex_bt').addEventListener('click', openDex);
		document.querySelector('#checkin_bt').addEventListener('click', actions.checkIn);
		document.querySelector('#denied_bt').addEventListener('click', actions.deny);
	},
	showCharInterval: () => {
		actions.showChar();
		setTimeout(load.showCharInterval, helper.rand(2000, 8000));
	}
}

const helper = {
	rand: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
	firstInLine: () => {
		const first = Object.values(file.chars)
			.filter(char => char.receptionOrder > 0)
			.reduce((highest, char) => {
				return !highest || char.receptionOrder < highest.receptionOrder ? char : highest;
			});

		return first;
	},
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

function comprarAndar() {
	const fudidoEl = document.querySelector('.fudido button');
	const preco = parseInt(fudidoEl.innerHTML);

	if (file.coins >= preco) {
		updateCoins(-1 * preco);
		
		const andar = Object.keys(hotel.andares).find(key => !hotel.andares[key].comprado);
		hotel.andares[andar].comprado = true;
		localStorage.setItem('hotel', JSON.stringify(hotel));

		const hotelEl = document.getElementById('hotel');

		const template = document.querySelector('#andar').content;
		const floor = template.firstElementChild.cloneNode(true);
		floor.querySelector('p').innerHTML = hotel.andares[andar].texto;
		hotelEl.insertBefore(floor, hotelEl.querySelector('.fudido'));

		const id = Object.keys(file.building).length ? Math.max(...Object.values(file.building).map(floor => floor.id)) + 1 : 1;

		file.building[id] = {
			id: id,
			el: floor
		}
		save();
	}
}

let sideToggle = false;

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

const solve = {
	'guests': (rules) => {
		const ok = [];
		for (const [type, min] of Object.entries(rules)) {
			ok.push(howMany({type: type, location: 'hotel'}) >= min);
		}
	
		return ok.every(value => value);
	},
	'floors': (min) => {
		const floorCount = Object.entries(file.building).length;
		return floorCount >= min;
	}
}

const checkers = {
	canShow: (type) => {
		const ok = [];
		for (const [condition, rule] of Object.entries(dex[type].show)) {
			ok.push(solve[condition](rule));
		};

		if (ok.every(value => value)) {
			if (!file.progress[type]?.show) {
				file.progress[type] = {show: true};
				save();
			}
			
			return true;
		}

		return false;
	},
	canVisit: (type) => {
		if (Object.values(file.chars).filter(char => char.location === 'reception').length >= 4) return false;

		const ok = [];
		for (const [condition, rule] of Object.entries(dex[type].visit)) ok.push(solve[condition](rule));

		if (ok.every(value => value)) {
			if (!file.progress[type].visit) {
				file.progress[type].visit = true;
				save();

				Object.values(file.chars).filter(char => char.type === type).forEach(char => {
					char.el.classList.add(type);
					char.el.innerHTML = '';
				});
			}
			
			return true;
		}

		return false;
	}
}

function getPosition(selector) {
	const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
	const rect = el.getBoundingClientRect();
	return {
		x: rect.left + window.scrollX,
		y: rect.top + window.scrollY
	};
}

function howMany(filters) {
	return Object.values(file.chars).filter(char => {
		for (const [prop, value] of Object.entries(filters)) {
			if (char[prop] !== value) return false;
		}
		return true;
	}).length;
}

function updateCoins(coins) {
	file.coins += coins;
	save();

	document.getElementById('dinheiro').innerHTML = '🪙 ' + file.coins;
}

function updateChar(id, update) {
	Object.assign(file.chars[id], update);
	save();
}
function deleteChar(id) {
	delete file.chars[id];
	save();
}