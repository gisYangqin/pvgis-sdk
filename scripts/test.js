const minimist = require('minimist') //命令参数解析
const rawArgs = process.argv.slice(2) //获取命令参数
const args = minimist(rawArgs) //解析命令参数
const path = require('path') //路径处理
const figlet = require('figlet') //ASCII字体
const versionStr = figlet.textSync('Pandavision GIS Libs') //获取版本信息
const Printer = require('@darkobits/lolcatjs') //彩色字体
let rootDir = path.resolve(__dirname, '../') //获取根目录
const ora = require('ora') //命令执行进度
if (args.p) {
  rootDir = rootDir + '\\packages\\' + args.p
  const _version = require(rootDir + '\\package.json').name
  console.log(Printer.fromString(`${_version} test cases \n${versionStr}`))
}
const jestArgs = ['--runInBand', '--rootDir', rootDir]
for (const key in args) {
  if (key !== 'p' && key !== '_') {
    jestArgs.push('--' + key)
  }
}
const spinner = ora(`\n ⏰ ===> running: jest ${jestArgs.join(' ')}`)
spinner.start()
require('jest').run(jestArgs)
spinner.stop()
