import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const ValidationMessage = ({ message }) => (
  <div className="invalid-feedback">{message}</div>
);

const Course = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imgSrc: '',
  });
  const [editingPost, setEditingPost] = useState(null);
  const [validationError, setValidationError] = useState('');

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'test'));
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
    setFormData({ title: '', content: '', imgSrc: '' });
    setValidationError('');
  };

  const handleShow = () => setShowModal(true);

  const validateTitle = () => {
    const { title } = formData;
    const specialChars = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    const isUnique = !posts.some((post) => post.title === title && post.id !== editingPost?.id);
    return title && !specialChars.test(title) && isUnique;
  };

  const handleSave = async () => {
    try {
      setValidationError('');

      // Validate title
      if (!validateTitle()) {
        setValidationError('Invalid title. Ensure it is unique and does not contain special characters.');
        return;
      }

      const { title, content, imgSrc } = formData;

      if (editingPost) {
        // Edit post
        const ref = doc(db, 'test', editingPost.id);
        await updateDoc(ref, { title, content, imgSrc }); 
      } else {
        // Add new post
        await addDoc(collection(db, 'test'), { title, content, imgSrc });
      }

      handleClose();
    } catch (error) {
      console.log('Error saving post:', error.message);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({ title: post.title, content: post.content, imgSrc: post.imgSrc || '' });
    handleShow();
  };

  const handleDelete = async (postId) => {
    try {
      const ref = doc(db, 'test', postId);
      await deleteDoc(ref);
    } catch (error) {
      console.log('Error deleting post:', error.message);
    }
  };

  return (
    <div>
      <h1>Courses</h1>

      <button className="btn btn-primary" onClick={handleShow}>
        Add Course
      </button>

      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td style={{ maxWidth: '180px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                {post.content}
              </td>
              <td>
                {post.imgSrc && (
                  <img
                    src={post.imgSrc}
                    alt={`Image for ${post.title}`}
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                )}
              </td>
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
              <h5 className="modal-title">Title</h5>
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
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

export default Course;
