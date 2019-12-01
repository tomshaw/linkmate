<template>
  <div class="history">
    <simplebar class="history__scroller">
      <div class="block" v-for="(item, index) in documents" :key="index">
        <div class="block__inner">
          <div class="block__inner-media">
            <img :src="item.image" />
            <div class="overlay">
              <div><i class="material-icons" @click="onLaunchClick(item)">important_devices</i></div>
            </div>
          </div>
          <div class="block__inner-content">
            <div class="text" v-bind:class="{ active: item.newItem }">
              <div>
                <h4>{{ item.domain }}</h4>
                <h3>{{ item.date }}</h3>
              </div>
              <h2>{{ item.title | limitLength }}</h2>
              <div>
                <h4>{{ database.local | upperFirst }}: <span>{{ item.category | processCats }}</span></h4>
              </div>
            </div>
            <div class="overlay">
              <div><i class="material-icons" @click="onUpdateClick(item)">description</i></div>
              <div><i class="material-icons" @click="onDeleteClick(item)">delete</i></div>
            </div>
          </div>
        </div>
      </div>
    </simplebar>
  </div>
</template>

<script>
import simplebar from 'simplebar-vue'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
export default {
  components: {
    simplebar
  },
  computed: {
    ...mapState({
      database: state =>  state.database.database,
      documents: state =>  state.document.documents
    }),
    ...mapGetters({
      getDatabaseById: 'database/getDatabaseById',
    })
  },
  filters: {
    processCats: function(v) {
      if (v.length) {
        return v.join(", ");
      }
    },
    upperFirst: function(v) {
      return v[0].toUpperCase() + v.substr(1);
    },
    limitLength: function(v) {
      if (v) {
        return v.substring(0, 75);
      }
    }
  },
  mounted() {
    const $pouch = this.$pouch;
    this.$eventHub.$on("database:initialized", () => {
      const database = this.database.local;
      this.loadDocuments({ $pouch, database }).then((resp) => {}).catch(err => {});
    });
  },
  methods: {
    ...mapActions({
      loadDatabase: 'database/LOAD_DATABASE',
      loadDocument: 'document/LOAD_DOCUMENT',
      loadDocuments: 'document/LOAD_DOCUMENTS',
      removeDocument: 'document/REMOVE_DOCUMENT'
    }),
    ...mapMutations({
      setActivePage: 'page/SET_ACTIVE_PAGE', // check id and rev
    }),
    onUpdateClick(doc) {
      const $pouch = this.$pouch;

      this.setActivePage(doc);

      const search = this.getDatabaseById(doc.database);

      if (search && search.length && search[0].doc.local) {
        const database = search[0].doc.local;
        this.loadDocument({ $pouch, database, docId: doc._id }).then((resp) => {
          let elems = document.getElementById('category');
          let instance = M.FormSelect.init(elems);
        }).then(() => {
          M.updateTextFields();
        }).then(() => {
          this.$eventHub.$emit("toggle:screen", "screen-article");
        }).catch(err => {});
      }
    },
    onDeleteClick(doc) {
      const $pouch = this.$pouch;
      const search = this.getDatabaseById(doc.database);
      if (search && search.length && search[0].doc.local) {
        const database = search[0].doc.local;
        this.removeDocument({ $pouch, database, doc }).then((resp) => {}).catch(err => {});
      }
    },
    onLaunchClick(item) {
      if (item && item.url) {
        this.$eventHub.$emit("browser:tabs:create", item.url);
      }
    }
  }
};
</script>

<style lang="scss">
.history {
  &__scroller {
    background: inherit;
    height: 490px;
    width: 340px;
  }
  .block {
    background: #f5f5f5;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 80px;
    border-bottom: solid 1px rgba(0, 0, 0, 0.07);
    cursor: pointer;
    &__inner {
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: stretch;
      align-content: stretch;
      width: 100%;
      height: 79px;
    }
    &__inner-media {
      position: relative;
      margin: 0;
      padding: 0;
      height: 80px;
      width: 25%;
      z-index: 1;
      &:hover .overlay {
        opacity: 1;
        width: 100%;
      }
      img {
        height: 80px;
        width: 100%;
        object-fit: cover;
      }
      .overlay {
        position: absolute;
        top: 0;
        right: 0;
        height: 80px;
        width: 0;
        background: #f5f5f5;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: width .3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity .6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        > div {
          i {
            color: #919191;
            opacity: .95;
          }
        }
      }
    }

    &__inner-content {
      position: relative;
      margin: 0;
      padding: 0;
      height: 79px;
      width: 75%;
      &:hover .overlay {
        opacity: 1;
        width: 100%;
      }
      .text {
        position: relative;
        padding: 0 5px;
        height: 79px;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        justify-content: space-around;
        align-items: stretch;
        align-content: stretch;
        h2 {
          color: #515151;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          margin: 0;
          padding: 0;
        }
        h3 {
          color: #b2b2b2;
          float: right;
          font-size: 8.5px;
          font-weight: 800;
          text-transform: uppercase;
          margin: 0;
          padding: 4px 0;
        }
        h4 {
          color: #919191;
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          margin: 0;
          padding: 0;
          span {
            display: inline-block;
          }
        }
      }
      .overlay {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        height: 79px;
        width: 0;
        background: #f5f5f5;
        opacity: 0;
        transition: width .3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity .6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        > div {
          padding: 15px;
          i {
            color: #919191;
            opacity: .95;
          }
        }
      }
    }
  }
}
</style>
