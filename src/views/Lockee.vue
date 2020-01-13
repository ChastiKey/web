<template>
  <v-row>
    <v-col cols="12">
      <!-- Toolbar -->
      <v-toolbar dense>
        <v-toolbar-title>{{ data.username || data.lockee.username }} <small>As Lockee</small></v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon :loading="isLoadingKiera" @click="fetch">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Data from Kiera -->
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="12" md="3" lg="3">
            <!-- Stats -->
            <v-card>
              <v-overlay :absolute="true" :value="isLoadingKiera"
                ><v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular
              ></v-overlay>

              <v-sheet class="v-sheet--offset title text-center stats-title" color="teal" elevation="6" dark>
                Last Active in App
              </v-sheet>

              <v-card-text>
                <div class="headline text-center">
                  <span v-if="!isLoadingKiera && data.lockee.timestampLastActive">{{
                    calcHRT(Date.now() / 1000 - data.lockee.timestampLastActive)
                  }}</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>
                  mdi-clock-outline
                </v-icon>
                <span class="caption grey--text font-weight-light">Time ChastiKey was last opened</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-card elevation="4">
              <v-overlay :absolute="true" :value="isLoadingKiera"
                ><v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular
              ></v-overlay>

              <v-sheet class="v-sheet--offset title text-center stats-title" color="teal" elevation="6" dark>
                Longest Lock Completed
              </v-sheet>

              <v-sheet color="transparent">
                <v-sparkline
                  :smooth="16"
                  :gradient="['#f72047', '#ffd200', '#1feaea']"
                  :line-width="2"
                  :value="this.data.sparklineData"
                  :padding="16"
                  :auto-draw="data.sparklineAutoDraw"
                  stroke-linecap="round"
                ></v-sparkline>
              </v-sheet>

              <v-card-text>
                <div class="headline text-center">
                  <span v-if="!isLoadingKiera && data.lockee.longestCompletedLockInSeconds">{{
                    calcHRT(data.lockee.longestCompletedLockInSeconds)
                  }}</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>
                  mdi-information-outline
                </v-icon>
                <span class="caption grey--text font-weight-light">Based on length of lock</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="3" lg="3">
            <v-card>
              <v-overlay :absolute="true" :value="isLoadingKiera"
                ><v-progress-circular indeterminate size="64" width="2" color="teal"></v-progress-circular
              ></v-overlay>

              <v-sheet class="v-sheet--offset title text-center stats-title" color="teal" elevation="6" dark>
                Locks Completed
              </v-sheet>

              <v-card-text>
                <div class="headline text-center">
                  <span v-if="!isLoadingKiera">{{ data.lockee.totalNoOfCompletedLocks }}</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small>
                  mdi-pound
                </v-icon>
                <span class="caption grey--text font-weight-light">Of locks that have unlocked</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-divider class="my-3"></v-divider>

      <!-- Locks List -->
      <v-container>
        <div class="title">
          Running Locks
          <v-progress-circular
            v-if="isLoadingKiera"
            indeterminate
            size="16"
            width="2"
            color="teal"
          ></v-progress-circular>
        </div>
        <v-row style="margin-top: 25px;">
          <v-card class="mx-auto" max-width="400px" outlined v-for="(lock, i) in data.runningLocks" :key="i">
            <v-overlay :absolute="true" :value="isLoadingKiera"></v-overlay>

            <LockeeViewRunningLock :lock="lock" />
          </v-card>
        </v-row>
      </v-container>

      <v-divider class="my-3"></v-divider>

      <v-container>
        <div class="title">
          Past Locks
          <v-progress-circular
            v-if="isLoadingKiera"
            indeterminate
            size="16"
            width="2"
            color="teal"
          ></v-progress-circular>
        </div>
        <v-row style="margin-top: 25px;">
          <v-col cols="12">
            <v-card elevation="1">
              <v-card-title>
                <v-text-field
                  v-model="allLocksSearch"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table :headers="tableHeaders" :items="data.allLocks" :search="allLocksSearch">
                <template v-slot:item.timestampLocked="{ item }">
                  {{ new Date(item.timestampLocked * 1000).toLocaleString() }}
                </template>
                <template v-slot:item.timestampUnlocked="{ item }">
                  <span v-if="item.timestampUnlocked !== 0"
                    >{{ new Date(item.timestampUnlocked * 1000).toLocaleString() }}
                  </span>
                  <v-chip v-else class="ma-2" color="gray" label small>
                    Locked
                  </v-chip>
                </template>
                <template v-slot:item.timeLocked="{ item }">
                  {{ calcHRT(item.totalTimeLocked) }}
                </template>
                <template v-slot:item.combination="{ item }">
                  <span v-if="item.timestampUnlocked !== 0">{{ item.combination }}</span>
                  <v-chip v-else color="gray" label small>
                    Locked
                  </v-chip>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>

        <!-- User info not found error -->
        <v-dialog v-model="loadingError" max-width="350">
          <v-card>
            <v-card-title class="headline">Could not find account!</v-card-title>

            <v-card-text>
              If you just recently changed your username or are a new user you'll need to wait up to 15 minutes.
              <br /><br />
              If your stats are set to private in the ChastiKey app that will also prevent anything from loading here.
              <br /><br />
              If this message persists, please contact support via one of the Discord servers:
              <v-row style="text-align: center;">
                <v-col cols="5">
                  <a href="https://discordapp.com/invite/tuyk2k3" target="_blank" style="text-decoration: none;">
                    <v-btn class="white--text" color="purple">
                      Kiera
                    </v-btn>
                  </a></v-col
                >
                <v-col cols="7">
                  <a href="https://discordapp.com/invite/7CNpSJe" target="_blank" style="text-decoration: none;">
                    <v-btn class="white--text" color="teal">
                      ChastiKey
                    </v-btn>
                  </a></v-col
                >
              </v-row>
            </v-card-text>

            <v-card-actions>
              <div class="mx-auto text-center">
                <v-btn color="green darken-1" text :loading="isLoadingKiera" @click="fetch">
                  Retry
                </v-btn>

                <v-btn color="green darken-1" text @click="loadingError = false">
                  Close
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

