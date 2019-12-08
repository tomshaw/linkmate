<template>
  <div>
    <div class="form-body">
      
      <div class="row">
        <div class="col s8">
          <h2>Category Management</h2>
          <p>Application categories are created on a per database basis.</p>
        </div>
      </div>

      <div class="row">
        <div class="col s6">
          <select name="database" id="database" v-model="database" @change="onSelectChange($event)">
            <option v-for="(item, i) in databases" :key="i" :value="item.doc._id">{{ item.doc.title }}</option>
          </select>
          <label for="voice">Select database</label>
        </div>
      </div>

      <div :class="{ hidden: !showForm }">
        <div class="row">
          <div class="input-field col s6">
            <input type="text" class="validate" name="catname" id="catname" v-model="catname" placeholder="Category name" />
            <label for="local">Category name</label>
          </div>
        </div>
      </div>

      <div class="row" :class="{ hidden: showForm }">
        <div class="col s12">
          <div class="table-responsive">
            <table class="table table-bordered table-striped">
              <colgroup>
                <col width="60%" />
                <col width="40%" />
              </colgroup>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in categories" :key="i">
                  <td scope="row"><span v-html="item" /></td>
                  <td>
                    <button type="button" class="btn btn-small waves-effect waves-light teal accent-4" @click="handleUpdateCategory(item)">Update</button>
                    <button type="button" class="btn btn-small waves-effect waves-light red darken-1" @click="handleDeleteCategory(item)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <div class="form-actions">
      <div class="form-actions__inner">

        <div class="form-actions__inner-button" v-if="showForm">
          <button class="btn waves-effect waves-light" type="button" name="action" @click="submit($event)">Submit</button>
        </div>

        <div class="form-actions__inner-button" v-if="showForm">
          <button class="btn waves-effect red" type="reset" name="action">Reset</button>
        </div>

        <div class="form-actions__inner-button" v-if="showForm">
          <button class="btn waves-effect green" type="reset" name="cancel" @click="showForm = !showForm">Cancel</button>
        </div>

        <div class="form-actions__inner-button" v-if="!showForm">
          <button class="btn waves-effect blue" type="button" name="action" @click="handleCreateCategory">Create Category</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { setStorage, getStorage } from '@/library/storage'
import { defaultDatabases } from '@/library/static/schemas'
import { sortArray } from '@/library/utils'
export default {
  name: "FormCategory",
  data() {
    return {
      category: "", // original value
      showForm: false
    };
  },
  computed: {
    ...mapState({
      database: state => state.database.database,
      databases: state => state.database.databases,
      category: state => state.database.category,
      categories: (state) => {
        const data = (state.database.database.categories && state.database.database.categories.length) ? state.database.database.categories : [];
        return sortArray(data);
      }
    }),
    catname: {
      get () {
        return this.$store.state.database.catname
      },
      set (value) {
        this.$store.commit('database/SET_CATNAME', value)
      }
    },
    ...mapGetters({
      getCatName: 'database/getCatName'
    }),
  },
  watch: {
    catname: function(newVal, oldVal) {
      if (this.update) {}
    }
  },
  mounted() {
    const $pouch = this.$pouch;
    this.loadDatabases({ $pouch }).then((resp) => {});
  },
  methods: {
    ...mapActions({
      loadDatabase: 'database/LOAD_DATABASE',
      loadDatabases: 'database/LOAD_DATABASES',
      saveDatabase: 'database/SAVE_DATABASE',
      deleteCategory: 'database/DELETE_CATEGORY'
    }),
    submit(event) {
      const $pouch = this.$pouch;
      const database = this.database;
      const catname = this.getCatName;
      const category = this.category;

      let categories = this.database.categories;

      if (categories.includes(catname)) return;

      if (category.length) {
        let foundIndex = categories.findIndex(x => x == category);
        if (foundIndex >= 0) {
          categories[foundIndex] = catname;
        }
      } else {
        categories.push(catname);
      }

      const doc = { ...database, ...sortArray(categories) };

      console.log('submit-doc', doc);

      this.saveDatabase({ $pouch, doc }).then((resp) => {
        this.showForm = false;
        this.category = '';
        this.catname = '';
      }).catch((err) => {});
    },
    onSelectChange(event) {
      const $pouch = this.$pouch;
      const docId = event.target.value;
      this.loadDatabase({ $pouch, docId });
    },
    handleUpdateCategory(item) {
      this.showForm = true;
      this.category = item;
      this.catname = item;
    },
    handleCreateCategory(event) {
      this.showForm = true;
      this.catname = '';
      this.category = '';
    },
    handleDeleteCategory(category) {
      const docId = this.database._id;
      const $pouch = this.$pouch;
      this.deleteCategory({ $pouch, docId, category });
    }
  }
};
</script>
