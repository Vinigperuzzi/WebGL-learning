main();

function main() {
    let i = 1;
    const canvas = document.querySelector("#glcanvas");
    const canvas1 = document.querySelector(`#glcanvas${i}`);//É possível colocar uma variável no nome para coleta da query

    const gl = canvas.getContext("webgl");
    const gl1 = canvas1.getContext("webgl");

    if (gl == null) {
        alert("Ocorreu algum erro na chamada de contexto do WebG.");
        return;
    }
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl1.clearColor(1.0, 1.0, 0.0, 1.0);
    gl1.clear(gl1.COLOR_BUFFER_BIT);

    const vertexData = [
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    -0.5, 0.5, 0,
    0.5, -0.5, 0,
    -0.5, 0.5, 0,
    0.5, 0.5, 0,
];

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec3 position;
void main() {
    gl_Position = vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(1, 1, 0, 1);
}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 6);

const buffer1 = gl1.createBuffer();
gl1.bindBuffer(gl1.ARRAY_BUFFER, buffer1);
gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(vertexData), gl1.STATIC_DRAW);

const vertexShader1 = gl1.createShader(gl1.VERTEX_SHADER);
gl1.shaderSource(vertexShader1, `
attribute vec3 position;
void main() {
    gl_Position = vec4(position, 1);
}
`);
gl1.compileShader(vertexShader1);

const fragmentShader1 = gl1.createShader(gl1.FRAGMENT_SHADER);
gl1.shaderSource(fragmentShader1, `
void main() {
    gl_FragColor = vec4(0, 0, 1, 1);
}
`);
gl1.compileShader(fragmentShader1);

const program1 = gl1.createProgram();
gl1.attachShader(program1, vertexShader1);
gl1.attachShader(program1, fragmentShader1);
gl1.linkProgram(program1);

const positionLocation1 = gl1.getAttribLocation(program1, `position`);
gl1.enableVertexAttribArray(positionLocation1);
gl1.vertexAttribPointer(positionLocation1, 3, gl.FLOAT, false, 0, 0);

gl1.useProgram(program1);
gl1.drawArrays(gl1.TRIANGLES, 0, 6);

}