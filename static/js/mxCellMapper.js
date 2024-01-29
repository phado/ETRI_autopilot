let MxCellFormMapper = {};
let companyList = [];
let accTypeList = [];

const arrowMapper = {"id" : -1 , 'source' : -1 , 'target' : -1 }

let mapperList = {
  "Image-Data": {
    type: "Image-Data",
    data : "",
  },
  "Sensor-Data": {
    type: "Sensor-Data",
    data: "",
  },
  "KeyPoint-Data": {
    type: "KeyPoint-Data",
    data: "",
  },
  "Object-Detection": {
    type: "Object-Detection",
    data: "",
  },
  "Classification": {
    type: "Classification",
    data: "",
  },
  "Deploy": {
    type: "Deploy",
    data: "",
  },
};

// document.addEventListener("DOMContentLoaded", function() {

//   var dataToSend = { 'tr_idx': localStorage.getItem('projectIdx') };

//   fetch('/diagramDataLoad', {
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(dataToSend)
//   })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(data => {
//     const xmlData = data.xmlData;
//     processGraphxml = xmlData.replace(/\\/g, '');
//     uploadXML(processGraphxml);
//   })
//   .catch(error => {
//     console.error('Error during fetch:', error);
//   });

//   fetch('/common/agency_list', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//   })
//     .then(response => response.json())
//     .then(data => {
//       for(var i =0 ; i<data.data.length ; i++){
//         companyList.push(data.data[i][0]);
//       }
      
//       if(!companyList.includes('선택 없음')){
//         companyList.unshift('선택 없음');
//       }
//     })
//     .catch(error => {
//         console.error('데이터 가져오기 오류:', error);
//     });

//   fetch('/accTypeList', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//   })
//     .then(response => response.json())
//     .then(data => {
//       accTypeList = data.data;
//       if(!accTypeList.includes('선택 없음')){
//         accTypeList.unshift('선택 없음');
//       }
//     })
//     .catch(error => {
//         console.error('데이터 가져오기 오류:', error);
//     });
// });

// 배열 요소 비교
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
      return false;
  }
  for (let i = 0; i < arr1.length; i++) {
      if (arr1[i][0] !== arr2[i][0]) {
          return false;
      }
  }
  return true;
}

// 선택한 회사명의 데이터셋 불러옴
let subCategoryOptions = [];
function handleImageDataSelectChange() {
  try{
    var selectedElement = document.querySelector('[id$="Select1"]');
    if (selectedElement) {
        var selectedCompanyName = selectedElement.value;
    }
    
    var requestData = {'companyName': selectedCompanyName};
    fetch('/dataset/db_get_ds_by_company_index',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        if(data.data.length == 0){
            ImageDataSelect2.innerHTML ='';
        }
        // 데이터셋 리스트가 달라지면 배열 초기화 후 데이터셋 리스트 새로 받음
        if(!arraysAreEqual(subCategoryOptions, data['data'])){
          ImageDataSelect2.innerHTML ='';
          subCategoryOptions = data['data'];
          subCategoryOptions.forEach(function (optionText) {
            try{
              var selectedValue = edUI.editor.graph.getSelectionCell().kpstCellData.data.ImageDataSet;
              if(optionText[0] != ImageDataSelect2.options[0].value){
                var option = document.createElement("option");
                option.value = optionText;
                option.text = optionText;
                ImageDataSelect2.appendChild(option);

                // 값 불러왔을 때 선택 됨 표시
                if (optionText[0] === selectedValue) {
                  ImageDataSelect2.value = selectedValue;
                }
                applyStyles(ImageDataSelect2, selectBoxStyle);
              }
            }catch{
              var option = document.createElement("option");
              option.value = optionText;
              option.text = optionText;
              ImageDataSelect2.appendChild(option);
              applyStyles(ImageDataSelect2, selectBoxStyle);
            }
          });
        }
      })
      .catch(error => {
        console.error("Error:", error);
    });
  }catch{}
}

