const canvas = document.createElement('canvas');
canvas.width = 4;
canvas.height = 4;
document.body.appendChild(canvas);
const gl = canvas.getContext('webgl');

function generateTex(dataWidth, dataHeight) {
    let data = [];
    for(let y = 0; y < dataHeight; y++) {
        for(let x = 0; x < dataWidth; x++){
            data.push(
                125,
                125,
                125,
                255
            )
        }
    }
    return data;
}

function setupWebGl(gl) {
    let vshader = gl.createShader(gl.VERTEX_SHADER);
    let fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vshader, document.getElementById('vshader').innerHTML);
    gl.shaderSource(fshader, document.getElementById('fshader').innerHTML);
    gl.compileShader(vshader);
    gl.compileShader(fshader);

    let program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    console.log(gl.getShaderInfoLog(vshader))
    console.log(gl.getShaderInfoLog(fshader))
    console.log(gl.getProgramInfoLog(program))

    return {
        vshader,
        fshader,
        program
    }
}

let {vshader, fshader, program} = setupWebGl(gl);

let positionAttribLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttribLocation);

let uvAttribLocation = gl.getAttribLocation(program, 'a_uvcoord');
gl.enableVertexAttribArray(uvAttribLocation);


let verticies = [
    -1, 1, 0, 1,
    1, -1, 1, 0,
    1, 1, 1, 1,
    -1, 1, 0, 1,
    1, -1, 1, 0,
    -1, -1, 0, 0
];

let buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);

let data = new Uint8Array(generateTex(canvas.width, canvas.height));

let texWidth = canvas.width;
let texHeight = canvas.height;
let tex = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    texWidth,
    texHeight,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
)

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)


let srcTexWidth = canvas.width;
let srcTexHeight = canvas.height;
let srcTex = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, srcTex);
gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    srcTexWidth,
    srcTexHeight,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    data
)

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)



let fb = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 16, 0);
gl.vertexAttribPointer(uvAttribLocation, 2, gl.FLOAT, false, 16, 8);
gl.drawArrays(gl.TRIANGLES, 0, verticies.length / 4);

let dest = new Uint8Array(canvas.width * canvas.height * 4);
gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, dest);
