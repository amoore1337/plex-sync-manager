const { isTokenValid } = require('./oauth.service');

exports.wrapAsync = function (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  }
}

exports.isAuthenticated = async function (req, res, next) {
  const key = req.header('Client_Id');

  const auth = req.header('Authorization') || '';
  const [ bearer, token ] = auth.split(' ');

  if (bearer.trim().toLowerCase() !== 'bearer') {
    res.json({ error: 'Invalid Auth headers.' }).status(422);
    return;
  }

  if (await isTokenValid(token, key)) {
    next();
  } else {
    res.json({ error: 'Not authorized' }).status(403);
  }
}
