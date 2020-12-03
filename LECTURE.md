# Building a Node CLI

## Learning Goals

- [ ] Differentiate between Node environment and browser environment
- [ ] Run code using Node
- [ ] Understand the Node event loop
- [ ] Use `npm` to install packages

## Deliverables

### MVP
- [ ] Run a Node app from the command line
- [ ] Generate folders
- [ ] Generate files (html, js, css)
- [ ] Initialize a `git` repository with `simple-git`

### Stretch
- [ ] Use file templates instead of strings?
- [ ] Use `inquirer`, `chalk`, `figlet`, etc for nicer terminal output?
- [ ] Create a remote repo on Github & push up the code?
- [ ] Whatever your heart desires

## Intro to Node

When JavaScript was initially created, it was designed to be run in the browser. And so far, that's where we've been running all our JavaScript code. Because we're running it in the browser, we have a whole bunch of additional features available through different browser APIs. We can:

- Manipulate the DOM using the DOM API;
- Make network requests using `fetch`;
- Run timers using `setTimeout` and `setInterval`;
- And more!

All the features mentioned above **are not part of the JavaScript language itself** - they are available because they have been implemented by the various browser engines (such as Chrome's V8 engine and Firefox's SpiderMonkey engine) as tools that are available in the browser environment.

> You'll notice that these tools are all available on the global `window` object - using `fetch` is the same as using `window.fetch`, and using `setTimeout` is the same as using `window.setTimeout`. That's a good indication that these features are part of the browser environment rather than part of the JavaScript language itself!

However, there are many things that we *can't* do with JavaScript in the browser environment, that other languages are able to do. Think about some things we were able to do with Ruby: we could read or write files from the computer's file system; we could use Ruby to create a server (Rails/Rack/Sinatra) that can listen for requests and send responses; and other things that are useful for writing software that takes full advantage of all of a computer's hardware. 

## Node.js

As JavaScript has gained popularity, there was more of a demand for a tool that would let you run JavaScript code on the *server* as well as the *client* - that way, developers and teams that were experts in JavaScript wouldn't need to master a second language to write server-side code in addition to the client-side code the were already writing in JS. In 2009, Node.js was born as a tool to do just that.

Node is build on the same V8 engine behind the Chrome browser, but unlike browser-based JavaScript, it gives developers access to a different set of features. With Node, we can use JavaScript to:

- Read and write files from the file system;
- Interact directly with databases;
- Handle network traffic;
- And more!

In the last 11 years, Node.js has matured greatly and is now used for a wide array of projects. Through package management tools like `npm`, developers have access to a huge ecosystem of tools for making all kinds of Node applications. 

## Running Node

You should have Node installed; you can check by running:

```sh
$ node -v
```

You can run a Node REPL (like IRB in Ruby) by running:

```sh
$ node
```

This will allow you to write JavaScript in your terminal!

```sh
> const add = (num1, num2) => num1 + num2
undefined
> add(2, 2)
4
```

You can also use Node to run JavaScript files. There's an `example.js` file included here - to run the code in it, run:

```sh
$ node example.js
```

So far so good! We aren't yet taking advantage of any of Node-specific features yet though, so let's build a small application and see what we can learn from there.

## Building a Node App

For our application, we'll be building a *Vanilla JavaScript Website Generator* - a CLI tool for generating the files we need for a static website. We want an application that we can run from the command line that will:

- Take in user input
- Based on the user input, create a directory with an HTML file, CSS file, and JavaScript file
- Initialize `git` in the newly created directory

It should work something like this:

```sh
$ vanilla-js-scaffold my-project
> Generating scaffold for my-project
> Generating project directory...
> Generating html file...
> Generating css file...
> Generating js file...
> Initializing git...
> Done!
```

With that goal in mind, let's see how we can use Node to build out this CLI application!

## Node CLI Basics

As a first goal, let's try use Node from the command line and see how we can work with getting arguments from the user when they run our CLI. We'll be writing code in the `starter` directory, so `cd` into the `starter` directory now.

