/*jshint esversion: 9 */
// models
var BotCommand = require('@models/BotCommand');

function leave(msg) {
  return msg.il8nResponse('Hey you might be meaning to try !unfollow');
};


var command = new BotCommand({
  command_name: 'leave',
  execute: leave,
  short_help: 'leave.shorthelp',
  long_help: 'leave.longhelp',
  hidden: true,
  group: "control"
});


exports.register = function (commands) {
  commands.add(command);
};

exports.unRegister = function (commands) {
  commands.remove(command);
};
