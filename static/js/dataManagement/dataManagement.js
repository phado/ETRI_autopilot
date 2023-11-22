document.addEventListener("DOMContentLoaded", function () {
  var toggleLiElements = document.querySelectorAll(".toggle-li");

  toggleLiElements.forEach(function (toggleLiElement) {
    toggleLiElement.addEventListener("click", function () {
      var nestedUl = toggleLiElement.querySelector(".nested-ul");
      nestedUl.classList.toggle("show");
    });
  });

  var dataManagementtablejson =
    '[{"datasetName":"Dataset 1","organization":"Organization A","workflowStatus":"In progress","reviewStatus":"Pending","firstRegisteredDate":"2023-01-01","lastModifiedDate":"2023-01-15"},{"datasetName":"Dataset 2","organization":"Organization B","workflowStatus":"Completed","reviewStatus":"Approved","firstRegisteredDate":"2023-02-10","lastModifiedDate":"2023-03-05"},{"datasetName":"Dataset 3","organization":"Organization C","workflowStatus":"In progress","reviewStatus":"Pending","firstRegisteredDate":"2023-03-20","lastModifiedDate":"2023-04-02"}]';

  // JSON 문자열을 JavaScript 객체(배열)로 파싱
  var parsedData = JSON.parse(dataManagementtablejson);

  var tableBody = document.getElementById("tableBody");

  if (!tableBody) {
    tableBody = document.createElement("tbody");
    tableBody.id = "tableBody";
    document.querySelector(".data-table").appendChild(tableBody);
  }

  parsedData.forEach(function (dataset, index) {
    var newRow = tableBody.insertRow(index);

    var cells = [
      "datasetName",
      "organization",
      "workflowStatus",
      "reviewStatus",
      "firstRegisteredDate",
      "lastModifiedDate",
    ];

    cells.forEach(function (property) {
      var cell = newRow.insertCell();
      cell.textContent = dataset[property];
      // if (property === "datasetName") {
      //   var container = document.createElement("div");

      //   var image = document.createElement("img");
      //   image.src = "/static/image/box.svg"; // Update the path accordingly
      //   image.style.position = "absolute";
      //   image.style.marginLeft = "-39px";
      //   image.style.marginTop = "-3px";

      //   var textNode = document.createTextNode(dataset[property]);

      //   container.appendChild(image);
      //   container.appendChild(textNode);

      //   cell.appendChild(container);
      // }

      // // For other cells, set the text content or dataset property
      // else {
      //   cell.textContent = dataset[property];
      // }
      cell.id = property;
    });

    var detailCell = newRow.insertCell();
    var detailImage = document.createElement("img");
    detailImage.src = "/static/image/detail.svg";
    detailImage.id = "openDetailModalBtn";
    detailCell.appendChild(detailImage);

    detailImage.addEventListener("click", function () {
      openDetailModal(dataset.datasetName);
    });

    var deleteCell = newRow.insertCell();
    var deleteImage = document.createElement("img");
    deleteImage.src = "/static/image/modify.svg";
    deleteCell.appendChild(deleteImage);
  });
});

//상세정보 모달 띄우는 함수
function openDetailModal(datasetName) {
  console.log("Open detail modal for datasetName:", datasetName);
  var detailModal = document.getElementById("detailModal");
  var openDetailModalBtn = document.getElementById("openDetailModalBtn");
  var closeDetailModalBtn = document.getElementById("closeDetailModalBtn");

  openDetailModalBtn.addEventListener("click", function () {
    detailModal.style.display = "block";
  });

  closeDetailModalBtn.addEventListener("click", function () {
    detailModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == detailModal) {
      detailModal.style.display = "none";
    }
  });

  //데이터셋명을 가지고 와서 title에 넣어줌
  var detailModalTitle = document.querySelector(".detailmodal-title-name");
  detailModalTitle.textContent = "[" + datasetName + "] 상세정보";
}
