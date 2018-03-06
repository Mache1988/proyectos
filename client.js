import * as firebase from 'firebase';
const onAuth = callback => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(a => {
      resolve(callback);
    });
  });
};
const waitForAuth = new Promise((resolve, reject) => {
  firebase.auth().onAuthStateChanged(() => {
    resolve(true);
  });
});
class Init {
  config = {
    apiKey: 'AIzaSyCRsKn65J1p7oZOOoUyeztRYXrGRCVoiho',
    authDomain: 'fitness-9d56b.firebaseapp.com',
    databaseURL: 'https://fitness-9d56b.firebaseio.com',
    projectId: 'fitness-9d56b',
    storageBucket: '',
    messagingSenderId: '699507138200'
  };
  credentials = { email: 'mache.uno@gmail.com', password: 'mio29688' };
  authorized = false;
  constructor() {
    firebase.initializeApp(this.config);
    console.log('Logining wait...');
    firebase
      .auth()
      .signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      )
      .then(success => {
        console.log('Loged in succesfuly');
        this.authorized = true;
      })
      .catch(error => console.log(error));
  }
  write = (reference, data) => {
    let ref = firebase.database().ref(reference);
    if (this.authorized) {
      return ref.set(data);
    } else {
      console.log('Pending...');
      return onAuth(ref.set(data));
    }
  };
  remove = reference => {
    let ref = firebase.database().ref(reference);
    if (this.authorized) {
      return ref.remove();
    } else {
      console.log('Pending...');
      return onAuth(ref.remove());
    }
  };
  push = (reference, data) => {
    let ref = firebase
      .database()
      .ref(reference)
      .push();
    if (this.authorized) {
      return new Promise((resolve, reject) => {
        ref.set(data).then(() => {
          resolve(ref.key);
        });
      });
    } else {
      console.log('Pending...');
      return onAuth(
        new Promise((resolve, reject) => {
          ref.set(data).then(() => {
            resolve(ref.key);
          });
        })
      );
    }
  };
  listen = (reference, callback) => {
    let ref = firebase.database().ref(reference);
    if (this.authorized) {
      ref.on('value', x => callback(x.val()));
    } else {
      console.log('Pending...');
      onAuth(ref.on('value', x => callback(x.val())));
    }
  };
  read = reference => {
    let ref = firebase.database().ref(reference);
    if (this.authorized) {
      return ref.once('value').then(s => {
        return (s.val() && s.val()) || {};
      });
    } else {
      console.log('Pending...');
      return waitForAuth().then(() =>
        ref.once('value').then(s => {
          return (s.val() && s.val()) || {};
        })
      );
      return onAuth(
        ref.once('value').then(s => {
          return (s.val() && s.val()) || {};
        })
      );
    }
  };
}
export let Client = new Init();
