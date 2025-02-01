const config = {
	dayMsConversion: 1000 * 60 * 60,
}
const godConfig = {
	dayMsConversion: 24000,
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
}

const decor = {
	cyan: {
		name: 'Cyan',
		price: 400,
	},
	magenta: {
		name: 'Magenta',
		price: 400,
	},
	yellow: {
		name: 'Amarelo',
		price: 700,
	},
	black: {
		name: 'Preto',
		price: 700,
	},
};

const rawFile = {
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
}
let file = structuredClone(rawFile);

const actions = {
	renderChar(type) {
		const el = document.createElement('div');

		if (file.progress?.[type]?.visit) {
			el.classList.add('char', type);
		} else {
			el.classList.add('char', 'locked');
			el.innerHTML = '🔒';
		}

		document.getElementById('chars').appendChild(el);

		return el;
	},
	street: {
		showChar: () => {
			if (howMany({location: 'street'}) >= 9) return;
	
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
				activity: 'streetWandering',
				el: actions.renderChar(type)
			});
		
			actions.street.wandering(file.chars[id]);
		},
		wandering (char) {
			const randomY = helper.rand(0, 60);
			char.el.style.transform = `translateY(${getPosition('#street').bottom - randomY}px)`;
			char.el.style.zIndex = 100 - randomY;

			sideToggle = !sideToggle;

			const right = (window.innerWidth * 2) + 30;
			const left = -window.innerWidth - 30;
			translateArr = sideToggle ? [left, right] : [right, left];
	
			const anim = anime({
				targets: char.el,
				translateX: translateArr,
				duration: helper.rand(12, 36) * 3000,
				easing: 'linear',
				complete: function(anim) {
					ops.deleteChar(char.id);
					char.el.remove();
				},
				update: function(anim) {
					const progress = Math.round(anim.progress)
					
					if (progress == 10 && char.type == 'dinosaur' && !file.stage.includes('secondChar')) {
						file.stage.push('secondChar');
						controller.save();

						actions.ux.mensagem('secondChar', () => {
							file.stage.push('secondCharEnd');
							controller.save();
						});
					}
					
					if (progress == 45 && !anim.control) {
						anim.control = true;
	
						if (checkers.canVisit(char.type)) {
							char.el.classList.add('clown');
						
							anim.pause();
	
							actions.street.visiting(char);
						}
					}
				}
			});

			if (howMany({location: 'street'}) <= 2) {
				anim.pause();
				anim.seek(anim.duration / 4);
				anim.play();
			};
		},
		visiting (char) {
			if (!file.stage.includes('firstReception')) {
				file.stage.push('firstReception');
				controller.save();
	
				actions.ux.mensagem('firstReception', () => {
					file.stage.push('firstReceptionEnd');
					controller.save();
	
					actions.reception.openCheckin()
				});
			};
	
			const order = Object.values(file.chars).filter(char => char.location === 'reception').length + 1;
	
			anime({
				targets: char.el,
				easing: 'linear',
				keyframes: [
					{
						duration: 1000,
						translateY: getPosition('#escada').bottom + 10,
						translateX: getPosition('#escada').left
					},
					{
						duration: 500,
						translateY: getPosition('.gerente').bottom
					},
					{
						duration: 500 * (5 - order),
						translateX: getPosition('.gerente').left + (order * 35),
					},
				],
				complete: () => {
					ops.updateChar(char.id, {
						activity: 'waitingForCheckin',
					});
					
					actions.reception.openCheckin();
					if (file.chars[char.id].receptionOrder != order) actions.reception.adjustLine(char);
				},
			});
	
			ops.updateChar(char.id, {
				location: 'reception',
				activity: 'goingToReception',
				receptionOrder: order
			});
		},
	},
	reception: {
		checkIn: () => {
			const first = helper.firstInLine();

			const floor = actions.building.nextOpenFloor();
			if (!floor) {
				actions.ux.mensagem('noFloorAvailable');
				return false;
			};

			if (!file.stage.includes('lastChar') && first.type == 'lord') {
				file.stage.push('lastChar');
				controller.save();

				actions.ux.mensagem('lastChar', () => {
					document.querySelector('#foto').style.display = 'flex';
				});
			}

			ops.updateChar(first.id, {
				location: 'hotel',
				roomFloor: floor.id,
				checkinTime: Date.now(),
				activity: 'goingToRoomAfterCheckin',
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
				complete: () => {
					actions.room.wandering(first, porta);
				}
			});
	
			actions.reception.closeCheckin();
			actions.reception.advanceLine();
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
			if (Object.values(file.chars).some(char => char.location === 'reception')) actions.reception.advanceLine();
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
						translateX: getPosition('#escada').left
					},
					{
						duration: 2000,
						translateY: getPosition('#street').bottom,
						scale: 1.5,
						opacity: 0
					},
				],
				complete: () => {
					ops.deleteChar(charId);
					char.el.remove();
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
			if (!file.stage.includes('firstReceptionEnd')) return;

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
		},
		advanceLine: () => {
			Object.values(file.chars)
				.filter(char => char.location === 'reception')
				.forEach(char => {
					ops.updateChar(char.id, {
						receptionOrder: char.receptionOrder - 1
					});
	
					if (char.activity == 'waitingForCheckin') actions.reception.adjustLine(char);
			});
		},
		adjustLine: (char) => {
			ops.updateChar(char.id, {
				activity: 'adjustingReceptionQueue',
			});

			anime({
				targets: char.el,
				duration: 200,
				easing: 'linear',
				translateX: getPosition('.gerente').left + (file.chars[char.id].receptionOrder * 35),
				complete: () => {
					actions.reception.openCheckin();

					ops.updateChar(char.id, {
						activity: 'waitingForCheckin',
					});
				} 
			})
		},
	},
	room: {
		wandering: (char, porta) => {
			ops.updateChar(char.id, {
				activity: 'roomWandering',
			})

			anime({
				targets: char.el,
				duration: 4000,
				delay: helper.rand(200, 2000),
				easing: 'linear',
				loop: true,
				direction: 'alternate',
				translateX: getPosition(porta).left - 35,
			});
		},
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
				controller.save();
			}
		}
	},
	ux: {
		openDex: () => {
			if (!file.stage.includes('dex')) {
				actions.ux.mensagem('dexVisit', () => {
					file.stage.push('dex');
					controller.save();

					actions.ux.openDex();
				});

				return;
			};

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
				text += '<b>Visitar:</b><br>'+ solve.texts(dex[type].show);
				text += '<b>Check-In:</b><br>'+ solve.texts(dex[type].visit);
				
				details.querySelector('.name').innerHTML = dex[type].name;
				details.querySelector('.char').classList = ['char'];
				details.querySelector('.char').classList.add(type);
				details.querySelector('.char').innerHTML = '';
				details.querySelector('.rules').innerHTML = text;
			} else {
				let text = '';
				text += '<b>Visitar:</b><br>'+ solve.texts(dex[type].show);
				text += '<b>Check-In:</b><br>'+ solve.texts(dex[type].visit);
				
				details.querySelector('.name').innerHTML = '???';
				details.querySelector('.char').classList = ['char'];
				details.querySelector('.char').classList.add('locked');
				details.querySelector('.char').innerHTML = '🔒';
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
	
					document.querySelector('.fudido button').innerHTML = hotel.andares[1].preco;
					document.querySelector('.fudido button').style.display = 'block';

					actions.ux.backDex();
				});

				return;
			}

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
		},
		goToCity: () => {
			const world = document.querySelector('#world');
			world.style.transform = 'translateX(0)';

			document.querySelector('#nav #city_bt').style.display = 'none';
			document.querySelector('#nav #hotel_bt').style.display = 'flex';

		},
		goToHotel: () => {
			const world = document.querySelector('#world');
			world.style.transform = 'translateX(-100vw)';

			document.querySelector('#nav #city_bt').style.display = 'flex';
			document.querySelector('#nav #hotel_bt').style.display = 'none';

			document.querySelector('#catalog').style.display = 'none';
		},
	}
}

