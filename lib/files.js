// getting access to the fs (file system) module from node
const fs = require('fs')

const createFolder = folder => {
  const folderName = `${process.cwd()}/${folder}`
  
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName)
    }
  } catch (err) {
    console.error(err)
  }
}

const createFile = async (filePath, content) => {
  
  // make folders based on file path
  const folders = filePath.split("/").slice(0, -1)
  for (let i = 0; i < folders.length; i++) {
    const folder = folders.slice(0, i + 1).join("/")
    createFolder(folder)
  }

  // make file
  const folderName = `${process.cwd()}/${filePath}`
  try {
    await fs.promises.writeFile(folderName, content.trim())
    console.log(`📄 Generated ${filePath}`)
  } catch(err) {
    console.error(err) 
  }
}

module.exports = {
  createFile
}
