import {SignJWT, jwtVerify, JWTPayload} from "jose";
import {ENCRYPT_PASSWORD, ENCRYPT_SALT_HEX, JWT_SECRET} from "../../next.config.ts";
import {MeResponse} from "@/app/api/tweets/search/recent/route.ts";

const keyJwt = new TextEncoder().encode(JWT_SECRET);

export async function encryptJwt(payload: MeResponse) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("90days")
    .sign(keyJwt);
}

export async function decryptJwt(input: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(input, keyJwt, {
    algorithms: ["HS256"],
  });
  return payload;
}

//https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

export function generateState(): string {
  return generateRandomString(64);
}

export function generateCodeVerifier (): string {
  return generateRandomString(64)
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const challenge = await sha256(verifier);
  return base64encode(challenge);
}

export function  base64encode (input: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return await crypto.subtle.digest('SHA-256', data)
}

export function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error("Hex string must have an even length");
  }

  const uint8Array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    uint8Array[i / 2] = parseInt(hex.substr(i, 2), 16);
  }

  return uint8Array;
}


export function uint8ArrayToHex(uint8Array: Uint8Array): string {
  return Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

const byteToHex: string[] = [];

for (let n = 0; n <= 0xff; ++n)
{
  const hexOctet = n.toString(16).padStart(2, "0");
  byteToHex.push(hexOctet);
}

export function hexFromArrayBuffer(arrayBuffer: ArrayBuffer): string {
  const buff = new Uint8Array(arrayBuffer);
  const hexOctets = []; // new Array(buff.length) is even faster (preallocates necessary array size), then use hexOctets[i] instead of .push()

  for (let i = 0; i < buff.length; ++i)
    hexOctets.push(byteToHex[buff[i]]);

  return hexOctets.join("");
}

const arrayBufferFromHex = (string: string) => {
  const uint8array = new Uint8Array(Math.ceil(string.length / 2));
  for (let i = 0; i < string.length;)
    uint8array[i / 2] = Number.parseInt(string.slice(i, i += 2), 16);
  return uint8array;
}

// export function hexFromArrayBuffer(arrayBuffer: ArrayBuffer): string {
//   return Array.prototype.map.call(
//     new Uint8Array(arrayBuffer),
//     n => byteToHex[n]
//   ).join("");
// }


const ENCRYPT_SALT = hexToUint8Array(ENCRYPT_SALT_HEX)
const iv = crypto.getRandomValues(new Uint8Array(16));

function getKeyMaterial(): Promise<CryptoKey>{
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(ENCRYPT_PASSWORD),
    {name: "PBKDF2"},
    false,
    ["deriveKey"]
  );
}

function getKey(keyMaterial: CryptoKey): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    {
      "name": "PBKDF2",
      salt: ENCRYPT_SALT,
      "iterations": 600000,
      "hash": "SHA-256"
    },
    keyMaterial,
    { "name": "AES-GCM", "length": 192},
    true,
    [ "encrypt", "decrypt" ]
  );
}

const keyMaterial = await getKeyMaterial()
// very slow "iterations": 600000 in getKey
const key: CryptoKey = await getKey(keyMaterial)


const encoder = new TextEncoder();
const decoder = new TextDecoder();

//https://fusionauth.io/articles/oauth/modern-guide-to-oauth#redirect-and-retrieve-the-tokens
//https://github.com/mdn/dom-examples/blob/main/web-crypto/encrypt-decrypt/aes-gcm.js
const algorithm = {
  name: "AES-GCM",
  iv: iv
}

export const DIVER_IV = ':'
export const DIVER_STATE = ';'

export async function encryptRandomValue (value: string): Promise<string> {
  const encoded = encoder.encode(value)
  const encryptedArrayBuffer = await crypto.subtle.encrypt(
    algorithm,
    key,
    encoded
  );
  return hexFromArrayBuffer(encryptedArrayBuffer) + DIVER_IV + uint8ArrayToHex(iv)
}

export async function decryptRandomValue (value: string): Promise<string> {
  const parts = value.split(DIVER_IV);
  const iv = hexToUint8Array(parts[1])
  const cipherText = arrayBufferFromHex(parts[0]);

  const decryptedArrayBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    cipherText
  )
  return decoder.decode(decryptedArrayBuffer)
}

// https://auth0.com/docs/get-started/authentication-and-authorization-flow/implicit-flow-with-form-post/mitigate-replay-attacks-when-using-the-implicit-flow#generate-a-cryptographically-random-nonce
// function randomString(length: fortmats): string {
//   let charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz+/'
//   let result = ''

//   while (length > 0) {
//     let bytes = new Uint8Array(16);
//     let random = crypto.getRandomValues(bytes);

//     random.forEach(function(c) {
//       if (length == 0) {
//         return;
//       }
//       if (c < charset.length) {
//         result += charset[c];
//         length--;
//       }
//     });
//   }

//   return result;
// }

// node runtime
// export function generateCodeVerifier(): string {
//   return base64URLEncode(crypto.randomBytes(32));
// }

// https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce/add-login-using-the-authorization-code-flow-with-pkce#javascript-sample
// node runtime
// export function sha256(buffer: string): Buffer {
//   return crypto.createHash('sha256').update(buffer).digest();
// }

// export function generateCodeChallenge(verifier: string): string {
//   const challenge = sha256(verifier);
//   return base64URLEncode(challenge);
// }

// https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce/add-login-using-the-authorization-code-flow-with-pkce#javascript-sample
// export function base64URLEncode(str: Buffer | Uint8Array): string {
//   return str.toString('base64')
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_')
//     .replace(/=/g, '');
// }