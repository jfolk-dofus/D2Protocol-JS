var JsDiff = require('diff');
var _ = require('underscore');
var template = require('../template-manager.js');
var path = require('path');
var asReader = require('../as-reader.js')

module.exports = {
    enumConverter: function (asClass) {
        return template('./lib/templates/enum.tpl', [
            {key: 'vars', value: formatEnumConstants(asClass)},
            {key: 'classname', value: asClass.class}
        ]);
    },

    messageConverter: function (asClass, files) {
        let id;
        return trimVerbose(template('./lib/templates/message.tpl', [
            { key: 'id', value: (id = _.findWhere(asClass.constants, {name: 'protocolId'}).value) },
            { key: 'classname', value: asClass.class },
            { key: 'heritage', value: asClass.super.replace("NetworkMessage", "ProtocolMessage") },
            { key: 'vars', value: assignConstructorValues(asClass, id) },
            { key: 'super', value: writeSuperConstructor(files, id, asClass, null)},
            { key: 'constructor', value: getConstructorParameters(asClass)},
            { key: 'serialize', value: writeSerialize(asClass) },
            { key: 'deserialize',value: writeDeserialize(asClass)}]), asClass);
    },

    typeConverter: function (asClass) {
        var superDep = formatSuperImport(asClass);
        return template('./lib/templates/type.tpl', [
            { key: 'id', value: _.findWhere(asClass.constants, {name: 'protocolId'}).value },
            { key: 'superDep', value: formatSuperImport(asClass) },
            { key: 'classname', value: asClass.class },
            { key: 'vars', value: _.where(asClass.properties, {visibility: 'public'}).map(parseVariable).join('') },
            { key: 'serialize', value: escapeBody(_.findWhere(asClass.functions, {name: 'serializeAs_' + asClass.class}).body) },
            { key: 'deserialize', value: escapeBody(_.findWhere(asClass.functions, {name: 'deserializeAs_' + asClass.class}).body)}])
    },

    ext: 'js',

    resolveFilename: function (filename) {
        var basename = path.basename(filename, '.as');
        var str = basename[0].toLowerCase();
        for (var i = 1; i < basename.length; i++) {
            var char = basename[i];
            if (char === char.toUpperCase())
                str += '-';
            str += char.toLowerCase();
        }
        return str;
    }
}

//replace a private _func by its body
function format(asClass, data) {
    return data.split(';').map(x => {
        if (!x.startsWith('this._'))
            return x;
        let func = x.split('(')[0].replace('this.', '');
        let body = _.findWhere(asClass.functions, {name: func}).body;
        return x.replace(new RegExp("this._[A-Za-z1-9_\(\)]+"), body);
    }).join(';');
}

function getConstructorParameters(asClass) {
    return _.findWhere(asClass.functions, {name: 'init' + asClass.class}).params
        .map(x => x.name)
        .join();
}

function formatConstructor(asClass, param, replacement) {
    let found = _.findWhere(asClass.functions, {name: 'init' + asClass.class}).params
        .find(x => typeof param !== 'undefined' && x.name.trim() === param.trim());
    if (typeof found === 'undefined')
        return;
    found.name = replacement;
}

function assignConstructorValues(asClass, id) {
    let append = asClass.super === 'NetworkMessage' ? '' : 'this.messageId = ' + id + ";";
    return escapeBody(_.findWhere(asClass.functions, {name: 'init' + asClass.class}).body
            .split(";")
            .filter(x => !x.startsWith('super') && !x.startsWith('return') && x !== 'this._isInitialized = true')
            .map(x => {
                let v = x.replace('this.', '').split(' = ');
                formatConstructor(asClass, v[1], v[0]);
                return x.replace(v[1], v[0]);
            })
            .join(";")) + append;
}

function findClass(files, className) {
    return asReader(files.find(x => {
        let split = x.split('/');
        return split[split.length - 1].slice(0, -3) === className;
    }));
}

