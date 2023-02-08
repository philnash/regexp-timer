const form = document.getElementById("regex-tester");
const regexInput = document.getElementById("regex");
const stringInput = document.getElementById("test-string");
const testOutput = document.getElementById("test-output");

let start,
  interval,
  calculating = false;

function createRegexWorker() {
  const worker = new Worker("/static/regexWorker.js");
  worker.addEventListener("message", (event) => {
    clearInterval(interval);
    const end = performance.now();
    const result = event.data;
    testOutput.innerText = `The result is ${result} and it was calculated in ${
      end - start
    }ms`;
    calculating = false;
  });

  worker.addEventListener("error", (event) => {
    clearInterval(interval);
    const end = performance.now();
    console.log(event);
    testOutput.innerText = `The test failed with the message "${
      event.message
    }", and it took ${end - start}ms`;
    calculating = false;
  });
  return worker;
}

let worker = createRegexWorker();

function updateTimer() {
  const now = performance.now();
  testOutput.innerText = `${now - start}ms`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!calculating) {
    calculating = true;
    const testRegex = regexInput.value.trim();
    const testString = stringInput.value.trim();
    if (testRegex && testString) {
      start = performance.now();
      interval = setInterval(updateTimer, 50);
      worker.postMessage({
        regex: testRegex,
        string: testString,
      });
    }
  }
});
