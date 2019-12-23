<template>
  <div class="client-settings">
    <div class="settings-header">
      <h1>Configured Clients</h1>
      <form @submit.prevent="createClient">
        <v-text-field class="name-input" v-model="clientName" label="Client Name" required></v-text-field>
        <v-btn style="top: -6px" type="submit">Add client</v-btn>
      </form>
    </div>
    <div class="client-list-container">
      <div v-for="client in configuredClients" :key="client.key" class="client-item">
        <h3>{{client.name}}</h3>
        <p><span class="font-weight-bold">Key: </span>{{client.key}}</p>
        <p><span class="font-weight-bold">Secret: </span>{{client.secret}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { clientService, IClient } from '@/services/client.service';

@Component
export default class ClientSettings extends Vue {
  private clientName: string = '';
  private configuredClients: IClient[] = [];

  private async mounted() {
    console.log('Load existing clients')
    this.configuredClients = await clientService.fetchClients();
  }

  private async createClient() {
    const newClient = await clientService.createClient(this.clientName);
    this.configuredClients.push(newClient);
    this.clientName = '';
  }
}
</script>

<style scoped lang="scss">
.client-settings {
  width: 100%;
  height: 100%;

  .settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 450px;
      flex: 1;

      .name-input {
        max-width: 300px;
      }
    }
  }

  .client-list-container {
    width: 100%;
    .client-item {
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }

      p {
        margin-bottom: 0;
      }
    }
  }
}
</style>
