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
        <v-row justify="center" dense>
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

      <!-- Shared Locks -->
      <v-container>
        <v-row dense>
          <v-col>
            <div class="title">
              Your Available Locks
              <v-progress-circular
                v-if="isLoading"
                indeterminate
                size="16"
                width="2"
                color="teal"
              ></v-progress-circular>
            </div>
          </v-col>
          <v-col></v-col>
        </v-row>

        <!-- Shared Lock Modal -->
        <v-dialog v-model="sharedLockModal" max-width="600">
          <LockInformation
            :lock="data.focusedSharedLock"
            :showMessageOnDiscordButton="false"
            :showViewLockButton="false"
            :forceShowViewLockButton="true"
          />
        </v-dialog>

        <!-- Lock List -->
        <v-row dense>
          <v-col cols="12" sm="6" md="4" lg="4" xl="4" v-for="(lock, i) in data.locks" :key="i">
            <v-card class="mx-auto" tile>
              <v-list-item dense>
                <v-row dense>
                  <v-col cols="10">
                    <v-list-item-content>
                      <v-list-item-title class="subtitle-1"
                        ><span class="shared-lock-title">Shared Lock:</span>
                        {{ lock.lockName ? lock.lockName : String(`~ Unnamed Lock ~`) }}</v-list-item-title
                      >
                      <v-list-item-subtitle
                        >{{ lock.fixed === 1 ? 'Fixed Lock' : 'Variable Lock' }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      @click="
                        focusLock(lock.lockName)
                        sharedLockModal = true
                      "
                      text
                      small
                      color="primary"
                      class="mt-3"
                      >View</v-btn
                    >
                  </v-col>
                </v-row>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-divider class="my-3"></v-divider>

      <!-- Keyholder's Active Running Locks w/Lockees -->
      <v-container>
        <div class="title">
          Running Locks
          <v-progress-circular v-if="isLoading" indeterminate size="16" width="2" color="teal"></v-progress-circular>
        </div>

        <v-row style="margin-top: 25px;">
          <v-col cols="12">
            <KeyholderViewRunningLocks
              v-if="data.runningLocks.length > 0"
              :runningLocks="data.runningLocks"
            ></KeyholderViewRunningLocks>

            <!-- No Locks to display message -->
            <v-row align="center" justify="center" style="height: 300px;" v-if="!isLoading && data.locks.length === 0">
              <span class="headline"><u>0</u> Active locks/lockees to show!</span>
            </v-row>
            <v-row align="center" justify="center" v-if="!isLoading && data.locks.length === 0">
              <router-link to="/">Return to home</router-link>
            </v-row>
          </v-col>
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
import LockInformation from '@/components/LockInformation.vue'
import KeyholderListLock from '@/components/KeyholderListLock.vue'
import KeyholderViewRunningLocks from '@/components/KeyholderViewRunningLocks.vue'

// Defaults
import { $KeyholderView } from '@/defaults/keyholder'

// Objects
import { KeyholderLock } from '@/objects/lock'
import { ChastiKeyKeyholder } from '../objects/keyholder'

@Component({
  components: {
    LockInformation,
    KeyholderListLock,
    KeyholderViewRunningLocks
  }
})
export default class KeyholderView extends Vue {
  @Prop({ default: () => $KeyholderView })
  private data!: typeof $KeyholderView
  private isLoading = false
  private sharedLockModal = false

  private async mounted() {
    this.refreshLocksFromKiera()
  }

  private async refreshLocksFromKiera() {
    this.isLoading = true
    const res = await KeyholderAPI.fetchRunningLocks()
    console.log(res)

    if (res) {
      // Keyholder stats
      this.data.keyholder = res.keyholder

      // Sorted by Lock Data
      this.data.locks = res.locks

      // Reset All Locks
      this.data.runningLocks = res.runningLocks
    }

    this.isLoading = false
  }

  private focusLock(lockName: string) {
    this.data.focusedSharedLock = this.data.locks.find((l: any) => l.lockName === lockName)
  }
}
</script>

<style lang="less" scoped>
.stats-title {
  font-weight: 300;
  border-radius: 4px 4px 0 0;
}

.shared-lock-title {
  font-weight: 300 !important;
}
</style>
