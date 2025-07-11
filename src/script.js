const RULES_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtXCOh9f-t9vujeZ4SND1w1G6riZd8Sw4u4LglOk7-3RmZzVN0M8NXOWvnoEgVSMaoEqTot6ezwx2X/pub?gid=699240754&single=true&output=csv";
const CASES_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtXCOh9f-t9vujeZ4SND1w1G6riZd8Sw4u4LglOk7-3RmZzVN0M8NXOWvnoEgVSMaoEqTot6ezwx2X/pub?gid=2069126754&single=true&output=csv";

let allData = {
  rule: [],
  case: []
};

window.onload = async () => {
  try {
    const [ruleData, caseData] = await Promise.all([
      fetchCSV(RULES_CSV_URL, "鯖ルール"),
      fetchCSV(CASES_CSV_URL, "判例説明")
    ]);
    allData.rule = ruleData;
    allData.case = caseData;
    document.getElementById("status").innerHTML = "✅ 検索の準備ができました！";
    renderList("rule", allData.rule);
    renderList("case", allData.case);
    renderList("top", [...allData.rule, ...allData.case]);
  } catch (error) {
    document.getElementById("status").innerHTML = "❌ データ取得に失敗しました。";
    console.error("読み込みエラー", error);
  }
};

async function fetchCSV(url, sheetName) {
  const res = await fetch(url);
  const text = await res.text();
  const rows = text.trim().split("\n").slice(1);
  return rows.map(row => {
    const cols = parseCSVRow(row);
    return {
      sheet: sheetName,
      管理ID: cols[0] || "",
      タイトル: cols[1] || "",
      内容: cols[2] || ""
    };
  }).filter(item => item.管理ID && item.タイトル && item.内容);
}

function parseCSVRow(row) {
  const regex = /(?:\"([^"]*(?:\"\"[^"]*)*)\"|([^,]*))(,|$)/g;
  const result = [];
  let match;
  while ((match = regex.exec(row)) !== null) {
    result.push(match[1]?.replace(/""/g, '"') ?? match[2]);
  }
  return result;
}

function searchData(type) {
  let keyword = "";
  let resultEl;
  let data;
  if (type === "top") {
    keyword = document.getElementById("topSearchInput").value.toLowerCase();
    resultEl = document.getElementById("top-results");
    data = [...allData.rule, ...allData.case];
  } else if (type === "rule") {
    keyword = document.getElementById("ruleSearchInput").value.toLowerCase();
    resultEl = document.getElementById("rule-results");
    data = allData.rule;
  } else if (type === "case") {
    keyword = document.getElementById("caseSearchInput").value.toLowerCase();
    resultEl = document.getElementById("case-results");
    data = allData.case;
  }
  resultEl.innerHTML = "";
  if (!keyword.trim()) return;

  const filtered = data.filter(item =>
    item.タイトル.toLowerCase().includes(keyword) ||
    item.内容.toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    resultEl.innerHTML = "<p>一致する項目はありませんでした。</p>";
  } else {
    for (const item of filtered) {
      const div = document.createElement("div");
      div.className = "result-item";
      div.innerHTML = `<h4>📄 ${item.sheet}</h4><strong>${item.タイトル}</strong><p>${item.内容}</p>`;
      resultEl.appendChild(div);
    }
  }
}

function renderList(type, data) {
  let resultEl;
  if (type === "top") {
    resultEl = document.getElementById("top-results");
  } else if (type === "rule") {
    resultEl = document.getElementById("rule-results");
  } else if (type === "case") {
    resultEl = document.getElementById("case-results");
  }
  resultEl.innerHTML = "";
  for (const item of data) {
    const div = document.createElement("div");
    div.className = "result-item";
    div.innerHTML = `<h4>📄 ${item.sheet}</h4><strong>${item.タイトル}</strong><p>${item.内容}</p>`;
    resultEl.appendChild(div);
  }
}

function switchTab(tab) {
  document.getElementById("top-tab").style.display = tab === "top" ? "block" : "none";
  document.getElementById("rule-tab").style.display = tab === "rule" ? "block" : "none";
  document.getElementById("case-tab").style.display = tab === "case" ? "block" : "none";

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(btn => btn.classList.remove("active"));
  const tabBtn = Array.from(tabs).find(btn => btn.innerText.includes(tab === "top" ? "TOP" : tab === "rule" ? "鯖ルール" : "判例説明"));
  if (tabBtn) tabBtn.classList.add("active");
}
