chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  if (currentTab.url !== "https://chat.zalo.me/") {
    chrome.tabs.update(currentTab.id, { url: "https://chat.zalo.me/" });
  } else {
    updateCookies();
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url === "https://chat.zalo.me/" && changeInfo.status === 'complete') {
    updateCookies();
  }
});

function getCookies(callback) {
  chrome.cookies.getAll({ url: "https://chat.zalo.me/" }, function (cookies) {
    const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
    callback(cookieString);
  });
}

function updateCookies() {
  getCookies((cookieString) => {
    document.querySelector("#cookies").innerHTML = cookieString || "Chưa Đăng Nhập Zalo!";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: () => localStorage.getItem('z_uuid')
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            const imei = results[0].result;
            document.querySelector("#imei").innerHTML = imei || "IMEI không tồn tại!";
          } else {
            console.log("Không lấy được z_uuid từ localStorage.");
          }
        }
      );
    });
  });
}


document.getElementById("copy-cookies-button").onclick = function() {
  const cookies = document.getElementById("cookies");
  cookies.select();
  document.execCommand("copy");
  alert("Cookies copied to clipboard!");
};

document.getElementById("copy-imei-button").onclick = function() {
  const imei = document.getElementById("imei");
  imei.select();
  document.execCommand("copy");
  alert("IMEI copied to clipboard!");
};
