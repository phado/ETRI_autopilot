function detailOpenModal(datasetIdx, datasetname) {
  var titleElement = document.querySelector(".detailmodal-title-name");
  titleElement.textContent = "[" + datasetIdx + "]" + "  " + datasetname;

  var detailModal = document.getElementById("detailModal");
  detailModal.style.display = "block";

  var tbody = document.getElementById("detailDatamanagement");

  // 기존 행 제거
  while (tbody.rows.length > 0) {
    tbody.deleteRow(0);
  }

  // AJAX를 통해 서버에서 데이터 받아오기
  fetch("/dataManagement/dataSetDetail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ datasetIdx: datasetIdx }),
  })
    .then((response) => response.json())
    .then((data) => {
      for (var i = 0; i < data.data_set_labeler_info.length; i++) {
        // root와 checker는 고정값으로 설정
        var root = data.data_set_info[0][0]; // 고정값 설정
        var checker = data.data_set_info[0][1]; // 고정값 설정

        var labeler = data.data_set_labeler_info[i][0];
        var progress = data.data_set_labeler_info[i][2];
        var allframe = data.data_set_labeler_info[i][3];
        var complete = data.data_set_labeler_info[i][4];
        var inspect = data.data_set_labeler_info[i][5];
        var issue = data.data_set_labeler_info[i][6];

        // 새로운 행을 생성하고 각 셀에 데이터 추가
        var row = tbody.insertRow(-1);

        var cell1 = row.insertCell(0);
        cell1.className = "detaildata-cell";
        cell1.id = "cell-sub";
        cell1.innerHTML = i + 1;

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
        cell4.id = "cell-sub";

        var root = "112.167.170.54:31769"; // 예시로 주어진 root 값
        var baseUrl = "http://localhost:5000/"; // 기본 URL 값

        // 만약 root에 baseUrl이 포함되어 있다면 제거
        if (root.includes(baseUrl)) {
          root = root.replace(baseUrl, "");
        }

        var link = document.createElement("a");
        link.href = "http://" + root; // http:// 가 없는 경우 추가
        link.textContent = root; // 링크에 표시될 텍스트

        cell4.appendChild(link);

        var cell5 = row.insertCell(4);
        cell5.className = "detaildata-cell";
        cell5.id = "cell-sub";
        cell5.innerHTML = progress;

        // todo
        var cell6 = row.insertCell(5);
        cell6.className = "detaildata-cell";
        cell6.id = "cell-sub";
        cell6.innerHTML = allframe;

        //진행 완료 컬럼
        var completestatus;
        if (complete == 1) {
          completestatus = "라벨링 완료";
        } else if (complete == 5) {
          completestatus = "라벨링 진행중";
        } else {
          completestatus = "기타 상태";
        }
        var cell7 = row.insertCell(6);
        cell7.className = "detaildata-cell";
        cell7.id = "cell-sub";

        var button = document.createElement("button");
        button.textContent = completestatus;
        button.id = "dateset-progress-detail-button";

        if (complete == 1) {
          // complete가 1일 때 버튼 배경색 변경
          button.style.backgroundColor = "#526EFF";
        }
        cell7.appendChild(button);

        //검수 완료 컬럼
        var status;

        if (inspect == 0) {
          status = "상태없음";
        } else if (inspect == 1) {
          status = "라벨링 완료";
        } else if (inspect == 2) {
          status = "검수 진행";
        } else if (inspect == 3) {
          status = "검수 완료";
        } else if (inspect == 4) {
          status = "검수 이슈";
        } else if (inspect == 5) {
          status = "라벨링 진행";
        } else {
          status = "기타 상태";
        }
        var cell8 = row.insertCell(7);
        cell8.className = "detaildata-cell";
        cell8.id = "cell-sub";

        var button = document.createElement("button");
        button.textContent = status;
        button.id = "dateset-inspect-detail-button";

        if (inspect == 3) {
          button.style.backgroundColor = "#526EFF";
        }
        cell8.appendChild(button);

        var cell9 = row.insertCell(8);
        cell9.className = "detaildata-cell";
        cell9.id = "cell-sub";
      }

      // 클릭 이벤트 리스너 추가
      button.addEventListener(
        "click",
        (function (datasetIdx, datasetname, labeler) {
          return function () {
            // 이벤트 핸들러에서 할 일 작성
            alert(datasetIdx + datasetname + labeler);
            // 예시: 클릭 시 다른 동작을 하도록 할 경우
            // 다른 함수 호출이나 원하는 작업을 여기에 추가
            // 예: handleInspectButtonClick();
          };
        })(datasetIdx, datasetname, labeler)
      );
    })
    .catch((error) => console.error("에러 발생:", error));
}

function closeDetailModal() {
  detailModal.style.display = "none";
}

//삭제 아이콘 클릭 시 데이터셋 삭제 함수
function deleteDatasetSend(company_name, project_name) {
  confirm_temp = [company_name, project_name];

  var modalTitle = "삭제 확인";
  var modalMessage = project_name + "의 모든 데이터를 삭제하시겠습니까?";
  openconfirmcancelPopup(modalTitle, modalMessage);
}

//삭제 시 나오는 모달 관련 함수
function confirmcancelpopupOk() {
  // 삭제 api 호출
  company_name = confirm_temp[0];
  project_name = confirm_temp[1];

  var apiUrl = "http://112.167.170.54:7080/api/delete_labelling_tool";
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company_name: company_name,
      project_name: project_name,
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

// ------------------------------------------------------------------------------------------------
// 데이터셋 생성
function openCreateModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}

function closeCreateModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function datasetCreateSend(company_name) {
  var project_name = document.getElementById("datasetNameInput").value;

  // todo
  var labelerInput = document.getElementById("labelerInput").value;
  var labeler_nick = labelerInput.split("\n").map(function (item) {
    return item.trim();
  });

  var inp_nick = document.getElementById("checkerInput").value;

  var jsonData = {
    company_name: company_name,
    project_name: project_name,
    labeler_nick: labeler_nick,
    inp_nick: inp_nick,
  };

  var apiUrl = "http://192.168.0.187:7080/api/create_labelling_tool";

  showLoading();
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => response.json())
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
      // 로딩 숨김
      closeconfirmPopup();

      console.error("오류 발생:", error);
    });
}
function showLoading() {
  var modalTitle = "데이터셋 저장";
  var modalMessage = "데이터셋 저장이 진행중입니다.";
  openconfirmPopup(modalTitle, modalMessage);
}

// ------------------------------------------------------------------------------------------------
// 데이터셋 생성 모달
function onLabelerAddButtonClick(grp_idx) {
  // 라벨러 추가 텍스트를 변경
  var labelerAddText = "라벨러 추가";
  document.getElementById("findPersonTitle").textContent = labelerAddText;

  fetch("/dataManagement/getLabeler", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grp_idx }),
  })
    .then((response) => response.json())
    .then((data) => {
      var labelerList = data.labeler_list;
      var labelerDiv = document.getElementById("labelerAll");

      // 각 labeler에 대한 버튼을 생성하여 div에 추가
      labelerList.forEach(function (labeler) {
        var button = document.createElement("button");
        button.className = "labeler-btn";
        button.textContent = labeler;
        button.addEventListener("click", function () {
          // 버튼이 클릭되면 해당 labeler를 div에 추가
          labelerDiv.textContent += labeler + " ";
        });

        // 버튼을 모달 창의 div 안에 추가
        labelerDiv.appendChild(button);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
