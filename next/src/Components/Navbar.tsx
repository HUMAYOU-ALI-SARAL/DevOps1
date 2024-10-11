import React, { useEffect, useRef, useState } from 'react';
import clipBoardIcon from '../../public/Images/Invite.png';
import Image from 'next/image';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import BeatLoader from 'react-spinners/BeatLoader';
import './styles.css';
import { engToArabicAlphanumeric } from '@/libs/Translate.utils';
type NavbarProps = {
  screenName: any;
  lang?:string;
};

const Navbar: React.FC<NavbarProps> = ({lang}) => {
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isConnect, setIsConnect] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedUserId = localStorage.getItem('user_id');

      if (!storedUserId) return;

      try {
        // Fetch user data
        const userDataResponse = await axios.get(`/api/get_user_data?user_id=${storedUserId}`);
        const user = userDataResponse.data.user;
        setUserName(user?.username);
        setReferralCode(user?.referral_code || "")
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    // Delay fetching data by 3 seconds
    const delayFetch = setTimeout(fetchData, 3000);

    // Clear the timeout if the component unmounts before 3 seconds
    return () => clearTimeout(delayFetch);
  }, []);

  const handleInviteClick = () => {
    window.open('https://staging.spheramarket.io/', '_blank');
  };
  const copyText = () => {
    const copyText = inputRef.current;
    if (copyText) {
      copyText.select();
      document.execCommand("copy");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setIsConnect(false);
  };

  const toggleConnect = () => {
    setIsConnect(!isConnect);
    setMenuOpen(false);
  };

  return (
    <>
      <div className='desktop'>
        <div className="navbar w-full flex justify-between items-center px-4 md:px-8 md:mt-1">
          <div className="w-full"></div>
          <div className="w-full hidden md:flex justify-center items-center gap-2 font-jura">
            <Image src="/Images/Logo.webp" alt="Sphera World Logo" height={60} width={60} className='cursor-pointer' />
          </div>

          <div className="w-full hidden md:flex justify-end items-center gap-4 font-jura">
            <div className="flex items-center font-jura relative">
              <Image src="/Images/profile.png" alt="Profile" height={60} width={60} className='z-20' />
              <p className={`font-bold text-[20px] -ml-[20px] font-jura bg-[#14161D] rounded_gradient_border px-4 w-[330px]`} onClick={toggleConnect}>
                <p className='px-8 py-2'>{isLoading ? <BeatLoader color="#FF7F2A" size={10} /> : userName}</p>
              </p>
              <a href="https://arena.spheraworld.io/connect">
                <div className={isConnect ? "popupStatus " : "hideConnect"}>
                  <h2> {lang==='ar'?"قطع الاتصال":"Disconnect"}</h2>
                </div>
              </a>
            </div>
            <button className='rounded_gradient_border font-jura w-[230px]' onClick={toggleMenu}>
              <p className='px-8 py-2'>{lang==='ar'?"دعوة الأصدقاء":"INVITE FRIENDS"}</p>
            </button>
            <div className={menuOpen ? "invitePopUp rounded_gradient_border" : "hideInvitePopUp"}>
              <span>{lang==='ar'?"رمز الدعوة":"Invite code"}:</span>
              <div className='rounded_gradient_border overflow-hidden bg-[#6B6B6A]'>
              <input type="text" ref={inputRef} value={isLoading ? '' : referralCode || ""} readOnly />
              {isLoading && <BeatLoader color="#FF7F2A" size={10} />}
              </div>
              <div className="copyIcon">
                <Image src={clipBoardIcon} width={20} height={20} alt="" onClick={copyText} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='Iphone_header'>
        <Disclosure as="nav">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative navig flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 right-14 flex items-center sm:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Image src="/Images/profile.png" alt="Profile" height={60} width={60} className='w-12 z-20 rounded-full border-2 border-white' />
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden menu_bg">
            <div className="w-full md:flex justify-end items-center gap-4 font-jura">
              <div className="flex items-center font-jura relative">
                <p className={`rounded_gradient_border font-jura w-full mb-4 white`} onClick={toggleConnect}>
                  <p className='px-8 py-2 text-white uppercase text-center'>{isLoading ? <BeatLoader color="#FF7F2A" size={10} /> : userName}</p>
                </p>
                <a href="https://arena.spheraworld.io/connect">
                  <div className={isConnect ? "popupStatus " : "hideConnect"}>
                  <h2> {lang==='ar'?"قطع الاتصال":"Disconnect"}</h2>
                  </div>
                </a>
              </div>
              <button className='rounded_gradient_border font-jura w-full' onClick={toggleMenu}>
              <p className='px-8 py-2 text-white'>{lang==='ar'?"دعوة الأصدقاء":"INVITE FRIENDS"}</p>
              </button>
              <div className={menuOpen ? "invitePopUp rounded_gradient_border" : "hideInvitePopUp"}>
              <span>{lang==='ar'?"رمز الدعوة":"Invite code"}:</span>

                <div className='rounded_gradient_border overflow-hidden bg-[#6B6B6A]'>
                  {/* <input type="text" ref={inputRef} value={referralCode || ""} readOnly /> */}
                  <input type="text" ref={inputRef} value={isLoading ? '' : referralCode || ""} readOnly />
                  {isLoading && <BeatLoader color="#FF7F2A" size={10} />}

                </div>
                <Image src={clipBoardIcon} width={20} height={20} alt="" onClick={copyText} />
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </>
  );
}

export default Navbar;