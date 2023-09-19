const form = document.getElementById("regex-tester");
const regexInput = document.getElementById("regex");
const stringInput = document.getElementById("test-string");
const testButton = document.getElementById("test-button");
const testOutput = document.getElementById("test-output");
const testInput = document.getElementById("test-input");

let start,
  interval,
  calculating = false,
  worker = createRegexWorker();

turnExamplesIntoButtons();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!calculating) {
    calculating = true;
    const testRegex = regexInput.value.trim();
    const testString = stringInput.value;
    if (testRegex && testString) {
      testRegexAgainstString(testRegex, testString);
    } else {
      calculating = false;
    }
  }
});

regexInput.addEventListener("keyup", updateInput);
stringInput.addEventListener("keyup", updateInput);
getExampleFromHash();
updateInput();

function createRegexWorker() {
  const worker = new Worker("./static/regexWorker.js");
  worker.addEventListener("message", successfulMatch);
  worker.addEventListener("error", unsuccessfulMatch);
  return worker;
}

function createButton(text) {
  const button = document.createElement("button");
  button.textContent = text;
  return button;
}

function updateTimer() {
  testOutput.innerText = `>> ${Math.round(performance.now() - start)}ms`;
}

function terminateWorker(event) {
  event.preventDefault();
  clearInterval(interval);
  calculating = false;
  worker.terminate();
  resetTestButton();
  testOutput.innerText = `>> The test was terminated without result after ${Math.round(
    performance.now() - start
  )}ms`;
  worker = createRegexWorker();
}

function successfulMatch(event) {
  clearInterval(interval);
  const result = event.data;
  resetTestButton();
  testOutput.innerText = `>> The result is ${result} and it was calculated in ${Math.round(
    performance.now() - start
  )}ms`;
  calculating = false;
}

function unsuccessfulMatch(event) {
  clearInterval(interval);
  resetTestButton();
  testOutput.innerText = `>> The test failed with the message "${
    event.message
  }", and it took ${Math.round(performance.now() - start)}ms`;
  calculating = false;
}

function testRegexAgainstString(testRegex, testString) {
  testButton.addEventListener("click", terminateWorker);
  testButton.innerText = "Stop";
  start = performance.now();
  interval = setInterval(updateTimer, 50);
  worker.postMessage({
    regex: testRegex,
    string: testString,
  });
}

function turnExamplesIntoButtons() {
  const listItems = document.querySelectorAll(".example-list li");
  Array.from(listItems).forEach((listItem) => {
    const button = createButton(listItem.textContent);
    button.addEventListener(
      "click",
      fillFormWithExample(
        listItem.textContent.trim(),
        listItem.dataset["exampleString"].trim()
      )
    );
    listItem.innerHTML = "";
    listItem.appendChild(button);
  });
}

function fillFormWithExample(regex, string) {
  return function () {
    regexInput.value = regex;
    stringInput.value = string;
    updateInput();
  };
}

function updateInput() {
  testInput.textContent = `/${regexInput.value}/.test("${stringInput.value}");`;
  setExampleInHash(regexInput.value, stringInput.value);
}

function resetTestButton() {
  testButton.removeEventListener("click", terminateWorker);
  testButton.innerText = "Test";
}

function getExampleFromHash() {
  const locationHash = window.location.href.split("#")[1];
  if (locationHash) {
    const searchParams = new URLSearchParams(locationHash);
    const regex = searchParams.get("regex");
    const string = searchParams.get("string");
    if (regex && string) {
      regexInput.value = regex;
      stringInput.value = string;
      updateInput();
    }
  }
}

function setExampleInHash(regex, string) {
  if (regex && string) {
    const searchParams = new URLSearchParams({ regex, string });
    window.location.hash = searchParams.toString();
  } else {
    window.location.hash = "";
  }
}
