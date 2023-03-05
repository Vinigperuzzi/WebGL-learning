const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGl not suported');
}

alert(`Tá rodando certinho por aqui`)