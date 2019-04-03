var vc;
var rot = 0.0;
function initPlayer2(gl,flag) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
      // Front face
  
      -0.07, 0.15,  0.03,
       0.07, 0.15,  0.03,
       0.07,  0.4,  0.03,
      -0.07,  0.4,  0.03,
      // back face
      -0.07, 0.15,  -0.03,
      0.07, 0.15,  -0.03,
      0.07,  0.4,  -0.03,
     -0.07,  0.4,  -0.03,
      //
      -0.07, 0.15, 0.03,
      -0.07, 0.15, -0.03,
      -0.07, 0.4, -0.03,
      -0.07, 0.4, 0.03,
      //
      0.07, 0.15, 0.03,
      0.07, 0.15, -0.03,
      0.07, 0.4, -0.03,
      0.07, 0.4, 0.03,
      
      -0.07, 0.4, 0.03,
      -0.07, 0.4, -0.03,
      0.07, 0.4, -0.03,
      0.07, 0.4, 0.03,
  
      -0.07, 0.15, 0.03,
      -0.07, 0.15, -0.03,
      0.07, 0.15, -0.03,
      0.07, 0.15, 0.03,
  
      /// head///
      -0.05,0.4,0.03,
      0.05, 0.4,0.03,
      0.05, 0.5,0.03,
      -0.05,0.5,0.03,
  
      -0.05 ,0.4,  -0.03,
       0.05 ,0.4,  -0.03,
       0.05  ,0.5,  -0.03,
      -0.05  ,0.5,  -0.03,
      //
      -0.05, 0.4, 0.03,
      -0.05, 0.4, -0.03,
      -0.05, 0.5, -0.03,
      -0.05, 0.5, 0.03,
      //
      0.05, 0.4, 0.03,
      0.05, 0.4, -0.03,
      0.05, 0.5, -0.03,
      0.05, 0.5, 0.03,
      
      -0.05, 0.5, 0.03,
      -0.05, 0.5, -0.03,
       0.05, 0.5, -0.03,
       0.05, 0.5, 0.03,
  
      -0.05, 0.4, 0.03,
      -0.05, 0.4, -0.03,
       0.05, 0.4, -0.03,
       0.05, 0.4, 0.03,
  
       ///////////arm right///////////////
       0.07,0.25,0.03,
       0.1,0.25,0.03,
       0.07,0.4,0.03,
       0.1,0.4,0.03,
   
       0.07,0.25,-0.03,
       0.1,0.25,-0.03,
       0.07,0.4,-0.03,
       0.1,0.4,-0.03,
   
       0.07,0.25,0.03,
       0.07,0.25,-0.03,
       0.07,0.4,0.03,
       0.07,0.4,-0.03,
   
       0.1,0.25,0.03,
       0.1,0.25,-0.03,
       0.1,0.4,0.03,
       0.1,0.4,-0.03,
   
       0.07,0.25,0.03,
       0.1,0.25,0.03,
       0.07,0.4,0.03,
       0.1,0.4,0.03,
   
       0.07,0.25,-0.03,
       0.1,0.25,-0.03,
       0.07,0.4,-0.03,
       0.1,0.4,-0.03,

    -0.07,0.25,0.03,
    -0.1,0.25,0.03,
    -0.07,0.4,0.03,
    -0.1,0.4,0.03,

    -0.07,0.25,-0.03,
    -0.1,0.25,-0.03,
    -0.07,0.4,-0.03,
    -0.1,0.4,-0.03,

    -0.07,0.25,0.03,
    -0.07,0.25,-0.03,
    -0.07,0.4,0.03,
    -0.07,0.4,-0.03,

    -0.1,0.25,0.03,
    -0.1,0.25,-0.03,
    -0.1,0.4,0.03,
    -0.1,0.4,-0.03,

    -0.07,0.25,0.03,
    -0.1,0.25,0.03,
    -0.07,0.4,0.03,
    -0.1,0.4,0.03,

    -0.07,0.25,-0.03,
    -0.1,0.25,-0.03,
    -0.07,0.4,-0.03,
    -0.1,0.4,-0.03,

    ];
      /////////////////////legs///////////////
  
      if(flag == 1)
      {
        positions.push(
            0.07,0.15,0.03,
          0.0,0.15,0.03,
          0.07,-0.15,-7*0.03,
          0.0,-0.15,-7*0.03,
      
          -0.07,0.15,0.03,
          0.0,0.15,0.03,
          -0.07,-0.15,7*0.03,
          0.0,-0.15,7*0.03,
          );
      }
      else
      {
          positions.push(
            0.07,0.15,0.03,
            0.0,0.15,0.03,
            0.07,-0.15,7*0.03,
            0.0,-0.15,7*0.03,
        
            -0.07,0.15,0.03,
            0.0,0.15,0.03,
            -0.07,-0.15,-7*0.03,
            0.0,-0.15,-7*0.03,
        
          );
      }
      
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    vc = (positions.length/3);
    textureCoordinates = [];
    for(var i=0;i<(vc/4);i++){
        textureCoordinates.push(
          0.0, 0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0);
      }
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                  gl.STATIC_DRAW);
  
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    
    var indices = [];
    for(var i=0;i<(vc/4);i++){
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
  
  function drawPlayer2(gl, programInfo, player, texture_back,texture_arms,texture_leg,texture_hair,boost_fl, deltaTime) {
  
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
      
        gl.bindTexture(gl.TEXTURE_2D, texture_back);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  
        gl.bindTexture(gl.TEXTURE_2D, texture_hair);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 72);
  
        gl.bindTexture(gl.TEXTURE_2D, texture_arms);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT,144 );
  
        gl.bindTexture(gl.TEXTURE_2D, texture_arms);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 216);
      
        gl.bindTexture(gl.TEXTURE_2D, texture_leg);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 288);
  
        gl.bindTexture(gl.TEXTURE_2D, texture_leg);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 300);
        // Tell the shader we bound the texture to texture unit 0
      gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
  
    {
      const vertexCount = 156;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
    }
  
    rot = 0.01;
  }