const controller = {
	save: () => {
		localStorage.setItem('file', JSON.stringify(file));
	},
	load: () => {
		if (localStorage.getItem('file')) file = JSON.parse(localStorage.getItem('file'));

		if (file.version != rawFile.version) {
			controller.reset();
			return;
		}

		if (file.mode == 'god') Object.assign(config, godConfig);
		
		if (!file.stage?.includes('intro')) {
			controller.init.intro();
		} else {
			document.querySelector('#info_bar #dex_bt').style.opacity = 1;
			document.querySelector('#dex_bt').addEventListener('click', actions.ux.openDex);
		}

		controller.init.building();
		controller.init.chars();
		controller.init.ux();

		actions.street.showChar();
		actions.street.showChar();
		actions.street.showChar();

		controller.init.showCharInterval();
	},
	reset: () => {
		localStorage.removeItem('file');
		location.reload();
		throw new Error('Reset');
	},
	godMode: async () => {
		file = structuredClone(rawFile);
		file.mode = 'god';
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
						document.querySelector('#dex_bt').addEventListener('click', actions.ux.openDex);

						file.stage.push('intro');
						controller.save();
					},
				});
			});
		},
		chars: () => {
			Object.values(file.chars).filter(char => char.location === 'street').forEach(char => {
				ops.deleteChar(char.id);
			});
		
			Object.entries(file.chars).filter(([id, char]) => char.location === 'reception').forEach(([id, char]) => {
				el = actions.renderChar(char.type);
				ops.updateChar(id, {
					el: el,
					activity: 'waitingForCheckin',
				});

				el.style.transform = `translateY(${getPosition('.gerente').bottom}px) translateX(${getPosition('.gerente').left + (char.receptionOrder * 35)}px)`;
			});
	
			Object.entries(file.chars).filter(([id, char]) => char.location === 'hotel').forEach(([id, char]) => {
				el = actions.renderChar(char.type);
				file.chars[id].el = el;
	
				const floor = file.building[char.roomFloor].el;
				el.style.transform = `translateY(${getPosition(floor).bottom}px) translateX(${getPosition(floor).left + 5}px)`;
				
				actions.room.wandering(file.chars[id], floor.querySelector('.porta'));
			});
	
			const porta = document.getElementById('recepcao').querySelector('.porta');
			
			Object.entries(file.chars).filter(([id, char]) => char.location === 'checkout').forEach(([id, char]) => {
				el = actions.renderChar(char.type);
				
				ops.updateChar(id, {
					el: el,
					activity: 'waitingCheckout',
				});

				el.style.transform = `translateY(${getPosition(porta).bottom}px) translateX(${getPosition(porta).right + 15}px)`;
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
				document.getElementById('coins').innerHTML = '🪙 ' + file.coins;
				
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
			if (Object.values(file.chars).some(char => char.location === 'checkout')) actions.reception.openCheckout();

			if (file.stage.includes('dex2')) {
				document.querySelector('#info_bar #coins').style.opacity = 1;
				ops.updateCoins(0);
			}

			if (file.stage.includes('firstReception') && !file.stage.includes('firstReceptionEnd')) {
				actions.ux.mensagem('firstReception', () => {
					file.stage.push('firstReceptionEnd');
					controller.save();
	
					actions.reception.openCheckin()
				});
			};
	
			document.querySelector('#reset').addEventListener('click', controller.reset);
			document.querySelector('#godmode').addEventListener('click', controller.godMode);
			document.querySelector('#checkin_bt').addEventListener('click', actions.reception.checkIn);
			document.querySelector('#denied_bt').addEventListener('click', actions.reception.deny);
			document.querySelector('#checkout_bt').addEventListener('click', actions.reception.checkout);
			document.querySelector('#dex #close_dex').addEventListener('click', actions.ux.closeDex);
			document.querySelector('#dex #back_dex').addEventListener('click', actions.ux.backDex);
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
				document.querySelector('#sky').style.backgroundColor = 'aqua';
			} else {
				document.querySelector('#sky').style.backgroundColor = 'midnightblue';
			}
	
			actions.room.checkCheckout();
		},
		showCharInterval: () => {
			actions.street.showChar();
			setTimeout(controller.init.showCharInterval, helper.rand(2000, 8000));
		}
	}
}

window.addEventListener('load', controller.load);

const helper = {
	rand: (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min
	},
	firstInLine: () => {
		const first = Object.values(file.chars)
			.filter(char => char.activity === 'waitingForCheckin')
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
				controller.save();
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
				controller.save();

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
	const stage = document.querySelector('#stage').getBoundingClientRect();

	return {
		top: rect.top - stage.bottom,
		bottom: rect.bottom - stage.bottom,
		left: rect.left,
		right: rect.right,
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

		controller.save();
	},
	deleteChar: (id) => {
		ops.updateLocation(file.chars[id].location, 'del', id);
		
		delete file.chars[id];
		controller.save();
	},
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
			console.log('Comprando decoração...');
			
			file.decor.push(color);
			ops.updateCoins(-decor[color].price);

			const el = decor[color].el;

			el.classList.add('purchased');
			el.innerHTML = 'COMPRADO';
			el.removeEventListener('click', shop.purchaseDecor);
		}
	}
}