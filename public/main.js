const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGl not superted');
}

alert(`Everithings's peacy hear with WebGL`)