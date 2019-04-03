var tvc;
var coinrotation = 0.0;
function initCoin(gl) {
   const positionBuffer = gl.createBuffer();
  
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    var rot_angle = (2*Math.PI)/100;
    var angle = 0;
    var angle2 = 0;
    var angle3 = 0;

  var positions = []; 
  for(i=0;i<100;i++){
    positions.push(0.1*Math.cos(angle),0.1*Math.sin(angle),0);
    positions.push(0,0,0);
    positions.push(0,0,0);
    positions.push(0.1*Math.cos(angle+rot_angle),0.1*Math.sin(angle+rot_angle),0);
    angle+=rot_angle;
    positions.push(0.1*Math.cos(angle),0.1*Math.sin(angle),0.01);
    positions.push(0,0,0.01);
    positions.push(0,0,0.01);
    positions.push(0.1*Math.cos(angle+rot_angle),0.1*Math.sin(angle+rot_angle),0.01);
    angle2+=rot_angle;
    positions.push(0.1*Math.cos(angle),0.1*Math.sin(angle),0);
    positions.push(0.1*Math.cos(angle+rot_angle),0.1*Math.sin(angle+rot_angle),0);
    positions.push(0.1*Math.cos(angle),0.1*Math.sin(angle),0.01);
    positions.push(0.1*Math.cos(angle+rot_angle),0.1*Math.sin(angle+rot_angle),0.01);
    angle3+=rot_angle;
}

  
  tvc = (positions.length/3);
  // console.log(tvc);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    textureCoordinates = [];
    for(i=0;i<(tvc/4);i++){
      textureCoordinates.push(0.0, 0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
    gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    
    indices = [];

    for(i=0;i<(tvc/4);i++){
      indices.push(4*i+0);
      indices.push(4*i+1);
      indices.push(4*i+2);
  
      indices.push(4*i+0);
      indices.push(4*i+2);
      indices.push(4*i+3);
    }
  
  
    // Now send the element array to GL
  
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);
  
    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
      indices: indexBuffer,
    };
  }
  
  function drawCoin(gl, programInfo, coin, texture, deltaTime) {
    
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 1000.0;
    const projectionMatrix = mat4.create();
  
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
  
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();
  
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
  
    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   coin.position);  // amount to translate

    mat4.rotate(modelViewMatrix, modelViewMatrix, coinrotation * .7, [0, 1, 0]);
  
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, coin.buffer.position);
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
      gl.bindBuffer(gl.ARRAY_BUFFER, coin.buffer.textureCoord);
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
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coin.buffer.indices);
  
    // Tell WebGL to use our program when drawing
  
    gl.useProgram(programInfo.program);
  
    // Set the shader uniforms
  
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
      const vertexCount =(tvc*6)/4;
      // console.log(vertexCount);
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, 1800, type, offset);
    }
    coinrotation += 0.01;
  }
  