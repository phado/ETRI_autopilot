document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.toggle');
  
    toggles.forEach(function(toggle) {
      const ul = toggle.querySelector('ul');
      const userIcon = toggle.querySelector('.userIcon');
  
      toggle.addEventListener('click', function(event) {
        if (ul) {
          ul.style.display = (ul.style.display === 'none' || ul.style.display === '') ? 'block' : 'none';
  
          if (userIcon) {
            if (ul.style.display === 'block') {
                // 열렸을 때의 SVG 이미지로 교체
                userIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 10.828L16.95 15.778L18.364 14.364L12 8L5.63601 14.364L7.05101 15.778L12.001 10.828L12 10.828Z" fill="#B7B7B7"/></svg>';
              } else {
                // 닫혔을 때의 SVG 이미지로 교체
                userIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 13.172L16.95 8.222L18.364 9.636L12 16L5.63601 9.636L7.05101 8.222L12.001 13.172L12 13.172Z" fill="#B7B7B7"/></svg>';
              }
            
          }
        }
  
        // 이벤트 전파를 막음
        event.stopPropagation();
      });
  
      // 토글 내부의 각 아이템에 대한 이벤트 핸들러 추가
      const listItems = toggle.querySelectorAll('ul li');
      listItems.forEach(function(item) {
        item.addEventListener('click', function(event) {
          // 이벤트 전파를 막음
          event.stopPropagation();
        });
      });
    });
  
    // 문서 전체에 대한 클릭 이벤트 핸들러 추가
    document.addEventListener('click', function() {
      // 모든 토글 닫기
      toggles.forEach(function(toggle) {
        const ul = toggle.querySelector('ul');
        const userIcon = toggle.querySelector('.userIcon');
  
        if (ul) {
          ul.style.display = 'none';
  
          if (userIcon) {
            userIcon.style.display = 'inline-block';
          }
        }
      });
    });
  });
  