We want our users to specify their project's name when they run the CLI, so we can access the project name specified by the user.

In the `index.js` file, add the following:

```js
console.log(process.argv)
```

Now, run: 

```sh
$ node index.js my-project
```

You should see something like this:

```sh
[
  '/Users/ianhollander/.nvm/versions/node/v15.3.0/bin/node',
  '/Users/ianhollander/dev/javascript/intro-to-node/starter/index.js',
  'my-project'
]
```

To break it down:

- `process` is a special object built into Node that has information about our Node environment
- `process.argv` is a property of the `process` object that lets us access the CLI invocation arguments (first element is our Node command; the second element is the file path of the file we ran; and the other elements are any additional arguments provided by the user)

We just care about the `my-project` part of the `argv` array, so let's update our code like this:

```js
const projectName = process.argv[2]
console.log(`Generating scaffold for ${projectName}`)
```

Run your code again:

```sh
$ node index.js my-project
> Generating scaffold for my-project
```

## Creating Files & Folders

Our next step is to use the project name to create a new folder for the project, and create some files with a bit of starter code. We want to end up with a folder structure like this:

```
.
├── project-name
│   ├── src
│   │   └── index.js
│   ├── styles
│   │   └── main.css
│   └── index.html
```

In order to work with the file system in Node, we'll need to `require` a special Node module called `fs`.

> Think of `require` here much like `require` in Ruby - it's a way for us to bring in some external code into our project! In this case, we're bringing in a *core module* - some code that is built into Node. We can also bring in code from external packages, and from other local files, as we'll see later. 

> You will also see the `import/export` syntax used in certain JavaScript environments - this accomplishes the same thing, but using `require` is more common in a Node environment since `import/export` was only recently added to Node.

Let's bring it in! At the top of the file, write:

```js
const fs = require("fs")
```

This will give us access to the `fs` module as a variable called `fs`.

> It's common practice to write all your `require` statements at the top of the file!

Next, we can use the `fs` module to create a folder:

```js
// use the fs module in our code
const fs = require("fs")

// get the project name from the command line
const projectName = process.argv[2]

console.log(`Generating scaffold for ${projectName}`)

// get the path to the folder we're creating
// NOTE: make sure your folder path matches the directory you're working in! run `pwd` in your terminal to get the full path
const folderName = `/Users/ianhollander/dev/javascript/intro-to-node/starter/${projectName}`

console.log(`Generating project directory...`)

try {
  // check if the folder already exists
  fs.accessSync(folderName)
} catch(e) {
  // if it doesn't exist, create it
  fs.mkdirSync(folderName)
}
```

If you run the code now, you should see a newly created directory appear!

```sh
$ node index.js my-project
```

Let's clean up on thing here before moving ahead. The full path to the project is currently hard-coded, but it would be nice to get this path dynamically instead:

```js
const folderName = `/Users/ianhollander/dev/javascript/intro-to-node/starter/${name}`
```

To do that, we can use another Node module, `path`, along with a special method, `process.cwd()`, to put together our folder name based on the current working directory instead of hard coding it:

```js
const path = require("path")

const projectName = process.argv[2]

const folderName = path.join(process.cwd(), projectName)

console.log(folderName)
```

All together, our app should look like this:

```js
const fs = require("fs")
const path = require("path")

const projectName = process.argv[2]

console.log(`Generating scaffold for ${projectName}`)

const folderName = path.join(process.cwd(), projectName)

console.log(`Generating project directory...`)

try {
  fs.accessSync(folderName)
} catch(e) {
  fs.mkdirSync(folderName)
}
```

Let's also create the sub-folders (`src` and `styles`) to match our desired folder structure:

```js
console.log(`Generating project directory...`)

try {
  fs.accessSync(folderName)
} catch(e) {
  fs.mkdirSync(folderName)
}

const cssFolder = path.join(folderName, "styles")

try {
  fs.accessSync(cssFolder)
} catch(e) {
  fs.mkdirSync(cssFolder)
}

const srcFolder = path.join(folderName, "src")

try {
  fs.accessSync(srcFolder)
} catch(e) {
  fs.mkdirSync(srcFolder)
}
```

