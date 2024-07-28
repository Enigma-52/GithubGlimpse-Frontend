import React, { useState } from 'react';
import axios from 'axios';

const Modal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = e.target.repoUrl.value;
    try {
      const response = await axios.post('https://us-central1-githubglimpse.cloudfunctions.net/appFunction/add-repo', { url });
      setMessage(response.data.message || 'Repository added successfully!');
      setTimeout(() => {
        setMessage('');
        window.location.reload();
      }, 3000);
    } catch (error) {
      setMessage('Failed to add repository. Please check the URL or try again later.');
    } finally {
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 2000); // Auto close the modal after 3 seconds
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300"
        >
          &times;
        </button>
        <h2 className="text-2xl mb-4">Add Your Project</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            name="repoUrl"
            placeholder="https://github.com/username/repository"
            className="w-full p-2 mb-4 text-black rounded"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Submit
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Modal;
