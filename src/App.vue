<template>
  <v-app v-if="appSession.isLoaded">
    <!-- Header -->
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-2" dark>
      <!-- App Menu: Home -->
      <router-link to="/" style="text-decoration: none;">
        <v-btn icon>
          <v-icon>mdi-apps</v-icon>
        </v-btn>
      </router-link>
      <!-- Logo -->
      <span style="font-size: 20px;">Kiera <span style="color: black;">+</span> ChastiKey</span>
      <v-spacer />
      <!-- Content to the right -->
      <!-- Account text -->
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <!-- Show account name + dropdown when authenticated -->
            <v-btn text dark v-on="on" v-show="appSession.isAuthenticated">
              <v-icon size="24px">mdi-account-circle-outline</v-icon>
              <span class="ml-2">{{ appSession.cached.username }}</span>
            </v-btn>
            <!-- Show login button when not -->
            <router-link to="/login" style="text-decoration: none;" v-show="!appSession.isAuthenticated">
              <v-btn text dark v-on="on">
                <v-icon size="24px">mdi-account-circle-outline</v-icon>
                <span class="ml-2">Login</span>
              </v-btn>
            </router-link>
          </template>
          <v-list v-if="appSession.isAuthenticated">
            <v-list-item @click="logoutConfirmationModal = true">
              <v-list-item-title>
                <v-icon size="24px">mdi-logout-variant </v-icon> <span class="ml-2"> Logout </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Logout dialog -->
      <v-dialog
        v-model="logoutConfirmationModal"
        max-width="305"
        v-if="appSession.isAuthenticated && appSession.isLoaded"
      >
        <v-card>
          <v-card-title class="headline">Logout Confirmation?</v-card-title>
          <v-card-text>
            <v-row style="text-align: center;">
              <v-col cols="6">
                <v-btn class="white--text" block color="error" @click="logout">
                  Yes
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn class="white--text" color="success" block @click="logoutConfirmationModal = false">
                  No
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn> -->
    </v-app-bar>

    <!-- Main Content -->
    <v-content>
      <v-container
        :class="$route.name === 'login' || $route.name === 'home' ? 'fill-height' : ''"
        :fluid="$route.name === 'login' || $route.name === 'home' ? true : false"
      >
        <router-view :appSession="appSession" :isAuthenticated="appSession.isAuthenticated"></router-view>
      </v-container>
    </v-content>

    <!-- Footer -->
    <v-card height="400px">
      <v-footer padless>
        <v-card flat tile width="100%" class="text-center">
          <v-card-text>
            <a href="https://github.com/ChastiKey/web" target="_blank" style="text-decoration: none;">
              <v-btn class="mx-4" icon>
                <v-icon size="24px">mdi-github-circle</v-icon>
              </v-btn>
            </a>

            <v-dialog v-model="discordSelectionModal" max-width="290">
              <template v-slot:activator="{ on }">
                <v-btn class="mx-4" v-on="on" icon>
                  <v-icon size="24px">mdi-discord</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline">Which Discord?</v-card-title>
                <v-card-text>
                  <v-row style="text-align: center;">
                    <v-col cols="6">
                      <a href="https://discordapp.com/invite/tuyk2k3" target="_blank" style="text-decoration: none;">
                        <v-btn class="white--text" color="purple">
                          Kiera
                        </v-btn>
                      </a></v-col
                    >
                    <v-col cols="6">
                      <a href="https://discordapp.com/invite/7CNpSJe" target="_blank" style="text-decoration: none;">
                        <v-btn class="white--text" color="teal">
                          ChastiKey
                        </v-btn>
                      </a></v-col
                    >
                  </v-row>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text>
            (Kiera) <strong>RileyIO</strong> | (ChastiKey)
            <strong>KevinCross</strong>
            <br />
            <small
              ><span style="border-radius: 2px; background-color: rgb(240, 240, 240); padding: 2px 5px;"
                >v{{ appVersion }}</span
              >
              - {{ new Date().getFullYear() }}</small
            >
          </v-card-text>
        </v-card>
      </v-footer>
    </v-card>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
const { version } = require('../package.json')

// API
import { validateAuth } from '@/api/auth'

// Defaults
import { $DefaultSession } from '@/defaults/session'

// Objects
import { KieraCachedSession } from './objects/session'

// Utils
import { getSessionHeaders, setSessionHeaders, delSession } from './utils/session'

@Component({})
export default class App extends Vue {
  @Prop({ default: () => $DefaultSession })
  private appSession!: typeof $DefaultSession
  @Prop({ default: version })
  private appVersion!: string
  private discordSelectionModal = false
  private logoutConfirmationModal = false

  private async mounted() {
    const cachedSession = getSessionHeaders()
    console.log('cachedSession:', cachedSession)
    // If session creds are cached
    if (cachedSession.isCached) {
      console.log('doing auth stuffs...')
      const res = await validateAuth()
      console.log('res', res)
      // On: Successful Auth
      if (res) this.onAuthenticated(cachedSession)
      else {
        // Destroy stored session as its clearly invalid
        delSession()

        // Redirect to Login page (if this isn't where the user is)
        if (this.$route.name !== 'login' && this.$route.meta.requiresAuth) {
          this.$router.push({ name: 'login', path: '/login' })
        }
      }
    }

    this.appSession.isLoaded = true
  }

  private onAuthenticated(cachedSession: KieraCachedSession) {
    console.log('onAuthenticated')
    this.appSession.cached = cachedSession
    this.appSession.isAuthenticated = true
    this.appSession.isLoaded = true
  }

  private logout() {
    this.logoutConfirmationModal = false
    this.appSession.isAuthenticated = false
    this.appSession.cached = new KieraCachedSession({})
    this.$router.push({ name: 'logout', path: '/logout' })
  }
}
</script>
