<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12" :loading="isLoading">
        <v-toolbar dark flat>
          <v-toolbar-title
            >Login for <u>Kiera <span style="color: black;">+</span> ChastiKey</u></v-toolbar-title
          >
          <v-spacer />

          <v-btn icon large target="_blank" @click="helpState = !helpState">
            <v-icon>mdi-help-box</v-icon>
          </v-btn>
        </v-toolbar>
        <!-- Help -->
        <v-card-text v-if="helpState">
          <span>If you're unsure about this login try typing <code>!ck web</code> On a Kiera enabled server.</span>
        </v-card-text>
        <!-- Login form -->
        <v-card-text>
          <v-form>
            <v-text-field
              label="Login Token"
              name="token"
              prepend-icon="mdi-textbox-password"
              type="password"
              v-model="otlInput"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="login" :loading="isLoading">Login</v-btn>
        </v-card-actions>
      </v-card>

      <v-snackbar v-model="errorToast" color="red" :timeout="8000">
        Authentication Failure!
        <v-btn color="white" text @click="errorToast = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// API
import { otl } from '@/api/auth'

// Utils
import { setSessionHeaders } from '../utils/session'
import { KieraCachedSession } from '../objects/session'
import { $DefaultSession } from '../defaults/session'

@Component({})
export default class LoginView extends Vue {
  @Prop({ default: () => $DefaultSession })
  private appSession!: typeof $DefaultSession

  private helpState = false
  private otlInput = ''
  private errorToast = false
  private isLoading = false

  private mounted() {
    console.log('testing!!', this.$route.name)
    if (this.$route.params.otl !== undefined) {
      console.log('otl found in url')
      // Populate otl from URI
      this.otlInput = this.$route.params.otl
      // Submit form automatically
      this.login()
    }
  }

  private async login() {
    this.isLoading = true
    const res = await otl(this.otlInput)

    // On: Successful Auth
    if (res) {
      setSessionHeaders(res.username, res.userID, res.session)
      this.appSession.cached = {
        userID: res.userID,
        username: res.username,
        session: res.session
      }

      this.appSession.isAuthenticated = true
      this.appSession.isLoaded = true

      this.$router.push({ name: 'home', path: '/' })
    }
    // On: Failed Auth
    else {
      this.errorToast = true
      this.isLoading = false
    }
  }
}
</script>
