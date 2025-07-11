let allData = [];

async function fetchData() {
  const res = await fetch('/.netlify/functions/fetchData');
  allData = await res.json();
  console.log('データ取得完了', allData);
}

function searchData() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const results = document.getElementById('results');
  results.innerHTML = '';

  const filtered = allData.filter(entry =>
    entry.管理ID.toLowerCase().includes(keyword) ||
    entry.タイトル.toLowerCase().includes(keyword) ||
    entry.内容.toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    results.innerHTML = '<div class="result">該当データなし。</div>';
    return;
  }

  filtered.forEach(entry => {
    results.innerHTML += `
      <div class="result">
        <div class="sheet">📄 ${entry.sheet}</div>
        <div class="title">${entry.タイトル}</div>
        <div class="content">${entry.内容}</div>
      </div>
    `;
  });
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById('search-tab').style.display = 'none';
  document.getElementById('intro-tab').style.display = 'none';

  if (tab === 'search') {
    document.querySelector('.tab:nth-child(1)').classList.add('active');
    document.getElementById('search-tab').style.display = 'block';
  } else {
    document.querySelector('.tab:nth-child(2)').classList.add('active');
    document.getElementById('intro-tab').style.display = 'block';
  }
}

window.onload = fetchData;
