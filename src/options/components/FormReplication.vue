<template>
  <form ref="form">
    <div class="form-body">
      
      <div class="row">
        <div class="col s8">
          <h2>Database Management</h2>
          <p>Either a remote or local database name is required. Passwords are never stored and are only used for validation.</p>
        </div>
      </div>

      <div class="row">
        <div class="col s12">
          <div class="table-responsive">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th style="width: 20%;">Verified</th>
                  <th style="width: 20%;">Local</th>
                  <th style="width: 20%;">Remote</th>
                  <th style="width: 20%;">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in items" :key="i">
                  <th scope="row">
                    <label style="font-size: 1rem;">
                      <input type="checkbox" @click="verifiySelected($event, item.doc)" :checked="item.doc.verified === true" />
                      <span v-html="item.doc.title" />
                    </label>
                  </th>
                  <td>{{ item.doc.local }}</td>
                  <td>{{ item.doc.remote }}</td>
                  <td>
                    <button type="button" class="btn btn-small waves-effect teal" @click="handlePushDatabase(item.doc)">Push</button>
                    <button type="button" class="btn btn-small waves-effect teal" @click="handlePullDatabase(item.doc)">Pull</button>
                    <button type="button" class="btn btn-small waves-effect teal" @click="handleSyncDatabase(item.doc)">Sync</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

  </form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: "FormReplication",
  data() {
    return {
      items: []
    };
  },
  computed: {
    ...mapState({
      databases: state => state.database.databases,
    })
  },
  mounted() {
    const $pouch = this.$pouch;
    this.loadDatabases({ $pouch }).then((resp) => {
      this.items = resp.filter((item, index, arr) => {
        return item.doc.remote;
      });
    });
  },
  methods: {
    ...mapActions({
      loadDatabases: 'database/LOAD_DATABASES',
      dbInformation: 'database/DATABASE_INFORMATION',
      pushDatabase: 'database/PUSH_DATABASE',
      pullDatabase: 'database/PULL_DATABASE',
      syncDatabase: 'database/SYNC_DATABASE',
      authConnect: 'session/AUTH_CONNECT_REMOTE', // works
    }),
    verifiySelected(event, item) {
      const $pouch = this.$pouch;
      const database = item.remote;
      const username = item.username;
      const password = item.password;

      console.log('item', item);

      event.preventDefault();

      this.dbInformation({ $pouch, database }).then((result) => {
        console.log('database-info-result', result);
      }).catch((err) => {
        console.log('database-info-error', err);
      });

      console.log('database::', database);

      this.authConnect({ $pouch, username, password, database }).then((result) => {
        console.log('load-session-result', result);
      }).catch((err) => {
        console.log('load-session-error', err);
      });

    },
    handlePushDatabase(item) {
      const $pouch = this.$pouch;
      const local = item.local;
      const remote = item.remote;
      const options = { live: true, retry: true };

      this.pushDatabase({ $pouch, local, remote, options }).then((result) => {
        console.log('push-database-result', result);
      }).catch((err) => {
        console.log('push-database-error', err);
      });
    },
    handlePullDatabase(item) {
      const $pouch = this.$pouch;
      const local = item.local;
      const remote = item.remote;
      const options = { live: true, retry: true };

      this.pullDatabase({ $pouch, local, remote, options }).then((result) => {
        console.log('pull-database-result', result);
      }).catch((err) => {
        console.log('pull-database-error', err);
      });
    },
    handleSyncDatabase(item) {
      const $pouch = this.$pouch;
      const local = item.local;
      const remote = item.remote;
      const options = { live: true, retry: true };

      this.syncDatabase({ $pouch, local, remote, options }).then((result) => {
        console.log('sync-database-result', result);
      }).catch((err) => {
        console.log('sync-database-error', err);
      });
    }
  }
};
</script>
