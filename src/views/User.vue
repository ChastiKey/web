<template>
  <v-content>
    <v-card class="mx-auto user" max-width="434" tile :loading="isLoadingKiera">
      <v-row class="fill-height text-center pt-5">
        <v-col align-self="start" class="pa-0" cols="12">
          <v-avatar class="profile" color="grey" size="124" tile>
            <v-img v-if="user.data.discordID" :src="avatarURL()"></v-img>
          </v-avatar>
        </v-col>
        <v-col class="py-0">
          <v-list-item color="rgba(0, 0, 0)">
            <v-list-item-content>
              <v-list-item-title class="title"
                >{{ user.data.username }}
                <v-tooltip bottom v-if="user.discord.id">
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-check-circle</v-icon>
                  </template>
                  <span>Connected Discord account to ChastiKey</span>
                </v-tooltip></v-list-item-title
              >
              <v-list-item-subtitle>{{ user.data.mainRole }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-divider class="mx-4"></v-divider>
      <v-row class="mx-2 fill-height text-center" v-if="user.data.cumulativeSecondsLocked > 0">
        <span class="stats-section-header">As Lockee</span>
        <v-col cols="4" class="stats">
          <span class="header"># Completed</span>
          <span class="stat">{{ user.data.totalNoOfCompletedLocks }}</span>
        </v-col>
        <v-col cols="4" class="stats">
          <span class="header">Time Locked</span>
          <span class="stat">{{ calcHRTYMD(user.data.cumulativeSecondsLocked) }}</span>
        </v-col>
        <v-col cols="4" class="stats">
          <span class="header">Avg Rating</span>
          <span class="stat" v-if="user.data.noOfLockeeRatings >= 5">{{ user.data.averageLockeeRating }}</span>
          <span class="stat" v-else>n/a</span>
        </v-col>
      </v-row>
      <v-row
        class="mx-2 fill-height text-center"
        v-if="user.data.totalLocksManaged > 0 || user.data.noOfLocksManagingNow > 0"
      >
        <span class="stats-section-header">As Keyholder</span>
        <v-col cols="4" class="stats">
          <span class="header"># Managed</span>
          <span class="stat">{{ user.data.totalLocksManaged }}</span>
        </v-col>
        <v-col cols="4" class="stats">
          <span class="header">Locked Lockees</span>
          <span class="stat">{{ user.data.noOfLocksManagingNow }}</span>
        </v-col>
        <v-col cols="4" class="stats">
          <span class="header">Avg Rating</span>
          <span class="stat" v-if="user.data.noOfKeyholderRatings >= 5">{{ user.data.averageKeyholderRating }}</span>
          <span class="stat" v-else>n/a</span>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="mx-auto mt-4" max-width="434" tile>
      <v-list-item v-for="(lock, i) in user.sharedLocks" :key="i" dense>
        <v-row dense>
          <v-col cols="10">
            <v-list-item-content>
              <v-list-item-title class="title"
                ><span class="shared-lock-title">Shared Lock:</span>
                {{ lock.lockName ? lock.lockName : String(`~ Unnamed Lock ~`) }}</v-list-item-title
              >
              <v-list-item-subtitle>{{ lock.fixed === 1 ? 'Fixed Lock' : 'Variable Lock' }} </v-list-item-subtitle>
            </v-list-item-content>
          </v-col>
          <v-col cols="2">
            <v-btn
              @click="
                focusLock(lock.sharedLockID)
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

    <v-card class="mx-auto mt-4" max-width="434" tile>
      <LockeeViewRunningLock v-for="(lock, i) in user.runningLocks" :key="i" :lock="lock" />
    </v-card>

    <!-- Shared Lock Modal -->
    <v-dialog v-model="sharedLockModal" max-width="600">
      <LockInformation :lock="user.focusedSharedLock" />
    </v-dialog>

    <!-- User info not found error -->
    <v-dialog v-model="loadingError" max-width="350">
      <v-card>
        <v-card-title class="headline">Could not find account!</v-card-title>

        <v-card-text>
          If the user recently changed their username or are a new user you'll need to wait up to 15 minutes.
          <br /><br />
          If the stats are set to private in the ChastiKey app that will also prevent anything from loading here.
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
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

// API
import { UserAPI } from '@/api/user'

// Components
import LockInformation from '@/components/LockInformation.vue'
import LockeeViewRunningLock from '@/components/LockeeViewRunningLock.vue'

// Defaults
import { $DefaultUser } from '../defaults/user'

// Utils
import {
  calculateHumanTimeDDHHMM,
  calculateHumanTimeYearsMonthsDays,
  calculateHumanTimeYearsMonthsDaysHoursFromMins
} from '../utils/time'

@Component({
  components: {
    LockInformation,
    LockeeViewRunningLock
  }
})
export default class UserView extends Vue {
  // https://cdn.discordapp.com/avatars/${stats.userID}/${stats.avatar}

  @Prop({ default: () => $DefaultUser })
  private user!: typeof $DefaultUser
  private isLoadingKiera = false
  private loadingError = false
  private sharedLockModal = false

  private calcHRT = calculateHumanTimeDDHHMM
  private calcHRTYMD = calculateHumanTimeYearsMonthsDays
  private calcHRTYMDH = calculateHumanTimeYearsMonthsDaysHoursFromMins

  private async mounted() {
    await this.fetch()
  }

  @Watch('$route', { deep: true })
  private navChange() {
    if (this.user.data.username !== this.$route.params.username) {
      this.fetch()
    }
  }

  private async fetch() {
    this.isLoadingKiera = true
    const res = await UserAPI.fetchUser(this.$route.params.username)

    if (res) {
      this.loadingError = false
      this.user.data = res.user
      this.user.discord = res.discord
      this.user.sharedLocks = res.sharedLocks
      this.user.runningLocks = res.runningLocks
    } else {
      this.loadingError = true
    }

    this.isLoadingKiera = false
  }

  private avatarURL() {
    return this.user.data.discordID
      ? `https://cdn.discordapp.com/avatars/${this.user.data.discordID}/${this.user.discord.avatar}`
      : ''
  }

  private focusLock(sharedLockID: string) {
    this.user.focusedSharedLock = this.user.sharedLocks.find(l => l.sharedLockID === sharedLockID)
  }

  private cardImgURL(card: string) {
    return require(`@/assets/chastikey/${card}.png`)
  }
}
</script>

<style lang="less" scoped>
.user {
  .stats-section-header {
    position: relative;
    display: block;
    width: 100%;
    font-size: 14px;
    font-weight: 300;
    padding: 15px 5px 0px 5px;
    font-size: 12px;
    &::after {
      content: '';
      position: absolute;
      bottom: 0px;
      width: 33%;
      left: 33%;
      height: 1px;
      background-color: #e5e5e5;
    }
  }
  .stats {
    text-align: center;
    .header {
      text-align: center;
      font-weight: 400;
      font-size: 13px;
      display: block;
    }
    .stat {
      display: block;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.shared-lock-title {
  font-weight: 300 !important;
}
</style>
