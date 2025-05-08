import { useState, useEffect, useCallback } from "react";

const useMenuMobile = () => {
  const [openMenuMobile, setOpenMenuMobile] = useState(false);

  const handleMenuMobile = () => {
    console.log("Toggling Menu:", !openMenuMobile);
    setOpenMenuMobile((prevState) => !prevState);
  };

  const handleClickOutsideMenuMobile = useCallback((event: Event) => {
    const targetElement = event.target as Element;

    if (
      !targetElement.closest("#menu-mobile") &&
      !targetElement.closest(".menu-mobile-icon")
    ) {
      setOpenMenuMobile(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideMenuMobile);
    return () => {
      document.removeEventListener("click", handleClickOutsideMenuMobile);
    };
  }, [handleClickOutsideMenuMobile]);

  useEffect(() => {
    console.log("Menu Open State:", openMenuMobile);
  }, [openMenuMobile]);

  return { openMenuMobile, handleMenuMobile };
};

export default useMenuMobile;
