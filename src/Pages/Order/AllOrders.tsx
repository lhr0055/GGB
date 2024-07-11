import React, { useEffect, useState } from "react";
import { withAdminAuth } from "../../HOC";
import { useGetAllOrdersQuery } from "../../Apis/orderApi";
import OrderList from "../../Components/Page/Order/OrderList";
import { MainLoader } from "../../Components/Page/Common";
import { inputHelper } from "../../Helper";
import { SD_Status } from "../../Utility/SD";

const filterOptions = [
  "All",
  SD_Status.CONFIRMED,
  SD_Status.PREPARING,
  SD_Status.SHIPPING,
  SD_Status.CANCELLED,
];


function AllOrders(){
    const [filters, setFilters] = useState({searchString: "", status: ""});
    const [orderData, setOrderData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageOptions, setPageOptions] = useState({
      pageNumber: 1,
      pageSize: 5,
    });


    const [currentPageSize, setCurrentPageSize] = useState(pageOptions.pageSize);
    const [apiFilters, setApiFilters] = useState({
      searchString: "",
      status: "",
    });

    const{data, isLoading} = useGetAllOrdersQuery({
      ...(apiFilters && {
        searchString: apiFilters.searchString,
        status: apiFilters.status,
        pageNumber: pageOptions.pageNumber,
        pageSize: pageOptions.pageSize,
      }),
    });

    // console.log(isLoading);
    // console.log(data);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> //입력 또는 필터 선택 
    ) => {
      const tempValue = inputHelper(e, filters);
      setFilters(tempValue);
    };


    const handleFilters = () => {
      setApiFilters({
        searchString: filters.searchString,
        status: filters.status,
      });
    };
      

    useEffect(() => {
      if (data) {
        setOrderData(data.apiResponse.result);
        // console.log(data);
        // const { TotalRecords } = JSON.parse(data.totalRecords);
        const { TotalRecords } = data.totalRecords ? JSON.parse(data.totalRecords) : { TotalRecords: 0 };
        setTotalRecords(TotalRecords);
      }
    }, [data]);
    
    const getPageDetails = () =>{
      const dataStartNumber = 
       (pageOptions.pageNumber -1) * pageOptions.pageSize + 1;
      const dataEndNumber = pageOptions.pageNumber * pageOptions.pageSize;

      return `${dataStartNumber}
             - 
            ${
              dataEndNumber < totalRecords ? dataEndNumber : totalRecords
            } of ${totalRecords}`;
    };


    const handlePageOptionChange = (direction: string, pageSize?: number) => {
      if (direction === "prev") {
        setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber - 1 });
      } else if (direction === "next") {
        setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber + 1 });
      } else if (direction === "change") {
        setPageOptions({
          pageSize: pageSize ? pageSize : 5,
          pageNumber: 1,
        });
      }
    };


    return( //Allorders UI
    <>
      {/* 로딩중일떄는 로딩중  */}
      {isLoading && <MainLoader/>} 
      {/* 로딩중이 아닐 떄는 데이터 표시하기 */}
      {!isLoading && (  
      <> 
        <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
          <h1 className="text-dark BookkMyungjo-Bd">주문내역</h1>
          
          <div className="d-flex" style={{width: "40%"}}>
            <input
              type="text"
              className="form-control mx-2"
              placeholder="이름, 이메일, 번호 검색"
              name="SearchString"
              onChange={handleChange}
            />
            <select 
              className="form-select w-50 mx-2" 
              onChange={handleChange}
              name="status"
            >
              {filterOptions.map((item, index)=> (
                <option key = {index} value={item === "All" ? "" : item}> 
                  {item} 
                </option>
              ))}
            </select>
            <button
              className="btn btn-warning"
              onClick={handleFilters}>
                Filter
            </button>
          </div>
        </div>
        
        <OrderList isLoading={isLoading} orderData={orderData} />
        <div className="d-flex mx-5 justify-content-end align-items-center">
          <div>항목 수: </div>
          <div>
            <select 
              className="form-select mx-2"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { 
                handlePageOptionChange("change", Number(e.target.value));
                setCurrentPageSize(Number(e.target.value));
              }}  
              style={{width: "70px"}}
              value={currentPageSize}
            >
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
            </select>
          </div>

          <div className="mx-2"> {getPageDetails()} </div>
            <button //이전 페이지 버튼
              onClick={() => handlePageOptionChange("prev")}
              disabled={pageOptions.pageNumber === 1}
              className="btn btn-outline-primary px-3 mx-2">
                <i className="bi bi-chevron-left"></i>
            </button>
            <button //다음 페이지 버튼 
              onClick={() => handlePageOptionChange("next")}
              disabled={pageOptions.pageNumber * pageOptions.pageSize >= totalRecords}
              className="btn btn-outline-primary px-3 mx-2">
                <i className="bi bi-chevron-right"></i>
            </button>
          </div>
      </>
      )}
    </>
    );
  }

export default withAdminAuth(AllOrders);