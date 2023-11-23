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

function closeSignupModal() {
  var signupmodal = document.getElementById("signupModal");
  var userIDInput = document.getElementById("signuserID");
  var nicknameInput = document.getElementById("signnickname");
  var passwordInput = document.getElementById("signpassword");
  var confirmPasswordInput = document.getElementById("confirmPassword");
  var nameInput = document.getElementById("signname");
  var phoneInput = document.getElementById("signphone");
  var emailInput = document.getElementById("signemail");
  var organizationInput = document.getElementById("signorganization");
  userIDInput.value = "";
  nicknameInput.value = "";
  passwordInput.value = "";
  confirmPasswordInput.value = "";
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  organizationInput.value = "";

  signupmodal.style.display = "none";
}
//+비밀번호 확인 함수+
async function validatePassword() {
  // 비밀번호와 확인 비밀번호 입력란의 값을 가져옴
  var password = document.getElementById("signpassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    var errorElement = document.getElementById("passwordMismatch");
    errorElement.textContent = "비밀번호가 일치하지 않습니다.";
    return false;
  }

  var errorElement = document.getElementById("passwordMismatch");
  errorElement.textContent = "";

  var username = document.getElementById("signuserID").value;
  var nickname = document.getElementById("signnickname").value;
  var password = document.getElementById("signpassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;
  var name = document.getElementById("signname").value;
  var phone = document.getElementById("signphone").value;
  var email = document.getElementById("signemail").value;
  var organization = document.getElementById("signorganization").value;

  var formData = {
    userId: username,
    usrNickName: nickname,
    usrPwd: password,
    usrName: name,
    usrPhone: phone,
    usrEmail: email,
    usrAgency: organization,
  };

  // Fetch API를 사용하여 서버로 데이터 전송
  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message == "success") {
        //confirm 모달을 띄우면서 회원가입 모달 없앰
        var modalTitle = "회원가입 완료 ";
        var modalMessage = "회원가입이 성공적으로 완료되었습니다.";
        openconfirmPopup(modalTitle, modalMessage);
        closeSignupModal();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return true; // 여기에서 true를 반환하면 form이 제출됨
}
