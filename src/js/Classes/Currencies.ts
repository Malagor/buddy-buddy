export class Currencies {
  static getCurrenciesList(handlerFunction: (data: any) => void, errorHandler?: (message: string) => void): void {
    const url = 'https://openexchangerates.org/api/currencies.json';
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        handlerFunction(data);
      })
      .catch(error => {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.log(error);
        }
      });
  }

  static getCurrencyRateByCode(code: string, handlerFunction: (data: any) => void, errorHandler?: (message: string) => void) {
    const url = `https://openexchangerates.org/api/latest.json?app_id=376d918973ab407cb9515b65e53b88d8&symbols=${code}`;
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const rates = data.rates[code];
        handlerFunction(rates);
      })
      .catch(error => {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.log(error);
        }
      });
  }

  static getCurrencyRates(handlerFunction: (data: any) => void, errorHandler?: (message: string) => void) {
    const url = `https://openexchangerates.org/api/latest.json?app_id=376d918973ab407cb9515b65e53b88d8`;
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const rates = data.rates;

        handlerFunction(rates);
      })
      .catch(error => {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.log(error);
        }
      });
  }

  static toUSD(sum: number, fromCurrency: string, handlerFunction: (sumInUsd: number) => void, errorHandler?: (message: string) => void) {
    const url = `https://openexchangerates.org/api/latest.json?app_id=376d918973ab407cb9515b65e53b88d8&symbols=${fromCurrency}`;
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const rate: number = data.rates[fromCurrency];
        handlerFunction(sum / rate);
      })
      .catch(error => {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.log(error);
        }
      });
  }

  static fromUSD(sum: number, toCurrency: string, handlerFunction: (sumFromUsd: number) => void, errorHandler?: (message: string) => void) {
    const url = `https://openexchangerates.org/api/latest.json?app_id=376d918973ab407cb9515b65e53b88d8&symbols=${toCurrency}`;
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const rate: number = data.rates[toCurrency];
        handlerFunction(sum * rate);
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
