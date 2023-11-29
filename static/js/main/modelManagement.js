function detailOpenModal(modelIdx, modelname) {
  var titleElement = document.querySelector(".detailmodal-title-name");
  titleElement.textContent = "[" + modelIdx + "]" + "  " + modelname;

  var detailModal = document.getElementById("detailModal");
  detailModal.style.display = "block";

  var tbody = document.getElementById("detailModelManagement");

  // 기존 행 제거
  while (tbody.rows.length > 0) {
    tbody.deleteRow(0);
  }
  fetch("/modelManagement/ModelDetail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ modelIdx: modelIdx }),
  })
    .then((response) => response.json())
    .then((data) => {
      for (var i = 0; i < data.model_detail_info.length; i++) {
        var labeler = data.model_detail_info[i][0];
        var checker = data.model_detail_info[i][1];
        var root = data.model_detail_info[i][2];

        var row = tbody.insertRow(-1);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = i + 1;
        cell1.style.width = "20px";
        cell1.id = "cell-sub";
        var cell2 = row.insertCell(1);
        cell2.className = "detaildata-cell";
        cell2.id = "cell-sub";
        cell2.innerHTML = labeler;
        var cell3 = row.insertCell(2);
        cell3.className = "detaildata-cell";
        cell3.id = "cell-sub";
        cell3.innerHTML = checker;
        var cell4 = row.insertCell(3);
        cell4.className = "detaildata-cell";
        var baseUrl = "http://localhost:5000/";
        if (root.includes(baseUrl)) {
          root = root.replace(baseUrl, "");
        }
        var link = document.createElement("a");
        link.href = "http://" + root; // http:// 가 없는 경우 추가
        link.textContent = root; // 링크에 표시될 텍스트

        cell4.appendChild(link);
      }
    })
    .catch((error) => console.error("에러 발생:", error));
}
//삭제 아이콘 클릭 시 모델셋 삭제 함수
function deleteModelsetSend(company_name, project_name, data_set) {
  confirm_temp = [company_name, project_name, data_set];

  var modalTitle = "삭제 확인";
  var modalMessage = project_name + "의 모든 데이터를 삭제하시겠습니까?";
  openconfirmcancelPopup(modalTitle, modalMessage);
}

function closeDetailModal() {
  var detailModal = document.getElementById("detailModal");
  var closeDetailModalBtn = document.getElementById("closeDetailModalBtn");

  detailModal.style.display = "none";
}

//삭제 시 나오는 모달 관련 함수
function confirmcancelpopupOk() {
  // 삭제 api 호출
  company_name = confirm_temp[0];
  project_name = confirm_temp[1];
  data_set = confirm_temp[2];

  var apiUrl = "http://112.167.170.54:7080/api/delete_dev_model";
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company_name: company_name,
      project_name: project_name,
      data_set: data_set,
    }),
  })
    .then((response) => response.json()) // 응답을 JSON으로 변환
    .then((data) => {
      console.log("서버 응답:", data);
    })
    .catch((error) => {
      // 오류 처리
      console.error("오류 발생:", error);
    });

  confirm_temp = "";
  closeconfirmcancelPopup();
  var modalTitle = "삭제 확인";
  var modalMessage = "삭제가 완료되었습니다.";
  openconfirmPopup(modalTitle, modalMessage);
}

// ------------------------------------------------------------------------
// 모델셋 생성

function toggleSearch(searchType) {
  var basicAll = document.getElementById("basicAll");
  var basicButton = document.getElementById("basicButton");

  var developerAll = document.getElementById("developerAll");
  var developerButton = document.getElementById("developerButton");

  var datasetAll = document.getElementById("datasetAll");
  var datasetButton = document.getElementById("datasetButton");

  // 모든 요소에 hidden 클래스 추가
  [
    basicAll,
    basicButton,
    developerAll,
    developerButton,
    datasetAll,
    datasetButton,
  ].forEach(function (element) {
    element.classList.add("hidden");
  });

  // 선택된 요소에 hidden 클래스 제거
  if (searchType === "developer") {
    developerAll.classList.remove("hidden");
    developerButton.classList.remove("hidden");
  } else if (searchType === "dataset") {
    datasetAll.classList.remove("hidden");
    datasetButton.classList.remove("hidden");
  } else {
    basicAll.classList.remove("hidden");
    basicButton.classList.remove("hidden");
  }
}

