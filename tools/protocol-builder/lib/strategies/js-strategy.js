var JsDiff = require('diff');
var _ = require('underscore');
var template = require('../template-manager.js');
var path = require('path');

module.exports = {
  enumConverter: function (asClass) {
    return template('./lib/templates/enum.tpl', [
      {key: 'vars', value: formatEnumConstants(asClass)}
    ]);
  },

  messageConverter: function (asClass) {
    var superDep = formatSuperImport(asClass);
    return template('./lib/templates/message.tpl', [
      {key: 'id', value: _.findWhere(asClass.constants, {name: 'protocolId'}).value},
      {key: 'superDep', value: formatSuperImport(asClass)},
      {key: 'classname', value: asClass.class},
      {key: 'vars', value: _.where(asClass.properties, {visibility: 'public'}).map(parseVariable).join('')},
      {key: 'serialize', value: escapeBody(_.findWhere(asClass.functions, {name: 'serializeAs_' + asClass.class}).body)},
      {key: 'deserialize', value: escapeBody(_.findWhere(asClass.functions, {name: 'deserializeAs_' + asClass.class}).body)},
      {key: 'typeDeps', value:  asClass.imports.map(function (d) {
        if(d.namespace.indexOf('dofus.network.types') === -1){
          return '';
        }
        var depPath = resolveDependencyPath(asClass.namespace, d.namespace) + resolveFilename(d.class) + '.js';
        return '\nvar ' + d.class + ' = require(\''+ depPath + '\').' + d.class + ';';
      }).join('')}
    ]).replace('\n\n\n', '\n').replace(/super.deserialize/g, 'this.deserializeAs_' + asClass.super).replace(new RegExp('super.serializeAs_' + asClass.super, 'g'), 'this.serializeAs_' + asClass.super);
  },

  typeConverter: function (asClass) {
    var superDep = formatSuperImport(asClass);
    return template('./lib/templates/type.tpl', [
      {key: 'id', value: _.findWhere(asClass.constants, {name: 'protocolId'}).value},
      {key: 'superDep', value: formatSuperImport(asClass)},
      {key: 'classname', value: asClass.class},
      {key: 'vars', value: _.where(asClass.properties, {visibility: 'public'}).map(parseVariable).join('')},
      {key: 'serialize', value: escapeBody(_.findWhere(asClass.functions, {name: 'serializeAs_' + asClass.class}).body)},
      {key: 'deserialize', value: escapeBody(_.findWhere(asClass.functions, {name: 'deserializeAs_' + asClass.class}).body)}
    ]).replace('\n\n\n', '\n').replace(/super.deserialize/g, 'this.deserializeAs_' + asClass.super).replace(new RegExp('super.serializeAs_' + asClass.super, 'g'), 'this.serializeAs_' + asClass.super);
  },

  ext: 'js',

  resolveFilename: function (filename) {
    var basename = path.basename(filename, '.as');
    var str = basename[0].toLowerCase();
    for(var i = 1; i < basename.length; i++){
      var char = basename[i];
      if(char === char.toUpperCase()){
        str += '-';
      }
      str += char.toLowerCase();
    }

    return str;
  }
}

function escapeBody (data) {
  return data.replace(/ as \w+/g, '').replace(/:(uint|int);/g, ' = 0;').replace(/:[\w|*]+/g, '');
}

var knowType = ['uint', 'int', 'Boolean', 'String', 'Number'];

function parseVariable(v) {
  var str = 'this.' + v.name;
  if(v.type.indexOf('Vector') > -1){
    str += ' = []';
  }
  else if(_.contains(knowType, v.type)){
    str += ' = ' + v.value;
  }
  else if(v.type.indexOf('ByteArray') > -1){
    str += ' = new Buffer(32)';
  }
  else{
    str += ' = new ' + v.type + '()';
  }
  return str + ';';
}

function formatEnumConstants (asClass) {
  var str = '';
  for(var i = 0; i < asClass.constants.length; i++){
    if(i !== 0){
      str += ',\n'
    }
    str += formatEnumConstant(asClass.constants[i]);
  }
  return str;
}

function formatEnumConstant (c) {
  return c.name + ': ' + c.value;
}

function formatSuperImport (asClass) {
  if(asClass.super === 'Object' || typeof asClass.super === 'undefined'){
    return '';
  }

  if(asClass.super === 'NetworkMessage'){
    return 'require(\'util\').inherits(' + asClass.class + ', ' + 'd2com.NetworkMessage.class);';
  }
  var imp = _.findWhere(asClass.imports, {class: asClass.super});


  var depPath = (imp ? resolveDependencyPath(asClass.namespace, imp.namespace) : './') + resolveFilename(asClass.super) + '.js';
  return 'require(\'util\').inherits(' + asClass.class + ', ' + 'require(\''+ depPath + '\').' + asClass.super + ');';
}

function resolveDependencyPath(cdir, tdir, output) {
  if(!cdir || !tdir){
    return './';
  }
  if(!output){
    var dif = JsDiff.diffWords(cdir, tdir)[0].value;
    cdir = prepResolveDependencyPath(dif, cdir);
    tdir = prepResolveDependencyPath(dif, tdir);
    output = '';
  }
  if(cdir.length > 0){
    output += '../';
    return resolveDependencyPath(_.without(cdir, _.first(cdir)), tdir, output);
  }
  if(_.isEmpty(output)){
    output = './';
  }
  if(tdir.length > 0){
    output += _.first(tdir) + '/';
    return resolveDependencyPath(cdir, _.without(tdir, _.first(tdir)), output);
  }

  return output;
}

function prepResolveDependencyPath (dif, dir) {
  var loc = dir.replace(dif, '');
  if(loc[0] === '.'){
    loc = loc.substring(1);
  }
  return _.isEmpty(loc) ? [] : loc.split('.');
}

function resolveFilename (filename) {
  var basename = path.basename(filename, '.as');
  var str = basename[0].toLowerCase();
  for(var i = 1; i < basename.length; i++){
    var char = basename[i];
    if(char === char.toUpperCase()){
      str += '-';
    }
    str += char.toLowerCase();
  }

  return str;
}