<template>
  <v-row>
    <v-col cols="12">
      <!-- Toolbar -->
      <v-toolbar dense>
        <v-toolbar-title>As Keyholder</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon :loading="isLoading" @click="refreshLocksFromKiera">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Loading Panel -->
      <v-container style="height: 400px;" v-if="isLoading">
        <v-row class="fill-height" align-content="center" justify="center">
          <v-col class="subtitle-1 text-center" cols="12"> Getting your <u>active</u> locks </v-col>
          <v-col cols="6">
            <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>

      <!-- Locks List -->
      <v-expansion-panels v-if="!isLoading">
        <KHListLock v-for="lock in data.locks" :key="lock.name" :lock="lock" />
      </v-expansion-panels>

      <!-- No Locks to display message -->
      <v-row align="center" justify="center" style="height: 300px;" v-if="!isLoading && data.locks.length === 0">
        <span class="headline"><u>0</u> Active locks/lockees to show!</span>
      </v-row>
      <v-row align="center" justify="center" v-if="!isLoading && data.locks.length === 0">
        <router-link to="/">Return to home</router-link>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// API
import { fetchRunningLocks } from '@/api/keyholder'

// Components
import KHListLock from '@/components/KHListLock.vue'

// Defaults
import { $KeyholderView } from '@/defaults/keyholder'

// Objects
import { KeyholderLock } from '@/objects/lock'

@Component({
  components: {
    KHListLock
  }
})
export default class KeyholderView extends Vue {
  @Prop({ default: () => $KeyholderView })
  private data!: typeof $KeyholderView
  private isLoading = false

  private async mounted() {
    this.refreshLocksFromKiera()
  }

  private async refreshLocksFromKiera() {
    this.isLoading = true
    const res = await fetchRunningLocks()

    if (res) this.data.locks = res.locks.map((l: KeyholderLock) => new KeyholderLock(l))

    this.isLoading = false
  }
}
</script>