// API
import { LockeeAPI } from '@/api/lockee'

// Components
import LockeeViewRunningLock from '@/components/LockeeViewRunningLock.vue'

// Defaults
import { $LockeeView } from '@/defaults/lockee'

// Objects
import { RunningLockCached } from '@/objects/lock'

// Utils
import { calculateHumanTimeDDHHMM } from '@/utils/time'
import { $DefaultSession } from '../defaults/session'

@Component({
  components: {
    LockeeViewRunningLock
  }
})
export default class LockeeView extends Vue {
  @Prop({ default: () => $DefaultSession })
  private appSession!: typeof $DefaultSession

  @Prop({ default: () => $LockeeView })
  private data!: typeof $LockeeView
  private isLoadingKiera = false
  private loadingError = false
  private calcHRT = calculateHumanTimeDDHHMM
  private allLocksSearch = ''
  private tableHeaders = [
    { text: 'Lock ID', value: 'lockID' },
    { text: 'Keyholder', value: 'lockedBy' },
    { text: 'Locked', value: 'timestampLocked' },
    { text: 'Unlocked', value: 'timestampUnlocked' },
    { text: 'Time Locked', value: 'timeLocked' },
    { text: 'Combination', value: 'combination' }
  ]

  private async mounted() {
    this.data.username = this.$route.params.username ? this.$route.params.username : ''
    await this.fetch()
  }

  @Watch('$route', { deep: true })
  private navChange() {
    if (this.data.username !== this.$route.params.username) {
      this.data.username = this.$route.params.username
      this.fetch()
    }
  }

  private async fetch() {
    this.isLoadingKiera = true
    const res = await LockeeAPI.fetchRunningLocks(this.data.username || undefined)

    if (res) {
      this.loadingError = false
      this.data.lockee = res.lockee
      this.data.runningLocks = res.runningLocks
      this.data.allLocks = res.allLocks.reverse()
      // Generate sparkline data specific array and ordered ASC
      this.data.sparklineData = this.data.allLocks
        .filter(l => !((l.deleted === 1 && l.status === 'Locked') || l.status === 'UnlockedFake'))
        .map(l => l.totalTimeLocked)
        .reverse()
      this.data.sparklineAutoDraw = true
    } else {
      this.loadingError = true
    }

    this.isLoadingKiera = false
  }

  private cardImgURL(card: string) {
    return require(`@/assets/chastikey/${card}.png`)
  }
}
</script>

<style lang="less" scoped>
.stats-title {
  font-weight: 300;
  border-radius: 4px 4px 0 0;
}
.discardCard {
  display: inline-block;
  margin: 2px;
}
</style>
