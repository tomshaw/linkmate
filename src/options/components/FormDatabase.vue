<template>
  <form ref="form">
    <div class="form-body">
      
      <div class="row">
        <div class="col s8">
          <h2>Database Management</h2>
          <p>Remote databases require either admin credentials or explicitly granted user or group permissions to access the specified database.</p>
        </div>
      </div>

      <div :class="{ hidden: !showForm }">

        <div class="row">
          <div class="input-field col s6">
            <input type="text" class="validate" name="title" id="title" v-model="database.title" placeholder="Database title" />
            <label for="local">Database title</label>
          </div>
          <div class="input-field col s6"></div>
        </div>

        <div class="row">
          <div class="input-field col s6">
            <input type="text" class="validate" name="local" id="local" v-model="database.local" placeholder="Local db name" />
            <label for="local">Local db name</label>
          </div>
          <div class="input-field col s6">
            <input type="text" class="validate" name="remote" id="remote" v-model="database.remote" placeholder="http://localhost:5984/dbname" />
            <label for="remote">Remote db name</label>
          </div>
        </div>

        <div class="row">
          <div class="input-field col s6">
            <input type="text" class="validate" name="username" id="username" v-model="database.username" placeholder="Database username" />
            <label for="username">Database username</label>
          </div>
          <div class="input-field col s6">
            <input type="password" class="validate" name="password" id="password" v-model="database.password" placeholder="Database password" />
            <label for="password">Database password</label>
          </div>
        </div>

        <div class="row">
          <div class="input-field col s6">
            <input type="text" class="validate" name="description" id="description" v-model="database.description" placeholder="Database description" />
            <label for="description">Database description</label>
          </div>
          <div class="input-field col s6"></div>
        </div>

      </div>

      <div class="row" :class="{ hidden: showForm }">
        <div class="col s12">
          <div class="table-responsive">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in databases" :key="i">
                  <th scope="row">
                    <label>
                      <input name="selected" type="radio" @click="changeSelected($event, item)" :checked="item.doc.selected === true" />
                      <span v-html="item.doc.title" />
                    </label>
                  </th>
                  <td>{{ item.doc.description }}</td>
                  <td>
                    <button type="button" class="btn btn-small waves-effect waves-light teal accent-4" @click="updateItem(item)">Update</button>
                    <button type="button" class="btn btn-small waves-effect waves-light red darken-1" @click="deleteItem(item.doc)">Delete</button>
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
          <button type="button" class="btn waves-effect teal" name="action" @click="submit($event)">Submit</button>
        </div>

        <div class="form-actions__inner-button" v-if="showForm">
          <button type="reset" class="btn waves-effect teal" name="cancel" @click="showForm = !showForm">Cancel</button>
        </div>

        <div class="form-actions__inner-button" v-if="showForm && database.remote">
          <button type="button" class="btn waves-effect indigo" name="validate" @click="validateItem(database)">Validate</button>
        </div>

        <div class="form-actions__inner-button" v-if="!showForm">
          <button type="button" class="btn waves-effect teal" name="action" @click="showForm = !showForm">Create Database</button>
        </div>

      </div>
    </div>

  </form>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { parseRemote } from '@/library/utils'
import { databaseSchema, documentFields } from '@/library/static/schemas'
export default {
  name: "FormDatabase",
  data() {
    return {
      showForm: false
    };
  },
  computed: {
    ...mapState({
      database: state => state.database.database,
      databases: state => state.database.databases,
    })
  },
  mounted() {
    const $pouch = this.$pouch;
    this.loadDatabases({ $pouch }).then((resp) => {});
    this.setDatabase(databaseSchema);
  },
  methods: {
    ...mapActions({
      loadDatabase: 'database/LOAD_DATABASE',
      loadDatabases: 'database/LOAD_DATABASES',
      saveDatabase: 'database/SAVE_DATABASE',
      deleteDatabase: 'database/DELETE_DATABASE',
      updateSelected: 'database/UPDATE_SELECTED',
      dbInformation: 'database/DATABASE_INFORMATION',
      createRemote: 'database/CREATE_REMOTE_DATABASE',
      createIndexes: 'database/CREATE_INDEXES'
    }),
    ...mapMutations({
      setDatabase: 'database/SET_DATABASE',
    }),
    submit(event) {
      const $pouch = this.$pouch;
      let doc = this.database;
      if (!doc.id) doc.id = new Date().getTime();
      if (!doc.local) return;

      this.saveDatabase({ $pouch, doc }).then((resp) => {
        this.loadDatabases({ $pouch }).then((item) => {
          this.showForm = false;
          this.setDatabase(databaseSchema);
        });
      }).catch((err) => {});
    },
    updateItem(item) {
      const $pouch = this.$pouch;
      const database = item.local;
      
      this.loadDatabase({ $pouch, docId: item.id }).then((result) => {
        this.showForm = true;
      });

      this.dbInformation({ $pouch, database }).then((result) => {
        console.log('database-information', result);
      });
    },
    deleteItem(doc, index) {
      const $pouch = this.$pouch;
      this.deleteDatabase({ $pouch, doc });
    },
    changeSelected(event, item) { 
      const $pouch = this.$pouch;
      const docId = item.id;
      this.updateSelected({ $pouch, docId }).then((resp) => {}).catch(err => {});
    },
    validateItem(item) {
      const $pouch = this.$pouch;

      if (!item.username || !item.password || !item.remote) {
        return false;
      }

      const { protocol, host, pathname } = parseRemote(item.remote);

      const data = {
        remote: `${protocol}//${item.username}:${item.password}@${host}${pathname}`
      }

      if (item.verified) {
        this.updateVerifiedStatus({...item, verified: false})
      } else {
        this.createRemote({ $pouch, data }).then((resp) => {
          this.updateVerifiedStatus({ ...item, verified: true })
        }).catch((err) => {});
      }
    },
    updateVerifiedStatus(doc) {
      const $pouch = this.$pouch;
      this.saveDatabase({ $pouch, doc }).then((resp) => {
        this.loadDatabases({ $pouch }).then((item) => {});
      }).catch((err) => {});
    }
  }
};
</script>