function mxCellType(cellId, cellType) {
  // 생성된 셀 타입 확인
  var mapper = mapperList[cellType];

  // 생성된 셀 타입으로 맴퍼 생성
  MxCellMapper[cellId] = {...mapper };
}

function mxCellForm(cellType, mapperData,cellId) {
  // 생성된 셀 폼 생성
  if (cellType == "Image-Data") {
    return ImageData(mapperData,cellId);
  } else if (cellType == "Sensor-Data") {
    return SenserData(mapperData,cellId);
  } else if (cellType == "KeyPoint-Data") {
    return KeyPointData(mapperData,cellId);
  } else if (cellType == "Object-Detection") {
    return ObjectDetection(mapperData,cellId);
  } else if (cellType == "Classification") {
    return Classification(mapperData,cellId);
  } else if (cellType == "Deploy") {
    return Deploy(mapperData,cellId);
  }
}

function applyStyles(element, styles) {
  for (var style in styles) {
    element.style[style] = styles[style];
  }
}

let Roboto16Style = {
  fontFamily: "Roboto",
  fontSize: "16px",
  fontWeight: "400",
  lineHeight: "19px",
  letterSpacing: "0em",
  textAlign: "left",
};
let selectBoxStyle = {
  marginTop: "12px",
  marginBottom: "36px",
  width: "660px",
  height: "36px",
  borderRadius: "5px",
  border: "1px solid #9B9B9B",
};
let textareaStyle = {
  marginTop: "12px",
  marginBottom: "36px",
  width: "645px",
  height: "200px",
  borderRadius: "5px",
  border: "1px solid #9b9b9b",
  paddingTop: "7px",
  paddingLeft: "11px",
  resize: "none",
  overflowY: "auto",
};
var inputBoxStyle = {
  marginTop: "12px",
  marginBottom: "36px",
  width: "660px",
  height: "36px",
  borderRadius: "5px",
  border: "1px solid #9B9B9B",
};
var smallInputBoxStyle = {
  marginTop: "12px",
  marginBottom: "12px",
  width: "300px",
  height: "36px",
  borderRadius: "5px",
  border: "1px solid #9B9B9B",
};
let selectBoxStyleHalf = {
  marginTop: "12px",
  marginBottom: "12px",
  width: "300px",
  height: "36px",
  borderRadius: "5px",
  border: "1px solid #9B9B9B",
};
function ImageData(mapperData,cellId) {
  var div = document.createElement("div");

  var modal = document.createElement("div");
  modal.className = "dataModal";

  applyStyles(modal, {
    width: "100%",
    height: "95%",
  });

  var ImageDataLabel1 = document.createElement("label");
  var labelText = document.createTextNode("기업 선택");
  ImageDataLabel1.appendChild(labelText);
  applyStyles(ImageDataLabel1, Roboto16Style);

  var ImageDataSelect1 = document.createElement("select");
  ImageDataSelect1.id = "ImageDataSelect1";

  var mainCategoryOptions = companyList;

  mainCategoryOptions.forEach(function (optionText) {
    var option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    ImageDataSelect1.appendChild(option);
    applyStyles(ImageDataSelect1, selectBoxStyle);
  });

  ImageDataSelect1.addEventListener("change", handleImageDataSelectChange);

  var ImageDataLabel2 = document.createElement("label");
  labelText = document.createTextNode("데이터셋 선택");
  ImageDataLabel2.appendChild(labelText);
  applyStyles(ImageDataLabel2, Roboto16Style);

  var ImageDataSelect2 = document.createElement("select");
  ImageDataSelect2.id = "ImageDataSelect2";
  applyStyles(ImageDataSelect2, selectBoxStyle);

  ImageDataSelect2.addEventListener("mousedown", handleImageDataSelectChange);

  var ImageDataLabel3 = document.createElement("label");
  labelText = document.createTextNode("메모");
  ImageDataLabel3.appendChild(labelText);
  applyStyles(ImageDataLabel3, Roboto16Style);

  var ImageDataInput1 = document.createElement("textarea");
  ImageDataInput1.id = "ImageDataInput1";

  applyStyles(ImageDataInput1, textareaStyle);

  //값 불러오는 부분
  if (mapperData.data && mapperData.data.CompanySelected !== undefined) {
    ImageDataSelect1.value = mapperData.data.CompanySelected;
  }
  if (mapperData.data && mapperData.data.ImageDataSet !== undefined) {
    var option = document.createElement('option');
    option.value = mapperData.data.ImageDataSet;
    option.innerHTML = mapperData.data.ImageDataSet;
    ImageDataSelect2.appendChild(option);
    subCategoryOptions = []; // 값 불러올 때 초기화
  }
  if (mapperData.data && mapperData.data.DataSetDiagramMemo !== undefined) {
    ImageDataInput1.value = mapperData.data.DataSetDiagramMemo;
  }
  // 모달에 요소 추가
  modal.appendChild(ImageDataLabel1);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(ImageDataSelect1);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(ImageDataLabel2);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(ImageDataSelect2);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(ImageDataLabel3);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(ImageDataInput1);
  modal.appendChild(mxUtils.br(div));

  return modal;
}

