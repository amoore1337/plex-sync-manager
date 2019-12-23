import axios from 'axios';

export interface IClient {
  name: string;
  key: string;
  secret: string;
  created_at?: number;
}

class ClientService {
  public async fetchClients() {
    return axios.get('/api/clients').then((res: any) => res.data as IClient[]);
  }

  public async createClient(name: string) {
    return axios.post('/api/clients', { name }).then((res: any) => res.data as IClient);
  }
}

export const clientService = new ClientService();
