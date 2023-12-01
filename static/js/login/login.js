function redirectToDataManagement() {
  //로그인 요청
  window.location.href = "/dataManagement";
}

var rememberMeChecked = true;

function updateRememberStatus() {
  var rememberImage = document.getElementById("rememberImage");

  rememberMeChecked = !rememberMeChecked;

  if (rememberMeChecked) {
    rememberImage.src = "/static/image/boxcheck.svg";
  } else {
    rememberImage.src = "/static/image/box.svg";
    // 체크를 해제할 때는 로컬 스토리지에서 저장된 값을 삭제합니다.
    localStorage.removeItem("savedUsername");
  }
}

function setRememberImage() {
  var rememberImage = document.getElementById("rememberImage");

  // 이미지의 초기 상태를 설정합니다.
  rememberImage.src = rememberMeChecked
    ? "/static/image/boxcheck.svg"
    : "/static/image/box.svg";
}

window.onload = function () {
  setRememberImage();

  var savedUsername = localStorage.getItem("savedUsername");

  if (savedUsername && rememberMeChecked) {
    document.getElementById("username").value = savedUsername;
  } else {
    localStorage.removeItem("savedUsername");
  }
};

function saveUsername() {
  var usernameInput = document.getElementById("username");

  if (rememberMeChecked) {
    localStorage.setItem("savedUsername", usernameInput.value);
  } else {
    localStorage.removeItem("savedUsername");
  }

  // 저장 후 이미지 업데이트
  setRememberImage();
}
