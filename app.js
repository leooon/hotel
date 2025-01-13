setInterval(tick, 1000);
function tick () {
	// showChars();
	// checkVisit();
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

document.getElementById('reset').onclick = () => {
	localStorage.removeItem('dinheiro');
	localStorage.removeItem('hotel');
	location.reload();
}

window.addEventListener('load', () => {
	const dinheiro = localStorage.getItem('dinheiro');
	
	const savedHotel = localStorage.getItem('hotel');
	if (savedHotel) {
		hotel = JSON.parse(savedHotel);
	} else {
		localStorage.setItem('hotel', JSON.stringify(hotel));
	}
	renderHotel();

	hotel.streetChars = [];

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
});

const textos = {
	'introducao': [
		'Olá, você herdou essa poçilga.',
		'Benção ou maldição? Vamos descobrir.',
		'Para atrair algum desesperado, construa um quarto minimamente habitável.',
	],
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
	hotelEl.innerHTML = '';

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

		renderHotel();
	}
}

const chars = {
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
		'visit': [{'minAndares': 3}],
	}
}

let sideToggle = false;

function showChars() {
	if (hotel.streetChars.length >= 3) return;

	for (const char in chars) {
		if (checkShow(char)) renderChar(char);
		return;
	}
}

function showCharsInterval() {
	showChars();
	
	const rand = Math.floor(Math.random() * (8000 - 1000 + 1)) + 1000;
	setTimeout(showCharsInterval, rand);
}
showCharsInterval();

function checkShow(char) {
	if (!chars[char].show.length) return true;

	for (const showCondition of chars[char].show) {
		const minAndares = showCondition.minAndares;
		if (minAndares === undefined || Object.keys(hotel.andares).filter(key => hotel.andares[key].comprado).length >= minAndares) {
			return true;
		}
	}
	return false;
}

function renderChar(charName) {	
	hotel.streetChars.push(charName);
	localStorage.setItem('hotel', JSON.stringify(hotel));
	
	const charEl = document.createElement('div');
	charEl.innerHTML = '?';
	charEl.classList.add('char', charName);
	charEl.dataset.type = charName;
	document.getElementById('canvas').appendChild(charEl);

	charEl.onclick = (e) => {
		openDex(charName);
	};

	charEl.teste = 'oi';

	const ruaRect = document.getElementById('rua').getBoundingClientRect();
	const targetX = ruaRect.width;
	const randomAnimationDuration = Math.floor(Math.random() * (36 - 12 + 1) + 12);
	const randomBottom = Math.floor(Math.random() * (50 - (-10) + 1) + (-10));
	charEl.style.transform = `translateY(${ruaRect.top + randomBottom}px)`;
	charEl.style.zIndex = 100 +randomBottom;

	sideToggle = !sideToggle;
	const translateArr = sideToggle ? [-36, targetX] : [targetX, -36];

	anime({
		targets: charEl,
		translateX: translateArr,
		duration: randomAnimationDuration * 1000,
		easing: 'linear',
		complete: function(anim) {
			charEl.remove();
			const index = hotel.streetChars.indexOf(charName);
			if (index > -1) {
				hotel.streetChars.splice(index, 1);
				localStorage.setItem('hotel', JSON.stringify(hotel));
			}
		},
		update: function(anim) {
			const progress = Math.round(anim.progress)
			
			if (progress == 40 && !anim.control) {
				anim.control = true;

				if (canVisit(charName)) {
					charEl.classList.add('visiting');
					charEl.innerHTML = '';
					// chars[charType].unlocked = true;

					anim.pause();

					goToQueue(charEl);
				}
			}
		  }
	});
}

function openDex (charName) {
	const dexEl = document.getElementById('dex');
	dexEl.style.display = 'block';
	
	const p = dexEl.querySelector('p');

	const unlocked = chars[charName].unlocked;
	if (unlocked) {
		p.innerHTML = charName + '<br><br>';
	} else {
		p.innerHTML = '???<br><br>';
	}
	
	const showCondition = [];
	if (!chars[charName].show.length) showCondition.push('Sem critérios.');
	for (const condition of chars[charName].show) {
	}
	p.innerHTML += 'Aparecer: ' + showCondition.join(', ') + '<br>';

	const visitCondition = [];
	if (!chars[charName].visit.length) visitCondition.push('Sem critérios.');
	for (const condition of chars[charName].visit) {
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

function canVisit (char) {
	for (const visitCondition of chars[char].visit) {
		const minAndares = visitCondition.minAndares;
		if (minAndares === undefined || Object.keys(hotel.andares).filter(key => hotel.andares[key].comprado).length >= minAndares) {
			return true;
		}
	}
	return false;
}

function goToQueue (charEl) {
	anime({
		targets: charEl,
		keyframes: [
			{translateY: 690, translateX: 180},
			{translateY: 661},
			{translateX: 90},
		],
		duration: 4000,
		easing: 'linear',
	});
}
