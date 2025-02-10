const config = {
	dayMsConversion: 1000 * 60 * 60,
}
const godConfig = {
	dayMsConversion: 48000,
}

const textos = {
	'intro': [
		'Oi amigue, obrigado por testar o protótipo do meu joguinho!<br><br>Você é um amigue.',
		'Me chame a qualquer momento para tirar dúvidas e reclamar.<br><br> O próximo texto já faz parte do jogo.',
		'Olá. Aparentemente, você herdou essa poçilga caindo aos pedaços.<br><br>Benção ou maldição? Vamos descobrir.',
		'Algumas pessoas ("pessoas" são essas bolas horríveis na parte de baixo, use a imaginação) estão visitando a rua do hotel.<br><br>Clique na Dex para saber mais sobre elas.',
	],
	'dexVisit': [
		'Na Dex, você pode consultar todos os tipos de criaturas que visitam a rua do hotel. Cada grupo está atrás de coisas diferentes, no hotel e na vida!',
		'Parece que já há um grupo misterioso rondando o hotel! Clique no seu ícone na Dex, vamos ver do que estão atrás!',
		'Nota do Leon: no protótipo são apenas 4 classes para desbloquear, ok? Sem desespero.',
	],
	'dexVisit2': [
		'Então esse ser reservadíssimo precisa de pelo menos 1 quarto disponível para se hospedar. A ousadia!',
		'Aqui estão 1000... dinheiros? Moedas? Seu tio te deixou de herança? Seu vô? Cria aí o lore na sua cabeça.<br><br>Use para construir um andar com quartos, vamos ver a magia acontecer!',
	],
	'firstReception': [
		'Quando seu hotel tem o que um grupo está atrás, seus personagens irão querer se hospedar.<br><br>Nesse momento todos seus segredos são revelados! Lembre-se de consultar a Dex para ver as informações atualizadas!',
		'Você, como orgulhoso dono dessa espelunca, decide quem pode ou não se hospedar.<br><br>Os hóspedes ficam por alguns dias no seu hotel e te pagam um dinheirinho no final.',
	],
	'secondChar': [
		'Alguém de um novo grupo parece ter se interessado pelo hotel!<br><br>Visite a Dex para entender o que ele procura para se hospedar. A partir daqui é com você.',
		'Deus no comando ☝️',
		'Nota: Um dia completo no hotel leva 1 hora da vida real. Então encha seu hotel e vá ler um livro, te vejo daqui a pouco.',
	],
	'lastChar': [
		'Leon de novo aqui. É isso!',
		'Obrigado pelo tempo e pelo carinho, estou animado montando esse joguinho!<br><br>Tem um monte de outras mecânicas que quero implementar nas próximas versões, além de todos os personagens.',
		'Por favor POR FAVOR me dê feedbacks e ideias, principalmente sobre o que pareceu mais irritante ou entediante.',
		'Não há mais nada para fazer agora, então pode desinstalar o jogo e voltar para a vida real.<br><br>Como recompensa final, vou te mostrar a linha que estou pensando em seguir para o visual.<br><br>Até mais!',
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
		4: {
			'texto': '4.º andar',
			'preco': 10000,
			'comprado': false,
		},
		5: {
			'texto': '5.º andar',
			'preco': 15000,
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
			floors: {
				any: 1,
			},
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
			floors: {
				any: 2,
			},
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
			floors: {
				any: 3,
			},
		},
	},
	ballet: {
		name: 'Ballet Dancer',
		stay: 2,
		show: {
			floors: {
				magenta: 1,
			},
		},
		visit: {
			guests: {
				ghost: 2,
			},
		},
	},
	executive: {
		name: 'Executive',
		stay: 1,
		show: {
			guests: {
				clown: 6,
			},
		},
		visit: {
			floors: {
				any: 5,
			},
		},
	},
	sleepwalker: {
		name: 'Sleepwalker',
		stay: 3,
		show: {
			guests: {
				lord: 2,
			},
			period: 'night',
		},
		visit: {
			period: 'night',
		},
	},
	fish: {
		name: 'Sleepwalker',
		stay: 3,
		show: {
			guests: {
				executive: 1,
			},
		},
		visit: {
			guests: {
				ballet: 2,
			},
			floors: {
				cyan: 2,
			},
		},
	},
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
}
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
	floors: (rules) => {
		const ok = [];
		for (const [type, min] of Object.entries(rules)) {
			if (type == 'any') {
				const floorCount = Object.entries(file.building).length;
				ok.push(floorCount >= min);
				continue;
			};

			const floorCount = Object.entries(file.building).filter(([floor, info]) => info.decor === type).length;
			ok.push(floorCount >= min);
		}
		
		return ok.every(value => value);
	},
	period: (rules) => {
		return file.live.period === rules;
	},
	texts: (rules) => {
		let text = '';

		Object.entries(rules).forEach(([ruleType, requirement]) => {
			if (ruleType === 'hotel') {
				text += `Esses desesperados aparecem por qualquer motivo.<br><br>`;
			} else if (ruleType === 'guests') {
				text += `Pelo menos ${Object.entries(requirement).map(([guestType, min]) => `${min} ${dex[guestType].name}`).join(', ')} devem estar hospedados.<br>`;
			} else if (ruleType === 'floors') {
				Object.entries(requirement).forEach(([floorType, min]) => {
					if (floorType === 'any') {
						text += `Pelo menos ${min} andar(es) construído(s).<br>`;
					} else {
						text += `Pelo menos ${min} andar(es) decorado(s) como ${decor[floorType].name}.<br>`;
					}
				});
			} else if (ruleType === 'period') {
				const period = requirement === 'night' ? 'noturno' : 'diurno';
				text += `Aparecem apenas durante o período ${period}.<br>`;
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
				controller.save();
			}
			
			return true;
		}

		return false;
	},
	canVisit: (type) => {
		if (dex[type].visit === undefined) return false;

		const ok = [];
		for (const [condition, rule] of Object.entries(dex[type].visit)) ok.push(solve[condition](rule));

		if (ok.every(value => value)) {
			if (!file.progress[type].visit) {
				file.progress[type].visit = true;
				controller.save();

				Object.values(file.chars).filter(char => char.type === type).forEach(char => {
					const sprite = char.el.querySelector('div');
					sprite.classList.add(type);
					sprite.innerHTML = '';
				});
			}
			
			return true;
		}

		return false;
	}
}

