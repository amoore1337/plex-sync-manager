<template>
  <div class="fill-height home-container">
    <v-sheet class="fill-height side-menu" elevation="5">
      <label>Plex Cache Manager</label>
    </v-sheet>
    <v-container fluid fill-height>
      <v-layout>
        <v-flex xs12>
          <v-sheet elevation="5" class="fill-height chip-container">
            <client-settings></client-settings>
          </v-sheet>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ClientSettings from '@/components/ClientSettings.vue';
import axios from 'axios';

@Component({
  components: {
    ClientSettings,
  },
})
export default class Home extends Vue {
  private clientIp = '';

  private onSubmit() {
    axios.post('/api/test/send', { clientIp: this.clientIp }).then((res: any) => {
      console.log('success!', res);
    });
  }
}
</script>
<style scoped lang="scss">
.home-container {
  display: flex;

  .side-menu {
    width: 15%;
    min-width: 300px;
    padding: 20px;
  }
}

.chip-container {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 675px;
  min-height: 375px;
  padding: 15px;

  form {
    display: flex;
    align-items: baseline;
  }
}
</style>