function writeSuperConstructor(files, id, asClass, inject) {
    if (asClass.super === 'NetworkMessage')
        return 'super(' + id + ');';
    let found = escapeBody(_.findWhere(asClass.functions, {name: 'init' + asClass.class}).body
        .split(';')
        .find(x => x.startsWith('super')));
    if (typeof found === 'undefined')
        return 'super();';
    let supClass = findClass(files, asClass.super);

    //recursive (case of multiple heritages)
    writeSuperConstructor(files, supClass.constants.find(x => x.name === 'protocolId').value, supClass, asClass);

    _.findWhere(supClass.functions, {name: 'init' + supClass.class}).body
        .split(";")
        .filter(x => !x.startsWith('super') && !x.startsWith('return') && x !== 'this._isInitialized = true')
        .forEach(x => {
            let v = x.replace('this.', '').split(' = ');
            formatConstructor(asClass, v[1], v[0]);
            formatConstructor(supClass, v[1], v[0]);
            if (inject)
                formatConstructor(inject, v[1], v[0]);
            return v[0];
        });
    return 'super(' + escapeBody(getConstructorParameters(supClass)) + ');';
}

function writeSerialize(asClass) {
    return escapeBody(format(asClass,
        _.findWhere(asClass.functions, {name: 'serializeAs_' + asClass.class}).body)
        .split("param1").join("this.buffer")
        .replace(new RegExp('super.serializeAs_[A-Za-z1-9_\(\).]+'), 'super.serialize()'))
}

function writeDeserialize(asClass) {
    return escapeBody(format(asClass,
        _.findWhere(asClass.functions, {name: 'deserializeAs_' + asClass.class}).body)
        .split("param1")
        .join("buffer"));
}

function trimVerbose(data, asClass) {
    return data.replace(new RegExp('serializeAs_[A-Za-z]+', 'g'), 'serialize')
        .replace(new RegExp('deserializeAs_[A-Za-z]+' + asClass.super, 'g'), 'deserialize');
}

function escapeBody(data) {
    if (typeof data === 'undefined')
        return undefined;
    return data.replace(/ as \w+/g, '').replace(/:(uint|int);/g, ' = 0;').replace(/:[\w|*]+/g, '');
}

var knowType = ['uint', 'int', 'Boolean', 'String', 'Number'];

function parseVariable(v) {
    var str = 'this.' + v.name;
    if (v.type.indexOf('Vector') > -1) {
        str += ' = []';
    }
    else if (_.contains(knowType, v.type)) {
        str += ' = ' + v.value;
    }
    else if (v.type.indexOf('ByteArray') > -1) {
        str += ' = new Buffer(32)';
    }
    else {
        str += ' = new ' + v.type + '()';
    }
    return str + ';';
}

function formatEnumConstants(asClass) {
    var str = '';
    for (var i = 0; i < asClass.constants.length; i++) {
        if (i !== 0) {
            str += ',\n'
        }
        str += formatEnumConstant(asClass.constants[i]);
    }
    return str;
}

function formatEnumConstant(c) {
    return c.name + ': ' + c.value;
}

function formatSuperImport(asClass) {
    if (asClass.super === 'Object' || typeof asClass.super === 'undefined') {
        return '';
    }

    if (asClass.super === 'NetworkMessage') {
        return 'var NetworkManager = require(\'NetworkManager\').NetworkManager;';
    }
    var imp = _.findWhere(asClass.imports, {class: asClass.super});


    var depPath = (imp ? resolveDependencyPath(asClass.namespace, imp.namespace) : './') + resolveFilename(asClass.super) + '.js';
    return 'require(\'util\').inherits(' + asClass.class + ', ' + 'require(\'' + depPath + '\').' + asClass.super + ');';
}

function resolveDependencyPath(cdir, tdir, output) {
    if (!cdir || !tdir) {
        return './';
    }
    if (!output) {
        var dif = JsDiff.diffWords(cdir, tdir)[0].value;
        cdir = prepResolveDependencyPath(dif, cdir);
        tdir = prepResolveDependencyPath(dif, tdir);
        output = '';
    }
    if (cdir.length > 0) {
        output += '../';
        return resolveDependencyPath(_.without(cdir, _.first(cdir)), tdir, output);
    }
    if (_.isEmpty(output)) {
        output = './';
    }
    if (tdir.length > 0) {
        output += _.first(tdir) + '/';
        return resolveDependencyPath(cdir, _.without(tdir, _.first(tdir)), output);
    }

    return output;
}

function prepResolveDependencyPath(dif, dir) {
    var loc = dir.replace(dif, '');
    if (loc[0] === '.') {
        loc = loc.substring(1);
    }
    return _.isEmpty(loc) ? [] : loc.split('.');
}

function resolveFilename(filename) {
    var basename = path.basename(filename, '.as');
    var str = basename[0].toLowerCase();
    for (var i = 1; i < basename.length; i++) {
        var char = basename[i];
        if (char === char.toUpperCase()) {
            str += '-';
        }
        str += char.toLowerCase();
    }

    return str;
}