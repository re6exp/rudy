const Github = require('github')
const eslint = require('eslint')
const exec = require('child-process-promise').exec

const cli = new eslint.CLIEngine()


const setStatuses = () => {
  const gh = new Github()
  const status = authenticateWithGithub(gh, process.env)

  setLintStatus(gh, status)
  setFlowStatus(gh, status)
  setJestStatus(gh, status)
}


const authenticateWithGithub = (gh, { TRAVIS_EVENT_TYPE, TRAVIS_REPO_SLUG, TRAVIS_JOB_ID, GITHUB_TOKEN }) => {
  const sha = getCommitSha(TRAVIS_EVENT_TYPE)
  const repoSlug = TRAVIS_REPO_SLUG
  const target_url = `https://travis-ci.org/${repoSlug}/jobs/${TRAVIS_JOB_ID}`
  const parsedSlug = repoSlug.split('/')
  const owner = parsedSlug[0]
  const repo = parsedSlug[1]

  gh.authenticate({
    token: GITHUB_TOKEN,
    type: 'oauth',
  }, err => {
    if (err) console.error('Error authenticating GitHub', err)
  })

  return {
    sha,
    target_url,
    owner,
    repo,
  }
}


const getCommitSha = eventType => {
  if (eventType === 'push') {
    return process.env.TRAVIS_COMMIT
  }
  else if (eventType === 'pull_request') {
    const travisCommitRange = process.env.TRAVIS_COMMIT_RANGE
    const parsed = travisCommitRange.split('...')
    return parsed.length === 1 ? travisCommitRange : parsed[1]
  }

  console.error('event type \'%s\' not supported', eventType)
  return null
}


const setLintStatus = async (gh, status) => {
  const { stdout } = await exec(`git diff --name-only ${process.env.TRAVIS_COMMIT_RANGE} -- '*.js'`)
  const files = stdout // paths of *.js files that changed in the commit/PR
      .split('\n')
      .slice(0, -1) // Remove the extra "" caused by the last newline

  const { errorCount, warningCount, results } = cli.executeOnFiles(cli.resolveFileGlobPatterns(files))

  const description = `errors: ${errorCount} warnings: ${warningCount}`
  const success = errorCount === 0
  setStatus(gh, status, 'ESLint Report', description, success)

  const format = cli.getFormatter()
  const log = format(results)
  console.log(log)
}


const setFlowStatus = async (gh, status) => {
  const { stdout } = await exec('./node_modules/.bin/flow check | tail -1')
  const errorCount = parseInt(stdout.replace('Found ', ''))

  const description = `errors: ${errorCount}`
  const success = errorCount === 0
  setStatus(gh, status, 'Flow Report', description, success)

  console.log(stdout)
}


const setJestStatus = async (gh, status) => {
  const { stderr } = await exec('./node_modules/.bin/jest');

  const regex = /Tests:\s+(\d+)\D+(\d+)\s+total/
  const [passedCount, testCount] = regex
    .exec(stderr)
    .slice(1, 3)
    .map(num => parseInt(num))

  const description = `${passedCount} passed, ${testCount} total`
  const success = passedCount === testCount
  setStatus(gh, status, 'Jest Tests', description, success)

  console.log(cli.getFormatter()(stderr))
}


const setStatus = (gh, status, context, description, success) => {
  gh.repos.createStatus(Object.assign({
    context,
    description,
    state: success ? 'success' : 'failure',
  }, status), err => {
    console.log(`${context}: DONE!`)

    if (err) {
      console.error(`${context}: Error creating status`, err)
    }
    else {
      console.log(`${context}: SUCCESS`)
    }
  })
}

setStatuses()

/**

exec('./node_modules/.bin/jest').then(res => {
  const regex = /Tests:\s+(\d+)\D+(\d+)\s+total/gm
  const str = res.stderr

  let m

  if ((m = regex.exec(str)) !== null) {
      m.forEach((match, groupIndex) => {
          console.log(`Found match, group ${groupIndex}: ${match}`)
      })
  }
})


exec('./node_modules/.bin/jest').then(res => {
  console.log('DONE', res)
})


exec('./node_modules/.bin/jest').then(res => {
  const regex = /Tests:\s+(\d+)\D+(\d+)\s+total/
  const str = res.stderr

  const arr = regex
    .exec(str)
    .slice(1, 3)
    .map(num => parseInt(num))

  console.log(arr)
})

**/
