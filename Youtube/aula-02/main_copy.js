const n = 8;
main();

function main() {
    const canvas = [];
    const gl = [];
    for (let i = 0; i<n; i++){
        canvas[i] = document.querySelector(`#glcanvas${i}`);
        gl[i] = canvas[i].getContext("webgl");
    }

    for (let i = 0; i<n; i++){
        if (gl[i] == null) {
            alert("Ocorreu algum erro na chamada de contexto do WebG.");
            return;
        }
    }
    
    gl[0].clearColor(0.0, 0.0, 1.0, 1.0);
    gl[0].clear(gl[0].COLOR_BUFFER_BIT);
    gl[1].clearColor(1.0, 1.0, 0.0, 1.0);
    gl[1].clear(gl[1].COLOR_BUFFER_BIT);
    gl[2].clearColor(0.0, 0.0, 1.0, 1.0);
    gl[2].clear(gl[2].COLOR_BUFFER_BIT);
    gl[3].clearColor(1.0, 1.0, 0.0, 1.0);
    gl[3].clear(gl[3].COLOR_BUFFER_BIT);
    gl[4].clearColor(0.0, 0.0, 1.0, 1.0);
    gl[4].clear(gl[4].COLOR_BUFFER_BIT);
    gl[5].clearColor(1.0, 1.0, 0.0, 1.0);
    gl[5].clear(gl[5].COLOR_BUFFER_BIT);
    gl[6].clearColor(0.0, 0.0, 1.0, 1.0);
    gl[6].clear(gl[6].COLOR_BUFFER_BIT);
    gl[7].clearColor(1.0, 1.0, 0.0, 1.0);
    gl[7].clear(gl[7].COLOR_BUFFER_BIT);

    const vertexData = [
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    -0.5, 0.5, 0,
    0.5, -0.5, 0,
    -0.5, 0.5, 0,
    0.5, 0.5, 0,
    ];

    const buffer = [];
    for (let i = 0; i<n; i++){
        buffer[i] = gl[i].createBuffer();
        gl[i].bindBuffer(gl[i].ARRAY_BUFFER, buffer[i]);
        gl[i].bufferData(gl[i].ARRAY_BUFFER, new Float32Array(vertexData), gl[i].STATIC_DRAW);
    }

    const vertexShader = [];
    for (let i = 0; i<n; i++){
        vertexShader[i] = gl[i].createShader(gl[i].VERTEX_SHADER);
        gl[i].shaderSource(vertexShader[i], `
        attribute vec3 position;
        void main() {
            gl_Position = vec4(position, 1);
        }
        `);
        gl[i].compileShader(vertexShader[i]);
    }

    const fragmentShader = [];
    let x = [1, 0, 1, 0, 1, 0, 1, 0]; let y = [1, 0, 1, 0, 1, 0, 1, 0]; let z = [0, 1, 0, 1, 0, 1, 0, 1];
    for (let i = 0; i<n; i++){
        fragmentShader[i] = gl[i].createShader(gl[i].FRAGMENT_SHADER);
        gl[i].shaderSource(fragmentShader[i], `
        void main() {
            gl_FragColor = vec4(${x[i]}, ${y[i]}, ${z[i]}, 1);
        }
        `);
        gl[i].compileShader(fragmentShader[i]);
    }

    const program = [];
    const positionLocation = [];
    for (let i = 0; i<n; i++){
        program[i] = gl[i].createProgram();
        gl[i].attachShader(program[i], vertexShader[i]);
        gl[i].attachShader(program[i], fragmentShader[i]);
        gl[i].linkProgram(program[i]);

        positionLocation[i] = gl[i].getAttribLocation(program[i], `position`);
        gl[i].enableVertexAttribArray(positionLocation[i]);
        gl[i].vertexAttribPointer(positionLocation[i], 3, gl[i].FLOAT, false, 0, 0);

        gl[i].useProgram(program[i]);
        gl[i].drawArrays(gl[i].TRIANGLES, 0, 6);
    }
}