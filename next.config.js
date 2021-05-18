module.exports = {
  env: {
    SERVER_URL: process.env.NODE_ENV === 'production' ? process.env.HOST : 'http://localhost:3000',
    COOKIES_STORAGE_NAME: 'user',
  },
  pageExtensions: ['jsx', 'js'],
};