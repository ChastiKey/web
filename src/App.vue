<template>
  <v-app v-if="appSession.isLoaded">
    <!-- Header -->
    <v-app-bar app color="blue darken-2" dark>
      <v-col cols="2">
        <!-- Logo -->
        <router-link to="/" style="text-decoration: none; color: #fff;">
          <span v-if="$vuetify.breakpoint.smAndUp" style="font-size: 18px;"
            >Kiera <span style="color: black;">+</span> ChastiKey</span
          >
          <span v-else style="font-size: 14px;">Kiera<span style="color: black;">+</span> ChastiKey</span>
        </router-link></v-col
      >

      <v-col cols="8">
        <v-autocomplete
          v-model="search.model"
          :loading="search.loading"
          :items="search.items"
          :search-input.sync="search.sync"
          class="mx-4"
          clearable
          hide-details
          hide-selected
          item-text="name"
          item-value="symbol"
          label="Search"
          solo-inverted
          return-object
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                Search for Lockees & Keyholders
              </v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:selection="{ attr, on, item }">
            <v-icon left>mdi-person</v-icon>
            <span v-text="item.type"></span>:
            <strong><span style="padding-left: 5px;" v-text="item.name"></span></strong>
          </template>
          <template v-slot:item="{ item }">
            <v-list-item-avatar color="indigo" class="headline font-weight-light white--text">
              {{ item.name.charAt(0) }}
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="item.type"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-person</v-icon>
            </v-list-item-action>
          </template>
        </v-autocomplete>
      </v-col>

      <!-- Content to the right -->
      <!-- Account text -->
      <v-col cols="2">
        <div class="text-right">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <!-- Show account name + dropdown when authenticated -->
              <v-btn text dark v-on="on" v-show="appSession.isAuthenticated">
                <v-icon size="24px">mdi-account-circle-outline</v-icon>
                <span v-if="$vuetify.breakpoint.mdAndUp">{{ appSession.cached.username }}</span>
              </v-btn>
              <!-- Show login button when not -->
              <router-link to="/login" style="text-decoration: none;" v-show="!appSession.isAuthenticated">
                <v-btn text dark v-on="on">
                  <v-icon size="20px">mdi-account-circle-outline</v-icon>
                  <span v-if="$vuetify.breakpoint.mdAndUp" class="ml-2">Login</span>
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
      </v-col>
    </v-app-bar>

    <!-- Main Content -->
    <v-content>
      <v-container
        :class="$route.name === 'login' || $route.name === 'home' || $route.name === 'search' ? 'fill-height' : ''"
        :fluid="$route.name === 'login' || $route.name === 'home' || $route.name === 'search' ? true : false"
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
                <v-icon size="24px">mdi-github</v-icon>
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
import { Component, Prop, Watch } from 'vue-property-decorator'
const { version } = require('../package.json')

// API
import { validateAuth } from '@/api/auth'
import { fetchAutoCompleteItems } from '@/api/search'

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

  @Prop({
    default: () => {
      return {
        loading: false,
        model: null as any,
        sync: null as any,
        items: [] as Array<{ type: string; name: string }>
      }
    }
  })
  private search!: {
    loading: boolean
    model: string
    sync: string
    items: Array<{ type: string; name: string }>
    visible: boolean
  }

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

  @Watch('search.sync', { deep: true })
  private async querySelections(v: string) {
    if (!v) return // Likely null
    if (v.length > 2) {
      console.log('querySelections:', v)
      this.search.loading = true
      // Simulated ajax query
      this.search.items = (await fetchAutoCompleteItems(v)) || ([] as any)

      console.log('querySelections final =>', this.search.items)
    }
    this.search.loading = false
  }

  @Watch('search.model', { deep: true })
  private async watchingModel(v: { type: string; name: string; isVerified?: boolean }) {
    console.log('watchingModel:', v)
    if (v.type === 'User') this.$router.push({ path: `/user/${v.name}` })
    if (v.type === 'Lock') this.$router.push({ path: `/lock/${v.name}` })
    // Clear search
  }
}
</script>
