const IDb = require('./interfaceDb');
class ContextStrategy extends IDb {
  constructor(database) {
    super();
    this._database = database;
  }
  isConnected() {
    return this._database.isConnected();
  }
  create(item) {
    return this._database.create(item);
  }
  read(item, skip, limit) {
    return this._database.read(item, skip, limit);
  }
  update(id, item, upsert) {
    return this._database.update(id, item, upsert);
  }
  delete(id) {
    return this._database.delete(id);
  }
  static connect() {
    return this._database.connect()
  }
}

module.exports = ContextStrategy;
