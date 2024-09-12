import { registerElements } from "genesys-spark-components";

const clientId = 'a64ab37d-b6f4-4c67-bb02-425255a7cc09';
const redirectURI = encodeURI('http://localhost:7890/');

async function exchangeCodeForToken() {
  const params = new URLSearchParams(location.search);
  const authCode = params.get('code');

  if (authCode) {
    const tokenResponse = await fetch('https://login.inindca.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectURI,
        client_id: clientId,
        code_verifier: sessionStorage.getItem('code-verifier')
      }).toString()
    });

    const tokenInfo = await tokenResponse.json();

    sessionStorage.setItem('access-token', tokenInfo.access_token);
    sessionStorage.removeItem('code-verifier');
    location.replace('/');

    return true;
  }

  return false;
}

function generateCodeVerifier() {
  const a = new Uint8Array(43);
  crypto.getRandomValues(a);
  return Array.from(a, n => n.toString(36)).join('');
}

async function createCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hashedBuf = await crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...(new Uint8Array(hashedBuf)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return challenge;
}

async function init() {
  const codeVerifier = sessionStorage.getItem('code-verifier') || generateCodeVerifier();
  
  sessionStorage.setItem('code-verifier', codeVerifier);
  document.getElementById('code-verifier').innerText = codeVerifier;

  const codeChallenge = await createCodeChallenge(codeVerifier);

  document.getElementById('code-challenge').innerText = codeChallenge;
  document.getElementById('request-token').addEventListener('click', () => {
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectURI,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });
    location.assign(`https://login.inindca.com/oauth/authorize?${params.toString()}`);
  });

  const accessToken = sessionStorage.getItem('access-token');

  if (accessToken) {
    const accessTokenEl = document.getElementById('access-token');
    accessTokenEl.innerText = accessToken;

    const meResponse = await fetch('https://api.inindca.com/api/v2/users/me', {
      headers: {
        'Authorization': `bearer ${accessToken}`
      }
    });

    const me = await meResponse.json();

    const meResponseEl = document.getElementById('me-response');
    meResponseEl.innerText = JSON.stringify(me, null, 2);

    const clearButton = document.getElementById('clear-token');
    clearButton.disabled = false;
    clearButton.addEventListener('click', () => {
      sessionStorage.removeItem('access-token');
      accessTokenEl.innerText = 'Not authenticated';
      meResponseEl.innerText = 'The public API response will display here';
      clearButton.disabled = true;
    });
  }
}

const exchanged = await exchangeCodeForToken();

if (!exchanged) {
  registerElements();
  await init();
}
