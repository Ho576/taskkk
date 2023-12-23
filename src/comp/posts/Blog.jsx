import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';


const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [validationError, setValidationError] = useState('');

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPosts(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [posts]);

  const handleClose = () => {
    setShowModal(false);
    setEditingPost(null);
    setTitle('');
    setContent('');
    setValidationError('');
  };

  const handleShow = () => setShowModal(true);

  const validateTitle = () => {
    // Check if the title is null or undefined
    if (!title) {
      setValidationError('Title cannot be null.');
      return false;
    }

    // Check for special characters
    const specialChars = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    if (specialChars.test(title)) {
      setValidationError('Invalid title. Ensure it does not contain special characters.');
      return false;
    }

    // Check for uniqueness
    const isUnique = !posts.some((post) => post.title === title && post.id !== editingPost?.id);
    if (!isUnique) {
      setValidationError('Title must be unique.');
      return false;
    }

    // Reset validation error if all checks pass
    setValidationError('');
    return true;
  };

  const handleSave = async () => {
    try {
      // Validate title
      if (!validateTitle()) {
        return;
      }

      // Rest of the handleSave function remains unchanged
      if (editingPost) {
        // Edit post
        const ref = doc(db, 'posts', editingPost.id);
        await updateDoc(ref, {
          title,
          content,
        });
      } else {
        // Add new post
        await addDoc(collection(db, 'posts'), {
          title,
          content,
        });
      }

      handleClose();
    } catch (error) {
      console.log('Error saving post:', error.message);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    handleShow();
  };

  const handleDelete = async (postId) => {
    try {
      const ref = doc(db, 'posts', postId);
      await deleteDoc(ref);
    } catch (error) {
      console.log('Error deleting post:', error.message);
    }
  };

  return (
    <div>
      <h1>Blog Posts</h1>

      <button className="btn btn-primary" onClick={handleShow}>
        Add Post
      </button>

      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td style={{ maxWidth: '150px', wordWrap: 'break-word' }}>{post.content}</td>
              <td>
                <button
                  className="btn btn-info"
                  onClick={() => handleEdit(post)}
                >
                  Edit
                </button>{' '}
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="modal" tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingPost ? 'Edit Post' : 'Add Post'}</h5>
              <button type="button" className="close" onClick={handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="formTitle">Title</label>
                  <input
                    type="text"
                    className={`form-control ${validationError ? 'is-invalid' : ''}`}
                    id="formTitle"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {validationError && <div className="invalid-feedback">{validationError}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="formContent">Content</label>
                  <textarea
                    className="form-control"
                    id="formContent"
                    style={{  wordWrap: 'break-word' }}
                    rows={3}
                    placeholder="Enter content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
