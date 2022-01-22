import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listBlogs } from './graphql/queries';
import { createBlog as CreateBlog, deleteBlog } from './graphql/mutations';

const initialFormState = { name: '' }

function App() {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    const apiData = await API.graphql({ query: listBlogs });
    setBlogs(apiData.data.listBlogs.items);
  }

  async function createBlog() {
    console.log("create")
    if (!formData.name) return;
    await API.graphql({ query: CreateBlog, variables: { input: formData } });
    setBlogs([ ...blogs, formData ]);
    setFormData(initialFormState);
  }

  async function deleteBlog({ id }) {
    const newNotesArray = blogs.filter(note => note.id !== id);
    setBlogs(newNotesArray);
    await API.graphql({ query: deleteBlog, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>My Notes App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      {/* <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      /> */}
      <button onClick={createBlog}>Create blog</button>
      <div style={{marginBottom: 30}}>
        {
          blogs.map(blog => (
            <div key={blog.id || blog.name}>
              <h2>{blog.name}</h2>
              <button onClick={() => deleteBlog(blog)}>Delete blog</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default App;