const config = {
	dayMsConversion: 24000,
}

const textos = {
	'introducao': [
		'Olá, você herdou essa poçilga.',
		'Benção ou maldição? Vamos descobrir.',
		'Para atrair algum desesperado, construa um quarto minimamente habitável.',
	],
	'noFloorAvailable': [
		'Nenhum andar disponível.',
	]
}

let hotel = {
	andares: {
		1: {
			'texto': '1.º andar',
			'preco': 1000,
			'comprado': false,
		},
		2: {
			'texto': '2.º andar',
			'preco': 2500,
			'comprado': false,
		},
		3: {
			'texto': '3.º andar',
			'preco': 6000,
			'comprado': false,
		},
	},
	streetChars: [],
}

const dex = {
	clown: {
		name: 'Palhaço',
		stay: 1,
		show: {
			hotel: 1,
		},
		visit: {
			floors: 1,
		},
	},
	dinosaur: {
		name: 'Dinossauro',
		stay: 2,
		show: {
			guests: {
				clown: 1,
			},
		},
		visit: {
			guests: {
				clown: 3,
			},
		},
	},
	ghost: {
		name: 'Fantasma',
		stay: 2,
		show: {
			guests: {
				dinosaur: 1,
			},
		},
		visit: {
			floors: 2,
		},
	},
	lord: {
		name: 'Cryptic Lord From Parallel Realm',
		stay: 3,
		show: {
			guests: {
				ghost: 4,
			},
		},
		visit: {
			floors: 3,
		},
	},
	werewolf: {},
	skeleton: {},
	vampire: {},
	witch: {},
	witcher: {},
	goblin: {},
	giant: {},
	gargoyle: {},
	orc: {},
	dragon: {},
	elf: {},
	human: {},
	astronaut: {},
	alien: {},
	alien2: {},
	alien3: {},
	alien4: {},
	alien5: {},
	alien6: {},
	alien7: {},
};

