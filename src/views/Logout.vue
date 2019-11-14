<template>
  <v-row>
    <v-col cols="12">
      <v-row align="center" justify="center" style="height: 300px;">
        <span class="headline">Successfully logged out!</span>
      </v-row>
      <v-row align="center" justify="center">
        <router-link to="/login">Return to login</router-link>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// Utils
import { delSession } from '../utils/session'

@Component({})
export default class LogoutView extends Vue {
  private mounted() {
    delSession()
  }
}
</script>
