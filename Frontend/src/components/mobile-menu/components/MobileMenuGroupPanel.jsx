import React from "react";
import { Link } from "react-router-dom";

const MobileMenuGroupPanel = ({ activeGroup, toggleMenu }) => {
  if (!activeGroup) return null;

  return (
    <ul className="flex flex-col m-0 p-0 list-none">
      <li className="border-b border-[#e8e8e8]">
        <div className="block px-[5vw] py-[4.5vw] md:px-[2.5vw] md:py-[2.2vw] text-[3.2vw] md:text-[1.6vw] font-sans font-bold uppercase tracking-[0.08em] text-[#666]">
          {activeGroup.title}
        </div>
      </li>
      {activeGroup.links?.map((link) => {
        if (link.isDivider)
          return (
            <li key={link.id} className="w-full h-px bg-[#e8e8e8] my-0"></li>
          );
        return (
          <li key={link.id} className="border-b border-[#e8e8e8]">
            <Link
              to={link.url}
              onClick={toggleMenu}
              className="block px-[5vw] py-[4.5vw] md:px-[2.5vw] md:py-[2.2vw] no-underline text-[3.2vw] md:text-[1.6vw] font-sans font-bold uppercase tracking-[0.08em] text-black hover:opacity-70"
            >
              {link.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default MobileMenuGroupPanel;
