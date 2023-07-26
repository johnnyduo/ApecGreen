import React, { useEffect } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Link, useNavigate } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";

import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/apec_green_logo.png";
import SvgImage from "@/assets/images/svg/apec_green_trade3.svg";
import { useDispatch } from "react-redux";
import { handleLogin } from "../auth/common/store";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi";

const ComingSoonPage = () => {
  const { isConnected } = useAccount()
  const [isDark] = useDarkMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      dispatch(handleLogin(true));
      setTimeout(() => navigate("/form-export"), 500)
    }
  }, [isConnected])

  return (
    <div className="min-h-screen">
      <div className="xl:absolute left-0 top-0 w-full">
        <div className="flex flex-wrap justify-between items-center py-6 container">
          <div>
            <Link to="/">
              <img src={isDark ? LogoWhite : Logo} alt="" width="132"/>
            </Link>
          </div>
          <div>
            <ConnectButton label="Try App" />
          </div>
          {/* <div>
            <Button text="Try App" className=" btn-dark btn-lg" onClick={() => {
              dispatch(handleLogin(true));
              navigate("/dashboard")
            }} />
          </div> */}
        </div>
      </div>
      <div className="container">
        <div className="flex justify-between flex-wrap items-center min-h-screen">
          <div className="max-w-[500px] space-y-4">
            <div className="relative flex space-x-3 items-center text-2xl text-slate-900 dark:text-white">
              <span className="inline-block w-[25px] bg-secondary-500 h-[1px]"></span>
              <span>APEC Green</span>
            </div>
            <div className="xl:text-[3.5em] xl:leading-[70px] xs:text-[2em] sm:text-[2.5em] text-4xl font-semibold text-slate-900 dark:text-white">
              Sustainable Trade Credit Insurance 
            </div>
            <p className="font-normal text-slate-600 dark:text-slate-300 max-w-[500px]">
              Empowering Sustainable Trade with APEC Green by Unlocking Opportunities & Ensuring Protection. 
            </p>
            <div className="bg-white flex items-center px-3 rounded">
              <input
                type="text"
                placeholder="Enter your email"
                className="flex-1 bg-transparent h-full block w-full py-6 placeholder:text-secondary-500 text-base focus:outline-none focus:ring-0"
              />
              <div className="flex-none">
                <button type="button" className="btn btn-dark btn-sm px-6">
                  Notify me
                </button>
              </div>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              *Get more information about APEC international trade
            </div>
          </div>
          <div>
            <img src={SvgImage} alt="" width="600"/>
          </div>
        </div>
      </div>
      <div className="xl:fixed bottom-0 w-full">
        <div className="container">
          <div className="md:flex justify-between items-center flex-wrap space-y-4 py-6">
            <div>
              <ul className="flex md:justify-start justify-center space-x-3">
                <li>
                  <a href="#" className="social-link">
                    <Icon icon="icomoon-free:facebook" />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <Icon icon="icomoon-free:twitter" />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <Icon icon="icomoon-free:linkedin2" />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link">
                    <Icon icon="icomoon-free:google" />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul className="flex md:justify-start justify-center space-x-3">
                <li>
                  <a
                    href="#"
                    className="text-slate-500 dark:text-slate-400 text-sm transition duration-150 hover:text-slate-900"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 dark:text-slate-400 text-sm transition duration-150 hover:text-slate-900"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