function SenserData(mapperData,cellId) {
  var div = document.createElement("div");

  var modal = document.createElement("div");
  modal.className = "dataModal";

  applyStyles(modal, {
    width: "100%",
    height: "95%",
  });

  var SenserDataLabel1 = document.createElement("label");
  var labelText = document.createTextNode("기업 선택");
  SenserDataLabel1.appendChild(labelText);
  applyStyles(SenserDataLabel1, Roboto16Style);

  var SenserDataSelect1 = document.createElement("select");
  SenserDataSelect1.id = "SenserDataSelect1";

  var mainCategoryOptions = ["선택 없음", "카테1", "카테2", "카테3", "카테4"];
  mainCategoryOptions.forEach(function (optionText) {
    var option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    SenserDataSelect1.appendChild(option);
    applyStyles(SenserDataSelect1, selectBoxStyle);
  });

  var SenserDataLabel2 = document.createElement("label");
  labelText = document.createTextNode("데이터셋 선택");
  SenserDataLabel2.appendChild(labelText);
  applyStyles(SenserDataLabel2, Roboto16Style);


  var SenserDataSelect2 = document.createElement("select");
  SenserDataSelect2.id = "SenserDataSelect2";

  var subCategoryOptions = ["선택 없음", "서브카테1", "서브카테2", "서브카테3"];
  subCategoryOptions.forEach(function (optionText) {
    var option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    SenserDataSelect2.appendChild(option);
    applyStyles(SenserDataSelect2, selectBoxStyle);
  });

  var SenserDataLabel3 = document.createElement("label");
  labelText = document.createTextNode("메모");
  SenserDataLabel3.appendChild(labelText);
  applyStyles(SenserDataLabel3, Roboto16Style);

  var SenserDataInput1 = document.createElement("textarea");
  SenserDataInput1.id = "SenserDataInput1";

  applyStyles(SenserDataInput1, textareaStyle);

  //값 불러오는 부분
  if (mapperData.data && mapperData.data.sensor1SelectedValue !== undefined) {
    SenserDataSelect1.value = mapperData.data.sensor1SelectedValue;
  }
  if (mapperData.data && mapperData.data.sensor2SelectedValue !== undefined) {
    SenserDataSelect2.value = mapperData.data.sensor2SelectedValue;
  }
  if (mapperData.data && mapperData.data.sensor1InputValue !== undefined) {
    SenserDataInput1.value = mapperData.data.sensor1InputValue;
  }

  // 모달에 요소 추가
  modal.appendChild(SenserDataLabel1);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(SenserDataSelect1);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(SenserDataLabel2);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(SenserDataSelect2);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(SenserDataLabel3);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(SenserDataInput1);
  modal.appendChild(mxUtils.br(div));

  return modal;
}

