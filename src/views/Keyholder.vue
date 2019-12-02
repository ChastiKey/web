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

      <!-- Data from Kiera -->
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="12" md="4" lg="4">
            <!-- Stats -->
            <v-card>
              <v-overlay :absolute="true" :value="isLoading"
                ><v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular
              ></v-overlay>

              <v-sheet class="v-sheet--offset mx-auto title text-center stats-title" color="indigo" elevation="6" dark>
                Lockees
              </v-sheet>

              <v-card-text>
                <div class="headline text-center">
                  <span>{{ data.keyholder.noOfLocksManagingNow || 0 }}</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>
                  mdi-lock
                </v-icon>
                <span class="caption grey--text font-weight-light"># of currently locked lockees</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-card>
              <v-overlay :absolute="true" :value="isLoading"
                ><v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular
              ></v-overlay>

              <v-sheet class="v-sheet--offset mx-auto title text-center stats-title" color="indigo" elevation="6" dark>
                Total Locks Managed
              </v-sheet>

              <v-card-text>
                <div class="headline text-center">
                  <span>{{ data.keyholder.totalLocksManaged || 0 }}</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>
                  mdi-pound
                </v-icon>
                <span class="caption grey--text font-weight-light"># of locks loaded to date</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <v-card>
              <v-overlay :absolute="true" :value="isLoading"
                ><v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular
              ></v-overlay>

              <v-sheet class="v-sheet--offset mx-auto title text-center stats-title" color="indigo" elevation="6" dark>
                Average Rating
              </v-sheet>

              <v-card-text>
                <div class="headline text-center">
                  <span>{{ data.keyholder.averageRating || 0.0 }}</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>
                  mdi-information-outline
                </v-icon>
                <span class="caption grey--text font-weight-light">Rating given by past lockees</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-divider class="my-3"></v-divider>

      <!-- Data from Kiera -->
      <v-container>
        <KeyholderViewRunningLocks v-if="data.locks.length > 0" :locks="data.runningLocks"></KeyholderViewRunningLocks>

        <!-- Locks List -->
        <!-- <v-expansion-panels v-if="!isLoading">
          <KeyholderListLock v-for="lock in data.locks" :key="lock.name" :lock="lock" />
        </v-expansion-panels> -->

        <!-- No Locks to display message -->
        <v-row align="center" justify="center" style="height: 300px;" v-if="!isLoading && data.locks.length === 0">
          <span class="headline"><u>0</u> Active locks/lockees to show!</span>
        </v-row>
        <v-row align="center" justify="center" v-if="!isLoading && data.locks.length === 0">
          <router-link to="/">Return to home</router-link>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// API
import { KeyholderAPI } from '@/api/keyholder'

// Components
import KeyholderListLock from '@/components/KeyholderListLock.vue'
import KeyholderViewRunningLocks from '@/components/KeyholderViewRunningLocks.vue'

// Defaults
import { $KeyholderView } from '@/defaults/keyholder'

// Objects
import { KeyholderLock } from '@/objects/lock'
import { ChastiKeyKeyholder } from '../objects/keyholder'

@Component({
  components: {
    KeyholderListLock,
    KeyholderViewRunningLocks
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
    const res = await KeyholderAPI.fetchRunningLocks()

    if (res) {
      // Keyholder stats
      this.data.keyholder = new ChastiKeyKeyholder(res.keyholder)

      // Sorted by Lock Data
      this.data.locks = res.locks.map((l: KeyholderLock) => new KeyholderLock(l))

      // Reset All Locks
      this.data.runningLocks = []
      // Pull locks from their lock sub array
      this.data.locks.forEach(l => l.running.forEach(rl => this.data.runningLocks.push(rl)))
    }

    this.isLoading = false
  }
}
</script>

<style lang="less" scoped>
.stats-title {
  font-weight: 300;
  border-radius: 4px 4px 0 0;
}
</style>
