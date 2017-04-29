module.exports = {
  src: {
    enum: '/dofus/network/enums',
    type: '/dofus/network/types',
    message: '/dofus/network/messages',
    metadata: '/dofus/network/Metadata.as',
    protocolConstants: '/dofus/network/ProtocolConstantsEnum.as',
    customDataWrapper: '/jerakine/network/CustomDataWrapper.as',
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
