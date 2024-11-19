const config = require('../config');
const commands = [];

function cmd(command, functionRef) {
  command.function = functionRef;
  
  if (!command.pattern && command.cmdname) {
    command.pattern = command.cmdname;
  }
  
  if (!command.alias) {
    command.alias = [];
  }
  
  if (!command.dontAddCommandList) {
    command.dontAddCommandList = false;
  }
  
  if (!command.desc) {
    command.desc = command.info ? command.info : '';
  }
  
  if (!command.fromMe) {
    command.fromMe = false;
  }
  
  if (!command.type) {
    command.type = command.type ? command.type : 'misc';
  }
  
  command.info = command.desc;
  command.type = command.type;
  
  if (!command.category) {
    command.category = '';
  }
  
  if (!command.filename) {
    command.filename = 'Not Provided';
  }
  
  commands.push(command);
  return command;
}

const Module = {
  'export': cmd
};

module.exports = {
  cmd: cmd,
  AddCommand: cmd,
  Function: cmd,
  Module: Module,
  smd: cmd,
  commands: commands,
  bot: cmd
};
