# RegExp Timer

The [Regular expression Denial of Service (ReDoS) attack](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) exploits the implementation of a regular expression engine causing them to run in exponential time related to the input size. This tool allows you to test various regular expressions against different input inside your browser to measure the time it takes to test an input against a regular expression in order to illustrate this attack.

## Usage

Clone the repo from GitHub:

```sh
git clone https://github.com/philnash/regexp-timer.git
```

Install the dependencies:

```sh
npm install
```

Start the server:

```sh
npm start
```

You can now visit the application at [http://localhost:3000](http://localhost:3000).

## License

MIT License Copyright (c) 2023 Phil Nash