function KeyPointData(mapperData,cellId) {
  var div = document.createElement("div");
  var div = document.createElement("div");

  var modal = document.createElement("div");
  modal.className = "dataModal";

  applyStyles(modal, {
    width: "100%",
    height: "95%",
  });

  var KeyPointDataLabel1 = document.createElement("label");
  var labelText = document.createTextNode("기업 선택");
  KeyPointDataLabel1.appendChild(labelText);
  applyStyles(KeyPointDataLabel1, Roboto16Style);

  var KeyPointDataSelect1 = document.createElement("select");
  KeyPointDataSelect1.id = "KeyPointDataSelect1";

  var mainCategoryOptions = ["선택 없음", "카테1", "카테2", "카테3", "카테4"];
  mainCategoryOptions.forEach(function (optionText) {
    var option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    KeyPointDataSelect1.appendChild(option);
    applyStyles(KeyPointDataSelect1, selectBoxStyle);
  });

  var KeyPointDataLabel2 = document.createElement("label");
  labelText = document.createTextNode("데이터셋 선택");
  KeyPointDataLabel2.appendChild(labelText);
  applyStyles(KeyPointDataLabel2, Roboto16Style);


  var KeyPointDataSelect2 = document.createElement("select");
  KeyPointDataSelect2.id = "KeyPointDataSelect2";

  var subCategoryOptions = ["선택 없음", "서브카테1", "서브카테2", "서브카테3"];
  subCategoryOptions.forEach(function (optionText) {
    var option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    KeyPointDataSelect2.appendChild(option);
    applyStyles(KeyPointDataSelect2, selectBoxStyle);
  });

  var KeyPointDataLabel3 = document.createElement("label");
  labelText = document.createTextNode("메모");
  KeyPointDataLabel3.appendChild(labelText);
  applyStyles(KeyPointDataLabel3, Roboto16Style);

  var KeyPointDataInput1 = document.createElement("textarea");
  KeyPointDataInput1.id = "KeyPointDataInput1";

  applyStyles(KeyPointDataInput1, textareaStyle);

  //값 불러오는 부분
  if (mapperData.data && mapperData.data.keypoint1SelectedValue !== undefined) {
    KeyPointDataSelect1.value = mapperData.data.keypoint1SelectedValue;
  }
  if (mapperData.data && mapperData.data.keypoint2SelectedValue !== undefined) {
    KeyPointDataSelect2.value = mapperData.data.keypoint2SelectedValue;
  }
  if (mapperData.data && mapperData.data.keypoint1InputValue !== undefined) {
    KeyPointDataInput1.value = mapperData.data.keypoint1InputValue;
  }

  // 모달에 요소 추가
  modal.appendChild(KeyPointDataLabel1);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(KeyPointDataSelect1);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(KeyPointDataLabel2);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(KeyPointDataSelect2);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(KeyPointDataLabel3);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(KeyPointDataInput1);
  modal.appendChild(mxUtils.br(div));

  return modal;
}

function ObjectDetection(mapperData,cellId) {
  var div = document.createElement("div");

  var modal = document.createElement("div");
  modal.className = "dataModal";

  applyStyles(modal, {
    width: "100%",
    height: "95%",
    display: "flex",
  });

  // input area 1
  var inputArea1 = createInputArea("input-area1", "50%", 1, 6);
  modal.appendChild(inputArea1);

  // input area 2
  var inputArea2 = createInputArea("input-area2", "50%", 7, 11);
  modal.appendChild(inputArea2);

  var keysArray = Object.keys(mapperData.data);

  // input area 1 값 불러오는 부분
  var inputArea1Keys = inputArea1.getElementsByTagName('input');
  for(var i = 0; i < inputArea1Keys.length; i++){
    if (mapperData.data && mapperData.data[keysArray[i]] !== undefined) {
      inputArea1Keys[i].value = mapperData.data[keysArray[i]];
    }
  }
  // input area 2 값 불러오는 부분
  var inputArea2Keys = inputArea2.getElementsByTagName('input');
  count = 0;
  for(var i = keysArray.length - inputArea1Keys.length + 1 ; i < keysArray.length ; i++){
    if (mapperData.data && mapperData.data[keysArray[i]] !== undefined) {
      inputArea2Keys[count].value = mapperData.data[keysArray[i]];
    }
    count+=1;
  }
  return modal;
}