let file = {
	chars: {},
	progress: {},
	building: {},
	locations: {},
	coins: 0,
	stage: [],
	start: Date.now(),
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
		file.chars[id] = {};

		ops.updateChar(id, {
			id: id,
			type: type,
			location: 'street',
			el: actions.renderChar(type)
		});
	
		actions.street.wandering(file.chars[id]);
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
			const randomY = helper.rand(-10, 50);
			char.el.style.transform = `translateY(${getPosition('#street').y + randomY}px)`;
			char.el.style.zIndex = 100 + randomY;
	
			sideToggle = !sideToggle;
			const translateArr = sideToggle ? [-36, getPosition('#street').right] : [getPosition('#street').right, -36];
	
			anime({
				targets: char.el,
				translateX: translateArr,
				duration: helper.rand(12, 36) * 1000,
				easing: 'linear',
				complete: function(anim) {
					ops.deleteChar(char.id);
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

			if (!floor) {
				actions.ux.mensagem('noFloorAvailable');
				return false;
			};

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
		checkout: () => {
			const charId = file.locations['checkout'][0];
			const char = file.chars[charId];
			
			anime({
				targets: char.el,
				easing: 'linear',
				keyframes: [
					{
						duration: 1000,
						translateX: getPosition('#escada').x
					},
					{
						duration: 2000,
						translateY: getPosition('#street').bottom
					},
				],
				complete: () => {
					ops.deleteChar(charId);
				}
			});

			ops.updateChar(charId, {
				location: 'temporary',
				activity: 'leavingHotel',
			});
			ops.updateCoins(600);

			if (!Object.values(file.chars).some(char => char.activity === 'waitingCheckout'))
				actions.reception.closeCheckout();
		},
		openCheckin: () => {
			document.getElementById('checkin').classList.add('active');
		},
		closeCheckin: () => {
			document.getElementById('checkin').classList.remove('active');
		},
		openCheckout: () => {
			document.getElementById('checkout_bt').classList.add('active');
		},
		closeCheckout: () => {
			document.getElementById('checkout_bt').classList.remove('active');
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
						anime.remove(char.el);
						
						const door = file.building[char.roomFloor].el.querySelector('.porta');
						const reception = document.getElementById('recepcao').querySelector('.porta');

						anime({
							targets: char.el,
							easing: 'linear',
							keyframes: [
								{
									duration: 1400,
									translateX: getPosition(door).x,
								}, {
									duration: 500,
									opacity: 0,
								}, {
									duration: 500,
									opacity: 1,
									translateY: [getPosition(reception).y + 20, getPosition(reception).y + 20],
								}, {
									duration: 500,
									translateX: 282,
								}
								
							],
							complete: () => {
								ops.updateChar(char.id, {
									activity: 'waitingCheckout'
								});

								actions.reception.openCheckout();
							}
						});

						ops.updateBuilding(char.roomFloor, {
							guests: file.building[char.roomFloor].guests - 1
						})
						ops.updateChar(char.id, {
							location: 'checkout',
							activity: 'goingToCheckout'
						}, ['checkinTime', 'roomFloor']);
					}
				});
		}
	},
	building: {
		nextOpenFloor: () => {
			const floors = Object.values(file.building).filter(floor => floor.guests < 4);

			if (!floors.length) return null;

			const floor = floors.reduce((lowest, floor) => {
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
				ops.updateCoins(-1 * next.preco);
				
				const hotelEL = document.getElementById('hotel');
				const template = document.querySelector('#andar').content;
				const floor = template.firstElementChild.cloneNode(true);
				floor.querySelector('p').innerHTML = next.texto;
				hotelEL.insertBefore(floor, hotelEL.querySelector('.fudido'));
				
				const id = Object.keys(file.building).length ? Math.max(...Object.values(file.building).map(floor => floor.id)) + 1 : 1;

				if (hotel.andares[id + 1]) {
					document.querySelector('.fudido button').innerHTML = hotel.andares[id + 1].preco;
				} else {
					document.querySelector('.fudido button').style.display = 'none';
				}
		
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

			if (dexEl.style.display === 'block') {
				actions.ux.closeDex();
				return false;
			}

			dexEl.style.display = 'block';
			const list = dexEl.querySelector('.list');
			list.style.display = 'grid';
			list.innerHTML = '';

			Object.entries(dex).forEach(([type, entry]) => {
				const div = document.createElement('div');
				const char = document.createElement('div');

				if (file.progress?.[type]?.show) {
					char.classList.add('showed');
					char.addEventListener('click', () => {
						actions.ux.openDexDetail(type);
					})
				}

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
			
			document.querySelector('#dex #close_dex').style.display = 'inline';
			document.querySelector('#dex .details').style.display = 'none';
			document.querySelector('#dex #back_dex').style.display = 'none';
		},
		openDexDetail: (type) => {
			document.querySelector('#dex .list').style.display = 'none';
			document.querySelector('#dex #close_dex').style.display = 'none';
			document.querySelector('#dex #back_dex').style.display = 'inline';

			const details = document.querySelector('#dex .details');
			details.style.display = 'flex';

			if (file.progress?.[type]?.visit) {
				let text = '';
				text += '<b>Aparecer:</b><br>'+ solve.texts(dex[type].show);
				text += '<b>Visitar:</b><br>'+ solve.texts(dex[type].visit);
				
				details.querySelector('.name').innerHTML = dex[type].name;
				details.querySelector('.char').classList = ['char'];
				details.querySelector('.char').classList.add(type);
				details.querySelector('.char').innerHTML = '';
				details.querySelector('.rules').innerHTML = text;
			} else {
				let text = '';
				text += '<b>Aparecer:</b><br>'+ solve.texts(dex[type].show);
				text += '<b>Visitar:</b><br>'+ solve.texts(dex[type].visit);
				
				details.querySelector('.name').innerHTML = '???';
				details.querySelector('.char').classList = ['char'];
				details.querySelector('.char').classList.add('locked');
				details.querySelector('.char').innerHTML = '🔒';
				details.querySelector('.rules').innerHTML = text;
			}
		},
		backDex: () => {
			document.querySelector('#dex .list').style.display = 'grid';
			document.querySelector('#dex #close_dex').style.display = 'inline';

			document.querySelector('#dex .details').style.display = 'none';
			document.querySelector('#dex #back_dex').style.display = 'none';
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
		},
		mensagem: (fluxo, callback) => {
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
		}
		
		if (!file.stage?.includes('intro')) {
			load.intro();
		}
	},
	intro: () => {
		actions.ux.mensagem('introducao', () => {
			ops.updateCoins(1000);

			document.querySelector('.fudido button').innerHTML = hotel.andares[1].preco;
			document.querySelector('.fudido button').style.display = 'block';

			file.stage.push('intro');
		});
	},
	chars: () => {
		Object.values(file.chars).filter(char => char.location === 'street').forEach(char => {
			ops.deleteChar(char.id);
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

		const porta = document.getElementById('recepcao').querySelector('.porta');
		
		Object.entries(file.chars).filter(([id, char]) => char.location === 'checkout').forEach(([id, char]) => {
			el = actions.renderChar(char.type);
			file.chars[id].el = el;

			el.style.transform = `translateY(${(getPosition(porta).bottom - 30)}px) translateX(282px)`;

			actions.reception.openCheckout();
		});

		Object.entries(file.chars).filter(([id, char]) => char.location === 'temporary').forEach(([id, char]) => {
			ops.deleteChar(id);
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
		
		const highestFloor = Object.values(file.building).reduce((highest, floor) => Math.max(highest, floor.id), 0);

		if (file.stage.includes('intro')) {
			document.getElementById('dinheiro').innerHTML = '🪙 ' + file.coins;
			
			if (hotel.andares[highestFloor + 1]) {
				fudidoEl.style.display = 'block';
				fudidoEl.innerHTML = hotel.andares[highestFloor + 1].preco;
			} else {
				fudidoEl.innerHTML = 'Sem andares';
				fudidoEl.style.display = 'none';
			}
		};
	},
	ux: () => {
		if (Object.values(file.chars).some(char => char.location === 'reception')) actions.reception.openCheckin();

		document.querySelector('#reset').addEventListener('click', reset);
		document.querySelector('#dex_bt').addEventListener('click', actions.ux.openDex);
		document.querySelector('#checkin_bt').addEventListener('click', actions.reception.checkIn);
		document.querySelector('#denied_bt').addEventListener('click', actions.reception.deny);
		document.querySelector('#checkout_bt').addEventListener('click', actions.reception.checkout);
		document.querySelector('#dex #close_dex').addEventListener('click', actions.ux.closeDex);
		document.querySelector('#dex #back_dex').addEventListener('click', actions.ux.backDex);

		load.updateTime();
		setInterval(load.updateTime, 1000);
	},
	updateTime: () => {
		const now = Date.now();
		const elapsed = now - file.start;

		const elapsedToday = elapsed % config.dayMsConversion;
		const hours = Math.floor(elapsedToday / (config.dayMsConversion / 24));
		const minutes = Math.floor((elapsedToday % (config.dayMsConversion / 24)) / (config.dayMsConversion / 1440));

		document.getElementById('clock').innerHTML = hours.toString().padStart(2, '0') +':'+ minutes.toString().padStart(2, '0');

		if (hours >= 6 && hours < 18) {
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

let sideToggle = false;

const solve = {
	hotel: (rules) => {
		return true;
	},
	guests: (rules) => {
		const ok = [];
		for (const [type, min] of Object.entries(rules)) {
			ok.push(howMany({type: type, location: 'hotel'}) >= min);
		}
	
		return ok.every(value => value);
	},
	floors: (min) => {
		const floorCount = Object.entries(file.building).length;
		return floorCount >= min;
	},
	texts: (rules) => {
		let text = '';

		Object.entries(rules).forEach(([ruleType, requirement]) => {
			if (ruleType === 'hotel') {
				text += `Esses desesperados aparecem por qualquer motivo.<br><br>`;
			} else if (ruleType === 'guests') {
				text += `Pelo menos ${Object.entries(requirement).map(([guestType, min]) => `${min} ${dex[guestType].name}`).join(', ')} devem estar hospedados.<br>`;
			} else if (ruleType === 'floors') {
				text += `Pelo menos ${requirement} andar(es) construído.<br>`;
			}
		});

		return text;
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

const ops = {
	updateChar: (id, upd = {}, del = []) => {
		if (upd.location) {
			if (file.chars[id].location) ops.updateLocation(file.chars[id].location, 'del', id);
			ops.updateLocation(upd.location, 'add', id);
		};
		
		Object.assign(file.chars[id], upd);
		del.forEach(key => delete file.chars[id][key]);

		save();
	},
	deleteChar: (id) => {
		ops.updateLocation(file.chars[id].location, 'del', id);
		
		delete file.chars[id];
		save();
	},
	updateBuilding: (id, upd = {}, del = []) => {
		Object.assign(file.building[id], upd);
		del.forEach(key => delete file.building[id][key]);
	
		save();
	},
	updateLocation: (location, action, id) => {
		if (!file.locations[location]) file.locations[location] = [];

		if (action === 'add') {
			file.locations[location].push(id);
		} else if (action === 'del') {
			file.locations[location] = file.locations[location].filter(charId => charId != id);
		}
		
		save();
	},
	updateCoins: (coins) => {
		file.coins += coins;
		save();

		document.getElementById('dinheiro').innerHTML = '🪙 ' + file.coins;
	}
}
