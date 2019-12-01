import { accumulateProperties } from '../../library/utils'
import { pageSchema } from '../../library/static/schemas'

const state = () => ({
  page: {}
});

const getters = {
  getActivePage: state => state.page
};

const mutations = {
  SET_ACTIVE_PAGE(state, payload) {
    let values = accumulateProperties(pageSchema, payload)
    if (payload._id) {
      values._id = payload._id;
    }
    if (payload._rev) {
      values._rev = payload._rev;
    }
    state.page = values;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
}