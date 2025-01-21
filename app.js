const config = {
	dayMsConversion: 60000,
}

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
		'stay': 1,
		'show': {},
		'visit': {
			'floors': 1,
		},
	},
	'dinosaur': {
		'stay': 2,
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
		'stay': 2,
		'show': {
			'guests': {
				'dinosaur': 1
			},
		},
		'visit': {
			'floors': 2,
		},
	},
	'zombie': {},
	'werewolf': {},
	'skeleton': {},
	'vampire': {},
	'witch': {},
	'witcher': {},
	'goblin': {},
	'giant': {},
	'gargoyle': {},
	'orc': {},
	'dragon': {},
	'elf': {},
	'human': {},
	'astronaut': {},
	'alien': {},
	'alien2': {},
	'alien3': {},
	'alien4': {},
	'alien5': {},
	'alien6': {},
	'alien7': {},
}

let file = {
	chars: {},
	progress: {},
	building: {},
	coins: 0,
	stage: []
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
	
		actions.street.wandering(char);
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

		return el;
	},
	street: {
		wandering (char) {
			// const ruaRect = document.getElementById('rua').getBoundingClientRect();
			// const targetX = ruaRect.width;
			
			
			const randomY = helper.rand(-10, 50);
			char.el.style.transform = `translateY(${getPosition('#rua').y + randomY}px)`;
			char.el.style.zIndex = 100 + randomY;
	
			sideToggle = !sideToggle;
			const translateArr = sideToggle ? [-36, getPosition('#rua').right] : [getPosition('#rua').right, -36];
	
			anime({
				targets: char.el,
				translateX: translateArr,
				duration: helper.rand(12, 36) * 1000,
				easing: 'linear',
				complete: function(anim) {
					char.el.remove();
					
					delete file.chars[char.id];
					save();
				},
				update: function(anim) {
					const progress = Math.round(anim.progress)
					
					if (progress == 40 && !anim.control) {
						anim.control = true;
	
						if (checkers.canVisit(char.type)) {
							char.el.classList.add('clown');
						
							anim.pause();
	
							actions.visiting(char);
						}
					}
				}
			});
		},
	},
	visiting (char) {
		const order = Object.values(file.chars).filter(char => char.location === 'reception').length + 1;

		anime({
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
				actions.reception.openCheckin();
				if (file.chars[char.id].receptionOrder != order) actions.adjustLine(char);
			},
		});

		ops.updateChar(char.id, {
			location: 'reception',
			receptionOrder: order
		});
	},
	adjustLine: (char) => {
		anime({
			targets: char.el,
			duration: 200,
			easing: 'linear',
			translateX: getPosition('.gerente').x + (file.chars[char.id].receptionOrder * 35),
			complete: actions.reception.openCheckin,
		})
	},
	advanceLine: () => {
		Object.values(file.chars)
			.filter(char => char.location === 'reception')
			.forEach(char => {
				ops.updateChar(char.id, {
					receptionOrder: char.receptionOrder - 1
				});

				if (!char.animation || char.animation.completed) actions.adjustLine(char);
		});
	},
	reception: {
		checkIn: () => {
			const first = helper.firstInLine();
			const floor = actions.building.nextOpenFloor();

			ops.updateChar(first.id, {
				location: 'hotel',
				roomFloor: floor.id,
				checkinTime: Date.now()
			}, ['receptionOrder']);
			ops.updateBuilding(floor.id, {
				guests: file.building[floor.id].guests + 1
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
				],
				complete: () => {
					actions.room.wandering(first.el, porta);
				}
			});
	
			actions.reception.closeCheckin();
			actions.advanceLine();
		},
		deny: () => {
			const first = helper.firstInLine();
	
			ops.deleteChar(first.id);
	
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
			
			actions.reception.closeCheckin();
			if (Object.values(file.chars).some(char => char.location === 'reception')) actions.advanceLine();
		},
		openCheckin: () => {
			document.getElementById('checkin').classList.add('active');
		},
		closeCheckin: () => {
			document.getElementById('checkin').classList.remove('active');
		}
	},
	room: {
		wandering: (el, porta) => {
			anime({
				targets: el,
				duration: 4000,
				delay: helper.rand(200, 2000),
				easing: 'linear',
				loop: true,
				direction: 'alternate',
				translateX: getPosition(porta).x - 50,
			});
		}
	},
	char: {
		checkCheckout: () => {
			Object.values(file.chars)
				.filter(char => char.location === 'hotel')
				.forEach(char => {
					if (Date.now() - char.checkinTime > dex[char.type].stay * config.dayMsConversion) {
						console.log('checkout');
					}
				});
		}
	},
	building: {
		nextOpenFloor: () => {
			const floor = Object.values(file.building)
				.filter(floor => floor.guests < 4)
				.reduce((lowest, floor) => {
					return !lowest || floor.id < lowest.id ? floor : lowest;
				});
	
			return floor;
		},
		nextToBuy: () => {
			if (!Object.values(file.building).length) return hotel.andares[1];

			const highestFloor = Object.values(file.building)
				.reduce((highest, floor) => {
					return !highest || floor.id > highest.id ? floor : highest;
				});	
			const next = hotel.andares[highestFloor.id + 1];
			
			return next;
		},
		purchaseFloor: () => {
			const next = actions.building.nextToBuy();
			
			if (file.coins >= next.preco) {
				updateCoins(-1 * next.preco);
				
				const hotelEL = document.getElementById('hotel');
				const template = document.querySelector('#andar').content;
				const floor = template.firstElementChild.cloneNode(true);
				floor.querySelector('p').innerHTML = next.texto;
				hotelEL.insertBefore(floor, hotelEL.querySelector('.fudido'));
				
				const id = Object.keys(file.building).length ? Math.max(...Object.values(file.building).map(floor => floor.id)) + 1 : 1;
				document.querySelector('.fudido button').innerHTML = hotel.andares[id + 1].preco;
		
				file.building[id] = {
					id: id,
					guests: 0,
					el: floor
				}
				save();
			}
		}
	},
	ux: {
		openDex: () => {
			const dexEl = document.getElementById('dex');
			dexEl.style.display = 'block';
			const list = dexEl.querySelector('.list');
			list.innerHTML = '';

			Object.entries(dex).forEach(([type, entry]) => {
				const div = document.createElement('div');
				const char = document.createElement('div');

				if (file.progress?.[type]?.visit) {
					char.classList.add('char', type);
				} else {
					char.classList.add('char', 'locked');
					char.innerHTML = '🔒';
				}

				div.appendChild(char);
				list.appendChild(div);
			})
		},
		closeDex: () => {
			document.getElementById('dex').style.display = 'none';
		},
		openCard: (charName) => {
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
	}
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
		if (localStorage.getItem('file')) {
			file = JSON.parse(localStorage.getItem('file'));
		} else {
			load.intro();
		}
	},
	intro: () => {
		mensagem('introducao', () => {
			updateCoins(4000);
			document.querySelector('.fudido button').style.display = 'block';

			file.stage.push('intro');
		});
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

		Object.entries(file.chars).filter(([id, char]) => char.location === 'hotel').forEach(([id, char]) => {
			el = actions.renderChar(char.type);
			file.chars[id].el = el;

			const floor = file.building[char.roomFloor].el;
			el.style.transform = `translateY(${(getPosition(floor).bottom) - 30}px) translateX(${getPosition(floor).x + 30}px)`;
			
			actions.room.wandering(el, floor.querySelector('.porta'));
		});
	},
	building: () => {
		const hotelEl = document.getElementById('hotel');

		Object.entries(file.building).forEach(([key, floor]) => {
			const template = document.querySelector('#andar').content;
			const floorEl = template.firstElementChild.cloneNode(true);
			floorEl.querySelector('p').innerHTML = hotel.andares[key].texto;
			hotelEl.appendChild(floorEl);

			file.building[key].el = floorEl;
		});

		const template = document.importNode(document.querySelector('#andar-fudido').content, true);
		const button = template.querySelector('button');
		button.innerHTML = andar.preco;
		button.addEventListener('click', actions.building.purchaseFloor);
		
		hotelEl.appendChild(template);
		
		const fudidoEl = document.querySelector('.fudido button');
		
		const nextAndar = Object.keys(file.building).reduce((max, key) => Math.max(max, parseInt(key)), 0) + 1;
		fudidoEl.innerHTML = hotel.andares[nextAndar].preco;

		if (file.stage.includes('intro')) {
			document.getElementById('dinheiro').innerHTML = '🪙 ' + file.coins;
			document.querySelector('.fudido button').style.display = 'block';
		};
	},
	ux: () => {
		if (Object.values(file.chars).some(char => char.location === 'reception')) actions.reception.openCheckin();

		document.querySelector('#reset').addEventListener('click', reset);
		document.querySelector('#dex_bt').addEventListener('click', actions.ux.openDex);
		document.querySelector('#checkin_bt').addEventListener('click', actions.reception.checkIn);
		document.querySelector('#denied_bt').addEventListener('click', actions.reception.deny);

		load.updateTime();
		// setInterval(load.updateTime, 60000);
		setInterval(load.updateTime, 1000);
	},
	updateTime: () => {
		const now = new Date();
		// const realMinute = now.getMinutes();
		const realMinute = now.getSeconds();
		
		const gameTime = (1440 / (config.dayMsConversion / 1000)) * realMinute;
		const gameHour = Math.floor(gameTime / 60);
		const gameMinute = gameTime % 60;

		document.getElementById('clock').innerHTML = gameHour.toString().padStart(2, '0') +':'+ gameMinute.toString().padStart(2, '0');

		if (gameHour >= 6 && gameHour < 18) {
			document.querySelector('#canvas').style.backgroundColor = 'aqua';
		} else {
			document.querySelector('#canvas').style.backgroundColor = 'midnightblue';
		}

		actions.char.checkCheckout();
	},
	showCharInterval: () => {
		actions.showChar();
		setTimeout(load.showCharInterval, helper.rand(2000, 8000));
	}
}

