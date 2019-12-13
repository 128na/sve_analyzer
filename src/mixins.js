const toastControl = {
  methods: {
    toast(message) {
      this.$bvToast.toast(message, {
        title: "通知",
        isStatus: true,
      });
    },
    toastDanger(message) {
      console.log(message);
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
export { toastControl };
