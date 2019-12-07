<template>
  <div class="message" v-bind:class="[type, { active: enabled } ]" v-if="enabled">
    <div class="row">
      <div class="col s8">
        <h2 v-html="content.header" />
        <p v-html="content.paragraph" />
      </div>
    </div>
    <button type="button" class="close" @click="handleDismiss">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "FormMessage",
  computed: {
    ...mapState({
      type: state => state.message.type,
      timeout: state => state.message.timeout,
      enabled: state => state.message.enabled,
      content: state => state.message.content
    })
  },
  mounted() {
    this.$eventHub.$on("display:message", options =>
      this.displayMessage(options)
    );
  },
  methods: {
    ...mapMutations({
      setMessageType: "message/SET_MESSAGE_TYPE",
      setMessageContent: "message/SET_MESSAGE_CONTENT",
      setMessageEnabled: "message/SET_MESSAGE_ENABLED",
      setMessageTimeout: "message/SET_MESSAGE_TIMEOUT"
    }),
    handleDismiss() {
      this.resetMessage();
    },
    displayMessage(options) {
      this.setMessageType(options.type);
      this.setMessageContent(options.content);
      this.setMessageEnabled(true);
      let timeout = options.timeout ? options.timeout : this.timeout;
      if (timeout) {
        this.checkTimeout(Number(timeout).toPrecision());
      }
    },
    resetMessage() {
      this.setMessageEnabled(false);
      this.setMessageType("primary");
      this.setMessageTimeout(5e3);
      this.setMessageContent({ header: "", paragraph: "" });
    },
    checkTimeout(expires) {
      let timer;
      if (expires) {
        timer = setTimeout(() => {
          this.resetMessage();
          clearTimeout(timer);
        }, expires);
      }
    }
  }
};
</script>

<style lang="scss">
.message {
  position: relative;
  padding: 0 1.25rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  opacity: 0;
  transition: opacity 1s cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform;
  &.active {
    opacity: 1;
  }
  &.primary {
    h2,
    p {
      color: #044891 !important;
    }
    background-color: #c3e0ff;
    border-color: #b1d7ff;
  }
  &.success {
    h2,
    p {
      color: #156127 !important;
    }
    background-color: #d2f3da;
    border-color: #bcdfc4;
  }
  &.warning {
    h2,
    p {
      color: #751a23 !important;
    }
    background-color: #fdd1d5;
    border-color: #fcc5cb;
  }
  &.codeblock {
    h2,
    p {
      color: #312b2b !important;
    }
    background-color: #cacaca;
    border-color: #a7a7a7;
  }
  button {
    cursor: pointer;
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: transparent;
    border: 0;
    -webkit-appearance: none;
  }
}
</style>
