import expiration from '../../library/static/expiration'

const state = () => ({
  time: 0,
  values: expiration
});

const getters = {
  getExpirationTime: state => state.time,
  getExpirationValues: state => state.values
};

const mutations = {
  SET_EXPIRATION(state, payload) {
    state.time = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
}