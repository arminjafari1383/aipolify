export default function FriendsList({ friends, copyToClipboard, fetchRewards }) {
  return (
    <div className="ref-box">
      <label>👥 My Referred Friends ({friends.length})</label>
      {friends.length > 0 ? (
        <ul>
          {friends.map((f, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px"
              }}
            >
              <span>{f.slice(0, 6)}...{f.slice(-4)}</span>
              <button onClick={() => copyToClipboard(f)}>📋</button>
              <button onClick={() => fetchRewards(f)}>💰 Rewards</button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#777" }}>
          No referred friends yet 🫤 Share your link to get rewards!
        </p>
      )}
    </div>
  );
}