const helper = {
	rand: (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min
	},
	firstInLine: () => {
		const first = Object.values(file.chars)
			.filter(char => char.location === 'reception')
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

let sideToggle = false;

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
		if (dex[type].show === undefined) return false;

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
		if (dex[type].visit === undefined) return false;

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
		y: rect.top + window.scrollY,
		bottom: rect.bottom + window.scrollY,
		right: rect.right + window.scrollX
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

const ops = {
	updateChar: (id, upd = {}, del = []) => {
		Object.assign(file.chars[id], upd);
		del.forEach(key => delete file.chars[id][key]);
	
		save();
	},
	deleteChar: (id) => {
		delete file.chars[id];
		save();
	},
	updateBuilding: (id, upd = {}, del = []) => {
		Object.assign(file.building[id], upd);
		del.forEach(key => delete file.building[id][key]);
	
		save();
	},
}

if ("serviceWorker" in navigator && "PushManager" in window) {
    navigator.serviceWorker.register("/sw.js")
        .then((registration) => {
            console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
            console.error("Service Worker registration failed:", error);
        });
} else {
    console.warn("Push notifications are not supported in this browser.");
}
// Simulate push notification every minute
function simulatePushNotification() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
			action: "simulatePush",
			message: `Test notification at ${new Date().toLocaleTimeString()}`,
		});
		
		setInterval(() => {
            navigator.serviceWorker.controller.postMessage({
                action: "simulatePush",
                message: `Test notification at ${new Date().toLocaleTimeString()}`,
            });
        }, 60000); // Every minute
    }
}

// Listen for the simulation message in the service worker
navigator.serviceWorker.ready.then((registration) => {
	console.log('oi');
	
    registration.active.postMessage({
        action: "simulatePush",
        message: "Initial test notification",
    });
    simulatePushNotification();
});

function requestNotificationPermission() {
    if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            } else if (permission === "denied") {
                console.warn("Notification permission denied.");
            }
        });
    } else if (Notification.permission === "granted") {
        console.log("Notification permission already granted.");
    } else {
        console.warn("Notifications are blocked.");
    }
}

// Request permission when the page loads
document.addEventListener("DOMContentLoaded", () => {
    requestNotificationPermission();
});
