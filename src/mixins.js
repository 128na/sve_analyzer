const toastControl = {
  methods: {
    toast(message) {
      this.$bvToast.toast(message, {
        title: "通知",
        isStatus: true,
      });
    },
    toastDanger(message) {
      console.warn(message);
      this.$bvToast.toast(message, {
        title: "通知",
        variant: "danger",
        isStatus: true,
        noAutoHide: true,
        toastClass: 'pre'
      });
    },
  }
};

const slideControl = {
  props: {
    show: { type: Boolean, default: false }
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
}
export { toastControl, slideControl };
