const toastControl = {
  methods: {
    toast(message) {
      this.$bvToast.toast(message, {
        title: "通知",
      });
    },
    toastDanger(message) {
      this.$bvToast.toast(message, {
        title: "通知",
        variant: "danger"
      });
    },
  }
};
export { toastControl };