const decor = {
	cyan: {
		name: 'Cyan',
		price: 400,
		hex: '#00FFFF',
		text: 'black',
	},
	magenta: {
		name: 'Magenta',
		price: 400,
		hex: '#FF00FF',
		text: 'white',
	},
	yellow: {
		name: 'Amarelo',
		price: 700,
		hex: '#FFFF00',
		text: 'black',
	},
	black: {
		name: 'Preto',
		price: 700,
		hex: '#000000',
		text: 'white',
	},
};

function deepCopy(obj) {
	if (obj === null || typeof obj !== 'object')
		return obj;

	if (Array.isArray(obj))
		return obj.map(deepCopy);

	const clonedObj = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key))
			clonedObj[key] = deepCopy(obj[key]);
	}

	return clonedObj;
}

const file = {
	version: 0.2,
	mode: 'normal',
	chars: {},
	progress: {},
	decor: [],
	building: {},
	locations: {},
	coins: 0,
	stage: ['noTutorial'],
	start: Date.now(),
	live: {
		nextFloor: null,
	},
	toJSON() {
		const {live, chars,...rest} = this;

		const filteredChars = Object.fromEntries(
			Object.entries(chars)
			.filter(([id, char]) => {
				if (char.location == 'street') return false;
				if (['beingKicked', 'leavingHotel'].includes(char.activity)) return false;
				return true;
			})
		);

		return {chars: filteredChars, ...rest};
	}
}

const rawFile = deepCopy(file);

class CheckIn {
	bindings() {
		document.querySelector('#checkin_bt').addEventListener('click', this.openForm.bind(this));

		document.querySelector('#checkin_form .close').addEventListener('click', this.closeForm.bind(this));
		document.querySelector('#checkin_form .deny').addEventListener('click', this.deny.bind(this));
		document.querySelector('#checkin_form .accept').addEventListener('click', this.checkIn.bind(this));
	}
	active() {
		if (!file.stage.includes('firstReceptionEnd')) return;
		document.getElementById('checkin').classList.add('active');
	}
	inactive() {
		document.getElementById('checkin').classList.remove('active');
	}
	openForm() {
		const form = document.querySelector('#checkin_form');

		if (form.style.display == 'flex') {
			form.style.display = 'none';
			return false;
		}
		form.style.display = 'flex';

		this.loadForm();
	}
	closeForm() {
		document.querySelector('#checkin_form').style.display = 'none';
	}
	loadForm() {
		const char = this.firstInLine();

		const form = document.querySelector('#checkin_form');
		
		form.querySelector('.name').innerHTML = dex[char.type].name;
		form.querySelector('.days').innerHTML = dex[char.type].stay +' Day(s)';
		form.querySelector('.rate').innerHTML = '600 Coins';
		form.querySelector('.buttons').style.display = 'block';
	}
	clearForm() {
		const form = document.querySelector('#checkin_form');

		form.querySelector('.name').innerHTML = '';
		form.querySelector('.days').innerHTML = '';
		form.querySelector('.rate').innerHTML = '';
		form.querySelector('.buttons').style.display = 'none';
	}
	checkIn() {
		const char = this.firstInLine();

		const floor = this.nextOpenFloor();
		if (!floor) {
			actions.ux.mensagem('noFloorAvailable');
			return false;
		};

		if (pushOnce(file.stage, 'lastChar') && char.type == 'lord') {
			controller.save();

			actions.ux.mensagem('lastChar', () => {
				document.querySelector('#foto').style.display = 'flex';
			});
		}

		file.chars[char.id].checkingIn(floor);
		
		this.inactive();
		this.advanceLine();
		if (howMany({activity: 'waitingForCheckin'}) + howMany({activity: 'adjustingReceptionQueue'}) == 0) {
			this.closeForm();
		} else {
			this.clearForm();
		}
	}
	deny() {
		const char = this.firstInLine();
		file.chars[char.id].denyCheckin();

		this.inactive();
		this.advanceLine();
		if (howMany({activity: 'waitingForCheckin'}) + howMany({activity: 'adjustingReceptionQueue'}) == 0) {
			this.closeForm();
		} else {
			this.clearForm();
		}
	}
	firstInLine() {
		const first = Object.values(file.chars)
			.filter(char => char.activity === 'waitingForCheckin')
			.reduce((highest, char) => {
				return !highest || char.receptionOrder < highest.receptionOrder ? char : highest;
			});

		return first;
	}
	advanceLine() {
		Object.values(file.chars)
			.filter(char => char.location === 'reception')
			.forEach(char => {
				char.receptionOrder = char.receptionOrder - 1;
				char.el.style.zIndex = 100 - (char.receptionOrder * 2);

				if (char.activity === 'waitingForCheckin')
					char.adjustingLine();
		});
	}
	nextOpenFloor() {
		const floors = Object.values(file.building).filter(floor => floor.guests < 4);

		if (!floors.length) return false;

		const floor = floors.reduce((lowest, floor) => {
			return !lowest || floor.id < lowest.id ? floor : lowest;
		});

		return floor;
	}
}

