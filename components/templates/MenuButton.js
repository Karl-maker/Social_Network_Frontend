import { MenuItem, Menu, Divider, ListItemIcon } from "@mui/material";
import { useState } from "react";
import { GoPrimitiveDot } from "react-icons/go";

export default function MenuButton({
  children,
  list,
  section,
  vertical,
  horizontal,
  PaperProps,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const menu_items = list.map((item) => (
    <MenuItem
      key={item.label}
      onClick={(e) => {
        e.stopPropagation();
        item.activity();
        handleClose(e);
      }}
    >
      <ListItemIcon>
        {item.icon || <GoPrimitiveDot fontSize="small" />}
      </ListItemIcon>
      {item.label}
    </MenuItem>
  ));

  if (section) {
    const section_items = section.map((item) => (
      <MenuItem
        key={item.label}
        onClick={(e) => {
          e.stopPropagation();
          item.activity();
          handleClose(e);
        }}
        PaperProps={PaperProps || null}
      >
        <ListItemIcon>
          {item.icon || <GoPrimitiveDot fontSize="small" />}
        </ListItemIcon>
        {item.label}
      </MenuItem>
    ));
  }

  return (
    <>
      <div
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {children}

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorOrigin={{
            vertical: vertical || "top",
            vertical: horizontal || "right",
          }}
          transformOrigin={{
            vertical: vertical || "top",
            horizontal: horizontal || "right",
          }}
        >
          {menu_items}
          {section && (
            <>
              <Divider />
              {section_items}
            </>
          )}
        </Menu>
      </div>
    </>
  );
}
