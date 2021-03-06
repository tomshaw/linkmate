import { uniqueID } from "@/library/utils";

// indexes
export const documentFields = ["title", "description", "category", "expires"];
export const databaseFields = ["enabled", "selected", "verified", "categories"];

// schemas
export const documentSchema = {
  description: '',
  domain: '',
  hostname: '',
  image: '',
  images: [],
  match: '',
  origin: '',
  title: '',
  url: ''
}

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

export const categories = ["Arts", "Business", "Entertainment", "Health", "Politics", "Science", "Sports", "Technology", "Weather"];

export const defaultDatabases = [{
  _id: uniqueID(),
  title: "My Database",
  local: "documents",
  remote: "",
  type: "system",
  enabled: true,
  selected: true,
  verified: false,
  username: "",
  password: "",
  description: "The default installation database.",
  categories: categories
}, {
  _id: uniqueID(),
  title: "Development Database",
  local: "development",
  remote: "http://localhost:5984/development",
  type: "system",
  enabled: true,
  selected: false,
  verified: false,
  username: "admin",
  password: "",
  description: "The default development installation database.",
  categories: categories
}];
