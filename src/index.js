import { registerElements } from "genesys-spark-components";

const clientId = 'a64ab37d-b6f4-4c67-bb02-425255a7cc09';
const redirectURI = encodeURI('http://localhost:7890/');
const params = new URLSearchParams(window.location.search);
const authCode = params.get('code');

if (authCode) {
  fetch('https://login.inindca.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectURI,
      client_id: clientId,
      code_verifier: window.sessionStorage.getItem('code-verifier')
    }).toString()
  }).then(async response => {
    const info = await response.json();

    window.sessionStorage.setItem('access-token', info.access_token);
    window.location.replace('/');
  }).finally(() => {
    window.sessionStorage.removeItem('code-verifier');
  });
}

registerElements();

function generateCodeVerifier() {
  const a = new Uint8Array(43);
  window.crypto.getRandomValues(a);
  return Array.from(a, n => n.toString(36)).join('');
}

async function createCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hashedBuf = await window.crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...(new Uint8Array(hashedBuf)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return challenge;
}

const codeVerifier = window.sessionStorage.getItem('code-verifier') || generateCodeVerifier();
let codeChallenge;

window.sessionStorage.setItem('code-verifier', codeVerifier);
document.getElementById('code-verifier').value = codeVerifier;

createCodeChallenge(codeVerifier).then(challenge => {
  codeChallenge = challenge;
  document.getElementById('code-challenge').value = challenge;
});

document.getElementById('request-token').addEventListener('click', () => {
  window.location.assign(`https://login.inindca.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectURI}&code_challenge=${codeChallenge}&code_challenge_method=S256`);
});

const accessToken = window.sessionStorage.getItem('access-token');
const accessTokenInput = document.getElementById('access-token')
accessTokenInput.value = accessToken;

const meResponseInput = document.getElementById('me-response');

if (accessToken) {
  fetch('https://api.inindca.com/api/v2/users/me', {
    headers: {
      'Authorization': `bearer ${accessToken}`
    }
  }).then(async response => {
    const me = await response.json();

    meResponseInput.innerText = JSON.stringify(me, null, 2);
  });

  const clearButton = document.getElementById('clear-token');
  clearButton.disabled = false;
  clearButton.addEventListener('click', () => {
    window.sessionStorage.removeItem('access-token');
    accessTokenInput.value = '';
    meResponseInput.innerText = "";
    clearButton.disabled = true;
  })
}
