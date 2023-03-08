// original code from https://webgl2fundamentals.org/webgl/lessons/webgl-2d-scale.html
// updated code with matrices from https://webgl2fundamentals.org/webgl/lessons/webgl-2d-matrices.html
// challenge: 
//      show two F without duplicating the mesh
//      animate when button clicked

"use strict";

var gl = null;
var program = null;
var vao = null;
var resolutionUniformLocation = null;
var colorLocation = null;
var matrixLocation = null;
var shapes = [{
    translation: [150, 150],
    rotation: 0,
    scale: [1, 1],
    color: [Math.random(), Math.random(), Math.random(), 1]
}, {
    translation: [155, 155],
    rotation: 0,
    scale: [1, 1],
    color: [Math.random(), Math.random(), Math.random(), 1]
}];

var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

// Used to pass in the resolution of the canvas
uniform vec2 u_resolution;

uniform mat3 u_matrix;

// all shaders have a main function
void main() {
    // Multiply the position by the matrix.
    vec2 position = (u_matrix * vec3(a_position, 1)).xy;

    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

var fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
    outColor = u_color;
}
`;

function setBtnEvent() {
    var btn = document.getElementById("btn");
    btn.addEventListener("click", fAnimate);
}

setBtnEvent();

function main() {
    var canvas = document.querySelector("#canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) return;
    
    program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);
    
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    colorLocation = gl.getUniformLocation(program, "u_color");
    matrixLocation = gl.getUniformLocation(program, "u_matrix");

    var positionBuffer1 = gl.createBuffer();
    var positionBuffer2 = gl.createBuffer();

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer1); // F1
    setGeometry();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2); // F2
    setGeometry();
    
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    
    drawScene();

    setupUI(0); // Setup a ui for F v.1
    setupUI(1); // Setup a ui for F v.2
    
    function setupUI(index) {
        webglLessonsUI.setupSlider("#x" + index, { value: shapes[index].translation[0], slide: updatePosition(index, 0), max: gl.canvas.width });
        webglLessonsUI.setupSlider("#y" + index, { value: shapes[index].translation[1], slide: updatePosition(index, 1), max: gl.canvas.height });
        webglLessonsUI.setupSlider("#angle" + index, { slide: updateAngle(index), max: 360 });
        webglLessonsUI.setupSlider("#scaleX" + index, { value: shapes[index].scale[0], slide: updateScale(index, 0), min: -5, max: 5, step: 0.01, precision: 2 });
        webglLessonsUI.setupSlider("#scaleY" + index, { value: shapes[index].scale[1], slide: updateScale(index, 1), min: -5, max: 5, step: 0.01, precision: 2 });

        function updatePosition(i, j) {
            return function (event, ui) {
                shapes[i].translation[j] = ui.value;
                drawScene();
            };
        }

        function updateAngle(i) {
            return function (event, ui) {
                var angleInDegrees = 360 - ui.value;
                shapes[i].rotation = angleInDegrees * Math.PI / 180;
                drawScene();
            }
        }

        function updateScale(i, j) {
            return function (event, ui) {
                shapes[i].scale[j] = ui.value;
                drawScene();
            };
        }
    }
}

function fAnimate(event) {
    event.srcElement.disabled = true;
    requestAnimationFrame(animation);
}

var then = 0;
function animation(now) {
    now *= 0.001;
    var deltaTime = now - then;
    then = now;
    shapes[1].rotation += 1.2 * deltaTime;
    drawScene();
    if (now < 5) // 5 seconds
        requestAnimationFrame(animation);

    // how to update ui 
    // how to reactivate button
}

function drawScene () {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    gl.clearColor(0, 0, 0, 0); // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // F1
    gl.uniform4fv(colorLocation, shapes[0].color); 
    var translationMatrix = m3.translation(shapes[0].translation[0], shapes[0].translation[1]);
    var rotationMatrix = m3.rotation(shapes[0].rotation);
    var scaleMatrix = m3.scaling(shapes[0].scale[0], shapes[0].scale[1]);
    var matrix = m3.multiply(translationMatrix, rotationMatrix);
    matrix = m3.multiply(matrix, scaleMatrix);
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 18;
    gl.drawArrays(primitiveType, offset, count); 
    // F2
    gl.uniform4fv(colorLocation, shapes[1].color); 
    var translationMatrix = m3.translation(shapes[1].translation[0], shapes[1].translation[1]);
    var rotationMatrix = m3.rotation(shapes[1].rotation);
    var scaleMatrix = m3.scaling(shapes[1].scale[0], shapes[1].scale[1]);
    var matrix = m3.multiply(translationMatrix, rotationMatrix);
    matrix = m3.multiply(matrix, scaleMatrix);
    gl.uniformMatrix3fv(matrixLocation, false, matrix);
    gl.drawArrays(primitiveType, offset, count); 
}

// Fill the current ARRAY_BUFFER buffer
// with the values that define a letter 'F'.
function setGeometry() {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,

            // top rung
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,

            // middle rung
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ]),
        gl.STATIC_DRAW);
}

var m3 = {
    translation: function translation(tx, ty) {
      return [
        1, 0, 0,
        0, 1, 0,
        tx, ty, 1,
      ];
    },
  
    rotation: function rotation(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
      return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1,
      ];
    },
  
    scaling: function scaling(sx, sy) {
      return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1,
      ];
    },
  
    multiply: function multiply(a, b) {
      var a00 = a[0 * 3 + 0];
      var a01 = a[0 * 3 + 1];
      var a02 = a[0 * 3 + 2];
      var a10 = a[1 * 3 + 0];
      var a11 = a[1 * 3 + 1];
      var a12 = a[1 * 3 + 2];
      var a20 = a[2 * 3 + 0];
      var a21 = a[2 * 3 + 1];
      var a22 = a[2 * 3 + 2];
      var b00 = b[0 * 3 + 0];
      var b01 = b[0 * 3 + 1];
      var b02 = b[0 * 3 + 2];
      var b10 = b[1 * 3 + 0];
      var b11 = b[1 * 3 + 1];
      var b12 = b[1 * 3 + 2];
      var b20 = b[2 * 3 + 0];
      var b21 = b[2 * 3 + 1];
      var b22 = b[2 * 3 + 2];
      return [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22,
      ];
    },
  };

main();