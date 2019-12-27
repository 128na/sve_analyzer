const toastControl = {
  methods: {
    toast(message) {
      this.$bvToast.toast(message, {
        title: "通知",
        isStatus: true,
      });
    },
    toastWarn(message) {
      this.$bvToast.toast(message, {
        title: "注意",
        variant: "warning",
        isStatus: true,
        toastClass: 'pre'
      });
    },
    toastDanger(message) {
      console.warn(message);
      this.$bvToast.toast(message, {
        title: "エラー",
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
