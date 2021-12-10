function main() {
    var canvas = document.getElementById('myCanvas');   
    var gl = canvas.getContext('webgl');                

    var vertices1 = [ //left photo
        //top
        
        //frontBlackTop
        -0.78, 0.4, 0.0, 0.0, 0.0,
        -0.22, 0.4, 0.0, 0.0, 0.0,
        -0.78, 0.41, 0.0, 0.0, 0.0,

        //triangleTopRight
        -0.78, 0.41, 0.0, 0.0, 0.0,
        -0.22, 0.41, 0.0, 0.0, 0.0,
        -0.22, 0.4, 0.0, 0.0, 0.0,

        //bodyTop1
        -0.78, 0.4, 0.5, 0.0, 0.0,
        -0.22, 0.4, 0.5, 0.0, 0.0,
        -0.78, 0.3, 0.5, 0.0, 0.0, 

        //bodyTop2
        -0.22, 0.4, 0.5, 0.0, 0.0,
        -0.22, 0.3, 0.5, 0.0, 0.0,
        -0.78, 0.3, 0.5, 0.0, 0.0,
        
        //Bot

        //bodyBot1
        -0.78, 0.35, 0.255, 0.0, 0.0,
        -0.22, 0.35, 0.255, 0.0, 0.0,
        -0.78, 0.2, 0.255, 0.0, 0.0,

        //bodyBot2
        -0.22, 0.35, 0.255, 0.0, 0.0,
        -0.22, 0.2, 0.255, 0.0, 0.0,
        -0.78, 0.2, 0.255, 0.0, 0.0
    ];

    var vertices2 = [ //right photo
        //Top
        
        //triangleFrontBlackTop
        0.78, 0.3, 0.1, 0.1, 0.1,
        0.22, 0.3, 0.1, 0.1, 0.1,
        0.78, 0.31, 0.1, 0.1, 0.1,

        //triangleFrontBlackTop
        0.78, 0.31, 0.1, 0.1, 0.1,
        0.22, 0.31, 0.1, 0.1, 0.1,
        0.22, 0.3, 0.1, 0.1, 0.1,

        //bodyTop1
        0.78, 0.41, 0.5, 0.0, 0.0,
        0.22, 0.41, 0.5, 0.0, 0.0,
        0.78, 0.31, 0.5, 0.0, 0.0, 

        //bodyTop2
        0.22, 0.41, 0.5, 0.0, 0.0,
        0.22, 0.31, 0.5, 0.0, 0.0,
        0.78, 0.31, 0.5, 0.0, 0.0,
        
        //Bot

        //bodyBot1
        0.78, 0.35, 0.0, 0.0, 0.0,
        0.22, 0.35, 0.0, 0.0, 0.0,
        0.78, 0.2, 0.0, 0.0, 0.0,

        //bodyBot2
        0.22, 0.35, 0.0, 0.0, 0.0,
        0.22, 0.2, 0.0, 0.0, 0.0,
        0.78, 0.2, 0.0, 0.0, 0.0
    ]
    var vertices = [...vertices1, ...vertices2];
    
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vertexShaderSource = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform mat4 uTranslate;
        void main() {
            gl_Position = uTranslate * vec4(aPosition, 0.0, 1.0);
            vColor = aColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0);    // Yellow
        }
    `;

    // Create .c in GPU
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    // Compile .c into .o
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Prepare a .exe shell (shader program)
    var shaderProgram = gl.createProgram();

    // Put the two .o files into the shell
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    // Link the two .o files, so together they can be a runnable program/context.
    gl.linkProgram(shaderProgram);

    // Start using the context (analogy: start using the paints and the brushes)
    gl.useProgram(shaderProgram);

    // Teach the computer how to collect
    //  the positional values from ARRAY_BUFFER
    //  to each vertex being processed
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(
        aPosition, 
        2, 
        gl.FLOAT, 
        false, 
        5 * Float32Array.BYTES_PER_ELEMENT, 
        0
    );
    gl.enableVertexAttribArray(aPosition);
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(
        aColor, 
        3, 
        gl.FLOAT, 
        false, 
        5 * Float32Array.BYTES_PER_ELEMENT, 
        2 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(aColor);

    var speed = 0.0079;
    var y = 0; // limit top and bot for animation
    // Create a uniform to animate the vertices
    const uTranslate = gl.getUniformLocation(shaderProgram, 'uTranslate');
    
    function render() {
        //control the bouncing range
        //if (y <= -0.5 || y >= 0.5) speed = -speed;
		//y += speed;
        
        const vertices1Pos = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0,
	    ]

	    const vertices2Pos = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, /*y*/0.0, 0.0, 1.0,
	    ]
		
        //coloring canvas
	    gl.clearColor(0.49, 0.49, 0.49, 1.0); 
	    gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniformMatrix4fv(uTranslate, false, vertices1Pos);
        gl.drawArrays(gl.TRIANGLES, 0, vertices1.length/5);

		gl.uniformMatrix4fv(uTranslate, false, vertices2Pos);
        gl.drawArrays(gl.TRIANGLES, vertices1.length/5, vertices2.length/5);
            
        requestAnimationFrame(render);
    }
    render();
}