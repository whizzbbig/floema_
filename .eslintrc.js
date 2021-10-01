module.exports = {
  root: true,
  extends: ['standard', 'prettier'],
  globals: {
    IS_DEVELOPMENT: 'readonly'
  },
  parserOptions: {
    ecmasVersion: 2021
  }
}
