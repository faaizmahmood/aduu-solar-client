/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import NProgress from "nprogress";
import { setProject } from "../../../redux/orderServiceSlice";
import Cookies from "js-cookie";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useOrderService = () => {



    return {

    };
};

export default useOrderService;
