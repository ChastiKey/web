<template>
  <v-card>
    <v-card-title>
      <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="tableHeadersVariable"
      :items="locks"
      :search="search"
      :items-per-page="50"
      :footer-props="{
        'items-per-page-options': [10, 25, 50, 75, 100, -1]
      }"
    >
      <!-- Start of DataTable customizations -->
      <template v-slot:item.username="{ item }">
        {{ item.username }}
        <v-icon color="green" v-if="item.discordID !== null">mdi-account-check </v-icon>
      </template>

      <template v-slot:item.sharedLockName="{ item }">
        <!-- Display lock type: Fixed -vs- Variable -->
        <v-chip class="ma-1" :color="!item.fixed ? 'deep-purple accent-4' : 'indigo darken-3'" outlined small>
          <span v-if="!item.fixed">V</span>
          <span v-else>F</span>
        </v-chip>
        <!-- Display lock type: Cumulative -vs- Non-C -->
        <v-chip class="ma-1" :color="!item.cumulative ? 'red accent-4' : 'teal'" outlined small>
          <span v-if="!item.cumulative">NC</span>
          <span v-else>C</span>
        </v-chip>
        {{ item.sharedLockName }}
      </template>

      <template v-slot:item.secondsLocked="{ item }">
        {{ calcHRT(item.secondsLocked) }}
      </template>

      <template v-slot:item.lockProps="{ item }">
        <v-img v-if="item.cardInfoHidden" src="@/assets/chastikey/InfoHidden.png" width="28px" class="lockProps" />
        <v-img
          v-if="item.lockFrozenByKeyholder"
          src="@/assets/chastikey/FrozenLock.png"
          width="28px"
          class="lockProps"
        />
        <v-img v-if="item.lockFrozenByCard" src="@/assets/chastikey/Freeze.png" width="28px" class="lockProps" />
      </template>
      <!-- End of DataTable customizations -->
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// API
import { auth } from '@/api/auth'

// Objects
import { RunningLockCached } from '@/objects/lock'
import { VStepperHeader } from 'vuetify/lib'

// Utils
import { calculateHumanTimeDDHHMM } from '@/utils/time'

@Component({})
export default class KeyholderViewRunningLocks extends Vue {
  @Prop({ default: [] as Array<RunningLockCached> })
  private locks!: Array<RunningLockCached>
  private calcHRT = calculateHumanTimeDDHHMM

  private mounted() {
    console.log(this.locks)
  }

  private tableHeadersVariable = [
    { text: 'Username', value: 'username' },
    { text: 'Lock', value: 'sharedLockName' },
    { text: 'Time Locked', value: 'secondsLocked' },
    { text: '# of Turns', value: 'noOfTurns' },
    {
      text: 'Lock Properties',
      value: 'lockProps',
      align: 'right',
      sortable: false
    }
  ]
  private tableHeadersFixed = [
    { text: 'Username', value: 'username' },
    { text: 'Time Locked', value: 'secondsLocked' },
    {
      text: 'Lock Properties',
      value: 'lockProps',
      align: 'right',
      sortable: false
    }
  ]
  private search = ''
}
</script>

<style>
.lockProps {
  float: right;
  margin-left: 5px;
}
</style>
