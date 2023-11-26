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
        cell4.innerHTML = root;
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
function openCreateModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}

function closeCreateModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function modelsetCreateSend(company_name) {
  var project_name = document.getElementById("modelsetNameInput").value;
  // var project_name = document.getElementById("datasetNameInput").value;

  // // todo
  var developerInput = document.getElementById("developer").value;
  var devel_nick = developerInput.split("\n").map(function (item) {
    return item.trim();
  });

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
function onDevloperAddButtonClick(grp_idx) {
  // 개발자 추가 텍스트를 변경
  // var labelerAddText = "개발자 추가";
  // document.getElementById("findPersonTitle").textContent = labelerAddText;

  fetch("/modelManagement/getDevloper", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grp_idx }),
  })
    .then((response) => response.json())
    .then((data) => {
      var devloperList = data.devloper_list;
      var devloperDiv = document.getElementById("devloperAll");

      // 각 labeler에 대한 버튼을 생성하여 div에 추가
      devloperList.forEach(function (devloper) {
        var button = document.createElement("button");
        button.className = "devloper-btn";
        button.textContent = devloper;
        // button.addEventListener("click", function () {
        //   // 버튼이 클릭되면 해당 labeler를 div에 추가
        //   labelerDiv.textContent += labeler + " ";
        // });

        // 버튼을 모달 창의 div 안에 추가
        devloperDiv.appendChild(button);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}