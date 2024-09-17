PKCE Example
============

Prerequisites
-------------
* [Node.js v20](https://nodejs.org/en/download/package-manager/current) or [Node Version Manager](https://github.com/nvm-sh/nvm)
* [A generated .npmrc from npm-utils](https://bitbucket.org/inindca/npm-utils/src/)

Build the web app:
```
make
```

Run the web app:
```
npm start
```

1. Request an authorization code:
```
https://login.inindca.com/oauth/authorize?client_id=a64ab37d-b6f4-4c67-bb02-425255a7cc09&response_type=code&redirect_uri=http://localhost:7890/&code_challenge=<code challenge>&code_challenge_method=S256
```

2. Request an access token:
```
curl -X POST https://login.inindca.com/oauth/token \
  --data grant_type=authorization_code -d code=<authorization code> \
  --data-urlencode redirect_uri=http://localhost:7890/ \
  --data client_id=a64ab37d-b6f4-4c67-bb02-425255a7cc09 \
  --data code_verifier=<code verifier> \
  --data code_challenge_method=S256 \
  -i
```

Useful Links
------------

* https://oauth.net/2/pkce/
* https://datatracker.ietf.org/doc/html/rfc6749
* https://datatracker.ietf.org/doc/html/rfc7636
* https://developer.genesys.cloud/authorization/platform-auth/use-authorization-code
* https://developer.genesys.cloud/authorization/platform-auth/use-pkce
