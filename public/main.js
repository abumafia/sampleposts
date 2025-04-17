
async function loadPosts() {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  const container = document.getElementById('posts');
  container.innerHTML = '';
  posts.reverse().forEach(p => {
    const div = document.createElement('div');
    div.className = 'bg-white shadow p-4 rounded';
    div.innerHTML = `
      <div class="font-semibold">${p.author}</div>
      <div>${p.content}</div>
      ${p.image ? `<img src="${p.image}" class="mt-2 rounded">` : ''}
      <button onclick="likePost(${p.id})" class="text-blue-500 mt-2">👍 ${p.likes}</button>
    `;
    container.appendChild(div);
  });
}

async function submitPost() {
  const author = document.getElementById('name').value;
  const content = document.getElementById('content').value;
  const image = document.getElementById('image').value;
  await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, content, image })
  });
  loadPosts();
}

async function likePost(id) {
  await fetch(`/api/posts/${id}/like`, { method: 'POST' });
  loadPosts();
}

loadPosts();
