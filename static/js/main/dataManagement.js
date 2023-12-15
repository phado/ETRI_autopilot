function detailOpenModal(datasetIdx, datasetname) {
  var totalAllFrame = 0;
  var progressAllFrame = 0;

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
        cell1.style.width = "60px";

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

        var root = data.data_set_info[0][0];
        var baseUrl = "http://localhost:5000/";

        if (root.includes(baseUrl)) {
          root = root.replace(baseUrl, "");
        }

        var link = document.createElement("a");
        link.textContent = root;

        link.onclick = function () {
          var detailModal = document.getElementById("detailModal");
          detailModal.style.display = "none";
          var iframeModal = document.getElementById("iframeModal");
          iframeModal.style.display = "block";

          var iframeData = iframeModal.querySelector(".iframe-data");
          iframeData.innerHTML = "";

          var newIframe = document.createElement("iframe");
          newIframe.src = "http://" + root;

          newIframe.style.width = "100%";
          newIframe.style.height = "100%";
          newIframe.style.border = "none";

          iframeData.appendChild(newIframe);
        };

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
        /*
        if (complete == 1) {
          completestatus = "라벨링 완료";
        } else if (complete == 5) {
          completestatus = "라벨링 진행중";
        } else {
          completestatus = "기타 상태";
        }
        * */
        if (complete == 1) {
          completestatus = "라벨링 완료";
        } else if (complete == 5) {
          completestatus = "라벨링 진행중";
        } else {
          completestatus = "라벨링 진행중";
        }
        var cell7 = row.insertCell(6);
        cell7.className = "detaildata-cell";
        cell7.id = "cell-sub";

        var button1 = document.createElement("button");
        button1.classList.add(labeler, "labeled", complete);
        button1.textContent = completestatus;
        button1.id = "dateset-progress-detail-button";

        if (complete == 1) {
          // complete가 1일 때 버튼 배경색 변경
          button1.style.backgroundColor = "#526EFF";
        }
        cell7.appendChild(button1);

        button1.addEventListener(
          "click",
          (function (datasetIdx, datasetname, labeler) {
            return function () {
              // 이벤트 핸들러에서 할 일 작성
              // alert(datasetIdx + datasetname + labeler);

              fetch("/modelManagement/changeLabelingDone", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  usr_nick: labeler,
                  ds_name: datasetname,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.labeler.fixed_labeler[0][2] == 1) {
                    var change_bt_sty = document.querySelectorAll(
                      "." + labeler + ".labeled"
                    );
                    change_bt_sty[0].style.backgroundColor = "#526EFF";
                    change_bt_sty[0].innerText = "라벨링 완료";
                  }
                  if (data.labeler.dataset_labeled_fixed == 1) {
                    console.log("프로젝트 전체 라벨링 완료");
                  }
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            };
          })(datasetIdx, datasetname, labeler)
        );

        //검수 완료 컬럼
        var status;
        /*
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
        * */
        if (inspect == 0) {
          status = "검수 진행";
        } else if (inspect == 1) {
          status = "검수 진행";
        } else if (inspect == 2) {
          status = "검수 진행";
        } else if (inspect == 3) {
          status = "검수 완료";
        } else if (inspect == 4) {
          status = "검수 진행";
        } else if (inspect == 5) {
          status = "검수 진행";
        } else {
          status = "검수 진행";
        }
        var cell8 = row.insertCell(7);
        cell8.className = "detaildata-cell";
        cell8.id = "cell-sub";

        var button2 = document.createElement("button");
        button2.classList.add(labeler, "confrim", inspect);
        button2.textContent = status;
        button2.id = "dateset-inspect-detail-button";

        if (inspect == 3) {
          button2.style.backgroundColor = "#526EFF";
        }
        cell8.appendChild(button2);

        // 클릭 이벤트 리스너 추가
        button2.addEventListener(
          "click",
          (function (datasetIdx, datasetname, labeler) {
            return function () {
              // 이벤트 핸들러에서 할 일 작성
              // alert(datasetIdx + datasetname + labeler);

              fetch("/modelManagement/changeConfirmDone", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  usr_nick: labeler,
                  ds_name: datasetname,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.labeler.fixed_labeler[0][2] == 3) {
                    var change_bt_sty = document.querySelectorAll(
                      "." + labeler + ".confrim"
                    );
                    change_bt_sty[0].style.backgroundColor = "#526EFF";
                    change_bt_sty[0].innerText = "검수 완료";
                  }
                  if (data.labeler.dataset_confrim_fixed == 1) {
                    console.log("프로젝트 전체 검수 완료");
                  }
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            };
          })(datasetIdx, datasetname, labeler)
        );
        var cell9 = row.insertCell(8);
        cell9.className = "detaildata-cell";
        cell9.id = "cell-sub";
        totalAllFrame += parseInt(allframe, 10);
        progressAllFrame += parseInt(progress, 10);
      }
      var progressFramesElement = document.getElementById("progressFrames");
      progressFramesElement.textContent = progressAllFrame;
      var totalFramesElement = document.getElementById("totalFrames");
      totalFramesElement.textContent = totalAllFrame;
    })
    .catch((error) => console.error("에러 발생:", error));
}

function closeDetailModal() {
  detailModal.style.display = "none";
  location.reload();
}
function closeiframeModal() {
  var iframeModal = document.getElementById("iframeModal");
  iframeModal.style.display = "none";
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
  var parentElement = document.querySelector(".labeler-add-textarea");
  var buttons = parentElement.querySelectorAll("button");
  buttons.forEach(function (button) {
    button.remove();
  });
}

function closeCreateModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
  location.reload();
}

function datasetCreateSend(company_name) {
  var project_name = document.getElementById("datasetNameInput").value;

  // todo
  var labelerInput = document.getElementById("labelerInput").value;
  var labeler_nick = labelerInput.split("\n").map(function (item) {
    return item.trim();
  });
  var labeler_nick = labelerListInInput;

  var inp_nick = document.getElementById("checkerInput").value;

  var jsonData = {
    company_name: company_name,
    project_name: project_name,
    labeler_nick: labeler_nick,
    inp_nick: inp_nick,
  };

  var apiUrl = "http://112.167.170.54:7080/api/create_labelling_tool";

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
// 데이터셋 생성 모달
let labelerAddButtonState = false;
let labelerListInInput = []; // 추가된 labeler 리스트
function toggleSearch(searchType) {
  var basicTextarea = document.getElementById("basicAll");
  var basicButton = document.getElementById("basicButton");

  var labelerTextarea = document.getElementById("labelerAll");
  var labelerButton = document.getElementById("labelerButton");

  var checkerTextarea = document.getElementById("checkerAll");
  var checkerButton = document.getElementById("checkerButton");

  // 모든 요소에 hidden 클래스 추가
  [
    basicTextarea,
    basicButton,
    labelerTextarea,
    labelerButton,
    checkerTextarea,
    checkerButton,
  ].forEach(function (element) {
    element.classList.add("hidden");
  });

  // 선택된 요소에 hidden 클래스 제거
  if (searchType === "labeler") {
    labelerTextarea.classList.remove("hidden");
    labelerButton.classList.remove("hidden");
  } else if (searchType === "checker") {
    checkerTextarea.classList.remove("hidden");
    checkerButton.classList.remove("hidden");
  } else {
    basicTextarea.classList.remove("hidden");
    basicButton.classList.remove("hidden");
  }
}
function onLabelerAddButtonClick(grp_idx) {
  toggleSearch("labeler");
  var labelerAddText = "라벨러 추가";
  document.getElementById("findPersonTitle").textContent = labelerAddText;
  if (!labelerAddButtonState) {
    // 라벨러 추가 텍스트를 변경
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
        var labelerInput = document.getElementById("labelerInput");

        // 클릭된 버튼의 내용을 labelerInput에 추가하는 함수
        function addButtonToLabelerInput(button) {
          if (labelerInput) {
            // 기존 ID로부터 새로운 ID 생성
            var newButtonId = button.id.startsWith("btn_")
              ? "input_" + button.id.substring(4)
              : button.id.startsWith("input_")
              ? "btn_" + button.id.substring(6)
              : "input_" + button.textContent.replace(/\s+/g, "_");

            // 새로운 ID로 변경
            button.id = newButtonId;

            // 추가된 labeler를 리스트에 저장
            labelerListInInput.push(button.textContent);

            // 새로운 위치로 이동
            if (newButtonId.startsWith("btn_")) {
              labelerDiv.appendChild(button);
              // Remove label from labelerListInInput when moved to labelerDiv
              labelerListInInput = labelerListInInput.filter(
                (label) => label !== button.textContent
              );
            } else {
              labelerInput.appendChild(button);
            }
          }
        }

        // 각 labeler에 대한 버튼을 생성하여 div에 추가
        labelerList.forEach(function (labeler) {
          var button = document.createElement("button");
          button.className = "labeler-btn";
          button.textContent = labeler;
          button.id = "btn_" + labeler.replace(/\s+/g, "_"); // 공백을 언더스코어로 대체하여 아이디로 사용
          button.addEventListener("click", function () {
            addButtonToLabelerInput(button);
          });

          // 버튼을 모달 창의 div 안에 추가
          if (labelerDiv) {
            labelerDiv.appendChild(button);
          }
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    labelerAddButtonState = true;
  }
}
function resetElements() {
  var labelerAddText = "설정";
  document.getElementById("findPersonTitle").textContent = labelerAddText;
  toggleSearch("");
}

var removedCheckerButton = null;
function onCheckerAddButtonClick(grp_idx) {
  var labelerAddText = "검수자 추가";
  document.getElementById("findPersonTitle").textContent = labelerAddText;
  toggleSearch("checker");

  fetch("/dataManagement/getInspector", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grp_idx }),
  })
    .then((response) => response.json())
    .then((data) => {
      var inspectorNames = data.inspector_list.inspector_list[0];
      var checkerAllElement = document.getElementById("checkerAll");
      inspectorNames.forEach(function (inspectorName) {
        var button = document.createElement("button");
        button.className = "checker-btn";
        button.textContent = inspectorName;
        button.id = "btn_" + inspectorName.replace(/\s+/g, "_");

        button.addEventListener("click", function () {
          addButtonToCheckerAll(button);
        });

        checkerAllElement.appendChild(button);

        var checkerInput = document.getElementById("checkerInput");
        function addButtonToCheckerAll(button) {
          if (checkerInput) {
            checkerInput.value += button.textContent;
            removedCheckerButton = button;
            checkerAllElement.removeChild(button);
          }
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function onCheckerDelete() {
  var checkerInput = document.getElementById("checkerInput");
  var checkerAllElement = document.getElementById("checkerAll");

  if (removedCheckerButton) {
    // 삭제한 버튼을 다시 checkerAllElement에 추가
    checkerAllElement.appendChild(removedCheckerButton);
    removedCheckerButton = null;
  }

  // 기존에 입력된 내용도 초기화
  checkerInput.value = "";
}
