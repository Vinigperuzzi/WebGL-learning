main();

function main() {
    let n = 4;
    const canvas = [];
    const gl = [];
    for (let i = 0; i<n; i++){
        canvas[i] = document.querySelector(`#glcanvas${i}`);
        gl[i] = canvas[i].getContext("webgl");
    }

    if (!gl[0] || !gl[1] || !gl[2] || !gl[3]) {
        alert("Ocorreu algum erro na chamada de contexto do WebG.");
        return;
    }

    for (let i = 0; i<n; i++){
        gl[i].clearColor(0.0, 0.117, 0.098, 1.0);
        gl[i].clear(gl[i].COLOR_BUFFER_BIT);
    }

    const vertexTData = [
    -0.6666, 0.5, 0,
    -0.6666, 0.6666, 0,
    0.6666, 0.5, 0,
    -0.6666, 0.6666, 0,
    0.6666, 0.5, 0,
    0.6666, 0.6666, 0,
    0.2, 0.6, 0,
    -0.2, 0.6, 0,
    -0.2, -0.6666, 0,
    0.2, 0.6, 0,
    -0.2, -0.6666, 0,
    0.2, -0.6666, 0
    ];

    const vertexOData = [
        -0.6666, 0.6666, 0,
        0.6666, 0.6666, 0,
        -0.6666, -0.6666, 0,
        0.6666, 0.6666, 0,
        -0.6666, -0.6666, 0,
        0.6666, -0.6666, 0,
        -0.4, 0.4, 0,
        0.4, 0.4, 0,
        -0.4, -0.4, 0,
        0.4, 0.4, 0,
        -0.4, -0.4, 0,
        0.4, -0.4, 0,
        ];

    const colorOData = [
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.0, 0.117, 0.098,
        0.0, 0.117, 0.098,
        0.0, 0.117, 0.098,
        0.0, 0.117, 0.098,
        0.0, 0.117, 0.098,
        0.0, 0.117, 0.098,
    ];

    const colorTData = [
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
        0.3215, 0.0313, 0.0784,
    ];

    const positionBuffer = [];
    for (let i = 0; i<n; i++){
        positionBuffer[i] = gl[i].createBuffer();
        gl[i].bindBuffer(gl[i].ARRAY_BUFFER, positionBuffer[i]);
        if (i % 2 != 0){
            gl[i].bufferData(gl[i].ARRAY_BUFFER, new Float32Array(vertexOData), gl[i].STATIC_DRAW);
        } else {
            gl[i].bufferData(gl[i].ARRAY_BUFFER, new Float32Array(vertexTData), gl[i].STATIC_DRAW);
        }
    }

    const colorBuffer = [];
    for (let i = 0; i<n; i++){
        colorBuffer[i] = gl[i].createBuffer();
        gl[i].bindBuffer(gl[i].ARRAY_BUFFER, colorBuffer[i]);
        if (i % 2 != 0){
            gl[i].bufferData(gl[i].ARRAY_BUFFER, new Float32Array(colorOData), gl[i].STATIC_DRAW);
        } else {
            gl[i].bufferData(gl[i].ARRAY_BUFFER, new Float32Array(colorTData), gl[i].STATIC_DRAW);
        }
    }

    const vertexShader = [];
    for (let i = 0; i<n; i++){
        vertexShader[i] = gl[i].createShader(gl[i].VERTEX_SHADER);
        gl[i].shaderSource(vertexShader[i], `
        precision mediump float;
        attribute vec3 position;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
            vColor = color;
            gl_Position = vec4(position, 1);
        }
        `);
        gl[i].compileShader(vertexShader[i]);
    }

    const fragmentShader = [];
    for (let i = 0; i<n; i++){
        fragmentShader[i] = gl[i].createShader(gl[i].FRAGMENT_SHADER);
        gl[i].shaderSource(fragmentShader[i], `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1);
        }
        `);
        gl[i].compileShader(fragmentShader[i]);
    }

    const program = [];
    for (let i = 0; i<n; i++){
        program[i] = gl[i].createProgram();
        gl[i].attachShader(program[i], vertexShader[i]);
        gl[i].attachShader(program[i], fragmentShader[i]);
        gl[i].linkProgram(program[i]);
    }

    const positionLocation = [];
    const colorLocation = [];
    for (let i = 0; i<n; i++){
        positionLocation[i] = gl[i].getAttribLocation(program[i], `position`);
        gl[i].enableVertexAttribArray(positionLocation[i]);
        gl[i].bindBuffer(gl[i].ARRAY_BUFFER, positionBuffer[i]);
        gl[i].vertexAttribPointer(positionLocation[i], 3, gl[i].FLOAT, false, 0, 0);

        colorLocation[i] = gl[i].getAttribLocation(program[i], `color`);
        gl[i].enableVertexAttribArray(colorLocation[i]);
        gl[i].bindBuffer(gl[i].ARRAY_BUFFER, colorBuffer[i]);
        gl[i].vertexAttribPointer(colorLocation[i], 3, gl[i].FLOAT, false, 0, 0);
    }
    console.log('Veio até aqui');
    for (let i = 0; i<n; i++){
        gl[i].useProgram(program[i]);
        gl[i].drawArrays(gl[i].TRIANGLES, 0, 12);
    }
}