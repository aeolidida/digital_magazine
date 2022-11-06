import api from './api';


class PostDataService {
  getAll() {
    return api.get('posts');
  }

  getFivePopular() {
    return api.get('posts/popular');
  }


  get(id) {
    return api.get(`posts/${id}`,);
  }

  create(data) {
    
    return api.post("posts", data, {headers : {'Content-Type': 'multipart/form-data' }});
  }

  update(id, data) {
    return api.put(`posts/${id}`, data);
  }

  delete(id) {
    return api.delete(`posts/${id}`);
  }
}

export default new PostDataService();