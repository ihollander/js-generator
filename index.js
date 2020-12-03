#!/usr/bin/env node

const simpleGit = require("simple-git")

const { createFile } = require("./lib/files")
const { cssTemplate, makeHtmlTemplate, makeJsTemplate } = require("./lib/templates")

const projectName = process.argv[2]

const generate = async () => {
  console.log("🤠 Howdy! We're making your project now!")

  createFile(`${projectName}/styles/main.css`, cssTemplate)
  createFile(`${projectName}/src/index.js`, makeJsTemplate(projectName))
  createFile(`${projectName}/index.html`, makeHtmlTemplate(projectName))

  const git = simpleGit(`${process.cwd()}/${projectName}`)
  await git.init()

  console.log("🐙 Initialized new git repository")

  console.log("🤠 Done!")
}

generate()