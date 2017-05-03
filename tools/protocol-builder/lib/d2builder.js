var glob = require('glob'),
    asReader = require('./as-reader.js'),
    constants = require('./constants.js'),
    path = require('path'),
    fss = require('fs'),
    fs = require('fs-extra'),
    beautify = require('js-beautify').js_beautify,
    template = require('./template-manager.js'),
    _ = require('underscore');

var future_data = {
    messages: [],
    types : []
};

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
    convertAll("ENUM", strategy.enumConverter, path.join(src, constants.src.enum), output, strategy.ext);
    convertAll("TYPE", strategy.typeConverter, path.join(src, constants.src.type), output, strategy.ext);
    convertAll("MESSAGE", strategy.messageConverter, path.join(src, constants.src.message), output, strategy.ext, function() {

        sortMessages();
        sortTypes();
        var file = "";
        for (let i = 0; i < future_data.types.length; i++) {
            if (future_data.types[i] !== null)
                file += future_data.types[i].data + "\n\n";
        }
        fs.appendFileSync(output, file, { indent_size: 2 });
        file = "";
        for (let i = 0; i < future_data.messages.length; i++) {
            if (future_data.messages[i] !== null)
                file += future_data.messages[i].data + "\n\n";
        }
        fs.appendFileSync(output, file, { indent_size: 2 });
    });
    //fs.copySync(path.join(__dirname, constants.src.protocolTypeManager), path.join(output, constants.output.protocolTypeManager));
    //fs.copySync(path.join(__dirname, constants.src.messageReceiver), path.join(output, constants.output.messageReceiver));
    //fs.copySync(path.join(__dirname, constants.src.enumManager), path.join(output, constants.output.enumManager));
    return this;
};

/**
 *
 * A extends C
 * D
 * B extends D
 * C extends B
 */
function convert(type, converter, filename, output, files) {
    const asClass = asReader(filename);
    const data = beautify(converter(asClass, files));
    console.log("[protocol] converted %s", filename);
    switch (type) {
        case "ENUM":
            fs.appendFile(output, data + "\n\n", { indent_size: 2 }, function (err) {
                if(err)
                    throw err;
            });
            break;
        case "TYPE": {
            future_data.types.push({c: asClass, data: data});
            break;
        }
        case "MESSAGE": {
            future_data.messages.push({c: asClass, data: data});
            break;
        }
    }
}

function sortMessages() {
    let running = true;
    while (running) {
        let found = false;
        for (let i = 0; i < future_data.messages.length && !found; i++) {
            let elem = future_data.messages[i];
            let index = future_data.messages.findIndex(x => x.c.super === elem.c.class);
            if (index !== -1 && (found = i > index)) {
                future_data.messages = future_data.messages.filter(x => x.c.class !== elem.c.class);
                future_data.messages.splice(index, 0, elem);
                break;
            }
        }
        running = found;
    }
    future_data.messages = _.uniq(future_data.messages);
}

function sortTypes() {
    let running = true;
    while (running) {
        let found = false;
        for (let i = 0; i < future_data.types.length && !found; i++) {
            let elem = future_data.types[i];
            let index = future_data.types.findIndex(x => x.c.super === elem.c.class);
            if (index !== -1 && (found = i > index)) {
                future_data.types = future_data.types.filter(x => x.c.class !== elem.c.class);
                future_data.types.splice(index, 0, elem);
                break;
            }
        }
        running = found;
    }
    future_data.types = _.uniq(future_data.types);
}

function convertAll(type, converter, src, output, ext, callback) {
    var self = this;
    glob(path.join(src, '**/*.as'), function( err, files ) {
        files.forEach(function (file) {
            convert(type, converter, file, output, files);
        });
        if (callback != null)
            callback();
    });
};