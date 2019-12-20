<template>
  <b-form-group>
    <template v-slot:label>
      <b-form inline class="input-range">
        <span class="mr-2">
          <slot></slot>
        </span>
        <span v-show="!hide">
          <b-form-input type="number" :step="step" size="sm" :value="value" @input="handle" />
          <span>{{ append }}</span>
        </span>
        <span v-show="hide">非表示</span>
      </b-form>
    </template>
    <b-form-input type="range" :step="step" :min="min" :max="max" :value="value" @input="handle" />
  </b-form-group>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: 0
    },
    step: {
      type: Number,
      default: 0.1
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 16
    },
    append: {
      type: String,
      default: ""
    }
  },
  computed: {
    hide() {
      return this.min === 0 ? this.value == 0 : false;
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
.input-range input[type="number"] {
  border: none;
  width: 4rem;
  text-align: right;
}
</style>