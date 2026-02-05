let nowScreen = "";

// 要素取得
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const select = document.getElementById("select");
const backBtn = document.getElementById("backBtn");
const frames = document.querySelectorAll(".frame");
const puri = document.getElementById("puri");
const puriFrame = document.getElementById("puriFrame");
const cameraVideo = document.getElementById("camera");

// スタートボタン
startBtn.onclick = function () {
  startScreen.style.display = "none";
  select.style.display = "block";
  backBtn.style.display = "inline-block";
  nowScreen = "start";
};

// フレームを選ぶ → プリ画面
frames.forEach(function(frame, index) {
  frame.onclick = function () {
    select.style.display = "none";
    puri.style.display = "block";

    nowScreen = "select";
    backBtn.style.display = "inline-block";

    // 枠の色を変える（フレーム選択反映）
    if (index === 0) puriFrame.style.borderColor = "hotpink";
    else if (index === 1) puriFrame.style.borderColor = "purple";
    else if (index === 2) puriFrame.style.borderColor = "blue";

    // カメラ起動
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(stream) {
        cameraVideo.srcObject = stream;
      })
      .catch(function(err) {
        alert("カメラが使えませんでした: " + err);
      });
  };
});

// もどるボタン
backBtn.onclick = function () {
  if (nowScreen === "start") {
    // スタート画面に戻る
    select.style.display = "none";
    startScreen.style.display = "block";
    backBtn.style.display = "none";

    // カメラ停止（万が一）
    if (cameraVideo.srcObject) {
      cameraVideo.srcObject.getTracks().forEach(track => track.stop());
      cameraVideo.srcObject = null;
    }

  } else if (nowScreen === "select") {
    // フレーム選び画面に戻る
    puri.style.display = "none";
    select.style.display = "block";

    // カメラ停止
    if (cameraVideo.srcObject) {
      cameraVideo.srcObject.getTracks().forEach(track => track.stop());
      cameraVideo.srcObject = null;
    }
  }
};
const snapBtn = document.getElementById("snapBtn");
const countdown = document.getElementById("countdown");
const photo = document.getElementById("photo");

// シャッター音（クリックすると鳴る）
const shutterSound = new Audio("shutter.mp3"); // ※shutter.mp3 は自分で用意

snapBtn.onclick = function () {
  let timeLeft = 3;
  countdown.textContent = timeLeft;

  const timer = setInterval(function () {
    timeLeft--;
    if (timeLeft > 0) {
      countdown.textContent = timeLeft;
    } else {
      clearInterval(timer);
      countdown.textContent = "";

      // シャッター音
      shutterSound.play();

      // 写真を撮る
      const canvas = document.createElement("canvas");
      canvas.width = cameraVideo.videoWidth;
      canvas.height = cameraVideo.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);

      // 撮った写真を表示
      photo.src = canvas.toDataURL("image/png");
    }
  }, 1000);
};
