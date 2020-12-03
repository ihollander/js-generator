const cssTemplate = `
/* CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

button {
  background: pink;
}

.fezzik::before {
  content: "woof";
}
`

const makeJsTemplate = projectName => `
console.log("Hello from ${projectName}")
`

const makeHtmlTemplate = projectName => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./styles/main.css">
  <script src="./src/index.js" defer></script>
  <title>${projectName}</title>
</head>
<body>
  <h1>${projectName}</h1>
</body>
</html>
`

module.exports = {
  makeHtmlTemplate,
  makeJsTemplate,
  cssTemplate
}