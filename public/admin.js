
async function loadAdminPosts() {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  const container = document.getElementById('admin-posts');
  container.innerHTML = '';
  posts.reverse().forEach(p => {
    const div = document.createElement('div');
    div.className = 'bg-white shadow p-4 rounded';
    div.innerHTML = `
      <div class="font-semibold">${p.author}</div>
      <div>${p.content}</div>
      <div class="text-sm text-gray-500">${p.likes} ta layk</div>
      <button onclick="deletePost(${p.id})" class="text-red-500 mt-2">❌ O‘chirish</button>
    `;
    container.appendChild(div);
  });
}

async function deletePost(id) {
  await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  loadAdminPosts();
}

loadAdminPosts();
