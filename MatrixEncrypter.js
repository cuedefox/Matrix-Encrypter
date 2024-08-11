const process = require('process');

// Matriz de codificacion usada para cifrar el texto
var encodingMatrix = [
  [1, -1, -1, 1],
  [2, -3, -5, 4],
  [-2, -1, -2, 2],
  [3, -3, -1, 2]
];

// Matriz de decodificacion usada para descifrar el texto
var decodingMatrix = [
  [6, -1, 0, -1],
  [22, -4, 1, -4],
  [14, -3, 1, -2],
  [31, -6, 2, -5]
];

// Convierte un arreglo de numeros en una matriz con un numero especifico de filas
function getMatrixFromArray(arr, rows) {
  var matrix = new Array();
  for (var i = 0; i < rows; i++) matrix[i] = new Array();

  // Llena la matriz con los valores del arreglo
  for (var i = 0; i < arr.length; i++)
    matrix[i % rows][Math.floor(i / rows)] = arr[i];

  // Si la longitud del arreglo no es multiplo de 'rows', rellena con ceros
  if (arr.length % rows != 0)
    for (var i = arr.length % rows; i < rows; i++)
      matrix[i][Math.floor((arr.length - 1) / rows)] = 0;

  return matrix;
}

// Convierte un texto en una matriz de codigos ASCII
function getMatrixFromText(text, rows) {
  var arr = new Array();
  for (var i = 0; i < text.length; i++) arr[i] = text.charCodeAt(i);
  return getMatrixFromArray(arr, rows);
}

// Convierte una matriz de codigos ASCII en texto
function getTextFromMatrix(matrix) {
  var text = new String();
  for (var j = 0; j < matrix[0].length; j++)
    for (var i = 0; i < matrix.length; i++)
      text += matrix[i][j] > 0 ? String.fromCharCode(matrix[i][j]) : "";
  return text;
}

// Convierte un texto de numeros separados por espacios en una matriz
function getMatrixFromNumbers(text, rows) {
  var i = 0;
  var numbers = text.split(" ");
  while (i < numbers.length) {
    if (numbers[i].replace(/\s+/g, "") == "") numbers.splice(i, 1);
    else i++;
  }
  var arr = new Array();
  for (var i = 0; i < numbers.length; i++) arr[i] = parseInt(numbers[i]);

  return getMatrixFromArray(arr, rows);
}

// Convierte una matriz en un texto de numeros separados por espacios
function getNumbersFromMatrix(matrix) {
  var text = "";
  for (var j = 0; j < matrix[0].length; j++)
    for (var i = 0; i < matrix.length; i++)
      text += matrix[i][j].toString() + " ";
  return text;
}

// Multiplica dos matrices
function multiplyMatrices(m1, m2) {
  var matrix = new Array();
  for (var i = 0; i < m1.length; i++) matrix[i] = new Array();

  // Realiza la multiplicacion de matrices
  for (var i = 0; i < m1.length; i++)
    for (var j = 0; j < m2[0].length; j++) {
      matrix[i][j] = 0;
      for (var k = 0; k < m1[0].length; k++)
        matrix[i][j] += m1[i][k] * m2[k][j];
    }
  return matrix;
}

// Mapea numeros a caracteres usando una transformacion
function numberToChar(text) {
  var result = new String();
  for (var i = 0; i < text.length; i++)
    result += String.fromCharCode(
      text.charCodeAt(i) + (text.charCodeAt(i) == 32 ? 33 : 21)
    );
  return result;
}

// Mapea caracteres a numeros usando la transformacion inversa
function charToNumber(text) {
  var result = new String();
  for (var i = 0; i < text.length; i++)
    result += String.fromCharCode(
      text.charCodeAt(i) - (text.charCodeAt(i) == 65 ? 33 : 21)
    );
  return result;
}

// Funcion para cifrar el texto
function encryptText(plainText, mapNumbers) {
  var plainMatrix = getMatrixFromText(plainText, 4);
  var cipherMatrix = multiplyMatrices(encodingMatrix, plainMatrix);
  var cipherText = getNumbersFromMatrix(cipherMatrix);
  if (mapNumbers) cipherText = numberToChar(cipherText);
  return cipherText;
}

// Funcion para descifrar el texto
function decryptText(cipherText, mapNumbers) {
  if (mapNumbers) cipherText = charToNumber(cipherText);
  var cipherMatrix = getMatrixFromNumbers(cipherText, 4);
  var plainMatrix = multiplyMatrices(decodingMatrix, cipherMatrix);
  return getTextFromMatrix(plainMatrix);
}

// Funcion principal para manejar los parametros de entrada y ejecutar las funciones correspondientes
function main() {
  // Se usa linea de comandos en este ejemplo pero la idea es usarlo internamente en un servidor
  const args = process.argv.slice(2);
  const operation = args[0]; // 'encrypt' o 'decrypt'
  const text = args[1]; // Texto a cifrar o descifrar
  const mapNumbers = args[2] === "true"; // Mapear numeros a caracteres

  if (operation === "encrypt") {
    console.log(encryptText(text, mapNumbers));
  } else if (operation === "decrypt") {
    console.log(decryptText(text, mapNumbers));
  } else {
    console.log("Operacion no valida. Usa 'encrypt' o 'decrypt'.");
  }
}

main();
