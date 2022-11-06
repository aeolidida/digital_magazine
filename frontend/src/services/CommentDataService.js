import api from './api';

class CommentDataService {
  getAll() {
    return api.get('comments');
  }

  get(id) {
    return api.get(`comments/${id}`);
  }

  create(data) {
    return api.post("comments", data);
  }

  update(id, data) {
    return api.put(`comments/${id}`, data);
  }

  delete(id) {
    return api.delete(`comments/${id}`);
  }
}

export default new CommentDataService();