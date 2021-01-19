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
    const url = `https://openexchangerates.org/api/latest.json?app_id=376d918973ab407cb9515b65e53b88d8&symbols=${code}`;

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
    const url = `https://openexchangerates.org/api/latest.json?app_id=376d918973ab407cb9515b65e53b88d8`;

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
    const url = `https://openexchangerates.org/api/latest.json?app_id=376d918973ab407cb9515b65e53b88d8&symbols=${fromCurrency}`;

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
    const url = `https://openexchangerates.org/api/latest.json?app_id=376d918973ab407cb9515b65e53b88d8&symbols=${toCurrency}`;

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
}