var datasetList = null;
function getDataSet(grp_idx) {
  var labelerAddText = "데이터셋 추가";
  document.getElementById("findTitle").textContent = labelerAddText;
  toggleSearch("dataset");
  if (!datasetList) {
    fetch("/modelManagement/getDataSet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ grp_idx }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // datasetList  = data.dataset_list.dataset_list
        datasetList = ["데이터셋1", "데이터셋2", "데이터셋3", "데이터셋4"];
        var datasetAllElement = document.getElementById("datasetAll");
        var datasetNameElement = document.getElementById("dataset-name");
        var selectedButton = null; // 이전에 선택한 버튼을 저장할 변수

        datasetList.forEach(function (dataset) {
          var button = document.createElement("button");
          button.className = "dataset-btn";
          button.textContent = dataset;
          button.addEventListener("click", function () {
            datasetNameElement.value = dataset;

            if (selectedButton) {
              datasetAllElement.appendChild(selectedButton);
            }

            this.remove();

            selectedButton = this;
          });

          datasetAllElement.appendChild(button);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
function resetElements() {
  var labelerAddText = "설정";
  document.getElementById("findTitle").textContent = labelerAddText;
  toggleSearch("");
}
function openCreateModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}

function closeCreateModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
  location.reload();
}

function modelsetCreateSend(company_name) {
  var project_name = document.getElementById("modelsetNameInput").value;
  // // todo
  var devel_nick = selectedDevelopers;
  var data_set = document.getElementById("dataset-name").value;

  var jsonData = {
    company_name: company_name,
    project_name: project_name,
    devel_nick: devel_nick,
    data_set: data_set,
  };

  var apiUrl = "http://112.167.170.54:7080/api/create_dev_model";

  showLoading();
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => response.json()) // 응답을 JSON으로 변환
    .then((data) => {
      // 서버 응답 처리
      console.log("서버 응답:", data);

      // 로딩 숨김
      closeconfirmPopup();

      if (data.state_code == "90") {
        closeCreateModal();
        var modalTitle = "데이터셋 추가 완료";
        var modalMessage = "데이터셋 추가가 성공적으로 완료되었습니다.";
        openconfirmPopup(modalTitle, modalMessage);
        selectedDevelopers = "";
      }
    })
    .catch((error) => {
      // 오류 처리
      closeconfirmPopup();

      console.error("오류 발생:", error);
    });

  function showLoading() {
    var modalTitle = "데이터셋 저장";
    var modalMessage = "데이터셋 저장이 진행중입니다.";
    openconfirmPopup(modalTitle, modalMessage);
  }
}

// 모델 생성 모달
let selectedDevelopers = [];

function onDevloperAddButtonClick(grp_idx) {
  // 개발자 추가 텍스트를 변경
  var labelerAddText = "개발자 추가";
  document.getElementById("findTitle").textContent = labelerAddText;
  toggleSearch("developer");

  fetch("/modelManagement/getDevloper", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grp_idx }),
  })
    .then((response) => response.json())
    .then((data) => {
      var developerList = data.devloper_list;

      var developerAllElement = document.getElementById("developerAll");
      var developerElement = document.getElementById("developer");

      developerAllElement.innerHTML = "";
      developerList.forEach(function (developer) {
        var button = document.createElement("button");
        button.className = "developer-btn";
        button.textContent = developer;
        button.id = "developer-button-" + developer.replace(/\s+/g, "_"); // Generate unique id

        button.addEventListener("click", function () {
          if (this.parentElement === developerAllElement) {
            developerElement.appendChild(this);
            selectedDevelopers.push(developer); // 선택된 개발자를 리스트에 추가
          } else {
            developerAllElement.appendChild(this);
            selectedDevelopers = selectedDevelopers.filter(
              (dev) => dev !== developer
            ); // 선택 해제된 개발자를 리스트에서 제거
          }

          console.log(selectedDevelopers);
        });

        developerAllElement.appendChild(button);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
