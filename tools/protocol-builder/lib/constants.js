module.exports = {
  src: {
    enum: '/com/ankamagames/dofus/network/enums',
    type: '/com/ankamagames/dofus/network/types',
    message: '/com/ankamagames/dofus/network/messages',
    metadata: '/com/ankamagames/dofus/network/Metadata.as',
    protocolConstants: '/com/ankamagames/dofus/network/ProtocolConstantsEnum.as',
    customDataWrapper: '/com/ankamagames/jerakine/network/CustomDataWrapper.as',
    protocolTypeManager: '/templates/protocol-type-manager.tpl',
    enumManager: '/templates/enum-manager.tpl',
    messageReceiver: '/templates/message-receiver.tpl',
    networkMessage: '/jerakine/network/NetworkMessage.as'
  },
  output: {
    enum: '/enums',
    type: '/types',
    message: '/messages',
    metadata: '/metadata.js',
    protocolConstants: '/protocol-constants-enum.js',
    protocolTypeManager: '/protocol-type-manager.js',
    messageReceiver: '/message-receiver.js',
    enumManager: '/enum-manager.js'
  }
}
