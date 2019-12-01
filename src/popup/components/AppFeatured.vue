<template>
  <div class="featured">
    <AppSlider v-if="backgroundImages" :images="backgroundImages" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import SpeechSynthesizer from "../../library/synthesizer";
import CustomThemes from "../../library/static/themes";
import { getStorage } from "../../library/storage";
import AppSlider from "./AppSlider.vue";
export default {
  components: {
    AppSlider
  },
  data() {
    return {
      themes: CustomThemes
    };
  },
  computed: {
    ...mapState({
      page: state => state.page.page
    }),
    backgroundImage: function() {
      return this.page.image ? this.page.image : "/assets/images/background.png";
    },
    backgroundImages: function() {
      return this.page.images && this.page.images.length ? this.page.images : false;
    }
  },
  created() {
    this.speechSynthesizer = new SpeechSynthesizer();
  },
  mounted() {

    // this.$eventHub.$on("database:initialized", () => {
    //   M.FloatingActionButton.init(document.querySelectorAll(".fixed-action-btn"), { direction: "right" });
    // });

    getStorage("options").then(response => {
      const options = response.options ? response.options : {};

      // synthesizer settings
      if (options.synthesizer && options.synthesizer.enabled) {
        if (this.page && this.page.title) {
          this.speechSynthesizer.text = this.page.title;
          this.speechSynthesizer.speak();
        }
      }

      // theme settings
      if (options.theme) {
        const theme = options.theme;
        const wrapper = document.querySelector(".wrapper");
        const header = document.querySelector(".header");
        if (theme.themeId > 0) {
          const selected = this.themes.filter(item => {
            return item.id === theme.themeId;
          });

          if (selected.length) {
            const styles = selected[0];
            wrapper.style.background = styles.backgroundColor;
            header.style.background = styles.headerColor;
          }
        } else {
          wrapper.style.background = theme.backgroundColor;
          header.style.background = theme.headerColor;
        }
      }
      
    });
  },
  methods: {
    clickDownloadImage() {
      const page = this.getActivePage;
      if (page && page.image) {
        this.$eventHub.$emit("browser:tabs:create", page.image);
      }
    }
  }
};
</script>

<style lang="scss">
.preview {
  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
}
</style>
