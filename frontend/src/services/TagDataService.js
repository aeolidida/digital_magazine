import api from './api';

class PostDataService {
  getAll() {
    return api.get('tags',);
  }

  get(id) {
    return api.get(`tags/${id}`);
  }

  create(data) {
    return api.post("tags", data);
  }

  update(id, data) {
    return api.put(`tags/${id}`, data);
  }

  delete(id) {
    return api.delete(`tags/${id}`);
  }
}

export default new PostDataService();