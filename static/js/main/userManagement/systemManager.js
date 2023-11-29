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
  var userId = document.getElementById("userIdInput").value;
  var nickname = document.getElementById("nicknameInput").value;
  var organization = document.getElementById("organizationInput").value;
  var userName = document.getElementById("userNameInput").value;
  var phone = document.getElementById("phoneInput").value;
  var email = document.getElementById("emailInput").value;

  console.log("User ID:", userId);
  console.log("Nickname:", nickname);
  console.log("Organization:", organization);
  console.log("User Name:", userName);
  console.log("Phone Number:", phone);
  console.log("Email:", email);
  console.log(checkedImages);
}