class Game {
	constructor() {
		this.checkIn = new CheckIn();
	}
}

const actions = {
	events: {
		showChar: () => {
			if (howMany({location: 'street'}) >= 9) return;
	
			const allowedTypes = [];
			for (const type in dex) {
				if (checkers.canShow(type)) allowedTypes.push(type);
			}
	
			const type = allowedTypes[helper.rand(0, allowedTypes.length - 1)];
		
			const id = Object.keys(file.chars).length ? Math.max(...Object.values(file.chars).map(char => char.id)) + 1 : 1;
			file.chars[id] = {};
			
			const char = new Char({id: id, type: type, location: 'street'});
			file.chars[id] = char;
			controller.save();
			
			char.render();
			
			char.streetWandering(sideToggle);
			sideToggle = !sideToggle;
		},
		checkCheckout: () => {
			Object.values(file.chars)
				.filter(char => char.location === 'hotel')
				.forEach(char => {
					if (Date.now() - char.checkinTime > dex[char.type].stay * config.dayMsConversion) {
						char.checkingOut();
					}
				});
		}
	},
	reception: {
		checkout: () => {
			const char = Object.values(file.chars)
				.filter(char => char.activity === 'waitingCheckout')
				.reduce((lowest, current) => {
					return !lowest || current.checkoutOrder > lowest.checkoutOrder ? current : lowest;
				}, null);
			char.leaving();

			ops.updateCoins(600);

			if (!howMany({activity: 'waitingCheckout'}))
				actions.reception.closeCheckout();
		},
		openCheckout: () => {
			document.getElementById('checkout_bt').classList.add('active');
		},
		closeCheckout: () => {
			document.getElementById('checkout_bt').classList.remove('active');
		},
		checkOutZIndex: () => {
			Object.entries(file.chars)
				.filter(([id, char]) => char.location === 'checkout')
				.sort((a, b) => b[1].checkoutTime - a[1].checkoutTime)
				.forEach(([id, char], index) => {
					file.chars[id].checkoutOrder = index;
					file.chars[id].zIndex(index);
				});
		},
	},
	ux: {
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
		},
		goToCity: () => {
			const world = document.querySelector('#world');
			world.style.transform = 'translateX(0)';

			document.querySelector('#nav #city_bt').style.display = 'none';
			document.querySelector('#nav #hotel_bt').style.display = 'flex';

			document.querySelector('#sky').classList.add('city');
		},
		goToHotel: () => {
			const world = document.querySelector('#world');
			world.style.transform = 'translateX(-100vw)';

			document.querySelector('#nav #city_bt').style.display = 'flex';
			document.querySelector('#nav #hotel_bt').style.display = 'none';

			document.querySelector('#catalog').style.display = 'none';
			
			document.querySelector('#sky').classList.remove('city');
		},
	},
	dex: {
		openDex: () => {
			if (!file.stage.includes('dex')) {
				actions.ux.mensagem('dexVisit', () => {
					file.stage.push('dex');
					controller.save();

					actions.dex.openDex();
				});

				return;
			};

			const dexEl = document.getElementById('dex');

			if (dexEl.style.display === 'block') {
				actions.dex.closeDex();
				return false;
			}

			dexEl.style.display = 'block';
			const list = dexEl.querySelector('.list');
			list.style.display = 'grid';
			list.innerHTML = '';

			Object.entries(dex).forEach(([type, entry]) => {
				const div = document.createElement('div');
				const char = document.createElement('div');
				char.classList.add('char');
				const sprite = document.createElement('div');
				sprite.classList.add('sprite');

				char.appendChild(sprite);

				if (file.progress?.[type]?.show) {
					char.classList.add('showed');
					char.addEventListener('click', () => {
						actions.dex.openDexDetail(type);
					})
				}

				if (file.progress?.[type]?.visit) {
					sprite.classList.add(type);
				} else {
					sprite.classList.add('locked');
					sprite.innerHTML = '🔒';
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

			let text = '';
			if (file.progress?.[type]?.visit) {
				text += '<b>Visitar:</b><br>'+ solve.texts(dex[type].show);
				text += '<b>Check-In:</b><br>'+ solve.texts(dex[type].visit);
				
				details.querySelector('.name').innerHTML = dex[type].name;
				details.querySelector('.char div.sprite').classList.replace(details.querySelector('.char div.sprite').classList.item(1), type);
				details.querySelector('.char div').innerHTML = '';
				details.querySelector('.rules').innerHTML = text;
			} else {
				text += '<b>Visitar:</b><br>'+ solve.texts(dex[type].show);
				text += '<b>Check-In:</b><br>'+ solve.texts(dex[type].visit);
				
				details.querySelector('.name').innerHTML = '???';
				details.querySelector('.char div.sprite').classList.replace(details.querySelector('.char div.sprite').classList.item(1), 'locked');
				details.querySelector('.char div').innerHTML = '🔒';
				details.querySelector('.rules').innerHTML = text;
			}
		},
		backDex: () => {
			if (!file.stage.includes('dex2')) {
				file.stage.push('dex2');
				controller.save();

				document.querySelector('#dex .list').style.display = 'none';
				document.querySelector('#dex #close_dex').style.display = 'none';
				document.querySelector('#dex .details').style.display = 'none';
				document.querySelector('#dex #back_dex').style.display = 'none';

				actions.ux.mensagem('dexVisit2', () => {
					ops.updateCoins(1000);

					const bt = document.querySelector('#info_bar #coins');
					anime({
						targets: bt,
						easing: 'linear',
						keyframes: [
							{
								duration: 200,
								scale: 1.5,
								opacity: 1
							},
							{
								duration: 200,
								scale: 1
							}
						],
					});
	
					document.querySelector('.fudido button').style.display = 'block';

					actions.dex.backDex();
				});

				return;
			}

			document.querySelector('#dex .list').style.display = 'grid';
			document.querySelector('#dex #close_dex').style.display = 'inline';

			document.querySelector('#dex .details').style.display = 'none';
			document.querySelector('#dex #back_dex').style.display = 'none';
		},
	},
	roomInfo: {
		close: () => {
			document.querySelector('#room_info').style.display = 'none';
		}
	}
}

const controller = {
	save: () => {
		localStorage.setItem('file', JSON.stringify(file));
	},
	load: () => {
		if (localStorage.getItem('file'))
			Object.assign(file, JSON.parse(localStorage.getItem('file')));

		if (file.version != rawFile.version) {
			controller.reset();
			return;
		}

		if (file.mode == 'god') Object.assign(config, godConfig);

		window.game = new Game();
		
		if (!file.stage?.includes('intro')) {
			controller.init.intro();
		} else {
			document.querySelector('#info_bar #dex_bt').style.opacity = 1;
			document.querySelector('#dex_bt').addEventListener('click', actions.dex.openDex);
		}

		controller.init.building();
		controller.init.chars();
		controller.init.ux();

		controller.init.showCharInterval();
	},
	reset: () => {
		localStorage.removeItem('file');
		location.reload();
		throw new Error('Reset');
	},
	godMode: () => {
		Object.assign(file, rawFile);
		file.mode = 'god';
		file.stage.push('intro', 'dex', 'dex2', 'firstReception', 'firstReceptionEnd', 'secondChar', 'secondCharEnd', 'lastChar');
		file.coins = 10000;
		file.start = Date.now(),
		controller.save();
		location.reload();
	},
	init: {
		intro: () => {
			actions.ux.mensagem('intro', () => {
				const bt = document.querySelector('#info_bar #dex_bt');

				anime({
					targets: bt,
					easing: 'linear',
					keyframes: [
						{
							duration: 200,
							scale: 1.5,
							opacity: 1
						},
						{
							duration: 200,
							scale: 1
						}
					],
					complete: () => {
						document.querySelector('#dex_bt').addEventListener('click', actions.dex.openDex);

						file.stage.push('intro');
						controller.save();
					},
				});
			});
		},
		building: () => {
			let highestFloor = 0;

			Object.entries(file.building).forEach(([id, value]) => {
				file.building[id] = new Floor(value);
				file.building[id].load();

				highestFloor = id;
			});
			
			new Floor({id: parseInt(highestFloor) + 1}).attachFudido();
		},
		chars: () => {
			Object.entries(file.chars).forEach(([id, value]) => {
				file.chars[id] = new Char(value);
				file.chars[id].load();
			})

			actions.events.showChar();
			actions.events.showChar();
			actions.events.showChar();

			if (howMany({activity: 'waitingForCheckin'})) game.checkIn.active();

			if (howMany({activity: 'waitingCheckout'})) {
				actions.reception.checkOutZIndex();
				actions.reception.openCheckout();
			} 
		},
		ux: () => {
			const canvas = document.querySelector('#canvas');
			canvas.scrollTop = canvas.scrollHeight;

			if (file.stage.includes('dex2')) {
				document.querySelector('#info_bar #coins').style.opacity = 1;
				ops.updateCoins(0);
			}

			if (file.stage.includes('firstReception') && !file.stage.includes('firstReceptionEnd')) {
				actions.ux.mensagem('firstReception', () => {
					file.stage.push('firstReceptionEnd');
					controller.save();
	
					actions.checkIn.active()
				});
			};
	
			document.querySelector('#reset').addEventListener('click', controller.reset);
			document.querySelector('#godmode').addEventListener('click', controller.godMode);

			game.checkIn.bindings();

			document.querySelector('#checkout_bt').addEventListener('click', actions.reception.checkout);
			document.querySelector('#dex #close_dex').addEventListener('click', actions.dex.closeDex);
			document.querySelector('#dex #back_dex').addEventListener('click', actions.dex.backDex);
			document.querySelector('#room_info .close').addEventListener('click', actions.roomInfo.close);
			document.querySelector('#nav #city_bt').addEventListener('click', actions.ux.goToCity);
			document.querySelector('#nav #hotel_bt').addEventListener('click', actions.ux.goToHotel);

			document.querySelector('#foto').addEventListener('click', () => {
				document.querySelector('#foto').style.display = 'none';
			});

			shop.bindings();
	
			controller.init.updateTime();
			setInterval(controller.init.updateTime, 1000);
		},
		updateTime: () => {
			const now = Date.now();
			const elapsed = now - file.start;
	
			const elapsedToday = elapsed % config.dayMsConversion;
			const hours = Math.floor(elapsedToday / (config.dayMsConversion / 24));
			const minutes = Math.floor((elapsedToday % (config.dayMsConversion / 24)) / (config.dayMsConversion / 1440));
	
			document.getElementById('clock').innerHTML = hours.toString().padStart(2, '0') +':'+ minutes.toString().padStart(2, '0');
	
			if (hours >= 6 && hours < 18) {
				file.live.period = 'day';
				document.querySelector('#sky #day').style.opacity = 1;
				document.querySelector('#sky #night').style.opacity = 0;
			} else {
				file.live.period = 'night';
				document.querySelector('#sky #day').style.opacity = 0;
				document.querySelector('#sky #night').style.opacity = 1;
			}
	
			actions.events.checkCheckout();
		},
		showCharInterval: () => {
			actions.events.showChar();
			setTimeout(controller.init.showCharInterval, helper.rand(2000, 8000));
		}
	}
}

window.addEventListener('load', controller.load);

const helper = {
	rand: (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min
	},
}

let sideToggle = false;

function getPosition(selector) {
	const el = typeof selector === 'string' ? document.querySelector(selector) : selector;

	const rect = el.getBoundingClientRect();
	const world = document.querySelector('#world').getBoundingClientRect();
	const hotel = document.querySelector('#hotel').getBoundingClientRect();

	return {
		top: rect.top - world.bottom,
		bottom: rect.bottom - world.bottom,
		left: rect.left - hotel.left,
		right: rect.right - hotel.left,
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
	updateBuilding: (id, upd = {}, del = []) => {
		Object.assign(file.building[id], upd);
		del.forEach(key => delete file.building[id][key]);
	
		controller.save();
	},
	updateLocation: (location, action, id) => {
		if (!file?.locations[location]) file.locations[location] = [];

		if (action === 'add') {
			file.locations[location].push(id);
		} else if (action === 'del') {
			file.locations[location] = file.locations[location].filter(charId => charId != id);
		}
		
		controller.save();
	},
	updateCoins: (coins) => {
		file.coins += coins;
		controller.save();

		document.getElementById('coins').innerHTML = '🪙 ' + file.coins;
	}
}

const shop = {
	bindings: () => {
		document.querySelector('#decoration').addEventListener('click', shop.openCatalog);
		document.querySelector('#catalog #close_catalog').addEventListener('click', shop.closeCatalog);
	},
	openCatalog : () => {
		const catalog = document.querySelector('#catalog');

		if (catalog.style.display == 'block') {
			catalog.style.display = 'none';
			return
		}
		catalog.style.display = 'block';

		const list = catalog.querySelector('.list');
		list.innerHTML = '';

		Object.entries(decor).forEach(([color, entry]) => {
			const item = document.createElement('div');
			item.classList.add(color);
			decor[color].el = item;

			list.appendChild(item);

			if (file.decor.includes(color)) {
				item.classList.add('purchased');
				item.innerHTML = 'COMPRADO';
			} else {
				item.innerHTML = '🪙 '+ entry.price;
				item.color = color;
				item.addEventListener('click', shop.purchaseDecor);
			}
		})
	},
	closeCatalog : () => {
		const catalog = document.querySelector('#catalog');
		catalog.style.display = 'none';
	},
	purchaseDecor: (e) => {
		const color = e.target.color;

		if (file.coins >= decor[color].price) {
			file.decor.push(color);
			ops.updateCoins(-decor[color].price);

			const el = decor[color].el;

			el.classList.add('purchased');
			el.innerHTML = 'COMPRADO';
			el.removeEventListener('click', shop.purchaseDecor);
		}
	}
}

class Floor {
	constructor(props) {
		props.guests = props.guests || 0;

		Object.assign(this, props);

		return this.proxy();
	}

	proxy() {
		const proxy = {
			get(target, prop, receiver) {
				if (prop === 'target')
						return target;
				return Reflect.get(target, prop, receiver);
			},
			set: (target, prop, value) => {
				target[prop] = value;
				controller.save();
				
				return true;
			},
			deleteProperty: (target, prop) => {
				delete target[prop];
				controller.save();
				
				return true;
			}
		}
		
		return new Proxy(this, proxy);
	}

	toJSON() {
		const dontSave = ['el'];
	
		const obj = {};
		Object.keys(this).forEach(prop => {
			if (this[prop] instanceof Date) obj[prop] = this[prop].getTime();

			if (!dontSave.includes(prop))
				obj[prop] = this[prop];
		});
	
		return obj;
	}

	attach() {
		const hotelEl = document.getElementById('hotel');

		const template = document.querySelector('#andar').content;
		const el = template.firstElementChild.cloneNode(true);

		el.addEventListener('click', (e) => {
			e.preventDefault();
			this.openInfo();
			console.log(this.target);
		});

		el.querySelector('p').innerHTML = hotel.andares[this.id].texto;

		hotelEl.appendChild(el);

		this.el = el;
	}

	attachFudido() {
		const hotelEl = document.getElementById('hotel');

		const template = document.querySelector('#andar-fudido').content;
		const el = template.firstElementChild.cloneNode(true);

		if (hotel.andares[this.id]) {
			const button = el.querySelector('button');
			button.innerHTML = hotel.andares[this.id].preco;
			button.addEventListener('click', this.purchase.bind(this));
			
			if (hotel.andares[this.id] && file.stage.includes('intro')) button.style.display = 'block';
		}
			
		hotelEl.appendChild(el);
		this.el = el;

		file.live.nextFloor = this;
	}

	load() {
		this.attach();
		
		if (this.decor) this.changeDecor(this.decor);

		this.guests = howMany({roomFloor: this.id});
	}

	purchase() {
		const preco = hotel.andares[this.id].preco;
		
		if (file.coins < preco) return false;
		ops.updateCoins(-preco);

		file.building[this.id] = this;
		this.el.remove();
		this.attach();

		new Floor({id: this.id + 1}).attachFudido();

		document.querySelector('#canvas').scrollTop += this.el.offsetHeight;
	}

	openInfo() {
		const info = document.querySelector('#room_info');
		info.style.display = 'block';

		info.querySelector('.name').innerHTML = hotel.andares[this.id].texto;

		info.querySelector('.decor').innerHTML = '';
		Object.entries(decor)
			.filter(([id]) => file.decor.includes(id))
			.forEach(([id, decor]) => {
				const el = document.createElement('div');
				el.style.backgroundColor = decor.hex;
				
				el.addEventListener('click', (e) => {
					e.preventDefault();
					this.changeDecor(id);
					actions.roomInfo.close();
				});

				info.querySelector('.decor').appendChild(el);
		})
	}

	changeDecor(id) {
		this.el.style.backgroundColor = decor[id].hex;
		this.el.querySelector('p').style.color = decor[id].text;

		this.decor = id;
	}
}

class Char {
	constructor(props) {
		Object.assign(this, props);

		return this.proxy();
	}

	proxy() {
		const proxy = {
			get(target, prop, receiver) {
				if (prop === 'target')
						return target;
				return Reflect.get(target, prop, receiver);
			},
			set: (target, prop, value) => {
				target[prop] = value;
				controller.save();
				
				return true;
			},
			deleteProperty: (target, prop) => {
				delete target[prop];
				controller.save();
				
				return true;
			}
		}
		
		return new Proxy(this, proxy);
	}

	toJSON() {
		const dontSave = ['el'];
	
		const obj = {};
		Object.keys(this).forEach(prop => {
			if (this[prop] instanceof Date) obj[prop] = this[prop].getTime();

			if (!dontSave.includes(prop))
				obj[prop] = this[prop];
		});
	
		return obj;
	}

	delete() {
		this.el.remove();
		delete file.chars[this.id];

		controller.save();
	}

	render() {
		const el = document.createElement('div');
		el.classList.add('char');

		el.addEventListener('click', (e) => {
			e.preventDefault();
			this.tag('ai');
			console.log(this.target);
		});

		const sprite = document.createElement('div');
		sprite.classList.add('sprite');

		if (file.progress?.[this.type]?.visit) {
			sprite.classList.add(this.type);
		} else {
			sprite.classList.add('locked');
			sprite.innerHTML = '🔒';
		}
		
		el.appendChild(sprite);
		el.sprite = sprite;

		document.getElementById('chars').appendChild(el);
		this.el = el;
	}

	zIndex(index) {
		this.el.style.zIndex = index;
	}

	load() {
		this.render();

		if (this.checkinTime) this.checkinTime = new Date(this.checkinTime);
		if (this.checkoutTime) this.checkoutTime = new Date(this.checkoutTime);

		if (['goingToReception', 'adjustingReceptionQueue', 'waitingForCheckin'].includes(this.activity)) {
			this.activity = 'waitingForCheckin';

			const yPos = getPosition('.gerente').bottom;
			const xPos = getPosition('.gerente').left + (this.receptionOrder * 15);
			this.el.style.transform = `translateY(${yPos}px) translateX(${xPos}px)`;
			this.el.style.zIndex = 100 - (this.receptionOrder * 2);
		}

		if (['goingToRoomAfterCheckin', 'roomWandering'].includes(this.activity)) {
			this.activity = 'roomWandering';

			const yPos = getPosition(file.building[this.roomFloor].el.querySelector('.porta')).bottom;
			const xPos = getPosition(file.building[this.roomFloor].el).left + 5;
			this.el.style.transform = `translateY(${yPos}px) translateX(${xPos}px)`;
			this.el.sprite.classList.remove('toRight');

			this.roomWandering();
		}

		if (['goingToCheckout', 'waitingCheckout'].includes(this.activity)) {
			this.activity = 'waitingCheckout';

			const yPos = getPosition('#recepcao').bottom;
			const xPos = getPosition('#recepcao .porta').right + 15;
			this.el.style.transform = `translateY(${yPos}px) translateX(${xPos}px)`;
			this.el.sprite.classList.add('toRight');
		}
	}

	tag(text) {
		const tag = document.createElement('div');
		tag.classList.add('tag');
		tag.innerHTML = text;

		this.el.appendChild(tag);

		anime({
			targets: tag,
			opacity: 0,
			translateY: -30,
			duration: 600,
			easing: 'linear',
			complete: () => {
				tag.remove();
			}
		})
	}

	streetWandering(sideToggle) {
		this.location = 'street';
		this.activity = 'streetWandering';

		const randomY = helper.rand(0, 60);
		this.el.style.transform = `translateY(${getPosition('#street').bottom - randomY}px)`;
		this.el.style.zIndex = 100 - randomY;

		if (sideToggle) this.el.sprite.classList.add('toRight');
		const left = -window.innerWidth - 50;
		const right = window.innerWidth * 2;
		const translateArr = sideToggle ? [left, right] : [right, left];

		const anim = anime({
			targets: this.el,
			translateX: translateArr,
			duration: helper.rand(12, 36) * 3000,
			easing: 'linear',
			complete: () => {
				this.delete()
			},
			update: (anim) => {
				const progress = Math.round(anim.progress)
				
				if (progress == 10 && this.type == 'dinosaur' && pushOnce(file.stage, 'secondChar')) {
					controller.save();
					
					actions.ux.mensagem('secondChar', () => {
						file.stage.push('secondCharEnd');
						controller.save();
					});
				}
				
				if (
					progress >= 45
					&& setOnce(anim, 'checkVisit')
					&& howMany({location: 'reception'}) < 8
					&& checkers.canVisit(this.type)
				) {
					anim.pause();
					this.visiting();
				}
			}
		});

		if (howMany({location: 'street'}) <= 2) {
			anim.pause();
			anim.seek(anim.duration / 4);
			anim.play();
		};
	}

	visiting() {
		if (pushOnce(file.stage, 'firstReception')) {
			controller.save();

			actions.ux.mensagem('firstReception', () => {
				file.stage.push('firstReceptionEnd');
				controller.save();

				if (Object.values(file.chars).some(char => char.activity == 'waitingForCheckin'))
					game.checkIn.active();
			});
		};

		this.receptionOrder = howMany({location: 'reception'}) + 1,
		this.el.style.zIndex = 100 - (this.receptionOrder * 2);
		this.location = 'reception';
		this.activity = 'goingToReception';

		const animParam = {
			escada: getPosition('#escada').left,
			finalPos: getPosition('.gerente').left + (this.receptionOrder * 15),
			originalReceptinOrder: this.receptionOrder,
		}
		animParam.finalTime = Math.abs(animParam.finalPos - animParam.escada) * 10;

		anime({
			targets: this.el,
			easing: 'linear',
			keyframes: [
				{
					duration: 1000,
					translateY: getPosition('#escada').bottom + 10,
					translateX: animParam.escada
				},
				{
					duration: 500,
					translateY: getPosition('.gerente').bottom
				},
				{
					duration: animParam.finalTime,
					translateX: animParam.finalPos,
				},
			],
			update: (anim) => {
				if (anim.currentTime > 1500 && setOnce(anim, 'naEscada'))
					this.el.sprite.classList.remove('toRight');
			},
			complete: () => {
				this.activity = 'waitingForCheckin';

				if (animParam.originalReceptinOrder === 1 && file.stage.includes('firstReceptionEnd')) game.checkIn.active();
				if (this.receptionOrder < animParam.originalReceptinOrder) this.adjustingLine();
			},
		});
	}

	adjustingLine() {
		this.activity = 'adjustingReceptionQueue';

		const originalReceptinOrder = this.receptionOrder;
		
		anime({
			targets: this.el,
			duration: 150,
			easing: 'linear',
			translateX: getPosition('.gerente').left + (this.receptionOrder * 15),
			complete: () => {
				this.activity = 'waitingForCheckin';

				if (originalReceptinOrder === 1 && file.stage.includes('firstReceptionEnd')) {
					game.checkIn.active();
					game.checkIn.loadForm();
				}
				if (this.receptionOrder < originalReceptinOrder) this.adjustingLine();
			}
		})
	}

	denyCheckin() {
		this.activity = 'beingKicked';
		delete this.location;
		
		this.el.style.zIndex = 99999;
		
		anime({
			targets: this.el,
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
			complete: () => {
				this.delete()
			}
		});
	}

	checkingIn(floor) {
		this.location = 'hotel',
		this.roomFloor = floor.id,
		this.checkinTime = Date.now(),
		this.activity = 'goingToRoomAfterCheckin',
		
		delete this.receptionOrder;
		this.el.style.zIndex = 97;

		file.building[floor.id].guests++;

		const porta = floor.el.querySelector('.porta');
	
		anime({
			targets: this.el,
			easing: 'linear',
			delay: 200,
			keyframes: [
				{
					duration: 1400,
					translateX: getPosition('#recepcao .porta').left,
				}, {
					duration: 500,
					opacity: 0,
				}, {
					duration: 500,
					opacity: 1,
					translateY: [getPosition(porta).bottom, getPosition(porta).bottom],
				}, {
					duration: 1000,
					translateX: getPosition(floor.el).left + 5
				}
			],
			begin: () => {
				this.el.sprite.classList.add('toRight');
			},
			update: (anim) => {
				if (anim.currentTime > 2400 && setOnce(anim, 'roomArive'))
					this.el.sprite.classList.remove('toRight');
			},
			complete: () => {
				this.roomWandering();
			}
		});
	}

	roomWandering() {
		this.activity = 'roomWandering';

		const porta = file.building[this.roomFloor].el.querySelector('.porta');

		anime({
			targets: this.el,
			duration: 4000,
			delay: helper.rand(200, 2000),
			easing: 'linear',
			loop: true,
			direction: 'alternate',
			translateX: getPosition(porta).left - 35,
			loopBegin: () => {
				this.el.sprite.classList.toggle('toRight');
			}
		});
	}

	checkingOut() {
		const door = file.building[this.roomFloor].el.querySelector('.porta');
		const reception = document.getElementById('recepcao').querySelector('.porta');
		
		file.building[this.roomFloor].guests--;
		
		this.location = 'checkout';
		this.activity = 'goingToCheckout';
		delete this.checkinTime;
		delete this.roomFloor;

		this.checkoutTime = new Date;

		anime.remove(this.el);
		anime({
			targets: this.el,
			easing: 'linear',
			keyframes: [
				{
					duration: 1400,
					translateX: getPosition(door).left,
				}, {
					duration: 500,
					opacity: 0,
				}, {
					duration: 500,
					opacity: 1,
					translateY: [getPosition(reception).bottom, getPosition(reception).bottom],
				}, {
					duration: 500,
					translateX: getPosition(reception).right + 15,
				}
			],
			begin: () => {
				this.el.sprite.classList.add('toRight');
			},
			update: (anim) => {
				if (anim.currentTime > 1900 && setOnce(anim, 'noElevador'))
					actions.reception.checkOutZIndex();
			},
			complete: () => {
				this.activity = 'waitingCheckout';
				actions.reception.openCheckout();
			}
		});
	}

	leaving() {
		delete this.location;
		this.activity = 'leavingHotel';

		this.tag('+600');
		
		anime({
			targets: this.el,
			easing: 'linear',
			keyframes: [
				{
					delay: 200,
					duration: 1000,
					translateX: getPosition('#escada').left
				},
				{
					duration: 2000,
					translateY: getPosition('#street').bottom,
					scale: 1.5,
					opacity: 0
				},
			],
			begin: () => {
				this.el.sprite.classList.remove('toRight');
			},
			complete: () => {
				this.delete();
			}
		});
	}
}

document.addEventListener('touchstart', function (e) {
	if (e.touches.length > 1) e.preventDefault();
}, {passive: false});
document.addEventListener('gesturestart', function (e) {
	e.preventDefault();
}, {passive: false});
document.addEventListener('dblclick', function (e) {
	e.preventDefault();
});

function setCanvasHeight() {
	const canvas = document.getElementById('canvas');
	canvas.style.height = window.innerHeight + 'px';
	canvas.scrollTop = canvas.scrollHeight;
}
window.addEventListener('load', waitForGod);
function waitForGod() {
	setTimeout(setCanvasHeight, 1000);
}

function setOnce(who, what) {
	if (!who[what]) {
		who[what] = true;
		return true;
	}
	return false;
}
function pushOnce(who, what) {
	if (!who.includes(what)) {
		who.push(what);
		return true;
	}
	return false;
}