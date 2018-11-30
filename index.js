const request = require('request-promise')
const username = 'sterlingwes'
const key = '9a99a9c7df393edf70f967ba49ceabb72ad6b421'
const token = Buffer.from(`${username}:${key}`).toString('base64')

const get = (path) => ({
  uri: `https://api.github.com${path}`,
  headers: {
    'Authorization': `Basic ${token}`,
    'User-Agent': username
  },
  json: true,
})

const wrapResponse = (body, nextFn, ...args) => {
  return {
    body,
    getNext: nextFn.bind(null, ...args)
  }
}

const getPRs = async (owner, repo, page = 1) => {
  return request(get(`/repos/${owner}/${repo}/pulls`))
    .then(response => wrapResponse(response, getPRs, owner, repo, page + 1))
}

module.exports = {
  getPRs
}