function createInputArea(id, width, start, end) {
  var inputArea = document.createElement("div");
  inputArea.id = id;
  applyStyles(inputArea, {
    width: width,
    boxSizing: "border-box",
    padding: "10px",
  });

  var propertyNames = ["","weights", "cfg", "data-class", "hyp", "epochs", "batch-size", "imgsz", "resume", "optimizer", "label-smoothing", "freeze"];

  for (var i = start; i <= end; i++) {
    var propertyName = propertyNames[i];

    var inputLabel = document.createElement("label");
    var labelText = document.createTextNode(propertyName );
    inputLabel.appendChild(labelText);
    applyStyles(inputLabel, Roboto16Style);
    if(propertyName == 'cfg'){
      var inputElement = document.createElement("select");
      inputElement.id = "cfgDataSelect";
      var cfgList = ['yolov5l.yaml','yolov5m.yaml','yolov5s.yaml']
      cfgList.forEach(function (optionText) {
        var option = document.createElement("option");
        option.value = optionText;
        option.text = optionText;
        inputElement.appendChild(option);
        applyStyles(inputElement, selectBoxStyleHalf);
      });

    }else if (propertyName == 'label-smoothing'){
      var inputElement = document.createElement("select");
      inputElement.id = "labelSmoothingDataSelect";
      var cfgList = ['True','False']
      cfgList.forEach(function (optionText) {
        var option = document.createElement("option");
        option.value = optionText;
        option.text = optionText;
        inputElement.appendChild(option);
        applyStyles(inputElement, selectBoxStyleHalf);
      });
    } else if (propertyName == 'weights'){
      var inputElement = document.createElement("select");
      inputElement.id = "modelDataSelect";
      var cfgList = ['yolov5l.pt','yolov5m.pt','yolov5s.pt']
      cfgList.forEach(function (optionText) {
        var option = document.createElement("option");
        option.value = optionText;
        option.text = optionText;
        inputElement.appendChild(option);
        applyStyles(inputElement, selectBoxStyleHalf);
      });
    }else if (propertyName == 'hyp'){
      var inputElement = document.createElement("select");
      inputElement.id = "hypDataSelect";
      var cfgList = ['hyp.scratch-high.yaml','hyp.scratch-low.yaml','hyp.scratch-med.yaml']
      cfgList.forEach(function (optionText) {
        var option = document.createElement("option");
        option.value = optionText;
        option.text = optionText;
        inputElement.appendChild(option);
        applyStyles(inputElement, selectBoxStyleHalf);
      });
    }
      else {
      var inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.id = propertyName;
      inputElement.placeholder = "선택 없음";
      applyStyles(inputElement, smallInputBoxStyle);

   }

    // Fix: div 변수 정의
    var div = document.createElement("div");

    inputArea.appendChild(inputLabel);
    inputArea.appendChild(mxUtils.br(div));  // Fix: mxUtils.br에도 div 추가
    inputArea.appendChild(inputElement);
    inputArea.appendChild(mxUtils.br(div));
  }

  return inputArea;
}

