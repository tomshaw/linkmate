<template>
  <form ref="form">

    <div class="form-body">

      <FormMessage />
      
      <div class="row" v-bind:class="{ hidden: getMessageEnabled }">
        <div class="col s8">
          <h2>Database Replication</h2>
          <p>Remote databases require either admin credentials or explicitly granted user or group permissions to access the specified database.</p>
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
                    <button type="button" class="btn btn-small waves-effect teal" @click="handlePushDatabase($event, item.doc)">Push</button>
                    <button type="button" class="btn btn-small waves-effect teal" @click="handlePullDatabase($event, item.doc)">Pull</button>
                    <button type="button" class="btn btn-small waves-effect teal" @click="handleSyncDatabase($event, item.doc)">Sync</button>
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
import { mapState, mapGetters, mapActions } from "vuex";
import FormMessage from "@/options/components/FormMessage";
export default {
  name: "FormReplication",
  components: {
    FormMessage
  },
  data() {
    return {
      items: []
    };
  },
  computed: {
    ...mapState({
      databases: state => state.database.databases,
    }),
    ...mapGetters({
      getMessageEnabled: 'message/getMessageEnabled'
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
      saveDatabase: 'database/SAVE_DATABASE',
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

      event.preventDefault();

      this.authConnect({ $pouch, username, password, database }).then((result) => {
        this.displayMessage('success', 'Authorization Completed', `You have sucessfully connected to remote database: ${database}.`);
        this.saveDatabase({ $pouch, doc: { ...item, verified: true } });
      }).catch((err) => {
        this.displayMessage('warning', 'Authorization Error', err.message);
        this.saveDatabase({ $pouch, doc: { ...item, verified: false } });
      });
    },
    handlePushDatabase(event, item) {
      const $pouch = this.$pouch;
      const local = item.local;
      const remote = item.remote;
      const options = {}; // live: true, retry: true 

      const data = { $pouch, local, remote, options };
      console.log('push-database-options', data);

      this.pushDatabase(data).then((result) => {
        this.displayMessage('success', 'Successfully Completed', `You have sucessfully pushed database: ${local} to ${remote}.`);
      }).then(() => {
        this.loadDatabases({ $pouch }).catch((err) => {});
      }).catch((err) => {
        this.displayMessage('warning', 'Push Database Error', err.message);
      });
    },
    handlePullDatabase(event, item) {
      const $pouch = this.$pouch;
      const local = item.local;
      const remote = item.remote;
      const options = {}; // live: true, retry: true

      const data = { $pouch, local, remote, options };
      console.log('pull-database-options', data);

      this.pullDatabase(data).then((result) => {
        this.displayMessage('success', 'Successfully Completed', `You have sucessfully pulled database: ${remote} to ${local}.`);
      }).then(() => {
        this.loadDatabases({ $pouch }).catch((err) => {});
      }).catch((err) => {
        this.displayMessage('warning', 'Pull Database Error', err.message);
      });
    },
    handleSyncDatabase(event, item) {
      const $pouch = this.$pouch;
      const local = item.local;
      const remote = item.remote;
      const options = { live: true, retry: true };

      const data = { $pouch, local, remote, options };
      console.log('sync-database-options', data);

      this.syncDatabase(data).then((result) => {
        console.log('sync-database-result::', result);
        this.displayMessage('success', 'Successfully Completed', `You have sucessfully synced databases: ${remote} and ${local}.`);
      }).then(() => {
        this.loadDatabases({ $pouch }).catch((err) => {});
      }).catch((err) => {
        this.displayMessage('warning', 'Sync Database Error', err.message);
      });
    },
    displayMessage(type, header, paragraph) {
      const options = {
        type, // primary, success, warning, codeblock
        enabled: true,
        timeout: false,
        content: {
          header,
          paragraph
        }
      }
      this.$eventHub.$emit("display:message", options);
    }
  }
};
</script>
