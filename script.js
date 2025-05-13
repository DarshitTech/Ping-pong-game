document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("ping-pong-table");
  const ball = document.getElementById("ball");
  const paddleLeft = document.getElementById("paddle-left");
  const paddleRight = document.getElementById("paddle-right");
  const hitSound = document.getElementById("hitSound");

  let scoreA = 0, scoreB = 0;
  let ballX = 350, ballY = 200;
  let dx = 3, dy = 3;

  let paddleLeftY = 160;
  let paddleRightY = 160;
  const paddleSpeed = 8;
  const ballSpeed = 10;

  let mode = 'human'; // default

  let powerMode = false;

  function updatePositions() {
    ballX += dx;
    ballY += dy;

    // Bounce off top/bottom
    if (ballY <= 0 || ballY >= table.offsetHeight - ball.offsetHeight) {
      dy *= -1;
      playSound();
    }

    // Left paddle collision
    if (
      ballX <= paddleLeft.offsetWidth &&
      ballY + ball.offsetHeight >= paddleLeftY &&
      ballY <= paddleLeftY + paddleLeft.offsetHeight
    ) {
      dx *= -1;
      playSound();
    }

    // Right paddle collision
    if (
      ballX + ball.offsetWidth >= table.offsetWidth - paddleRight.offsetWidth &&
      ballY + ball.offsetHeight >= paddleRightY &&
      ballY <= paddleRightY + paddleRight.offsetHeight
    ) {
      dx *= -1;
      playSound();
    }

    // Scoring
    if (ballX < 0) {
      scoreB++;
      updateScore();
      resetBall();
    } else if (ballX > table.offsetWidth) {
      scoreA++;
      updateScore();
      resetBall();
    }

    // AI logic
    if (mode === 'ai') {
      if (paddleRightY + paddleRight.offsetHeight / 2 < ballY) {
        paddleRightY += paddleSpeed * 0.6;
      } else if (paddleRightY + paddleRight.offsetHeight / 2 > ballY) {
        paddleRightY -= paddleSpeed * 0.6;
      }
      paddleRightY = Math.max(0, Math.min(table.offsetHeight - paddleRight.offsetHeight, paddleRightY));
    }

    // Apply positions
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
    paddleLeft.style.top = `${paddleLeftY}px`;
    paddleRight.style.top = `${paddleRightY}px`;
  }

  let gameInterval = setInterval(updatePositions, ballSpeed);

  document.addEventListener("keydown", (event) => {
    if (event.key === "w" && paddleLeftY > 0) {
      paddleLeftY -= paddleSpeed;
    }
    if (event.key === "s" && paddleLeftY < table.offsetHeight - paddleLeft.offsetHeight) {
      paddleLeftY += paddleSpeed;
    }

    if (mode === "human") {
      if (event.key === "ArrowUp" && paddleRightY > 0) {
        paddleRightY -= paddleSpeed;
      }
      if (event.key === "ArrowDown" && paddleRightY < table.offsetHeight - paddleRight.offsetHeight) {
        paddleRightY += paddleSpeed;
      }
    }

    // Power shot mode trigger
    if (event.code === "Space" && !powerMode) {
      activatePowerShot();
    }
  });

  function activatePowerShot() {
    powerMode = true;
    dx *= 2;
    dy *= 2;
    table.style.borderColor = "yellow";

    setTimeout(() => {
      dx = dx > 0 ? 3 : -3;
      dy = dy > 0 ? 3 : -3;
      table.style.borderColor = "#fff";
      powerMode = false;
    }, 5000);
  }

  function resetBall() {
    ballX = table.offsetWidth / 2 - ball.offsetWidth / 2;
    ballY = table.offsetHeight / 2 - ball.offsetHeight / 2;
    dx = Math.random() > 0.5 ? 3 : -3;
    dy = Math.random() > 0.5 ? 3 : -3;
  }

  function updateScore() {
    document.getElementById("scoreA").textContent = scoreA;
    document.getElementById("scoreB").textContent = scoreB;
  }

  function playSound() {
    hitSound.play();
  }

  // Mode switching
  window.setMode = function (modeChoice) {
    mode = modeChoice;
    document.getElementById("btn-human").classList.remove("active-mode");
    document.getElementById("btn-ai").classList.remove("active-mode");
    document.getElementById("btn-" + modeChoice).classList.add("active-mode");

    // Reset positions
    paddleLeftY = table.offsetHeight / 2 - paddleLeft.offsetHeight / 2;
    paddleRightY = table.offsetHeight / 2 - paddleRight.offsetHeight / 2;
    paddleLeft.style.top = `${paddleLeftY}px`;
    paddleRight.style.top = `${paddleRightY}px`;
    resetBall();
  };

  setMode('human'); // default mode
});
