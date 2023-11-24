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

        // labeler, allframe, progress, complete, detail을 for문을 통해 추가
        var labeler = data.data_set_labeler_info[i][0];
        var allframe = data.data_set_labeler_info[i][3];
        var progress =
          Math.round(
            (data.data_set_labeler_info[i][3] /
              data.data_set_labeler_info[i][2]) *
              10
          ) + "%";

        var complete = data.data_set_labeler_info[i][4];
        var detail = data.data_set_labeler_info[i][8];

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
        cell4.innerHTML = root;

        var cell5 = row.insertCell(4);
        cell5.className = "detaildata-cell";
        cell5.id = "cell-sub";
        cell5.innerHTML = progress;

        // todo
        var cell6 = row.insertCell(5);
        cell6.className = "detaildata-cell";
        cell6.id = "cell-sub";
        cell6.innerHTML = allframe;

        var cell7 = row.insertCell(6);
        cell7.className = "detaildata-cell";
        cell7.id = "cell-sub";
        cell7.innerHTML = "진행완료";

        var cell8 = row.insertCell(7);
        cell8.className = "detaildata-cell";
        cell8.innerHTML = "검수완료";

        var cell9 = row.insertCell(8);
        cell9.className = "detaildata-cell";
        cell9.id = "cell-sub";
        cell9.innerHTML = detail;
      }
    })
    .catch((error) => console.error("에러 발생:", error));
}

function deleteDatasetSend(datasetIdx, datasetName) {
  openconfirmcancelPopup();
}

function closeDetailModal(datasetIdx, datasetname) {
  detailModal.style.display = "none";
}

// ------------------------------------------------------------------------
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
    })
    .catch((error) => {
      // 오류 처리
      console.error("오류 발생:", error);
    });
}
