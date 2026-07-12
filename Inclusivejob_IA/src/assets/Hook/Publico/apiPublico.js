const JSONBIN_BIN_ID = '6a415fe7da38895dfe0c789b';
const JSONBIN_API_KEY = '$2a$10$5AOFsiDPtTLkMCyiq77ISOeWPWhSF.LkDgJSw2EY/3rxneU96bS86';

export const ENDPOINTS = {
  comentarios: `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`,
};

export const JSONBIN_HEADERS = {
  'Content-Type': 'application/json',
  'X-Master-Key': JSONBIN_API_KEY,
  'X-Bin-Versioning': 'false',
};
