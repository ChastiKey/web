<template>
  <v-row>
    <v-col cols="12">
      <!-- Toolbar -->
      <v-toolbar dense>
        <v-toolbar-title>As Lockee</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon :loading="isLoading" @click="refreshLocksFromKiera">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Loading Panel -->
      <v-container style="height: 400px;" v-if="isLoading">
        <v-row class="fill-height" align-content="center" justify="center">
          <v-col class="subtitle-1 text-center" cols="12">
            Getting your <u>active</u> locks
          </v-col>
          <v-col cols="6">
            <v-progress-linear
              color="deep-purple accent-4"
              indeterminate
              rounded
              height="6"
            ></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>

      <!-- Stats -->
      <v-container v-if="!isLoading">
        <v-row justify="center">
          <v-col xs="12" sm="12" md="4" lg="4" flex>
            <v-card color="#385F73" dark>
              <v-card-text
                class="headline"
                style="text-align: center; font-weight: 100;"
              >
                <span style="font-size: 1.3rem; color: #ccc;"
                  >Last Active in App</span
                >
                <br />
                <span style="font-size: 1.5rem; color: #fff;">{{
                  calcHRT(Date.now() / 1000 - data.user.timestampLastActive)
                }}</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col xs="12" sm="12" md="4" lg="4">
            <v-card color="#385F73" dark>
              <v-card-text
                class="headline"
                style="text-align: center; font-weight: 100;"
              >
                <span style="font-size: 1.3rem; color: #ccc;"
                  >Longest Lock Completed</span
                >
                <br />
                <span style="font-size: 1.5rem; color: #fff;">{{
                  calcHRT(data.lockee.longestCompletedLockInSeconds)
                }}</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col xs="12" sm="12" md="4" lg="4">
            <v-card color="#385F73" dark>
              <v-card-text
                class="headline"
                style="text-align: center; font-weight: 100;"
              >
                <span style="font-size: 1.3rem; color: #ccc;"
                  >Locks Completed</span
                >
                <br />
                <span style="font-size: 1.5rem; color: #fff;">{{
                  data.lockee.totalNoOfCompletedLocks
                }}</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Locks List -->
      <v-container v-if="!isLoading">
        <v-row style="margin-top: 25px;">
          <v-card
            class="mx-auto"
            max-width="400px"
            outlined
            v-for="(lock, i) in data.locks"
            :key="i"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline">
                  <!-- Lock type -->
                  <v-chip
                    :color="
                      !lock.fixed ? 'deep-purple accent-4' : 'indigo darken-3'
                    "
                    outlined
                    x-small
                  >
                    <span v-if="!lock.fixed">Variable</span>
                    <span v-else>Fixed</span>
                  </v-chip>
                  <!-- Lock Name -->
                  {{ lock.sharedLockName || '~No lock name~' }}
                </div>

                <!-- Time Locked -->
                <v-list-item-title
                  class="title"
                  style="line-height: 1.1em; padding: 4px;"
                  ><span style="font-weight: 300; display: block;">Locked</span>
                  {{ calcHRT(lock.secondsLocked) }}
                  <!-- Frozen -->
                  <v-chip
                    color="blue darken-1 white--text"
                    class="ma-1"
                    label
                    small
                    v-if="lock.lockFrozenByKeyholder || lock.lockFrozenByCard"
                  >
                    <v-icon left>mdi-snowflake</v-icon>
                    <span v-if="lock.lockFrozenByKeyholder">Frozen by KH</span>
                    <span v-else>Frozen by Card</span>
                  </v-chip>
                </v-list-item-title>

                <!-- Lock Info -->
                <div style="padding: 2px;">
                  <!-- Keyholder Name -->
                  <v-chip color="indigo white--text" class="ma-1" label small>
                    <v-icon left>mdi-account-lock</v-icon>
                    {{ lock.lockedBy || 'Username hidden' }}
                  </v-chip>
                  <!-- Lock Info Hidden/Shown -->
                  <v-chip
                    :color="lock.cardInfoHidden ? 'error' : 'purple'"
                    class="ma-1"
                    label
                    small
                  >
                    <v-icon v-if="lock.cardInfoHidden" left>mdi-eye-off</v-icon>
                    <v-icon v-else left>eye-outline</v-icon>
                    <span v-if="lock.cardInfoHidden">Info Hidden</span>
                    <span v-else>Info Visible</span>
                  </v-chip>
                  <!-- Regularity -->
                  <v-chip
                    color="gray"
                    class="ma-1"
                    label
                    small
                    v-if="!lock.fixed"
                  >
                    <v-icon left>mdi-clock-outline</v-icon>
                    <span>{{ lock.regularity }}</span>
                    <span v-if="lock.regularity < 1">mins</span>
                    <span v-if="lock.regularity === 1">hr</span>
                    <span v-if="lock.regularity < 24 && lock.regularity > 1"
                      >hrs</span
                    >
                    <span v-if="lock.regularity > 24">days</span>
                  </v-chip>
                  <!-- Multiple greens required -->
                  <v-chip
                    color="success"
                    class="ma-1"
                    label
                    small
                    v-if="lock.multipleGreensRequired"
                  >
                    <span>Multiple Greens Req</span>
                  </v-chip>
                </div>

                <!-- Discard Pile -->
                <div style="margin-top: 5px; padding: 5px;">
                  <span
                    style="font-weight: 300; display: block; padding: 5px 0;"
                    >Discarded

                    <v-tooltip color="rgba(68, 68, 68, 1)" bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon style="display: inline-block;" v-on="on" small
                          >mdi-information-outline</v-icon
                        >
                      </template>
                      <span
                        >The last ({{ lock.discardPile.length }}) cards
                        discarded (not greens):</span
                      >
                    </v-tooltip>
                  </span>

                  <v-img
                    v-for="(card, i) in lock.discardPile"
                    :key="i"
                    :src="cardImgURL(card)"
                    width="18px"
                    class="discardCard"
                  />
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// API
import { fetchRunningLocks } from '@/api/lockee'

// Defaults
import { $LockeeView } from '@/defaults/lockee'

// Objects
import { RunningLockCached } from '@/objects/lock'

// Utils
import { calculateHumanTimeDDHHMM } from '@/utils/time'

@Component({})
export default class LockeeView extends Vue {
  @Prop({ default: () => $LockeeView })
  private data!: typeof $LockeeView
  private isLoading = false
  private calcHRT = calculateHumanTimeDDHHMM

  private async mounted() {
    this.refreshLocksFromKiera()
  }

  private async refreshLocksFromKiera() {
    this.isLoading = true
    const res = await fetchRunningLocks()

    if (res) {
      this.data.user = res.user
      this.data.lockee = res.lockee
      this.data.locks = res.locks.map(
        (l: RunningLockCached) => new RunningLockCached(l)
      )
    }

    this.isLoading = false
  }

  private cardImgURL(card: string) {
    return require(`@/assets/chastikey/${card}.png`)
  }
}
</script>

<style>
.discardCard {
  display: inline-block;
  margin: 2px;
}
</style>