You've probably noticed at this point that our code isn't particularly DRY - so let's make a helper function for the logic of creating folders:

```js
const createFolder = folderName => {
  const folder = path.join(process.cwd(), folderName)

  try {
    fs.accessSync(folder)
  } catch(e) {
    fs.mkdirSync(folder)
    console.log(`Generated directory: ${folderName}`)
  }
}

// create root directory for project
createFolder(projectName)
// create src directory
createFolder(`${projectName}/src`)
// create styles directory
createFolder(`${projectName}/styles`)
```

After that refactor our code should look like this:

```js
const fs = require("fs")
const path = require("path")

const projectName = process.argv[2]

console.log(`Generating scaffold for ${projectName}`)

const createFolder = folderName => {
  const folder = path.join(process.cwd(), folderName)

  try {
    fs.accessSync(folder)
  } catch(e) {
    fs.mkdirSync(folder)
    console.log(`Generated directory: ${folderName}`)
  }
}

createFolder(projectName)
createFolder(`${projectName}/src`)
createFolder(`${projectName}/styles`)
```

## Writing Files

Next, let's also use Node to generate some project files. We'll also use the `fs` module for this, using a method called `writeFileSync`:

```js
fs.writeFileSync(fileName, contents)
```

When we use `writeFileSync`, we must provide 3 arguments:

- the name of the file
- the contents of the file (a string of text to write to the file)

Let's use it to create the `index.html` file first:

```js
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./styles/main.css">
  <script src="./src/index.js"></script>
  <title>${projectName}</title>
</head>
<body>
  <h1>${projectName}</h1>
</body>
</html>
`

console.log(`Generating index.html...`)
const htmlFile = path.join(process.cwd(), `${projectName}/index.html`)
fs.writeFileSync(htmlFile, htmlTemplate.trim())
```

And we can do the same for our Javascript and CSS files:

```js
// Javascript starter code
const jsTemplate = `
console.log("Hello from JS!")
`

console.log(`Generating index.js...`)
const jsFile = path.join(process.cwd(), `${projectName}/src/index.js`)
fs.writeFileSync(jsFile, jsTemplate.trim())


// CSS starter code
const cssTemplate = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
`

console.log(`Generating main.css...`)
const cssFile = path.join(process.cwd(), `${projectName}/styles/main.css`)
fs.writeFileSync(cssFile, cssTemplate.trim())
```

Just like with our folder creation code, there's a good opportunity to refactor here. Let's create another helper function:

```js
const createFile = (fileName, content) => {
  const file = path.join(process.cwd(), fileName)
  
  fs.writeFileSync(file, content.trim())
  console.log(`Generated file: ${fileName}`)
}

// example use:
const jsTemplate = `
console.log("Hello from JS!")
`

createFile(`${projectName}/src/index.js`, jsTemplate)
```

## Node Sync vs Async

Let's talk a bit about how Node works under the hood. When we run a Node application, Node uses an [Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/) to perform non-blocking I/O operations, despite Javascript being a single-threaded language. Much like our code for handling user events (like event listeners) when running JavaScript in the browser, it's important that any operations we run don't block the main thread, so that the rest of our code can continue running while long-running tasks run in the background.

So far, we've been writing all of our code using some special *synchronous* functions:

- `accessSync`
- `mkdirSync`
- `writeFileSync`

Whenever we use these functions, Node will be *blocked* from running any additional code until these synchronous actions complete. That's not great! Since there's no guarantee of how long it will take to perform these I/O operations, like reading/writing files, it's **much better** to handle these actions using *asynchronous* code instead.

Let's refactor our `createFolder` function to use the *async* versions these functions:

```js
const createFolder = folderName => {
  const folder = path.join(process.cwd(), folderName)

  // fs.access lets us know if the folder already exists and is accessible by Node
  fs.access(folder, (err) => {
    if (err) {
      // if the folder doesn't exist, create a new one
      fs.mkdir(folder, (err) => {
        if (err) throw err
        console.log(`Generated directory: ${folderName}`)
      })
    }
  })
}
```

