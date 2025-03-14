"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_ARGS = void 0;
exports.convertTo = convertTo;
var _child_process = _interopRequireDefault(require("child_process"));
var _util = _interopRequireDefault(require("util"));
var _cleanup = require("./cleanup");
var _logs = require("./logs");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const exec = _util.default.promisify(_child_process.default.exec);
const DEFAULT_ARGS = ['--headless', '--invisible', '--nodefault', '--view', '--nolockcheck', '--nologo', '--norestore'];
exports.DEFAULT_ARGS = DEFAULT_ARGS;
const LO_BINARY_PATH = 'libreoffice24.8';
async function convertTo(filename, format) {
  await (0, _cleanup.cleanupTempFiles)();
  const argumentsString = DEFAULT_ARGS.join(' ');
  const outputFilename = filename.split(/\\ /).join(' ');
  const cmd = `cd /tmp && ${LO_BINARY_PATH} ${argumentsString} --convert-to ${format} --outdir /tmp '/tmp/${outputFilename}'`;
  let logs;

  // due to an unknown issue, we need to run command twice
  try {
    logs = (await exec(cmd)).stdout;
  } catch (e) {
    logs = (await exec(cmd)).stdout;
  }
  await exec(`rm '/tmp/${outputFilename}'`);
  await (0, _cleanup.cleanupTempFiles)();
  return (0, _logs.getConvertedFilePath)(logs.toString());
}