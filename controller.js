class LocalDB {
  data = {};
  write(d = {}) {
    this.data = { ...this.data, ...d };
    return d;
  }
  read(k) {
    if (k === undefined) {
      return this.data;
    } else {
      if (this.data[k] !== undefined) {
        return this.data[k];
      } else {
        return {};
      }
    }
  }
  erase(k) {
    if (k !== undefined) {
      if (this.data[k] !== undefined) {
        let { [k]: erased, ...rest } = this.data;
        this.data = { ...rest };
        return erased;
      }
    }
  }
}
class Event {
  events = {};
  init(typed = {}) {
    return typed;
  }

  register(
    type = 'noType',
    e = () => {
      console.log('Error no Function defined');
    }
  ) {
    this.events[type] = this.init(this.events[type]);
    let nid = Object.keys(this.events[type]).length;
    this.events[type]['_' + nid] = e;
    return () => {
      delete this.events[type]['_' + nid];
    };
  }

  trigger(type) {
    if (this.events[type]) {
      console.log('Trigged actions: ', type);
      Object.keys(this.events[type]).map(e => {
        this.events[type][e].apply();
      });
    }
  }
  read() {
    return this.events;
  }
}
class Controller {
  LocalDB = new LocalDB();
  Event = new Event();
}
export default new Controller();
