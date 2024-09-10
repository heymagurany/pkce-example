PKCE Example
============

Authorization Request
```
https://login.inindca.com/oauth/authorize?client_id=a64ab37d-b6f4-4c67-bb02-425255a7cc09&response_type=code&redirect_uri=http://localhost:7890/&code_challenge=<code challenge>&code_challenge_method=S256
```

Token Request
```
curl -X POST https://login.inindca.com/oauth/token \
  -d grant_type=authorization_code -d code=<authorization code> \
  --data-urlencode redirect_uri=http://localhost:7890/callback \
  -d client_id=a64ab37d-b6f4-4c67-bb02-425255a7cc09 \
  -d code_verifier=<code verifier> \
  -d code_challenge_method=S256 -i
```

Useful Links
------------

* https://oauth.net/2/pkce/
* https://datatracker.ietf.org/doc/html/rfc6749
* https://datatracker.ietf.org/doc/html/rfc7636
* https://developer.genesys.cloud/authorization/platform-auth/use-authorization-code
* https://developer.genesys.cloud/authorization/platform-auth/use-pkce
