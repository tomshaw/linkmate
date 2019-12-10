const state = () => ({
  user: {},
  status: {}
});

const getters = {
  getSessionUser: state => state.user,
  getSessionStatus: state => state.status
};

const mutations = {
  SET_USER_SESSION(state, payload) {
    state.user = payload;
  },
  SET_AUTH_STATUS(state, payload) {
    state.status = payload;
  },
};

const actions = {
  // @todo
  LOAD_SESSION({ commit }, { $pouch, database }) {
    return new Promise((resolve, reject) => {
      $pouch.getSession(database).then((result) => {
        if (result.hasAccess) {
          commit('SET_USER_SESSION', result);
          resolve(result);
        } else {
          reject(new Error(result));
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  CREATE_USER({ commit }, { $pouch, username, password, database }) {
    return new Promise((resolve, reject) => {
      $pouch.createUser(username, password, database).then((result) => {
        if (result.hasAccess) {
          commit('SET_USER_SESSION', result);
          resolve(result);
        } else {
          reject(new Error(result));
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  // @todo
  UPDATE_USER({ commit }, { $pouch, username, metadata = {}, database }) {
    return new Promise((resolve, reject) => {
      $pouch.putUser(username, metadata, database).then((result) => {
        if (result.hasAccess) {
          commit('SET_USER_SESSION', result);
          resolve(res);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  // Connects you to the remote DB and returns the user object on success.
  // CouchDB admin cannot use this method is not considered a normal user.
  AUTH_CONNECT_REMOTE({ commit }, { $pouch, username, password, database }) {
    return new Promise((resolve, reject) => {
      $pouch.connect(username, password, database).then((result) => {
        if (result.hasAccess) {
          commit('SET_USER_SESSION', result);
          resolve(result);
        } else {
          reject(result);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  // @todo
  SIGNUP_ADMIN({ commit }, { $pouch, username, password, database }) {
    return new Promise((resolve, reject) => {
      $pouch.signUpAdmin(username, password, database).then((result) => {
        if (result.hasAccess) {
          commit('SET_USER_SESSION', result);
          resolve(result);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
