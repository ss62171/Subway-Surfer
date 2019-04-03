var cubeRotation = 0.0;
var trains = [];
var track = [];
var obstacle = [];
var obstacle2 = [];
var track_speed = 0.05;
var player=[];
var police=[];
var dog=[];
var left_wall=[];
var right_wall=[];
var coin=[];
var boost=[];
var boot_a=[];
var jump = false;
var train_stand = false;
var playerx = 0.0;
var playery = -1.0;
var playerz = -4.0;
var flg = 0;
var left_flag = false;
var right_flag = false;
var boot = 0;
var crouch = false;
var old_time;
var boot_time;
var boost_time;
var slow_time = 0.0;
var first_collision = false;
var policez = -2;
var gray = 0;
var prevy;
var boost_flag = false;
var flash = 0.1;
document.getElementById("intro").play();
var dead = false;
var coin_collect = 0;
var speed=0.05;

main();

function main() {
document.getElementById("theme").play();  
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;
  
  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform highp float uFlash;
  uniform int uLevel;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
    // Apply lighting effect
    highp vec3 ambientLight = vec3(0.3 + uFlash, 0.3 + uFlash, 0.3 + uFlash);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0, -1, 1));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    if(uLevel==1 || uLevel==3)
      vLighting = ambientLight + (directionalLightColor * directional);
    else
      vLighting = vec3(1.0 + uFlash, 1.0 + uFlash, 1.0 + uFlash);
  }
  `;

  const fsSource = `
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  uniform sampler2D uSampler;
  uniform bool uGray;
  uniform highp float uFlash;

  void main(void) {
    if(uGray)
    {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord).rgba;
      highp float grayScale = dot(texelColor.rgb, vec3(0.199, 0.587, 0.114));
      highp vec3 grayImage = vec3(grayScale+uFlash, grayScale+uFlash, grayScale+uFlash);
      gl_FragColor = vec4(grayImage * vLighting, texelColor.a);
    }
    else
    {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord).rgba;
      highp vec3 Image = vec3(texelColor.r + uFlash, texelColor.g + uFlash, texelColor.b + uFlash);
      gl_FragColor = vec4(Image * vLighting, texelColor.a);
    }

  }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
};

  const texture = loadTexture(gl, 'cubetexture.jpg');
  const train_texture = loadTexture(gl, 'train_texture.jpeg');
  const ad = loadTexture(gl, 'ad.jpeg');
  const side_ad = loadTexture(gl, 'side.jpeg');
  const right_side_ad = loadTexture(gl, 'side.jpeg');
  const coin_texture = loadTexture(gl, 'coin.png');
  const player_texture = loadTexture(gl, 'player.jpg');
  const hair_texture = loadTexture(gl, 'hair.jpg');
  const arm_texture = loadTexture(gl, 'arm.png');
  const leg_texture = loadTexture(gl, 'leg.jpeg');
  const boost_texture = loadTexture(gl, 'boost.jpeg');
  const boot_texture = loadTexture(gl, 'boot.jpeg');
  const police_texture = loadTexture(gl, 'police.jpeg');
  const police_hair_texture = loadTexture(gl, 'police_hair.jpeg');
  const stop = loadTexture(gl, 'stop.png');
  const dog_texture = loadTexture(gl, 'dog.jpeg');

  var then = 0;

  initialize(gl);
  

  function render(now) {
    // playSound("ping");
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    if(left_wall.length <=0)
    window.alert("You won \n" + "Coins :" + coin_collect)      
    
    if(Math.floor(now)%2 === 0)
    {
      flg = 1;
      flash = 0.1;
    }
    else
      flg = 0;
      player.push({
        buffer : initPlayer2(gl,flg),
        draw: drawPlayer2,
        position:[playerx,playery,playerz],
      });

      dog.push({
        buffer : initDog(gl),
        draw: drawDog,
        position:[playerx+0.3,-1,playerz],
      });

      police.push({
        buffer : initPlayer2(gl,flg),
        draw: drawPlayer2,
        position:[playerx,-1,policez],
      });

      if(dead == true)
      return;
      if(now-slow_time >= 6)
      policez = 2;

      if(now-old_time >= 0.4 && crouch == true)
      {
        crouch = false;
        player[0].position[1] = prevy;
      }

      if(boost_flag == true)
      player[0].position[1] = 1;
      if(now-boost_time >= 5 && boost_flag == true)
      {
        boost_flag = false;
        jump = false;
        speed = 0.05;
      }

      if(now-boot_time >= 10 && boot == 1 && train_stand == false)
      {
        boot = 0;
      }
      player_crouch(crouch)

    drawPlayer2(gl, programInfo, player[0], player_texture,arm_texture, leg_texture, hair_texture,true, deltaTime);
    drawPlayer2(gl, programInfo, police[0], police_texture,arm_texture, leg_texture, police_hair_texture,true, deltaTime);
    drawDog(gl, programInfo, dog[0], dog_texture,true, deltaTime);
    
    if(boost.length>0)
    drawPlayers(gl, programInfo, boost[0], boost_texture, deltaTime);  
    if(boot_a.length>0)
    drawPlayers(gl, programInfo, boot_a[0], boot_texture, deltaTime);    
    jump_player();
    move_left();
    inputs(now,player[0].position[1]);
    stand(boot);
    for(var i=0;i<obstacle.length;i++)
    drawObstacle(gl, programInfo, obstacle[i], ad, deltaTime);
    for(var i=0;i<obstacle2.length;i++)
    drawObstacle2(gl, programInfo, obstacle2[i], stop, deltaTime);
    
    for(var i=0;i<trains.length;i++)    
      drawTrains(gl, programInfo, trains[i], train_texture, deltaTime);
  

    for(var i=0;i<right_wall.length;i++)
    drawWall(gl, programInfo, right_wall[i], side_ad, deltaTime);

    for(var i=0;i<left_wall.length;i++)
      drawWall(gl, programInfo, left_wall[i], right_side_ad, deltaTime);    
    for(var i=0;i<track.length;i++)
      drawTrack(gl, programInfo, track[i], texture, deltaTime);

    for(var i=0;i<coin.length;i++)
    drawCoin(gl, programInfo, coin[i], coin_texture, deltaTime);

    tick(gl,now);
    playerx = player[0].position[0];
    playery = player[0].position[1];
    playerz = player[0].position[2];

    for(var i=0;i<boost.length;i++)
    if(boost.length>0 && boost_collision(player[0],boost[0]))
    {
      boost_flag = true;
      speed = 0.15;
      document.getElementById("jet").play();
      boost_time = now;
      boost.splice(i,1);
      break;
    }

    for(var i=0;i<boot_a.length;i++)
    if(boot_a.length>0 && boost_collision(player[0],boot_a[0]))
    {
      boot = 1;
      boot_time = now;
      boot_a.splice(i,1);
      break;
    }

    requestAnimationFrame(render);
    var GrayBuffer = gl.getUniformLocation(programInfo.program, "uGray");
    gl.uniform1i(GrayBuffer, gray);
    var FlashBuffer = gl.getUniformLocation(programInfo.program, "uFlash");
    gl.uniform1f(FlashBuffer, flash);
    if(flash > 0)
      flash -= 0.01;
    else
      flash = 0;
    player.splice(0,1);
    police.splice(0,1);
    dog.splice(0,1);

  }
  requestAnimationFrame(render);

}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function tick(gl,now){
  for(var i=0;i<obstacle.length;i++)
  obstacle[i].position[2] += speed;
  for(var i=0;i<obstacle2.length;i++)  
  obstacle2[i].position[2] += speed;

  if(boost.length>0)
  for(var i=0;i<boost.length;i++)
  boost[i].position[2] += speed;
  if(boot_a.length>0)
  for(var i=0;i<boot_a.length;i++)
  boot_a[i].position[2] += speed;

  for(var i=0;i<coin.length;i++)
  coin[i].position[2]+= speed;


  for(var i=0;i<left_wall.length;i++)
    left_wall[i].position[2] += speed;
  for(var i=0;i<right_wall.length;i++)
    right_wall[i].position[2] += speed;
  for(var i=0;i<track.length;i++)
    track[i].position[2] += speed;

  for(var i=0;i<trains.length;i++)
    trains[i].position[2] += (0.15+speed);

    player[0].position[2] -= 0;

  for(var i=0;i<trains.length;i++)
  {
      if(intersect(player[0],trains[i]))
      {
        //console.log(player[0].position[1],trains[i].position[1]);
        if(boot == 0)
        window.alert("Gameover \n" + "Coins :" + coin_collect);    
        if(player[0].position[1]<trains[i].position[1])
        dead = true;
        train_stand = true;
        break;
      }
      else{
        train_stand = false;
      }
  }


  for(var i=0;i<obstacle.length;i++)
  {
    if(Math.abs(obstacle[i].position[0]-player[0].position[0]) < 0.4)
    {
      if(obstacle_collision(player[0],obstacle[i]))
      {
        if(policez == -2)
        window.alert("Gameover \n" + "Coins :" + coin_collect)      
        player[0].position[2] -= 0.3;
        policez = -2;
        slow_time = now;
        break;
      }
    }
  }

  for(var i=0;i<obstacle2.length;i++)
  {
    if(Math.abs(obstacle2[i].position[0]-player[0].position[0]) < 0.4)
    {
      if(obstacle_collision(player[0],obstacle2[i]))
      {
      window.alert("Gameover \n" + "Coins :" + coin_collect)
      dead = true;
      policez = -2;
      slow_time = now;
      }
    }
  }

  for(var i=0;i<coin.length;i++)
  if(coin[i].position[2] >= 25)
    coin.splice(i,1);

  for(var i=0;i<coin.length;i++)
  { 
    if(coin_collisiion(player[0],coin[i]))
    {
      document.getElementById("coin").play();
      coin.splice(i,1);
      coin_collect += 1;
    }
  }

    if(left_wall.length>0 && left_wall[0].position[2]>=20)
      left_wall.shift();
    if(right_wall.length>0 && right_wall[0].position[2]>=20)
      right_wall.shift();
    if(track.length>0 && track[0].position[2]>=20)
      track.shift();
    for(var i=0;i<trains.length;i++)
    {
      if(trains[i].position[2]>=30)
        trains.splice(i,1);
    }
}

