<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12" :loading="isLoading">
        <v-toolbar dark flat>
          <v-toolbar-title
            >Login for
            <u
              >Kiera <span style="color: black;">+</span> ChastiKey</u
            ></v-toolbar-title
          >
          <v-spacer />

          <v-btn icon large target="_blank" @click="helpState = !helpState">
            <v-icon>mdi-help-box</v-icon>
          </v-btn>
        </v-toolbar>
        <!-- Help -->
        <v-card-text v-if="helpState">
          <span
            >If you're unsure about this login try typing
            <code>!ck ext session</code> On a Kiera enabled server.</span
          >
        </v-card-text>
        <!-- Login form -->
        <v-card-text>
          <v-form>
            <v-text-field
              label="Login Token"
              name="token"
              prepend-icon="mdi-textbox-password"
              type="password"
              v-model="sessionInput"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="authTest" :loading="isLoading"
            >Login</v-btn
          >
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
import { auth } from '@/api/auth'

// Utils
import { setSessionHeaders } from '../utils/session'

@Component({})
export default class Login extends Vue {
  private helpState = false
  private sessionInput = ''
  private errorToast = false
  private isLoading = false

  private mounted() {
    if (this.$route.params.session !== undefined) {
      // Populate session from URI
      this.sessionInput = this.$route.params.session
      // Submit form automatically
      this.authTest()
    }
  }

  private async authTest() {
    this.isLoading = true
    const res = await auth(this.sessionInput)

    // On: Successful Auth
    if (res) {
      setSessionHeaders(res.username, res.session)
      this.$emit('onAuthenticated')
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
