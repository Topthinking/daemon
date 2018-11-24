openssl req -config https.conf -new -sha256 -newkey rsa:2048 -nodes -keyout https.key -x509 -days 365 -out https.crt
