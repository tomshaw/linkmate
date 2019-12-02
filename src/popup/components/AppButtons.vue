<template>
  <div class="fixed-action-btn action-buttons">
    <a class="btn-floating btn-large" v-bind:class="buttonStyle" v-on:click="$eventHub.$emit('toggle:screen', toggleScreen)">
      <i class="large material-icons">{{ buttonIcon }}</i>
    </a>
    <ul>
      <li v-if="activeScreen === 'screen-featured'">
        <a class="btn-floating teal" title="Download Images" @click="handleDownloadImages($event)">
          <i class="material-icons">camera_roll</i>
        </a>
      </li>
      <li v-if="activeScreen === 'screen-featured' || activeScreen === 'screen-article'">
        <a class="btn-floating red" title="Speech Listen" @click="handleListenSpeech($event)">
          <i class="material-icons">play_circle_filled</i>
        </a>
      </li>
      <li v-if="activeScreen === 'screen-article'">
        <a class="btn-floating blue" title="Submit Page" @click="handleSubmitPage($event)">
          <i class="material-icons">attach_file</i>
        </a>
      </li>
      <li v-if="activeScreen === 'screen-options' && authEnabled">
        <a class="btn-floating red" title="Application Logout" @click="handleAppLogout">
          <i class="material-icons">lock</i>
        </a>
      </li>
      <li v-if="activeScreen === 'screen-options'">
        <a class="btn-floating teal" title="Close Application Window" @click="handleCloseWindow">
          <i class="material-icons">done</i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getStorage, removeStorage } from "../../library/storage";
import SpeechSynthesizer from "../../library/synthesizer";
export default {
  props: {
    hidden: Number,
    authEnabled: {
      type: Boolean,
      default: false,
      required: false
    },
    buttonIcon: {
      type: String,
      default: "mode_edit",
      required: false
    },
    buttonStyle: {
      type: String,
      default: "teal",
      required: false
    },
    activeScreen: {
      type: String,
      default: "screen-featured",
      required: true
    },
    toggleScreen: {
      type: String,
      default: "screen-article",
      required: false
    }
  },
  computed: {
    ...mapGetters({
      getActivePage: "page/getActivePage"
    })
  },
  created() {
    this.speechSynthesizer = new SpeechSynthesizer();
  },
  mounted() {
    this.$eventHub.$on("database:initialized", () => {
      M.FloatingActionButton.init(
        document.querySelectorAll(".fixed-action-btn"),
        { direction: "right" }
      );
    });
  },
  methods: {
    handleDownloadImages() {
      const page = this.getActivePage;
      if (page && page.images && page.images.length) {
        page.images.map(item =>
          this.$eventHub.$emit("browser:tabs:create", item.src)
        );
      }
    },
    handleListenSpeech() {
      const page = this.getActivePage;
      if (page && page.title) {
        this.speechSynthesizer.text = page.title;
        this.speechSynthesizer.speak();
      }
    },
    handleSubmitPage($event) {
      this.$eventHub.$emit("submit:page", $event);
    },
    handleAppLogout(event) {
      removeStorage("session").then(resp => {
        this.$nextTick(() => {
          window.close();
        });
      });
    },
    handleCloseWindow(screen) {
      window.close();
    }
  }
};
</script>