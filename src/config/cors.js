const getCorsHeaders = (url = '*') => ({
  'access-control-allow-methods': 'GET, OPTIONS, POST',
  'access-control-allow-credentials': true,
  'access-control-allow-origin': url,
  'access-control-allow-headers': 'Content-Type,ClientAuth,Application,cache-control'
});

module.exports = {
  getCorsHeaders
};