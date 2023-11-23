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
        cell1.innerHTML = labeler;

        var cell2 = row.insertCell(1);
        cell2.className = "detaildata-cell";
        cell2.innerHTML = checker;

        var cell3 = row.insertCell(2);
        cell3.className = "detaildata-cell";
        cell3.innerHTML = root;

        var cell4 = row.insertCell(3);
        cell4.className = "detaildata-cell";
        cell4.innerHTML = progress;

        var cell5 = row.insertCell(4);
        cell5.className = "detaildata-cell";
        cell5.innerHTML = allframe;

        var cell6 = row.insertCell(5);
        cell6.className = "detaildata-cell";
        cell6.innerHTML = "진행완료"; // 예시로 고정값 설정

        var cell7 = row.insertCell(6);
        cell7.className = "detaildata-cell";
        cell7.innerHTML = "검수완료";

        var cell8 = row.insertCell(7);
        cell8.className = "detaildata-cell";
        cell8.innerHTML = detail;
      }

      //   // 받아온 데이터를 이용하여 동적으로 테이블 생성
      //   for (var i = 0; i < data.length; i++) {
      //     var row = table.insertRow(-1); // 맨 끝에 행을 추가

      //     for (var j = 0; j < 8; j++) {
      //       var cell = row.insertCell(j);
      //       cell.className = "detaildata-cell";

      //       // 데이터를 설정
      //       switch (j) {
      //         case 0:
      //           cell.innerHTML = data[i].column1_key;
      //           break;
      //         case 1:
      //           cell.innerHTML = data[i].column2_key;
      //           break;
      //         // 나머지 열도 추가
      //         // ...

      //         default:
      //           break;
      //       }
      //     }
      //   }
    })
    .catch((error) => console.error("에러 발생:", error));
}

function closeDetailModal() {
  detailModal.style.display = "none";
}
