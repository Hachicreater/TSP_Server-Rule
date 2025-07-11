const SHEETS = [
  {
    name: "鯖ルール",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtXCOh9f-t9vujeZ4SND1w1G6riZd8Sw4u4LglOk7-3RmZzVN0M8NXOWvnoEgVSMaoEqTot6ezwx2X/pub?gid=699240754&single=true&output=csv"
  },
  {
    name: "判例説明",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtXCOh9f-t9vujeZ4SND1w1G6riZd8Sw4u4LglOk7-3RmZzVN0M8NXOWvnoEgVSMaoEqTot6ezwx2X/pub?gid=2069126754&single=true&output=csv"
  }
];

let allData = [];

window.onload = async () => {
  const status = document.getElementById("status");
  try {
    for (const sheet of SHEETS) {
      const res = await fetch(sheet.url);
      const text = await res.text();
      const rows = text.trim().split("\n").slice(1); // ヘッダー行除去

      for (const row of rows) {
        const columns = parseCSVRow(row);
        if (!columns[0] && !columns[1] && !columns[2]) continue;
        allData.push({
          sheet: sheet.name,
          管理ID: columns[0] || "",
          タイトル: columns[1] || "",
          内容: columns[2] || ""
        });
      }
    }
    console.log("データ読み込み完了", allData);
    status.textContent = "✅ 検索の準備ができました！";
  } catch (err) {
    console.error("データ読み込みエラー", err);
    status.textContent = "❌ データ読み込みに失敗しました";
  }
};

window.onload = async () => {
  const status = document.getElementById("status");

  try {
    ...
    status.textContent = "✅ 検索の準備ができました！";
  } catch (err) {
    console.error("読み込みエラー", err);
    status.textContent = "❌ データ読み込みに失敗しました";
  }
};


function parseCSVRow(row) {
  const regex = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\",]+)|)(?:,|$)/g;
  const result = [];
  let match;
  while ((match = regex.exec(row)) !== null) {
    result.push((match[1] || match[2] || "").replace(/""/g, '"'));
  }
  return result;
}

function searchData() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const results = document.getElementById("results");
  results.innerHTML = "";

  const filtered = allData.filter(row =>
  row.管理ID.toString().toLowerCase().includes(keyword) ||
  row.タイトル.toString().toLowerCase().includes(keyword) ||
  row.内容.toString().toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    results.innerHTML = "<div class='result'>該当データがありません。</div>";
    return;
  }

  filtered.forEach(row => {
    results.innerHTML += `
      <div class="result">
        <div class="sheet">📄 ${row.sheet}</div>
        <div class="title">${row.タイトル}</div>
        <div class="content">${row.内容}</div>
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
