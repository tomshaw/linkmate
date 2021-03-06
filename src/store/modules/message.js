
const state = () => ({
  type: 'primary', // primary, success, warning, codeblock
  enabled: false,
  timeout: false,
  content: {
    header: '',
    paragraph: ''
  }
});

const getters = {
  getMessageType: state => state.type,
  getMessageEnabled: state => state.enabled,
  getMessageTimeout: state => state.timeout,
  getMessageContent: state => state.content
};

const mutations = {
  SET_MESSAGE_TYPE(state, payload) {
    state.type = payload;
  },
  SET_MESSAGE_ENABLED(state, payload) {
    state.enabled = payload;
  },
  SET_MESSAGE_TIMEOUT(state, payload) {
    state.timeout = payload;
  },
  SET_MESSAGE_CONTENT(state, payload) {
    state.content = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
}