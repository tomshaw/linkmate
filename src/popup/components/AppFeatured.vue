<template>
  <div class="featured">
    <AppSlider v-if="sliderImages" :images="sliderImages" />
    <AppButtons buttonStyle="pink darken-4" buttonIcon="home" toggleScreen="screen-article" activeScreen="screen-featured" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SpeechSynthesizer from '@/library/synthesizer'
import CustomThemes from '@/library/static/themes'
import { getStorage } from '@/library/storage'
import AppSlider from './AppSlider.vue'
import AppButtons from './AppButtons.vue'
export default {
  components: {
    AppSlider,
    AppButtons
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
    sliderImages: function() {
      return this.page.images && this.page.images.length ? this.page.images : false;
    }
  },
  created() {
    this.speechSynthesizer = new SpeechSynthesizer();
  },
  mounted() {
    // @todo

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
  }
};
</script>
