const test = require('tape')
const mockery = require('mockery')
const issuesMock = require('./fixtures/issues.json')

const prMock = function (repoUser, repoName) {
  if (!repoName) {
    return Promise.reject(new Error('invalid user'))
  }
  return Promise.resolve(issuesMock)
}

mockery.enable({ warnOnUnregistered: false })
mockery.registerMock('./lib/pr', prMock)

const getAllPullRequests = require('../')

test('module exports a function', (t) => {
  t.equal(typeof getAllPullRequests, 'function')
  t.end()
})

test('when using promises', (t) => {
  t.test('it should return all PRs from given repos', (assert) => {
    assert.plan(1)

    const repos = ['johndoe/somerepo']
    const labels = 'needs review, review'

    getAllPullRequests(repos, labels)
      .then((issues) => {
        assert.deepEquals(issues, issuesMock)
      })
  })

  t.test('it should reject when an error occurs', (assert) => {
    assert.plan(1)

    const repos = ['johndoe']
    const labels = 'needs review, review'

    getAllPullRequests(repos, labels)
      .catch((err) => {
        assert.deepEquals(err, new Error('invalid user'))
      })
  })
})

test('when using callbacks', (t) => {
  t.test('it should return all PRs from given repos', (assert) => {
    assert.plan(1)

    const repos = ['johndoe/somerepo']
    const labels = 'needs review, review'

    getAllPullRequests(repos, labels, (err, issues) => {
      assert.deepEquals(issues, issuesMock)
      assert.end(err)
    })
  })

  t.test('it should return error when error occurs', (assert) => {
    assert.plan(2)

    const repos = ['johndoe']
    const labels = 'needs review, review'

    getAllPullRequests(repos, labels, (err, issues) => {
      assert.deepEquals(err, new Error('invalid user'))
      assert.notOk(issues)
    })
  })
})
