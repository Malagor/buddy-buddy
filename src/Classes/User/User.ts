export class User {
  // private _id: string;
  private _name: string;
  // private _groupList: string[];
  // private _currentGroup: string;
  // private _language: string;
  // private _currency: string;
  // private _theme: string;

  constructor(config: { id: string; name: string; language: string; currency: string; theme: string; }) {
    // this._id = config.id;
    this._name = config.name;
    // this._language = config.language;
    // this._currency = config.currency;
    // this._theme = config.theme;
  }

  public create(config: { id: string; name: string; language: string; currency: string; theme: string; }) {
    return new User(config);
  }
}
