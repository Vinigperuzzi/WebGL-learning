main();

function main() {
    let i = 1;
    const canvas = document.querySelector("#glcanvas");
    
    const gl = canvas.getContext("webgl");

    if (gl == null) {
        alert("Ocorreu algum erro na chamada de contexto do WebG.");
        return;
    }
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}