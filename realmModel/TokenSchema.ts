import Realm from 'realm';

class TokenSchema extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'Token',
    properties: {
      accessToken: 'string',
      refreshToken: 'string',
    },
  };
}

export default TokenSchema;
