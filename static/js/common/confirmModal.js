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
