<template>
  <div class="featured-slider">
    <div class="featured-slider__slides">
      <div class="slide" data-section="0" data-duration="10" v-for="(item, i) in images" :key="i">
        <div class="slide__cover" v-bind:style="{ backgroundImage: 'url(' + item.src + ')' }"></div>
        <div class="slide__content">
          <div class="slide__inner">
            <p v-html="item.alt">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TweenMax, Expo, Linear } from 'gsap'
export default {
  name: "AppSlider",
  props: ['images'],
  data() {
    return {
      sections: [],
      sectionNumber: 0,
      totalSections: 0,
      appDimensions: {
        w: 340,
        h: 540
      },
      updatedTime: 0,
      rAF: undefined
    };
  },
  mounted() {
    this.slider = document.querySelector(".featured-slider");
    this.sliderInner = this.slider.querySelector(".featured-slider__slides");

    this.sections = this.$el.querySelectorAll(".slide");
    for (let i = 0; i < this.sections.length; i++) {
      const bounds = this.sections[i].getBoundingClientRect();
      this.sections[i].seconds = this.sections[i].getAttribute("data-duration") * 1000
    }

    this.totalSections = this.sections.length;

    this.$nextTick(() => {
      if (this.totalSections>1) {
        this.animate();
      } else {
        this.scrollToSection(0);
      }
    });
  },
  methods: {
    scrollToSection(updated) {

      let length = this.sections.length;
      let current = this.sections[this.sectionNumber];
      let previous = this.sections[(this.sectionNumber + length - 1) % length];
      let next = this.sections[(this.sectionNumber + 1) % length];
      let seconds = Math.floor((current.seconds / 1000) % 60);

      if (previous.classList.contains("activate-in")) {
        previous.classList.remove("activate-in")
      }

      current.classList.add("activate-in");

      TweenMax.to(this.sliderInner, 1.25, {
        y: -this.sectionNumber * this.appDimensions.h,
        ease: Expo.easeInOut
      });
    },
    animate(currentTime) {
      const runTime = currentTime ? currentTime : 0;

      for (let i = 0; i < this.sections.length; i++) {
        let timeInSeconds = this.sections[this.sectionNumber].seconds;

        let seconds = 0;
        if (currentTime > 0) {
          seconds = parseFloat(
            (Math.round(currentTime - this.updatedTime) / timeInSeconds) * 100
          ).toFixed(2);
        }

        if (!this.updatedTime) {
          this.updatedTime = runTime;
          this.scrollToSection(runTime);
          break;
        }

        if (currentTime - this.updatedTime >= timeInSeconds) {
          this.updatedTime = runTime;
          if (this.sectionNumber < this.sections.length - 1) {
            this.sectionNumber++;
          } else {
            this.sectionNumber = 0;
          }
          this.scrollToSection(runTime);
          break;
        }
      }

      if (this.totalSections>1) {
        this.raF = requestAnimationFrame(this.animate.bind(this));
      }
    }
  }
};
</script>

<style lang="scss">

%full {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}

.featured-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden; // new
  opacity: 1;
  pointer-events: none;
  &__slides {
    padding: 0;
    margin: 0;
    overflow: hidden; 
  }
}

.slide {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &__cover {
    @extend %full;
    background-image: url("/assets/images/background.png");
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: scroll;
    transition: 1s all ease-out;
    z-index: -1;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 540px;
    width: 340px;
  }

  &__inner {
    display: block;
    padding: 5px;
    width: 100%;
    background: #000;
    opacity: 0.4;
  }

  p {
    color: #fff;
    text-align: left;
    font-size: 12px;
    opacity: 0;
    user-select: none;
    transform: translateX(-100%);
    transition: transform 2s cubic-bezier(0.23, 1, 0.32, 1), opacity 1s cubic-bezier(0.23, 1, 0.32, 1);
    will-change: transform;
  }

  &.activate-in .slide__cover {
    transform: scale(1.2);
    transition: transform 15s;
    will-change: transform;
  }

  &.activate-in p {
    opacity: 1;
    transform: translateX(0);
  }

}
</style>
