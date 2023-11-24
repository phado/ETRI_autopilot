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
// var modalTitle = " ";
// var modalMessage = "";
// openconfirmPopup(modalTitle, modalMessage);
function openconfirmPopup(modalTitle, modalMessage) {
  var confirmPopup = document.getElementById("confirmPopup");
  var titleElement = document.getElementById("confirmpopupTitle");
  var messageElement = document.getElementById("confirmpopupMessage");

  titleElement.textContent = modalTitle;
  messageElement.textContent = modalMessage;

  confirmPopup.style.display = "block";
  centerPopup(confirmPopup);
}

function closeconfirmPopup() {
  var confirmPopup = document.getElementById("confirmPopup");
  confirmPopup.style.display = "none";
}

function confirmpopupOk() {
  location.reload();
  closeconfirmPopup();
}

// 확인 취소 팝업 합수 --------------------------------------------------
// var modalTitle = " ";
// var modalMessage = "";
// openconfirmcancelPopup(modalTitle, modalMessage);
function openconfirmcancelPopup(modalTitle, modalMessage) {
  var confirmcancelPopup = document.getElementById("confirmcancelPopup");
  var titleElement = document.getElementById("confirmcancelpopupTitle");
  var messageElement = document.getElementById("confirmcancelpopupMessage");

  titleElement.textContent = modalTitle;
  messageElement.textContent = modalMessage;

  confirmcancelPopup.style.display = "block";
  centerPopup(confirmcancelPopup);
}

function confirmcancelpopupCancel() {
  closeconfirmcancelPopup();
}

function closeconfirmcancelPopup() {
  var confirmcancelPopup = document.getElementById("confirmcancelPopup");
  confirmcancelPopup.style.display = "none";
}

// 확인 취소 시 사용하는 곳 마다 다른 타이틀,메세지로 띄우기 위한 함수

// function confirmcancelpopupOk() {
//   closeconfirmcancelPopup();
//   var modalTitle = "";
//   var modalMessage = "";
//   openconfirmPopup(modalTitle, modalMessage);
// }

// 확인 취소 팝업 합수 --------------------------------------------------
