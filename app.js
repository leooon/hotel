document.getElementById('dinheiro').onclick = () => {
	let money = localStorage.getItem('dinheiro') || 0;
	money++;
	localStorage.setItem('dinheiro', money);
	document.getElementById('dinheiro').innerHTML = money;
}
document.getElementById('reset').onclick = () => {
	localStorage.removeItem('dinheiro');
	location.reload();
}

window.addEventListener('load', () => {
	const dinheiro = localStorage.getItem('dinheiro');

	if (dinheiro === null) {
		mensagem('introducao');
		
	} else {
		document.getElementById('dinheiro').innerHTML = dinheiro;
	}
});

const textos = {
	'introducao': [
		'Olá, você herdou essa poçilga.',
		'Benção ou maldição? Vamos descobrir.',
		'Para atrair algum desesperado, construa um quarto minimamente habitável.',
	],
}

function mensagem(fluxo) {
	const quadro = document.getElementById('quadro');
	let index = 0;

	quadro.style.display = 'block';
	quadro.innerHTML = textos[fluxo][index];

	quadro.onclick = () => {
		index++;
		if (index < textos[fluxo].length) {
			quadro.innerHTML = textos[fluxo][index];
		} else {
			quadro.style.display = 'none';
		}
	};
}

