const API_KEYS: string[] = [
  '6613a3fbbe2c421082fe06e4f197dc33',
  'd4b700507353490281057d655a95e0b2',
  '9bda6916c80944c891b6af5baab39303',
  'b6f91ed640804b41ba2841c44a553ebf',
  '84eb8f27a24548f2bdd93596e4905ec9',
  '9a5ab024d00240a5b6ad67775bcc4e26',
  'f1b43277aa3548fe916f5175debfa6a6',
  '7bc053092ecc407d8776fdcc46e631ac',
  '180dddee5a8545d391b4a4f9d42b2f81',
  '180dddee5a8545d391b4a4f9d42b2f81',
  '9ebf46be57d44373a4a11a2391767d26',
  '2515cd5f5f754c10b5b81b92c1b65550'
];

function getRandAPI(): string {
  const countApi = API_KEYS.length;
  const index = Math.floor(Math.random() * countApi) + 1;
  return API_KEYS[index - 1];
}

export class Currencies {
  static getCurrenciesList(errorHandler?: (message: string) => void) {
    const url = 'https://openexchangerates.org/api/currencies.json';

    return fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.log(error);
        }
      });
  }

  static getCurrencyRateByCode(code: string, errorHandler?: (message: string) => void) {
    const url = `https://openexchangerates.org/api/latest.json?app_id=${getRandAPI()}&symbols=${code}`;

    return fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data.rates[code];
      })
      .catch(error => {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.log(error);
        }
      });
  }

  static getCurrencyRates(errorHandler?: (message: string) => void) {
    const url = `https://openexchangerates.org/api/latest.json?app_id=${getRandAPI()}`;

    return fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data.rates;
      })
      .catch(error => {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.log(error);
        }
      });
  }

  static toUSD(fromCurrency: string, errorHandler?: (message: string) => void) {
    const url = `https://openexchangerates.org/api/latest.json?app_id=${getRandAPI()}&symbols=${fromCurrency}`;

    return (sum: number) => fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const rate: number = data.rates[fromCurrency];
        return sum / rate;
      })
      .catch(error => {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.log(error);
        }
      });
  }

  static fromUSD(toCurrency: string, errorHandler?: (message: string) => void) {
    const url = `https://openexchangerates.org/api/latest.json?app_id=${getRandAPI()}&symbols=${toCurrency}`;

    return (sum: number) => fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const rate: number = data.rates[toCurrency];
        return sum * rate;
      })
      .catch(error => {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.log(error);
        }
      });
  }

  static transferToCurrencies(currencyCodesArray: string[]) {
    const curQieries = currencyCodesArray.map(code => Currencies.getCurrencyRateByCode(code));

    return (sum: number) => {
      return Promise
        .all(curQieries)
        .then(data => {
          return currencyCodesArray.map((currency, index) => {
            return {
              currency,
              rate: data[index],
              result: sum * data[index],
            };
          });
        });
    };
  }
}
