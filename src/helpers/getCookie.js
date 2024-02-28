import _ from 'lodash';

export async function getCookie() {
  const cookies = _.map(document.cookie.split(';'), (cookie) =>
    cookie.split('=')
  );
  const cookie = _.find(cookies, ([name]) =>
    _.includes(name.trim(), 'idToken')
  );
  return cookie ? cookie[1] : null;
}
