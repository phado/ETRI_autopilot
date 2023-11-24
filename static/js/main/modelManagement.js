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
        var checker = "검수자";
        var root = data.model_detail_info[i][2];

        var row = tbody.insertRow(-1);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = i + 1;
        cell1.style.width = "20px";
        cell1.style.borderRight = "1px solid #c5c5c5";
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

function closeDetailModal() {
  var detailModal = document.getElementById("detailModal");
  var closeDetailModalBtn = document.getElementById("closeDetailModalBtn");

  detailModal.style.display = "none";
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

  var apiUrl = "http://192.168.0.187:7080/api/create_dev_model";

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
