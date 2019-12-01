<template>
  <div class="header">
    <div class="logo">
      <img src="/assets/images/logo.png" title="LinkMate" />
    </div>
    <div class="menu">
      <ul>
        <li @click="updateScreen('screen-article')">
          <i class="material-icons">important_devices</i>
        </li>
        <li @click="updateScreen('screen-history')">
          <i class="material-icons">storage</i>
        </li>
        <li @click="updateScreen('screen-options')">
          <i class="material-icons">settings_power</i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppHeader",
  methods: {
    updateScreen(screen) {
      this.$eventHub.$emit("toggle:screen", screen);
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  background: #7f189f;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: relative;
  width: 340px;
  height: 50px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  z-index: 1;
  .logo,
  .menu {
    position: relative;
    width: 50%;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .logo img {
    margin-left: 5px;
    width: 140px;
  }
  .menu {
    text-align: right;
    ul {
      list-style-type: none;
      margin-right: 15px;
      li {
        color: rgba(255, 255, 255, 0.85);
        cursor: pointer;
        display: inline-block;
        margin: 0;
        padding: 0 5px;
        .material-icons {
          font-size: 20px;
          line-height: 38px;
        }
        &:hover {
          background: rgba(255, 255, 255, 0.4);
          transition: all 0.3s;
        }
      }
    }
  }
}
</style>
