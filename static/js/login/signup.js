//+회원가입 모달 open/close 함수+
function initSignupModal() {
  var signupmodal = document.getElementById("signupModal");
  var opensignupModalBtn = document.getElementById("signup-user");
  var closesignupModalBtn = document.getElementById("closeModalBtn");

  // 추가: input 요소들을 찾음
  var userIDInput = document.getElementById("signuserID");
  var nicknameInput = document.getElementById("signnickname");
  var passwordInput = document.getElementById("signpassword");
  var confirmPasswordInput = document.getElementById("confirmPassword");
  var nameInput = document.getElementById("signname");
  var phoneInput = document.getElementById("signphone");
  var emailInput = document.getElementById("signemail");
  var organizationInput = document.getElementById("signorganization");

  opensignupModalBtn.addEventListener("click", function () {
    signupmodal.style.display = "block";
  });

  closesignupModalBtn.addEventListener("click", function () {
    // 추가: input 요소들의 값을 초기화
    userIDInput.value = "";
    nicknameInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    organizationInput.value = "";

    signupmodal.style.display = "none";
  });
}

//+비밀번호 확인 함수+
function validatePassword() {
  event.preventDefault();
  // 비밀번호와 확인 비밀번호 입력란의 값을 가져옴
  var password = document.getElementById("signpassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  // 비밀번호와 확인 비밀번호를 비교
  if (password !== confirmPassword) {
    // 일치하지 않을 경우 에러 메시지 표시
    var errorElement = document.getElementById("passwordMismatch");
    errorElement.textContent = "비밀번호가 일치하지 않습니다.";
    return false;
  }

  // 일치할 경우 에러 메시지 삭제
  var errorElement = document.getElementById("passwordMismatch");
  errorElement.textContent = "";

  // 아이디, 닉네임, 비밀번호, 이름, 휴대폰 번호, 이메일, 기관명을 가져옴
  var username = document.getElementById("signuserID").value;
  var nickname = document.getElementById("signnickname").value;
  var name = document.getElementById("signname").value;
  var phone = document.getElementById("signphone").value;
  var email = document.getElementById("signemail").value;
  var organization = document.getElementById("signorganization").value;

  // 가져온 값을 콘솔에 출력
  console.log("아이디:", username);
  console.log("닉네임:", nickname);
  console.log("비밀번호:", password);
  console.log("이름:", name);
  console.log("휴대폰 번호:", phone);
  console.log("이메일:", email);
  console.log("기관명:", organization);
  //   openconfirmPopup();
  openconfirmcancelPopup();
  return true; // 여기에서 true를 반환하면 form이 제출됨
}

function centerPopup(popup) {
  var screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  var popupWidth = popup.offsetWidth;
  var popupHeight = popup.offsetHeight;

  popup.style.left = (screenWidth - popupWidth) / 2 + "px";
  popup.style.top = (screenHeight - popupHeight) / 2 + "px";
}

// 확인 팝업 합수 --------------------------------------------------
function openconfirmPopup() {
  var confirmPopup = document.getElementById("confirmPopup");
  confirmPopup.style.display = "block";
  centerPopup(confirmPopup);
}

function closeconfirmPopup() {
  var confirmPopup = document.getElementById("confirmPopup");
  confirmPopup.style.display = "none";
}

function confirmpopupOk() {
  closeconfirmPopup();
}

// 확인 취소 팝업 합수 --------------------------------------------------
function openconfirmcancelPopup() {
  var confirmcancelPopup = document.getElementById("confirmcancelPopup");
  confirmcancelPopup.style.display = "block";
  centerPopup(confirmcancelPopup);
}

function closeconfirmcancelPopup() {
  var confirmcancelPopup = document.getElementById("confirmcancelPopup");
  confirmcancelPopup.style.display = "none";
}

function confirmcancelpopupCancel() {
  closeconfirmcancelPopup();
}

function confirmcancelpopupOk() {
  closeconfirmcancelPopup();
  //회원가입 완료 모달 띄우기
  openconfirmPopup();
}