function Classification(mapperData,cellId) {
  var div = document.createElement("div");

  var modal = document.createElement("div");
  modal.className = "dataModal";

  applyStyles(modal, {
    width: "100%",
    height: "95%",
  });

  var ClassificationLabel1 = document.createElement("label");
  var labelText = document.createTextNode("분류 모델 선택");
  ClassificationLabel1.appendChild(labelText);
  applyStyles(ClassificationLabel1, Roboto16Style);

  var ClassificationSelect1 = document.createElement("select");
  ClassificationSelect1.id = "ClassificationSelect1";

  var mainCategoryOptions = ["선택 없음", "카테1", "카테2", "카테3", "카테4"];
  mainCategoryOptions.forEach(function (optionText) {
    var option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    ClassificationSelect1.appendChild(option);
    applyStyles(ClassificationSelect1, selectBoxStyle);
  });


  var ClassificationLabel3 = document.createElement("label");
  labelText = document.createTextNode("메모");
  ClassificationLabel3.appendChild(labelText);
  applyStyles(ClassificationLabel3, Roboto16Style);

  var ClassificationInput1 = document.createElement("input");
  ClassificationInput1.type = "text";
  ClassificationInput1.id = "ClassificationInput1";
  applyStyles(ClassificationInput1, textareaStyle);


  //값 불러오는 부분
  if (mapperData.data && mapperData.data.ClassificationSelect1 !== undefined) {
    ClassificationSelect1.value = mapperData.data.keypoint1SelectedValue;
  }

  if (mapperData.data && mapperData.data.keypoint1InputValue !== undefined) {
    ClassificationInput1.value = mapperData.data.keypoint1InputValue;
  }

  // 모달에 요소 추가
  modal.appendChild(ClassificationLabel1);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(ClassificationSelect1);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(ClassificationLabel3);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(ClassificationInput1);
  modal.appendChild(mxUtils.br(div));

  return modal;
}

function Deploy(mapperData,cellId) {
  var div = document.createElement("div");

  var modal = document.createElement("div");
  modal.className = "dataModal";

  applyStyles(modal, {
    width: "100%",
    height: "95%",
  });

  var DeployLabel1 = document.createElement("label");
  var labelText = document.createTextNode("기업 선택");
  DeployLabel1.appendChild(labelText);
  applyStyles(DeployLabel1, Roboto16Style);

  var DeployLabelSelect1 = document.createElement("select");
  DeployLabelSelect1.id = "DeployLabelSelect1";

  var mainCategoryOptions = companyList;
  mainCategoryOptions.forEach(function (optionText) {
    var option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    DeployLabelSelect1.appendChild(option);
    applyStyles(DeployLabelSelect1, selectBoxStyle);
  });

  var DeployLabel2 = document.createElement("label");
  labelText = document.createTextNode("재해 유형 선택 ");
  DeployLabel2.appendChild(labelText);
  applyStyles(DeployLabel2, Roboto16Style);


  var DeployLabelSelect2 = document.createElement("select");
  DeployLabelSelect2.id = "DeployLabelSelect2";

  var subCategoryOptions = accTypeList;
  subCategoryOptions.forEach(function (optionText) {
    var option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    DeployLabelSelect2.appendChild(option);
    applyStyles(DeployLabelSelect2, selectBoxStyle);
  });

  var DeployLabel3 = document.createElement("label");
  DeployLabel3.id = "DeployLabel3";

  labelText = document.createTextNode("메모");
  DeployLabel3.appendChild(labelText);
  applyStyles(DeployLabel3, Roboto16Style);

  var DeployInput1 = document.createElement("textarea");
  DeployInput1.id = "DeployInput1";

  applyStyles(DeployInput1, textareaStyle);

  if (mapperData.data && mapperData.data.DeployLabelSelect1Value !== undefined) {
    DeployLabelSelect1.value = mapperData.data.DeployLabelSelect1Value;
  }
  if (mapperData.data && mapperData.data.DeployLabelSelect2Value !== undefined) {
    DeployLabelSelect2.value = mapperData.data.DeployLabelSelect2Value;
  }
  if (mapperData.data && mapperData.data.DeployInput1Value !== undefined) {
    DeployInput1.value = mapperData.data.DeployInput1Value;
  }
  // 모달에 요소 추가
  modal.appendChild(DeployLabel1);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(DeployLabelSelect1);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(DeployLabel2);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(DeployLabelSelect2);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(DeployLabel3);
  modal.appendChild(mxUtils.br(div));
  modal.appendChild(DeployInput1);
  modal.appendChild(mxUtils.br(div));

  return modal;
}

