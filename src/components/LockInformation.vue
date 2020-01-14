<template>
  <v-card class="mx-auto pt-4">
    <v-card-text>
      <div>Shared Lock</div>
      <div class="display-1 text--primary">
        {{ lock.lockName ? lock.lockName : String(`~ Unnamed Lock ~`) }}
      </div>
      <div class="text--primary pt-2">
        <!-- Lock Type -->
        {{ lock.fixed === 1 ? 'Fixed Lock' : 'Variable Lock' }}<br />
        <!-- Req App Ver -->
        ChastiKey App Version <kbd>{{ lock.minVersionRequired }}</kbd> or higher required!<br /><br />
        <!-- DM Required -->
        <span v-if="lock.requireDM" class="deep-purple--text">Message Keyholder Before Loading<br /></span>
        <!-- Force Trust -->
        <span v-if="lock.forceTrust" class="red--text">Keyholder Limitations Removed<br /></span>
        <!-- [Variable] Keys Disabled -->
        <span v-if="lock.keyDisabled === 1">Emergency Keys are Disabled!<br /></span>
        <!-- [Variable] Draw Frequency -->
        <span v-if="lock.fixed === 0 && lock.cumulative === 0"
          >Chance Every
          <u
            ><kbd>{{ lock.regularity }}hrs</kbd></u
          >
          (Non-Cumulative)<br
        /></span>
        <span v-if="lock.fixed === 0 && lock.cumulative === 1"
          >Chance Every <u>{{ lock.regularity }}hrs</u> (Cumulative)<br
        /></span>
        <!-- Info Hidden -->
        <span v-if="lock.cardInfoHidden">Card Info Hidden<br /></span>
        <span v-if="lock.timerHidden">Timer Hidden<br /></span>
        <!-- [Variable] Card Spreads -->
        <span v-if="lock.fixed === 0 && lock.cardInfoHidden === 0"
          ><br />Cards in Deck<br />
          <div class="pa-1">
            <!-- Card: Green -->
            <div class="card-ranges">
              <!-- Card Img: Green -->
              <v-img :src="cardImgURL('Green')" width="20px" />
              <!-- Card Range: Green -->
              <span class="counts"
                ><kbd>{{ lock.minGreens }}-{{ lock.maxGreens }}</kbd></span
              >
              <br />
            </div>
            <!-- Card: Red -->
            <div class="card-ranges">
              <!-- Card Img: Red -->
              <v-img :src="cardImgURL('Red')" width="20px" />
              <!-- Card Range: Red -->
              <span class="counts"
                ><kbd>{{ lock.minReds }}-{{ lock.maxReds }}</kbd></span
              ><br />
            </div>
            <!-- Card: YellowRandom -->
            <div class="card-ranges">
              <!-- Card Img: YellowRandom -->
              <v-img :src="cardImgURL('YellowRandom')" width="20px" />
              <!-- Card Range: YellowRandom -->
              <span class="counts"
                ><kbd>{{ lock.minYellows }}-{{ lock.maxYellows }}</kbd></span
              ><br />
            </div>
            <!-- Card: YellowAdd -->
            <div class="card-ranges yellows">
              <!-- Card Img: YellowAdd -->
              <v-img :src="cardImgURL('YellowAdd1')" width="20px" />
              <v-img :src="cardImgURL('YellowAdd2')" width="20px" />
              <v-img :src="cardImgURL('YellowAdd3')" width="20px" />
              <!-- Card Range: YellowAdd -->
              <span class="counts"
                ><kbd>{{ lock.minYellowsAdd }}-{{ lock.maxYellowsAdd }}</kbd></span
              ><br />
            </div>
            <!-- Card: YellowMinus -->
            <div class="card-ranges yellows">
              <!-- Card Img: YellowMinus -->
              <v-img :src="cardImgURL('YellowMinus1')" width="20px" />
              <v-img :src="cardImgURL('YellowMinus2')" width="20px" />
              <!-- Card Range: YellowMinus -->
              <span class="counts"
                ><kbd>{{ lock.minYellowsMinus }}-{{ lock.maxYellowsMinus }}</kbd></span
              ><br />
            </div>
            <!-- Card: Freeze -->
            <div class="card-ranges">
              <!-- Card Img: Freeze -->
              <v-img :src="cardImgURL('Freeze')" width="20px" />
              <!-- Card Range: Freeze -->
              <span class="counts"
                ><kbd>{{ lock.minYellows }}-{{ lock.maxYellows }}</kbd> </span
              ><br />
            </div>
            <!-- Card: DoubleUp -->
            <div class="card-ranges">
              <!-- Card Img: DoubleUp -->
              <v-img :src="cardImgURL('DoubleUp')" width="20px" />
              <!-- Card Range: DoubleUp -->
              <span class="counts"
                ><kbd>{{ lock.minYellows }}-{{ lock.maxYellows }}</kbd> </span
              ><br />
            </div>
            <!-- Card: Reset -->
            <div class="card-ranges">
              <!-- Card Img: Reset -->
              <v-img :src="cardImgURL('Reset')" width="20px" />
              <!-- Card Range: Reset -->
              <span class="counts"
                ><kbd>{{ lock.minYellows }}-{{ lock.maxYellows }}</kbd> </span
              ><br />
            </div>
          </div>
        </span>
        <!-- Simulation Times -->
        <span v-if="lock.simulationBestCaseMinutesLocked > 0"
          >Best Case <kbd>{{ calcHRTYMDH(lock.simulationBestCaseMinutesLocked) }}</kbd
          ><br
        /></span>
        <span v-if="lock.simulationAverageMinutesLocked > 0"
          >Average <kbd>{{ calcHRTYMDH(lock.simulationAverageMinutesLocked) }}</kbd
          ><br
        /></span>
        <span v-if="lock.simulationWorstCaseMinutesLocked > 0"
          >Worst Case <kbd>{{ calcHRTYMDH(lock.simulationWorstCaseMinutesLocked) }}</kbd
          ><br
        /></span>
      </div>
    </v-card-text>
    <v-card-actions>
      <a
        v-if="showMessageOnDiscordButton && lock.requireDM === 1"
        href="https://discordapp.com/invite/7CNpSJe"
        target="_blank"
        style="text-decoration: none;"
      >
        <v-btn text color="deep-purple accent-4">
          Message on Discord
        </v-btn>
      </a>
      <a
        v-if="
          (showViewLockButton && lock.requireDM === 0) || (forceShowViewLockButton && lock.sharedLockURL !== '<hidden>')
        "
        :href="lock.sharedLockURL"
        target="_blank"
        style="text-decoration: none;"
      >
        <v-btn text color="blue">
          View Lock
        </v-btn>
      </a>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { KeyholderDataLock, KeyholderData } from 'chastikey.js/app/objects'

// Utils
import { calculateHumanTimeYearsMonthsDaysHoursFromMins } from '../utils/time'

@Component({})
export default class LockInformation extends Vue {
  @Prop({ default: () => new KeyholderData() })
  private keyholder!: KeyholderData
  @Prop({ default: () => new KeyholderDataLock() })
  private lock!: KeyholderDataLock
  @Prop({ default: true })
  private showMessageOnDiscordButton!: boolean
  @Prop({ default: false })
  private showViewLockButton!: boolean
  @Prop({ default: false })
  private forceShowViewLockButton!: boolean

  private calcHRTYMDH = calculateHumanTimeYearsMonthsDaysHoursFromMins

  private cardImgURL(card: string) {
    return require(`@/assets/chastikey/${card}.png`)
  }
}
</script>

<style lang="less" scoped>
.card-ranges {
  display: inline-block;
  width: 55px;
  max-width: 65px;
  height: 45px;
  text-align: center;
  > .v-image {
    display: inline-block;
  }
  &.yellows {
    width: 100px;
    > .v-image {
      margin-left: 0 !important;
      max-width: 20px !important;
    }
  }
  .counts {
    display: block;
    width: 100%;
  }
}
</style>
