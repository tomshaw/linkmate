import { sortByCreation } from '../../library/utils'

const state = () => ({
  document: {},
  documents: [],
  category: []
});

const getters = {
  getDocument: state => state.document,
  getDocuments: state => state.documents,
  getCategory: state => state.category
};

const mutations = {
  SET_DOCUMENT(state, payload) {
    state.document = payload;
  },
  SET_DOCUMENTS(state, payload) {
    state.documents = payload;
  },
  SET_CATEGORY(state, payload) {
    state.category = payload;
  }
};

const actions = {
  LOAD_DOCUMENT({ commit }, { $pouch, database, docId }) {
    return new Promise((resolve, reject) => {
      $pouch.get(docId, {}, database).then((doc) => {
        commit('expires/SET_EXPIRATION', doc.expires, { root: true });
        commit('SET_CATEGORY', doc.category);
        commit('SET_DOCUMENT', doc);
        resolve(doc);
      }).catch(err => {
        reject(err);
      });
    });
  },
  SEARCH_DOCUMENTS(context, { $pouch, options, database }) {
    return new Promise((resolve, reject) => {
      $pouch.find(options, database).then((result) => {
        let docs = (result.docs && result.docs.length) ? result.docs : [];
        let dateOptions = { year: '2-digit', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' };
        let dateObject = new Date();
        let rows = [];
        docs.forEach(item => {
          let created = new Date(item.created);
          item.date = created.toLocaleDateString("en-US", dateOptions);
          item.newItem = (dateObject.toDateString() === created.toDateString());
          rows.push(item);
        });
        context.commit('SET_DOCUMENTS', sortByCreation(rows));
        resolve(rows);
      }).catch(err => {
        reject(err);
      });
    });
  },
  LOAD_DOCUMENTS(context, { $pouch, database }) {
    return new Promise((resolve, reject) => {
      $pouch.allDocs({ include_docs: true, descending: true, limit: 100 }, database).then((resp) => {
        let docs = (resp.rows && resp.rows.length) ? resp.rows : [];
        let dateOptions = { year: '2-digit', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' };
        let dateObject = new Date();
        let rows = [];
        docs.forEach(item => {
          let created = new Date(item.doc.created);
          //item.doc.date = created.toLocaleDateString("en-US");
          item.doc.date = created.toLocaleDateString("en-US", dateOptions);
          item.doc.newItem = (dateObject.toDateString() === created.toDateString());
          rows.push(item.doc);
        });
        context.commit('SET_DOCUMENTS', sortByCreation(rows));
        resolve(rows);
      }).catch(err => {
        reject(err);
      });
    });
  },
  REMOVE_DOCUMENT({ dispatch }, { $pouch, database, doc }) {
    return new Promise((resolve, reject) => {
      $pouch.remove(doc, {}, database).then((resp) => {
        dispatch('LOAD_DOCUMENTS', { $pouch, database }).then(() => {
          resolve(resp);
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  },
  SUBMIT_DOCUMENT({ dispatch }, { $pouch, database, doc }) {
    return new Promise((resolve, reject) => {
      $pouch.post(doc, {}, database).then((resp) => {
        dispatch('LOAD_DOCUMENTS', { $pouch, database }).then(() => {
          resolve(resp)
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
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