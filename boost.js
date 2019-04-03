var cubeRotation=0.0;
function initPlayers(gl) {
    const positionBuffer = gl.createBuffer();
  
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      width = 0.1
      length = 0.2
      height = 0.1
    const positions = [
      // Front face
  
      -width, length,  height,
     width, length,  height,
     width,  2*length,  height,
    -width,  2*length,  height,
    // back face
    -width, length,  -height,
    width, length,  -height,
    width,  2*length,  -height,
   -width,  2*length,  -height,
    //
    -width, length, height,
    -width, length, -height,
    -width, 2*length, -height,
    -width, 2*length, height,
    //
    width, length, height,
    width, length, -height,
    width, 2*length, -height,
    width, 2*length, height,
    
    -width, 2*length, height,
    -width, 2*length, -height,
    width, 2*length, -height,
    width, 2*length, height,

    -width, length, height,
    -width, length, -height,
    width, length, -height,
    width, length, height,
    ];
  
    tvc = (positions.length/3);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  textureCoordinates = [];

  for(i=0;i<(tvc/4);i++){
    textureCoordinates.push(
      0.0,  1.0,
      0.0, 0.0,
      1.0,  0.0,
      1.0,  1.0,
      );
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
  gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
    var indices = [];
    for(i=0;i<(tvc/4);i++){
      indices.push(4*i+0);
      indices.push(4*i+1);
      indices.push(4*i+2);
  
      indices.push(4*i+0);
      indices.push(4*i+2);
      indices.push(4*i+3);
    }
  
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);
  
    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
      indices: indexBuffer,
    };
  }
  
  function drawPlayers(gl, programInfo, player, texture, deltaTime) {
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 1000.0;
    const projectionMatrix = mat4.create();
  
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
  
    const modelViewMatrix = mat4.create();
  
    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   player.position); 
  
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * .7, [0, 1, 0]);

    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, player.buffer.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }
  
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, player.buffer.textureCoord);
      gl.vertexAttribPointer(
          programInfo.attribLocations.textureCoord,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.textureCoord);
  } 
  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, player.buffer.indices);
  
    gl.useProgram(programInfo.program);
  
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);
      
        // Tell the shader we bound the texture to texture unit 0
      gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    {
      const vertexCount = 36;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  
    cubeRotation += 0.01;
  }
  
  //
  // Initialize a shader program, so WebGL knows how to draw our data
  //
  