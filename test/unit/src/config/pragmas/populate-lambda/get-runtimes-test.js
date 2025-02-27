let { join } = require('path')
let test = require('tape')
let sut = join(process.cwd(), 'src', 'config', 'pragmas', 'populate-lambda', 'get-runtime')
let getRuntimes = require(sut)
let c = runtime => ({ runtime })

test('Set up env', t => {
  t.plan(1)
  t.ok(getRuntimes, 'getRuntimes util is present')
})

test('Friendly runtime names (aka aliases)', t => {
  t.plan(14)
  let config

  config = getRuntimes(c('Node.js'))
  t.match(config.runtime, /nodejs1[02468]\.x/, `Alias mapped to valid AWS Node.js string: ${config.runtime}`)
  t.equal(config.runtimeAlias, 'node.js', `Alias returned lowcase as runtimeAlias: ${config.runtimeAlias}`)

  config = getRuntimes(c('Python'))
  t.match(config.runtime, /python3\.\d/, `Alias mapped to valid AWS Python string: ${config.runtime}`)
  t.equal(config.runtimeAlias, 'python', `Alias returned lowcase as runtimeAlias: ${config.runtimeAlias}`)

  config = getRuntimes(c('ruby'))
  t.match(config.runtime, /ruby2\.\d/, `Alias mapped to valid AWS Ruby string: ${config.runtime}`)
  t.equal(config.runtimeAlias, 'ruby', `Alias returned lowcase as runtimeAlias: ${config.runtimeAlias}`)

  config = getRuntimes(c('java'))
  t.match(config.runtime, /java\d/, `Alias mapped to valid AWS Java string: ${config.runtime}`)
  t.equal(config.runtimeAlias, 'java', `Alias returned lowcase as runtimeAlias: ${config.runtimeAlias}`)

  config = getRuntimes(c('golang'))
  t.match(config.runtime, /go\d\.x/, `Alias mapped to valid AWS Go string: ${config.runtime}`)
  t.equal(config.runtimeAlias, 'golang', `Alias returned lowcase as runtimeAlias: ${config.runtimeAlias}`)

  config = getRuntimes(c('.net'))
  t.match(config.runtime, /dotnetcore\d\.\d/, `Alias mapped to valid AWS .NET string: ${config.runtime}`)
  t.equal(config.runtimeAlias, '.net', `Alias returned lowcase as runtimeAlias: ${config.runtimeAlias}`)

  config = getRuntimes(c('custom'))
  t.match(config.runtime, /provided/, `Alias mapped to valid AWS custom runtime string: ${config.runtime}`)
  t.equal(config.runtimeAlias, 'custom', `Alias returned lowcase as runtimeAlias: ${config.runtimeAlias}`)
})

test('Exact runtime names', t => {
  t.plan(16)
  let name
  let config

  name = 'nodejs14.x'
  config = getRuntimes(c(name))
  t.equal(config.runtime, name, `Returned correct runtime string: ${name}`)
  t.notOk(config.runtimeAlias, 'Did not get runtimeAlias')

  name = 'python3.9'
  config = getRuntimes(c(name))
  t.equal(config.runtime, name, `Returned correct runtime string: ${name}`)
  t.notOk(config.runtimeAlias, 'Did not get runtimeAlias')

  name = 'ruby2.7'
  config = getRuntimes(c(name))
  t.equal(config.runtime, name, `Returned correct runtime string: ${name}`)
  t.notOk(config.runtimeAlias, 'Did not get runtimeAlias')

  name = 'java11'
  config = getRuntimes(c(name))
  t.equal(config.runtime, name, `Returned correct runtime string: ${name}`)
  t.notOk(config.runtimeAlias, 'Did not get runtimeAlias')

  name = 'go1.x'
  config = getRuntimes(c(name))
  t.equal(config.runtime, name, `Returned correct runtime string: ${name}`)
  t.notOk(config.runtimeAlias, 'Did not get runtimeAlias')

  name = 'dotnetcore3.1'
  config = getRuntimes(c(name))
  t.equal(config.runtime, name, `Returned correct runtime string: ${name}`)
  t.notOk(config.runtimeAlias, 'Did not get runtimeAlias')

  name = 'provided.al2'
  config = getRuntimes(c(name))
  t.equal(config.runtime, name, `Returned correct runtime string: ${name}`)
  t.notOk(config.runtimeAlias, 'Did not get runtimeAlias')

  name = 'deno'
  config = getRuntimes(c(name))
  t.equal(config.runtime, name, `Returned correct runtime string: ${name}`)
  t.notOk(config.runtimeAlias, 'Did not get runtimeAlias')
})

test('Invalid runtime', t => {
  t.plan(5)
  let config

  let empty = {}
  config = getRuntimes(empty)
  t.notOk(Object.keys(config).length, 'Did not mutate config without runtime')

  let num = { runtime: 1 }
  config = getRuntimes(num)
  t.deepEqual(config, num, 'Did not mutate config with !string runtime')

  let blank = { runtime: '' }
  config = getRuntimes(blank)
  t.deepEqual(config, blank, 'Did not mutate config with empty string runtime')

  let invalid = { runtime: 'fail' }
  config = getRuntimes(invalid)
  t.deepEqual(config, invalid, 'Did not mutate config with bad runtime')
  t.notOk(config.runtimeAlias, 'Did not get runtimeAlias')
})
