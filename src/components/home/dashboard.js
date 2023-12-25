import React, { useState, useRef, useEffect } from "react";
import Header from "../template/header";
import Sidebar from "../template/sidebar";
import { useNavigate } from 'react-router-dom';
import { Link  } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';
import { useAuth } from "../../store/auth/authStore";
import { OnTopTrxByUser, OnTopTrxByUserPagination, OnTopTotalTrxByUser } from "../../services/datas/transactionsService";
import { LOGIN_FAILED, LOGIN_STATUS  } from "../../store/storeTypes";
import LoadingScreen from '../others/LoadingScreen';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale);

const Dashboard = () => {

    const { state,dispatch } = useAuth();
    const navigate = useNavigate();

    const [content, setContent] = useState([]);
    const [paramLimit, setParamLimit] = useState(3);
    const [paramOffset, setParamOffset] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [paramUsername, setParamUsername] = useState('');
    const [paramAmountFilter, setParamAmountFilter] = useState('desc');
    // const [totalData, setTotalData] = useState(0);
    const [loadPagination, setLoadPagination] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchData, setSearchData] = useState('');
    const [msgToast, setMsgToast] = useState(false);
    const [dataToast, setDataToast] = useState({msg:'',topMsg:'',coloor:''});

    const [isUnauthorized, setIsUnauthorized] = useState(true);
    const [labelsPieChart, setLablesPieChart] = useState([]);
    const [amountsPieChart, setAmountsPieChart] = useState([]);
    const [colorPieChart, setColorPieChart] = useState([]);

    const [labelsDoughnutChart, setLabelsDoughnutChart] = useState([]);
    const [amountsDoughnutChart, setAmountsDoughnutChart] = useState([]);
    const [colorDoughnutChart, setColorDoughnutChart] = useState([]);

    const getQueryParams = () =>{
        let queryParams = {
            username: paramUsername,
            amount_filter: paramAmountFilter,
            limit: paramLimit,
            offset: paramOffset
        }
        let queryParamString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
        return queryParamString
    }

    const getDataPagination = () => {
        setLoading(true);
        OnTopTrxByUserPagination({token: state.loginData?.token,queryParams: getQueryParams()})
          .then(
            (response) => {
              if(response?.status === 200 && typeof(response.data) !== "undefined"){
                setContent(loaderData(response.data))
                if(response.data.length !== 0){
                    setTotalPage(Math.ceil(parseInt(response.data[0].total) / paramLimit))
                    loadPaging(Math.ceil(parseInt(response.data[0].total) / paramLimit))
                }else{
                    setTotalPage(0)
                    loadPaging(0)
                }

                // setCurrentPageData(response.data.data
                //   .slice(itemOffset, itemOffset + postsPerPage)
                //   .map(({ thumburl,i }) => <p key={i}>{thumburl}</p>))
              }
              else if(response?.response?.status === 401){
                isTokenExpired(response)
              }
              setLoading(false);
            },
            (error) => {
              const _content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              setContent(_content);
            }
          );
    }

    useEffect(() => {
        if(state.loginStatus){
            getDataPagination()
            getDataPieChart()
            getDataDoughnutChart()
        }
    }, []);

    useEffect(() => {
        if(state.loginStatus){
            getDataPagination()
        }
    }, [page,paramOffset,paramAmountFilter]);

    const loaderData = (loopData) =>{
        const listData = [];
            loopData?.map((row, indexRow) => {
                listData.push(
                    <tr key={indexRow}>
                        <th scope="row">{indexRow+1}</th>
                        <td>{row?.username}</td>
                        <td>{parseInt(row?.amount)}</td>
                    </tr>
                );
            })
        return listData;
    }

    const loadPaging = (total) =>{
        const pagingData = [];
        if(total !== 0){
            for(let i =0;i<total;i++){
                pagingData.push(
                    <li key={i} style={{cursor:"pointer"}} className="page-item" onClick={() => onModifiedPage('number',i+1)}><div className="page-link" href="#">{i+1}</div></li>
                );
            }
        }
        setLoadPagination(pagingData)
    }

    const onModifiedPage = (info,pages) =>{
        if(info === "prev" && pages === 0 && page > 0){
            setPage(page-1)
            setParamOffset((page-1)*paramLimit)
        }
        if(info === "next" && pages === 0 && page < totalPage-1){
            setPage(page+1)
            setParamOffset((page+1)*paramLimit)
        }
        if(info === "number" && pages !== 0){
            setPage(pages)
            setParamOffset((pages-1)*paramLimit)
            
        }
    }

    const onSearchData = (e) => {
        setParamUsername(e.target.value);
    }

    const submitSearch = () => {
        getDataPagination()
    }

    const onAmountFilter = (e) => {
        setParamAmountFilter(e.target.value)
    }

    const getDataPieChart = () =>{
        setLoading(true);
        OnTopTrxByUser({token: state.loginData?.token})
            .then(
            (response) => {
                if(response?.status === 200 && typeof(response.data) !== "undefined"){
                    setIsUnauthorized(false)
                    let tmpLabels = response.data.map((a)=>{
                        return a.username
                    })
                    let tmpAmounts = response.data.map((a)=>{
                        return parseInt(a.amount)
                    })
                    let tmpBColors = []
                    for(let i =0;i<tmpLabels.length;i++){
                        let rndomColor1 = Math.floor(Math.random()*255)
                        let rndomColor2 = Math.floor(Math.random()*255)
                        let rndomColor3 = Math.floor(Math.random()*255)
                        tmpBColors.push(`rgba(${rndomColor1}, ${rndomColor2}, ${rndomColor3}, 0.2)`)
                    }
                    setLablesPieChart(tmpLabels)
                    setAmountsPieChart(tmpAmounts)
                    setColorPieChart(tmpBColors)
                    pieData()
                }
                else if(response?.response?.status === 401){
                    isTokenExpired(response)
                }
                setLoading(false);
            },
            (error) => {
                const _content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
                setContent(_content);
            }
        );
        
    }

    const pieData = () => {
        let piee = {
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: labelsPieChart,
            datasets: [
            {
                label: '# amounts',
                data: amountsPieChart,
                // backgroundColor: [
                // 'rgba(255, 99, 132, 0.2)',
                // 'rgba(54, 162, 235, 0.2)',
                // 'rgba(255, 206, 86, 0.2)',
                // 'rgba(75, 192, 192, 0.2)',
                // 'rgba(153, 102, 255, 0.2)',
                // 'rgba(255, 159, 64, 0.2)',
                // ],
                // borderColor: [
                // 'rgba(255, 99, 132, 1)',
                // 'rgba(54, 162, 235, 1)',
                // 'rgba(255, 206, 86, 1)',
                // 'rgba(75, 192, 192, 1)',
                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)',
                // ],
                backgroundColor: colorPieChart,
                borderColor: colorPieChart,
                borderWidth: 1,
            },
            ],
        }
        return piee
    };

    const getDataDoughnutChart = () =>{
        setLoading(true);
        OnTopTotalTrxByUser({token: state.loginData?.token})
            .then(
            (response) => {
                if(response?.status === 200 && typeof(response.data) !== "undefined"){
                    let tmpLabels = response.data?.map((a)=>{
                        return a.username
                    })
                    let tmpAmounts = response.data?.map((a)=>{
                        return parseInt(a.transacted_value)
                    })
                    let tmpBColors = []
                    for(let i =0;i<tmpLabels.length;i++){
                        let rndomColor1 = Math.floor(Math.random()*255)
                        let rndomColor2 = Math.floor(Math.random()*255)
                        let rndomColor3 = Math.floor(Math.random()*255)
                        tmpBColors.push(`rgba(${rndomColor1}, ${rndomColor2}, ${rndomColor3}, 0.2)`)
                    }
                    setLabelsDoughnutChart(tmpLabels)
                    setAmountsDoughnutChart(tmpAmounts)
                    setColorDoughnutChart(tmpBColors)
                    doughnutData()
                }
                else if(response?.response?.status === 401){
                    isTokenExpired(response)
                }
                setLoading(false);
            },
            (error) => {
                const _content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
                setContent(_content);
            }
        );
        
    }

    const doughnutData = () => {
        let pData = {
            labels: labelsDoughnutChart,
            datasets: [
            {
                label: '# transacted value',
                data: amountsDoughnutChart,
                // backgroundColor: [
                // 'rgba(255, 99, 132, 0.2)',
                // 'rgba(54, 162, 235, 0.2)',
                // 'rgba(255, 206, 86, 0.2)',
                // 'rgba(75, 192, 192, 0.2)',
                // 'rgba(153, 102, 255, 0.2)',
                // 'rgba(255, 159, 64, 0.2)',
                // ],
                // borderColor: [
                // 'rgba(255, 99, 132, 1)',
                // 'rgba(54, 162, 235, 1)',
                // 'rgba(255, 206, 86, 1)',
                // 'rgba(75, 192, 192, 1)',
                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)',
                // ],
                backgroundColor: colorDoughnutChart,
                borderColor: colorDoughnutChart,
                borderWidth: 1,
            },
            ],
        }
        return pData
    }

    var styles =  {
        searchData: {alignItems:'end', height: '100%'}
    };

    const isTokenExpired = async (response) => {
        setIsUnauthorized(true)
        await dispatch({ type: LOGIN_FAILED, payload: {loginData: ''}});
        await dispatch({ type: LOGIN_STATUS, payload: {loginStatus: `false`}});
        setDataToast({msg:`${response.message}`,topMsg:`${response.code}`,coloor:'red'})
        setMsgToast(true)
        navigate("/login");
    }

    return(
        <div>
            <Header />
            <Sidebar />
            {
                loading ? <div className="d-flex mt-5" style={{justifyContent:"center"}}> <LoadingScreen /> </div> : 
                <main id="main" className="main">

                    <div className="pagetitle">
                    <h1>Dashboard</h1>
                    <nav>
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to={"/"}>Home</Link></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                        </ol>
                    </nav>
                    </div>

                    <section className="section dashboard">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card info-card">
                                    <div className="row">
                                        <div className="col-md-3 mx-2">
                                                <label className="form-label mx-2">Amount</label>
                                                <select value={paramAmountFilter} onChange={onAmountFilter} className="form-select">
                                                    <option value="asc">ASC</option>
                                                    <option value="desc">DESC</option>
                                                </select>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="row" style={styles.searchData}>
                                                <div className="search-bar">
                                                    <div className="search-form d-flex align-items-bottom">
                                                        {/* <input type="text" name="query" placeholder="Search" title="Enter search username"></input> */}
                                                        <input type="text" className="form-control" value={paramUsername} onChange={onSearchData} placeholder="Search" title="Enter search username"></input>
                                                        <button type="button" onClick={submitSearch} title="Search" style={{marginLeft:10}}><i className="bi bi-search"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="solid"></hr>
                                    <div className="row mt-2">
                                        <div className="col-md-12">
                                            <table className="table">
                                                <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Username</th>
                                                    <th scope="col">Amount</th>
                                                </tr>
                                                </thead>
                                                <tbody> 
                                                    {content}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 d-flex justify-content-center">
                                            <nav aria-label="Page navigation example">
                                                <ul className="pagination">
                                                    <li className="page-item" style={{cursor:"pointer"}} onClick={() => onModifiedPage('prev',0)}>
                                                        <div className="page-link" aria-label="Previous">
                                                        <span aria-hidden="true">&laquo;</span>
                                                        </div>
                                                    </li>
                                                    {loadPagination}
                                                    <li className="page-item" style={{cursor:"pointer"}} onClick={() => onModifiedPage('next',0)}>
                                                        <div className="page-link" aria-label="Next">
                                                        <span aria-hidden="true">&raquo;</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6">
                                <div className="card">
                                    <div className="card-body">
                                    <h5 className="card-title">Top Transcations Per User</h5>
                                    {!isUnauthorized ? <Pie data={pieData()} /> : ''}
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="card">
                                    <div className="card-body">
                                    <h5 className="card-title">Top Transactions By Total Value</h5>
                                    {!isUnauthorized ? <Doughnut data={doughnutData()} /> : ''}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>

                </main>
            }
        </div>
    )
}

export default Dashboard;