function mapperEditApply() {
  console.log("apply");
}


function cellDataBinder(cellValue,cellId){
  if(cellValue =='Image-Data'){
      var image1Select = document.getElementById('ImageDataSelect1');
      var CompanySelected = image1Select.value;

      var image2Select = document.getElementById('ImageDataSelect2');
      var ImageDataSet = image2Select.value;

      var image1Input = document.getElementById('ImageDataInput1');
      var DataSetDiagramMemo = image1Input.value;

      MxCellMapper[cellId].data = {
        CompanySelected: CompanySelected,
        ImageDataSet: ImageDataSet,
        DataSetDiagramMemo: DataSetDiagramMemo
      };
  }

  if(cellValue =='Sensor-Data'){
      var sensor1Select = document.getElementById('SenserDataSelect1');
      var sensor1SelectedValue = sensor1Select.value;

      var sensor2Select = document.getElementById('SenserDataSelect2');
      var sensor2SelectedValue = sensor2Select.value;

      var sensor1Input = document.getElementById('SenserDataInput1');
      var sensor1InputValue = sensor1Input.value;

      MxCellMapper[cellId].data = {
        sensor1SelectedValue: sensor1SelectedValue,
        sensor2SelectedValue: sensor2SelectedValue,
        sensor1InputValue: sensor1InputValue
      };
  }

  if(cellValue =='KeyPoint-Data'){
      var keypoint1Select = document.getElementById('KeyPointDataSelect1');
      var keypoint1SelectedValue = keypoint1Select.value;

      var keypoint2Select = document.getElementById('KeyPointDataSelect2');
      var keypoint2SelectedValue = keypoint2Select.value;

      var keypoint1Input = document.getElementById('KeyPointDataInput1');
      var keypoint1InputValue = keypoint1Input.value;

      MxCellMapper[cellId].data = {
        keypoint1SelectedValue: keypoint1SelectedValue,
        keypoint2SelectedValue: keypoint2SelectedValue,
        keypoint1InputValue: keypoint1InputValue
      };
  }

  if(cellValue =='Object-Detection'){
    var deployDataInput = document.getElementsByClassName('geDialog')[0].getElementsByTagName('input');
    MxCellMapper[cellId].data = {};
    for(var i = 0 ; i < deployDataInput.length; i++){
      MxCellMapper[cellId].data[deployDataInput[i].id] = deployDataInput[i].value;
    }
  }

  if(cellValue =='Classification'){
    // var Object1Select = document.getElementById('ObjectDataSelect1');
    // var Object1SelectedValue = Object1Select.value;
    //
    // var Object2Select = document.getElementById('ObjectDataSelect2');
    // var Object2SelectedValue = Object2Select.value;
    //
    // var Object1Input = document.getElementById('ObjectDataInput1');
    // var Object1InputValue = Object1Input.value;
    //
    // MxCellMapper[cellId].data = {
    //   Object1SelectedValue: Object1SelectedValue,
    //   Object2SelectedValue: Object2SelectedValue,
    //   Object1InputValue: Object1InputValue
    // };
  }

  if(cellValue =='Deploy'){
    var DeployLabelSelect1 = document.getElementById('DeployLabelSelect1');
    var DeployLabelSelect1Value = DeployLabelSelect1.value;

    var DeployLabelSelect2 = document.getElementById('DeployLabelSelect2');
    var DeployLabelSelect2Value = DeployLabelSelect2.value;

    var DeployInput1 = document.getElementById('DeployInput1');
    var DeployInput1Value = DeployInput1.value;

    MxCellMapper[cellId].data = {
      DeployLabelSelect1Value: DeployLabelSelect1Value,
      DeployLabelSelect2Value: DeployLabelSelect2Value,
      DeployInput1Value: DeployInput1Value
    };
  }

  return MxCellMapper[cellId]
}

