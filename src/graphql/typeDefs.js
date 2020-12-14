const fs   = require('fs')
const path = require('path')

const SchemaPath = path.join(__dirname, 'schema.graphql')
const Schema     = fs.readFileSync(SchemaPath, "utf-8")

const typeDefs   = Schema

module.exports   = typeDefs