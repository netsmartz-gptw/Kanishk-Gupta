const dev_urls = {
  users: "https://devapi.project.org/users",
  chores: "https://devapi.project.org/chores",
  moodle: "https://devapi.project.org/moodle",
  subscription: "https://devapi.project.org/subscription",
  galileo: "https://devapi.project.org/galileo",
};

const qa_urls = {
  users: "https://qaapi.project.org/users",
  chores: "https://qaapi.project.org/chores",
  moodle: "https://qaapi.project.org/moodle",
  subscription: "https://qaapi.project.org/subscription",
  galileo: "https://qaapi.project.org/galileo",
};

const prod_urls = {
  users: "https://uatapi.project.org/users",
  chores: "https://uatapi.project.org/chores",
  moodle: "https://uatapi.project.org/moodle",
  subscription: "https://uatapi.project.org/subscription",
  galileo: "https://uatapi.project.org/galileo",
};

const local_urls = {
  users: "localhost:3000",
  chores: "localhost:3001",
  moodle: "localhost:3002",
  subscription: "localhost:3003",
  galileo: "localhost:3004",
};

module.exports = {
  development: dev_urls,
  production: prod_urls,
  localhost: local_urls,
  qa: qa_urls,
};
