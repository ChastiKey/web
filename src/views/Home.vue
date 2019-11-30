<template>
  <v-row>
    <v-col cols="12">
      <v-row align="center" justify="center" class="grey lighten-5" style="height: 300px;">
        <router-link to="/lockee" style="text-decoration: none;">
          <v-card
            style="padding: 25px 15px; width: 125px; height: 125px; margin: 10px; text-align: center"
            outlined
            tile
          >
            <v-icon large color="gray darken-2">mdi-account</v-icon>
            <br />
            <span style="padding: 10px; display: block;">Lockee</span>
          </v-card>
        </router-link>

        <router-link to="/keyholder" style="text-decoration: none;">
          <v-card
            style="padding: 25px 15px; width: 125px; height: 125px; margin: 10px; text-align: center"
            outlined
            tile
          >
            <v-icon large color="gray darken-2">mdi-account-group</v-icon>
            <br />
            <span style="padding: 10px; display: block;">Keyholder</span>
          </v-card>
        </router-link>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class HomeView extends Vue {}
</script>
