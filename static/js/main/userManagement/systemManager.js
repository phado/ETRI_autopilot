let user_idx = "";

function systemManagerModify(managerIdx) {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";

  fetch("/userManagement/systemManager/detailInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      managerIdx: managerIdx,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      var userId = data.systemManagerInfo[0][0];
      var nickname = data.systemManagerInfo[0][1];
      var organization = data.systemManagerInfo[0][2];
      var userName = data.systemManagerInfo[0][3];
      var phone = data.systemManagerInfo[0][4];
      var email = data.systemManagerInfo[0][5];
      var permisson = data.systemManagerInfo[0][6];
      user_idx = data.systemManagerInfo[0][7];

      var imageId;
      if (permisson == 1) {
        imageId = "box-image-1";
      } else if (permisson == 2) {
        imageId = "box-image-2";
      } else if (permisson == 3) {
        imageId = "box-image-3";
      }
      toggleImage(imageId);

      document.getElementById("userIdInput").value = userId;
      document.getElementById("nicknameInput").value = nickname;
      document.getElementById("organizationInput").value = organization;
      document.getElementById("userNameInput").value = userName;
      document.getElementById("phoneInput").value = phone;
      document.getElementById("emailInput").value = email;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function closeManagerModify() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
  location.reload();
}

var imageStates = [
  { id: "box-image-1", status: false },
  { id: "box-image-2", status: false },
  { id: "box-image-3", status: false },
];

var checkedImages = [];

function toggleImage(imageId) {
  var image = document.getElementById(imageId);
  var imageState = imageStates.find((state) => state.id === imageId);

  if (imageState.status) {
    image.src = "/static/image/box.svg";
    checkedImages = checkedImages.filter((id) => id !== imageId);
  } else {
    image.src = "/static/image/boxcheck.svg";
    checkedImages.push(imageId);
  }
  imageState.status = !imageState.status;
}

function logInputValues() {
  // var userId = document.getElementById("userIdInput").value;
  // var nickname = document.getElementById("nicknameInput").value;
  // var organization = document.getElementById("organizationInput").value;
  // var userName = document.getElementById("userNameInput").value;
  // var phone = document.getElementById("phoneInput").value;
  // var email = document.getElementById("emailInput").value;

  var modalTitle = "관리자 권한 변경";
  var modalMessage = "관리자 권한을 변경하시겠습니까?";
  openconfirmcancelPopup(modalTitle, modalMessage);
}

function systemManagerConfirmcancelpopupOk() {
  const permissions = checkedImages.map((imageName) => {
    const permissionNumber = parseInt(imageName.split("-")[2]);
    return permissionNumber;
  });

  const requestData = {
    permissions: permissions,
    user_idx: user_idx,
  };
  fetch("/userManagement/systemManager/changePermission", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      closeconfirmcancelPopup();
      var modalTitle = "관리자 권한 변경";
      var modalMessage = "관리자 권한 변경이 완료되었습니다.";
      openconfirmPopup(modalTitle, modalMessage);
      checkedImages = "";
      user_idx = "";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
