const form = document.getElementById("regex-tester");
const regexInput = document.getElementById("regex");
const stringInput = document.getElementById("test-string");
const testButton = document.getElementById("test-button");
const testOutput = document.getElementById("test-output");

let start,
  interval,
  calculating = false,
  stopButton = createButton(),
  worker = createRegexWorker();

turnExamplesIntoButtons();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!calculating) {
    calculating = true;
    const testRegex = regexInput.value.trim();
    const testString = stringInput.value.trim();
    if (testRegex && testString) {
      testRegexAgainstString(testRegex, testString);
    }
  }
});

function createRegexWorker() {
  const worker = new Worker("/static/regexWorker.js");
  worker.addEventListener("message", successfulMatch);
  worker.addEventListener("error", unsuccessfulMatch);
  return worker;
}
function createButton(text = "Stop") {
  const button = document.createElement("button");
  button.textContent = text;
  return button;
}
function updateTimer() {
  testOutput.innerText = `${Math.round(performance.now() - start)}ms`;
}

function terminateWorker() {
  clearInterval(interval);
  calculating = false;
  worker.terminate();
  stopButton.remove();
  testOutput.innerText = `The test was terminated without result after ${Math.round(
    performance.now() - start
  )}ms`;
  stopButton = createButton();
  worker = createRegexWorker();
}

function successfulMatch(event) {
  clearInterval(interval);
  const result = event.data;
  stopButton.remove();
  stopButton = createButton();
  testOutput.innerText = `The result is ${result} and it was calculated in ${Math.round(
    performance.now() - start
  )}ms`;
  calculating = false;
}

function unsuccessfulMatch(event) {
  clearInterval(interval);
  stopButton.remove();
  stopButton = createButton();
  console.log(event);
  testOutput.innerText = `The test failed with the message "${
    event.message
  }", and it took ${Math.round(performance.now() - start)}ms`;
  calculating = false;
}

function testRegexAgainstString(testRegex, testString) {
  testButton.insertAdjacentElement("afterend", stopButton);
  stopButton.addEventListener("click", terminateWorker);
  start = performance.now();
  interval = setInterval(updateTimer, 50);
  worker.postMessage({
    regex: testRegex,
    string: testString,
  });
}

function turnExamplesIntoButtons() {
  const listItems = document.querySelectorAll(".example-list li");
  console.log(listItems);
  Array.from(listItems).forEach((listItem) => {
    const button = createButton(listItem.textContent);
    button.addEventListener(
      "click",
      fillFormWithExample(
        listItem.textContent,
        listItem.dataset["exampleString"]
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
  };
}