Now that we're working with the *async* versions of these functions, we need a way to run code after the folder has been accessed/created; in Node, all functions that work asynchronously will have a last argument of a *callback function* that will run after the operation has been completed (like a callback function for an event listener).

With these callback functions, the first argument is always an *error object* that will include any errors that occurred when running the function; that way, we can check if the operation was successful before moving on to the next step.

We're doing a bit better in terms of following Node best practices and using the async versions of these functions, but now our code doesn't look so great. We've quickly fallen into a [pyramid of doom](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming)) situation with multiple nested callback functions. Alas!

To clean up our code, we can also refactor it to work with *promises* instead of callback functions, and use the *async/await* syntax with these promises:

```js
const createFolder = async folderName => {
  const folder = path.join(process.cwd(), folderName)

  try {
    await fs.promises.access(folder)
  } catch(e) {
    await fs.promises.mkdir(folder)
    console.log(`Generated directory: ${folderName}`)
  }
}
```

Now, our code looks a lot more like the *sync* version, but it's still functioning asynchronously!

Let's see how the rest of our code looks now with this refactor (we'll also make our `createFile` function async):

```js
// use these modules in our code
const fs = require("fs")
const path = require("path")

// get the project name from the command line
const projectName = process.argv[2]

console.log(`Generating scaffold for ${projectName}`)

/**** Folder/File Helpers ****/ 
const createFolder = async folderName => {
  const folder = path.join(process.cwd(), folderName)

  try {
    await fs.promises.access(folder)
  } catch(e) {
    await fs.promises.mkdir(folder)
    console.log(`Generated directory: ${folderName}`)
  }
}

const createFile = async (fileName, content) => {
  const file = path.join(process.cwd(), fileName)
  
  await fs.promises.writeFile(file, content.trim())
  console.log(`Generated file: ${fileName}`)
}

// Templates
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./styles/main.css">
  <script src="./src/index.js"></script>
  <title>${projectName}</title>
</head>
<body>
  <h1>${projectName}</h1>
</body>
</html>
`

const jsTemplate = `
console.log("Hello from JS!")
`

const cssTemplate = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
`

const run = async () => {
  // Create Folders
  await createFolder(projectName)
  await createFolder(`${projectName}/src`)
  await createFolder(`${projectName}/styles`)

  // Create Files
  await createFile(`${projectName}/index.html`, htmlTemplate)
  await createFile(`${projectName}/styles/main.css`, cssTemplate)
  await createFile(`${projectName}/src/index.js`, jsTemplate)
}

run()
```

## Modular Code

Currently, all of our CLI code is in one file: `index.js`. Let's see how we can separate out our code across multiple files using node.

First, let's make a new file called `lib/files.js` for managing code related to creating files and folders. We'll move our `createFolder` and `createFile` code into this file.

We'll also `require` the `fs` and `path` modules here, since our functions depend on that code:

```js
// lib/files.js
const fs = require("fs")
const path = require("path")

const createFolder = async folderName => {
  const folder = path.join(process.cwd(), folderName)

  try {
    await fs.promises.access(folder)
  } catch(e) {
    await fs.promises.mkdir(folder)
    console.log(`Generated directory: ${folderName}`)
  }
}

const createFile = async (fileName, content) => {
  const file = path.join(process.cwd(), fileName)
  
  await fs.promises.writeFile(file, content.trim())
  console.log(`Generated file: ${fileName}`)
}
```

Next, at the bottom of the file, we need to `export` these functions so we can use them in other places in our application:

```js
// lib/files.js
module.exports = { createFolder, createFile }
```

Finally, in order to use these functions in our `index.js` file, we need to `require` them in at the top of the file:

```js
// index.js
const { createFolder, createFile } = require("./lib/files")
```

Let's also extract our template variables to their own file:

