const API_KEYS: string[] = [
  'f8ce043338904bab9b6c958cf1a2c82e',
  '1d859700e3714101823ba43b320cb428',
  'b6d119de27cd49369c69065d3c6b86dc',
  '31889a35c8674d5b8690f784b83c3411',
  '546065976e2f41ae85962a4cad418646'
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