function initialize(gl)
  {
   
    boost.push({
      buffer : initPlayers(gl),
      draw: drawPlayers,
      position:[0.0,-1,-78],
    });

    boost.push({
      buffer : initPlayers(gl),
      draw: drawPlayers,
      position:[-1.2,-1,-150],
    });

    boot_a.push({
      buffer : initPlayers(gl),
      draw: drawPlayers,
      position:[0,-1,-35],
    });

    boot_a.push({
      buffer : initPlayers(gl),
      draw: drawPlayers,
      position:[-1.2,-1,-120],
    });

    for(var i=0;i<7;i++)
    {
      trains.push({
        buffer : initTrains(gl),
        draw: drawTrains,
        position:[0,-1,-40*(i+4)],
      });
    
    trains.push({
      buffer : initTrains(gl),
      draw: drawTrains,
      position:[1.3,-1,-100*(i+2)],
    });

    trains.push({
      buffer : initTrains(gl),
      draw: drawTrains,
      position:[-1.3,-1,-160*(i+3)],
    });
  }
    

    

    for(var i=0;i<20;i++)
    {
      track.push({
        buffer: initTracks(gl),
        draw: drawTrack,
        position: [0.0, -1.0, i*(-15)],
      });
    }

    

    for(var i=0;i<6;i++)
    {
      obstacle.push({
        buffer : initObstacle(gl),
        draw: drawObstacle,
        position:[0.0,-1.0 ,-30*(i+1)],
      });

      obstacle.push({
        buffer : initObstacle(gl),
        draw: drawObstacle,
        position:[-1.2,-1.0 ,-45*(i+1)],
      });

      obstacle2.push({
        buffer : initObstacle2(gl),
        draw: drawObstacle2,
        position:[-1.2,-1.0 ,-30*(i+1)],
      });
    }

    for(var i=0;i<10;i++)
    {
      coin.push({
        buffer : initCoin(gl),
        draw: drawCoin,
        position:[0.0,-0.8 ,-7-i],
      });

      coin.push({
        buffer : initCoin(gl),
        draw: drawCoin,
        position:[-1.2,-0.8,-17-i],
      });

      coin.push({
        buffer : initCoin(gl),
        draw: drawCoin,
        position:[1.2,-0.8,-27-i],
      });

      coin.push({
        buffer : initCoin(gl),
        draw: drawCoin,
        position:[1.2,-0.8,-110-i],
      });

      coin.push({
        buffer : initCoin(gl),
        draw: drawCoin,
        position:[-1.2,1.2,-80-i],
      });

      coin.push({
        buffer : initCoin(gl),
        draw: drawCoin,
        position:[1.2,1.2,-150-i],
      });
      coin.push({
        buffer : initCoin(gl),
        draw: drawCoin,
        position:[0.0,1.2,-150-i],
      });
    }

    for(var i=0;i<20;i++)
    {
      left_wall.push({
        buffer : initWall(gl),
        draw: drawWall,
        position:[1.9,-1.0 ,-i*(10)],
      });

      right_wall.push({
        buffer : initWall(gl),
        draw: drawWall,
        position:[-1.9,-1.0 ,-i*(10)],
      });
    }

  }

  function jump_player(){
    if(jump == true)
      player[0].position[1] += 0.04;

    if(player[0].position[1]>=0)
      jump = false;

    if(player[0].position[1] <= -1)
        return;
    
    if(jump == false && train_stand == false)
      player[0].position[1] -= 0.04;   
  }

  function move_left(){
    if(left_flag == true)
    {
      if(player[0].position[0] == 0.0)
      player[0].position[0] = -1.2;
      if(player[0].position[0] == 1.2)
      player[0].position[0] = 0;
      left_flag = false;
    }

    if(right_flag == true)
    {
      if(player[0].position[0] == 0)
      player[0].position[0] = 1.2;
      if(player[0].position[0] == -1.2)
      player[0].position[0] = 0;
      right_flag = false;
    }
  }
  function inputs(current,y)
  {
    Mousetrap.bind('left', function(e) {
      left_flag = true;
  });

  Mousetrap.bind('up', function(e){
    jump = true;
  });

  Mousetrap.bind('right', function(e){
    right_flag = true;
  });

  Mousetrap.bind('down', function(e){
    document.getElementById("crouch").play();
    crouch = true;
    old_time = current;
    prevy = y;
  });
  Mousetrap.bind('g',function(){gray=(gray+1)%2;});
}

  function player_crouch(crouch){
    if(crouch == true)
    {
      player[0].position[1] = -1.5;
    }
  }

  function stand(boot){
    if(boot == 0)
    {
      if(train_stand == true && jump== false)
    {
      if(player[0].position[1]>0.5)
      player[0].position[1] = 0.4;
      else
      {
        if(player[0].position[1] <= -1)
        return;
        player[0].position[1] -= 0.04;
      }

    }
    }
    else
    {
        if(train_stand == true && jump== false && player[0].position[1]>0.5)
        player[0].position[1] = 0.5;
    }
    
  }

  function intersect(b, a) {
 
   return (a.position[2]+9 >= b.position[2] && a.position[2]-9 <= b.position[2]) &&
          (a.position[1]+0.5 >= b.position[1]-0.4 && a.position[1]-0.5 <= b.position[1]+0.4) &&
          (a.position[0]+0.6 >= b.position[0]-0.4 && a.position[0] - 0.6<= b.position[0]+0.4);
 }

  function coin_collisiion(b,a){
    return (a.position[2]+0.1 >= b.position[2] && a.position[2]-0.1 <= b.position[2]) &&
    (a.position[1]+0.1 >= b.position[1]-0.2 && a.position[1]-0.1 <= b.position[1]+0.2) &&
    (a.position[0]+0.1 >= b.position[0]-0.4 && a.position[0] - 0.1<= b.position[0]+0.4);
  }

  function obstacle_collision(b,a){
    return (a.position[2]+0.1 >= b.position[2] && a.position[2]-0.1 <= b.position[2]) &&
    (a.position[1]+0.5 >= b.position[1]-0.2 && a.position[1]-0.2 <= b.position[1]+0.2) &&
    (a.position[0]+0.6 >= b.position[0]-0.4 && a.position[0] - 0.6<= b.position[0]+0.4);
  }

  function boost_collision(b,a){
    return (a.position[2]+0.4 >= b.position[2] && a.position[2]-0.4 <= b.position[2]) &&
    (a.position[1]+0.4 >= b.position[1]-0.4 && a.position[1]-0.4 <= b.position[1]+0.4) &&
    (a.position[0]+0.4 >= b.position[0]-0.4 && a.position[0] - 0.4<= b.position[0]+0.4);
  }
