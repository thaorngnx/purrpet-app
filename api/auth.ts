import api from './token';
import Realm from 'realm';
import TokenSchema from '../realmModel/TokenSchema';

const realm = new Realm({ schema: [TokenSchema] });

export const saveToken = (accessToken: string, refreshToken: string) => {
  realm.write(() => {
    realm.create(
      'Token',
      {
        accessToken,
        refreshToken,
      },
      Realm.UpdateMode.Modified,
    );
  });
};

export async function logout() {
  try {
    // console.log('logout***');

    const response = await api.post('/auth/logout');

    // console.log('logout1', response.data);

    realm.write(() => {
      realm.delete(realm.objects<TokenSchema>('Token'));
    });

    const token = realm.objects<TokenSchema>('Token') as any;
    // console.log(
    //   'logout2',
    //   token?.length > 0 ? token[0].accessToken : 'no token',
    // );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
