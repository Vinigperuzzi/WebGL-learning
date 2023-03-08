"use strict";

/*Setar os códigos fonte a serem mandados para a GPU, eles serão passados como parâmetro no futuro
Para a funão que fara a criação deles. */
let vertexShaderSource = `#version 300 es
    in vec4 a_position;
    void main(){
        gl_Position = a_position;
    }
`;
let fragmentShaderSource = `#version 300 es
    precision highp float;
    out vec4 outColor;
    void main(){
        outColor = vec4(1, 0, 0.5, 1);
    }    
`;


/*Função que fará a criação dos shaders*/
function createShader(gl, type, source){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.log(gl.getShaderInfoLog(sha));
    gl.deleteShader(shader);
}

/*Função que criará o programa */
function createProgram(gl, vertexShader, fragmentShader){
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}



function main() {
    /*Pegar as queries da página html */
    let canvas = document.querySelector("#glcanvas");
    let gl = canvas.getContext("webgl2");
    if (!gl) {
        console.log('Problem loading WebGL 2 nessa máquina, talvez não haja suporte ou não haja elemento');
    }

    /*chamadas para as criações dos shades */
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    //Para a criação do programa
    let program = createProgram(gl, vertexShader, fragmentShader);

    //Passando a localização para o programa que foi criado, essa variável vem da GPU
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    //Criando o buffer para receber  o atributo
    let positionBuffer = gl.createBuffer();
    //Fazendo o bind para que o webgl use o ARRAY_BUFFER como padrão
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //Fornecendo os dados
    let positions = [
        0, 0, 0,
        0, 0.5, 0,
        0.7, 0, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    //Ativar para que se possa retirar dados dele
    gl.enableVertexAttribArray(positionAttributeLocation);

    let size = 3;           //3 componentes por interação (x, y, z)
    let type = gl.FLOAT;    // 32 bits float
    let normalize = false;  // não normalizar dados
    let stride = 0;         //Move size * sizeof(type) para pegar o próximo valor
    let offset = 0;         //começa no início do buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    //Isso faz a reestruturação do canvas para bater com o tamanho de pixels e não de -1 a 1
    //Mas deve-se incluir no html:     <script src="https://webgl2fundamentals.org/webgl/resources/webgl-utils.js"></script>

    gl.clearColor(0, 0, 0, 0,);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //Aqui é só limpar o canvas para o plot

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    let primitiveType = gl.TRIANGLES;
    let pOffset = 0;
    let count = 3;
    gl.drawArrays(primitiveType, pOffset, count);
    //Aqui pede para usar o programa, binda o array de novo, seta o tipo primitivo, o salto e a quantidade
    //de vértices a serem desenhados.
}
main();