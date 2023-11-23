let alertShown = false;
function idFind() {
  var usrName = document.getElementById("findidUsername").value; // 아이디 입력란
  var usrPhone = document.getElementById("findidPhone").value; // 휴대폰 번호 입력란

  // Fetch API를 사용하여 서버로 데이터 전송
  fetch("/findId", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ usrName, usrPhone }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.id_info && data.id_info.length > 0) {
        var replaceidInput = document.querySelector(".input-replaceid");
        replaceidInput.value = data.id_info[0][1];
        var replacecreateInput = document.querySelector(".input-replacecreate");
        const dateString = data.id_info[0][2];
        const date = new Date(dateString);

        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        };
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
          date
        );

        const parts = formattedDate.split("/");
        const result = `${parts[2]}-${parts[0]}-${parts[1]}`;

        replacecreateInput.value = result;

        findidmodal.style.display = "none";
        replaceidModal.style.display = "block";
      } else {
        if (!alertShown) {
          alert("해당 정보로 회원가입된 회원이 존재하지 않습니다!");
          resetIdFindModal();
          alertShown = true;
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function resetIdFindModal() {
  var findidUsernameInput = document.getElementById("findidUsername");
  var findidPhoneInput = document.getElementById("findidPhone");
  findidUsernameInput.value = "";
  findidPhoneInput.value = "";
}