function uploadXML(xmlData) {
  let xml = xmlData;

  if (xml == "") {
      return;
  }
  let doc = mxUtils.parseXml(xml);
  let codec = new mxCodec(doc);

  if (universalGraph && universalGraph !== "") {
      codec.decode(doc.documentElement, universalGraph.getModel());
  }

  //MxCellMapper에 값 불러오기
  edUI.editor.graph.getChildCells().forEach(function (parsCell) {
    // edge가 아닌 cell인 경우
    if(parsCell.class){
      MxCellMapper[parsCell.id] = parsCell.kpstCellData
    }
	});
}

function save(runFlag){
	var nowXml = edUI.editor.getGraphXml();
	var datasetNameList = [];
  // 삭제된거 업데이트 하려고 한번씩 초기화
  MxCellMapper = {};
  MxArrowMapper = {}
	edUI.editor.graph.getChildCells().forEach(function (parsCell) {
		if (parsCell.style == "endArrow=classic;html=1;" || parsCell.style.includes('edgeStyle=orthogonalEdgeStyle;') ){
			//화살표 정보 맵핑
			var arrowId = (parsCell.id !== undefined && parsCell.id !== null) ? parsCell.id : -1;
			var arrowMxId = (parsCell.mxObjectId !== undefined && parsCell.mxObjectId !== null) ? parsCell.mxObjectId : -1;
			var arrowSource = (parsCell.source !== undefined && parsCell.source !== null) ? parsCell.source.id : -1;
			var arrowTarget = (parsCell.target !== undefined && parsCell.target !== null) ? parsCell.target.id : -1;

			var arrowMap = {"id" : arrowId ,'MxObjId' : arrowMxId, "source" : arrowSource , "target" : arrowTarget }
			// console.log(arrowMap) // KPST 연결된 맵퍼 표시
			MxArrowMapper[arrowId] = arrowMap
			// console.log(arrowMap)
		}else if(parsCell.class){
			MxCellMapper[parsCell.id] = parsCell.kpstCellData
			// data정보 확인
			if(parsCell.value.includes('Data')){
				try{
					const datasetName = Object.keys(parsCell.kpstCellData.data)[1]
					datasetNameList.push(parsCell.kpstCellData.data[datasetName]);
				}
				catch{}
			}
		}
	});
	var uniqueSet = new Set(datasetNameList);
	var uniqueArray = Array.from(uniqueSet);

	var xmlString = XMLToString(nowXml);
	const dataToSend = { 
		"nowXml" : xmlString, 
		"MxCellMapper" : MxCellMapper, 
		"MxArrowMapper" : MxArrowMapper, 
		"projectName": localStorage.getItem('projectName'),
		"datasetInfo" : uniqueArray,
		"projectIdx" : localStorage.getItem('projectIdx'),
    "modelName" : localStorage.getItem('modelName'),
    "runFlag" : runFlag
	}; 

	fetch('/diagramDataSave',{
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(dataToSend)
	})
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
	
		return response.json();
	})
	.then(data => {
		const redirectUrl = data.redirect_url;
		// nowXml , MxCellMapper , MxArrowMapper // 로컬 스토리지 저장
		localStorage.setItem('nowXml', xmlString);
		localStorage.setItem('MxCellMapper', JSON.stringify(MxCellMapper));
		localStorage.setItem('MxArrowMapper',JSON.stringify(MxArrowMapper));
		
    if(runFlag == 1){
      //modelingRun으로 이동
      window.location.href = redirectUrl;
    }

	})
	.catch(error => {
		console.error('Error during fetch:', error);
	});
}