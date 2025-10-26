// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="my-card">
      <NavLink to="/" className="nav-item">
        <img src="https://html4herosimages.vercel.app/Mine%20Nav%20Icon.png" className="my-icon" />
        Mine
      </NavLink>

      <NavLink to="/boost" className="nav-item">
        <img src="https://html4herosimages.vercel.app/Boost%20Nav%20Icon.png" className="my-icon" />
        Stake
      </NavLink>

      <NavLink to="/friends" className="nav-item">
        <img src="https://html4herosimages.vercel.app/Friends%20Nav%20Icon.png" className="my-icon" />
        Friends
      </NavLink>

      <NavLink to="/tasks" className="nav-item">
        <img src="https://html4herosimages.vercel.app/Task%20Nav%20Icon.png" className="my-icon" />
          Contact us
      </NavLink>
    </div>
  );
}

export default Navbar;
