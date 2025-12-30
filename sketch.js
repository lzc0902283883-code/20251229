let spriteSheet; // 角色 1 (玩家) 精靈圖
let animation = []; // 角色 1 (玩家) 動畫陣列
let bgImage; // 背景圖
let bgStart; // 開始畫面背景圖
let characterScale = 3;      // 角色縮放比例
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

// --- 角色 5 (隨從) 參數 ---
let spriteSheet5, animation5 = [];
let frameIndex5 = 0;
const spriteSheetWidth5 = 640;
const spriteSheetHeight5 = 40;
const numFrames5 = 15;
const frameWidth5 = spriteSheetWidth5 / numFrames5;
const frameHeight5 = spriteSheetHeight5;
const followerScale = 2;

// --- 遊戲狀態 ---
let health = 100; 
let showQuestion = false;
let currentQuestion;
let currentNPC = 2; 
let showCorrectMessage = false;
let showWrongMessage = false;
let showHintMessage = false; 
let pauseNPC = false; 
let collisionCooldown = 0; 
let lastSpacePressTime = 0; 
let answeredIndices = [];
let gameStarted = false; 
let correctCount = 0; // 新增：紀錄答對題數
let gameWin = false;  // 新增：紀錄過關狀態

// --- 題庫 ---
let questions = [
  { question: "台灣目前共有六個「直轄市」（六都），\n請問下列哪一個城市「不屬於」六都之一？", options: ["(A) 桃園市", "(B) 台南市", "(C) 新竹市", "(D) 台中市"], correct: 2, hint: "這個城市雖然是科技研發重鎮，\n但在行政體系中\n仍屬於「縣轄市/省轄市」級別，\n並未與鄰近縣份合併升格。" },
  { question: "台灣本島最南端是「鵝鑾鼻」，\n請問最東端位於哪裡？", options: ["(A) 三貂角", "(B) 鼻頭角", "(C) 富貴角", "(D) 塔石角"], correct: 0, hint: "這個地點位於新北市貢寮區，\n名稱源自於早年西班牙人\n對此地的稱呼（Santiago）。" },
  { question: "目前台灣民法規定，\n法定「完全行為能力」年齡（可獨立簽約、結婚）\n已修正為幾歲？", options: ["(A) 18 歲", "(B) 19 歲", "(C) 20 歲", "(D) 21 歲"], correct: 0, hint: "台灣已完成修法，\n讓民法與刑法的成年標準達成一致，\n現在大多數大學新鮮人\n在入學當年度即具備法律完全行為能力。" },
  { question: "被稱為台灣「護國神山」的台積電（TSMC），\n其創辦人是誰？", options: ["(A) 郭台銘", "(B) 張忠謀", "(C) 黃仁勳", "(D) 林百里"], correct: 1, hint: "這位創辦人曾長年擔任公司董事長，\n並在 2018 年正式退休，\n他首創了「專業晶圓代工」的商業模式。" },
  { question: "台灣與東北亞的第一高峰「玉山」，\n其主峰的海拔高度是多少？", options: ["(A) 3,886 公尺", "(B) 3,952 公尺", "(C) 3,742 公尺", "(D) 4,000 公尺"], correct: 1, hint: "高度非常接近四千公尺 but 未超過；\n在台灣百岳排行中，\n此高度是所有山脈的最高標竿。" },
  { question: "台灣是亞洲第一個同性婚姻合法的國家，\n請問該專法名稱的開頭為何？", options: ["(A) 婚姻平權法", "(B) 司法院釋字第 748 號解釋施行法", "(C) 民法修正案", "(D) 多元成家法"], correct: 1, hint: "由於當時立法院採取折衷方案，\n並未直接修改民法，\n而是根據憲法法庭大法官\n解釋的「編號」單獨制定一部新法。" },
  { question: "在大專院校間最熱門、決賽\n常在小巨蛋舉行的「大專籃論聯賽」簡稱為？", options: ["(A) HBL", "(B) UBA", "(C) CPBL", "(D) SBL"], correct: 1, hint: "名稱中的第一個英文字母\n代表「大學（University）」，\n與高中聯賽（HBL）的區分在於學歷層級的不同。" },
  { question: "目前台灣政府官方認定的\n原住民族共有多少族？", options: ["(A) 9 族", "(B) 12 族", "(C) 14 族", "(D) 16 族"], correct: 3, hint: "早年教科書常提到的\n「九族」已是過去式，\n隨著更多族群正名成功，\n目前的數量已經達到雙位數且超過十五族。" },
  { question: "基北北桃四大縣市共同推出的 1200 元定期通勤月票，\n官方名稱為何？", options: ["(A) EasyCard", "(B) iPass", "(C) TPASS", "(D) YU-PASS"], correct: 2, hint: "這是行政院為了\n統一全台通勤月票形象\n所設計的品牌名稱，\n字母「T」同時象徵台灣（Taiwan）\n與運輸（Transport）。" }
];

