const SHEETS = [
  {
    name: "鯖ルール",
    key: "rule",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtXCOh9f-t9vujeZ4SND1w1G6riZd8Sw4u4LglOk7-3RmZzVN0M8NXOWvnoEgVSMaoEqTot6ezwx2X/pub?gid=699240754&single=true&output=csv"
  },
  {
    name: "判例説明",
    key: "case",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtXCOh9f-t9vujeZ4SND1w1G6riZd8Sw4u4LglOk7-3RmZzVN0M8NXOWvnoEgVSMaoEqTot6ezwx2X/pub?gid=2069126754&single=true&output=csv"
  },
  {
    name: "はじめに",
    key: "intro",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtXCOh9f-t9vujeZ4SND1w1G6riZd8Sw4u4LglOk7-3RmZzVN0M8NXOWvnoEgVSMaoEqTot6ezwx2X/pub?gid=0&single=true&output=csv"
  }
];

const allData = {
  rule: [],
  case: []
};

window.onload = async () => {
  const status = document.getElementById("status");

  try {
    for (const sheet of SHEETS) {
      const res = await fetch(sheet.url);
      const text = await res.text();
      const rows = text.trim().split("\n").slice(1);

      for (const row of rows) {
        const columns = parseCSVRow(row);
        if (!columns[0] && !columns[1] && !columns[2]) continue;

        if (sheet.key === "intro") {
          document.getElementById("intro-content").innerHTML += `<p>${columns[0]}</p>`;
        } else {
          allData[sheet.key].push({
            管理ID: columns[0] || "",
            タイトル: columns[1] || "",
            内容: columns[2] || ""
          });
        }
      }
    }

    renderAllLists(); // 初期一覧を表示
    status.textContent = "✅ 検索の準備ができました！";
  } catch (err) {
    console.error("読み込みエラー", err);
    status.textContent = "❌ データ取得に失敗しました。";
  }
};

function renderAllLists() {
  ["rule", "case"].forEach(type => {
    const container = document.getElementById(`${type}-results`);
    container.innerHTML = "";
    allData[type].forEach(row => {
      container.innerHTML += renderResult(row, type);
    });
  });
}

function parseCSVRow(row) {
  const result = [];
  let insideQuote = false;
  let cell = "";

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"' && insideQuote && nextChar === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      insideQuote = !insideQuote;
    } else if (char === ',' && !insideQuote) {
      result.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }

  result.push(cell);
  return result;
}

function renderResult(row, type) {
  return `
    <div class="result">
      <div class="sheet">📄 ${type === "rule" ? "鯖ルール" : type === "case" ? "判例説明" : type}</div>
      <div class="title">${row.タイトル}</div>
      <div class="content">${row.内容}</div>
    </div>
  `;
}

function searchData(type) {
  let keyword = "";
  let targetList = [];

  if (type === "top") {
    keyword = document.getElementById("topSearchInput").value.trim().toLowerCase();
    targetList = [...allData.rule, ...allData.case];
  } else {
    keyword = document.getElementById(`${type}SearchInput`).value.trim().toLowerCase();
    targetList = allData[type];
  }

  const results = document.getElementById(`${type}-results`);
  results.innerHTML = "";

  if (!keyword) {
    if (type !== "top") {
      // 通常ページでは検索文字なし → 全件表示
      allData[type].forEach(row => {
        results.innerHTML += renderResult(row, type);
      });
    }
    return;
  }

  const filtered = targetList.filter(row =>
    row.管理ID.toString().toLowerCase().includes(keyword) ||
    row.タイトル.toString().toLowerCase().includes(keyword) ||
    row.内容.toString().toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    results.innerHTML = "<div class='result'>該当データがありません。</div>";
    return;
  }

  filtered.forEach(row => {
    results.innerHTML += renderResult(row, type);
  });
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('#top-tab, #rule-tab, #case-tab').forEach(el => el.style.display = 'none');

  document.querySelector(`.tab[onclick="switchTab('${tab}')"]`).classList.add('active');
  document.getElementById(`${tab}-tab`).style.display = 'block';
}
