// 숫자만 입력되었는지 확인하는 정규식 및 함수
function validateNumber(input) {
    const regex = /^[0-9]+$/;
    return regex.test(input) ? 0 : -1;
}

// 문자만 입력되었는지 확인하는 정규식 및 함수
function validateAlphabet(input) {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(input) ? 0 : -1;
}

// 'true' 또는 'false' 중 하나인지 확인하는 정규식 및 함수
function validateBoolean(input) {
    const regex = /^(true|false)$/i;
    return regex.test(input) ? 0 : -1;
}

// 특수문자가 포함되어 있는지 확인하는 정규식 및 함수
function validateSpecialCharacters(input) {
    const regex = /[!@#$%^&*(),.?":{}|<>]/;
    return regex.test(input) ? 0 : -1;
}

// 문자열의 길이를 반환하는 함수
function countCharacters(input) {
    return input.length;
}

// 빈 문자열인지 확인하는 함수
function isEmptyString(input) {
    return input.trim() === '' ? 0 : -1;
}

// 문자열에 '.'이 포함되어 있는지 확인하는 정규식 및 함수
function validateDot(input) {
    const regex = /\./;
    return regex.test(input) ? 0 : -1;
}

// 문자열이 소수인지 확인하는 정규식 및 함수
function validateFloat(input) {
    const regex = /^[-+]?[0-9]*\.?[0-9]+$/;
    return regex.test(input) ? 0 : -1;
}

// 문자열이 정수인지 확인하는 정규식 및 함수
function validateInteger(input) {
    const regex = /^[-+]?\d+$/;
    return regex.test(input) ? 0 : -1;
}

// 예시
console.log(validateNumber("123"));        // 0
console.log(validateAlphabet("abc"));      // 0
console.log(validateBoolean("true"));      // 0
console.log(validateSpecialCharacters("!@#"));  // 0
console.log(countCharacters("Hello"));     // 5
console.log(isEmptyString(""));             // 0
console.log(validateDot("3.14"));           // 0
console.log(validateFloat("123.45"));       // 0
console.log(validateInteger("-123"));       // 0