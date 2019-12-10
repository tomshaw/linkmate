<template>
  <div class="options">

    <div class="options__background screen-image" v-bind:class="{ filtered: filtered }" v-bind:style="{ backgroundImage: 'url(' + image + ')' }">
      <div class="options__background-overlay"></div>
    </div>

    <div class="options__content">
      <div class="options__content-logo">
        <img src="/assets/images/logo.svg">
      </div>      
    </div>

    <AppButtons buttonStyle="purple darken-3" buttonIcon="beenhere" toggleScreen="screen-featured" activeScreen="screen-options" :authEnabled="authEnabled"/>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getStorage } from '@/library/storage'
import { STORAGE_DBNAME_DOCUMENTS } from '@/library/static/constants'
import AppButtons from './AppButtons.vue'
export default {
  components: {
    AppButtons
  },
  data() {
    return {
      image: "/assets/images/transparent.png",
      filtered: false,
      authEnabled: false
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

    getStorage(["options", "session", "extension"]).then(response => {
      console.log("storage", response);
      const options = (response.options) ? response.options : {};
      const session = (response.session) ? response.session : {};
      const extension = (response.extension) ? response.extension : {};
      if (options.general) {
        if (options.general.auth_enabled) {
          this.authEnabled = options.general.auth_enabled
        }
      }
    });

  },
  methods: {
    ...mapActions({
      loadDocuments: 'document/LOAD_DOCUMENTS'
    })
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
    align-items: center;
    position: relative;
    height: calc(540px - 50px);
    width: 340px;
    overflow: hidden;
  }
  &__content-logo img {
    width: 200px;
    margin-bottom: 10%;
    transform: translateY(100%);
    transition: transform 1s;
    will-change: transform;
  }
}

[data-screen="screen-options"] .content .options .options__content-logo img {
  transform: translateY(0);
}
</style>
