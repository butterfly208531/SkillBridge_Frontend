"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/[locale]/components/ui/button";
import { Search, Menu, X, Globe } from "lucide-react";
import { ThemeToggle } from "@/app/[locale]/components/theme-toggle";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import "./styles/style.css";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  const isActive = (path: string) => {
    return pathname === path || (path !== "/" && pathname.startsWith(path));
  };

  const toggleDropdown = (path: string) => {
    setOpenStates((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const currentLocale = pathname?.split("/")[1] || "en";

  const toggleLanguage = () => {
    const newLocale = currentLocale === "en" ? "am" : "en";
    const newPath = `/${newLocale}${pathname?.replace(/^\/[a-z]{2}/, "")}`;
    router.push(newPath);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    setUser(null);
    router.push('/');
  };

  const t = useTranslations();
  const navbarItems = t.raw("navbar.navbarItems") as { name: string; path: string; type: string }[];

  return (
    <>
      <header className='sticky top-0 2xl:pt-3 min-[1710px]:pt-4 z-40 bg-white/50 backdrop-blur-xl dark:bg-gray-950/50'>
        <section className='mx-auto px-2 xl:px-8 py-1 flex items-center justify-between'>
            <div className='spacing flex !justify-between !w-[98%] items-center gap-4 sm:gap-4 md:gap-4 lg:gap-8 xl:gap-20 2xl:gap-40 min-[1710px]:gap-60'>
              <div className='flex gap-2 md:gap-4 lg:gap-8'>
                <Link
                  href='/'
                  className='logo_width flex items-center mt-2 max-[375px]:mr-0 xs:mr-8 sm:mr-2 xl:mr-0 2xl:mr-4'
                >
                  <img
                    src='/Logo.svg'
                    alt='Skill Bridge Logo'
                    className='logo_width w-16 sm:w-20 md:w-24 lg:w-16 xl:w-20 h-16 sm:h-20 md:h-24 lg:h-16 xl:h-20 2xl:w-24 2xl:h-24'
                  />
                </Link>
                <nav className='hidden lg:flex items-center gap-4 lg:gap-6 xl:gap-10 min-[1710px]:gap-16 font-inter justify-between'>
                  {navbarItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.path}
                      className={`font-medium font-inter text-xs lg:text-xs xl:text-sm 2xl:text-[16px] whitespace-nowrap ${
                        isActive(item.path)
                          ? "text-[#2196F3]"
                          : "text-gray-700 dark:text-gray-300 hover:text-[#2196F3]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className='flex max-[375px]:gap-3 min-[375px]:gap-6 sm:gap-10 min-[1760px]:gap-16 items-center justify-between'>

                <div className='flex items-center justify-center relative group'>
                  <button
                    className='flex items-center justify-center w-12 h-12 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 select-none'
                    aria-label="Select language"
                  >
                    <div className="relative w-11 h-11">
                      {/* Blue square with አ */}
                      <div className="absolute top-0 left-0 w-7 h-7 bg-[#2196F3] rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-black leading-none">አ</span>
                      </div>
                      {/* White square with EN */}
                      <div className="absolute bottom-0 right-0 w-7 h-7 bg-white border-2 border-[#2196F3] rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-[#2196F3] text-[11px] font-black leading-none tracking-tight">EN</span>
                      </div>
                      {/* Swap arrows */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 44 44" fill="none">
                        <path d="M26 9 Q36 9 36 19" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        <path d="M34 17 L36 19 L38 17" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18 35 Q8 35 8 25" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        <path d="M6 27 L8 25 L10 27" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                  <div className='absolute top-full mt-1 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[110px]'>
                    <button
                      onClick={() => { const p = `/en${pathname?.replace(/^\/[a-z]{2}/, "")}`; router.push(p); }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors ${currentLocale === "en" ? "text-[#2196F3]" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      🇺🇸 English
                    </button>
                    <button
                      onClick={() => { const p = `/am${pathname?.replace(/^\/[a-z]{2}/, "")}`; router.push(p); }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors ${currentLocale === "am" ? "text-[#2196F3]" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      🇪🇹 አማርኛ
                    </button>
                  </div>
                </div>
                <div className='hidden md:block'>
                  <ThemeToggle />
                </div>

                {user ? (
                  <div className="relative group">
                    <button 
                      className="flex items-center gap-2"
                      onClick={() => router.push('/profile')}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden md:inline text-sm font-medium">
                        {user.name.split(' ')[0]}
                      </span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t('navbar.profile')}
                      </Link>
                      <Link
                        href="/my-courses"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t('navbar.myCourses')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t('navbar.logout')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size='sm'
                    className='hidden md:block bg-[#2196F3] hover:bg-blue-500 h-9 2xl:h-12 px-5'
                  >
                    <Link href='/signup' className='text-base 2xl:text-lg'>
                      {t("navbar.getStarted")}
                    </Link>
                  </Button>
                )}

                <button
                  className='lg:hidden rounded-md py-2 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800'
                  onClick={() => setIsOpen(true)}
                >
                  <Menu className='h-5 md:h-6 w-5 md:w-6' />
                </button>
              </div>
            </div>
        </section>
      </header>

      {/* Mobile Menu */}
      <div className='lg:hidden'>
        {isOpen && (
          <div
            className='fixed inset-0 bg-black/50 z-50'
            onClick={() => setIsOpen(false)}
          ></div>
        )}

        <div
          className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white dark:bg-gray-900 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className='flex justify-between items-center p-4 border-b'>
            <div className='flex items-center gap-2'>
              <Image
                src='https://i.ibb.co/ZRYfMLWK/skills.png'
                alt='Skill Bridge Mobile Logo'
                width={36}
                height={36}
              />
              <span className='font-bold text-sm sm:text-base'>
                SkillBridge
              </span>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(false)}
              aria-label='Close menu'
            >
              <X className='h-5 w-5' />
            </Button>
          </div>

          <div className='p-4'>
            <div className='flex items-center justify-between mb-6'>
              <div className='block md:hidden'>
                <ThemeToggle />
              </div>
              {user ? (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white cursor-pointer"
                    onClick={() => {
                      router.push('/profile');
                      setIsOpen(false);
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
              ) : (
                <Button
                  size='sm'
                  className='block md:hidden bg-[#2196F3] hover:bg-blue-500 h-9 px-5'
                >
                  <Link href='/signup'>{t("navbar.getStarted")}</Link>
                </Button>
              )}
            </div>

            <nav className='space-y-4'>
              {navbarItems.map((item) => (
                <div
                  key={item.path}
                  className='border-b border-gray-100 dark:border-gray-800'
                >
                  <Link
                    href={item.path}
                    className={`block py-2 font-medium font-inter ${
                      isActive(item.path)
                        ? "text-[#2196F3]"
                        : "text-gray-700 dark:text-gray-300 hover:text-[#2196F3]"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}

              {user && (
                <>
                  <div className='border-b border-gray-100 dark:border-gray-800'>
                    <Link
                      href="/profile"
                      className="block py-2 font-medium font-inter text-gray-700 dark:text-gray-300 hover:text-[#2196F3]"
                      onClick={closeMobileMenu}
                    >
                      {t('navbar.profile')}
                    </Link>
                  </div>
                  <div className='border-b border-gray-100 dark:border-gray-800'>
                    <Link
                      href="/my-courses"
                      className="block py-2 font-medium font-inter text-gray-700 dark:text-gray-300 hover:text-[#2196F3]"
                      onClick={closeMobileMenu}
                    >
                      {t('navbar.myCourses')}
                    </Link>
                  </div>
                  <div className='border-b border-gray-100 dark:border-gray-800'>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="block py-2 font-medium font-inter text-red-600 hover:text-red-700 w-full text-left"
                    >
                      {t('navbar.logout')}
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}