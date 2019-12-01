//import { getDbName } from '../utils'

export const databaseSchema = {
  id: 0,
  title: "",
  local: "",
  remote: "",
  type: "user",
  enabled: false,
  selected: false,
  verified: false,
  username: "",
  password: "",
  description: "",
  categories: []
}

export const defaultDatabases = [{
  id: 1,
  title: "Default Database",
  local: "documents",
  remote: "http://localhost:5984/documents",
  type: "system",
  enabled: true,
  selected: true,
  verified: false,
  username: "root",
  password: "password",
  description: "The default installation database.",
  categories: []
}, {
  id: 2,
  title: "Development Database",
  local: "development",
  remote: "http://localhost:5984/development",
  type: "system",
  enabled: true,
  selected: false,
  verified: false,
  username: "root",
  password: "password",
  description: "The default development installation database.",
  categories: []
}];