function preload() {
  spriteSheet = loadImage('1/all1.png');
  bgImage = loadImage('背景.jpeg');
  bgStart = loadImage('背景2.png'); 
  spriteSheet2 = loadImage('2/all2.png');
  spriteSheet3 = loadImage('33/all33.png');
  spriteSheet4 = loadImage('44/all44.png');
  spriteSheet5 = loadImage('all5.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundY = height * 0.75; 
  x = width / 2;
  y = groundY;
  x2 = 200;
  y2 = groundY;
  x3 = width - 200;
  y3 = groundY;
  x4 = width / 2 - 300;
  y4 = groundY - 310;

  sliceAnimation(spriteSheet, animation, numFrames, frameWidth, frameHeight);
  sliceAnimation(spriteSheet2, animation2, numFrames2, frameWidth2, frameHeight2);
  sliceAnimation(spriteSheet3, animation3, numFrames3, frameWidth3, frameHeight3);
  sliceAnimation(spriteSheet4, animation4, numFrames4, frameWidth4, frameHeight4);
  sliceAnimation(spriteSheet5, animation5, numFrames5, frameWidth5, frameHeight5);
}

function sliceAnimation(sheet, animArray, count, fW, fH) {
  for (let i = 0; i < count; i++) {
    animArray.push(sheet.get(i * fW, 0, fW, fH));
  }
}

function draw() {
  if (!gameStarted) {
    drawStartScreen();
  } else if (gameWin) { // 新增：過關畫面判斷
    drawWinScreen();
  } else {
    image(bgImage, 0, 0, width, height);

    velocityY += gravity; 
    y += velocityY; 
    if (y > groundY) { y = groundY; velocityY = 0; }

    let isMoving = false;
    if (!showQuestion && !showHintMessage && !showCorrectMessage && !showWrongMessage) {
      if (keyIsDown(RIGHT_ARROW)) { direction = 1; x += speed; isMoving = true; }
      else if (keyIsDown(LEFT_ARROW)) { direction = -1; x -= speed; isMoving = true; }
    }
    
    if (isMoving && frameCount % 8 === 0) frameIndex = (frameIndex + 1) % numFrames;
    if (!isMoving) frameIndex = 0;
    if (frameCount % 6 === 0) frameIndex5 = (frameIndex5 + 1) % numFrames5;

    if (!pauseNPC) {
      x2 += direction2 * speed2;
      if (x2 < 50 || x2 > width / 4) direction2 *= -1;
      if (frameCount % 8 === 0) {
        frameIndex2 = (frameIndex2 + 1) % numFrames2;
        frameIndex3 = (frameIndex3 + 1) % numFrames3;
        frameIndex4 = (frameIndex4 + 1) % numFrames4;
      }
    }

    drawAllSprites();

    if (collisionCooldown > 0) {
      collisionCooldown--;
    } else if (!showQuestion && !showHintMessage && !showCorrectMessage && !showWrongMessage) {
      if (dist(x, y, x2, y2) < 100) triggerQuestion(2);
      else if (dist(x, y, x3, y3) < 100) triggerQuestion(3);
      else if (x > x4 - (frameWidth4 * characterScale) / 2 && x < x4 + (frameWidth4 * characterScale) / 2 &&
               y > y4 - (frameHeight4 * characterScale) / 2 && y < y4 + (frameHeight4 * characterScale) / 2) {
        triggerQuestion(4);
      }
    }

    drawHealthBar();
    
    if (showCorrectMessage) {
        drawFeedback("答對了！", '#bde0fe');
    } else if (showWrongMessage) {
        drawFeedback("答錯了！", '#ffafcc');
    } else if (showHintMessage) {
        drawFollowerHint(); 
    } else if (showQuestion) {
        drawQuestionUI();
    }

    if (health <= 0) {
      drawGameOver();
      setTimeout(() => { resetGame(); }, 2000);
    }
  }
}

// 新增：過關畫面函式
function drawWinScreen() {
  image(bgStart, 0, 0, width, height); // 使用背景2
  push();
  rectMode(CENTER);
  fill(255, 250, 200, 230);
  stroke(255, 215, 0);
  strokeWeight(8);
  rect(width / 2, height / 2, 500, 300, 30);
  
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(40);
  textStyle(BOLD);
  text("🎉 恭喜過關 🎉", width / 2, height / 2 - 40);
  textSize(20);
  textStyle(NORMAL);
  text("你已經成功答對三題！", width / 2, height / 2 + 30);
  text("按任意鍵重新開始", width / 2, height / 2 + 80);
  pop();
}

function drawAllSprites() {
  let fX = x + (-80 * direction); 
  let fY = y + 40; 
  push();
  translate(fX, fY);
  scale(direction * followerScale, followerScale);
  imageMode(CENTER);
  image(animation5[frameIndex5], 0, 0);
  pop();

  let currentAnchorX = anchorPointsX[frameIndex] || 50;
  let offsetX = baseAnchorX - currentAnchorX;
  push();
  translate(x, y);
  scale(direction * characterScale, characterScale);
  imageMode(CENTER);
  image(animation[frameIndex], offsetX, 0);
  pop();

  push();
  translate(x2, y2);
  scale(direction2 * characterScale, characterScale);
  imageMode(CENTER);
  image(animation2[frameIndex2], 0, 0);
  pop();

  push();
  translate(x3, y3);
  scale(-characterScale, characterScale);
  imageMode(CENTER);
  image(animation3[frameIndex3], 0, 0);
  pop();

  push();
  translate(x4, y4);
  scale(characterScale, characterScale);
  imageMode(CENTER);
  image(animation4[frameIndex4], 0, 0);
  pop();
}

function drawFollowerHint() {
  let fX = x + (-80 * direction);
  let fY = y + 40;
  let bW = 320; 
  let bH = 180; 
  
  push();
  rectMode(CENTER);
  fill(255, 252, 210);
  stroke(255, 100, 0);
  strokeWeight(3);
  rect(fX, fY - 120, bW, bH, 15); 
  
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(18);
  text("💡 隨從提示", fX, fY - 185); 
  
  textStyle(NORMAL);
  textSize(15);
  textWrap(WORD); 
  text(currentQuestion.hint, fX , fY - 130 , bW - 40, bH - 40);
  
  fill(100);
  textSize(12);
  text("(點擊畫面關閉提示)", fX, fY - 45);
  pop();
}

function drawHealthBar() {
  push();
  translate(x, y - 180);
  stroke('#bde0fe');
  strokeWeight(3);
  fill(255);
  rectMode(CENTER);
  rect(0, 0, 120, 18, 5);
  noStroke();
  fill('#ffafcc');
  rectMode(CORNER);
  rect(-58, -7, (health / 100) * 116, 14, 2);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text(health + " / 100", 0, 0);
  pop();
}

function drawQuestionUI() { 
  push();
  let uiW = 560;
  let uiH = 440;
  let uiX = width / 2;
  let uiY = height / 2;

  rectMode(CENTER);
  fill(255, 253, 245, 252);
  stroke(currentNPC === 2 ? '#ffafcc' : '#7c9accff');
  strokeWeight(5);
  rect(uiX, uiY, uiW, uiH, 20); 
  
  noStroke();
  fill(0);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(24);
  text("挑戰 " + currentNPC, uiX, uiY - 200); 
  
  let qBoxW = uiW - 80;  
  let qBoxH = 140;       
  let qBoxX = uiX - qBoxW / 2;
  let qBoxY = uiY - 165;

  fill(240);
  rectMode(CORNER);
  rect(qBoxX, qBoxY, qBoxW, qBoxH, 10);

  fill(0);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  textSize(19);
  textWrap(WORD);
  text(currentQuestion.question, qBoxX, qBoxY, qBoxW, qBoxH);

  for (let i = 0; i < 4; i++) {
    let btnY = uiY + 45 + i * 42; 
    rectMode(CENTER);
    fill(currentNPC === 2 ? '#bde0fe' : '#ffafcc');
    stroke(255);
    strokeWeight(2);
    rect(uiX, btnY, 480, 36, 10);
    
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(currentQuestion.options[i], uiX, btnY);
  }
  pop();
}

function triggerQuestion(npcID) {
  showQuestion = true;
  let availableIndices = [];
  for (let i = 0; i < questions.length; i++) {
    if (!answeredIndices.includes(i)) availableIndices.push(i);
  }
  if (availableIndices.length === 0) {
    answeredIndices = [];
    availableIndices = Array.from({length: questions.length}, (_, i) => i);
  }
  let randIndex = floor(random(availableIndices.length));
  currentQuestion = questions[availableIndices[randIndex]];
  currentNPC = npcID;
  pauseNPC = true; 
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
  textStyle(BOLD);
  text(msg, width / 2, height / 2);
  pop();
}

function drawStartScreen() { 
  push();
  if (bgStart) image(bgStart, 0, 0, width, height);
  else background(0, 100, 200); 

  stroke(0);
  strokeWeight(5);      
  rectMode(CENTER);
  fill(255, 230); 
  rect(width / 2, height / 2, 600, 400, 20);
  
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
  text("台灣常識大挑戰", width / 2, height / 2 - 150);
  textSize(20);
  textStyle(NORMAL);
  text("左右鍵移動，空白鍵跳躍", width / 2, height / 2 - 80);
  text("答錯時隨從會給你提示", width / 2, height / 2 - 40);
  text("全部回答正確即過關！", width / 2, height / 2);
  textSize(24);
  textStyle(BOLD);
  fill(0, 100, 200);
  text("按任意鍵開始遊戲", width / 2, height / 2 + 100);
  pop();
}

function drawGameOver() {
  push();
  fill(255, 0, 0);
  stroke(0);
  strokeWeight(6);
  rectMode(CENTER);
  rect(width / 2, height / 2, 300, 150, 20);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(42);
  textStyle(BOLD);
  text("GAME OVER", width / 2, height / 2);
  pop();
}

function mousePressed() {
  if (showQuestion) {
    let uiX = width / 2;
    let uiY = height / 2;
    for (let i = 0; i < 4; i++) {
      let btnY = uiY + 45 + i * 42; 
      if (mouseX > uiX - 240 && mouseX < uiX + 240 && mouseY > btnY - 18 && mouseY < btnY + 18) {
        handleAnswer(i === currentQuestion.correct);
        return; 
      }
    }
  } 
  
  if (showHintMessage) {
    answeredIndices.push(questions.indexOf(currentQuestion));
    showHintMessage = false;
    pauseNPC = false;
    collisionCooldown = 180;
  }
}

function handleAnswer(isCorrect) {
  showQuestion = false;

  if (isCorrect) {
    answeredIndices.push(questions.indexOf(currentQuestion));
    correctCount++; // 新增：增加正確計數
    showCorrectMessage = true;
    pauseNPC = false;
    collisionCooldown = 180; 
    setTimeout(() => { 
      showCorrectMessage = false; 
      if (correctCount >= 3) { // 答對三題過關
        gameWin = true;
      }
    }, 1500);
  } else {
    health = max(0, health - 10);
    showWrongMessage = true;
    setTimeout(() => { 
      showWrongMessage = false; 
      showHintMessage = true; 
    }, 1200);
  }
}

function keyPressed() {
  if (!gameStarted) {
    gameStarted = true;
  } else if (gameWin) { // 新增：過關後重置
    resetGame();
  } else {
    if ((keyCode === UP_ARROW || keyCode === 32) && y === groundY && !showQuestion && !showHintMessage && !showCorrectMessage && !showWrongMessage) {
      let currentTime = millis();
      if (currentTime - lastSpacePressTime < 300) {
        velocityY = jumpForce * 2.5; 
      } else {
        velocityY = jumpForce; 
      }
      lastSpacePressTime = currentTime;
    }
  }
}

function resetGame() {
  health = 100;
  showQuestion = false;
  showHintMessage = false;
  currentQuestion = null;
  currentNPC = 2;
  showCorrectMessage = false;
  showWrongMessage = false;
  pauseNPC = false;
  collisionCooldown = 0;
  answeredIndices = [];
  gameStarted = false;
  correctCount = 0; // 重置計數
  gameWin = false;   // 重置狀態
  x = width / 2;
  y = groundY;
  x2 = 200;
  y2 = groundY;
  x3 = width - 200;
  y3 = groundY;
  x4 = width / 2 - 300;
  y4 = groundY - 310;
  velocityY = 0;
}
