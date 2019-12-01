<template>
  <div class="options">
    <div class="options__background screen-image" v-bind:class="{ filtered: filtered }" v-bind:style="{ backgroundImage: 'url(' + image + ')' }">
      <div class="options__background-overlay"></div>
    </div>
    <div class="options__content">

      <div class="options__content-logo">
        <img src="/assets/images/logo.png">
      </div>

      <div class="options__content-buttons">
        <a class="btn-floating btn-large teal" title="Close" @click="handleClose">
          <i class="large material-icons">done</i>
        </a>
        <a class="btn-floating btn-large pink" title="Logout" @click="handleLogout">
          <i class="large material-icons">lock</i>
        </a>
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { removeStorage } from "../../library/storage";
import { STORAGE_DBNAME_DOCUMENTS } from "../../library/static/constants";
export default {
  data() {
    return {
      image: "/assets/images/background.png",
      filtered: false
    };
  },
  computed: {
    ...mapState({
      database: state => state.database.database
    })
  },
  mounted() {
    const $pouch = this.$pouch;
    this.$eventHub.$on("database:initialized", () => {
      const database = this.database.local ? this.database.local : STORAGE_DBNAME_DOCUMENTS;
      this.loadDocuments({ $pouch, database }).then((resp) => {
        if (resp.length) {
          this.image = resp[0].image;
          this.filtered = true;
        }
      }).catch(err => {});
    });
  },
  methods: {
    ...mapActions({
      loadDocuments: 'document/LOAD_DOCUMENTS'
    }),
    handleLogout(event) {
      removeStorage("session").then(resp => {
        this.$nextTick(() => {
          window.close();
        });
      });
    },
    handleClose(screen) {
      window.close();
    }
  }
};
</script>

<style lang="scss">
.options {
  &__background {
    background-color: inherit;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    transform: scale(1.2);
    &.filtered {
      filter: blur(20px);
    }
  }
  &__background-overlay {
    background-color: #000;
    box-shadow: inset 0 0 0 200px rgba(0, 0, 0, 0.05);
    opacity: 0.05;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
  &__content {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: flex-end;
    position: relative;
    height: 540px;
    height: calc(540px - 100px);
    width: 340px;
    overflow: hidden;
  }
  &__content-buttons {
    padding: 0 10px;
    a + a {
      margin-left: 20px;
    }
  }
}
</style>
