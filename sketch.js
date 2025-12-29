let spriteSheet;
let animation = [];
let bgImage; 
let characterScale = 3; 
let x, y; 
let speed = 5; 
let direction = 1; 
let frameIndex = 0; 

let velocityY = 0; 
let gravity = 0.6; 
let jumpForce = -15; 
let groundY; 

// --- 角色 1 (玩家) 參數 ---
const spriteSheetWidth = 653; 
const spriteSheetHeight = 107;
const numFrames = 7;
const frameWidth = spriteSheetWidth / numFrames;
const frameHeight = spriteSheetHeight;
const anchorPointsX = [55, 45, 35, 25, 35, 45, 55]; 
const baseAnchorX = anchorPointsX[0];

// --- 角色 2 參數 ---
let spriteSheet2, animation2 = [];
let frameIndex2 = 0;
const spriteSheetWidth2 = 631;
const spriteSheetHeight2 = 104;
const numFrames2 = 12;
const frameWidth2 = spriteSheetWidth2 / numFrames2;
const frameHeight2 = spriteSheetHeight2;
let x2, y2, direction2 = 1, speed2 = 3; 

// --- 角色 3 參數 ---
let spriteSheet3, animation3 = [];
let frameIndex3 = 0;
const spriteSheetWidth3 = 385;
const spriteSheetHeight3 = 101;
const numFrames3 = 5;
const frameWidth3 = spriteSheetWidth3 / numFrames3;
const frameHeight3 = spriteSheetHeight3;
let x3, y3; 

// --- 角色 4 參數 ---
let spriteSheet4, animation4 = [];
let frameIndex4 = 0;
const spriteSheetWidth4 = 765;
const spriteSheetHeight4 = 103;
const numFrames4 = 10;
const frameWidth4 = spriteSheetWidth4 / numFrames4;
const frameHeight4 = spriteSheetHeight4; 
let x4, y4; 

// --- 遊戲狀態 ---
let health = 100; 
let showQuestion = false;
let currentQuestion;
let currentNPC = 2; // 用來記錄是碰到 NPC2 還是 NPC3
let showCorrectMessage = false;
let showWrongMessage = false;
let pauseNPC = false; 
let collisionCooldown = 0; 
let answeredNPC2 = false;
let answeredNPC3 = false;
let answeredNPC4 = false;
let showNextRoundMessage = false;
let spacePressCount = 0; 
let lastSpacePressTime = 0; 
let answeredIndices = []; 

// --- 擴充題庫 ---
let questions = [
  {
    question: "台灣目前共有六個「直轄市」，\n請問下列哪一個城市不屬於六都之一？",
    options: ["(A) 桃園市", "(B) 台南市", "(C) 新竹市", "(D) 台中市"],
    correct: 2 
  },
  {
    question: "台灣本島的最南端位於「鵝鑾鼻」，\n那台灣本島的最東端位於哪裡？",
    options: ["(A) 三貂角", "(B) 鼻頭角", "(C) 富貴角", "(D) 塔石角"],
    correct: 0 
  },
  {
    question: "目前台灣的法定「完全行為能力」年齡\n已統一修正為幾歲？",
    options: ["(A) 18 歲", "(B) 19 歲", "(C) 20 歲", "(D) 21 歲"],
    correct: 0 
  },
  {
    question: "台積電（TSMC）是台灣最重要的半導體公司，\n其創辦人是誰？",
    options: ["(A) 郭台銘", "(B) 張忠謀", "(C) 黃仁勳", "(D) 林百里"],
    correct: 1
  },
  {
    question: "台灣海拔最高的地方是玉山主峰，\n其標高為多少公尺？",
    options: ["(A) 3,886 公尺", "(B) 3,952 公尺", "(C) 3,742 公尺", "(D) 4,000 公尺"],
    correct: 1
  },
  {
    question: "台灣在 2019 年正式通過法律成為亞洲首個\n同婚合法國家。該專法正式名稱開頭為何？",
    options: ["(A) 婚姻平權法", "(B) 司法院釋字第 748 號", "(C) 民法修正案", "(D) 多元成家法"],
    correct: 1
  }
];

