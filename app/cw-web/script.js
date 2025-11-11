let currentRoom = null;
    let apiKey = "";

    // ルーム一覧取得
    async function loadRooms() {
      apiKey = document.getElementById("apiKey").value.trim();
      if(!apiKey) return;

      try {
        const res = await fetch("https://yuyuyu-made-bbs.onrender.com/cw-rooms", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey })
        });
        const data = await res.json();
        const list = document.getElementById("rooms");

        list.innerHTML = data.rooms.map(r => 
          `<div class="room" onclick="loadMessages('${r.room_id}', '${r.name}')">
             ${r.name} (${r.type})${r.unread_num > 0 ? `<span class="unread">🔴${r.unread_num}</span>` : ''}
           </div>`).join("");
      } catch(err) {
        console.error("ルーム取得失敗:", err);
      }
    }

    // メッセージ取得
    async function loadMessages(roomId, name) {
      currentRoom = roomId;
      try {
        const res = await fetch("https://yuyuyu-made-bbs.onrender.com/cw-messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey, roomId })
        });
        const data = await res.json();
        const box = document.getElementById("messages");
        box.innerHTML = `<h3>${name}</h3>` + data.messages.map(m =>
          `<div><b>${m.account?.name || "??"}:</b> ${m.body}</div>`).join("");

        // 自動スクロール
        box.scrollTop = box.scrollHeight;
      } catch(err) {
        console.error("メッセージ取得失敗:", err);
      }
    }

    // メッセージ送信
    async function sendMsg() {
      const message = document.getElementById("msgInput").value.trim();
      if(!currentRoom || !message) return;

      // 入力欄クリア＆フォーカス
      document.getElementById("msgInput").value = "";
      document.getElementById("msgInput").focus();

      try {
        await fetch("https://yuyuyu-made-bbs.onrender.com/cw-send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey, roomId: currentRoom, message })
        });

        // 送信後にメッセージ更新＆スクロール
        await loadMessages(currentRoom, "更新中…");
      } catch(err) {
        console.error("送信失敗:", err);
        alert("送信に失敗しました");
      }
    }

    // 定期的にメッセージとルーム更新
    setInterval(() => {
      if(currentRoom) loadMessages(currentRoom, "更新中…");
      if(apiKey) loadRooms();
    }, 5000);
