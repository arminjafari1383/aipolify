// src/pages/TasksPage.jsx
function TasksPage({ tasks, setTasks, setCoins, showSnackbar }) {
  const claimReward = (task) => {
    if (!tasks[task]) {
      setTasks({ ...tasks, [task]: true });
      setCoins((c) => c + 100);
      showSnackbar("Task Completed! +100 Coins");
    } else {
      showSnackbar("Already claimed");
    }
  };

  const links = {
    telegram: "https://t.me/EcoSmartECS",
    instagram: "https://www.instagram.com/ecosmartecs/",
    website: "https://ecosmartecs.com/",
    whitepaper: "https://main--hlx--ecosmartecs.hlx.live/",
    staking: "https://bscscan.com/address/0x4685e9111696eff9c81a6f5ece2d83ab6b423b91#code",
  };

  return (
    <div className="p-6 max-w-md mx-auto flex flex-col h-full text-center bg-gradient-to-b from-[#0b0b18] to-[#141433] text-white">
      <h2 className="text-2xl font-bold mb-8">Contact Us</h2><br /><br /><br />

      {/* 🌌 دکمه‌های گرادیانی */}
      <div className="space-y-4 mb-10">
        <a
          href={links.telegram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => claimReward("telegram")}
          className="connect-btnh"
        >
          Join Telegram
        </a><br /><br /><br /><br /><br />
        <a
          href={links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => claimReward("instagram")}
          className="connect-btnh"
        >
          Follow Instagram
        </a><br /><br /><br /><br /><br />
        <a
          href={links.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => claimReward("website")}
          className="connect-btnh"
        >
          Visit Website
        </a><br /><br /><br /><br /><br />
      </div>

      {/* 📄 لینک‌های پایین */}
      <div className="flex flex-col items-center space-y-3 text-blue-300 underline font-medium">
        <a
          href={links.whitepaper}
          target="_blank"
          rel="noopener noreferrer"
          className="connect-btnh"
        >
          Whitepaper
        </a><br /><br /><br /><br /><br />
        <a
          href={links.staking}
          target="_blank"
          rel="noopener noreferrer"
          className="connect-btnh"
        >
          Staking Contract Link
        </a><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    </div>
  );
}

export default TasksPage;