```js
// lib/templates.js

// make this into a function so we can pass in the project name
const makeHtmlTemplate = projectName => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./styles/main.css">
  <script src="./src/index.js"></script>
  <title>${projectName}</title>
</head>
<body>
  <h1>${projectName}</h1>
</body>
</html>
`

const jsTemplate = `
console.log("Hello from JS!")
`

const cssTemplate = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
`

module.exports = {
  makeHtmlTemplate,
  jsTemplate,
  cssTemplate
}
```

...and import that code in our `index.js` file:

```js
// index.js
const { createFolder, createFile } = require("./lib/files")
const {
  makeHtmlTemplate,
  jsTemplate,
  cssTemplate
} = require("./templates")

const run = async () => {
  const projectName = process.argv[2]

  console.log(`Generating scaffold for ${projectName}`)

  // Create Folders
  await createFolder(projectName)
  await createFolder(`${projectName}/src`)
  await createFolder(`${projectName}/styles`)

  // Create Files
  await createFile(`${projectName}/index.html`, makeHtmlTemplate(projectName))
  await createFile(`${projectName}/styles/main.css`, cssTemplate)
  await createFile(`${projectName}/src/index.js`, jsTemplate)
}

run()
```

## Adding External Library Code

We've got one key feature left: being able to initialize a new `git` repository in our newly created project directory! THere are a number of ways to do that, but let's solve it by using the [simple-git](https://www.npmjs.com/package/simple-git) package.

In order to add external packages to our project, we need to generate a `package.json` file (think of this like a `Gemfile` for Javascript). To generate the `package.json` file, from the root directory of your project, run: 

```sh
$ npm init -y
```

This will generate a `package.json` file with the default configuration. Here's some info on what the [different properties in the `package.json` file are used for](https://nodesource.com/blog/the-basics-of-package-json-in-node-js-and-npm/).

Now that we've got this file, we can install NPM packages! To add the `simple-git` package, run:

```sh
$ npm install simple-git
```

This will:

- Download the `simple-git` files, along with any other packages it depends on;
- Save them to a `node_modules` folder; and
- Create a `package-lock.json` file specifying the exact versions of these packages that were downloaded

It's a good idea to add the `node_modules` folder to `.gitignore`, since there will be a *lot* of code in there. Make a `.gitignore` file and add this code:

```
/node_modules
```

We're almost there! Now that we have the package installed, let's add it to our `index.js` file:

```js
const simpleGit = require("simple-git")
```

Then, in our `run` function, we can use the `git.init()` method to initialize `git` in our project folder:

```js
const run = async () => {
  const projectName = process.argv[2]

  console.log(`Generating scaffold for ${projectName}`)

  // Create Folders
  await createFolder(projectName)
  await createFolder(`${projectName}/src`)
  await createFolder(`${projectName}/styles`)

  // Create Files
  await createFile(`${projectName}/index.html`, makeHtmlTemplate(projectName))
  await createFile(`${projectName}/styles/main.css`, cssTemplate)
  await createFile(`${projectName}/src/index.js`, jsTemplate)
  
  // Initialize Git
  const git = simpleGit({
    baseDir: `${process.cwd()}/${projectName}`
  })

  await git.init()
  console.log("Initialized new git repository")

  console.log("Done!")
}
```

## Running Our CLI App

So far, when we've been running the CLI app, we've been using this command from in the project directory:

```sh
$ node index.js project-name
```

It'd be nice to make our app run using globally, using a simpler command, like:

```sh
$ vanilla-js-generate project-name
```

We need to change a couple things to get this working.

First, let's use a [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) to make our `index.js` file executable. At the top of the file:

```js
#!/usr/bin/env node
```

Next, in the `package.json` file, add this line:

```json
"bin": {
  "vanilla-js-generate": "./index.js"
},
```

Finally, run this to install the command globally:

```sh
$ npm install -g
```

Now, you should be able to run `vanilla-js-generate my-project` from any directory you wish!


## Resources

- [Learn Node](https://nodejs.dev/learn/)
- [package.json](https://docs.npmjs.com/cli/v6/configuring-npm/package-json)
