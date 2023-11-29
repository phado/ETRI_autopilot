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

function profileClick() {
  var profileModal = document.getElementById("profileModal");
  profileModal.style.display = "block";
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
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