function preload() {
  spriteSheet = loadImage('1/all1.png');
  bgImage = loadImage('背景.jpeg');
  spriteSheet2 = loadImage('2/all2.png');
  spriteSheet3 = loadImage('33/all33.png');
  spriteSheet4 = loadImage('44/all44.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundY = height * 0.75; 
  x = width / 2;
  y = groundY;
  x2 = 200;
  y2 = groundY;
  x3 = width - 200;
  x4 = width / 2 - 300; // 角色 4 初始位置
  y4 = groundY - 310; // 角色 4 位於較高位置

  // 切割影格
  sliceAnimation(spriteSheet, animation, numFrames, frameWidth, frameHeight);
  sliceAnimation(spriteSheet2, animation2, numFrames2, frameWidth2, frameHeight2);
  sliceAnimation(spriteSheet3, animation3, numFrames3, frameWidth3, frameHeight3);
  sliceAnimation(spriteSheet4, animation4, numFrames4, frameWidth4, frameHeight4);

  frameRate(60);
}

function sliceAnimation(sheet, animArray, count, fW, fH) {
  for (let i = 0; i < count; i++) {
    animArray.push(sheet.get(i * fW, 0, fW, fH));
  }
}

function draw() {
  image(bgImage, 0, 0, width, height);

  // 1. 物理重力
  velocityY += gravity; 
  y += velocityY; 
  if (y > groundY) { y = groundY; velocityY = 0; }

  // 2. 玩家位移與動畫
  let isMoving = false;
  if (!showQuestion) {
    if (keyIsDown(RIGHT_ARROW)) { direction = 1; x += speed; isMoving = true; }
    else if (keyIsDown(LEFT_ARROW)) { direction = -1; x -= speed; isMoving = true; }
  }
  if (isMoving && frameCount % 8 === 0) frameIndex = (frameIndex + 1) % numFrames;
  if (!isMoving) frameIndex = 0;

  // 3. NPC 狀態更新
  if (!pauseNPC) {
    x2 += direction2 * speed2;
    if (x2 < 50 || x2 > width / 4) direction2 *= -1;
    if (frameCount % 8 === 0) {
      frameIndex2 = (frameIndex2 + 1) % numFrames2;
      frameIndex3 = (frameIndex3 + 1) % numFrames3;
      frameIndex4 = (frameIndex4 + 1) % numFrames4;
    }
  }

  // 4. 繪製精靈
  drawAllSprites();

  // 5. 碰撞偵測
  if (collisionCooldown > 0) {
    collisionCooldown--;
  } else if (!showQuestion) {
    if (dist(x, y, x2, y2) < 100) triggerQuestion(2);
    else if (dist(x, y, x3, y3) < 100) triggerQuestion(3);
    else if (x > x4 - (frameWidth4 * characterScale) / 2 && x < x4 + (frameWidth4 * characterScale) / 2 &&
             y > y4 - (frameHeight4 * characterScale) / 2 && y < y4 + (frameHeight4 * characterScale) / 2) {
      triggerQuestion(4);
    }
  }

  // 6. UI 顯示
  drawHealthBar();
  if (showQuestion) drawQuestionUI();
  if (showCorrectMessage) drawFeedback("答對了！", '#bde0fe');
  if (showWrongMessage) drawFeedback("答錯了！", '#ffafcc');
  if (answeredNPC2 && answeredNPC3 && answeredNPC4 && !showNextRoundMessage) showNextRoundMessage = true;
  if (showNextRoundMessage) drawNextRoundMessage();
}

function drawAllSprites() {
  // 玩家
  let currentAnchorX = anchorPointsX[frameIndex] || 50;
  let offsetX = baseAnchorX - currentAnchorX;
  push();
  translate(x, y);
  scale(direction * characterScale, characterScale);
  imageMode(CENTER);
  image(animation[frameIndex], offsetX, 0);
  pop();

  // NPC 2
  push();
  translate(x2, y2);
  scale(direction2 * characterScale, characterScale);
  imageMode(CENTER);
  image(animation2[frameIndex2], 0, 0);
  pop();

  // NPC 3
  push();
  translate(x3, y3);
  scale(-characterScale, characterScale); // 固定面向左方
  imageMode(CENTER);
  image(animation3[frameIndex3], 0, 0);
  pop();

  // NPC 4
  push();
  translate(x4, y4);
  scale(characterScale, characterScale);
  imageMode(CENTER);
  image(animation4[frameIndex4], 0, 0);
  pop();
}

function triggerQuestion(npcID) {
  showQuestion = true;
  // 選擇未答對的問題
  let availableIndices = [];
  for (let i = 0; i < questions.length; i++) {
    if (!answeredIndices.includes(i)) availableIndices.push(i);
  }
  if (availableIndices.length === 0) {
    // 如果所有問題都答過了，重置
    answeredIndices = [];
    availableIndices = Array.from({length: questions.length}, (_, i) => i);
  }
  let randIndex = random(availableIndices);
  currentQuestion = questions[randIndex];
  currentNPC = npcID;
  pauseNPC = true; 
}

function drawHealthBar() {
  push();
  translate(x, y - 180);
  stroke('#bde0fe');
  strokeWeight(3);
  fill(255);
  rect(-60, -7.5, 120, 15, 5);
  noStroke();
  fill('#ffafcc');
  rect(-58, -5.5, (health / 100) * 116, 11, 2);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(12);
  text(health + "/100", 0, 0);
  pop();
}

function drawQuestionUI() {
  // 顏色邏輯：NPC 2 (白底粉框) vs NPC 3 (藍底白框)
  let bgColor = (currentNPC === 2) ? color(255, 245) : color('#bde0fe');
  let strokeCol = (currentNPC === 2) ? color('#ffafcc') : color(255);
  let btnColor = (currentNPC === 2) ? color('#bde0fe') : color('#ffafcc');

  // 對話主框
  fill(bgColor);
  stroke(strokeCol);
  strokeWeight(5);
  rect(width / 2 - 250, height / 2 - 150, 500, 300, 15);
  
  // 標題與題目
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(22);
  text("挑戰 NPC " + currentNPC, width / 2 - 230, height / 2 - 130);
  textSize(18);
  text(currentQuestion.question, width / 2 - 230, height / 2 - 90);

  // 選項
  textWrap(430); // 限制選項文字寬度，避免超出框邊界
  for (let i = 0; i < 4; i++) {
    let btnY = height / 2 - 20 + i * 40;
    fill(btnColor);
    stroke(255);
    strokeWeight(1);
    rect(width / 2 - 230, btnY, 460, 38, 8);
    fill(0);
    noStroke();
    textAlign(LEFT, CENTER);
    text(currentQuestion.options[i], width / 2 - 215, btnY + 19);
  }
  textWrap(0); // 重置為無限寬度
}

function drawFeedback(msg, col) {
  push();
  fill(255);
  stroke(col);
  strokeWeight(6);
  rectMode(CENTER);
  rect(width / 2, height / 2, 280, 140, 20);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(36);
  text(msg, width / 2, height / 2);
  pop();
}

function drawNextRoundMessage() {
  push();
  fill(255);
  stroke('#ffafcc');
  strokeWeight(6);
  rectMode(CENTER);
  rect(width / 2, height / 2, 400, 100, 20);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("連按兩次空白鍵即進入下一回合挑戰", width / 2, height / 2);
  pop();
}

function mousePressed() {
  if (showQuestion) {
    for (let i = 0; i < 4; i++) {
      let btnX = width / 2 - 230;
      let btnY = height / 2 - 20 + i * 40;
      if (mouseX > btnX && mouseX < btnX + 460 && mouseY > btnY && mouseY < btnY + 38) {
        handleAnswer(i === currentQuestion.correct);
      }
    }
  }
}

function handleAnswer(isCorrect) {
  showQuestion = false;
  pauseNPC = false;
  collisionCooldown = 180; // 3秒冷卻防止連續對話

  if (isCorrect) {
    if (currentNPC === 2) answeredNPC2 = true;
    else if (currentNPC === 3) answeredNPC3 = true;
    else if (currentNPC === 4) answeredNPC4 = true;
    answeredIndices.push(questions.indexOf(currentQuestion));
    showCorrectMessage = true;
    setTimeout(() => { showCorrectMessage = false; }, 1500);
  } else {
    health = max(0, health - 10);
    showWrongMessage = true;
    setTimeout(() => { showWrongMessage = false; }, 1500);
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW && y === groundY && !showQuestion) {
    velocityY = jumpForce;
  }
  if (key === ' ') {
    if (showNextRoundMessage) {
      spacePressCount++;
      if (spacePressCount >= 2) {
        // 進入下一回合：重置狀態，但保持血量
        answeredNPC2 = false;
        answeredNPC3 = false;
        answeredNPC4 = false;
        showNextRoundMessage = false;
        spacePressCount = 0;
        // health 不重置，保持扣除的狀態
      }
    } else if (y === groundY && !showQuestion) {
      let currentTime = millis();
      if (currentTime - lastSpacePressTime < 300) {
        // 連按兩下，跳更高
        velocityY = jumpForce * 3.0; // 更高的跳躍
      } else {
        // 按一下，正常跳
        velocityY = jumpForce; // 正常跳躍
      }
      lastSpacePressTime = currentTime;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height * 0.75;
  y = groundY;
  y2 = groundY;
  y3 = groundY;
  x3 = width - 200;
}
