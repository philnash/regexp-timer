onmessage = (event) => {
  const { regex, string } = event.data;
  const result = new RegExp(regex).test(string);
  postMessage(result);
};
