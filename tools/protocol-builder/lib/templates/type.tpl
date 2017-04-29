var <classname> = function () {
  <vars>
};

<superDep>
  
module.exports = function () {
  return new <classname>();
};

<classname>.prototype.serialize = function (output) {
  this.serializeAs_<classname>(output);
};

<classname>.prototype.deserialize = function (input) {
  this.deserializeAs_<classname>(input);
};

<classname>.prototype.serializeAs_<classname> = function (param1) {
  <serialize>
};

<classname>.prototype.deserializeAs_<classname> = function (param1) {
  <deserialize>
};

<classname>.prototype.getTypeId = function () {
  return <id>;
};

<classname>.prototype.getClassName = function () {
  return '<classname>';
};

module.exports.id = <id>;
module.exports.<classname> = <classname>;