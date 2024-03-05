import Realm from 'realm';

class SearchHistorySchema extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'SearchHistory',
    properties: {
      searchTerm: 'string',
      timestamp: 'date',
    },
  };
}

export default SearchHistorySchema;
