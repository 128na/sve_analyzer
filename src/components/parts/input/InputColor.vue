<template>
  <b-form-group>
    <template v-slot:label>
      <b-form inline class="input-color">
        <span class="mr-2">
          <slot></slot>
        </span>
        <b-form-input type="text" size="sm" :value="value" @input="handle" />
      </b-form>
    </template>
    <b-form-input type="color" :value="value" @input="handle" />
  </b-form-group>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: "#000000"
    }
  },
  methods: {
    handle(value) {
      this.$emit("input", value);
    }
  }
};
</script>
<style lang="scss">
.input-color input[type="text"] {
  border: none;
  width: 6rem;
  text-align: right;
}
</style>