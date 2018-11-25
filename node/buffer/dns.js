const dns = require('dns');

dns.lookupService('127.0.0.1', 3000, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
