var glob = require('glob'),
    asReader = require('./as-reader.js'),
    constants = require('./constants.js'),
    path = require('path'),
    fss = require('fs'),
    fs = require('fs-extra'),
    beautify = require('js-beautify').js_beautify,
    template = require('./template-manager.js');

var defaultStrategy = require('./strategies/js-strategy.js');

module.exports = function (src, output, strategy) {
    strategy = strategy || defaultStrategy;
    if(!strategy.enumConverter){
        throw new Error('EnumConverter not implemented in strategy');
    }
    if(!strategy.messageConverter){
        throw new Error('messageConverter not implemented in strategy');
    }
    if(!strategy.typeConverter){
        throw new Error('typeConverter not implemented in strategy');
    }
    fs.writeFile(output, "", { index_size: 2 }, function (err) {
        if (err)
            throw err
    });
    fs.appendFile(output, template('./lib/templates/header.tpl') + "\n\n", { indent_size: 2 }, function (err) {
        if(err)
            throw err;
    });
    //convert(strategy.enumConverter, path.join(src, constants.src.metadata), path.join(output, constants.output.metadata), null);
    //convert(strategy.enumConverter, path.join(src, constants.src.protocolConstants), path.join(output, constants.output.protocolConstants), null);
    convertAll(strategy.enumConverter, path.join(src, constants.src.enum), output, strategy.ext);
    convertAll(strategy.typeConverter, path.join(src, constants.src.type), output, strategy.ext);
    convertAll(strategy.messageConverter, path.join(src, constants.src.message), output, strategy.ext);
    //fs.copySync(path.join(__dirname, constants.src.protocolTypeManager), path.join(output, constants.output.protocolTypeManager));
    //fs.copySync(path.join(__dirname, constants.src.messageReceiver), path.join(output, constants.output.messageReceiver));
    //fs.copySync(path.join(__dirname, constants.src.enumManager), path.join(output, constants.output.enumManager));
    return this;
};

function convert(converter, filename, output, files) {
    const asClass = asReader(filename);
    const data = beautify(converter(asClass, files));
    console.log("[protocol] converted %s", filename);
    fs.appendFile(output, data + "\n\n", { indent_size: 2 }, function (err) {
        if(err)
            throw err;
    });
};

function convertAll(converter, src, output, ext) {
    var self = this;
    glob(path.join(src, '**/*.as'), function( err, files ) {
        files.forEach(function (file) {
            convert(converter, file, output, files);
        });
    });
};