<template>
  <v-card class="mx-auto user" max-width="434" tile>
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
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

// API
import { UserAPI } from '@/api/user'

// Defaults
import { $DefaultUser } from '../defaults/user'

// Utils
import { calculateHumanTimeDDHHMM, calculateHumanTimeYearsMonthsDays } from '../utils/time'

@Component({})
export default class UserView extends Vue {
  // https://cdn.discordapp.com/avatars/${stats.userID}/${stats.avatar}

  @Prop({ default: () => $DefaultUser })
  private user!: typeof $DefaultUser
  private isLoadingKiera = false
  private loadingError = false

  private calcHRT = calculateHumanTimeDDHHMM
  private calcHRTYMD = calculateHumanTimeYearsMonthsDays

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
</style>
