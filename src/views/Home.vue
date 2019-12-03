<template>
  <v-row>
    <v-col cols="12">
      <v-row class="grey lighten-5">
        <v-card outlined tile width="600px" class="mx-auto text-center">
          <v-card-title> My Account </v-card-title>
          <v-card-text class="text--primary">
            <router-link to="/lockee" style="text-decoration: none;">
              <v-card :class="['nome-nav-button', 'color-cyan', !isAuthenticated ? 'auth-req' : '']" outlined tile>
                <v-icon large color="gray darken-2">mdi-account-lock</v-icon>
                <br />
                <span style="padding: 10px; display: block;">Lockee</span>
              </v-card>
            </router-link>

            <router-link to="/keyholder" style="text-decoration: none;">
              <v-card :class="['nome-nav-button', 'color-indigo', !isAuthenticated ? 'auth-req' : '']" outlined tile>
                <v-icon large color="gray darken-2">mdi-account-key</v-icon>
                <br />
                <span style="padding: 10px; display: block;">Keyholder</span>
              </v-card>
            </router-link>

            <router-link to="/decision/manager" style="text-decoration: none;">
              <v-card
                :class="['nome-nav-button', 'color-dark-lightblue', !isAuthenticated ? 'auth-req' : '']"
                outlined
                tile
              >
                <v-icon large color="gray darken-2">mdi-format-list-bulleted</v-icon>
                <br />
                <span style="padding: 10px; display: block;">Decisions</span>
              </v-card>
            </router-link>
          </v-card-text>
        </v-card>
      </v-row>

      <v-row class="grey lighten-5">
        <v-card outlined tile width="600px" class="mx-auto ma-4 text-center">
          <v-card-title> Public </v-card-title>
          <v-card-text class="text--primary">
            <router-link to="/stats/locks" style="text-decoration: none;">
              <v-card class="darken-3 nome-nav-button color-dark-green" outlined tile>
                <v-icon large color="gray darken-2">mdi-chart-areaspline</v-icon>
                <br />
                <span style="padding: 10px; display: block;">Locks</span>
              </v-card>
            </router-link>

            <!-- <router-link to="/stats/keyholder" style="text-decoration: none;"> -->
            <v-card class="darken-3 nome-nav-button color-dark-green coming-soon" outlined tile>
              <v-icon large color="gray darken-2">mdi-key-change</v-icon>
              <br />
              <span style="padding: 10px; display: block;">Keyholders</span>
            </v-card>
            <!-- </router-link> -->

            <!-- <router-link to="/search" style="text-decoration: none;"> -->
            <v-card class="darken-3 nome-nav-button color-dark-green coming-soon" outlined tile>
              <v-icon large color="gray darken-2">mdi-account-search</v-icon>
              <br />
              <span style="padding: 10px; display: block;">Search</span>
            </v-card>
            <!-- </router-link> -->
          </v-card-text>
        </v-card>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class HomeView extends Vue {
  @Prop({ default: false })
  private isAuthenticated!: boolean
  private hoverElevation = 0
}
</script>

<style lang="less">
.nome-nav-button {
  padding: 25px 15px;
  width: 125px;
  height: 125px;
  margin: 10px;
  text-align: center;
  display: inline-block;
  position: relative;
  margin: 10px 5px;
  &:hover {
    -webkit-box-shadow: 0px 0px 15px -5px rgba(128, 128, 128, 0.75);
    -moz-box-shadow: 0px 0px 15px -5px rgba(128, 128, 128, 0.75);
    box-shadow: 0px 0px 15px -5px rgba(128, 128, 128, 0.75);
  }
  &.color-cyan {
    border-color: #0097a7 !important;
    color: #0097a7;
    .v-icon {
      color: #0097a7;
    }
    &:hover {
      -webkit-box-shadow: 0px 0px 15px -5px #0097a7;
      -moz-box-shadow: 0px 0px 15px -5px #0097a7;
      box-shadow: 0px 0px 15px -5px #0097a7;
    }
  }
  &.color-indigo {
    border-color: #3f51b5 !important;
    color: #3f51b5;
    .v-icon {
      color: #3f51b5;
    }
    &:hover {
      -webkit-box-shadow: 0px 0px 15px -5px #3f51b5;
      -moz-box-shadow: 0px 0px 15px -5px #3f51b5;
      box-shadow: 0px 0px 15px -5px #3f51b5;
    }
  }
  &.color-dark-green {
    border-color: #009688 !important;
    color: #009688;
    .v-icon {
      color: #009688;
    }
    &:hover {
      -webkit-box-shadow: 0px 0px 15px -5px #009688;
      -moz-box-shadow: 0px 0px 15px -5px #009688;
      box-shadow: 0px 0px 15px -5px #009688;
    }
  }
  &.color-dark-lightblue {
    border-color: #0288d1 !important;
    color: #0288d1;
    .v-icon {
      color: #0288d1;
    }
    &:hover {
      -webkit-box-shadow: 0px 0px 15px -5px #0288d1;
      -moz-box-shadow: 0px 0px 15px -5px #0288d1;
      box-shadow: 0px 0px 15px -5px #0288d1;
    }
  }
}

.auth-req {
  &.color-cyan,
  &.color-indigo,
  &.color-dark-green {
    border-color: rgba(128, 128, 128, 0.65) !important;
    color: rgba(128, 128, 128, 0.65);
    .v-icon {
      color: rgba(128, 128, 128, 0.65);
    }
    &:hover {
      -webkit-box-shadow: 0px 0px 15px -5px rgba(128, 128, 128, 0.65);
      -moz-box-shadow: 0px 0px 15px -5px rgba(128, 128, 128, 0.65);
      box-shadow: 0px 0px 15px -5px rgba(128, 128, 128, 0.65);
    }
  }

  &::after {
    position: absolute;
    content: 'Login Req';
    top: 50px;
    left: 0;
    width: 100%;
    background-color: #e53935;
    color: #fff;
    opacity: 1;
    z-index: 2;
  }
}

.coming-soon {
  &.color-cyan,
  &.color-indigo,
  &.color-dark-green {
    border-color: rgba(128, 128, 128, 0.65) !important;
    color: rgba(128, 128, 128, 0.65);
    .v-icon {
      color: rgba(128, 128, 128, 0.65);
    }
    &:hover {
      -webkit-box-shadow: 0px 0px 15px -5px rgba(128, 128, 128, 0.65);
      -moz-box-shadow: 0px 0px 15px -5px rgba(128, 128, 128, 0.65);
      box-shadow: 0px 0px 15px -5px rgba(128, 128, 128, 0.65);
    }
  }
  &::after {
    position: absolute;
    content: 'Coming Soon!';
    top: 50px;
    left: 0;
    width: 100%;
    background-color: #ec407a;
    color: #fff;
    opacity: 1;
    z-index: 2;
  }
}
</style>
