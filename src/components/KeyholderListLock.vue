<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <!-- Left side -->
      <span :style="lock.name === '' ? 'color: #aaa;' : ''"
        >{{ lock.name }}
        <!-- When a Lock name is not set -->
        <i v-if="lock.name === ''">Name not set</i>
        <!-- Display lock type: Fixed -vs- Variable -->
        <v-chip
          class="ma-1"
          :color="!lock.running[0].fixed ? 'deep-purple accent-4' : 'indigo darken-3'"
          outlined
          small
        >
          <span v-if="!lock.running[0].fixed">Variable</span>
          <span v-else>Fixed</span>
        </v-chip>
        <!-- Display lock type: Cumulative -vs- Non-C -->
        <v-chip class="ma-1" :color="!lock.running[0].cumulative ? 'red accent-4' : 'teal'" outlined small>
          <span v-if="!lock.running[0].cumulative">Non-Cumulative</span>
          <span v-else>Cumulative</span>
        </v-chip>
      </span>

      <!-- Right side -->
      <template v-slot:actions>
        <v-chip small class="ma-2" color="primary" text-color="white">
          {{ calcHRT(lock.avgLockedTime) }}
          <v-icon style="transform: unset !important;" right>mdi-lock-clock</v-icon>
        </v-chip>

        <v-chip small class="ma-2" color="green" text-color="white">
          <v-avatar left class="green darken-4">
            {{ lock.uniqueCount }}
          </v-avatar>
          Active
        </v-chip>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="!lock.running[0].fixed ? tableHeadersVariable : tableHeadersFixed"
          :items="lock.running"
          :search="search"
        >
          <!-- Start of DataTable customizations -->
          <template v-slot:[`item.username`]="{ item }">
            {{ item.username }}
            <v-icon color="green" v-if="item.discordID !== null">mdi-account-check </v-icon>
          </template>

          <template v-slot:[`item.secondsLocked`]="{ item }">
            {{ calcHRT(item.secondsLocked) }}
          </template>

          <template v-slot:[`item.lockProps`]="{ item }">
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
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// Objects
import { RunningLockCached } from '@/objects/lock'
import { VStepperHeader } from 'vuetify/lib'

// Utils
import { calculateHumanTimeDDHHMM } from '@/utils/time'

@Component({})
export default class KeyholderListLock extends Vue {
  @Prop({ default: new RunningLockCached({}) })
  private lock!: typeof RunningLockCached
  private calcHRT = calculateHumanTimeDDHHMM

  private tableHeadersVariable = [
    { text: 'Username', value: 'username' },
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
