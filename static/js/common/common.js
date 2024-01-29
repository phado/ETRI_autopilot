// todo
let confirm_temp = "";

document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll(".toggle");

  toggles.forEach(function (toggle) {
    const ul = toggle.querySelector("ul");
    const userIcon = toggle.querySelector(".userIcon");

    toggle.addEventListener("click", function (event) {
      if (ul) {
        ul.style.display =
          ul.style.display === "none" || ul.style.display === ""
            ? "block"
            : "none";

        if (userIcon) {
          if (ul.style.display === "block") {
            userIcon.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 10.828L16.95 15.778L18.364 14.364L12 8L5.63601 14.364L7.05101 15.778L12.001 10.828L12 10.828Z" fill="#B7B7B7"/></svg>';
          } else {
            userIcon.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 13.172L16.95 8.222L18.364 9.636L12 16L5.63601 9.636L7.05101 8.222L12.001 13.172L12 13.172Z" fill="#B7B7B7"/></svg>';
          }
        }
      }

      event.stopPropagation();
    });

    const listItems = toggle.querySelectorAll("ul li");
    listItems.forEach(function (item) {
      item.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    });
  });

  document.addEventListener("click", function () {
    toggles.forEach(function (toggle) {
      const ul = toggle.querySelector("ul");
      const userIcon = toggle.querySelector(".userIcon");

      if (ul) {
        ul.style.display = "none";

        if (userIcon) {
          userIcon.style.display = "inline-block";
        }
      }
    });
  });
});
function showOverlayBox() {
  var overlayBox = document.getElementById("overlayBox");

  var imgUsername = document.querySelector(".img-username");
  var imgRect = imgUsername.getBoundingClientRect();

  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  overlayBox.style.top = imgRect.bottom + scrollTop + 6 + "px";
  overlayBox.style.left = imgRect.left - 12 + "px";

  overlayBox.style.display = "block";
}
function hideOverlayBox() {
  var overlayBox = document.getElementById("overlayBox");
  overlayBox.style.display = "none";
}

function profileClick(usr_idx) {
  var profileModal = document.getElementById("profileModal");
  profileModal.style.display = "block";
  fetch("/common/profileData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usr_idx: usr_idx,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      var userId = data.userInfo.userInfo[0][0];
      var userNick = data.userInfo.userInfo[0][1];
      var userName = data.userInfo.userInfo[0][2];
      var userPhone = data.userInfo.userInfo[0][3];
      var userEmail = data.userInfo.userInfo[0][4];
      var userEnter = data.userInfo.userInfo[0][5];
      document.getElementById("profileUserId").value = userId;
      document.getElementById("profileUserNick").value = userNick;
      document.getElementById("profileUserName").value = userName;
      document.getElementById("profileUserPhone").value = userPhone;
      document.getElementById("profileUserEmail").value = userEmail;
      document.getElementById("profileUserEnter").value = userEnter;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function closeProfileModal() {
  var profileModal = document.getElementById("profileModal");
  profileModal.style.display = "none";
}

function userLogout() {
  var modalTitle = "로그아웃";
  var modalMessage = "접속중인 환경에서 로그아웃을 하시겠습니까?";
  openconfirmcancelPopup(modalTitle, modalMessage);
}

function confirmcancelpopupOk() {
  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Logged out successfully") {
        window.location.href = "/";
      } else {
        console.error("Logout failed:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function passwordModify(usr_idx) {
  var newPassword = document.getElementById("newPassword").value;
  var newPasswordCheck = document.getElementById("newPasswordCheck").value;

  var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;

  if (passwordRegex.test(newPassword)) {
    if (newPassword == newPasswordCheck) {
      fetch("/resetPwd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usr_idx: usr_idx,
          new_pwd: newPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          var modalTitle = "비밀번호 변경";
          var modalMessage = "비밀번호가 변경되었습니다.";
          openconfirmPopup(modalTitle, modalMessage);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      var modalTitle = "비밀번호 변경";
      var modalMessage = "비밀번호가 일치하지 않습니다.";
      openconfirmPopup(modalTitle, modalMessage);
    }
  } else {
    var modalTitle = "비밀번호 변경";
    var modalMessage =
      "비밀번호는 다섯글자 이상, 숫자와 영어를 조합하여야 합니다.";
    openconfirmPopup(modalTitle, modalMessage);
  }
}

function userSecession(usr_idx) {
  var modalTitle = "사용자 탈퇴";
  var modalMessage = "회원님의 계정을 삭제하시겠습니까?";
  openconfirmcancelPopup2(modalTitle, modalMessage);
}

function confirmcancelpopupOk2(usr_idx) {
  fetch("/userSecession", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usr_idx: usr_idx,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      closeconfirmcancelPopup2();
      var modalTitle = "사용자 탈퇴";
      var modalMessage = "회원님의 정보가 삭제되었습니다.";
      openconfirmPopup(modalTitle, modalMessage);
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
