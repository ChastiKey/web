<template>
  <v-list-item three-line>
    <v-list-item-content>
      <div class="overline">
        <!-- Lock type -->
        <v-chip :color="!lock.fixed ? 'deep-purple accent-4' : 'indigo darken-3'" outlined x-small>
          <span v-if="!lock.fixed">Variable</span>
          <span v-else>Fixed</span>
        </v-chip>
        <!-- Lock Name -->
        {{ lock.lockName || '~No lock name~' }}
      </div>

      <!-- Time Locked -->
      <v-list-item-title class="title" style="line-height: 1.1em; padding: 4px;"
        ><span style="font-weight: 300; display: block;">{{ lock.status }}</span>
        {{ calcHRT(lock.totalTimeLocked) }}
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
        <v-chip :color="lock.cardInfoHidden ? 'error' : 'purple'" class="ma-1" label small>
          <v-icon v-if="lock.cardInfoHidden" left>mdi-eye-off</v-icon>
          <v-icon v-else left>eye-outline</v-icon>
          <span v-if="lock.cardInfoHidden"><v-icon left>mdi-eye-off-outline</v-icon> Info Hidden</span>
          <span v-else class="white--text"><v-icon left>mdi-eye</v-icon> Info Visible</span>
        </v-chip>
        <!-- Regularity -->
        <v-chip color="gray" class="ma-1" label small v-if="!lock.fixed">
          <v-icon left>mdi-clock-outline</v-icon>
          <span>{{ formatFrequency(lock.regularity) }}</span>
        </v-chip>
        <!-- Multiple greens required -->
        <v-chip color="success" class="ma-1" label small v-if="lock.multipleGreensRequired">
          <span>Multiple Greens Req</span>
        </v-chip>
      </div>

      <!-- Discard Pile -->
      <div style="margin-top: 5px; padding: 5px;" v-if="lock.fixed === 0">
        <span style="font-weight: 300; display: block; padding: 5px 0;">
          Discarded

          <v-tooltip color="rgba(68, 68, 68, 1)" bottom>
            <template v-slot:activator="{ on }">
              <v-icon style="display: inline-block;" v-on="on" small>mdi-information-outline</v-icon>
            </template>
            <span>
              The last ({{
                lock.discardPile
                  .split(',')
                  .filter(c => !!c)
                  .slice(0, 15).length
              }}) cards discarded
            </span>
          </v-tooltip>
        </span>

        <v-img
          v-for="(card, i) in lock.discardPile
            .split(',')
            .filter(c => !!c)
            .slice(0, 15)"
          :key="i"
          :src="cardImgURL(card)"
          width="18px"
          class="discardCard"
        />
      </div>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// Objects
import { RunningLockCached } from '@/objects/lock'

// Utils
import { calculateHumanTimeDDHHMM, formatFrequency } from '@/utils/time'

@Component({})
export default class LockeeViewRunningLock extends Vue {
  @Prop({ default: () => new RunningLockCached() })
  private lock!: typeof RunningLockCached
  private isLoading = false

  private calcHRT = calculateHumanTimeDDHHMM
  private formatFrequency = formatFrequency

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
