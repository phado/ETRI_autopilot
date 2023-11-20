document.addEventListener('DOMContentLoaded', function () {
    var toggleLiElements = document.querySelectorAll('.toggle-li');

    toggleLiElements.forEach(function (toggleLiElement) {
      toggleLiElement.addEventListener('click', function () {
        var nestedUl = toggleLiElement.querySelector('.nested-ul');
        nestedUl.classList.toggle('show');
      });
    });
  });