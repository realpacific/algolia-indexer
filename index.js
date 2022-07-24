const algoliasearch = require('algoliasearch')
const fs = require('fs')
const path = require('path')

const inputs = process.argv.filter(it => it.trim().length > 0)

function getValueOfKeyInArgumentOrNull(keyName) {
  keyName = `--${keyName}`;
  const index = inputs.findIndex((input) => input === keyName)
  if (index === -1) {
    return null;
  }
  const value = inputs[index + 1];
  if (value == null || value.startsWith('--') || value.trim().length === 0) {
    return null;
  }
  return value
}

function getValueOfKeyInArgument(keyName) {
  const throwMissingArgumentError = (keyName) => {
    throw new Error(`Missing input for --${keyName}`)
  }
  return getValueOfKeyInArgumentOrNull(keyName) || throwMissingArgumentError(keyName)
}

(async function (appId, apiKey, indexName, fileLocation) {
  const file = path.join(__dirname, fileLocation)

  console.log(`Reading file ${file}`)

  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  const client = algoliasearch(appId, apiKey)

  const index = client.initIndex(indexName)

  const result = Array.isArray(data) ? index.saveObjects(data) : index.saveObject(data)
  result.then(() => {
    console.log("Successfully uploaded")
    process.exit(0);
  }).catch(() => {
    console.log("Failed to upload documents")
    process.exit(1);
  })
})(
    getValueOfKeyInArgument("appId"),
    getValueOfKeyInArgument("apiKey"),
    getValueOfKeyInArgument("index"),
    getValueOfKeyInArgument("fileLocation")
)