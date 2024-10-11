'use client'
import React, { useEffect, useState } from 'react';
import Navbar from '@/Components/Navbar';
import Image from 'next/image';
import { FaRepeat } from "react-icons/fa6";
import axios from 'axios';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { FaRegHeart } from "react-icons/fa";
import { BiLabel } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { BsInfoCircle } from "react-icons/bs";
import Logo from '../../public/Images/Sphera_gray_logo.png'
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import './portal.css'


interface CurrentTweet {
  tweet1?: boolean;
  tweet2?: boolean;
  tweet3?: boolean;
  tweet4?: boolean;
}
const Portal = () => {
 
  const initialTime = 24 * 3600 + 69 * 60;
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);

  // Update the time left every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Format the time to display as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const [oauthData, setOauthData] = useState<{
    oauth_token: string;
    oauth_token_secret: string;
    user_id: string;
    screen_name: string;
  } | null>(null);
  const [userHasRetweeted, setUserHasRetweeted] = useState(false);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [userHasPined, setUserHasPined] = useState(false);
  const [screenName, setScreenName] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [dateTime, setDateTime] = useState({
    date: '',
    time: ''
  });
  const [activeBtn, setActiveBtn] = useState({ eng: true, arb: false })
  const [currentTweet, setCurrentTweet] = useState({
    tweet1: true,
    tweet2: false,
    tweet3: false,
    tweet4: false,
    tweetId: "1826700000899871220"
  })
  const [tweetLoading, setTweetLoading] = useState<{
    tweet1: boolean;
    tweet2: boolean;
    tweet3: boolean;
    tweet4: boolean;
  }>({
    tweet1: true,
    tweet2: true,
    tweet3: true,
    tweet4: true
  });



  const [transition, setTransition] = useState(false);
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
   
  const handleTransition = () => {
    setTransition(true);
    setTimeout(() => setTransition(false), 500);
  };

  const handleTweetLoad = (tweetKey: keyof typeof tweetLoading) => {
    setTweetLoading((prevState) => ({
      ...prevState,
      [tweetKey]: false
    }));
  };

  const [buttonLoading, setButtonLoading] = useState({
    retweet: false,
    like: false,
    pin: false
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);

    const queryParams = new URLSearchParams(window.location.search);
    const oauth_token = queryParams.get('oauth_token');
    const oauth_verifier = queryParams.get('oauth_verifier');

    if (oauth_token && oauth_verifier) {
      getAccessToken(oauth_token, oauth_verifier);
    }

    // Start fetching data immediately
    fetchData();
  }, []);

  const fetchData = async () => {
    const storedUserId = localStorage.getItem('user_id');
    const storedOauthToken = localStorage.getItem('oauth_token');
    const storedOauthTokenSecret = localStorage.getItem('oauth_token_secret');
    const storedScreenName = localStorage.getItem('screen_name');
    const referralCode = localStorage.getItem('referralCode');

    if (storedUserId && storedOauthToken && storedOauthTokenSecret && storedScreenName) {
      setScreenName(storedScreenName);

      if (referralCode) {
        try {
          const referralResponse = await axios.post('https://back.spheramarket.io/user/use-referral-code', {
            referralCode,
            twitter_user_id: storedUserId
          });
          console.log("Referral response", referralResponse);
        } catch (error) {
          console.error("Error using referral code:", error);
        }
      }

      try {
        const response = await axios.get(`/api/get_user_data?user_id=${storedUserId}`);
        console.log("response", response);
        const user = response?.data?.user;
        setTotalPoints(user?.total_spoint);
        setUserHasRetweeted(user?.retweet_spoints === 500);
        setUserHasLiked(user?.like_spoints === 500);
        setUserHasPined(user?.pin_spoints === 500);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setButtonLoading({
          retweet: false,
          like: false,
          pin: false
        });
      }
    }
  };

  const getAccessToken = async (oauth_token: string, oauth_verifier: string) => {
    try {
      const apiUrl = `https://nodejs-serverless-function-express-beryl-xi.vercel.app/api/get_access_token?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.axiosResponse) {
        const params = new URLSearchParams(response.data.axiosResponse);
        const oauthData = {
          oauth_token: params.get('oauth_token') || '',
          oauth_token_secret: params.get('oauth_token_secret') || '',
          user_id: params.get('user_id') || '',
          screen_name: params.get('screen_name') || '',
        };
        setOauthData(oauthData);
        setScreenName(oauthData.screen_name);

        // Store in local storage
        localStorage.setItem('oauth_token', oauthData.oauth_token);
        localStorage.setItem('oauth_token_secret', oauthData.oauth_token_secret);
        localStorage.setItem('user_id', oauthData.user_id);
        localStorage.setItem('screen_name', oauthData.screen_name);

        await saveUserToDatabase(oauthData.user_id, oauthData.screen_name, oauthData.oauth_token, oauthData.oauth_token_secret);
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  const saveUserToDatabase = async (user_id: string, username: string, oauth_token: string, oauth_token_secret: string) => {
    const referralCode = sessionStorage.getItem('referralCode');
    const signInWithReferralCode = sessionStorage.getItem('signInWithReferralCode');
    try {
      const response = await axios.post('/api/spoints_api', {
        user_id,
        username,
        oauth_token,
        oauth_token_secret,
        referralCode,
        signInWithReferralCode
      });

      if (response.status === 201) {
        console.log("User saved to the database successfully");
        setTotalPoints(1000);
      } else {
        console.error("Failed to save user to the database");
      }
    } catch (error) {
      console.error("Error saving user to the database:", error);
    }
  };

  const handleRetweet = async () => {
    window.open(`https://x.com/spheraworld/status/${currentTweet.tweetId}`, '_blank');
    setButtonLoading(prev => ({ ...prev, retweet: true }));
    toast.success("Space Arana Checks Your Engagement on Regular basis. Due to X  limitation , Spoints Could Take Few Minutes to Updated. Be Patient and the Enjoy the Adventure.")
    try {
      const storedUserId = localStorage.getItem('user_id');
      const storedOauthToken = localStorage.getItem('oauth_token');
      const storedOauthTokenSecret = localStorage.getItem('oauth_token_secret');
      const storedScreenName = localStorage.getItem('screen_name');

      const apiUrl = `https://nodejs-serverless-function-express-beryl-xi.vercel.app/api/retweet_api?user_id=${storedUserId}&oauth_token=${storedOauthToken}&oauth_token_secret=${storedOauthTokenSecret}&screen_name=${storedScreenName}`;
      const response = await axios.get(apiUrl);

      if (response.data && response?.data?.axiosResponse?.data) {
        const userHasRetweeted = response?.data?.axiosResponse?.data.some((user: any) => user.id === storedUserId);
        setUserHasRetweeted(userHasRetweeted);

        if (userHasRetweeted) {
          await updateRetweetPoints(storedUserId);
        }
      }
    } catch (error) {
      console.error("Error retweeting:", error);
    } finally {
      setTimeout(fetchData, 20000);
    }
  };

  const updateRetweetPoints = async (user_id: string | null) => {
    try {
      const response = await axios.post('/api/retweet_api', { user_id });
      if (response.data && response.data.message === 'Retweet points added successfully') {
        console.log("Retweet points updated successfully");
      }
    } catch (error) {
      console.error("Error updating retweet points:", error);
    }
  };

  const handleLike = async () => {
    window.open(`https://x.com/spheraworld/status/${currentTweet.tweetId}`, '_blank');
    setButtonLoading(prev => ({ ...prev, like: true }));
    toast.success("Space Arana Checks Your Engagement on Regular basis. Due to X  limitation , Spoints Could Take Few Minutes to Updated. Be Patient and the Enjoy the Adventure.")
    try {
      const storedUserId = localStorage.getItem('user_id');
      const storedOauthToken = localStorage.getItem('oauth_token');
      const storedOauthTokenSecret = localStorage.getItem('oauth_token_secret');
      const storedScreenName = localStorage.getItem('screen_name');

      const apiUrl = `https://nodejs-serverless-function-express-beryl-xi.vercel.app/api/get_likes?user_id=${storedUserId}&oauth_token=${storedOauthToken}&oauth_token_secret=${storedOauthTokenSecret}&screen_name=${storedScreenName}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.axiosResponse && response.data.axiosResponse.data) {
        const likedTweets = response.data.axiosResponse.data;
        const userHasLiked = likedTweets.some((tweet: any) => tweet.id === "1834659316155969660");
        setUserHasLiked(userHasLiked);
        if (userHasLiked) {
          await updateLikePoints(storedUserId);
        }
      }
    } catch (error) {
      console.error("Error liking tweet:", error);
    } finally {
      setTimeout(fetchData, 20000);
    }
  };
  
  const ToggleArb = () => {
    router.push("/auth/ar")
    setActiveBtn({ ...activeBtn, eng: false, arb: true })
  }

  const ToggleEn = () => {
    router.push("/auth")
    setActiveBtn({ ...activeBtn, eng: true, arb: false })
  }

  const updateLikePoints = async (user_id: string | null) => {
    try {
      const response = await axios.post('/api/like_api', { user_id });
      if (response.data && response.data.message === 'Like points added successfully') {
        console.log("Like points updated successfully");
      }
    } catch (error) {
      console.error("Error updating like points:", error);
    }
  };

  const handlePin = async () => {
    window.open(`https://x.com/spheraworld/status/${currentTweet.tweetId}`, '_blank');
    setButtonLoading(prev => ({ ...prev, pin: true }));
    toast.success("Space Arana Checks Your Engagement on Regular basis. Due to X  limitation , Spoints Could Take Few Minutes to Updated. Be Patient and the Enjoy the Adventure.")
    try {
      const storedUserId = localStorage.getItem('user_id');
      const storedOauthToken = localStorage.getItem('oauth_token');
      const storedOauthTokenSecret = localStorage.getItem('oauth_token_secret');
      const storedScreenName = localStorage.getItem('screen_name');

      const apiUrl = `https://nodejs-serverless-function-express-beryl-xi.vercel.app/api/get_pin_api?user_id=${storedUserId}&oauth_token=${storedOauthToken}&oauth_token_secret=${storedOauthTokenSecret}&screen_name=${storedScreenName}`;
      const response = await axios.get(apiUrl);
      console.log("pin_spoints", response);

      if (response.data && response.data.axiosResponse && response.data.axiosResponse.data) {
        const pinedTweets = response.data.axiosResponse.data;
        const userHasPined = pinedTweets.some((tweet: any) => tweet.id === "1819080072139317633");

        setUserHasPined(userHasPined);
        if (userHasPined) {
          await updatePinPoints(storedUserId);
        }
      }
    } catch (error) {
      console.error("Error pinning tweet:", error);
    } finally {
      setTimeout(fetchData, 20000);
    }
  };

  const updatePinPoints = async (user_id: string | null) => {
    try {
      const response = await axios.post('/api/pin_api', { user_id });
      if (response.data && response.data.message === 'Pin points added successfully') {
        console.log("Pin points updated successfully");
      }
    } catch (error) {
      console.error("Error updating pin points:", error);
    }
  };

  const handleVisitSiteClick = () => {
    window.open('https://www.spheramarket.io/', '_blank');
  };
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.26/build/spline-viewer.js';
    script.type = 'module';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString('en-GB'); // DD/MM/YYYY format
      const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }); // 24-hour format
      setDateTime({ date, time });
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);


  const emailPoints = async () => {
    console.log("Email spoint sis calling.");
    if (!validateEmail(email)) {
      toast.error('Invalid email format');
    } else {
    }
    if (!email) {
      toast.error("Email should not be empty.");
      return;
    }

    try {
      const user_id = localStorage.getItem('user_id');
      const response = await axios.post('/api/email_spoint_api', { user_id, email });
      if (response.data && validateEmail(email)) {
        setTotalPoints(response.data?.user?.total_spoint);
        toast.success('Task Completed and Spoint Earn');
        handleTransition();
      }
    } catch (error) {
      console.error("Error updating email points:", error);
      toast.error('Error updating points.');
    }
  };
  const follow_spoint_handler = async () => {
    const user_id = localStorage.getItem('user_id');
    try {
      const response = await axios.post('/api/follow_spoint_api', { user_id });
      if (response.data) {
        setTotalPoints(response.data?.user?.total_spoint);
        toast.success('Task Completed and Spoint Earn');
        handleTransition();
      }
    } catch (error) {
      console.error("Error updating pin points:", error);
      toast.error('Error updating points.');
    }
  };
  const website_spoint_handler = async () => {
    const user_id = localStorage.getItem('user_id');
    try {
      const response = await axios.post('/api/website_spoint_api', { user_id });
      if (response.data) {
        setTotalPoints(response.data?.user?.total_spoint);
        toast.success('Task Completed and Spoint Earn');
        handleTransition();
      }
    } catch (error) {
      console.error("Error updating pin points:", error);
      toast.error('Error updating points.');
    }
  };
  const T1_spoint_handler = async () => {
    const user_id = localStorage.getItem('user_id');
    setCurrentTweet({ ...currentTweet, tweet1: true, tweet2:false,tweet3:false,tweet4:false,tweetId:"1826700000899871220" })
    try {
      const response = await axios.post('/api/t1_spoint', { user_id });
      if (response.data) {
        setTotalPoints(response.data?.user?.total_spoint);
        handleTransition();
      }
    } catch (error) {
      console.error("Error updating pin points:", error);
    }
  };
  const T2_spoint_handler = async () => {
    const user_id = localStorage.getItem('user_id');
    setCurrentTweet({ ...currentTweet, tweet1: false, tweet2:true,tweet3:false,tweet4:false,tweetId:"1829258160034435519" })

    try {
      const response = await axios.post('/api/t2_spoint', { user_id });
      if (response.data) {
        setTotalPoints(response.data?.user?.total_spoint);
        handleTransition();
      }
    } catch (error) {
      console.error("Error updating pin points:", error);
    }

  };
  const T3_spoint_handler = async () => {

    const user_id = localStorage.getItem('user_id');
    setCurrentTweet({ ...currentTweet, tweet1: false, tweet2:false,tweet3:true,tweet4:false,tweetId:"1828838042578092537"})

    try {
      const response = await axios.post('/api/t3_spoint', { user_id });
      if (response.data) {
        setTotalPoints(response.data?.user?.total_spoint);
        handleTransition();
      }
    } catch (error) {
      console.error("Error updating pin points:", error);
    }
  };
  const T4_spoint_handler = async () => {
    const user_id = localStorage.getItem('user_id');
    setCurrentTweet({ ...currentTweet, tweet1: false, tweet2:false,tweet3:false,tweet4:true,tweetId:"1834659316155969660"})

    try {
      const response = await axios.post('/api/t4_spoint', { user_id });
      if (response.data) {
        setTotalPoints(response.data?.user?.total_spoint);
        handleTransition();
      }
    } catch (error) {
      console.error("Error updating pin points:", error);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-70 text-white backdrop-blur-lg">
  //       <div className="text-center">
  //         <p className="text-lg font-bold">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: "absolute", zIndex: '1' }}> {/* Ensure full width and height */}
        <spline-viewer
          url="https://prod.spline.design/3gV-gBsd3F1l-7AN/scene.splinecode"
          style={{ height: '100%', width: '100%' }}
        ></spline-viewer>
      </div>
      <div className={`min-h-screen overflow-hidden w-full relative pt-[70px] mx-auto auth_bg hidden md:block`}>
        <div>
        </div>
        <Navbar screenName={screenName} />
        <div className='subtract_bg relative' style={{ zIndex: 10 }}>
          {/* top bar  */}
          <div className='top_container'>
            <div className="translationButtons">
              <button className={`${activeBtn.eng && !activeBtn.arb ? "activeTranslate" : ""}`} onClick={ToggleEn} >ENG</button>
              <span>|</span>
              <button className={`${!activeBtn.eng && activeBtn.arb ? "activeTranslate" : ""}`} onClick={ToggleArb}>AR</button>
            </div>
            <div className='w-[40%] flex justify-between items-center'>
              <div className="dateTime">{dateTime.date}</div>
              <p className="top_container_heading">SPHERA ARENA SEASON 1</p>
              <div className="dateTime">{dateTime.time}</div>
            </div>
            <div className="core_quests_CORE_container">
              <img src="./Images/CORE_QUESTS.png" alt="" />
              <p className="text-content">
                ENGAGE WITH SPHERA WORLD TO EARN sPOINTS AND <br /> SECURE YOUR AIRDROP ALLOCATION
              </p>
            </div>

          </div>

          {/* main section  */}
          <div className='w-full grid grid-cols-12 gap-4 px-12' style={{ height: "calc(100vh - 200px)", marginTop: "5px" }}>
            {/* First Column - col-2 (1/6) */}
            <div className='col-span-3 main_left'>
              {/* Content for the first column */}
              <div className='main_left_top'>
                <div className='main_left_top_countdown'>
                  <p className={`rounded_gradient_border countdown`}> {formatTime(timeLeft)}</p>

                  <div className='countdown_image_container'>
                    <img src="./Images/dimand.png" alt="" />
                    <img src="./Images/x2.png" alt="" className='large' />
                  </div>
                </div>

                <div className="signup_container">
                  <div className="signup_header rounded_gradient_border">
                    <p>+5,000sp</p>
                  </div>
                  <div className="signup_content">
                    <p className="signup_title font-jura">SPHERA MARKET</p>
                    <p className="signup_subtitle">SIGN-UP TO THE BETA WAITLIST</p>
                    <input type="text" placeholder="ENTER EMAIL" className="email_input" onChange={(e) => setEmail(e.target.value)} />
                    <button className="signup_button" onClick={emailPoints}>ENTER</button>
                    {/* <p
                     style={{position:"absolute",fontSize:"13px",color:"red"}}
                    >dksdkf</p> */}
                  </div>
                </div>

                <div className="rewards_container">
                  <p className="rewards_title">sPoint Rewards</p>
                  <div className="rewards_background main_left_top_sp_bg">
                    <div className="rewards_points">
                      <p className='totalPoints_text'>+{totalPoints} sP</p>
                    </div>
                  </div>
                </div>

              </div>
              <div className='main_left_bottom'></div>
            </div>

            {/* Second Column - col-8 (2/3) */}
            <div className='col-span-6 main_center'>
              <div className='w-full h-[380px] main_center_top_bg flex justify-center items-center gap-2'>
                <div className='w-[50%] bg-opacity-80 px-6 overflow-y-scroll' style={{ height: "calc(100vh - 500px)" }}>
                  {currentTweet.tweet1 && (
                    <div className="relative">
                      {tweetLoading.tweet1 && <div className="loader absolute top-20 inset-0 m-auto" />}
                      <TwitterTweetEmbed
                        tweetId={"1826700000899871220"}
                        onLoad={() => handleTweetLoad('tweet1')}
                      />
                    </div>
                  )}
                  {currentTweet.tweet2 && (
                    <div className="relative">
                      {tweetLoading.tweet2 && <div className="loader absolute top-20 inset-0 m-auto" />}
                      <TwitterTweetEmbed
                        tweetId={"1829258160034435519"}
                        onLoad={() => handleTweetLoad('tweet2')}
                      />
                    </div>
                  )}
                  {currentTweet.tweet3 && (
                    <div className="relative">
                      {tweetLoading.tweet3 && <div className="loader absolute top-20 inset-0 m-auto" />}
                      <TwitterTweetEmbed
                        tweetId={"1828838042578092537"}
                        onLoad={() => handleTweetLoad('tweet3')}
                      />
                    </div>
                  )}
                  {currentTweet.tweet4 && (
                    <div className="relative">
                      {tweetLoading.tweet4 && <div className="loader absolute top-20 inset-0 m-auto" />}
                      <TwitterTweetEmbed
                        tweetId={"1834659316155969660"}
                        onLoad={() => handleTweetLoad('tweet4')}
                      />
                    </div>
                  )}
                </div>
                <div className='w-[50%] bg-opacity-80 overflow-y-scroll py-8 ml-2 mt-6' style={{ height: "calc(100vh - 400px)" }}>
                  <a href="https://x.com/intent/user?screen_name=spheraworld" target='_blank'>
                    <button onClick={follow_spoint_handler} className='action_button whitespace-nowrap text-[#fff] p-8 font-jura font-extrabold m-2 z-50'><FaXTwitter className='opacity-70' size={20} />FOLLOW US ON X <button className='Mini_btn text-[#7EFF00] text-[16px] font-bold text-center text-shadow font-jura'>+500sp</button></button>
                  </a>
                  <a href="https://www.spheramarket.io/" target='_blank'>
                    <button onClick={website_spoint_handler} className='action_button text-[#fff] font-jura font-extrabold m-2 z-50'> <Image src={Logo} width={30} height={30} alt="" /> VISIT WEBSITE <button className='Mini_btn text-[#7EFF00] text-[16px] font-bold text-center text-shadow font-jura '>+500sp</button></button>
                  </a>
                    <button onClick={T1_spoint_handler} className='action_button text-[#fff] font-jura font-extrabold m-2 z-50'><FaXTwitter className='opacity-70' size={20} />ENGAGE WITH SPHERA TWEET #1</button>
                    <button onClick={T2_spoint_handler} className='action_button text-[#fff] font-jura font-extrabold m-2 z-50'><FaXTwitter className='opacity-70' size={20} />ENGAGE WITH SPHERA TWEET #2</button>
                    <button onClick={T3_spoint_handler} className='action_button text-[#fff] font-jura font-extrabold m-2 z-50'><FaXTwitter className='opacity-70' size={20} />ENGAGE WITH SPHERA TWEET #3</button>
                    <button onClick={T4_spoint_handler} className='action_button text-[#fff] font-jura font-extrabold m-2 z-50'><FaXTwitter className='opacity-70' size={20} />ENGAGE WITH SPHERA TWEET #4</button>
                  {/* <a href="https://x.com/spheraworld/status/1829258160034435519" target='_blank'></a>
                  <a href="https://x.com/spheraworld/status/1826700000899871220" target='_blank'></a>
                  <a href="https://x.com/spheraworld/status/1828838042578092537" target='_blank'></a>
                  <a href="https://x.com/spheraworld/status/1834659316155969660" target='_blank'></a> */}
                </div>
              </div>

              <div className="airdrop_container main_center_bottom_bg">
                <p className="airdrop_text">
                  <span className="airdrop_title">AIRDROP COMING SOON</span>
                  Join the exciting Sphera Token Airdrop and become a part of the growing Sphera ecosystem! By participating, you’ll have the chance to receive free $SPHERA tokens directly into your wallet.
                </p>
                <img src="./Images/airDrop_gift.png" alt="Airdrop Gift" className="airdrop_image" />
              </div>
            </div>

            {/* Third Column - col-2 (1/6) */}
            <div className='col-span-3 main_rigth relative'>
              {/* main-right-top  */}
              <div className='main_right_top'>
                <p className='main_rigth_top_left font-jura'>QUESTS</p>
                <div className='flex items-center gap-1 main_rigth_top_right'>
                  <img src={Logo.src} height={"30px"} width={"30px"} alt="" />
                  <p className='text-[#8A8AAB] text-[8px]'>SPHERA ARENA <br />SEASON ONE</p>
                </div>
              </div>
              {/* main-right-action  */}
              <div className="main_rigth_middle">
                <p className="title">SPHERA ARENA <span><BsInfoCircle size={18} /></span></p>
                <p className="subtitle"> Complete tasks and earn Sphera points</p>
              </div>

              <div className='action_bg w-full flex flex-col justify-center items-center gap-2'>
                {/* first button */}
                {/* <div onClick={handleRetweet} className={`retweet-button ${buttonLoading.retweet || userHasRetweeted ? 'active' : 'inactive'}`} > */}
                <div onClick={handleRetweet} className={`retweet-button inactive`} >

                  {/* <FaRepeat size={14} color={buttonLoading.retweet || userHasRetweeted ? '#fff' : '#000'} /> */}
                  <FaRepeat size={14} color={buttonLoading.retweet || userHasRetweeted ? '#000' : '#000'} />

                  <p className={`action_btn_text font-bold font-jura  ${buttonLoading.retweet ? "text-[#000]" : "text-[#000]"}`}>
                    {/* {buttonLoading.retweet ? 'Loading...' : `REPOST TWEET  (${userHasRetweeted ? 'Done' : '+150SP'})`} */}
                    {`REPOST TWEET  (+150SP)`}

                  </p>
                </div>
                {/* second button  */}
                {/* <div onClick={handleLike} className={`retweet-button ${buttonLoading.like || userHasLiked ? 'active' : 'inactive'}`} > */}
                <div onClick={handleLike} className={`retweet-button inactive`} >

                  <FaRegHeart size={14} color={buttonLoading.like || userHasLiked ? '#000' : "#000"} className="font-bold" />
                  <p className={`action_btn_text font-bold font-jura  ${buttonLoading.like ? "text-[#000]" : "text-[#000]"}`}>
                {`LIKE OUR POST (+150SP)`}
                  </p>
                </div>
                {/* third button  */}
                {/* <div
                  onClick={handlePin}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`relative retweet-button  ${buttonLoading.pin || userHasPined ? 'border-gray-400 bg-[#5A5A5A] cursor-not-allowed' : 'bg-[#FF7F2A] cursor-pointer border-2 border-[#FCB78A]'}`}
                  style={{ opacity: buttonLoading.pin || userHasPined ? 0.5 : 1 }}
                > */}
                <div
                  onClick={handlePin}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`relative retweet-button inactive`}
                  // style={{ opacity: buttonLoading.pin || userHasPined ? 0.5 : 1 }}
                >
                  <BiLabel size={14} color={buttonLoading.pin || userHasPined ? '#000' : '#000'} style={{ transform: 'rotate(-90deg)' }} />
                  <p className={`action_btn_text font-bold font-jura ${buttonLoading.pin ? "text-[#000]" : "text-[#000]"}`}>
                    {`BOOKMARK TWEET  (+150SP)`}
                  </p>
                  {showTooltip && (
                    <div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 w-[250px] mt-1 md:w-[290px] bg-gray-800/60 backdrop-blur-sm text-white text-start text-sm p-4 border-2 border-[#FF7F2A] z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className='text-[14px] md:text-[15px] flex items-center'>
                        Only for Premium <FaXTwitter className='mx-1' /> Account
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className='main_rigth_bottom '>
                <button className="quest_active_button">CORE QUESTS</button>
                <button className="quest_inActive_button"> SPECIAL QUESTS <img src="./Images/lock.png" alt="" className='w-4 ml-4' /></button>
                <button className="quest_inActive_button"> SPECIAL QUESTS <img src="./Images/lock.png" alt="" className='w-4 ml-4' /></button>
                <button className="quest_inActive_button"> SPECIAL QUESTS <img src="./Images/lock.png" alt="" className='w-4 ml-4' /></button>
              </div>
            </div>
          </div>

          {/* absolute data  */}
          <img src="./Images/girl_avatar.png" alt="" className="avatar-image" />
          <p className='w-full text-center absolute bottom-1 text-[#fff] text-[12px] opacity-70 font-jura '>SPHERA WORLD 2024 ALL RIGHTS RESERVED ©</p>
          <p className='w-full text-center absolute bottom-12 left-[170px] text-[#fff] text-[12px] opacity-70 font-jura'>CONNECTED</p>

        </div>
      </div>





      {/* Mobile code  */}
      <div className='Iphone'>
        <Navbar screenName={screenName} />
        <div>
          <div>
          </div>
          <div className=' relative portal' style={{ zIndex: 10 }}>

            <div className='w-[90%]  flex justify-between items-center m-auto max-w'>
              <div className='flex justify-between items-center w-36 text-[#fff] text-[14px] font-light'>{dateTime.date}</div>
              <p className={`w-full text-[#fff] text-[22px] font-bold text-center font-jura rounded-2xl `}
                style={{ textShadow: '0px 0px 20px #FF7F2A' }}>
                SPHERA ARENA<br></br> SEASON 1
              </p>
              <div className='flex justify-between items-center w-36 text-[#fff] text-[14px] font-light'>{dateTime.time}</div>
            </div>
            <div className='subtract1_bg relative' style={{ zIndex: 10 }}>
              <div className='subtract_bg port'>
                <div className="translationButtons">
                <button className={`${activeBtn.eng && !activeBtn.arb ? "activeTranslate" : ""}`} onClick={ToggleEn} >ENG</button>
                  <span>|</span>
                  <button className={`${!activeBtn.eng && activeBtn.arb ? "activeTranslate" : ""}`} onClick={ToggleArb}>AR</button>
                </div>
                <Image src="/Images/spher.png" alt="sphera" height={52} width={52} className='z-20 spher' />

              </div>
              <h2 className='text-[#fff] text-[16px] font-bold text-center font-jura mt-6 '>ENGAGE WITH SPHERA WORLD TO EARN sPOINTS AND SECURE YOUR AIRDROP ALLOCATION</h2>
              <Image src="/Images/btns.png" alt="Quests" height={360} width={360} className='z-20 quest' />

            </div>
            <div className='core_cost pt-10 pb-10'>
              <Image src="/Images/core.png" alt="core" height={45} width={360} className='z-20 core m-auto' />
              <div className='core2 p-3'>

                <div className='absolute right-4 core2_btn'>
                  <p className='font-jura text-[#fff]'>sPoint Rewards</p>
                  <div className='main_left_top_sp_bg w-[170px] h-[48px] flex items-center justify-center'>
                    <div className='w-full text-[#7EFF00] text-[30px] font-bold text-center text-shadow font-jura'>
                      <p>+{totalPoints} sP</p>
                    </div>
                  </div>
                </div>
                <div className='text-center flex text-[#ffffffa6] text-[10px] w-[120px] ml-7 mt-2'>
                  <Image src="/Images/spher1.png" alt="grey sphere" height={29} width={29} className='z-20 sph m-auto' />
                  QUEST ACTIVITY
                </div>
                <div className='subt pt-3'>
                  <div className='multi'>
                    <h3 className='text-[#ffffff] uppercase text-[16px] absolute bottom-2 right-7'>{formatTime(timeLeft)}</h3>
                    <Image src="/Images/info.png" alt="info" height={20} width={20} className='z-20 absolute right-7 top-0' />
                  </div>

                  <Image src="/Images/subt_text.png" alt="grey subt" height={65} width={160} className='z-20 ml-5  mt-6 mb-4' />
                  <h2 className=' text-left flex text-[#ffffff] uppercase text-[16px] font-bold pr-3 pl-7 font-jura'>earn rewards by engaging in challenges, supporting the community, and completing quests!</h2>
                  <Image src="/Images/learn.png" alt="learn" height={45} width={180} className='z-20  m-auto' />
                  <h4 className='connect rotate-270 absolute  right-0 text-[#ffffff]  text-[18px]'>CONNECTED <Image src="/Images/connect.png" alt="grey subt" height={22} width={22} className='z-20' /></h4>
                  {/* <h4 className='connect add rotate-270 absolute  right-0 text-[#ffffff]  text-[16px]'>0X....720V<br></br>//   @ITSJESSEBTC</h4> */}
                </div>
              </div>
              <div className='core_quest_detail'>
                <Image src="/Images/core.png" alt="core" height={29} width={235} className='z-20 core m-auto mt-3' />
                <h4 className='text-center text-[14px] uppercase text-[#ffffff] font-bold font-jura leading-5'>Complete tasks and earn<br></br> Sphera points</h4>
                <div className='text-center flex text-[#ffffffa6] text-[10px] w-[120px] m-[10px] mt-2'>
                  <Image src="/Images/spher1.png" alt="grey sphere" height={25} width={25} className='z-20 sph m-auto' />
                  QUEST ACTIVITY
                </div>
                <div className='reward'>
                  <div className='relative ml-[9px] top-auto mt-[-3px] right-4 core2_btn'>
                    <p className=' items-center font-jura text-[#fff] flex gap-1'>sPoint Rewards <Image src="/Images/info2.png" alt="info" height={14} width={14} className='z-20 ' /></p>
                    <div className='main_left_top_sp_bg w-[170px] h-[48px] flex items-center justify-center'>
                      <div className='w-full text-[#7EFF00] text-[30px] font-bold text-center text-shadow font-jura'>
                        <p>+{totalPoints} sP</p>
                      </div>
                    </div>
                  </div>
                  <div className='multi with_box'>
                    <h3 className='text-[#ffffff] uppercase text-[16px] absolute bottom-2 left-[16px]'>{formatTime(timeLeft)}</h3>
                  </div>
                </div>

                <a href="https://x.com/intent/user?screen_name=spheraworld" target='_blank'>
                  {/* <button  className='action_button whitespace-nowrap text-[#fff] p-8 font-jura font-extrabold m-2 z-50'><FaXTwitter className='opacity-70' size={20} />FOLLOW US ON X <button className='Mini_btn text-[#7EFF00] text-[16px] font-bold text-center text-shadow font-jura'>+500sp</button></button> */}
                  <div className='twitt_box' onClick={follow_spoint_handler}>
                    <p className='grn_txt'>+ 100 sP</p>
                    <h2 className=' absolute top-[93px] left-0 right-0 m-auto'>
                      <Image src="/Images/twitter2.png" alt="core" height={31} width={168} className='z-20 core m-auto mt-3' />
                    </h2>
                  </div>
                </a>


                <div className='twitt_post p-[14px]'>
                  <TwitterTweetEmbed tweetId={'1826700000899871220'} />
                </div>


                <div className=' mt-2'>
                  <div onClick={handleRetweet} className={` m-auto w-[97%] whitespace-nowrap transition-transform duration-300 hover:scale-105 shadow-[0px_0px_5.6px_#FF7F2A,0px_0px_13.3px_#FFF_inset] rounded border-[3px] border-[#FCB78A] flex justify-center items-center gap-1 p-1 md:p-2 mt-0 ${buttonLoading.retweet || userHasRetweeted ? 'border-gray-400 bg-[#5A5A5A] cursor-not-allowed ' : 'bg-[#FF7F2A] cursor-pointer border-2 border-[#FCB78A]'}`} style={{ opacity: buttonLoading.retweet || userHasRetweeted ? 0.5 : 1 }}>
                    <FaRepeat size={16} color={buttonLoading.retweet || userHasRetweeted ? '#fff' : '#000'} />
                    <p className={`text-[12px] md:text-[12px] font-bold font-jura  ${buttonLoading.retweet ? "text-[#fff]" : "text-[#000]"}`}>
                      {buttonLoading.retweet ? 'Loading...' : `REPOST TWEET  (${userHasRetweeted ? 'Done' : '+150SP'})`}
                    </p>
                  </div>
                  <div onClick={handleLike} className={` m-auto w-[97%] whitespace-nowrap transition-transform duration-300 hover:scale-105 shadow-[0px_0px_5.6px_#FF7F2A,0px_0px_13.3px_#FFF_inset] rounded border-[3px] border-[#FCB78A] flex justify-center items-center gap-1 p-1 md:p-2 mt-2 ${buttonLoading.like || userHasLiked ? 'border-gray-400 bg-[#5A5A5A] cursor-not-allowed' : 'bg-[#FF7F2A] cursor-pointer border-2 border-[#FCB78A]'}`} style={{ opacity: buttonLoading.like || userHasLiked ? 0.5 : 1 }}>
                    <FaRegHeart size={16} color={buttonLoading.like || userHasLiked ? '#fff' : "#000"} className="font-bold" />
                    <p className={`text-[12px] md:text-[12px] font-bold font-jura  ${buttonLoading.like ? "text-[#fff]" : "text-[#000]"}`}>
                      {buttonLoading.like ? 'Loading...' : `LIKE OUR POST (${userHasLiked ? 'Done' : '+150SP'})`}
                    </p>
                  </div>
                  <div
                    onClick={handlePin}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className={`m-auto relative w-[97%] whitespace-nowrap shadow-[0px_0px_5.6px_#FF7F2A,0px_0px_13.3px_#FFF_inset] transition-transform duration-300 hover:scale-105 rounded border-[3px] border-[#FCB78A] flex justify-center items-center gap-1 p-1 md:p-2 mt-2 ${buttonLoading.pin || userHasPined ? 'border-gray-400 bg-[#5A5A5A] cursor-not-allowed' : 'bg-[#FF7F2A] cursor-pointer border-2 border-[#FCB78A]'}`}
                    style={{ opacity: buttonLoading.pin || userHasPined ? 0.5 : 1 }}
                  >
                    <BiLabel size={16} color={buttonLoading.pin || userHasPined ? '#fff' : '#000'} style={{ transform: 'rotate(-90deg)' }} />
                    <p className={`text-[12px] md:text-[12px] font-bold font-jura ${buttonLoading.pin ? "text-[#fff]" : "text-[#000]"}`}>
                      {buttonLoading.pin ? 'Loading...' : `BOOKMARK TWEET  (${userHasPined ? 'Done' : '+150SP'})`}
                    </p>
                    {showTooltip && (
                      <div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 w-[250px] mt-1 md:w-[290px] bg-gray-800/60 backdrop-blur-sm text-white text-start text-sm p-4 border-2 border-[#FF7F2A] z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className='text-[14px] md:text-[15px] flex items-center'>
                          Only for Premium <FaXTwitter className='mx-1' /> Account
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Image src="/Images/sp_white.png" alt="core" height={81} width={78} className='z-20 core m-auto absolute bottom-[59px] right-0 left-0' />

              </div>
            </div>

            <div className='email_section pt-6'>
              <div className='market_box'>
                <p className=' text-center text-[30px] text-[#7EFF00] absolute top-4 left-0 right-0 m-auto '>+5,000sp</p>
                <h2 className='text-center text-[22px] text-[#ffffff] font-bold'>SPHERA MARKET</h2>
                <h2 className='text-center text-[16px] text-[#ffffff]'>SIGN-UP TO THE BETA WAITLIST</h2>
                <div className='w-full flex flex-col justify-center items-center gap-4'>
                  <input type="email" placeholder="ENTER EMAIL" className="email_input h-[33px]" onChange={(e) => setEmail(e.target.value)} />
                  <button className="signup_button py-2" onClick={emailPoints}>ENTER</button>
                </div>
              </div>

              <div className='airdop pt-6'>
                <h2 className='text-center text-[36px] text-[#ffffff] font-bold'>AIRDROP</h2>
                <Image src="/Images/airdop.png" alt="airdop" height={400} width={318} className='z-20  m-auto airdp' />
                <a className=' absolute right-3 bottom-1' href=""><Image src="/Images/arr.png" alt="airdop" height={82} width={82} className='z-20  m-auto' /></a>
              </div>
            </div>
            <div className=' relative w-[368px] pt-8 m-auto mt-9'>
              <h4 className='live rotate-270 absolute  right-0 text-[#ffffff]  text-[18px]'>LIVE <Image src="/Images/connect.png" alt="grey subt" height={22} width={22} className='z-20' /></h4>
              <h2 className='text-center text-[18px] text-[#ffffff] font-bold'>CORE QUESTS</h2>
              <Image src="/Images/core_quest.png" alt="airdop" height={370} width={360} className='z-20  m-auto airdp' />
              <a className=' absolute right-[18px] top-[32px]' href=""><Image src="/Images/arr.png" alt="airdop" height={54} width={54} className='z-20  m-auto' /></a>
            </div>

            <div className='term_box'>
              <h2 className='text-center text-[22px] text-[#ffffff] font-bold font-jura'>$SPHERA AIRDROP<br></br> WARNING</h2>
              <p className='text-center text-[14px] text-[#ffffff] font-bold font-jura'>Cheaters and bot users who artificially boost their sPoints will be automatically blacklisted and excluded from the $SPHERA airdrop.</p>
              <h3 className='text-center text-[14px] text-[#ffffff] font-bold font-jura mt-[18px]'>TERMS & <br></br>CONDITIONS</h3>
              <Image src="/Images/warning.png" alt="airdop" height={47} width={47} className='z-20  m-auto warn mt-4' />
            </div>
            <div className='termandconditions text-center text-[14px] text-[#ffffff] font-bold font-jura mt-[18px] pb-4'>
              SPHERA WORLD 2024 ALL RIGHTS RESERVED ©
            </div>




          </div>
        </div>


      </div>

    </>
  );
}

export default Portal;
