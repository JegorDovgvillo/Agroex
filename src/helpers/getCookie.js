import _ from 'lodash';

const getCookie = async () => {
  const cookiePairs = _.map(document.cookie.split(';'), (cookie) =>
    cookie.split('=')
  );

  const cookieWithIdToken = _.find(cookiePairs, ([name]) =>
    _.includes(name.trim(), 'idToken')
  );

  return cookieWithIdToken ? cookieWithIdToken[1] : null;
};

export default getCookie;
