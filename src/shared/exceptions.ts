export class MethodNotAllowedException extends Error {
  name = 'MethodNotAllowedException'

  constructor() {
    super('This method is not specified in the allowed methods')
  }
}

export class ValidateSchemaUnknownException extends Error {
  name = 'ValidateSchemaUnknownException'

  constructor() {
    super('Unknown error when validating a response from the server')
  }
}

export class NoUriOrInstanceException extends Error {
  name = 'NoUriOrInstanceException'

  constructor() {
    super('You must provide either a uri or an instance socket.io')
  }
}
