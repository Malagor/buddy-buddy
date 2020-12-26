module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "airbnb-base",
    "prettier"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "off",
    "no-underscore-dangle": 0,
    "no-param-reassign": 0,
    "import/prefer-default-export": 0,
    "import/no-cycle": 0,
  }
};
