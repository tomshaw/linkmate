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
  LOAD_SESSION({ commit }, { $pouch, database }) {
    return new Promise((resolve, reject) => {
      $pouch.getSession(database).then(res => {
        if (res.status === 0) {
          reject(new Error("Data status equals zero."));
        } else if (!res.user) {
          reject(new Error("No user object."));
        } else if (!res.hasAccess) {
          reject(new Error("User has no access."));
        } else {
          commit('SET_USER_SESSION', res);
          resolve(res);
        }
      }).catch(err => {
        reject(err);
      });
    });
  },
  CREATE_USER({ commit }, { $pouch, database, username, password }) {
    return new Promise((resolve, reject) => {
      $pouch.createUser(username, password, database).then(res => {
        if (res.hasAccess) {
          commit('SET_USER_SESSION', res);
          resolve(res);
        }
      }).catch(err => {
        reject(err);
      });
    });
  },
  // Connects you to the defaultDB or given remote DB and returns the user object on success.
  AUTH_CONNECT_REMOTE({ commit }, { $pouch, database, username, password }) {
    return new Promise((resolve, reject) => {
      $pouch.connect(username, password, database).then(res => {
        if (res.hasAccess) {
          commit('SET_AUTH_STATUS', res);
          resolve(res);
        } else {
          reject(new Error("User authorized failed."));
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}