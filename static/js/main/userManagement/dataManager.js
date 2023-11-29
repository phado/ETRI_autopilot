function detailOpenModal(datamanagerIdx, datamanagerNick) {
  var titleElement = document.querySelector(".detailmodal-title-name");
  titleElement.textContent = "[" + datamanagerNick + "]" + " 상세정보  ";

  var detailModal = document.getElementById("detailModal");
  detailModal.style.display = "block";
  // fetch("", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ modelIdx: modelIdx }),
  // })
  //   .then((response) => response.json())
  //   .then((data) => {

  //   })
  //   .catch((error) => console.error("에러 발생:", error));
}
function closeDetailModal() {
  var detailModal = document.getElementById("detailModal");
  detailModal.style.display = "none";
  location.reload();
}
